import { describe, it, expect } from "vitest";
import { ListProducts } from "../../src/application/ListProducts";
import { GetProduct, NotFoundError } from "../../src/application/GetProduct";
import { ProductRepository } from "../../src/domain/ProductRepository";
import { Product } from "../../src/domain/Product";

class FakeRepository implements ProductRepository {
  private products: Product[] = [
    { id: "p1", name: "Item A", description: "Desc A", priceCents: 1000, currency: "USD", category: "home", inStock: true },
    { id: "p2", name: "Item B", description: "Desc B", priceCents: 2000, currency: "USD", category: "tech", inStock: false },
    { id: "p3", name: "Item C", description: "Desc C", priceCents: 3000, currency: "USD", category: "home", inStock: true },
  ];

  listAll(): Product[] {
    return [...this.products];
  }

  findById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }
}

describe("Application: ListProducts", () => {
  const repository = new FakeRepository();
  const useCase = new ListProducts(repository);

  it("returns all products without filter", () => {
    const result = useCase.execute({});
    expect(result.items).toHaveLength(3);
    expect(result.total).toBe(3);
  });

  it("filters by category", () => {
    const result = useCase.execute({ category: "home" });
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.items.every((p) => p.category === "home")).toBe(true);
  });

  it("filters by inStock", () => {
    const result = useCase.execute({ inStock: true });
    expect(result.items).toHaveLength(2);
    expect(result.total).toBe(2);
    expect(result.items.every((p) => p.inStock)).toBe(true);
  });

  it("filters by category and inStock together", () => {
    const result = useCase.execute({ category: "tech", inStock: true });
    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });

  it("returns correct total count", () => {
    const result1 = useCase.execute({});
    expect(result1.total).toBe(result1.items.length);

    const result2 = useCase.execute({ category: "home" });
    expect(result2.total).toBe(result2.items.length);
  });
});

describe("Application: GetProduct", () => {
  const repository = new FakeRepository();
  const useCase = new GetProduct(repository);

  it("returns product by id", () => {
    const result = useCase.execute("p1");
    expect(result.id).toBe("p1");
    expect(result.name).toBe("Item A");
  });

  it("throws NotFoundError for missing product", () => {
    expect(() => useCase.execute("p999")).toThrow(NotFoundError);
  });

  it("throws error with correct message", () => {
    expect(() => useCase.execute("p999")).toThrow("Product p999 not found");
  });

  it("returns product with complete data", () => {
    const result = useCase.execute("p2");
    expect(result).toEqual({
      id: "p2",
      name: "Item B",
      description: "Desc B",
      priceCents: 2000,
      currency: "USD",
      category: "tech",
      inStock: false,
    });
  });
});
