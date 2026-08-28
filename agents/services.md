---
title: Services
description: Publish a tested Agent as a stable REST, MCP, or ACP Service.
---

# Services

A **Service** makes a tested Agent version callable from an application or another supported client. In the public API, the underlying resource keeps the compatibility name `endpoint`: Service management and invocation use `/v1/endpoints` and `ep_` IDs. Public invocation uses REST, MCP, or experimental ACP according to the Service's `protocols` setting.

## When to create a Service

Create one when the Agent and its input contract are tested and an external caller needs a stable invocation URL. A Service is pinned to a selected Agent version. Publishing a newer Agent version does not silently change the Service; upgrade its binding deliberately.

## Invoke a Service

```bash
curl -X POST https://api.sandbase.ai/v1/endpoints/ep_01.../run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input":"Prepare a sourced customer brief."}'
```

Omit `session_id` to create a Session. To continue one, provide a Session previously created by the same Service and still bound to the same Agent version. A successful request returns `202 Accepted` with the persistent `session_id` and accepted event metadata; it does not create a DeploymentRun.

## Connect through MCP

For MCP clients, include `mcp` in the Service's `protocols` and send MCP JSON-RPC messages to `POST /v1/endpoints/{endpoint_id}/mcp`. Initialize the connection before calling tools. Use `DELETE /v1/endpoints/{endpoint_id}/mcp` to close transport state; this does not delete the Service. See [Invoke a Service through MCP](/api-reference/endpoints/mcp) for the request envelope and response behavior.

## API compatibility names

| Product | API path name | API prefix |
|---|---|---|
| Service | `endpoint` | `/v1/endpoints` |
| Schedule | Deployment | `/v1/deployments` |

## Next steps

- [Services API](/api-reference/endpoints/)
- [Sessions](/agents/sessions)
- [Schedules](/agents/schedules)
