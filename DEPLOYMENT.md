# Documentation deployment

The documentation site owns its production image release in this repository.
Kubernetes manifests, Services, and Ingress remain owned by
`sandbaseai/sandbase-monorepo`; this workflow only updates the image of the
existing `sandbase-docs` Deployment.

## Required GitHub configuration

Create a protected `production` environment and make these secrets available
to this repository, either as repository secrets or selected organization
secrets:

- `CCR_USERNAME`
- `CCR_PASSWORD`
- `KUBECONFIG_PROD`
- `K8S_SERVER`

The self-hosted runner must provide Docker, Buildx, kubectl, and network access
to the production cluster and Tencent Cloud Container Registry.

## Release

Production releases use `.github/workflows/deploy.yaml` and are serialized by
the `deploy-docs-production` concurrency group.

- Push an immutable `docs-v*` tag whose commit belongs to `main`; or
- Run **Deploy Docs** manually from `main`.

Both paths build the VitePress site, publish an immutable `sha-<commit>` image
tag plus the release alias and `latest`, roll out `deployment/sandbase-docs`
using the SHA tag, verify the live image and ready endpoints, and check
`https://www.sandbase.ai/docs/health`.

## Rollback

Run **Rollback Docs** from `main` with a previously published `docs-v*` image
tag. The workflow verifies that the image exists before updating the existing
Deployment and waiting for the rollback to become ready.
