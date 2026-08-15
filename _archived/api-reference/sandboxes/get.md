---
title: Get Sandbox
---

# Get Sandbox

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/sandboxes/:id</code>
</div>

Retrieve the status and details of a sandbox.

## Response

```json
{
  "sandboxID": "sbx_01abc...",
  "templateID": "code_interpreter",
  "clientID": "erouter",
  "status": "running",
  "startedAt": "2026-05-24T10:00:00Z",
  "endAt": "2026-05-24T10:05:00Z",
  "metadata": {}
}
```
