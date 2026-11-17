# Documentation deployment

Production documentation is served from Cloudflare Workers Static Assets at
`https://www.sandbase.ai/docs/`. The Worker entry point is `worker/index.js`;
the VitePress output is uploaded from `.vitepress/dist` as configured in
`wrangler.jsonc`.

## Credential boundary

The private `sandbase-lab/lab-production` repository owns production releases.
Only its fresh publishing job receives `DOCS_CLOUDFLARE_DEPLOY_TOKEN`, an
account-owned token with Editor access only to the existing `sandbase-docs`
Worker. No Cloudflare token or controller write credential belongs in this
source repository or its `production` environment. Source code, npm installs,
validation and bundling run in a separate job without a Cloudflare token.

Public Chatwoot widget settings are preserved in controller secrets
`DOCS_CHATWOOT_BASE_URL` and `DOCS_CHATWOOT_WEBSITE_TOKEN`. Analytics build values
are controller variables `DOCS_GA_MEASUREMENT_ID`, `DOCS_POSTHOG_KEY` and
`DOCS_POSTHOG_HOST`; these are intentionally included in the public client bundle.

## Release

Run `npm run release:merge -- <PR-number>` with your own authenticated `gh`
identity. It requires a current, validated main PR and controller write access,
merges the exact validated head, dispatches its merge commit to the controller's
`docs.yml` on main, and waits for the production result. Use
`npm run deploy -- <40-character-main-SHA>` for an existing main commit.

Main pushes, pull requests, manual source CI and `docs-v*` tags validate only;
they do not publish. The controller independently runs all `npm run validate`
checks, bundles the Worker, transfers a hashed package, rejects unsafe paths,
hooks and configuration changes, and uploads with pinned Wrangler `--no-bundle`.
It promotes exactly the uploaded version without reconciling routes or DNS.
Releases are serialized without cancelling queued releases.

The live check requires `/docs/deployment.json` to match the requested source,
then checks the health URL, home pages, OpenAPI, sitemap, representative guide,
mount redirect and an unauthenticated Sandbox proxy rejection. A green source
validation run is not proof that production has deployed.

Controller `verify_only=true` rehearses the build, transfer, package verification
and Wrangler upload dry run without production credentials. Source route or
binding changes require separate controller review; the current `/docs` routes
remain established infrastructure, not part of each content release.

## Rollback

Use `npm run deploy -- <previous-main-SHA>` to republish a known source revision
through the same checks, or use the Cloudflare Worker deployment history for
an emergency version rollback. Verify `/docs/health`, the source marker and a
representative API-reference URL afterward. The former self-hosted Kubernetes
rollback workflow is retired because it does not publish the current Worker.

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
