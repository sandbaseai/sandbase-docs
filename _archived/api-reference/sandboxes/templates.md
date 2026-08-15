---
title: Templates
---

# Sandbox Templates

<div style="display:flex;align-items:center;gap:8px;margin-bottom:16px">
  <span style="background:#3b82f6;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px;font-weight:700">GET</span>
  <code>/templates</code>
</div>

List available sandbox templates.

## Available Templates

| Template ID | Name | Default Timeout | Description |
|-------------|------|----------------|-------------|
| `code_interpreter` | Code Interpreter | 300s | Python 3.11, NumPy, Pandas, Matplotlib |
| `claude` | Claude Code | 600s | Claude Code CLI, Node.js, Git |
| `codex` | Codex | 600s | OpenAI Codex CLI, Node.js, Git |
| `hermes-agent` | Hermes Agent | 600s | Nous Research Hermes Agent, Python 3.11, Node.js |
| `opencode` | OpenCode | 600s | OpenCode CLI, Go, Docker |
| `desktop` | Desktop | 600s | Full GUI (XFCE), VNC, Chrome, VS Code |
| `base` | Base | 300s | Minimal Ubuntu, curl, git, Python |

## Response Example

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

## Template Specs

All templates share the same resource limits:

| Resource | Limit |
|----------|-------|
| CPU | 2 vCPU |
| Memory | 4 GB |
| Disk | 10 GB |
| Boot time | ~60ms (code_interpreter, base) to ~5s (desktop) |
| Max lifetime | 1 hour |
| Outbound internet | Enabled |

→ [Detailed template documentation](/agents/templates)
