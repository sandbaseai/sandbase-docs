---
title: List Sandboxes
---

# List Sandboxes

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/sandboxes</code>
</div>

List sandboxes for your organization, optionally filtered by status. E2B-compatible: returns a JSON array of sandbox objects directly (no wrapper).

## Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `status` | string | Filter by status: `running`, `paused`, `stopped`, `creating`, `error`. Omit to list all. |

## Example

```bash
curl "https://api.sandbase.ai/sandboxes?status=running" \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

## Response

```json
[
  {
    "sandboxID": "sbx_01abc...",
    "templateID": "code_interpreter",
    "clientID": "erouter",
    "status": "running",
    "metadata": {},
    "startedAt": "2026-05-24T10:00:00Z",
    "endAt": "2026-05-24T10:05:00Z"
  }
]
```

See the [sandbox object](/api-reference/sandbox-api#response) for field descriptions.

## Errors

| Status | Message |
|--------|---------|
| 400 | `invalid status filter: <value>` |

::: tip Roadmap
Metadata-based filtering (`?metadata=user=abc&app=prod`) and cursor pagination (E2B's `GET /v2/sandboxes`) are on the roadmap.
:::
