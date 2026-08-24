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

`POST` and `PUT` on `/v1/embeds/{id}` are retained as compatibility aliases for `PATCH` and have the same partial-update behavior.

The `publishable_key` is intentionally safe to place in browser markup. It identifies one Embed Config and does not
replace the secret API key used to manage the configuration. Restrict `allowed_origins` before production use; an
empty or null allowlist permits every origin.

Each Agent supports at most 10 Embed Configs, including disabled configurations. The Agent and Environment binding is fixed after creation. Enabled configurations are revalidated on update. If a binding later becomes ineligible, the only accepted update is `{ "enabled": false }` by itself; presentation or origin changes cannot be combined with that recovery update.

The usage endpoint's historical `message_count` field counts all persisted Session Event records, not only user or assistant message events.
