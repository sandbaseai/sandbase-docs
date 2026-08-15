---
title: Create Session
description: Create a new agent session — a running instance of an agent within an environment.
---

# Create Session

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/v1/sessions</code>
</div>

Create a new session. A session is a running instance of an agent within an environment, maintaining state across multiple interactions.

::: info Claude API compatibility
SandBase implements a subset of the [Claude Managed Agents](https://platform.claude.com/docs/en/api/python/beta/sessions/create) Session API. The fields documented below are supported today. Additional Claude fields are noted as roadmap items.
:::

## Request Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `agent` | string \| object | ✅ | Agent identifier. String (uses latest version) or object with `id` and `version`. |
| `environment_id` | string | ✅ | ID of the environment defining the container configuration. |
| `title` | string | ❌ | Human-readable session title. |
| `metadata` | object | ❌ | Arbitrary key-value metadata. Max 16 pairs, keys up to 64 chars, values up to 512 chars. |

### Agent Parameter

The `agent` field accepts two formats:

```jsonc
// String — uses latest version
"agent_01HqR2k7vXbZ9mNpL3wYcT8f"

// Object — pin to specific version
{
  "type": "agent",
  "id": "agent_01HqR2k7vXbZ9mNpL3wYcT8f",
  "version": 2
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `type` | string | ✅ | Always `"agent"` |
| `id` | string | ✅ | The agent ID |
| `version` | integer | ❌ | Specific version to use. Omit for latest. Must be ≥ 1. |

## Request Examples

::: code-group

```python [Python]
from anthropic import Anthropic

client = Anthropic(
    api_key="sk-sb-YOUR_KEY",
    base_url="https://api.sandbase.ai"
)

session = client.beta.sessions.create(
    agent="agent_01HqR2k7vXbZ9mNpL3wYcT8f",
    environment_id="env_01abc...",
)
print(session.id)
```

```typescript [TypeScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: 'sk-sb-YOUR_KEY',
  baseURL: 'https://api.sandbase.ai',
});

const session = await client.beta.sessions.create({
  agent: 'agent_01HqR2k7vXbZ9mNpL3wYcT8f',
  environment_id: 'env_01abc...',
});
console.log(session.id);
```

```bash [cURL]
curl -X POST https://api.sandbase.ai/v1/sessions \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "agent": "agent_01HqR2k7vXbZ9mNpL3wYcT8f",
    "environment_id": "env_01abc..."
  }'
```

:::

## Response

Returns a [Session object](#session-object).

```json
{
  "id": "sess_01abc...",
  "type": "session",
  "status": "idle",
  "title": null,
  "agent_id": "agent_01HqR2k7vXbZ9mNpL3wYcT8f",
  "agent_version": 1,
  "environment_id": "env_01abc...",
  "usage": null,
  "metadata": {},
  "archived_at": null,
  "created_at": "2026-05-29T10:00:00Z",
  "updated_at": "2026-05-29T10:00:00Z"
}
```

## Session Object

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique session identifier (`sess_...`) |
| `type` | string | Always `"session"` |
| `status` | string | Current status: `idle`, `running`, `rescheduling`, `terminated` |
| `title` | string \| null | Human-readable title |
| `agent_id` | string | ID of the agent this session runs |
| `agent_version` | integer \| null | Pinned agent version (resolved at creation) |
| `environment_id` | string | Environment this session runs in |
| `usage` | object \| null | Cumulative token usage. `null` until the first turn completes. |
| `metadata` | object | User-defined key-value pairs |
| `archived_at` | string \| null | RFC 3339 timestamp when archived |
| `created_at` | string | RFC 3339 timestamp |
| `updated_at` | string | RFC 3339 timestamp |

### Status Values

| Status | Description |
|--------|-------------|
| `idle` | Waiting for input. Ready to receive events. |
| `running` | Agent is actively executing (processing message, calling tools). |
| `rescheduling` | Transient error occurred, retrying automatically. |
| `terminated` | Unrecoverable error. Session has ended. |

### Agent Reference

The session references its agent by `agent_id` and the resolved `agent_version`. To fetch the full agent configuration, call [Get Agent](/api-reference/agents/get) with `?version={agent_version}`.

::: info Difference from Claude
Claude embeds a full resolved `agent` snapshot object inside the session. SandBase currently returns `agent_id` + `agent_version` references instead — fetch the agent separately if you need its configuration. A future release may embed the snapshot.
:::

### Usage Object

`usage` is `null` until the first turn completes, then holds cumulative token counts:

```json
{ "input_tokens": 4520, "output_tokens": 1830 }
```

::: tip Roadmap
Claude's Session object also includes `stats`, `resources`, `outcome_evaluations`, `vault_ids`, and a richer `usage` (cache breakdown). These are not yet returned by SandBase and will be added in later phases. Clients should tolerate their absence.
:::

## Errors

| Status | Type | Description |
|--------|------|-------------|
| 400 | `invalid_request` | Missing required fields or invalid format |
| 401 | `authentication_error` | Invalid or missing API key |
| 404 | `not_found` | Agent or environment not found |
| 403 | `forbidden` | Agent is archived |
