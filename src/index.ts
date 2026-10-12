// Cloudflare Worker: Mock Shop storefront

interface Product {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  currency: string;
  category: "home" | "tech" | "toys" | "books";
  inStock: boolean;
}

export interface Env {
  ENVIRONMENT?: string;
}

const PRODUCTS: Product[] = [
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

const CATEGORIES = ["home", "tech", "toys", "books"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  home: "#4CAF50",
  tech: "#2196F3",
  toys: "#FF9800",
  books: "#9C27B0",
};

const UI = {
  shopName: "Mock Shop",
  badgeLabel: "SANDBOX",
  footerText: "Demo shop. Nothing here is real.",
  allCategoryLabel: "All",
  categoryLabels: {
    home: "Home",
    tech: "Tech",
    toys: "Toys",
    books: "Books",
  },
  outOfStockLabel: "Out of stock",
};

const SECURITY_HEADERS = {
  "x-content-type-options": "nosniff",
  "referrer-policy": "no-referrer",
  "x-frame-options": "DENY",
  "content-security-policy": "default-src 'self'; style-src 'unsafe-inline'",
};

const CACHE_CONTROL = "public, max-age=60";

const CSS_STYLES = `
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

function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

function filterProducts(category?: string, inStock?: boolean): Product[] {
  return PRODUCTS.filter((p) => {
    if (category && p.category !== category) return false;
    if (inStock && !p.inStock) return false;
    return true;
  });
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m] ?? m);
}

function renderProductCard(product: Product): string {
  const color = CATEGORY_COLORS[product.category];
  const outOfStock = !product.inStock ? `<p style="color: red; margin: 8px 0;">${UI.outOfStockLabel}</p>` : "";
  return `
    <div style="border: 1px solid #ddd; padding: 16px; border-radius: 8px; text-align: center;">
      <div style="width: 100%; height: 60px; background-color: ${color}; border-radius: 4px; margin-bottom: 12px;"></div>
      <h3 style="margin: 8px 0;">${escapeHtml(product.name)}</h3>
      <p style="margin: 8px 0; color: #666; font-size: 14px;">${escapeHtml(product.description)}</p>
      <p style="margin: 8px 0; font-size: 18px; font-weight: bold;">${formatPrice(product.priceCents)}</p>
      ${outOfStock}
    </div>
  `;
}

function renderHomePage(products: Product[], selectedCategory?: string, environment?: string): string {
  const categories = [UI.allCategoryLabel, ...Object.values(UI.categoryLabels)];
  const categoryValues = ["", "home", "tech", "toys", "books"] as const;
  const navLinks = categories
    .map((cat, i) => {
      const href = categoryValues[i] ? `/?category=${categoryValues[i]}` : "/";
      const isActive = (selectedCategory ?? "") === (categoryValues[i] ?? "");
      return `<a href="${href}"${isActive ? ' class="active"' : ""}>${cat}</a>`;
    })
    .join("");

  const badge = environment === "sandbox" ? ` <span class="badge">${UI.badgeLabel}</span>` : "";

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>${UI.shopName}</title>
        <style>${CSS_STYLES}</style>
      </head>
      <body>
        <header>
          <h1>${UI.shopName}${badge}</h1>
        </header>
        <div class="container">
          <nav>${navLinks}</nav>
          <div class="grid">${products.map((p) => renderProductCard(p)).join("")}</div>
        </div>
        <footer>${UI.footerText}</footer>
      </body>
    </html>
  `;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const environment = env.ENVIRONMENT ?? "local";

    try {
      if (url.pathname === "/health") {
        return Response.json({ status: "ok", environment });
      }

      if (url.pathname === "/api/products") {
        if (request.method !== "GET") {
          return Response.json({ error: "method_not_allowed" }, { status: 405 });
        }

        const category = url.searchParams.get("category");
        const inStock = url.searchParams.get("inStock") === "true";

        if (category && !CATEGORIES.includes(category as any)) {
          return Response.json({ error: "invalid_category" }, { status: 400 });
        }

        const products = filterProducts(category ?? undefined, inStock ? true : undefined);
        return new Response(JSON.stringify({ items: products, total: products.length }), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": CACHE_CONTROL,
            ...SECURITY_HEADERS,
          },
        });
      }

      if (url.pathname.startsWith("/api/products/")) {
        if (request.method !== "GET") {
          return Response.json({ error: "method_not_allowed" }, { status: 405 });
        }

        const id = url.pathname.split("/")[3];
        const product = PRODUCTS.find((p) => p.id === id);

        if (!product) {
          return Response.json({ error: "not_found" }, { status: 404 });
        }

        return new Response(JSON.stringify(product), {
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": CACHE_CONTROL,
            ...SECURITY_HEADERS,
          },
        });
      }

      if (url.pathname === "/" && request.method === "GET") {
        const category = url.searchParams.get("category") ?? undefined;

        if (category && !CATEGORIES.includes(category as any)) {
          return new Response("Invalid category", { status: 400 });
        }

        const products = filterProducts(category);
        const html = renderHomePage(products, category, environment);

        return new Response(html, {
          headers: {
            "content-type": "text/html; charset=utf-8",
            ...SECURITY_HEADERS,
          },
        });
      }

      return new Response("Not found", { status: 404 });
    } catch (error) {
      return Response.json({ error: "internal_server_error" }, { status: 500 });
    }
  },
};
