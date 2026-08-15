---
title: Resume Sandbox
---

# Resume Sandbox

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#f59e0b;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/sandboxes/:id/connect</code>
</div>

Resume a paused sandbox. All files and environment state are preserved. Connecting also extends the sandbox TTL.

## Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `timeout` | integer | ❌ | New timeout in **seconds** from now |

## Response

Returns the sandbox object with `status: "running"`. See the [sandbox object](/api-reference/sandbox-api#response).
