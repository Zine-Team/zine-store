export default async function (eleventyConfig) {
  eleventyConfig.setDataDeepMerge(true);
  eleventyConfig.addLayoutAlias("default", "layouts/default.njk");
  eleventyConfig.addLayoutAlias("zine", "layouts/zine.njk");
  eleventyConfig.addPassthroughCopy("images");
}

export const config = {
  markdownTemplateEngine: "njk",
};
