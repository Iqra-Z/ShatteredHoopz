/**
 * cart.js
 * Single source of truth for cart state, backed by localStorage.
 * Storage shape (key: "shatteredHoopzCart"):
 *   [{ productId: "court-statement-jersey", quantity: 2 }, ...]
 *
 * Every page includes this file so the navbar badge, the cart page, and
 * checkout all read/write the same data. Product details (name, price,
 * image) are never duplicated into storage — they're looked up live from
 * products.js by id, so the cart always reflects current catalog data.
 */

const CART_STORAGE_KEY = "shatteredHoopzCart";

const Cart = {
  _read() {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      console.error("Cart: failed to read localStorage, resetting cart.", err);
      return [];
    }
  },

  _write(lines) {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
    } catch (err) {
      console.error("Cart: failed to persist cart to localStorage.", err);
    }
    this._notify();
  },

  /** Cart line items joined with live product data. Drops stale/unknown ids. */
  getItems() {
    return this._read()
      .map((line) => {
        const product = getProductById(line.productId);
        if (!product) return null;
        return { ...product, quantity: line.quantity };
      })
      .filter(Boolean);
  },

  add(productId, quantity = 1) {
    const lines = this._read();
    const existing = lines.find((line) => line.productId === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      lines.push({ productId, quantity });
    }
    this._write(lines);
  },

  setQuantity(productId, quantity) {
    let lines = this._read();
    if (quantity <= 0) {
      lines = lines.filter((line) => line.productId !== productId);
    } else {
      const existing = lines.find((line) => line.productId === productId);
      if (existing) existing.quantity = quantity;
    }
    this._write(lines);
  },

  increment(productId) {
    const lines = this._read();
    const existing = lines.find((line) => line.productId === productId);
    if (existing) existing.quantity += 1;
    this._write(lines);
  },

  decrement(productId) {
    const lines = this._read();
    const existing = lines.find((line) => line.productId === productId);
    if (existing) {
      existing.quantity -= 1;
      if (existing.quantity <= 0) {
        return this.remove(productId);
      }
    }
    this._write(lines);
  },

  remove(productId) {
    const lines = this._read().filter((line) => line.productId !== productId);
    this._write(lines);
  },

  clear() {
    this._write([]);
  },

  /** Total quantity across all line items — this is what the badge shows. */
  count() {
    return this._read().reduce((sum, line) => sum + line.quantity, 0);
  },

  subtotal() {
    return this.getItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  _notify() {
    document.dispatchEvent(new CustomEvent("cart:updated"));
  },
};

/** Update every cart-count badge on the current page. Safe to call anywhere. */
function refreshCartBadges() {
  const count = Cart.count();
  document.querySelectorAll("[data-cart-count]").forEach((el) => {
    el.textContent = count;
    el.classList.toggle("is-hidden", count === 0);
  });
}

document.addEventListener("cart:updated", refreshCartBadges);
document.addEventListener("DOMContentLoaded", refreshCartBadges);

/** Small reusable pulse animation when an item is added. */
function pulseCartIcon() {
  const icon = document.querySelector("[data-cart-icon]");
  if (!icon) return;
  icon.classList.remove("cart-pulse");
  void icon.offsetWidth; // restart animation
  icon.classList.add("cart-pulse");
}

/** Lightweight toast notification, e.g. "Added to Cart". */
function showToast(message) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.remove("toast--visible");
  void toast.offsetWidth;
  toast.classList.add("toast--visible");
  clearTimeout(toast._hideTimer);
  toast._hideTimer = setTimeout(() => toast.classList.remove("toast--visible"), 2200);
}

/* ---------------- Wishlist (separate, simpler localStorage list) ---------------- */

const WISHLIST_STORAGE_KEY = "shatteredHoopzWishlist";

const Wishlist = {
  _read() {
    try {
      const raw = localStorage.getItem(WISHLIST_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  },
  _write(ids) {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(ids));
  },
  has(productId) {
    return this._read().includes(productId);
  },
  toggle(productId) {
    const ids = this._read();
    const idx = ids.indexOf(productId);
    if (idx >= 0) {
      ids.splice(idx, 1);
    } else {
      ids.push(productId);
    }
    this._write(ids);
    return ids.includes(productId);
  },
};
