---
title: "Template: opencode"
description: "OpenCode CLI sandbox for terminal-based AI coding with any LLM provider. 2 vCPU, 2 GB RAM, boots in ~60ms."
---

# opencode

Sandbox with [OpenCode CLI](https://github.com/opencode-ai/opencode) pre-installed — an open-source terminal-based AI coding assistant that works with any LLM provider (OpenAI, Anthropic, Google, local models). Boots in ~60ms with a full development environment ready to go.

## Specs

| Property | Value |
|----------|-------|
| Template ID | `opencode` |
| Default Timeout | 300s (5 min) |
| CPU | 2 vCPU |
| Memory | 2 GB |
| Disk | 10 GB |
| Boot Time | ~60ms |
| Internet | Enabled |
| Working Directory | `/home/user` |

## Pre-installed Software

- **OpenCode CLI** (latest) — open-source terminal AI coding assistant
- **Node.js 20 LTS** with npm
- **Python 3.11** with pip
- **Git** — version control
- **ripgrep, fd** — fast file search utilities
- **Common build tools** — gcc, make, curl, wget

::: tip
OpenCode supports multiple LLM providers. Pass your provider API key (e.g. `OPENAI_API_KEY` or `ANTHROPIC_API_KEY`) via `envVars` when creating the sandbox.
:::

## OpenCode CLI Capabilities

OpenCode is an open-source, terminal-native AI coding assistant. It can:

- **Multi-provider support** — works with OpenAI, Anthropic, Google, Azure, and local models via a unified interface
- **Read & navigate** codebases — understands project structure, follows imports, maps dependencies
- **Write & edit** code across multiple files in a single session
- **Execute** shell commands, run tests, install packages
- **Iterate** on errors — reads compiler/test output and self-corrects
- **LSP integration** — leverages language server protocol for intelligent code understanding
- **Conversation history** — maintains context across interactions within a session

The CLI accepts natural language prompts and translates them into code changes using your configured LLM provider.

## Use Cases

- **Provider-flexible coding** — Use any LLM backend (OpenAI, Anthropic, local) for autonomous coding tasks
- **Autonomous implementation** — Give OpenCode a task and let it implement features end-to-end
- **Bug fixing** — Describe a bug and let it trace the root cause and apply a fix
- **Refactoring** — Restructure, optimize, or modernize code across a project
- **Code exploration** — Navigate and understand unfamiliar codebases interactively
- **Test generation** — Automatically write unit and integration tests for existing code
- **Multi-model workflows** — Switch between models mid-session for cost/quality tradeoffs

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
    "templateID": "opencode",
    "timeout": 300,
    "envVars": {
      "ANTHROPIC_API_KEY": "sk-ant-YOUR_ANTHROPIC_KEY"
    }
  }'
```

**Response:**

```json
{
  "sandboxID": "sbx_03ghi...",
  "templateID": "opencode",
  "clientID": "SandBase",
  "status": "running",
  "startedAt": "2024-07-01T12:00:00Z",
  "endAt": "2024-07-01T12:05:00Z"
}
```

## Run OpenCode Commands

Once the sandbox is running, invoke OpenCode via the [exec endpoint](/api-reference/sandboxes/exec):

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_03ghi.../processes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cmd": "opencode",
    "args": ["-p", "Create a REST API with Fastify that has CRUD endpoints for a notes app"]
  }'
```

The `-p` flag runs OpenCode in **prompt mode** — it executes the prompt non-interactively and outputs the result, which is ideal for API-driven workflows.

## Full Example — Autonomous Code Generation

```python
import requests

BASE = "https://api.sandbase.ai"
HEADERS = {"Authorization": "Bearer sk-sb-YOUR_KEY"}

# 1. Create sandbox with OpenCode CLI (~60ms)
sandbox = requests.post(f"{BASE}/sandboxes", headers=HEADERS, json={
    "templateID": "opencode",
    "timeout": 300,
    "envVars": {
        "ANTHROPIC_API_KEY": "sk-ant-YOUR_ANTHROPIC_KEY"
    }
}).json()

sandbox_id = sandbox["sandboxID"]

# 2. Clone a repository
requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={"cmd": "git", "args": ["clone", "https://github.com/user/my-project.git"]}
).json()

# 3. Run OpenCode to implement a feature
result = requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={
        "cmd": "opencode",
        "args": [
            "-p",
            "Add authentication middleware using JWT. "
            "Create login and register endpoints. "
            "Write tests for the auth flow."
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

### Using with Anthropic

```json
{
  "templateID": "opencode",
  "timeout": 300,
  "envVars": {
    "ANTHROPIC_API_KEY": "sk-ant-..."
  }
}
```

### Using with OpenAI

```json
{
  "templateID": "opencode",
  "timeout": 300,
  "envVars": {
    "OPENAI_API_KEY": "sk-..."
  }
}
```

### Custom timeout and metadata

```json
{
  "templateID": "opencode",
  "timeout": 600,
  "metadata": {
    "task": "feature-implementation",
    "repo": "my-project",
    "branch": "feat/add-auth"
  }
}
```

### Additional environment variables

```json
{
  "templateID": "opencode",
  "timeout": 300,
  "envVars": {
    "ANTHROPIC_API_KEY": "sk-ant-...",
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
