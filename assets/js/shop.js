/**
 * shop.js
 * Drives the product catalog page: category filters, search, sort,
 * and rendering. State is reflected in the URL query string so filtered
 * views are shareable/bookmarkable. Rendering always starts from a fresh
 * copy of PRODUCTS, so filters never mutate the underlying catalog.
 */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector("[data-shop-grid]");
  if (!grid) return; // Not on the shop page.

  const searchInput = document.querySelector("[data-shop-search]");
  const sortSelect = document.querySelector("[data-shop-sort]");
  const filterButtons = document.querySelectorAll("[data-shop-filter]");
  const emptyState = document.querySelector("[data-shop-empty]");
  const resultCount = document.querySelector("[data-shop-count]");

  const params = new URLSearchParams(location.search);
  const state = {
    category: params.get("category") || "all",
    search: params.get("search") || "",
    sort: params.get("sort") || "featured",
  };

  if (searchInput) searchInput.value = state.search;
  if (sortSelect) sortSelect.value = state.sort;
  syncFilterButtons();

  function syncFilterButtons() {
    filterButtons.forEach((btn) => {
      const isActive = btn.getAttribute("data-shop-filter") === state.category;
      btn.classList.toggle("is-active", isActive);
      btn.setAttribute("aria-pressed", String(isActive));
    });
  }

  function updateUrl() {
    const next = new URLSearchParams();
    if (state.category !== "all") next.set("category", state.category);
    if (state.search) next.set("search", state.search);
    if (state.sort !== "featured") next.set("sort", state.sort);
    const qs = next.toString();
    history.replaceState(null, "", qs ? `?${qs}` : location.pathname);
  }

  function getFilteredProducts() {
    let products = getAllProducts();

    if (state.category !== "all") {
      products = products.filter((p) => p.category === state.category);
    }

    if (state.search.trim()) {
      const q = state.search.trim().toLowerCase();
      products = products.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }

    switch (state.sort) {
      case "price-asc":
        return [...products].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...products].sort((a, b) => b.price - a.price);
      case "rating":
        return [...products].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
      default:
        // "featured": badged items first, then catalog order.
        return [...products].sort((a, b) => (a.badge ? -1 : 0) - (b.badge ? -1 : 0));
    }
  }

  function render() {
    const products = getFilteredProducts();

    if (resultCount) {
      resultCount.textContent = `${products.length} item${products.length === 1 ? "" : "s"}`;
    }

    if (!products.length) {
      grid.innerHTML = "";
      if (emptyState) emptyState.hidden = false;
      return;
    }

    if (emptyState) emptyState.hidden = true;
    grid.innerHTML = products.map(renderProductCard).join("");
    wireProductCardActions(grid);

    grid.querySelectorAll(".product-card").forEach((card, i) => {
      card.style.setProperty("--stagger", i);
      card.classList.add("product-card--enter");
    });
  }

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.getAttribute("data-shop-filter");
      syncFilterButtons();
      updateUrl();
      render();
    });
  });

  if (searchInput) {
    let debounceTimer;
    searchInput.addEventListener("input", () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        state.search = searchInput.value;
        updateUrl();
        render();
      }, 200);
    });
  }

  if (sortSelect) {
    sortSelect.addEventListener("change", () => {
      state.sort = sortSelect.value;
      updateUrl();
      render();
    });
  }

  render();
});
