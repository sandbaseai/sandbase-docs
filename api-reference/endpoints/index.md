---
title: Services API
description: Publish an Agent as a reusable REST or experimental ACP Service.
---

# Services API

A **Service** publishes a tested Agent behind a stable callable interface. Service URLs and IDs retain the existing `/v1/endpoints` path and `ep_` prefix for API compatibility. Public invocation uses REST or the experimental ACP protocol.

::: info Session identity
Service invocation accepts an optional `session_id`. When omitted, SandBase creates a persistent Session. When supplied, the message is appended to that Session. No public Run or Runtime Session identity is created.
:::

## Service operations

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/v1/endpoints` | Create a Service from an existing Agent or from a declarative runtime definition. |
| `GET` | `/v1/endpoints` | List Services with cursor pagination. |
| `GET` | `/v1/endpoints/{endpoint_id}` | Get a Service. |
| `PATCH` or `POST` | `/v1/endpoints/{endpoint_id}` | Update an advanced Service. Declarative definitions are immutable. |
| `DELETE` | `/v1/endpoints/{endpoint_id}` | Delete a Service. |

For the advanced creation mode, `name`, `agent_id`, and an explicit non-empty `protocols` array are required by the public contract. A declarative definition similarly requires `name`, `runtime`, and `protocols`; it cannot be mixed with `agent_id` or `environment_id`. Public protocol values are `rest` and experimental `acp`. Always send the intended values instead of relying on server defaults. Optional advanced fields include `agent_version`, `environment_id`, `slug`, and Session configuration. `session_metadata` is copied to each newly created Session. `memory_config`, `resource_config`, and `vault_config` are reserved fields: SandBase stores and returns them, but does not currently apply them to Session execution. When `environment_id` is omitted, SandBase resolves or creates the Agent-owned Environment.

List requests support cursor pagination and `q` search across IDs, names, slugs, runtimes, Agent IDs, and Environment IDs. `search` is retained as an alias for `q`.

For advanced Services, update requests can change the name, slug, bound Agent or Environment, protocols, status, and Session configuration. When changing `agent_version`, include the currently bound version as `expected_agent_version` to protect against concurrent upgrades. Declarative Service definitions remain immutable.

### Create a Service

Create a Service with an existing Agent and an explicit public protocol list:

```bash
curl -X POST https://api.sandbase.ai/v1/endpoints \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research service",
    "agent_id": "agent_01...",
    "protocols": ["rest"]
  }'
```

The response is `201 Created`. Store its `id` (`ep_...`) for later management and invocation calls.

### List Services

```bash
curl "https://api.sandbase.ai/v1/endpoints?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Pass the returned opaque `next_page` value as `page` to request the next page. Do not parse or construct cursors.

### Get a Service

```bash
curl https://api.sandbase.ai/v1/endpoints/ep_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Check `status` before invocation and `protocols` before choosing REST or ACP. Returned URLs do not by themselves indicate that a protocol is enabled.

### Update a Service

```bash
curl -X PATCH https://api.sandbase.ai/v1/endpoints/ep_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"name":"Research service v2"}'
```

Use `PATCH` for new integrations. `POST /v1/endpoints/{endpoint_id}` is only a compatibility alias. An effective update returns `200 OK`.

### Delete a Service

```bash
curl -X DELETE https://api.sandbase.ai/v1/endpoints/ep_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

A successful deletion returns `200 OK` with `{ "id": "ep_01...", "deleted": true }`. This operation removes the Service; it is not the same as setting `status` to `disabled`.

## Invoke with REST

`POST /v1/endpoints/{endpoint_id}/run`

```bash
curl -X POST https://api.sandbase.ai/v1/endpoints/ep_01.../run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"input":"Research Acme and return a sourced brief."}'
```

The body accepts `input` or `content`, plus an optional `session_id`.

Each invocation sends a standard Session event. If `session_id` is omitted, SandBase first creates a Session fixed to the Service's Agent version and Runtime Environment snapshot.

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

The Service must be active and include the `rest` protocol.

Read history or stream results through the Session Events APIs using the returned `session_id`.

## Invoke with ACP

`POST /v1/endpoints/{endpoint_id}/acp` handles the experimental ACP JSON-RPC transport for Services with the `acp` protocol.

The implemented methods are `initialize`, `session/new`, `session/prompt`, and `session/cancel`. `session/new` returns a canonical `sess_*` Session ID. `session/prompt` returns `application/x-ndjson`: zero or more `session/update` notifications followed by the final JSON-RPC result. See [Invoke with ACP](./acp) for the request envelopes.

REST and ACP are invocation protocols on the same Service.

See the [Services guide](/agents/services) for product guidance, or use the management and invocation examples on this page.
