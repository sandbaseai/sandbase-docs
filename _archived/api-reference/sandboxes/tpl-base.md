---
title: "Template: base"
description: "Minimal Ubuntu sandbox for custom environments. 2 vCPU, 512 MB RAM, boots in ~60ms. Install your own tools and configure from scratch."
---

# base

Minimal Ubuntu sandbox environment — a lightweight starting point for custom setups. Boots in ~60ms with basic system utilities and nothing else. Install exactly what you need, keep resource usage low, and build your own workflow from scratch.

## Specs

| Property | Value |
|----------|-------|
| Template ID | `base` |
| Default Timeout | 300s (5 min) |
| CPU | 2 vCPU |
| Memory | 512 MB |
| Disk | 5 GB |
| Boot Time | ~60ms |
| Internet | Enabled |
| Working Directory | `/home/user` |

## What's Included

- **Ubuntu 22.04** — minimal base image
- **curl, wget** — HTTP clients
- **git** — version control
- **bash, sh** — shell environments
- **apt** — package manager (install anything you need)
- **Basic coreutils** — ls, cat, grep, find, etc.

::: tip
The base template is intentionally minimal. Use `apt-get install` via the exec endpoint to add any packages your workflow requires.
:::

## Use Cases

- **Custom environments** — Install specific language runtimes, frameworks, or tools not available in other templates
- **Lightweight tasks** — Run simple scripts, cron jobs, or data processing without overhead
- **CI/CD steps** — Execute build steps, linting, or deployment scripts in isolation
- **Prototyping** — Quickly test ideas without committing to a full template
- **Reproducible builds** — Start from a known minimal state and install exact dependencies

## Create a Sandbox

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#22c55e;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">POST</span>
  <code>/sandboxes</code>
</div>

```bash
curl -X POST https://api.sandbase.ai/sandboxes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "templateID": "base",
    "timeout": 300
  }'
```

**Response:**

```json
{
  "sandboxID": "sbx_01abc...",
  "templateID": "base",
  "clientID": "SandBase",
  "status": "running",
  "startedAt": "2024-07-01T12:00:00Z",
  "endAt": "2024-07-01T12:05:00Z"
}
```

## Customizing the Environment

Once the sandbox is running, install packages and configure tools via the [exec endpoint](/api-reference/sandboxes/exec):

### Install a language runtime

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_01abc.../processes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cmd": "bash",
    "args": ["-c", "apt-get update && apt-get install -y python3 python3-pip"]
  }'
```

### Install Node.js

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_01abc.../processes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cmd": "bash",
    "args": ["-c", "curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs"]
  }'
```

### Install custom tools

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_01abc.../processes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cmd": "bash",
    "args": ["-c", "apt-get install -y ffmpeg imagemagick jq"]
  }'
```

## Full Example — Custom Python Environment

```python
import requests

BASE = "https://api.sandbase.ai"
HEADERS = {"Authorization": "Bearer sk-sb-YOUR_KEY"}

# 1. Create a minimal sandbox (~60ms)
sandbox = requests.post(f"{BASE}/sandboxes", headers=HEADERS, json={
    "templateID": "base",
    "timeout": 300
}).json()

sandbox_id = sandbox["sandboxID"]

# 2. Install Python and dependencies
requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={"cmd": "bash", "args": ["-c", "apt-get update && apt-get install -y python3 python3-pip"]}
).json()

# 3. Install project-specific packages
requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={"cmd": "bash", "args": ["-c", "pip3 install pandas numpy requests"]}
).json()

# 4. Run a script
result = requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={
        "cmd": "python3",
        "args": ["-c", "import pandas as pd; print(pd.__version__)"]
    }
).json()

print(result["stdout"])  # e.g. "2.2.0"

# 5. Clean up
requests.delete(f"{BASE}/sandboxes/{sandbox_id}", headers=HEADERS)
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | integer | 300 | Sandbox lifetime in seconds (max 3600) |
| `metadata` | object | `{}` | Custom key-value metadata |
| `envVars` | object | `{}` | Environment variables injected at boot |

### Minimal creation

```json
{
  "templateID": "base",
  "timeout": 300
}
```

### With environment variables

```json
{
  "templateID": "base",
  "timeout": 600,
  "envVars": {
    "APP_ENV": "staging",
    "DATABASE_URL": "postgres://..."
  }
}
```

### With metadata

```json
{
  "templateID": "base",
  "timeout": 900,
  "metadata": {
    "task": "data-processing",
    "pipeline": "etl-daily"
  }
}
```

## Related

- [Create Sandbox](/api-reference/sandbox-api) — Full create endpoint reference
- [Execute Command](/api-reference/sandboxes/exec) — Run commands in a sandbox
- [File Operations](/api-reference/sandboxes/files) — Upload/download files
- [Sandbox Lifecycle](/agents/sandbox-lifecycle) — States, timeouts, pause/resume
- [All Templates](/api-reference/sandboxes/templates) — Overview of available templates
