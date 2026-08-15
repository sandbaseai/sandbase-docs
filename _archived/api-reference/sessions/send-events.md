---
title: Send Events
description: Send events (user messages, interrupts) to a session to drive agent execution.
---

# Send Events

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/v1/sessions/{session_id}/events</code>
</div>

Send one or more events to a session. Sending a `user.message` triggers the agent to run; `user.interrupt` stops a running agent.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session_id` | string | yes | The session ID (`sess_...`) |

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `events` | array | yes | Events to send to the session (at least one). |

## Input Event Types

### `user.message`

Send a user message. This is the primary way to drive the agent.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | yes | `"user.message"` |
| `content` | array | yes | Array of content blocks (see [Content Blocks](#content-blocks)) |

```json
{
  "type": "user.message",
  "content": [
    { "type": "text", "text": "Where is my order #1234?" }
  ]
}
```

### `user.interrupt`

Pause agent execution and return control to the user. The session transitions back to `idle`.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | yes | `"user.interrupt"` |

```json
{ "type": "user.interrupt" }
```

::: info Roadmap — tool result events
Claude also accepts `user.tool_confirmation` (approve/deny a tool call under an `always_ask` policy) and `user.custom_tool_result` (return a client-executed custom tool result). SandBase does not yet accept these event types — sending them returns `400 invalid_request`. They will be added alongside tool permission policies and custom tools.
:::

## Content Blocks

Content blocks are used in `user.message`.

### Text

```json
{ "type": "text", "text": "Hello" }
```

### Image

```jsonc
// Base64
{ "type": "image", "source": { "type": "base64", "media_type": "image/png", "data": "iVBOR..." } }

// URL
{ "type": "image", "source": { "type": "url", "url": "https://example.com/img.png" } }

// File reference
{ "type": "image", "source": { "type": "file", "file_id": "file_01abc..." } }
```

### Document

```jsonc
// Base64 (e.g. PDF)
{ "type": "document", "source": { "type": "base64", "media_type": "application/pdf", "data": "JVBER..." } }

// Plain text
{ "type": "document", "source": { "type": "text", "media_type": "text/plain", "data": "..." } }

// URL
{ "type": "document", "source": { "type": "url", "url": "https://example.com/doc.pdf" } }
```

Optional fields on document blocks: `title` (string), `context` (string, extra context for the model).

## Request Examples

::: code-group

```python [Python]
from anthropic import Anthropic

client = Anthropic(
    api_key="sk-sb-YOUR_KEY",
    base_url="https://api.sandbase.ai"
)

result = client.beta.sessions.events.send(
    session_id="sess_01abc...",
    events=[
        {
            "type": "user.message",
            "content": [{ "type": "text", "text": "Where is my order #1234?" }]
        }
    ]
)
print(result.data)
```

```bash [cURL]
curl -X POST https://api.sandbase.ai/v1/sessions/sess_01abc.../events \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": [
      { "type": "user.message", "content": [{ "type": "text", "text": "Where is my order #1234?" }] }
    ]
  }'
```

:::

## Response

Returns the events that were accepted, each with a server-assigned `id` and `processed_at`.

```json
{
  "data": [
    {
      "id": "sevt_01abc...",
      "type": "user.message",
      "content": [{ "type": "text", "text": "Where is my order #1234?" }],
      "stop_reason": null,
      "model_used": null,
      "tokens_in": 0,
      "tokens_out": 0,
      "duration_ms": null,
      "processed_at": "2026-05-29T10:00:00Z",
      "created_at": "2026-05-29T10:00:00Z"
    }
  ]
}
```

After sending a `user.message`, subscribe to [Stream Events](/api-reference/sessions/stream) to receive the agent's response, or poll [List Events](/api-reference/sessions/list-events).

## Errors

| Status | Type | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Invalid event format, missing fields, or unsupported event type |
| 401 | `authentication_error` | Invalid or missing API key |
| 404 | `not_found` | Session not found |
| 409 | `conflict` | Session is not idle (running), or terminated |
