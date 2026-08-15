---
title: Update Session
description: Update a session's title and metadata.
---

# Update Session

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#f59e0b;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/v1/sessions/{session_id}</code>
</div>

Update mutable fields on a session. Only `title` and `metadata` can be updated.

## Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `session_id` | string | ✅ | The session ID (`sess_...`) |

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `title` | string | ❌ | Human-readable session title. Omit to preserve. |
| `metadata` | object | ❌ | Replacement metadata object. Omit to preserve. |

::: tip Agent configuration is immutable per session
The agent (`agent_id` / `agent_version`) is frozen at session creation time and cannot be changed afterward. To change agent behavior:

- **For all future sessions** — update the agent via [`POST /v1/agents/{id}`](/api-reference/agents/update), which creates a new agent version.
- **For a new conversation with different config** — create a new session with the updated agent.
:::

## Request Examples

::: code-group

```python [Python]
from anthropic import Anthropic

client = Anthropic(
    api_key="sk-sb-YOUR_KEY",
    base_url="https://api.sandbase.ai"
)

session = client.beta.sessions.update(
    session_id="sess_01abc...",
    title="Updated research task",
    metadata={"priority": "high"}
)
print(session.title)
```

```bash [cURL]
curl -X POST https://api.sandbase.ai/v1/sessions/sess_01abc... \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"title": "Updated research task", "metadata": {"priority": "high"}}'
```

:::

## Response

Returns the updated [Session object](/api-reference/sessions/create#session-object).

```json
{
  "id": "sess_01abc...",
  "type": "session",
  "status": "idle",
  "title": "Updated research task",
  "agent_id": "agent_01HqR2k7...",
  "agent_version": 1,
  "environment_id": "env_01abc...",
  "usage": null,
  "metadata": { "priority": "high" },
  "archived_at": null,
  "created_at": "2026-05-29T10:00:00Z",
  "updated_at": "2026-05-29T10:01:00Z"
}
```

## Errors

| Status | Type | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Invalid field values |
| 401 | `authentication_error` | Invalid or missing API key |
| 404 | `not_found` | Session not found |
