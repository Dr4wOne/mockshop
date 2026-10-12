import { Router } from "./delivery/Router";
import { JsonProductRepository } from "./adapters/JsonProductRepository";

export interface Env {
  ENVIRONMENT?: string;
}

const repository = new JsonProductRepository();
const router = new Router(repository);

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const environment = env.ENVIRONMENT ?? "local";
    return router.handle(request, environment);
  },
};
