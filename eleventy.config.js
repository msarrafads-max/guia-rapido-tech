import MarkdownIt from "markdown-it";

export default function (eleventyConfig) {
  const markdown = new MarkdownIt({ html: false, linkify: true, breaks: false });
  eleventyConfig.addFilter("markdown", value => markdown.render(String(value || "")));
  eleventyConfig.addPassthroughCopy({ "admin": "admin" });
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.addPassthroughCopy({ "src/robots.txt": "robots.txt" });
  eleventyConfig.addPassthroughCopy({ "src/_redirects": "_redirects" });

  const newestFirst = items => items
    .filter(item => item.data.status !== "draft")
    .sort((a, b) => new Date(b.data.date || b.date || 0).getTime() - new Date(a.data.date || a.date || 0).getTime());

  eleventyConfig.addCollection("articles", api => newestFirst(
    api.getFilteredByGlob("src/content/articles/**/*.md")
  ));
  eleventyConfig.addCollection("guidesList", api => newestFirst(api.getFilteredByGlob("src/content/guides/listas/*.md")));
  eleventyConfig.addCollection("guidesComparison", api => newestFirst(api.getFilteredByGlob("src/content/guides/comparativos/*.md")));
  eleventyConfig.addCollection("editorialGuides", api => newestFirst([
    ...api.getFilteredByGlob("src/content/guides/listas/*.md"),
    ...api.getFilteredByGlob("src/content/guides/comparativos/*.md")
  ]));
  eleventyConfig.addCollection("freeEditorials", api => newestFirst(api.getFilteredByGlob("src/content/guides/editoriais-livres/*.md")));

  eleventyConfig.addFilter("dateBR", value => {
    if (!value) return "";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long", timeStyle: "short", timeZone: "America/Sao_Paulo" }).format(d);
  });
  eleventyConfig.addFilter("dateISO", value => {
    if (!value) return "";
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? "" : d.toISOString();
  });
  eleventyConfig.addFilter("slugify", value => String(value || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""));
  eleventyConfig.addFilter("findArticle", (articles, slug) => (articles || []).find(article => article.data.slug === slug || article.fileSlug === slug));
  eleventyConfig.addFilter("jsonSafe", value => JSON.stringify(value ?? "").replace(/</g, "\\u003c"));
  eleventyConfig.addFilter("youtubeId", value => {
    const text = String(value || "");
    const match = text.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([A-Za-z0-9_-]{6,})/);
    return match ? match[1] : "";
  });
  eleventyConfig.addFilter("absoluteUrl", (path, base) => {
    try { return new URL(path, base || "https://guiarapidotech.com.br").href; }
    catch { return path; }
  });
  return {
    dir: { input: "src", includes: "_includes", data: "_data", output: "_site" },
    templateFormats: ["md", "njk", "html", "11ty.js"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk"
  };
}
