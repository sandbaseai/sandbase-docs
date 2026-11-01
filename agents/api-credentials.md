---
title: Credentials for MCP tools
description: Store write-only Bearer tokens as Secrets so Agents can call authenticated MCP servers.
---

# Credentials for MCP tools

When an MCP server requires authentication, store its Bearer token as a **Secret** and attach the Secret to an [MCP connection](/agents/mcp-tools#mcp-connections). The execution environment sends the token only to that server.

## How Secrets work

- `kind` is always `mcp_bearer`: a Bearer token for one MCP server.
- Each Secret is bound to one exact `server_url`. A connection can use it only when its `server_url` matches. To use another URL, create another Secret.
- The token is write-only. The API returns the Secret's name, URL, status, and `row_version`, never the token.
- Secrets are not environment variables. They are not injected into the Agent runtime, and Agents cannot read them.

Earlier versions of SandBase stored workspace- or Agent-scoped credentials and injected them as environment variables such as `GITHUB_TOKEN`. That model has been retired and its records are not migrated. Recreate the values you still need as Secrets on MCP connections.

## With the API
Create, rotate, and revoke Secrets with the API. This guide is the API contract; the Console's Credentials page, opened from the Agent editor, is not the reference for Secret behavior. Call these endpoints from a trusted backend, never from browser code: they take a SandBase API key and a plaintext token.

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/secrets` | [Create a Secret](#create-a-secret) |
| `GET` | `/v1/secrets` | [List Secrets](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Get a Secret](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [Rotate the token](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Revoke a Secret](#revoke-a-secret) |

Every write requires `Idempotency-Key` (1-128 bytes, without leading or trailing whitespace). The Secret object has `id` (`sec_` prefix), `name`, `kind`, `server_url`, `status`, `row_version`, `created_at`, and `updated_at`. `status` is `pending` while the token is being stored, `active` when it can be used, and `disabled` after revocation. `created_at` and `updated_at` are RFC 3339 timestamp strings.

### Create a Secret

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` must be `mcp_bearer`.
- `server_url` must be HTTPS without user info, query, or fragment. The Secret only works for this exact URL.
- `name` and `token` are required and nonblank. `name` is up to 128 bytes, `token` up to 16384 bytes, and `server_url` up to 2048 bytes.

The response is `201 Created` without the token. Use the `sec_` ID as `secret_id` when you [create the MCP connection](/api-reference/mcp-connections/#create-a-connection).

### List Secrets

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Offset pagination with `data`, `total`, `limit`, and `offset`. `limit` defaults to 20 and is capped at 200; missing, invalid, or nonpositive values use 20. `offset` defaults to 0; invalid or nonpositive values use 0. Advance by the returned `limit` until `offset + data.length >= total`. Disabled Secrets remain in the list.

### Get a Secret

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### Rotate a Secret

Set `SECRET_ROW_VERSION` to the latest `row_version` from Get a Secret.

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

Rotation replaces the token and keeps the same Secret and `server_url`. `token` and a positive integer `row_version` are required, the Secret must be `active`, and `row_version` must match the latest value. Returns `201 Created`. New Sessions use the new token; Sessions that already started keep the credential they froze.

### Revoke a Secret

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

Returns `204 No Content` and sets `status` to `disabled`. Connections that use the Secret stop working for new Sessions and for further input to existing Sessions. Revocation cannot be undone: create a new Secret and replace the connection.

### Errors and retries

Errors use the [Agents error envelope](/api-reference/errors#agents-platform-errors). Invalid fields or a missing write idempotency key return `400 invalid_request`; an unknown or inaccessible Secret returns `404 not_found`. A stale `row_version`, an incompatible lifecycle state, or reusing a create key with different input returns `409 conflict`. Read the Secret again before retrying, and use a new key for each new write.

## Security

- Create and rotate Secrets from a trusted backend, never from browser code.
- Read tokens from your own secret store or environment, as in `$GITHUB_MCP_TOKEN` above, rather than pasting them into scripts.
- Keep tokens out of instructions, Session input, metadata, and Skill bundles.
- Revoke a Secret as soon as its token may have leaked, then create a new one and replace the connection.

## Next steps

- [Skills and MCP tools](/agents/mcp-tools)
- [MCP Connections API](/api-reference/mcp-connections/)
