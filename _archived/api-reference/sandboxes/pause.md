---
title: Pause Sandbox
---

# Pause Sandbox

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#f59e0b;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/sandboxes/:id/pause</code>
</div>

Pause a running sandbox. State is preserved to disk. No compute charges while paused.

## Response

`204 No Content`

::: tip
Paused time does not count toward the 1-hour maximum lifetime.
:::
