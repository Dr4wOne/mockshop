# mockshop

Cloudflare Worker (TypeScript) created from the agents_pipeline `ts-worker` template.

```
npm install
make lint test
npx wrangler dev        # local dev server
```

Sandbox: `https://mockshop-sbx.dr4w.io`   Prod: `https://mockshop.dr4w.io`
Deploys go through the pipeline's `scripts/deploy.sh`, never `wrangler deploy` directly.
Put mock data in `src/seeds/` and keep it behind a port during the rewrite phase.
