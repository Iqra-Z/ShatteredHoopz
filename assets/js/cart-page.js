/**
 * cart-page.js
 * Renders the dedicated cart.html view: line items, quantity controls,
 * totals, free-shipping progress, and the simulated checkout action.
 */

const FREE_SHIPPING_THRESHOLD = 100;

document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector("[data-cart-list]");
  if (!list) return; // Not on the cart page.

  const emptyState = document.querySelector("[data-cart-empty]");
  const summary = document.querySelector("[data-cart-summary]");
  const subtotalEl = document.querySelector("[data-cart-subtotal]");
  const totalEl = document.querySelector("[data-cart-total]");
  const shippingBar = document.querySelector("[data-shipping-bar]");
  const shippingNote = document.querySelector("[data-shipping-note]");
  const checkoutBtn = document.querySelector("[data-checkout]");

  function render() {
    const items = Cart.getItems();

    if (!items.length) {
      list.innerHTML = "";
      if (emptyState) emptyState.hidden = false;
      if (summary) summary.hidden = true;
      return;
    }

    if (emptyState) emptyState.hidden = true;
    if (summary) summary.hidden = false;

    list.innerHTML = items.map(renderCartRow).join("");

    const subtotal = Cart.subtotal();
    if (subtotalEl) subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `$${subtotal.toFixed(2)}`;

    if (shippingBar && shippingNote) {
      const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
      shippingBar.style.width = `${pct}%`;
      shippingNote.textContent =
        subtotal >= FREE_SHIPPING_THRESHOLD
          ? "You qualify for free shipping."
          : `Add $${(FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping.`;
    }

    wireRowControls();
  }

  function renderCartRow(item) {
    return `
      <li class="cart-row" data-cart-row="${item.id}">
        <div class="cart-row__media">
          ${productImageMarkup(item)}
        </div>
        <div class="cart-row__info">
          <p class="cart-row__category">${item.category}</p>
          <h3 class="cart-row__name">${item.name}</h3>
          <p class="cart-row__price">$${item.price.toFixed(2)} each</p>
        </div>
        <div class="cart-row__quantity" role="group" aria-label="Quantity for ${item.name}">
          <button type="button" class="qty-btn" data-decrement="${item.id}" aria-label="Decrease quantity">−</button>
          <span class="qty-value" aria-live="polite">${item.quantity}</span>
          <button type="button" class="qty-btn" data-increment="${item.id}" aria-label="Increase quantity">+</button>
        </div>
        <p class="cart-row__subtotal">$${(item.price * item.quantity).toFixed(2)}</p>
        <button type="button" class="cart-row__remove" data-remove="${item.id}" aria-label="Remove ${item.name} from cart">
          Remove
        </button>
      </li>
    `;
  }

  function wireRowControls() {
    list.querySelectorAll("[data-increment]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Cart.increment(btn.getAttribute("data-increment"));
        render();
      });
    });
    list.querySelectorAll("[data-decrement]").forEach((btn) => {
      btn.addEventListener("click", () => {
        Cart.decrement(btn.getAttribute("data-decrement"));
        render();
      });
    });
    list.querySelectorAll("[data-remove]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const row = btn.closest("[data-cart-row]");
        if (row) row.classList.add("cart-row--removing");
        setTimeout(() => {
          Cart.remove(btn.getAttribute("data-remove"));
          render();
        }, 150);
      });
    });
  }

  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (!Cart.getItems().length) return;
      // Simulated checkout only — no payment is processed. See README.
      window.location.href = "thank-you.html";
    });
  }

  render();
});
