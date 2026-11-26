export default {
  eleventyComputed: {
    seo_title: data => (data.categories && data.categories.smartphones && data.categories.smartphones.seo_title) || (data.categories && data.categories.smartphones && data.categories.smartphones.title) || "Guia Rápido Tech",
    seo_description: data => (data.categories && data.categories.smartphones && data.categories.smartphones.seo_description) || (data.categories && data.categories.smartphones && data.categories.smartphones.description) || (data.site && data.site.seo_description) || "",
    keywords: data => (data.categories && data.categories.smartphones && data.categories.smartphones.keywords) || ""
  }
};
