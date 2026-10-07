---
title: Invoke a Service through MCP
description: Connect to a SandBase Service with the MCP JSON-RPC transport and close its transport state.
---

# Invoke a Service through MCP

MCP is an invocation transport for a Service. It is available only when the Service was created with `mcp` in its `protocols` array; it does not create a separate MCP resource.

## Connect

`POST /v1/endpoints/{endpoint_id}/mcp`

Send standard MCP JSON-RPC messages with a SandBase API key. Start with `initialize`, then use the negotiated session and capability methods supported by the Service.

```bash
curl -X POST https://api.sandbase.ai/v1/endpoints/ep_01.../mcp \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"my-app","version":"1.0.0"}}}'
```

The response is a standard MCP JSON-RPC result or error. A streaming response may use newline-delimited JSON; process each complete JSON message independently.

The Service must be active and include the `mcp` protocol. A Service configured only for `rest` or `acp` cannot be invoked through this transport.

## Read MCP results

MCP responses are transport messages, not a separate result resource. For a Service invocation
that creates or continues a SandBase Session, use the returned `session_id` (when present) with
the Session APIs to retrieve persisted Agent messages and tool events:

```bash
curl "https://api.sandbase.ai/v1/sessions/sess_01.../events?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Use [`GET /v1/sessions/{id}/events/stream`](/api-reference/sessions/stream) for live SSE
updates, or [`GET /v1/sessions/{id}`](/api-reference/sessions/get) to inspect Session status.
There is no `/v1/endpoints/{endpoint_id}/result` endpoint and no provider-specific result URL;
keep IDs opaque and follow the Session event history.

## Close the transport

`DELETE /v1/endpoints/{endpoint_id}/mcp`

Close and clean up MCP transport state for the Service. This does not delete or disable the Service. A successful request returns `204 No Content`.

See [Services API](/api-reference/endpoints/) for Service lifecycle operations and the [Services guide](/agents/services) for product guidance.
