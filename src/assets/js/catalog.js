(() => {
  const grid = document.getElementById("catalog-grid");
  if (!grid) return;
  const cards = Array.from(grid.querySelectorAll(".article-card"));
  const buttons = Array.from(document.querySelectorAll(".brand-filter"));
  const search = document.getElementById("catalog-search");
  const empty = document.querySelector(".catalog-empty");
  let activeBrand = "all";
  const apply = () => {
    const term = (search?.value || "").trim().toLowerCase();
    let shown = 0;
    cards.forEach(card => {
      const brand = (card.querySelector(".eyebrow")?.textContent || "").trim().toLowerCase();
      const text = card.textContent.toLowerCase();
      const brandMatch = activeBrand === "all" || (activeBrand === "other" ? !buttons.some(b => {
        const v = b.dataset.brand;
        return v && !["all","other"].includes(v) && v === brand;
      }) : brand === activeBrand);
      const termMatch = !term || text.includes(term);
      const visible = brandMatch && termMatch;
      card.hidden = !visible;
      if (visible) shown++;
    });
    if (empty) empty.hidden = shown > 0;
  };
  buttons.forEach(button => button.addEventListener("click", () => {
    activeBrand = button.dataset.brand || "all";
    buttons.forEach(b => b.classList.toggle("is-active", b === button));
    apply();
  }));
  search?.addEventListener("input", apply);
  apply();
})();
