import { ListProducts } from "../application/ListProducts";
import { GetProduct, NotFoundError } from "../application/GetProduct";
import { ProductRepository } from "../domain/ProductRepository";
import { VALID_CATEGORIES } from "../domain/constants";
import { HtmlRenderer } from "../adapters/HtmlRenderer";
import { SecurityHeaders } from "./SecurityHeaders";

export class Router {
  private listProducts: ListProducts;
  private getProduct: GetProduct;
  private renderer: HtmlRenderer;
  private securityHeaders: SecurityHeaders;

  constructor(repository: ProductRepository) {
    this.listProducts = new ListProducts(repository);
    this.getProduct = new GetProduct(repository);
    this.renderer = new HtmlRenderer();
    this.securityHeaders = new SecurityHeaders();
  }

  async handle(request: Request, environment: string): Promise<Response> {
    const url = new URL(request.url);

    try {
      if (url.pathname === "/health") {
        return this.handleHealth(environment);
      }

      if (url.pathname === "/api/products") {
        return this.handleListProducts(request, url);
      }

      if (url.pathname.startsWith("/api/products/")) {
        return this.handleGetProduct(request, url);
      }

      if (url.pathname === "/" && request.method === "GET") {
        return this.handleHomePage(url, environment);
      }

      return new Response("Not found", { status: 404 });
    } catch (error) {
      return this.securityHeaders.json({ error: "internal_server_error" }, { status: 500 });
    }
  }

  private handleHealth(environment: string): Response {
    return this.securityHeaders.json({ status: "ok", environment });
  }

  private handleListProducts(request: Request, url: URL): Response {
    if (request.method !== "GET") {
      return this.securityHeaders.json({ error: "method_not_allowed" }, { status: 405 });
    }

    const category = url.searchParams.get("category");
    const inStock = url.searchParams.get("inStock") === "true";

    if (category && !VALID_CATEGORIES.includes(category as any)) {
      return this.securityHeaders.json({ error: "invalid_category" }, { status: 400 });
    }

    const result = this.listProducts.execute({
      category: (category as any) || undefined,
      inStock: inStock || undefined,
    });

    return this.securityHeaders.json(result, { headers: { "cache-control": "public, max-age=60" } });
  }

  private handleGetProduct(request: Request, url: URL): Response {
    if (request.method !== "GET") {
      return this.securityHeaders.json({ error: "method_not_allowed" }, { status: 405 });
    }

    const id = url.pathname.split("/")[3] ?? "";

    try {
      const product = this.getProduct.execute(id);
      return this.securityHeaders.json(product, { headers: { "cache-control": "public, max-age=60" } });
    } catch (error) {
      if (error instanceof NotFoundError) {
        return this.securityHeaders.json({ error: "not_found" }, { status: 404 });
      }
      throw error;
    }
  }

  private handleHomePage(url: URL, environment: string): Response {
    const category = url.searchParams.get("category");

    if (category && !VALID_CATEGORIES.includes(category as any)) {
      return new Response("Invalid category", { status: 400 });
    }

    const result = this.listProducts.execute({ category: (category as any) || undefined });
    const html = this.renderer.render(result.items, category || undefined, environment);

    return this.securityHeaders.html(html);
  }
}
