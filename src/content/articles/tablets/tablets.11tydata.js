export default {
  layout: "layouts/article.njk",
  tags: ["articles"],
  category: "tablets",
  eleventyComputed: {
    permalink: data => {
      const slug = String(data.slug || data.page.fileSlug || "").trim();
      return slug ? `/tablets/${slug}.html` : false;
    },
    publishedAt: data => data.date || data.page.date
  }
};
