import { Product, escapeHtml } from "../domain/Product";
import { CATEGORY_COLORS, UI, CSS_STYLES } from "../domain/constants";

export class HtmlRenderer {
  render(products: Product[], selectedCategory?: string, environment?: string): string {
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
    const productCards = products.map((p) => this.renderCard(p)).join("");

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
            <div class="grid">${productCards}</div>
          </div>
          <footer>${UI.footerText}</footer>
        </body>
      </html>
    `;
  }

  private renderCard(product: Product): string {
    const color = CATEGORY_COLORS[product.category];
    const outOfStock = !product.inStock ? `<p style="color: red; margin: 8px 0;">${UI.outOfStockLabel}</p>` : "";

    return `
      <div style="border: 1px solid #ddd; padding: 16px; border-radius: 8px; text-align: center;">
        <div style="width: 100%; height: 60px; background-color: ${color}; border-radius: 4px; margin-bottom: 12px;"></div>
        <h3 style="margin: 8px 0;">${escapeHtml(product.name)}</h3>
        <p style="margin: 8px 0; color: #666; font-size: 14px;">${escapeHtml(product.description)}</p>
        <p style="margin: 8px 0; font-size: 18px; font-weight: bold;">$${(product.priceCents / 100).toFixed(2)}</p>
        ${outOfStock}
      </div>
    `;
  }
}
