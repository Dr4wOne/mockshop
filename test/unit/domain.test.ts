import { describe, it, expect } from "vitest";
import { formatPrice, escapeHtml } from "../../src/domain/Product";
import { filterProducts } from "../../src/domain/ProductRepository";
import { Product } from "../../src/domain/Product";

describe("Domain: Product", () => {
  describe("formatPrice", () => {
    it("formats cents to USD dollars", () => {
      expect(formatPrice(0)).toBe("$0.00");
      expect(formatPrice(100)).toBe("$1.00");
      expect(formatPrice(2550)).toBe("$25.50");
      expect(formatPrice(20000)).toBe("$200.00");
    });

    it("always shows 2 decimal places", () => {
      expect(formatPrice(1)).toBe("$0.01");
      expect(formatPrice(99)).toBe("$0.99");
      expect(formatPrice(1234)).toBe("$12.34");
    });
  });

  describe("escapeHtml", () => {
    it("escapes HTML special characters", () => {
      expect(escapeHtml("<script>alert('xss')</script>")).toBe(
        "&lt;script&gt;alert(&#39;xss&#39;)&lt;/script&gt;"
      );
    });

    it("escapes ampersand", () => {
      expect(escapeHtml("Tom & Jerry")).toBe("Tom &amp; Jerry");
    });

    it("escapes quotes", () => {
      expect(escapeHtml('Say "hello"')).toBe("Say &quot;hello&quot;");
    });

    it("escapes single quotes", () => {
      expect(escapeHtml("it's")).toBe("it&#39;s");
    });

    it("leaves safe characters unchanged", () => {
      expect(escapeHtml("Hello World 123")).toBe("Hello World 123");
    });

    it("handles mixed content", () => {
      expect(escapeHtml('Product & <p "safe">'))  .toBe("Product &amp; &lt;p &quot;safe&quot;&gt;");
    });
  });
});

describe("Domain: ProductFilter", () => {
  const products: Product[] = [
    { id: "p1", name: "Item A", description: "Home item", priceCents: 1000, currency: "USD", category: "home", inStock: true },
    { id: "p2", name: "Item B", description: "Tech item", priceCents: 2000, currency: "USD", category: "tech", inStock: false },
    { id: "p3", name: "Item C", description: "Home item 2", priceCents: 3000, currency: "USD", category: "home", inStock: true },
    { id: "p4", name: "Item D", description: "Tech item 2", priceCents: 4000, currency: "USD", category: "tech", inStock: true },
  ];

  it("returns all products when no filter applied", () => {
    const result = filterProducts(products, {});
    expect(result).toHaveLength(4);
  });

  it("filters by category", () => {
    const result = filterProducts(products, { category: "home" });
    expect(result).toHaveLength(2);
    expect(result.every((p) => p.category === "home")).toBe(true);
  });

  it("filters by inStock", () => {
    const result = filterProducts(products, { inStock: true });
    expect(result).toHaveLength(3);
    expect(result.every((p) => p.inStock)).toBe(true);
  });

  it("filters by both category and inStock", () => {
    const result = filterProducts(products, { category: "tech", inStock: true });
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("p4");
  });

  it("returns empty array for no matches", () => {
    const result = filterProducts(products, { category: "books" });
    expect(result).toHaveLength(0);
  });
});
