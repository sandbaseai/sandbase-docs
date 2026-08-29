# Documentation deployment

Production documentation is served from Cloudflare Workers Static Assets at
`https://www.sandbase.ai/docs/`. The Worker entry point is `worker/index.js`;
the VitePress output is uploaded from `.vitepress/dist` as configured in
`wrangler.jsonc`.

## Required GitHub configuration

The `production` environment must provide `CLOUDFLARE_API_TOKEN`. The account
ID and route configuration are declared in `wrangler.jsonc` and the workflow.

## Release

Production releases use `.github/workflows/deploy.yaml` and are serialized by
the `deploy-docs-production` concurrency group. The workflow builds the site,
uploads it with `wrangler deploy`, and verifies `/docs/health`. It does not
cancel an earlier deployment in the same queue (`cancel-in-progress: false`).

- Push an immutable `docs-v*` tag whose commit belongs to `main`; or
- Run **Deploy Docs** manually from `main`.

Both paths build and publish the VitePress static assets to Cloudflare Workers,
then verify `https://www.sandbase.ai/docs/health` with retries.

## Rollback

Use the Cloudflare dashboard's Worker deployment history to roll back to a
previous version. Verify `/docs/health` and a representative API-reference URL
after the rollback.
