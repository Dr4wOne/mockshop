import { Product } from "../domain/Product";
import { ProductRepository, ProductFilter, filterProducts } from "../domain/ProductRepository";

export class ListProducts {
  constructor(private repository: ProductRepository) {}

  execute(filter: ProductFilter): { items: Product[]; total: number } {
    const all = this.repository.listAll();
    const items = filterProducts(all, filter);
    return { items, total: items.length };
  }
}
