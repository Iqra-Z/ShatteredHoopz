/**
 * products.js
 * Static product catalog for the Shattered Hoopz demo store.
 * Stable slug IDs are used everywhere (shop grid, featured rails, quick
 * view, cart, localStorage) so a product never changes identity.
 */

const PRODUCTS = [
  {
    id: "court-statement-jersey",
    name: "Court Statement Jersey",
    category: "jerseys",
    price: 89.99,
    art: "jersey-black",
    description: "Mesh performance jersey with drop-tail hem, heat-sealed numbering, and the Shattered Hoopz chest wordmark.",
    rating: 4.8,
    reviews: 124,
    badge: "NEW",
  },
  {
    id: "away-edition-jersey",
    name: "Away Edition Jersey",
    category: "jerseys",
    price: 84.99,
    art: "jersey-cream",
    description: "Lightweight away-day jersey in off-white with burnt-orange trim, built for movement on and off the court.",
    rating: 4.6,
    reviews: 67,
    badge: null,
  },
  {
    id: "home-court-jersey",
    name: "Home Court Jersey",
    category: "jerseys",
    price: 89.99,
    art: "jersey-orange",
    description: "Signature home colorway with reinforced seams and a tagless collar.",
    rating: 4.9,
    reviews: 91,
    badge: "BEST SELLER",
  },
  {
    id: "classic-logo-hoodie",
    name: "Classic Logo Hoodie",
    category: "hoodies",
    price: 69.99,
    art: "hoodie-cream",
    description: "Everyday fleece hoodie in cream with the full Shattered Hoopz net graphic across the chest.",
    rating: 4.7,
    reviews: 98,
    badge: "POPULAR",
  },
  {
    id: "heavyweight-pullover",
    name: "Heavyweight Pullover",
    category: "hoodies",
    price: 74.99,
    art: "hoodie-black",
    description: "14oz brushed fleece pullover with kangaroo pocket, ribbed cuffs, and the SH monogram.",
    rating: 4.9,
    reviews: 142,
    badge: "NEW",
  },
  {
    id: "varsity-bomber-hoodie",
    name: "Varsity Bomber Hoodie",
    category: "hoodies",
    price: 94.99,
    art: "hoodie-orange",
    description: "Heavyweight bomber-cut hoodie with ribbed hem and cuffs, built for cold-weather runs.",
    rating: 4.8,
    reviews: 39,
    badge: "LIMITED",
  },
  {
    id: "sh-snapback",
    name: "SH Snapback",
    category: "hats",
    price: 34.99,
    art: "cap-black",
    description: "Structured six-panel snapback with flat brim and embroidered SH monogram.",
    rating: 4.6,
    reviews: 76,
    badge: null,
  },
  {
    id: "curved-brim-cap",
    name: "Curved Brim Cap",
    category: "hats",
    price: 32.99,
    art: "cap-orange",
    description: "Low-profile curved brim cap in washed cotton twill.",
    rating: 4.5,
    reviews: 44,
    badge: "NEW",
  },
  {
    id: "ribbed-beanie",
    name: "Ribbed Beanie",
    category: "hats",
    price: 24.99,
    art: "beanie",
    description: "Fine-gauge ribbed knit beanie with fold cuff and woven tag.",
    rating: 4.7,
    reviews: 58,
    badge: null,
  },
  {
    id: "bucket-hat",
    name: "Bucket Hat",
    category: "hats",
    price: 29.99,
    art: "bucket",
    description: "Packable bucket hat in brushed cotton with eyelet vents.",
    rating: 4.3,
    reviews: 27,
    badge: "POPULAR",
  },
  {
    id: "net-graphic-tee",
    name: "Net Graphic Tee",
    category: "tees",
    price: 39.99,
    art: "tee-black",
    description: "Heavyweight cotton tee with a hand-drawn net-and-ball graphic across the chest.",
    rating: 4.5,
    reviews: 68,
    badge: null,
  },
  {
    id: "court-lines-tee",
    name: "Court Lines Tee",
    category: "tees",
    price: 36.99,
    art: "tee-cream",
    description: "Minimal court-line graphic tee in a relaxed, boxy fit.",
    rating: 4.4,
    reviews: 33,
    badge: "NEW",
  },
  {
    id: "court-shorts",
    name: "Court Shorts",
    category: "shorts",
    price: 54.99,
    art: "shorts",
    description: "Mesh court shorts with elastic waistband, side pockets, and orange piping.",
    rating: 4.6,
    reviews: 52,
    badge: "NEW",
  },
  {
    id: "shattered-duffle-bag",
    name: "Shattered Hoopz Duffle Bag",
    category: "accessories",
    price: 59.99,
    art: "bag",
    description: "Water-resistant duffle with a ventilated shoe pocket and full wordmark print.",
    rating: 4.9,
    reviews: 51,
    badge: null,
  },
  {
    id: "crew-socks-3pack",
    name: "Crew Socks — 3 Pack",
    category: "accessories",
    price: 19.99,
    art: "socks",
    description: "Cushioned crew socks in three colorways with built-in arch support.",
    rating: 4.8,
    reviews: 84,
    badge: null,
  },
  {
    id: "hydration-bottle",
    name: "Hydration Bottle",
    category: "accessories",
    price: 28.99,
    art: "bottle",
    description: "Insulated 24oz steel bottle, keeps drinks cold through a full session.",
    rating: 4.7,
    reviews: 45,
    badge: "NEW",
  },
  {
    id: "wristband-set",
    name: "Wristband Set",
    category: "accessories",
    price: 14.99,
    art: "wristband",
    description: "Terry cloth wristband pair, moisture-wicking with woven SH tag.",
    rating: 4.5,
    reviews: 22,
    badge: "POPULAR",
  },
];

/** Return a shallow copy of all products. */
function getAllProducts() {
  return [...PRODUCTS];
}

/** Look up a single product by its slug id. */
function getProductById(id) {
  return PRODUCTS.find((p) => p.id === id) || null;
}

/** Build the <img> markup for a product's artwork. */
function productImageMarkup(product, sizeClass = "") {
  return `<img class="${sizeClass}" src="assets/images/products/${product.art}.svg" alt="${product.name}" loading="lazy" width="400" height="400">`;
}

/** Render a star rating string, e.g. "★★★★☆". Used alongside the numeric rating. */
function renderStars(rating) {
  const full = Math.round(rating);
  return "★".repeat(full) + "☆".repeat(5 - full);
}
