export default {
  layout: "layouts/comparison-guide.njk",
  tags: ["guidesComparison"],
  permalink: data => `/guias/comparativos/${data.slug || data.page.fileSlug}/index.html`
};
