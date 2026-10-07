---
title: Secrets API
description: Store write-only Bearer tokens for MCP connections.
---
# Secrets API

A Secret stores a Bearer token for one MCP server URL. [MCP connections](/api-reference/mcp-connections/) reference it with `secret_id`, and the execution environment sends the token to that server. Secret IDs use the `sec_` prefix. The token is write-only: no response ever contains it.

Secrets are not environment variables. They are never injected into the Agent runtime and only authenticate MCP calls to the bound `server_url`.

::: warning Server-side only
Secret endpoints take a SandBase API key and a plaintext token. Call them from a trusted backend, never from browser code.
:::

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/secrets` | [Create a Secret](#create-a-secret) |
| `GET` | `/v1/secrets` | [List Secrets](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Get a Secret](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [Rotate the token](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Revoke a Secret](#revoke-a-secret) |

Every write requires `Idempotency-Key` (1-128 characters). The Secret object has `id`, `name`, `kind`, `server_url`, `status`, `row_version`, `created_at`, and `updated_at`. `status` is `pending` while the token is being stored, `active` when it can be used, and `disabled` after revocation.

## Create a Secret

```bash
curl -X POST https://api.sandbase.ai/v1/secrets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": "'"$GITHUB_MCP_TOKEN"'"}'
```

- `kind` must be `mcp_bearer`.
- `server_url` must be HTTPS without user info, query, or fragment. The Secret only works for this exact URL; to use another URL, create another Secret.
- `name` is up to 128 characters; `token` is up to 16384 characters.

Returns `201 Created` without the token.

## List Secrets

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Offset pagination with `data`, `total`, `limit`, and `offset`.

## Get a Secret

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## Rotate a Secret

```bash
curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-rotate-1" \
  -H "Content-Type: application/json" \
  -d '{"token": "'"$GITHUB_MCP_TOKEN"'", "row_version": 2}'
```

Rotation replaces the token for the same `server_url`. The Secret must be `active` and `row_version` must match. Returns `201 Created`. New Sessions use the new token; existing Sessions keep the credential they froze.

## Revoke a Secret

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

Returns `204 No Content` and sets `status` to `disabled`. Connections that use the Secret stop working for new Sessions and for further input to existing Sessions. Revocation cannot be undone: create a new Secret and replace the connection.
