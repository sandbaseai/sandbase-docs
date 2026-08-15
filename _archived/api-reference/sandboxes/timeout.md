---
title: Set Timeout
---

# Set Sandbox Timeout

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#f59e0b;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/sandboxes/:id/timeout</code>
</div>

Update the inactivity timeout for a running sandbox.

## Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `timeout` | integer | ✅ | New timeout in seconds |

## Response

`204 No Content`
