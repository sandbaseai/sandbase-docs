---
title: Endpoints API
description: Publish an Agent as a reusable REST, MCP, or experimental ACP Service.
---

# Endpoints API

An Endpoint is the API resource behind a SandBase **Service**. Its `protocols` may contain `rest`, `mcp`, or experimental `acp`. The response exposes `run_url`, `mcp_url`, and `acp_url`; callers must use only protocols enabled on that Endpoint.

::: info Session identity
Endpoint invocation accepts an optional `session_id`. When omitted, SandBase creates a persistent Session. When supplied, the message is appended to that Session. No public Run or Runtime Session identity is created.
:::

## Management endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/endpoints` | Create an Endpoint from an existing Agent and Environment, or from a declarative runtime definition. |
| `GET` | `/v1/endpoints` | List Endpoints with cursor pagination. |
| `GET` | `/v1/endpoints/{endpoint_id}` | Get an Endpoint. |
| `PATCH` or `POST` | `/v1/endpoints/{endpoint_id}` | Update an advanced Endpoint. Declarative definitions are immutable. |
| `DELETE` | `/v1/endpoints/{endpoint_id}` | Delete an Endpoint. |

For the advanced creation mode, `name` and `agent_id` are required. Optional fields include `agent_version`, `environment_id`, `slug`, `protocols`, and Session configuration. When `environment_id` is omitted, SandBase resolves or creates the Agent-owned Environment. A declarative definition instead provides `name` and `runtime`; it cannot be mixed with `agent_id` or `environment_id`.

## Invoke an Endpoint

`POST /v1/endpoints/{endpoint_id}/run`

```bash
curl -X POST https://api.sandbase.ai/v1/endpoints/ep_01.../run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input":"Research Acme and return a sourced brief."}'
```

The body accepts `input` or `content`, plus an optional `session_id`.

Each invocation sends a standard Session event. If `session_id` is omitted, SandBase first creates a Session fixed to the Endpoint's Agent version and Runtime Environment snapshot.

The response is `202 Accepted`:

```json
{
  "session_id": "sess_01...",
  "events": [{
    "id": "sevt_01...",
    "type": "user.message",
    "processed_at": "2026-08-05T10:00:00Z"
  }]
}
```

The Endpoint must be active and include the `rest` protocol.

Read history or stream results through the Session Events APIs using the returned `session_id`.

## Connect through MCP or ACP

- `POST /v1/endpoints/{endpoint_id}/mcp` handles MCP JSON-RPC for Endpoints with the `mcp` protocol. `DELETE` on the same URL performs MCP transport cleanup.
- `POST /v1/endpoints/{endpoint_id}/acp` handles the experimental ACP JSON-RPC transport for Endpoints with the `acp` protocol.

REST, MCP, and ACP are invocation protocols on the same Endpoint. They do not create separate Service resources.

See the [Service quickstart](/agents/endpoint-quickstart) for a complete create-and-invoke example.
