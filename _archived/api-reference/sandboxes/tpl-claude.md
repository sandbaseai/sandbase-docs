---
title: "Template: claude"
description: "Claude Code CLI sandbox for autonomous coding, refactoring, and code review. 4 vCPU, 8 GB RAM, boots in ~60ms."
---

# claude

Sandbox with [Claude Code CLI](https://docs.anthropic.com/en/docs/claude-code) pre-installed — Anthropic's autonomous coding agent that can read, write, and execute code across entire projects. Boots in ~60ms with a full development environment ready to go.

## Specs

| Property | Value |
|----------|-------|
| Template ID | `claude` |
| Default Timeout | 600s (10 min) |
| CPU | 4 vCPU |
| Memory | 8 GB |
| Disk | 10 GB |
| Boot Time | ~60ms |
| Internet | Enabled |
| Working Directory | `/home/user` |

## Pre-installed Software

- **Claude Code CLI** (latest) — Anthropic's agentic coding tool
- **Node.js 20 LTS** with npm
- **Python 3.11** with pip
- **Git** — version control
- **ripgrep, fd** — fast file search utilities
- **Common build tools** — gcc, make, curl, wget

::: tip
Claude Code requires an `ANTHROPIC_API_KEY` environment variable. Pass it via `envVars` when creating the sandbox.
:::

## Claude Code CLI Capabilities

Claude Code operates as an autonomous coding agent inside the sandbox. It can:

- **Read & understand** entire codebases — navigates files, follows imports, understands architecture
- **Write & edit** code across multiple files in a single session
- **Execute** shell commands, run tests, install dependencies
- **Iterate** on errors — reads compiler/test output and fixes issues automatically
- **Explain** code, suggest improvements, and answer questions about a project

The CLI accepts natural language prompts and translates them into concrete code changes.

## Use Cases

- **Autonomous coding** — Give Claude Code a task and let it implement features end-to-end
- **Code review** — Point it at a PR diff or file and get detailed feedback
- **Refactoring** — Rename, restructure, or modernize code across an entire project
- **Bug fixing** — Describe a bug and let it trace the root cause and apply a fix
- **Project scaffolding** — Generate boilerplate, configs, and directory structures
- **Test generation** — Automatically write unit and integration tests for existing code
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
    "templateID": "claude",
    "timeout": 600,
    "envVars": {
      "ANTHROPIC_API_KEY": "sk-ant-YOUR_ANTHROPIC_KEY"
    }
  }'
```

**Response:**

```json
{
  "sandboxID": "sbx_01abc...",
  "templateID": "claude",
  "clientID": "SandBase",
  "status": "running",
  "startedAt": "2024-07-01T12:00:00Z",
  "endAt": "2024-07-01T12:10:00Z"
}
```

## Run Claude Code Commands

Once the sandbox is running, invoke Claude Code via the [exec endpoint](/api-reference/sandboxes/exec):

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_01abc.../processes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cmd": "claude",
    "args": ["-p", "Create a hello world Express.js server with health check endpoint"]
  }'
```

The `-p` flag runs Claude Code in **print mode** — it executes the prompt non-interactively and outputs the result, which is ideal for API-driven workflows.

## Full Example — Autonomous Code Generation

```python
import requests

BASE = "https://api.sandbase.ai"
HEADERS = {"Authorization": "Bearer sk-sb-YOUR_KEY"}

# 1. Create sandbox with Claude Code (~60ms)
sandbox = requests.post(f"{BASE}/sandboxes", headers=HEADERS, json={
    "templateID": "claude",
    "timeout": 600,
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

# 3. Run Claude Code to implement a feature
result = requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={
        "cmd": "claude",
        "args": [
            "-p",
            "Add input validation to all API endpoints in src/routes/. "
            "Use zod for schema validation. Write tests for each validator."
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
| `timeout` | integer | 600 | Sandbox lifetime in seconds (max 3600) |
| `metadata` | object | `{}` | Custom key-value metadata |
| `envVars` | object | `{}` | Environment variables injected at boot |

### Required environment variables

```json
{
  "templateID": "claude",
  "timeout": 600,
  "envVars": {
    "ANTHROPIC_API_KEY": "sk-ant-..."
  }
}
```

### Custom timeout and metadata

```json
{
  "templateID": "claude",
  "timeout": 1800,
  "metadata": {
    "task": "feature-implementation",
    "repo": "my-project",
    "branch": "feat/add-validation"
  }
}
```

### Additional environment variables

```json
{
  "templateID": "claude",
  "timeout": 600,
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
