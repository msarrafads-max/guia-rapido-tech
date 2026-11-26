export default {
  eleventyComputed: {
    seo_title: data => (data.categories && data.categories.tablets && data.categories.tablets.seo_title) || (data.categories && data.categories.tablets && data.categories.tablets.title) || "Guia Rápido Tech",
    seo_description: data => (data.categories && data.categories.tablets && data.categories.tablets.seo_description) || (data.categories && data.categories.tablets && data.categories.tablets.description) || (data.site && data.site.seo_description) || "",
    keywords: data => (data.categories && data.categories.tablets && data.categories.tablets.keywords) || ""
  }
};
