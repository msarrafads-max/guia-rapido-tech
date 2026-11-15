export default {
  layout: "layouts/comparison-guide.njk",
  editorial_type: "comparativo",
  permalink: data => `/guias/comparativos/${data.slug || data.page.fileSlug}/index.html`
};
