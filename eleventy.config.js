export default async function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addLayoutAlias("default", "layouts/default.njk");
  eleventyConfig.addLayoutAlias("zine", "layouts/zine.njk");
  eleventyConfig.addPassthroughCopy("images");

  eleventyConfig.addFilter("slice", (array, number) => {
    return array.slice(0, number);
  });
}

export const config = {
  markdownTemplateEngine: "njk",
};
