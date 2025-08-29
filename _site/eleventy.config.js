import dateFilter from "nunjucks-date-filter";

export default async function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addLayoutAlias("default", "layouts/default.njk");
  eleventyConfig.addLayoutAlias("zine", "layouts/zine.njk");
  eleventyConfig.addPassthroughCopy("images");
  eleventyConfig.addTemplateFormats("js");

  eleventyConfig.addFilter("slice", (array, number) => {
    return array.slice(0, number);
  });

  eleventyConfig.addFilter("date", (input) => {
    return dateFilter(input);
  });

  dateFilter.setDefaultFormat("MM/DD/YYYY");
}

export const config = {
  markdownTemplateEngine: "njk",
};
