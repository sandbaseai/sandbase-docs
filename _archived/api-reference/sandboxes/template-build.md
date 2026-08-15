---
title: Template Build API
description: E2B-compatible Template API for SandBase. Read available templates and (internal) build custom templates via the v3 flow.
---

# Template API

SandBase provides an E2B-compatible Template API. There are two parts:

- **Reading templates** — list templates, get details, and resolve aliases. Public, used when creating sandboxes.
- **Building custom templates (v3)** — create and build custom templates. Used internally by the SandBase team / E2B CLI; not required for everyday sandbox usage.

::: tip Which do I need?
If you only create sandboxes from existing templates (e.g. `Sandbox.create("hermes-agent")`), you only need the **read** endpoints below. The **build** flow is for producing new custom templates and aligns with the E2B v3 build pipeline.
:::

## Base URL

```
https://api.sandbase.ai
```

## Authentication

All template endpoints require authentication:

```
Authorization: Bearer sk-sb-YOUR_KEY
```

Or E2B SDK compatible:

```
X-API-Key: sk-sb-YOUR_KEY
```

The read endpoints are **org-scoped**: `GET /templates` returns all public (platform) templates plus your organization's own custom templates. A custom template owned by another organization returns `404` (its existence is not revealed).

---

## Read Endpoints

### List Templates

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/templates</code>
</div>

List templates accessible to your organization: all public (platform) templates plus your org's own custom templates.

**Response:**

```json
[
  {
    "templateID": "hermes-agent",
    "buildID": "build_abc123",
    "cpuCount": 4,
    "memoryMB": 8192,
    "diskSizeMB": 10240,
    "public": true,
    "aliases": ["hermes-agent"],
    "names": ["hermes-agent"],
    "createdAt": "2026-05-27T10:00:00Z",
    "updatedAt": "2026-05-27T10:00:00Z",
    "createdBy": null,
    "lastSpawnedAt": null,
    "spawnCount": 0,
    "buildCount": 1,
    "buildStatus": "ready"
  }
]
```

Each template object includes:

| Field | Type | Description |
|-------|------|-------------|
| `templateID` | string | Template identifier |
| `buildID` | string | Last successful build ID |
| `cpuCount` / `memoryMB` / `diskSizeMB` | integer | Resource allocation |
| `public` | boolean | Whether the template is public |
| `aliases` (deprecated) / `names` | string[] | Template names |
| `createdAt` / `updatedAt` | string | RFC 3339 timestamps |
| `createdBy` | object \| null | Creator (`id`, `email`), null for platform templates |
| `lastSpawnedAt` | string \| null | Last time a sandbox used this template |
| `spawnCount` / `buildCount` | integer | Usage and build counters |
| `buildStatus` | string | `building`, `waiting`, `ready`, `error`, `uploaded` |

---

### Get Template

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/templates/:templateID</code>
</div>

Get template details, including its build history.

**Response:**

```json
{
  "templateID": "my-template",
  "buildID": "build_xyz789",
  "cpuCount": 2,
  "memoryMB": 2048,
  "diskSizeMB": 10240,
  "public": false,
  "aliases": ["my-template"],
  "names": ["my-template"],
  "createdAt": "2026-05-27T10:00:00Z",
  "updatedAt": "2026-05-27T10:05:00Z",
  "builds": [
    {
      "buildID": "build_xyz789",
      "templateID": "my-template",
      "status": "ready",
      "cpuCount": 2,
      "memoryMB": 2048,
      "startedAt": "2026-05-27T10:00:00Z",
      "finishedAt": "2026-05-27T10:03:00Z"
    }
  ]
}
```

---

### Check Alias

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/templates/aliases/:alias</code>
</div>

Check whether a template alias exists.

**Response (200):**

```json
{ "templateID": "my-template" }
```

**Response (404):** Template not found.

---

## Build a Custom Template (v3)

The v3 build flow aligns with the E2B CLI/SDK build pipeline. It separates template creation, layer upload, and build execution:

```
1. POST   /v3/templates                              create template (name + tags)
2. GET    /templates/:id/files/:hash                 get upload link for each build layer
3. POST   /v2/templates/:id/builds/:buildID          start the build (fromImage / steps)
4. GET    /templates/:id/builds/:buildID/status      poll status until ready
   GET    /templates/:id/builds/:buildID/logs        (optional) stream build logs
```

::: tip Use the E2B CLI
The simplest way to build is the E2B CLI pointed at SandBase — it orchestrates all four steps for you:

```bash
export E2B_API_URL=https://api.sandbase.ai
export E2B_API_KEY=sk-sb-YOUR_KEY
e2b template build --name my-agent --dockerfile ./Dockerfile
```
:::

### 1. Create Template (v3)

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/v3/templates</code>
</div>

**Request:**

```json
{
  "name": "my-template:v1",
  "tags": ["latest"],
  "cpuCount": 4,
  "memoryMB": 8192
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | string | ✅ | Template name, optionally `name:tag` |
| `tags` | string[] | ❌ | Tags to assign to the build |
| `cpuCount` | integer | ❌ | CPU cores (default 2) |
| `memoryMB` | integer | ❌ | Memory in MB (default 512) |
| `alias` | string | ❌ | Deprecated — use `name` |

The `name` field supports `name:tag` format. If a tag is included in the name, it's treated as if it were passed in the `tags` array.

**Response (202 Accepted):**

```json
{
  "templateID": "my-template",
  "buildID": "build_xyz789",
  "status": "waiting",
  "public": false,
  "aliases": ["my-template"]
}
```

### 2. Get File Upload Link

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/templates/:templateID/files/:hash</code>
</div>

Get a pre-signed upload URL for a build layer (tar archive), keyed by content hash.

**Response (200):**

```json
{
  "present": false,
  "url": "https://storage.e2b.dev/upload/..."
}
```

If `present: true`, the layer is already cached and no upload is needed.

### 3. Start Build

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/v2/templates/:templateID/builds/:buildID</code>
</div>

Start the build for the created template/build pair.

**Request:**

```json
{
  "fromImage": "docker.e2b.dev/e2b/custom-envs/my-template:build_xyz",
  "startCmd": "/bin/bash",
  "readyCmd": "echo ready",
  "force": false
}
```

| Field | Type | Description |
|-------|------|-------------|
| `fromImage` | string | Base image for the build |
| `fromTemplate` | string | Base template (alternative to `fromImage`) |
| `startCmd` | string | Command run when a sandbox starts |
| `readyCmd` | string | Command that must exit 0 for the template to be ready |
| `force` | boolean | Rebuild regardless of cache (default `false`) |

**Response:** `202 Accepted`

### 4. Get Build Status

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/templates/:templateID/builds/:buildID/status</code>
</div>

Poll build progress.

**Query Parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `logsOffset` | integer | 0 | Starting log index |
| `limit` | integer | 100 | Max logs to return (max 100) |
| `level` | string | | Filter by level: `debug`, `info`, `warn`, `error` |

**Response:**

```json
{
  "templateID": "my-template",
  "buildID": "build_xyz789",
  "status": "building",
  "logs": ["Step 1/5: FROM python:3.11", "Step 2/5: RUN pip install numpy"],
  "logEntries": [
    {
      "timestamp": "2026-05-27T10:00:01Z",
      "message": "Step 1/5: FROM python:3.11",
      "level": "info"
    }
  ]
}
```

**Build statuses:** `building`, `waiting`, `ready`, `error`, `uploaded`

On `error`, a `reason` object with a `message` is included.

### (Optional) Get Build Logs

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/templates/:templateID/builds/:buildID/logs</code>
</div>

Get paginated structured build logs.

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `cursor` | integer | 0 | Starting timestamp (ms) |
| `limit` | integer | 100 | Max entries (max 100) |
| `direction` | string | forward | `forward` or `backward` |
| `level` | string | | Filter by level |

---

## Manage Templates

### Update Template

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#f59e0b;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">PATCH</span>
  <code>/templates/:templateID</code>
</div>

Update template metadata (e.g. visibility).

```json
{ "public": true }
```

### Delete Template

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#ef4444;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">DELETE</span>
  <code>/templates/:templateID</code>
</div>

Delete a template and all its builds. Returns `204 No Content`.

### Tags

```
GET    /templates/:templateID/tags    list tags
POST   /templates/tags                assign tags
DELETE /templates/tags                delete tags
```

**Assign tags:**

```json
{ "target": "my-template:build_xyz789", "tags": ["latest", "v2.0"] }
```

**Delete tags:**

```json
{ "name": "my-template", "tags": ["v1.0"] }
```

---

## Using Templates

### Python (E2B SDK)

```python
from e2b import Sandbox

# Create a sandbox from any template
sandbox = Sandbox("hermes-agent", api_url="https://api.sandbase.ai")
```

### JavaScript (E2B SDK)

```javascript
import { Sandbox } from 'e2b'

const sandbox = await Sandbox.create('hermes-agent', {
  apiUrl: 'https://api.sandbase.ai',
})
```

::: tip Legacy build flows
Earlier E2B build flows — the v1 `POST /templates` (inline Dockerfile) and the standalone v2 `POST /v2/templates` create — still exist on the backend for backward compatibility but are not part of the recommended path. New builds should use the **v3 flow** above, which is what the current E2B CLI/SDK uses.
:::

## Related

- [Available Templates](/api-reference/sandboxes/templates) — Pre-built templates
- [Sandbox API](/api-reference/sandbox-api) — Create sandboxes from templates
- [Sandbox Lifecycle](/agents/sandbox-lifecycle) — States, timeouts, pause/resume
