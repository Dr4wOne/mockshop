import { Product } from "../domain/Product";
import { ProductRepository } from "../domain/ProductRepository";
import { PRODUCTS } from "./seeds";

export class JsonProductRepository implements ProductRepository {
  listAll(): Product[] {
    return [...PRODUCTS];
  }

  findById(id: string): Product | undefined {
    return PRODUCTS.find((p) => p.id === id);
  }
}
