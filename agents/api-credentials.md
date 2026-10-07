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

Earlier versions of SandBase stored workspace-, Agent-, or Service-scoped credentials and injected them as environment variables such as `GITHUB_TOKEN`. That model has been retired and its records are not migrated. Recreate the values you still need as Secrets on MCP connections.

## With the API

Create, rotate, and revoke Secrets with the Secrets API. This guide documents the API contract; the Console's **Developer → Credentials** page is not the reference for Secret behavior.

Create a Secret. `Idempotency-Key` is required for every Secret write.

```bash
curl -X POST https://api.sandbase.ai/v1/secrets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": "'"$GITHUB_MCP_TOKEN"'"}'
```

The response is `201 Created` with a `sec_` ID and `status` (`pending` while the token is stored, then `active`). Use the ID as `secret_id` when you [create the MCP connection](/api-reference/mcp-connections/#create-a-connection).

| Task | Request |
|---|---|
| List Secrets | `GET /v1/secrets` |
| Read one | `GET /v1/secrets/{secret_id}` |
| Rotate the token | `POST /v1/secrets/{secret_id}/rotate` with `{"token": "…", "row_version": …}` |
| Revoke | `DELETE /v1/secrets/{secret_id}` (returns 204; status becomes `disabled`) |

Rotation keeps the same Secret and URL. New Sessions use the new token; Sessions that already started keep the credential they froze. Revocation is permanent and blocks both new Sessions and further input to existing Sessions that use the Secret.

## Security

- Create and rotate Secrets from a trusted backend, never from browser code.
- Read tokens from your own secret store or environment, as in `$GITHUB_MCP_TOKEN` above, rather than pasting them into scripts.
- Keep tokens out of instructions, Session input, metadata, and Skill bundles.
- Revoke a Secret as soon as its token may have leaked, then create a new one and replace the connection.

## Next steps

- [Skills and MCP tools](/agents/mcp-tools)
- [Secrets API](/api-reference/secrets/)
- [MCP Connections API](/api-reference/mcp-connections/)
