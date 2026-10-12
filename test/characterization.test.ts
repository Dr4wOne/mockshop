import { describe, it, expect } from "vitest";
import worker from "../src/index";

const mockEnv = { ENVIRONMENT: "sandbox" };

describe("POC characterization tests (behavior snapshot)", () => {
  describe("home page HTML structure", () => {
    it("renders complete HTML page structure", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const html = await response.text();

      expect(html).toContain("<!DOCTYPE html>");
      expect(html).toContain("<html>");
      expect(html).toContain("</html>");
      expect(html).toContain("Mock Shop");
      expect(html).toContain("SANDBOX");
    });

    it("includes all category filter buttons", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const html = await response.text();

      expect(html).toContain('href="/"');
      expect(html).toContain('href="/?category=home"');
      expect(html).toContain('href="/?category=tech"');
      expect(html).toContain('href="/?category=toys"');
      expect(html).toContain('href="/?category=books"');
    });

    it("marks All filter as active on home page", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const html = await response.text();

      const allLink = html.match(/<a href="\/"[^>]*>All<\/a>/);
      expect(allLink?.toString()).toContain('class="active"');
    });

    it("displays all 12 product names", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const html = await response.text();

      const productNames = ["Cozy Blanket", "Plant Pot", "Wall Clock", "USB Hub", "Wireless Mouse", "Phone Stand", "Puzzle 500pc", "Action Figure", "Building Blocks", "Poetry Collection", "SciFi Novel", "Art History"];

      productNames.forEach((name) => {
        expect(html).toContain(name);
      });
    });

    it("displays all 12 product descriptions", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const html = await response.text();

      const descriptions = ["Soft and warm", "Ceramic handmade", "Minimalist design", "7-port powered", "Ergonomic shape", "Adjustable metal", "Space theme", "Poseable joints", "100 colorful pieces", "Modern verse", "Award-winning", "Illustrated guide"];

      descriptions.forEach((desc) => {
        expect(html).toContain(desc);
      });
    });

    it("displays prices in $X.XX format", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const html = await response.text();

      expect(html).toContain("$25.00");
      expect(html).toContain("$18.00");
      expect(html).toContain("$32.00");
      expect(html).toContain("$45.00");
    });

    it("shows Out of stock label exactly twice", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const html = await response.text();

      const matches = html.match(/Out of stock/g);
      expect(matches?.length).toBe(2);
    });

    it("includes footer text", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const html = await response.text();

      expect(html).toContain("Demo shop. Nothing here is real.");
    });

    it("home page response under 30KB", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const html = await response.text();

      expect(html.length).toBeLessThan(30000);
    });
  });

  describe("API response formats", () => {
    it("GET /api/products returns exact structure", async () => {
      const request = new Request("http://localhost/api/products", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const data = (await response.json()) as any;

      expect(data).toHaveProperty("items");
      expect(data).toHaveProperty("total");
      expect(Array.isArray(data.items)).toBe(true);
      expect(typeof data.total).toBe("number");
    });

    it("product objects have exact shape", async () => {
      const request = new Request("http://localhost/api/products/p01", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const product = (await response.json()) as any;

      expect(product).toHaveProperty("id");
      expect(product).toHaveProperty("name");
      expect(product).toHaveProperty("description");
      expect(product).toHaveProperty("priceCents");
      expect(product).toHaveProperty("currency");
      expect(product).toHaveProperty("category");
      expect(product).toHaveProperty("inStock");
    });

    it("product IDs are p01–p12", async () => {
      const request = new Request("http://localhost/api/products", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const data = (await response.json()) as any;

      const ids = data.items.map((p: any) => p.id);
      expect(ids.sort()).toEqual(["p01", "p02", "p03", "p04", "p05", "p06", "p07", "p08", "p09", "p10", "p11", "p12"]);
    });

    it("currency is always USD", async () => {
      const request = new Request("http://localhost/api/products", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const data = (await response.json()) as any;

      expect(data.items.every((p: any) => p.currency === "USD")).toBe(true);
    });

    it("categories are exactly: home, tech, toys, books", async () => {
      const request = new Request("http://localhost/api/products", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const data = (await response.json()) as any;

      const categories = new Set(data.items.map((p: any) => p.category));
      expect(categories.size).toBe(4);
      expect(categories.has("home")).toBe(true);
      expect(categories.has("tech")).toBe(true);
      expect(categories.has("toys")).toBe(true);
      expect(categories.has("books")).toBe(true);
    });

    it("exactly 2 products are out of stock", async () => {
      const request = new Request("http://localhost/api/products", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const data = (await response.json()) as any;

      const outOfStock = data.items.filter((p: any) => !p.inStock);
      expect(outOfStock.length).toBe(2);
    });

    it("exactly 3 products per category", async () => {
      const request = new Request("http://localhost/api/products", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const data = (await response.json()) as any;

      const byCat = { home: 0, tech: 0, toys: 0, books: 0 };
      data.items.forEach((p: any) => {
        (byCat as any)[p.category]++;
      });

      expect(byCat.home).toBe(3);
      expect(byCat.tech).toBe(3);
      expect(byCat.toys).toBe(3);
      expect(byCat.books).toBe(3);
    });

    it("prices are between 500 and 20000 cents", async () => {
      const request = new Request("http://localhost/api/products", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const data = (await response.json()) as any;

      expect(data.items.every((p: any) => p.priceCents >= 500 && p.priceCents <= 20000)).toBe(true);
    });
  });

  describe("security and caching behavior", () => {
    it("all responses include security headers", async () => {
      const endpoints = ["/", "/api/products", "/api/products/p01", "/health"];

      for (const endpoint of endpoints) {
        const request = new Request(`http://localhost${endpoint}`, { method: "GET" });
        const response = await worker.fetch(request, mockEnv);

        expect(response.headers.get("x-content-type-options")).toBe("nosniff");
        expect(response.headers.get("referrer-policy")).toBe("no-referrer");
        expect(response.headers.get("x-frame-options")).toBe("DENY");
        expect(response.headers.get("content-security-policy")).toBeTruthy();
      }
    });

    it("API responses set cache control", async () => {
      const endpoints = ["/api/products", "/api/products/p01"];

      for (const endpoint of endpoints) {
        const request = new Request(`http://localhost${endpoint}`, { method: "GET" });
        const response = await worker.fetch(request, mockEnv);

        expect(response.headers.get("cache-control")).toBe("public, max-age=60");
      }
    });

    it("health endpoint has no cache header", async () => {
      const request = new Request("http://localhost/health", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);

      expect(response.headers.get("cache-control")).toBeNull();
    });

    it("API responses have correct content-type", async () => {
      const request = new Request("http://localhost/api/products", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);

      expect(response.headers.get("content-type")).toBe("application/json; charset=utf-8");
    });

    it("HTML response has correct content-type", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);

      expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");
    });
  });

  describe("environment-specific behavior", () => {
    it("sandbox shows SANDBOX badge", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, { ENVIRONMENT: "sandbox" });
      const html = await response.text();

      expect(html).toContain("SANDBOX");
    });

    it("production hides badge", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, { ENVIRONMENT: "production" });
      const html = await response.text();

      expect(html).not.toContain('class="badge"');
    });

    it("health endpoint reports correct environment", async () => {
      let response = await worker.fetch(new Request("http://localhost/health"), { ENVIRONMENT: "sandbox" });
      let data = (await response.json()) as any;
      expect(data.environment).toBe("sandbox");

      response = await worker.fetch(new Request("http://localhost/health"), { ENVIRONMENT: "production" });
      data = await response.json();
      expect(data.environment).toBe("production");
    });
  });
});
