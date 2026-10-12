import { SECURITY_HEADERS } from "../domain/constants";

export class SecurityHeaders {
  json(data: unknown, init?: ResponseInit): Response {
    return new Response(JSON.stringify(data), {
      ...init,
      headers: {
        "content-type": "application/json; charset=utf-8",
        ...SECURITY_HEADERS,
        ...init?.headers,
      },
    });
  }

  html(html: string): Response {
    return new Response(html, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        ...SECURITY_HEADERS,
      },
    });
  }
}
