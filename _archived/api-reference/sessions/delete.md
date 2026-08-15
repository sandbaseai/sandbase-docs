---
title: Delete Session
description: Permanently delete a session and all its events.
---

# Delete Session

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#ef4444;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">DELETE</span>
  <code>/v1/sessions/{session_id}</code>
</div>

Permanently delete a session and all its event history. This action is irreversible.

A running session cannot be deleted — interrupt it first, wait for `idle` status, then delete.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session_id` | string | yes | The session ID (`sess_...`) |

## Request Examples

::: code-group

```python [Python]
from anthropic import Anthropic

client = Anthropic(
    api_key="sk-sb-YOUR_KEY",
    base_url="https://api.sandbase.ai"
)

result = client.beta.sessions.delete(
    session_id="sess_01abc..."
)
print(result.id)    # "sess_01abc..."
print(result.type)  # "session_deleted"
```

```bash [cURL]
curl -X DELETE https://api.sandbase.ai/v1/sessions/sess_01abc... \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

:::

## Response

```json
{
  "id": "sess_01abc...",
  "type": "session_deleted"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | The deleted session ID |
| `type` | string | Always `"session_deleted"` |

## Errors

| Status | Type | Description |
|--------|------|-------------|
| 401 | `authentication_error` | Invalid or missing API key |
| 404 | `not_found` | Session not found |
| 409 | `conflict` | Session is running. Send `user.interrupt` first, wait for idle, then delete. |
