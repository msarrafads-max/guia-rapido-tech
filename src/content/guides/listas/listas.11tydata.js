export default {
  layout: "layouts/listicle.njk",
  tags: ["guidesList"],
  permalink: data => `/guias/listas/${data.slug || data.page.fileSlug}/index.html`
};
