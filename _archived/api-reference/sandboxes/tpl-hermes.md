---
title: "Template: hermes-agent"
description: "Nous Research Hermes Agent sandbox — self-improving AI agent with skills, memory, multi-provider LLM support, and messaging gateway. 4 vCPU, 8 GB RAM, boots in ~60ms."
---

# hermes-agent

Sandbox with [Hermes Agent](https://github.com/NousResearch/hermes-agent) pre-installed — Nous Research's self-improving AI agent that creates skills from experience, maintains persistent memory across sessions, and supports 30+ LLM providers out of the box. Boots in ~60ms with a full agent runtime ready to go.

## Specs

| Property | Value |
|----------|-------|
| Template ID | `hermes-agent` |
| Default Timeout | 600s (10 min) |
| CPU | 2 vCPU |
| Memory | 4 GB |
| Disk | 10 GB |
| Boot Time | ~60ms |
| Internet | Enabled |
| Working Directory | `/home/user` |

## Pre-installed Software

- **Hermes Agent** (latest) — Nous Research's self-improving AI agent
- **Python 3.11** with pip and uv
- **Node.js 20 LTS** with npm
- **Git** — version control
- **ripgrep, fd, ffmpeg** — fast search and media utilities
- **Common build tools** — gcc, make, curl, wget

::: tip
Hermes Agent requires at least one LLM provider configured. The simplest option is setting `OPENROUTER_API_KEY` for access to 200+ models. Alternatively, use `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, or any other supported provider key.
:::

## Hermes Agent Capabilities

Hermes Agent operates as an autonomous, self-improving AI agent inside the sandbox. It can:

- **Self-improving skills** — Automatically creates reusable skills from complex tasks, and improves them during use
- **Persistent memory** — Maintains context across sessions with agent-curated memory and periodic nudges
- **Multi-provider routing** — Switch between 30+ LLM providers (OpenRouter, Anthropic, OpenAI, DeepSeek, Qwen, etc.) with zero code changes
- **Tool execution** — Terminal commands, file operations, web search, image generation, TTS, and more
- **Subagent delegation** — Spawn isolated subagents for parallel workstreams
- **MCP integration** — Connect any MCP server for extended capabilities
- **Messaging gateway** — Telegram, Discord, Slack, WhatsApp, Signal, Email, Home Assistant, Teams

The CLI accepts natural language prompts and translates them into multi-step tool-calling workflows.

## Use Cases

- **Autonomous coding** — Give Hermes a task and let it implement features with self-improving skills
- **Multi-provider agent workflows** — Route tasks to the best model for each subtask
- **Persistent assistant** — Long-running agent that remembers context across sessions
- **Bot deployment** — Connect to Telegram/Discord/Slack as an always-on assistant
- **Scheduled automation** — Cron-based tasks with delivery to any platform
- **Research & analysis** — Web search, document processing, and summarization
- **Parallel workstreams** — Delegate subtasks to isolated subagents

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
    "templateID": "hermes-agent",
    "timeout": 600,
    "envVars": {
      "OPENROUTER_API_KEY": "sk-or-YOUR_OPENROUTER_KEY"
    }
  }'
```

**Response:**

```json
{
  "sandboxID": "sbx_01abc...",
  "templateID": "hermes-agent",
  "clientID": "erouter",
  "status": "running",
  "startedAt": "2026-05-27T12:00:00Z",
  "endAt": "2026-05-27T12:10:00Z"
}
```

## Run Hermes Commands

Once the sandbox is running, invoke Hermes via the [exec endpoint](/api-reference/sandboxes/exec):

```bash
curl -X POST https://api.sandbase.ai/sandboxes/sbx_01abc.../processes \
  -H "Authorization: Bearer sk-sb-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cmd": "hermes",
    "args": ["--yes", "-z", "Summarize this directory and identify the main entrypoint"]
  }'
```

The `--yes` flag auto-approves tool use, and `-z` passes a prompt for non-interactive execution — ideal for API-driven workflows.

## Full Example — Autonomous Agent with Skills

```python
import requests

BASE = "https://api.sandbase.ai"
HEADERS = {"Authorization": "Bearer sk-sb-YOUR_KEY"}

# 1. Create sandbox with Hermes Agent (~60ms)
sandbox = requests.post(f"{BASE}/sandboxes", headers=HEADERS, json={
    "templateID": "hermes-agent",
    "timeout": 600,
    "envVars": {
        "OPENROUTER_API_KEY": "sk-or-YOUR_KEY"
    }
}).json()

sandbox_id = sandbox["sandboxID"]

# 2. Clone a repository
requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={"cmd": "git", "args": ["clone", "https://github.com/user/my-project.git"]}
).json()

# 3. Run Hermes to analyze and implement a feature
result = requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={
        "cmd": "hermes",
        "args": [
            "--yes", "-z",
            "Analyze this codebase, then add comprehensive error handling "
            "to all API routes. Create a skill for the error handling pattern "
            "so it can be reused in future tasks."
        ],
        "cwd": "/home/user/my-project",
        "timeout": 300
    }
).json()

print(result["stdout"])

# 4. List skills created by the agent
skills = requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={"cmd": "hermes", "args": ["skills", "list"]}
).json()

print(skills["stdout"])

# 5. Run tests
test_result = requests.post(
    f"{BASE}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={"cmd": "npm", "args": ["test"], "cwd": "/home/user/my-project"}
).json()

print(test_result["stdout"])

# 6. Clean up
requests.delete(f"{BASE}/sandboxes/{sandbox_id}", headers=HEADERS)
```

## Provider Configuration

Hermes supports 30+ LLM providers. Pass the appropriate API key via `envVars`:

### OpenRouter (200+ models, recommended for flexibility)

```json
{
  "templateID": "hermes-agent",
  "timeout": 600,
  "envVars": {
    "OPENROUTER_API_KEY": "sk-or-..."
  }
}
```

### Anthropic (Claude models)

```json
{
  "templateID": "hermes-agent",
  "timeout": 600,
  "envVars": {
    "ANTHROPIC_API_KEY": "sk-ant-..."
  }
}
```

### OpenAI

```json
{
  "templateID": "hermes-agent",
  "timeout": 600,
  "envVars": {
    "OPENAI_API_KEY": "sk-..."
  }
}
```

### Nous Portal (300+ models + Tool Gateway)

```json
{
  "templateID": "hermes-agent",
  "timeout": 600,
  "envVars": {
    "NOUS_API_KEY": "nous-..."
  }
}
```

### DeepSeek

```json
{
  "templateID": "hermes-agent",
  "timeout": 600,
  "envVars": {
    "DEEPSEEK_API_KEY": "sk-..."
  }
}
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | integer | 600 | Sandbox lifetime in seconds (max 3600) |
| `metadata` | object | `{}` | Custom key-value metadata |
| `envVars` | object | `{}` | Environment variables injected at boot |

### Custom timeout with metadata

```json
{
  "templateID": "hermes-agent",
  "timeout": 1800,
  "metadata": {
    "task": "code-review",
    "repo": "my-project",
    "workflow": "ci-agent"
  }
}
```

### Multi-provider with MCP servers

```json
{
  "templateID": "hermes-agent",
  "timeout": 900,
  "envVars": {
    "OPENROUTER_API_KEY": "sk-or-...",
    "GITHUB_TOKEN": "ghp_...",
    "HERMES_MCP_CONFIG": "{\"github\":{\"command\":\"npx\",\"args\":[\"-y\",\"@modelcontextprotocol/server-github\"]}}"
  }
}
```

## Key Differences from Other Agent Templates

| Feature | hermes-agent | claude | codex | opencode |
|---------|--------|--------|-------|----------|
| Self-improving skills | ✅ | ❌ | ❌ | ❌ |
| Persistent memory | ✅ | ❌ | ❌ | ❌ |
| Multi-provider (30+) | ✅ | Anthropic only | OpenAI only | Multi |
| Messaging gateway | ✅ | ❌ | ❌ | ❌ |
| Subagent delegation | ✅ | ❌ | ❌ | ❌ |
| MCP integration | ✅ | ❌ | ❌ | ❌ |
| Cron scheduling | ✅ | ❌ | ❌ | ❌ |
| Min context window | 64K | N/A | N/A | N/A |

## Related

- [Create Sandbox](/api-reference/sandbox-api) — Full create endpoint reference
- [Execute Command](/api-reference/sandboxes/exec) — Run commands in a sandbox
- [File Operations](/api-reference/sandboxes/files) — Upload/download files
- [Sandbox Lifecycle](/agents/sandbox-lifecycle) — States, timeouts, pause/resume
- [All Templates](/api-reference/sandboxes/templates) — Overview of available templates
