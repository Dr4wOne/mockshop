export type Category = "home" | "tech" | "toys" | "books";

export interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  category: Category;
  inStock: boolean;
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m] ?? m);
}
