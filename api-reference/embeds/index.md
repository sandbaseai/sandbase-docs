---
title: Embed Configs API
description: Create and manage organization-scoped web chat widget configurations.
---

# Embed Configs API

An Embed Config binds an eligible Agent and Environment to a browser-facing chat widget. This API manages widget
configuration; it is distinct from the vector [`POST /v1/embeddings`](/api-reference/models/embedding) endpoint.

| Operation | Endpoint |
|---|---|
| [Create](./create) | `POST /v1/embeds` |
| [List](./list) | `GET /v1/embeds` |
| [Get](./get) | `GET /v1/embeds/{id}` |
| [Update](./update) | `PATCH /v1/embeds/{id}` |
| [Delete](./delete) | `DELETE /v1/embeds/{id}` |
| [Usage](./usage) | `GET /v1/embeds/{id}/usage` |

The `publishable_key` is intentionally safe to place in browser markup. It identifies one Embed Config and does not
replace the secret API key used to manage the configuration. Restrict `allowed_origins` before production use; an
empty or null allowlist permits every origin.

Each Agent supports at most 10 Embed Configs. The Agent and Environment binding is fixed after creation.
