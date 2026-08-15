---
title: Sandbox Lifecycle Events
description: Track Sandbox lifecycle events through the Events API or SandBase webhooks.
---

# Sandbox Lifecycle Events

SandBase records lifecycle events when a Sandbox changes state. You can poll them with the Events API or have SandBase deliver matching events to a webhook endpoint.

## Event types

| Type | Emitted when |
|---|---|
| `sandbox.lifecycle.created` | A Sandbox is created. |
| `sandbox.lifecycle.updated` | Sandbox state or metadata is updated. |
| `sandbox.lifecycle.paused` | A Sandbox is paused. |
| `sandbox.lifecycle.resumed` | A paused Sandbox resumes. |
| `sandbox.lifecycle.killed` | A Sandbox is terminated. |
| `erouter.process.completed` | An ERouter process completes. |
| `erouter.skill.completed` | An ERouter skill completes. |

## Events API

All Events API calls use an API key:

```http
Authorization: Bearer $SANDBASE_API_KEY
```

### List events for a Sandbox

```bash
curl https://api.sandbase.ai/events/sandboxes/SANDBOX_ID \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### List events for your organization

```bash
curl "https://api.sandbase.ai/events/sandboxes?limit=10" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

| Query parameter | Description |
|---|---|
| `limit` | Maximum number of events to return. |

Example response from either Events API endpoint:

```json
[
  {
    "id": "evt_01...",
    "resourceType": "sandbox",
    "type": "sandbox.lifecycle.killed",
    "sandboxID": "sbx_01...",
    "data": {
      "reason": "timeout"
    },
    "createdAt": "2026-07-14T09:30:38Z"
  }
]
```

## Webhooks

Register an outbound Sandbox webhook with the Events API:

```bash
curl -X POST https://api.sandbase.ai/events/webhooks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sandbox monitor",
    "url": "https://example.com/hooks/sandbase",
    "resourceType": "sandbox",
    "events": ["sandbox.lifecycle.created", "sandbox.lifecycle.killed"],
    "signatureSecret": "whsec_replace-with-your-secret"
  }'
```

Set `events` to `[]`, or omit it, to subscribe to all current and future Sandbox events. An explicit non-empty list receives only the listed events. List and delete registrations at:

```text
GET    /events/webhooks
DELETE /events/webhooks/{webhookID}
```

You can also manage registrations from the [Dashboard Webhooks page](https://www.sandbase.ai/console/webhooks). It supports `session` webhooks too; Template and Model options are not available yet.

### Representative delivery payload

The delivery has `Content-Type: application/json`, `X-Event-ID`, and `X-Signature`. `X-Signature` is lowercase hexadecimal `HMAC-SHA256(signatureSecret, rawBody)`. A `2xx` response within 10 seconds is successful; receivers should deduplicate retries by `id` or `X-Event-ID`.

```json
{
  "id": "evt_01...",
  "resourceType": "sandbox",
  "resourceID": "sbx_01...",
  "type": "sandbox.lifecycle.killed",
  "sandboxID": "sbx_01...",
  "data": {},
  "createdAt": "2026-07-14T09:30:38Z"
}
```

For the complete Sandbox and Session event matrix, payload definition, and verification examples, see [Webhooks](/api-reference/webhooks).

## Next steps

- [Sandbox Lifecycle](/agents/sandbox-lifecycle)
- [Sandbox Persistence](/agents/sandbox-persistence)
- [Webhooks](/api-reference/webhooks)
