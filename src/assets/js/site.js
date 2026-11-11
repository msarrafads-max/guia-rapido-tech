(() => {
  const root = document.documentElement;
  const themeButton = document.getElementById("theme-toggle");
  const themeIcon = themeButton?.querySelector(".theme-icon");
  const themeLabel = themeButton?.querySelector(".theme-label");
  const setTheme = (theme) => {
    root.dataset.theme = theme;
    try { localStorage.setItem("grt-theme", theme); } catch (_) {}
    if (themeIcon) themeIcon.textContent = theme === "dark" ? "☀" : "☾";
    if (themeLabel) themeLabel.textContent = theme === "dark" ? "Modo claro" : "Modo escuro";
    if (themeButton) themeButton.setAttribute("aria-label", theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro");
  };
  setTheme(root.dataset.theme === "dark" ? "dark" : "light");
  themeButton?.addEventListener("click", () => setTheme(root.dataset.theme === "dark" ? "light" : "dark"));

  const menuButton = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("primary-nav-mobile");
  menuButton?.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    if (mobileNav) mobileNav.hidden = !open;
  });

  const cookieNotice = document.getElementById("cookie-notice");
  const cookieAccept = document.getElementById("cookie-accept");
  let dismissed = false;
  try { dismissed = localStorage.getItem("grt-cookie-notice-dismissed") === "yes"; } catch (_) {}
  if (cookieNotice && !dismissed) cookieNotice.hidden = false;
  cookieAccept?.addEventListener("click", () => {
    try { localStorage.setItem("grt-cookie-notice-dismissed", "yes"); } catch (_) {}
    if (cookieNotice) cookieNotice.hidden = true;
  });

  // Editorial carousel cards: article slugs are configured in the Decap category JSON.
  const articleIndex = window.GRT_ARTICLES || [];
  document.querySelectorAll(".showcase-slides, .small-slide-content").forEach((slot) => {
    const slugs = (slot.dataset.slugs || "").split(",").map(s => s.trim()).filter(Boolean);
    const category = slot.dataset.category || "smartphones";
    const parent = slot.closest(".showcase-card");
    let index = 0;
    const render = () => {
      if (!slugs.length) {
        slot.innerHTML = '<p class="slide-status">Adicione os slugs dos reviews pelo Decap para preencher este card.</p>';
        return;
      }
      const slug = slugs[index % slugs.length];
      const article = articleIndex.find(a => a.slug === slug && a.category === category);
      if (!article) {
        slot.innerHTML = `<span class="slide-status">Review configurado: ${escapeHtml(slug)} — confira se o artigo existe e está publicado.</span>`;
        return;
      }
      slot.innerHTML = `<a class="slide-product-link" href="${article.url}">${escapeHtml(article.title)} ↗</a>`;
      const status = parent?.querySelector(".slide-status");
      if (status) status.textContent = `${index + 1} de ${slugs.length}`;
    };
    render();
    const prev = parent?.querySelector(".slide-prev");
    const next = parent?.querySelector(".slide-next");
    prev?.addEventListener("click", () => { if (slugs.length) { index = (index - 1 + slugs.length) % slugs.length; render(); }});
    next?.addEventListener("click", () => { if (slugs.length) { index = (index + 1) % slugs.length; render(); }});
  });

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  }
})();
