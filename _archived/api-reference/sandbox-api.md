---
title: Sandbox API
description: E2B-compatible Sandbox API reference for SandBase. Create, manage, and interact with cloud sandboxes for code execution.
---

# Sandbox API

SandBase provides an E2B-compatible Sandbox API for creating and managing isolated cloud execution environments. You can use the [E2B SDK](https://e2b.dev) pointed at SandBase, or call the REST endpoints directly.

## Base URL

```
https://api.sandbase.ai
```

## Authentication

All sandbox endpoints require an API key, sent as either header:

```http
Authorization: Bearer sk-sb-YOUR_KEY
```

```http
X-API-Key: sk-sb-YOUR_KEY
```

## Response and error format

::: warning E2B-compatible (unwrapped) responses
Sandbox endpoints return the resource object **directly** — they are **not** wrapped in the `{ "code": 0, "data": ... }` envelope used by the dashboard API. This keeps the surface drop-in compatible with the E2B SDK.
:::

Errors use the E2B shape:

```json
{
  "code": 400,
  "message": "unknown template: foo"
}
```

## Endpoints overview

| Method | Path | Description |
|--------|------|-------------|
| POST | `/sandboxes` | Create a sandbox |
| GET | `/sandboxes` | List sandboxes (filter by status) |
| GET | `/sandboxes/:id` | Get a sandbox |
| DELETE | `/sandboxes/:id` | Destroy a sandbox |
| POST | `/sandboxes/:id/pause` | Pause a sandbox |
| POST | `/sandboxes/:id/connect` | Resume a paused sandbox |
| POST | `/sandboxes/:id/timeout` | Set the sandbox timeout (TTL) |
| POST | `/sandboxes/:id/processes` | Execute a command |
| GET | `/sandboxes/:id/filesystem/list` | List a directory |
| GET | `/sandboxes/:id/filesystem` | Read a file |
| POST | `/sandboxes/:id/filesystem` | Write a file |
| DELETE | `/sandboxes/:id/filesystem` | Delete a file |
| GET | `/events/sandboxes` | List lifecycle events (org) |
| GET | `/events/sandboxes/:sandboxId` | List lifecycle events (one sandbox) |
| POST | `/events/webhooks` | Register a webhook |
| GET | `/events/webhooks` | List webhooks |
| DELETE | `/events/webhooks/:id` | Delete a webhook |

---

## Create Sandbox

```
POST /sandboxes
```

### Request Body

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `templateID` | string | ✅ | — | Template ID (e.g. `code_interpreter`, `claude`, `base`) |
| `timeout` | integer | ❌ | 300 | Sandbox lifetime in **seconds** |
| `metadata` | object | ❌ | `{}` | Key-value metadata attached to the sandbox |
| `envVars` | object | ❌ | `{}` | Environment variables injected into the sandbox |

### Example

::: code-group

```bash [cURL]
curl -X POST https://api.sandbase.ai/sandboxes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "templateID": "code_interpreter",
    "timeout": 600,
    "metadata": { "project": "data-analysis" },
    "envVars": { "MY_VAR": "value" }
  }'
```

```python [Python]
import requests

resp = requests.post(
    "https://api.sandbase.ai/sandboxes",
    headers={"Authorization": "Bearer sk-sb-YOUR_KEY"},
    json={
        "templateID": "code_interpreter",
        "timeout": 600,
        "metadata": {"project": "data-analysis"},
    },
)
sandbox = resp.json()
print(sandbox["sandboxID"])
```

:::

### Response

```json
{
  "sandboxID": "sbx_a1b2c3d4e5f6",
  "templateID": "code_interpreter",
  "clientID": "erouter",
  "metadata": { "project": "data-analysis" },
  "startedAt": "2026-07-01T10:00:00Z",
  "endAt": "2026-07-01T10:10:00Z",
  "status": "running"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `sandboxID` | string | Sandbox identifier |
| `templateID` | string | Template the sandbox was created from |
| `clientID` | string | Always `"erouter"` |
| `metadata` | object | Metadata supplied at creation |
| `startedAt` | string | RFC 3339 start time |
| `endAt` | string | RFC 3339 expiry time |
| `status` | string | `creating`, `running`, `paused`, `stopped`, `error` |

::: tip E2B field compatibility
The E2B `Sandbox` schema also includes `cpuCount`, `memoryMB`, `diskSizeMB`, `envdVersion`, `state`, `alias`, and `envdAccessToken`. SandBase returns `status` (equivalent to E2B's `state`) and the core fields above; the remaining E2B fields are on the roadmap. E2B SDK clients tolerate their absence.
:::

---

## List Sandboxes

```
GET /sandboxes
```

List sandboxes for your organization, ordered most-recently-created first.

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `status` | string | ❌ | Filter by status: `running`, `paused`, `stopped`, `creating`, `error` |

```bash
curl "https://api.sandbase.ai/sandboxes?status=running" \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

### Response

Returns an array of [sandbox objects](#response).

```json
[
  {
    "sandboxID": "sbx_a1b2c3d4e5f6",
    "templateID": "code_interpreter",
    "clientID": "erouter",
    "metadata": {},
    "startedAt": "2026-07-01T10:00:00Z",
    "endAt": "2026-07-01T10:10:00Z",
    "status": "running"
  }
]
```

---

## Get Sandbox

```
GET /sandboxes/:id
```

Returns the same [sandbox object](#response) as Create.

```bash
curl https://api.sandbase.ai/sandboxes/sbx_a1b2c3d4e5f6 \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

### Errors

| Status | Message |
|--------|---------|
| 400 | `invalid sandbox id` |
| 404 | `sandbox not found` |

---

## Destroy Sandbox

```
DELETE /sandboxes/:id
```

Permanently destroys the sandbox. Returns **HTTP 204 No Content** with an empty body.

```bash
curl -X DELETE https://api.sandbase.ai/sandboxes/sbx_a1b2c3d4e5f6 \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

---

## Pause Sandbox

```
POST /sandboxes/:id/pause
```

Pauses a running sandbox, preserving its filesystem and memory state for later resume. See [Persistence](/agents/sandbox-persistence).

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_a1b2c3d4e5f6/pause \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

### Errors

| Status | Message |
|--------|---------|
| 404 | `sandbox not found` |
| 502 | `failed to pause sandbox in provider` |

---

## Resume Sandbox (Connect)

```
POST /sandboxes/:id/connect
```

Resumes a paused sandbox and returns the sandbox object. Connecting also extends the TTL.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `timeout` | integer | ❌ | New timeout in **seconds** from now |

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_a1b2c3d4e5f6/connect \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "timeout": 300 }'
```

Returns the [sandbox object](#response) with `status: "running"`.

---

## Set Timeout

```
POST /sandboxes/:id/timeout
```

Sets the sandbox timeout. The sandbox will expire `timeout` seconds from the time of the request. Calling this repeatedly overwrites the TTL, each time measured from the current timestamp — use it as a keepalive while a user is active.

### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `timeout` | integer | ✅ | Seconds from now until the sandbox expires |

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_a1b2c3d4e5f6/timeout \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "timeout": 600 }'
```

Returns **HTTP 204 No Content** on success.

---

## Execute Command

```
POST /sandboxes/:id/processes
```

### Request Body

| Field | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `cmd` | string | ✅ | — | Command to execute |
| `args` | string[] | ❌ | `[]` | Command arguments |
| `timeout` | integer | ❌ | 60 | Execution timeout in seconds |

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_a1b2c3d4e5f6/processes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "cmd": "python3", "args": ["-c", "print(2+2)"], "timeout": 30 }'
```

### Response

```json
{
  "stdout": "4\n",
  "stderr": "",
  "exitCode": 0
}
```

---

## Filesystem

### List a directory

```
GET /sandboxes/:id/filesystem/list?path=/home/user
```

```json
[
  { "name": "main.py", "type": "file", "path": "/home/user/main.py", "size": 1234 },
  { "name": "data", "type": "dir", "path": "/home/user/data" }
]
```

### Read a file

```
GET /sandboxes/:id/filesystem?path=/home/user/main.py
```

Returns the file content base64-encoded:

```json
{
  "content": "cHJpbnQoIkhlbGxvIik=",
  "path": "/home/user/main.py"
}
```

Maximum file size: **1 MB**. Larger files return HTTP 400.

### Write / delete a file

```
POST   /sandboxes/:id/filesystem     # write
DELETE /sandboxes/:id/filesystem     # delete
```

---

## Lifecycle Events & Webhooks

Track sandbox lifecycle (`created`, `paused`, `resumed`, `killed`, `updated`) via the events API or webhooks. See [Sandbox Lifecycle Events](/agents/sandbox-events) for the full guide.

| Method | Path |
|--------|------|
| GET | `/events/sandboxes` |
| GET | `/events/sandboxes/:sandboxId` |
| POST | `/events/webhooks` |
| GET | `/events/webhooks` |
| DELETE | `/events/webhooks/:id` |

---

## Sandbox statuses

| Status | Description |
|--------|-------------|
| `creating` | Being provisioned |
| `running` | Active and accepting commands |
| `paused` | Hibernated; can be resumed |
| `stopped` | Destroyed or timed out |
| `error` | Fatal error during creation |

::: tip Roadmap — E2B endpoints not yet available
The following E2B platform endpoints are part of the E2B API but not yet exposed by SandBase:

- `GET /v2/sandboxes` (list with metadata filter + cursor pagination) — the v1 `GET /sandboxes` with `status` filter is available today
- `POST /sandboxes/:id/snapshots`, `GET /snapshots` (snapshots)
- `GET /sandboxes/:id/metrics`, `GET /sandboxes/metrics` (CPU/memory/disk metrics)
- `GET /v2/sandboxes/:id/logs` (structured logs)
- `POST /sandboxes/:id/refreshes` (use `POST /sandboxes/:id/timeout` instead)
- Network controls (`allowOut`/`denyOut`/`allowInternetAccess`), `secure`, `autoPause`/`autoResume`, and `volumeMounts` on create
:::

## See also

- [Cloud Sandboxes](/agents/sandboxes) — concepts and quickstart
- [Sandbox Lifecycle](/agents/sandbox-lifecycle) — states, timeout, keepalive
- [Sandbox Persistence](/agents/sandbox-persistence) — pause and resume
- [Templates](/agents/templates) — available base images
