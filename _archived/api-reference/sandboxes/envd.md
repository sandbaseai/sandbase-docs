---
title: Sandbox Runtime (envd)
---

# Sandbox Runtime (envd)

Observe the in-sandbox runtime service: check health, read resource usage
metrics, and list the sandbox's environment variables. These endpoints are
E2B-compatible and are served by the SandBase API under the
`/sandboxes/:id` prefix.

All endpoints require authentication and enforce org isolation: a sandbox
that does not belong to your org returns `404 sandbox not found`.

## Health Check

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/sandboxes/:id/health</code>
</div>

Check whether the in-sandbox runtime is healthy.

### Response

Returns `204 No Content` when the sandbox runtime is healthy. No body is
returned.

### Request Example

```bash
curl -i -X GET https://api.sandbase.ai/sandboxes/sbx_01.../health \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

## Metrics

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/sandboxes/:id/metrics</code>
</div>

Get a point-in-time snapshot of the sandbox's resource usage.

### Response

```json
{
  "ts": 1748534400,
  "cpu_count": 2,
  "cpu_used_pct": 12.5,
  "mem_total": 2147483648,
  "mem_used": 536870912,
  "mem_cache": 134217728,
  "mem_total_mib": 2048,
  "mem_used_mib": 512,
  "disk_total": 10737418240,
  "disk_used": 2147483648
}
```

| Field | Type | Description |
|-------|------|-------------|
| `ts` | integer | Unix timestamp (UTC) for the sandbox's current time. |
| `cpu_count` | integer | Number of CPU cores. |
| `cpu_used_pct` | number | CPU usage percentage. |
| `mem_total` | integer | Total virtual memory, in bytes. |
| `mem_used` | integer | Used virtual memory, in bytes. |
| `mem_cache` | integer | Cached memory (page cache), in bytes. |
| `mem_total_mib` | integer | Total virtual memory, in MiB. |
| `mem_used_mib` | integer | Used virtual memory, in MiB. |
| `disk_total` | integer | Total disk space, in bytes. |
| `disk_used` | integer | Used disk space, in bytes. |

The field names match the E2B `Metrics` schema (snake_case) so the E2B SDK
can deserialize the response directly.

### Request Example

```bash
curl -X GET https://api.sandbase.ai/sandboxes/sbx_01.../metrics \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

## Environment Variables

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/sandboxes/:id/envs</code>
</div>

Get the environment variables visible inside the sandbox.

### Response

A flat object mapping variable names to their string values.

```json
{
  "PATH": "/usr/local/bin:/usr/bin:/bin",
  "HOME": "/home/user",
  "PYTHONUNBUFFERED": "1"
}
```

### Request Example

```bash
curl -X GET https://api.sandbase.ai/sandboxes/sbx_01.../envs \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

## Errors

| Status | Meaning |
|--------|---------|
| `400` | Invalid sandbox id. |
| `404` | Sandbox not found (or not owned by your org). |
| `502` | The sandbox runtime is unreachable or the health check failed. |
