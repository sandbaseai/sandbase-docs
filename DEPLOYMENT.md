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

## Sandbox Playground

`/docs/sandbox/playground` uses the stateless Worker route `/docs/_sandbox/*`.
Deploy the Worker and its static assets together. Static-only Nginx hosting
cannot execute the Playground proxy. No Sandbox service key or new Secret
binding is required: each visitor provides their own key, kept in page memory
and forwarded only to the fixed Sandbox service. Do not enable request-body
or credential-header logging for this route. The proxy disables caching,
rejects cross-origin browser callers, and supports only its explicit routes.

`npm run dev` and `npm run preview` install the same proxy handler locally.
Where Node requires the machine's existing HTTP proxy, use Node 24+ with
`NODE_USE_ENV_PROXY=1`; do not bake a local proxy address into the Worker.
Run `npm run test:sandbox-playground` before release. Production read-only
checks do not establish real lifecycle, command, file or billing acceptance.
