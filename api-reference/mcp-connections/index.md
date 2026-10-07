---
title: MCP Connections API
description: Register remote HTTPS MCP servers that Agents can call.
---
# MCP Connections API

An MCP connection registers a remote MCP server reachable over HTTPS. Agents reference connections in `mcp_connections`; each Session freezes the connection configuration when it starts. Connection IDs use the `mcp_` prefix. To authenticate to the server with a Bearer token, first create a [Secret](/api-reference/secrets/) for the same URL.

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [Create a connection](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [List connections](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [Get a connection](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [Replace a connection](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [Enable a connection](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [Disable a connection](#disable-a-connection) |

Every write requires `Idempotency-Key` (1-128 characters). The connection object has `id`, `name`, `server_url`, `secret_id` (when set), `status` (`active` or `disabled`), `row_version`, `created_at`, and `updated_at`.

## Create a connection

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` is required, up to 128 characters.
- `server_url` must be HTTPS without user info, query, or fragment (up to 2048 characters).
- `secret_id` is optional. Omit it for an anonymous server. When set, the Secret must be `active` and its `server_url` must equal this `server_url` exactly, otherwise the request fails (409 for an inactive Secret, 400 for a URL mismatch).

Returns `201 Created`.

## List connections

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Offset pagination with `data`, `total`, `limit`, and `offset`.

## Get a connection

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## Replace a connection

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT` replaces `name`, `server_url`, and `secret_id` together; omitting `secret_id` makes the connection anonymous. `row_version` must match the current value. A disabled connection stays disabled after replacement until you enable it.

## Enable a connection

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

Enabling keeps the same connection ID. It does not restore a revoked Secret; replace the connection with a new active Secret first.

## Disable a connection

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

Returns `204 No Content` and sets `status` to `disabled`. New Sessions cannot use the connection, and existing Sessions that froze it reject further input. A tool call that is already running is not interrupted.

## Changes and running Sessions

Sessions freeze connection settings when they start. After you replace a connection or rotate its Secret, new Sessions use the new configuration and existing Sessions keep their snapshot. Disabling the connection or revoking its Secret blocks both new Sessions and further input to existing ones.
