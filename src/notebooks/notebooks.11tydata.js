export default {
  eleventyComputed: {
    seo_title: data => (data.categories && data.categories.notebooks && data.categories.notebooks.seo_title) || (data.categories && data.categories.notebooks && data.categories.notebooks.title) || "Guia Rápido Tech",
    seo_description: data => (data.categories && data.categories.notebooks && data.categories.notebooks.seo_description) || (data.categories && data.categories.notebooks && data.categories.notebooks.description) || (data.site && data.site.seo_description) || "",
    keywords: data => (data.categories && data.categories.notebooks && data.categories.notebooks.keywords) || ""
  }
};
