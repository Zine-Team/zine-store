import format from "date-fns/format";
import htmlmin from "html-minifier";
import markdownIt from "markdown-it";
const md = markdownIt();

export default async function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addLayoutAlias("page", "layouts/page.njk");
  eleventyConfig.addLayoutAlias("zine", "layouts/zine.njk");
  eleventyConfig.addLayoutAlias("base", "layouts/base.njk");
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addFilter("slice", (array, number) => {
    return array.slice(0, number);
  });

  eleventyConfig.addFilter("unquote", (string) => {
    return string.slice(0, -1).substring(1);
  });

  eleventyConfig.addFilter("date", function (date, dateFormat) {
    return format(date, dateFormat);
  });

  eleventyConfig.addFilter("markdownify", function (content) {
    return md.render(content);
  });

  eleventyConfig.addTransform("htmlmin", (content, outputPath) => {
    if (outputPath.endsWith(".html")) {
      return htmlmin.minify(content, {
        collapseWhitespace: true,
        removeComments: true,
        useShortDoctype: true,
      });
    }

    return content;
  });
}

export const config = {
  markdownTemplateEngine: "njk",
};
