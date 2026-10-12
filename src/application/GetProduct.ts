import { Product } from "../domain/Product";
import { ProductRepository } from "../domain/ProductRepository";

export class GetProduct {
  constructor(private repository: ProductRepository) {}

  execute(id: string): Product {
    const product = this.repository.findById(id);
    if (!product) {
      throw new NotFoundError(`Product ${id} not found`);
    }
    return product;
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
