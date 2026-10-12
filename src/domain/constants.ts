import { Category } from "./Product";

export const VALID_CATEGORIES: readonly Category[] = ["home", "tech", "toys", "books"];

export const CATEGORY_COLORS: Record<Category, string> = {
  home: "#4CAF50",
  tech: "#2196F3",
  toys: "#FF9800",
  books: "#9C27B0",
};

export const UI = {
  shopName: "Mock Shop",
  badgeLabel: "SANDBOX",
  footerText: "Demo shop. Nothing here is real.",
  allCategoryLabel: "All",
  categoryLabels: {
    home: "Home",
    tech: "Tech",
    toys: "Toys",
    books: "Books",
  } as Record<Category, string>,
  outOfStockLabel: "Out of stock",
};

export const SECURITY_HEADERS = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
  "x-frame-options": "DENY",
  "content-security-policy": "default-src 'self'; style-src 'unsafe-inline'",
};

export const CACHE_CONTROL = "public, max-age=60";

export const CSS_STYLES = `
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f5f5f5; color: #333; }
  header { background: white; padding: 16px; border-bottom: 1px solid #ddd; }
  .container { max-width: 1200px; margin: 0 auto; padding: 16px; }
  header h1 { font-size: 24px; font-weight: 600; }
  .badge { display: inline-block; margin-left: 12px; padding: 4px 8px; background: #ff6b6b; color: white; font-size: 12px; border-radius: 4px; }
  nav { background: white; padding: 16px; margin: 16px 0; border-radius: 8px; }
  nav a { margin-right: 12px; padding: 8px 12px; text-decoration: none; color: #2196F3; border: 1px solid #ddd; border-radius: 4px; display: inline-block; }
  nav a.active { background: #2196F3; color: white; border-color: #2196F3; }
  .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 16px; margin: 16px 0; }
  footer { text-align: center; padding: 32px 16px; color: #666; font-size: 14px; }
`;
