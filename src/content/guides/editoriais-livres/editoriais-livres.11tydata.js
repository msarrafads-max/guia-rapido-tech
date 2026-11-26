/**
 * Defaults for Decap "Artigos editoriais livres".
 * Content is stored in src/content/guides/editoriais-livres/.
 */
const slugify = value => String(value || "")
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

export default {
  layout: "layouts/free-editorial.njk",
  tags: ["freeEditorials"],
  eleventyComputed: {
    permalink: data => {
      if (String(data.status || "published").toLowerCase() === "draft") return false;
      const fallback = data.page && (data.page.fileSlug || data.page.filePathStem);
      const slug = slugify(data.slug || fallback || data.title || "");
      return slug ? `/guias/editoriais/${slug}.html` : false;
    },
    image: data => data.cover_image || data.image || "",
    image_alt: data => data.cover_alt || data.image_alt || data.title || "",
    brand: data => data.editorial_label || "Artigo editorial",
    seo_title: data => data.seo_title || data.title || "",
    seo_description: data => data.seo_description || data.description || ""
  }
};
