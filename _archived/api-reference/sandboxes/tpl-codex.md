---
title: "Template: codex"
description: "OpenAI Codex CLI sandbox for autonomous coding tasks using OpenAI's coding agent. 2 vCPU, 2 GB RAM, boots in ~60ms."
---

# codex

Sandbox with [OpenAI Codex CLI](https://github.com/openai/codex) pre-installed — OpenAI's autonomous coding agent that can read, write, and execute code using GPT-4 and other OpenAI models. Boots in ~60ms with a full development environment ready to go.

## Specs

| Property | Value |
|----------|-------|
| Template ID | `codex` |
| Default Timeout | 300s (5 min) |
| CPU | 2 vCPU |
| Memory | 2 GB |
| Disk | 10 GB |
| Boot Time | ~60ms |
| Internet | Enabled |
| Working Directory | `/home/user` |

## Pre-installed Software

- **OpenAI Codex CLI** (latest) — OpenAI's agentic coding tool
- **Node.js 20 LTS** with npm
- **Python 3.11** with pip
- **Git** — version control
- **ripgrep, fd** — fast file search utilities
- **Common build tools** — gcc, make, curl, wget

::: tip
Codex CLI requires an `OPENAI_API_KEY` environment variable. Pass it via `envVars` when creating the sandbox.
:::

## Codex CLI Capabilities

Codex CLI operates as an autonomous coding agent inside the sandbox. It can:

- **Read & understand** entire codebases — navigates files, follows imports, maps project structure
- **Write & edit** code across multiple files in a single session
- **Execute** shell commands, run tests, install dependencies
- **Iterate** on errors — reads compiler/test output and fixes issues automatically
- **Generate** new projects, features, and boilerplate from natural language descriptions

The CLI accepts natural language prompts and translates them into concrete code changes using OpenAI models.

## Use Cases

- **Autonomous coding** — Give Codex a task and let it implement features end-to-end
- **Code generation** — Generate entire modules, APIs, or applications from descriptions
- **Bug fixing** — Describe a bug and let it trace the root cause and apply a fix
- **Refactoring** — Restructure, optimize, or modernize code across a project
- **Test generation** — Automatically write unit and integration tests for existing code
- **Project scaffolding** — Generate boilerplate, configs, and directory structures
- **Documentation** — Generate or update READMEs, docstrings, and API docs

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
    "templateID": "codex",
    "timeout": 300,
    "envVars": {
      "OPENAI_API_KEY": "sk-YOUR_OPENAI_KEY"
    }
  }'
```

**Response:**

```json
{
  "sandboxID": "sbx_02def...",
  "templateID": "codex",
  "clientID": "SandBase",
  "status": "running",
  "startedAt": "2024-07-01T12:00:00Z",
  "endAt": "2024-07-01T12:05:00Z"
}
```

## Run Codex Commands

Once the sandbox is running, invoke Codex CLI via the [exec endpoint](/api-reference/sandboxes/exec):

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_02def.../processes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cmd": "codex",
    "args": ["--quiet", "Create a REST API with Express.js that has CRUD endpoints for a todo app"]
  }'
```

The `--quiet` flag runs Codex in non-interactive mode — it executes the prompt and outputs the result, which is ideal for API-driven workflows.

## Full Example — Autonomous Code Generation

```python
import requests

BASE = "https://api.sandbase.ai"
HEADERS = {"Authorization": "Bearer sk-sb-YOUR_KEY"}

# 1. Create sandbox with Codex CLI (~60ms)
sandbox = requests.post(f"{BASE}/sandboxes", headers=HEADERS, json={
    "templateID": "codex",
    "timeout": 300,
    "envVars": {
        "OPENAI_API_KEY": "sk-YOUR_OPENAI_KEY"
    }
}).json()

sandbox_id = sandbox["sandboxID"]

# 2. Clone a repository
requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={"cmd": "git", "args": ["clone", "https://github.com/user/my-project.git"]}
).json()

# 3. Run Codex to implement a feature
result = requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={
        "cmd": "codex",
        "args": [
            "--quiet",
            "Add rate limiting middleware to all API routes. "
            "Use express-rate-limit with a 100 requests per 15 minute window. "
            "Write tests for the rate limiter."
        ],
        "cwd": "/home/user/my-project"
    }
).json()

print(result["stdout"])

# 4. Run tests to verify the changes
test_result = requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={"cmd": "npm", "args": ["test"], "cwd": "/home/user/my-project"}
).json()

print(test_result["stdout"])

# 5. Get the diff of changes made
diff = requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={"cmd": "git", "args": ["diff"], "cwd": "/home/user/my-project"}
).json()

print(diff["stdout"])

# 6. Clean up
requests.delete(f"{BASE}/sandboxes/{sandbox_id}", headers=HEADERS)
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | integer | 300 | Sandbox lifetime in seconds (max 3600) |
| `metadata` | object | `{}` | Custom key-value metadata |
| `envVars` | object | `{}` | Environment variables injected at boot |

### Required environment variables

```json
{
  "templateID": "codex",
  "timeout": 300,
  "envVars": {
    "OPENAI_API_KEY": "sk-..."
  }
}
```

### Custom timeout and metadata

```json
{
  "templateID": "codex",
  "timeout": 600,
  "metadata": {
    "task": "feature-implementation",
    "repo": "my-project",
    "branch": "feat/add-rate-limiting"
  }
}
```

### Additional environment variables

```json
{
  "templateID": "codex",
  "timeout": 300,
  "envVars": {
    "OPENAI_API_KEY": "sk-...",
    "GITHUB_TOKEN": "ghp_...",
    "NODE_ENV": "development"
  }
}
```

## Related

- [Create Sandbox](/api-reference/sandbox-api) — Full create endpoint reference
- [Execute Command](/api-reference/sandboxes/exec) — Run commands in a sandbox
- [File Operations](/api-reference/sandboxes/files) — Upload/download files
- [Sandbox Lifecycle](/agents/sandbox-lifecycle) — States, timeouts, pause/resume
- [All Templates](/api-reference/sandboxes/templates) — Overview of available templates
