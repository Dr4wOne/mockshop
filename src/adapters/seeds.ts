import { Product } from "../domain/Product";

export const PRODUCTS: Product[] = [
  { id: "p01", name: "Cozy Blanket", description: "Soft and warm", priceCents: 2500, currency: "USD", category: "home", inStock: true },
  { id: "p02", name: "Plant Pot", description: "Ceramic handmade", priceCents: 1800, currency: "USD", category: "home", inStock: true },
  { id: "p03", name: "Wall Clock", description: "Minimalist design", priceCents: 3200, currency: "USD", category: "home", inStock: false },
  { id: "p04", name: "USB Hub", description: "7-port powered", priceCents: 4500, currency: "USD", category: "tech", inStock: true },
  { id: "p05", name: "Wireless Mouse", description: "Ergonomic shape", priceCents: 2200, currency: "USD", category: "tech", inStock: true },
  { id: "p06", name: "Phone Stand", description: "Adjustable metal", priceCents: 1200, currency: "USD", category: "tech", inStock: true },
  { id: "p07", name: "Puzzle 500pc", description: "Space theme", priceCents: 1500, currency: "USD", category: "toys", inStock: true },
  { id: "p08", name: "Action Figure", description: "Poseable joints", priceCents: 2800, currency: "USD", category: "toys", inStock: false },
  { id: "p09", name: "Building Blocks", description: "100 colorful pieces", priceCents: 3500, currency: "USD", category: "toys", inStock: true },
  { id: "p10", name: "Poetry Collection", description: "Modern verse", priceCents: 1200, currency: "USD", category: "books", inStock: true },
  { id: "p11", name: "SciFi Novel", description: "Award-winning", priceCents: 1800, currency: "USD", category: "books", inStock: true },
  { id: "p12", name: "Art History", description: "Illustrated guide", priceCents: 3800, currency: "USD", category: "books", inStock: true },
];
