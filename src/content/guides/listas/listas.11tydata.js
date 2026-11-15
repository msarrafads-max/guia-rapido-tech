export default {
  layout: "layouts/listicle.njk",
  editorial_type: "lista",
  permalink: data => `/guias/listas/${data.slug || data.page.fileSlug}/index.html`
};
