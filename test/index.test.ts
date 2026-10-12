import { describe, it, expect } from "vitest";
import worker from "../src/index";

const mockEnv = { ENVIRONMENT: "sandbox" };

describe("mockshop POC", () => {
  describe("GET /", () => {
    it("returns 200 with HTML home page", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);

      expect(response.status).toBe(200);
      expect(response.headers.get("content-type")).toBe("text/html; charset=utf-8");

      const html = await response.text();
      expect(html).toContain("Mock Shop");
      expect(html).toContain("SANDBOX");
      expect(html).toContain("Demo shop. Nothing here is real.");
    });

    it("displays product cards on home page", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const html = await response.text();

      expect(html).toContain("Cozy Blanket");
      expect(html).toContain("USB Hub");
      expect(html).toContain("Puzzle 500pc");
      expect(html).toContain("Poetry Collection");
    });

    it("shows Out of stock label for unavailable products", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const html = await response.text();

      expect(html).toContain("Out of stock");
    });

    it("filters by category: /?category=tech", async () => {
      const request = new Request("http://localhost/?category=tech", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);
      const html = await response.text();

      expect(response.status).toBe(200);
      expect(html).toContain("USB Hub");
    });

    it("rejects invalid category with 400", async () => {
      const request = new Request("http://localhost/?category=invalid", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);

      expect(response.status).toBe(400);
    });

    it("includes security headers on home page", async () => {
      const request = new Request("http://localhost/", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);

      expect(response.headers.get("x-content-type-options")).toBe("nosniff");
      expect(response.headers.get("referrer-policy")).toBe("no-referrer");
      expect(response.headers.get("x-frame-options")).toBe("DENY");
      expect(response.headers.get("content-security-policy")).toBeTruthy();
    });
  });

  describe("GET /api/products", () => {
    it("returns all products by default", async () => {
      const request = new Request("http://localhost/api/products", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);

      expect(response.status).toBe(200);
      const data = (await response.json()) as { items: any[]; total: number };
      expect(data.items.length).toBeGreaterThan(0);
      expect(data.total).toBeGreaterThan(0);
    });

    it("filters by category: /api/products?category=books", async () => {
      const request = new Request("http://localhost/api/products?category=books", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);

      const data = (await response.json()) as { items: any[] };
      expect(data.items.every((p: any) => p.category === "books")).toBe(true);
    });

    it("returns 400 for invalid category", async () => {
      const request = new Request("http://localhost/api/products?category=food", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);

      expect(response.status).toBe(400);
      const data = (await response.json()) as { error: string };
      expect(data.error).toBe("invalid_category");
    });

    it("filters by inStock=true", async () => {
      const request = new Request("http://localhost/api/products?inStock=true", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);

      const data = (await response.json()) as { items: any[] };
      expect(data.items.every((p: any) => p.inStock)).toBe(true);
    });

    it("sets cache headers", async () => {
      const request = new Request("http://localhost/api/products", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);

      expect(response.headers.get("cache-control")).toBe("public, max-age=60");
    });
  });

  describe("GET /api/products/{id}", () => {
    it("returns a single product", async () => {
      const request = new Request("http://localhost/api/products/p01", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);

      expect(response.status).toBe(200);
      const product = (await response.json()) as { id: string };
      expect(product.id).toBe("p01");
    });

    it("returns 404 for non-existent product", async () => {
      const request = new Request("http://localhost/api/products/p99", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);

      expect(response.status).toBe(404);
      const data = (await response.json()) as { error: string };
      expect(data.error).toBe("not_found");
    });
  });

  describe("GET /health", () => {
    it("returns status ok with environment", async () => {
      const request = new Request("http://localhost/health", { method: "GET" });
      const response = await worker.fetch(request, mockEnv);

      expect(response.status).toBe(200);
      const data = (await response.json()) as { status: string; environment: string };
      expect(data.status).toBe("ok");
      expect(data.environment).toBe("sandbox");
    });

    it("returns production environment when set", async () => {
      const request = new Request("http://localhost/health", { method: "GET" });
      const response = await worker.fetch(request, { ENVIRONMENT: "production" });

      const data = (await response.json()) as { environment: string };
      expect(data.environment).toBe("production");
    });
  });
});
