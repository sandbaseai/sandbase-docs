---
title: Archive Session
description: Archive a session, preventing new events while preserving history.
---

# Archive Session

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#f59e0b;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/v1/sessions/{session_id}/archive</code>
</div>

Archive a session. Archived sessions cannot receive new events but their event history remains accessible for auditing and debugging.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session_id` | string | ✅ | The session ID (`sess_...`) |

## Request Examples

::: code-group

```python [Python]
from anthropic import Anthropic

client = Anthropic(
    api_key="sk-sb-YOUR_KEY",
    base_url="https://api.sandbase.ai"
)

session = client.beta.sessions.archive(
    session_id="sess_01abc..."
)
print(session.archived_at)  # "2026-05-29T10:05:00Z"
```

```bash [cURL]
curl -X POST https://api.sandbase.ai/v1/sessions/sess_01abc.../archive \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

:::

## Response

Returns the updated [Session object](/api-reference/sessions/create#session-object) with `archived_at` set.

```json
{
  "id": "sess_01abc...",
  "type": "session",
  "status": "idle",
  "title": "Research task",
  "agent_id": "agent_01HqR2k7...",
  "agent_version": 1,
  "environment_id": "env_01abc...",
  "usage": { "input_tokens": 12500, "output_tokens": 4200 },
  "metadata": {},
  "archived_at": "2026-05-29T10:05:00Z",
  "created_at": "2026-05-29T10:00:00Z",
  "updated_at": "2026-05-29T10:05:00Z"
}
```

## Errors

| Status | Type | Description |
|--------|------|-------------|
| 401 | `authentication_error` | Invalid or missing API key |
| 404 | `not_found` | Session not found |
