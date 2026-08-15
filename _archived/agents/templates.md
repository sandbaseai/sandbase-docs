---
title: Available Templates
description: Pre-built sandbox templates on SandBase — code_interpreter, claude, codex, hermes-agent, opencode, desktop, and base.
---

# Available Templates

SandBase provides 7 pre-built templates for different use cases. Each template is a ready-to-use runtime environment with specific tools and libraries pre-installed.

## Template Overview

| Template | Description | Default Timeout | Key Software |
|----------|-------------|----------------|--------------|
| `code_interpreter` | Python data science environment | 300s | Python 3.11, NumPy, Pandas, Matplotlib |
| `claude` | Claude Code CLI agent | 600s | Claude Code CLI, Node.js, Git |
| `codex` | OpenAI Codex CLI agent | 600s | Codex CLI, Node.js, Git |
| `hermes-agent` | Nous Research self-improving agent | 600s | Hermes Agent, Python 3.11, Node.js |
| `opencode` | OpenCode terminal agent | 600s | OpenCode CLI, common dev tools |
| `desktop` | Full desktop GUI environment | 600s | VNC server, Chrome, VS Code |
| `base` | Minimal blank environment | 300s | Ubuntu base, curl, git |

## code_interpreter

A Python-focused environment for data analysis, visualization, and general code execution.

**Use cases:**
- Data analysis and transformation
- Chart and visualization generation
- Mathematical computations
- File processing (CSV, JSON, Excel)
- Web scraping

**Pre-installed libraries:**

| Category | Libraries |
|----------|-----------|
| Data | numpy, pandas, polars, scipy |
| Visualization | matplotlib, seaborn, plotly |
| ML | scikit-learn, xgboost |
| Web | requests, beautifulsoup4, httpx |
| Utilities | pillow, openpyxl, pyyaml, jinja2 |

**Example:**

```python
import requests

# Create a code_interpreter sandbox
response = requests.post(
    "https://api.sandbase.ai/sandboxes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={"templateID": "code_interpreter", "timeout": 300}
)
sandbox_id = response.json()["sandboxID"]

# Run data analysis
exec_response = requests.post(
    f"https://api.sandbase.ai/sandboxes/{sandbox_id}/processes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={
        "cmd": "python3",
        "args": ["-c", """
import pandas as pd
import numpy as np

data = pd.DataFrame({
    'x': np.random.randn(100),
    'y': np.random.randn(100)
})
print(data.describe().to_string())
"""]
    }
)
print(exec_response.json()["stdout"])
```

**Specs:**
- Python 3.11
- 2 vCPU, 4 GB RAM
- 10 GB disk
- Outbound internet enabled

---

## claude

A sandbox running the Claude Code CLI — Anthropic's autonomous coding agent that can read, write, and execute code.

**Use cases:**
- Autonomous code generation and refactoring
- Bug fixing and code review
- Project scaffolding
- Multi-file code changes

**Pre-installed software:**
- Claude Code CLI (latest)
- Node.js 20 LTS
- Python 3.11
- Git, ripgrep, fd
- Common build tools (gcc, make)

**Example:**

```python
# Create a Claude Code sandbox
response = requests.post(
    "https://api.sandbase.ai/sandboxes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={
        "templateID": "claude",
        "timeout": 600,
        "envVars": {
            "ANTHROPIC_API_KEY": "sk-ant-your-key"
        }
    }
)
sandbox_id = response.json()["sandboxID"]

# Run Claude Code on a task
exec_response = requests.post(
    f"https://api.sandbase.ai/sandboxes/{sandbox_id}/processes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={
        "cmd": "claude",
        "args": ["--print", "Create a Python Flask API with /health endpoint"],
        "cwd": "/workspace",
        "timeout": 120
    }
)
```

**Specs:**
- Node.js 20, Python 3.11
- 2 vCPU, 4 GB RAM
- 10 GB disk
- Outbound internet enabled
- Default timeout: 600s

---

## codex

A sandbox running OpenAI's Codex CLI — an autonomous coding agent powered by OpenAI models.

**Use cases:**
- AI-powered code generation
- Automated testing and debugging
- Code translation between languages
- Documentation generation

**Pre-installed software:**
- OpenAI Codex CLI (latest)
- Node.js 20 LTS
- Python 3.11
- Git, common dev tools

**Example:**

```python
# Create a Codex sandbox
response = requests.post(
    "https://api.sandbase.ai/sandboxes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={
        "templateID": "codex",
        "timeout": 600,
        "envVars": {
            "OPENAI_API_KEY": "sk-your-openai-key"
        }
    }
)
sandbox_id = response.json()["sandboxID"]

# Run Codex on a task
exec_response = requests.post(
    f"https://api.sandbase.ai/sandboxes/{sandbox_id}/processes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={
        "cmd": "codex",
        "args": ["--quiet", "Write unit tests for utils.py"],
        "cwd": "/workspace"
    }
)
```

**Specs:**
- Node.js 20, Python 3.11
- 2 vCPU, 4 GB RAM
- 10 GB disk
- Outbound internet enabled
- Default timeout: 600s

---

## hermes-agent

A sandbox running [Hermes Agent](https://github.com/NousResearch/hermes-agent) — Nous Research's self-improving AI agent with skills, persistent memory, and multi-provider LLM support.

**Use cases:**
- Autonomous coding with self-improving skills
- Multi-provider agent workflows (30+ LLM providers)
- Persistent assistant with cross-session memory
- Scheduled automation with cron
- Subagent delegation for parallel workstreams
- MCP server integration

**Pre-installed software:**
- Hermes Agent (latest)
- Python 3.11 with uv
- Node.js 20 LTS
- Git, ripgrep, fd, ffmpeg
- Common build tools

**Example:**

```python
# Create a Hermes sandbox
response = requests.post(
    "https://api.sandbase.ai/sandboxes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={
        "templateID": "hermes-agent",
        "timeout": 600,
        "envVars": {
            "OPENROUTER_API_KEY": "sk-or-your-key"
        }
    }
)
sandbox_id = response.json()["sandboxID"]

# Run Hermes on a task
exec_response = requests.post(
    f"https://api.sandbase.ai/sandboxes/{sandbox_id}/processes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={
        "cmd": "hermes",
        "args": ["--yes", "-z", "Analyze this codebase and add error handling to all API routes"],
        "cwd": "/home/user"
    }
)
```

**Specs:**
- Python 3.11, Node.js 20
- 4 vCPU, 8 GB RAM
- 10 GB disk
- Outbound internet enabled
- Default timeout: 600s

---

## opencode

A terminal-based AI coding agent environment running OpenCode.

**Use cases:**
- Terminal-based AI pair programming
- Shell script automation
- System administration tasks
- CLI tool development

**Pre-installed software:**
- OpenCode CLI (latest)
- Go 1.22
- Node.js 20, Python 3.11
- Docker CLI
- Common Unix tools

**Specs:**
- 2 vCPU, 4 GB RAM
- 10 GB disk
- Outbound internet enabled
- Default timeout: 600s

---

## desktop

A full desktop GUI environment accessible via VNC. Ideal for tasks that require a graphical interface.

**Use cases:**
- Browser-based testing and automation
- GUI application testing
- Visual design tasks
- Screen recording and demonstration

**Pre-installed software:**
- Ubuntu Desktop (XFCE)
- VNC server (noVNC web client)
- Google Chrome
- VS Code
- Python 3.11, Node.js 20

**Accessing the desktop:**

After creating a desktop sandbox, connect via the VNC URL provided in the sandbox details:

```python
response = requests.post(
    "https://api.sandbase.ai/sandboxes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={"templateID": "desktop", "timeout": 600}
)
sandbox = response.json()
# Access VNC at the provided URL
print(f"Desktop URL: {sandbox.get('clientID')}")
```

**Specs:**
- 2 vCPU, 4 GB RAM
- 10 GB disk
- VNC on port 6080
- Outbound internet enabled
- Default timeout: 600s

---

## base

A minimal Ubuntu environment for custom workloads. Use this when you need a clean slate.

**Use cases:**
- Custom tool installation
- Specialized runtime environments
- Testing and experimentation
- Lightweight script execution

**Pre-installed software:**
- Ubuntu 22.04 (minimal)
- curl, wget, git
- Python 3.11
- Basic build tools

**Example:**

```python
# Create a base sandbox and install custom tools
response = requests.post(
    "https://api.sandbase.ai/sandboxes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={"templateID": "base", "timeout": 300}
)
sandbox_id = response.json()["sandboxID"]

# Install custom software
requests.post(
    f"https://api.sandbase.ai/sandboxes/{sandbox_id}/processes",
    headers={"Authorization": "Bearer sk-sb-your-key"},
    json={
        "cmd": "bash",
        "args": ["-c", "apt-get update && apt-get install -y redis-server"]
    }
)
```

**Specs:**
- 2 vCPU, 4 GB RAM
- 10 GB disk
- Outbound internet enabled
- Default timeout: 300s

## Listing Available Templates

Retrieve the list of available templates via API:

```bash
curl https://api.sandbase.ai/templates \
  -H "Authorization: Bearer sk-sb-your-key"
```

Response:

```json
[
  {
    "templateID": "code_interpreter",
    "name": "Code Interpreter",
    "description": "Python data science environment with NumPy, Pandas, Matplotlib",
    "defaultTimeout": 300
  },
  {
    "templateID": "claude",
    "name": "Claude Code",
    "description": "Claude Code CLI for autonomous coding",
    "defaultTimeout": 600
  }
]
```
