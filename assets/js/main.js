/**
 * main.js
 * Behaviour shared by every page: mobile nav, scroll-aware header,
 * active-link highlighting, nav search, scroll-reveal animation,
 * footer year, and the shared product-card renderer used by the
 * homepage rails and the shop grid alike.
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileNav();
  initActiveNavLink();
  initScrollHeader();
  initNavSearch();
  initScrollReveal();
  initFooterYear();
  initNewsletterForms();
  initHomeRails();
});

function initMobileNav() {
  const toggle = document.querySelector("[data-nav-toggle]");
  const menu = document.querySelector("[data-nav-menu]");
  if (!toggle || !menu) return;

  const closeMenu = () => {
    menu.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
  };

  toggle.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });
}

function initActiveNavLink() {
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav__links a[href]").forEach((link) => {
    const href = link.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      link.classList.add("is-active");
      link.setAttribute("aria-current", "page");
    }
  });
}

function initScrollHeader() {
  const header = document.querySelector("[data-site-header]");
  if (!header) return;
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 12);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

/** Expandable nav search that submits straight into the shop page's search filter. */
function initNavSearch() {
  const toggle = document.querySelector("[data-search-toggle]");
  const form = document.querySelector("[data-search-form]");
  if (!toggle || !form) return;
  const input = form.querySelector("input");

  toggle.addEventListener("click", () => {
    const isOpen = form.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) input.focus();
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    window.location.href = `shop.html?search=${encodeURIComponent(q)}`;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && form.classList.contains("is-open")) {
      form.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });
}

function initScrollReveal() {
  const targets = document.querySelectorAll("[data-reveal]");
  if (!targets.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  targets.forEach((el) => observer.observe(el));
}

function initFooterYear() {
  document.querySelectorAll("[data-year]").forEach((el) => {
    el.textContent = new Date().getFullYear();
  });
}

/** Client-side-only newsletter forms: validate email, show a success state. */
function initNewsletterForms() {
  document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
    const input = form.querySelector("input[type='email']");
    const button = form.querySelector("button");
    const originalLabel = button ? button.textContent : "";

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value);
      if (!valid) {
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      input.setAttribute("aria-invalid", "false");
      button.textContent = "Subscribed ✓";
      button.disabled = true;
      input.value = "";
      showToast("You're on the list — thanks for subscribing.");
      setTimeout(() => {
        button.textContent = originalLabel;
        button.disabled = false;
      }, 3000);
    });
  });
}

/** Home page only: New Arrivals + Best Sellers rails. */
function initHomeRails() {
  if (typeof getAllProducts !== "function") return;

  const newArrivalsGrid = document.querySelector("[data-new-arrivals-grid]");
  if (newArrivalsGrid) {
    const items = getAllProducts()
      .filter((p) => p.badge === "NEW" || p.badge === "POPULAR")
      .slice(0, 4);
    newArrivalsGrid.innerHTML = items.map(renderProductCard).join("");
    wireProductCardActions(newArrivalsGrid);
  }

  const bestSellersGrid = document.querySelector("[data-best-sellers-grid]");
  if (bestSellersGrid) {
    const items = [...getAllProducts()].sort((a, b) => b.rating - a.rating || b.reviews - a.reviews).slice(0, 4);
    bestSellersGrid.innerHTML = items.map(renderProductCard).join("");
    wireProductCardActions(bestSellersGrid);
  }
}

/** Shared product-card markup: used by home rails and the shop grid. */
function renderProductCard(product) {
  const badgeClass = product.badge ? `badge--${product.badge.toLowerCase().replace(/\s+/g, "-")}` : "";
  const badge = product.badge ? `<span class="badge ${badgeClass}">${product.badge}</span>` : "";
  const isWishlisted = typeof Wishlist !== "undefined" && Wishlist.has(product.id);

  return `
    <article class="product-card" data-product-id="${product.id}">
      <div class="product-card__media">
        ${badge}
        <button type="button" class="wishlist-btn ${isWishlisted ? "is-active" : ""}" data-wishlist-toggle="${product.id}" aria-pressed="${isWishlisted}" aria-label="${isWishlisted ? "Remove from" : "Add to"} wishlist">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="${isWishlisted ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2"><path d="M12 21s-7-4.35-9.5-8.5C.5 8.5 2.5 5 6 5c2 0 3.5 1 4.5 2.5C11.5 6 13 5 15 5c3.5 0 5.5 3.5 3.5 7.5C19 16.65 12 21 12 21Z"/></svg>
        </button>
        <button type="button" class="quick-view-trigger" data-quick-view="${product.id}">Quick View</button>
        ${productImageMarkup(product)}
      </div>
      <div class="product-card__body">
        <p class="product-card__category">${capitalize(product.category)}</p>
        <h3 class="product-card__name">
          <button type="button" class="product-card__name-btn" data-quick-view="${product.id}">${product.name}</button>
        </h3>
        <div class="product-card__meta">
          <span class="product-card__price">$${product.price.toFixed(2)}</span>
          <span class="product-card__rating" aria-label="Rated ${product.rating} out of 5 from ${product.reviews} reviews">★ ${product.rating} <span class="product-card__reviews">(${product.reviews})</span></span>
        </div>
        <button type="button" class="btn btn--secondary btn--full" data-add-to-cart="${product.id}">
          Add to Cart
        </button>
      </div>
    </article>
  `;
}

/** Wire Add to Cart, wishlist, and quick-view triggers within a scope. */
function wireProductCardActions(scope = document) {
  scope.querySelectorAll("[data-add-to-cart]").forEach((btn) => {
    btn.addEventListener("click", () => addToCartWithFeedback(btn.getAttribute("data-add-to-cart"), btn));
  });

  scope.querySelectorAll("[data-wishlist-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-wishlist-toggle");
      const nowActive = Wishlist.toggle(id);
      btn.classList.toggle("is-active", nowActive);
      btn.setAttribute("aria-pressed", String(nowActive));
      btn.setAttribute("aria-label", nowActive ? "Remove from wishlist" : "Add to wishlist");
      const svg = btn.querySelector("svg");
      if (svg) svg.setAttribute("fill", nowActive ? "currentColor" : "none");
    });
  });

  scope.querySelectorAll("[data-quick-view]").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (typeof openQuickView === "function") openQuickView(btn.getAttribute("data-quick-view"));
    });
  });
}

/** Add to cart with a button label swap + toast + badge pulse. */
function addToCartWithFeedback(productId, triggerBtn) {
  const product = getProductById(productId);
  if (!product) return;
  Cart.add(productId, 1);
  pulseCartIcon();
  showToast(`${product.name} added to cart`);

  if (triggerBtn) {
    const original = triggerBtn.textContent;
    triggerBtn.textContent = "Added ✓";
    triggerBtn.classList.add("is-added");
    triggerBtn.disabled = true;
    setTimeout(() => {
      triggerBtn.textContent = original;
      triggerBtn.classList.remove("is-added");
      triggerBtn.disabled = false;
    }, 1400);
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
