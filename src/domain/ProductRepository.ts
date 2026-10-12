import { Product, Category } from "./Product";

export interface ProductRepository {
  listAll(): Product[];
  findById(id: string): Product | undefined;
}

export interface ProductFilter {
  category?: Category;
  inStock?: boolean;
}

export function filterProducts(products: Product[], filter: ProductFilter): Product[] {
  return products.filter((p) => {
    if (filter.category && p.category !== filter.category) return false;
    if (filter.inStock && !p.inStock) return false;
    return true;
  });
}
