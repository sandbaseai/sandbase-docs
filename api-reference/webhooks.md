---
title: Webhooks
description: Register and manage SandBase webhooks for Sandbox, Agent Session, and asynchronous model events.
---

# Webhooks

SandBase supports two outbound callback modes:

- **Registered webhooks** are scoped to your organization, subscribe to Sandbox, Session, or asynchronous Model events, and include an HMAC `X-Signature`.
- **Per-task model callbacks** use `webhook_url` on one asynchronous image, video, or audio request. They do not require registration and do not include `X-Signature`.

Both modes use at-least-once delivery. Make handlers idempotent with the event ID.

## Register a webhook

The Events API is the public API-key surface:

```text
POST https://api.sandbase.ai/events/webhooks
```

You can also create and manage webhooks from the [Dashboard Webhooks page](https://www.sandbase.ai/console/webhooks).

```bash
curl -X POST https://api.sandbase.ai/events/webhooks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Agent session monitor",
    "url": "https://example.com/hooks/sandbase",
    "resourceType": "session",
    "events": ["agent.message", "session.error"]
  }'
```

| Field | Type | Required | Description |
|---|---|---:|---|
| `name` | string | Yes | A human-readable name. |
| `url` | string | Yes | A valid HTTP(S) endpoint. Use HTTPS in production. |
| `resourceType` | `sandbox` \| `session` \| `model` | No | Defaults to `sandbox`. Model subscriptions are limited to the asynchronous events below. |
| `events` | string[] | No | Empty or omitted means all current and future events in the selected resource type. |
| `enabled` | boolean | No | Defaults to `true`. |
| `signatureSecret` | string | No | Omit this field to let SandBase generate a high-entropy secret. Existing clients may continue to provide their own non-empty value. |

`template` is shown as **Coming soon** in the Dashboard and cannot be registered. `model` subscriptions are available only for the asynchronous image, video, and audio terminal events listed below. The API rejects cross-resource events and unknown event names.

### Successful response

The Events API returns the registered webhook directly. The final `signatureSecret` is included only in this create response. Store it securely now: list and edit responses never return it, and it cannot be recovered later.

```json
{
  "id": "wh_01...",
  "name": "Agent session monitor",
  "url": "https://example.com/hooks/sandbase",
  "resourceType": "session",
  "events": ["agent.message", "session.error"],
  "enabled": true,
  "createdAt": "2026-07-15T12:00:00Z",
  "signatureSecret": "whsec_<one-time-value>"
}
```

The [Dashboard Webhooks page](https://www.sandbase.ai/console/webhooks) shows the generated secret once after registration and requires you to save it before closing the dialog.

### List, edit, and delete

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

Use the same API-key authentication. A `PATCH` may include one or more of `name`, `url`, `resourceType`, `events`, and `enabled`; omitted fields remain unchanged. The complete resulting `resourceType` and `events` subscription must be valid. An empty `events` array still means all events in that resource type.

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["agent.message", "agent.tool_use"],
    "enabled": true
  }'
```

`signatureSecret` cannot be viewed or changed through `PATCH`; a request containing it is rejected. If the secret is lost, delete and recreate the webhook. You can also view, edit, enable or disable, and delete registrations from the [Dashboard Webhooks page](https://www.sandbase.ai/console/webhooks).

## Per-task model callback

For one asynchronous image, video, or audio task, add `webhook_url` to `POST /v1/run` or `POST /v1/generations` instead of registering a new webhook:

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "example/async-image-model",
    "mode": "async",
    "prompt": "A lighthouse at night",
    "webhook_url": "https://hooks.example.com/sandbase/task?token=opaque-token"
  }'
```

The field is parsed and validated only when the selected model is image, video, or audio and the request resolves to asynchronous execution. In that case it must be a non-empty string containing a valid, safe public HTTPS URL; otherwise the request returns HTTP 400. For synchronous, streaming, LLM, or other unsupported requests, SandBase ignores `webhook_url` regardless of its JSON value: it schedules no callback, stores no callback URL, and does not forward the field to the model provider. Omitting the field preserves the existing polling flow.

The target must be a public HTTPS URL. SandBase sends the same Model terminal envelope documented below, with `Content-Type: application/json` and `X-Event-ID`, for completed, failed, or timeout. It may retry a failed delivery, so deduplicate by `id` or `X-Event-ID` and return 2xx quickly.

A per-task callback has no shared SandBase secret and therefore does **not** include `X-Signature`. If your endpoint requires HMAC verification, omit `webhook_url` and register an organization Model Webhook instead. You may place an opaque capability token generated by your own system in the HTTPS URL query and validate it at your endpoint. Treat that URL as sensitive.

For each asynchronous model task, target selection is exclusive. If the request includes a valid `webhook_url`, SandBase sends that Prediction's terminal event only to the per-task URL and skips every registered organization Model Webhook for that event. If the request omits `webhook_url`, registered organization Model Webhooks continue to receive matching events normally. A per-task delivery failure retries the same task URL and never falls back to a registered webhook. This priority does not create, replace, disable, or modify any registration, and does not affect other Model, Sandbox, or Session events.

## Event types

### Sandbox

| Event | Description |
|---|---|
| `sandbox.lifecycle.created` | A sandbox is created. |
| `sandbox.lifecycle.updated` | Sandbox state or metadata is updated. |
| `sandbox.lifecycle.paused` | A sandbox is paused. |
| `sandbox.lifecycle.resumed` | A paused sandbox resumes. |
| `sandbox.lifecycle.killed` | A sandbox is terminated. |
| `erouter.process.completed` | An ERouter process completes. |
| `erouter.skill.completed` | An ERouter skill completes. |

### Session

| Event | Description |
|---|---|
| `user.message` | A user message is written to a Session. |
| `agent.message` | An Agent message is written to a Session. |
| `agent.tool_use` | An Agent invokes a tool. |
| `agent.tool_result` | A tool result is recorded. |
| `session.status_running` | A Session enters the running state. |
| `session.status_idle` | A Session returns to the idle state. |
| `session.error` | A Session records an error. |

### Model generation

Model webhooks are available only for asynchronous image, video, and audio generation. They are not emitted for synchronous image/video/audio requests or any synchronous LLM request: those results are returned by the original HTTP response.

| Event | Description |
|---|---|
| `model.generation.completed` | An asynchronous image, video, or audio generation completed. |
| `model.generation.failed` | An asynchronous image, video, or audio generation failed. |
| `model.generation.timeout` | An asynchronous image, video, or audio generation timed out. |

## Delivery payload

SandBase sends `Content-Type: application/json` and the following JSON envelope. `data` is event-specific and can gain fields over time.

### Sandbox example

```json
{
  "id": "evt_01...",
  "resourceType": "sandbox",
  "resourceID": "sbx_01...",
  "type": "sandbox.lifecycle.killed",
  "sandboxID": "sbx_01...",
  "data": {
    "reason": "timeout"
  },
  "createdAt": "2026-07-14T09:30:38Z"
}
```

### Session example

```json
{
  "id": "sevt_01...",
  "resourceType": "session",
  "resourceID": "sess_01...",
  "agentID": "agent_01...",
  "type": "agent.message",
  "sandboxID": "",
  "data": {
    "content": [{ "type": "text", "text": "Hello" }]
  },
  "createdAt": "2026-07-14T09:30:38Z"
}
```

### Model completion example

```json
{
  "id": "model_pred_01_completed",
  "resourceType": "model",
  "resourceID": "pred_01...",
  "type": "model.generation.completed",
  "sandboxID": "",
  "data": {
    "predictionID": "pred_01...",
    "model": "example-image-model",
    "generationType": "image",
    "status": "completed",
    "completedAt": "2026-07-14T09:30:38Z",
    "outputs": ["https://.../generated-image.png"]
  },
  "createdAt": "2026-07-14T09:30:38Z"
}
```

Failure and timeout events omit outputs and contain only the sanitized error category.

| Field | Description |
|---|---|
| `id` | Unique event ID. Use this, or `X-Event-ID`, as your idempotency key. |
| `resourceType` | `sandbox`, `session`, or `model`. |
| `resourceID` | The affected Sandbox, Session, or Prediction ID. |
| `agentID` | The associated Agent ID when the event has one; omitted otherwise. |
| `type` | Event type from the tables above. |
| `sandboxID` | Legacy Sandbox ID field. It remains for compatibility and is empty for Session events. |
| `data` | Event-specific data. |
| `createdAt` | Event creation time in RFC 3339 UTC. |

## Verify a registered webhook signature

Every registered webhook delivery includes these headers:

| Header | Value |
|---|---|
| `X-Event-ID` | The payload `id`. |
| `X-Signature` | Lowercase hexadecimal HMAC-SHA256 of the raw request body, keyed by `signatureSecret`. |

Verify the signature against the raw request bytes before parsing JSON. Per-task `webhook_url` callbacks do not include this header and cannot use this verification flow. The following handlers are for registered webhooks: they verify first, parse second, use `id` as the idempotency key, and hand work to an asynchronous function. Replace the placeholder queue call with your own durable queue or worker.

::: code-group

```javascript [Node.js + Express]
import crypto from 'node:crypto'
import express from 'express'

const app = express()
const webhookSecret = process.env.SANDBASE_WEBHOOK_SECRET
if (!webhookSecret) throw new Error('SANDBASE_WEBHOOK_SECRET is required')
const acceptedEventIDs = new Set() // Use a DB unique key in production.

function enqueueSandBaseEvent(event) {
  setImmediate(() => {
    console.log(`processing ${event.type} (${event.id})`)
    // Perform slow business work here or publish to your durable queue.
  })
}

// This route must be registered before express.json() for the webhook path.
app.post('/hooks/sandbase', express.raw({ type: 'application/json' }), (req, res) => {
  const rawBody = req.body
  const signature = req.get('X-Signature') || ''

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')

  const received = Buffer.from(signature, 'utf8')
  const expectedBuffer = Buffer.from(expected, 'utf8')
  if (received.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, received)) {
    return res.status(401).json({ error: 'invalid signature' })
  }

  const event = JSON.parse(rawBody.toString('utf8'))
  if (acceptedEventIDs.has(event.id)) return res.sendStatus(204)
  acceptedEventIDs.add(event.id)
  enqueueSandBaseEvent(event)
  return res.sendStatus(204)
})

app.listen(3000)
```

```python [Python + Flask]
import hashlib
import hmac
import json
import os
import threading

from flask import Flask, abort, request

app = Flask(__name__)
webhook_secret = os.environ["SANDBASE_WEBHOOK_SECRET"].encode()
accepted_event_ids = set()  # Use a DB unique key in production.
accepted_event_ids_lock = threading.Lock()

def process_sandbase_event(event):
    print(f"processing {event['type']} ({event['id']})")
    # Perform slow business work here or publish to your durable queue.

@app.post("/hooks/sandbase")
def sandbase_webhook():
    raw_body = request.get_data(cache=True)
    received = request.headers.get("X-Signature", "")
    expected = hmac.new(webhook_secret, raw_body, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, received):
        abort(401, "invalid signature")

    event = json.loads(raw_body)
    with accepted_event_ids_lock:
        if event["id"] in accepted_event_ids:
            return "", 204
        accepted_event_ids.add(event["id"])
    threading.Thread(target=process_sandbase_event, args=(event,), daemon=True).start()
    return "", 204
```

:::

The HMAC input is the exact raw body. Do not call a JSON parser or re-serialize the payload before computing it.

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## Delivery behavior

- A response in the `2xx` range within 10 seconds is successful.
- Network errors, timeouts, and non-2xx responses are failures. The existing event dispatcher may retry failed delivery; receivers must tolerate duplicate delivery.
- Return a 2xx response after durable acceptance, then perform slow work asynchronously. The examples use in-memory deduplication only to stay runnable; production receivers must replace it with a database unique key or durable queue. Do not assume exactly-once delivery or event ordering.


For session event delivery and lifecycle semantics, see [Session events](/api-reference/sessions/list-events).
