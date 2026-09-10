/**
 * modal.js
 * Accessible product quick-view modal. Injected once into the DOM on
 * first use, then reused. Handles focus trapping, Escape-to-close, and
 * restoring focus to whatever triggered it.
 */

let quickViewEl = null;
let quickViewLastFocused = null;
let quickViewQuantity = 1;

function ensureQuickViewModal() {
  if (quickViewEl) return quickViewEl;

  const el = document.createElement("div");
  el.className = "quick-view";
  el.setAttribute("role", "dialog");
  el.setAttribute("aria-modal", "true");
  el.setAttribute("aria-labelledby", "quick-view-title");
  el.hidden = true;
  el.innerHTML = `
    <div class="quick-view__backdrop" data-quick-view-close></div>
    <div class="quick-view__panel">
      <button type="button" class="quick-view__close" data-quick-view-close aria-label="Close quick view">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <div class="quick-view__media" data-quick-view-media></div>
      <div class="quick-view__info">
        <p class="product-card__category" data-quick-view-category></p>
        <h2 id="quick-view-title" data-quick-view-name></h2>
        <div class="quick-view__meta">
          <span class="product-card__price" data-quick-view-price></span>
          <span class="product-card__rating" data-quick-view-rating></span>
        </div>
        <p class="quick-view__description" data-quick-view-description></p>
        <div class="quick-view__quantity">
          <span>Quantity</span>
          <div class="cart-row__quantity">
            <button type="button" class="qty-btn" data-quick-view-qty-down aria-label="Decrease quantity">−</button>
            <span class="qty-value" data-quick-view-qty-value>1</span>
            <button type="button" class="qty-btn" data-quick-view-qty-up aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button type="button" class="btn btn--primary btn--full btn--lg" data-quick-view-add>Add to Cart</button>
      </div>
    </div>
  `;
  document.body.appendChild(el);

  el.querySelectorAll("[data-quick-view-close]").forEach((btn) => {
    btn.addEventListener("click", closeQuickView);
  });

  el.querySelector("[data-quick-view-qty-up]").addEventListener("click", () => {
    quickViewQuantity += 1;
    el.querySelector("[data-quick-view-qty-value]").textContent = quickViewQuantity;
  });
  el.querySelector("[data-quick-view-qty-down]").addEventListener("click", () => {
    quickViewQuantity = Math.max(1, quickViewQuantity - 1);
    el.querySelector("[data-quick-view-qty-value]").textContent = quickViewQuantity;
  });

  document.addEventListener("keydown", (e) => {
    if (el.hidden) return;
    if (e.key === "Escape") closeQuickView();
    if (e.key === "Tab") trapFocus(e, el);
  });

  quickViewEl = el;
  return el;
}

function trapFocus(e, container) {
  const focusable = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (!focusable.length) return;
  const first = focusable[0];
  const last = focusable[focusable.length - 1];

  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

function openQuickView(productId) {
  const product = getProductById(productId);
  if (!product) return;

  const el = ensureQuickViewModal();
  quickViewQuantity = 1;
  quickViewLastFocused = document.activeElement;

  el.querySelector("[data-quick-view-media]").innerHTML = productImageMarkup(product);
  el.querySelector("[data-quick-view-category]").textContent = capitalize(product.category);
  el.querySelector("[data-quick-view-name]").textContent = product.name;
  el.querySelector("[data-quick-view-price]").textContent = `$${product.price.toFixed(2)}`;
  el.querySelector("[data-quick-view-rating]").textContent = `★ ${product.rating} (${product.reviews})`;
  el.querySelector("[data-quick-view-description]").textContent = product.description;
  el.querySelector("[data-quick-view-qty-value]").textContent = "1";

  const addBtn = el.querySelector("[data-quick-view-add]");
  addBtn.textContent = "Add to Cart";
  addBtn.disabled = false;
  addBtn.onclick = () => {
    Cart.add(product.id, quickViewQuantity);
    pulseCartIcon();
    showToast(`${product.name} added to cart`);
    addBtn.textContent = "Added ✓";
    addBtn.disabled = true;
    setTimeout(closeQuickView, 700);
  };

  el.hidden = false;
  document.body.classList.add("quick-view-open");
  requestAnimationFrame(() => el.classList.add("is-visible"));
  el.querySelector(".quick-view__close").focus();
}

function closeQuickView() {
  if (!quickViewEl || quickViewEl.hidden) return;
  quickViewEl.classList.remove("is-visible");
  document.body.classList.remove("quick-view-open");
  setTimeout(() => {
    quickViewEl.hidden = true;
  }, 200);
  if (quickViewLastFocused) quickViewLastFocused.focus();
}
