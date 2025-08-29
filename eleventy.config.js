import format from "date-fns/format";
import htmlmin from "html-minifier";

export default async function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addLayoutAlias("default", "layouts/default.njk");
  eleventyConfig.addLayoutAlias("zine", "layouts/zine.njk");
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addFilter("slice", (array, number) => {
    return array.slice(0, number);
  });

  eleventyConfig.addFilter("date", function (date, dateFormat) {
    return format(date, dateFormat);
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
