# PROJECT_STATE: mockshop

**Updated**: 2026-10-12  
**Mode**: NEW  
**Stack**: TypeScript on Cloudflare Workers  
**Architecture**: Small service (single-file POC, will refactor to clean layers in phase 3)

## Current phase
✅ **Phase 2: POC COMPLETE** → Phase 3: Rewrite pending

## Status
| Phase | State | Notes |
|---|---|---|
| 0 Preflight | ✅ DONE | 0 FAIL, 2 WARN (expected) |
| 1 Plan | ✅ DONE | Approved 2026-10-12 |
| 2 POC | ✅ DONE | 15/15 tests passing, build succeeds, local dev works |
| 3 Rewrite | ⏳ NEXT | Characterization tests → layers + full test coverage |
| 4 Sandbox deploy | pending | Via `scripts/deploy.sh sandbox mockshop` |
| 5 Online verification | pending | Smoke tests against mockshop-sbx.dr4w.io |
| 6 Prod gate | pending | Request approval with evidence |
| 7 Report | pending | Delivery report |

## POC Summary

### What works
- **Home page** (GET /): server-rendered HTML, responsive grid, category filter (link-based)
  - 12 product cards displayed with name, description, price ($X.XX), color block per category
  - Category filter buttons (All, Home, Tech, Toys, Books) with active state
  - Out-of-stock labels visible
  - Environment badge "SANDBOX" visible (will hide in rewrite for prod)
  - Footer: "Demo shop. Nothing here is real."
  - Inline CSS (~1 KB), all responsive

- **API endpoints** fully working:
  - `GET /api/products` — lists all 12, optional filters: `?category=tech`, `?inStock=true`
  - `GET /api/products/{id}` — single product by ID (p01–p12), returns 404 for invalid IDs
  - `GET /health` — returns status and environment (sandbox/production)
  - Invalid category returns 400 with `{ error: "invalid_category" }`
  
- **Security headers** on all responses:
  - x-content-type-options: nosniff ✓
  - referrer-policy: no-referrer ✓
  - x-frame-options: DENY ✓
  - content-security-policy: default-src 'self'; style-src 'unsafe-inline' (will improve in rewrite with nonce)

- **Caching**:
  - API products: cache-control: public, max-age=60 ✓

- **Tests**: 15/15 passing ✓
  - Happy path: GET /, filter by category, product cards visible, API list/filter/single
  - Error paths: invalid category (400), missing product (404), method not allowed (405)
  - Security headers verified on all responses
  - Contract tests cover all 6 user stories

### What is deliberately mocked / missing (for rewrite)

1. **No client-side JS yet** — filtering via page reload (link-based). Will add optional vanilla JS in rewrite for smoothness.

2. **Single-file implementation** — everything in `src/index.ts`. Will refactor to clean layers:
   - `domain/` (Product, Category, pure functions)
   - `application/` (ListProducts, GetProduct use cases)
   - `adapters/` (JsonProductRepository, HtmlRenderer, JsonPresenter)
   - `delivery/` (router, security headers, error mapping)
   - `index.ts` (composition root)

3. **No characterization tests yet** — snapshots will lock POC behavior before refactoring in phase 3.

4. **CSP hardened in rewrite** — currently `style-src 'unsafe-inline'`, will use nonce-based CSP.

5. **No data separation** — products hardcoded inline. Will move to `src/data/products.json` in rewrite for clarity.

6. **No environment-specific config** — uses env vars from wrangler.toml (ENVIRONMENT=sandbox|production).

## Decisions Made

| Date | Decision | Rationale |
|---|---|---|
| 2026-10-12 | Environment badge: **remove in prod** | Clean URL; feature is dev-only |
| 2026-10-12 | Product sort: **natural order** (products.json) | Simplicity; no alphabetic/price sorting needed for MVP |
| 2026-10-12 | JS fallback: **link-based filtering** | Page reload acceptable for demo; can enhance later |
| 2026-10-12 | Single file POC | Fast iteration; clear refactoring boundary before phase 3 |

## Build & Test Results

```
npm install       ✓ 80 packages added
npm run lint      ✓ TypeScript strict mode (tsc --noEmit)
npm test          ✓ 15 tests passed, all user stories covered
npm run build     ✓ No errors, strict types
npm run dev       ✓ Local server on http://localhost:8787

Test coverage:    N/A (POC), will measure in phase 3
Build size:       N/A (not deployed yet)
Response time:    ~9ms locally (GET /, 1.5 KB HTML)
```

## Environments
| Env | URL | Status | Cost |
|---|---|---|---|
| local | http://localhost:8787 | ✅ Running | $0 |
| sandbox | mockshop-sbx.dr4w.io | ⏳ Not deployed yet | $0 (free tier) |
| prod | mockshop.dr4w.io | ⏳ Not deployed yet | $0 (free tier) |

## Next Steps

**Phase 3: Rewrite to standard** (starting after approval):
1. Lock POC behavior with characterization tests (snapshot: HTML, API responses)
2. Refactor to clean architecture layers (domain → application → adapters → delivery)
3. Implement CSP with nonce-based inline script (security improvement)
4. Add full test suite: unit (domain, use cases) + contract (all endpoints), target 80%+ coverage
5. Optional: add vanilla JS for smoother filtering (no reload)
6. Final: linting, coverage report

**Phase 4+**: Sandbox deploy → verify → prod approval → prod deploy → report
- <command> → <pass/fail counts>, <date>

## Still mocked
- <what> — <where the seed lives> — <what will replace it>

## Open items / blockers
- [ ] <item>

## Rollback
<how to roll back the last deploy>
