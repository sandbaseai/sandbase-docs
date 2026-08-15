---
title: API Credentials
description: Store API keys and other secrets your Agents need when using external tools.
---

# API Credentials

Credentials are the API keys, tokens, connection strings, and other private values an Agent needs to use external services.

## How credentials work

When an Agent executes, SandBase injects its credentials as environment variables. The variables are available to selected APIs and tools but are never written into prompts, logs, or Session history.

## Managing credentials

### In the Console

Navigate to **Agents → [Your Agent] → Credentials** to add, edit, or remove private values.

### Common Variables

| Variable | Example | Purpose |
|----------|---------|---------|
| `GITHUB_TOKEN` | `ghp_xxxx` | Authenticate with GitHub API |
| `DATABASE_URL` | `postgres://...` | Connect to a database |
| `SLACK_WEBHOOK` | `https://hooks.slack.com/...` | Post notifications |
| `OPENAI_API_KEY` | `sk-...` | Call OpenAI directly from a tool |

## Security

- Variables are encrypted at rest
- Only accessible during Agent execution
- Not visible in run logs or event streams
- Scoped to a specific Agent (not shared across agents)

## Next steps

- [Define an Agent](/agents/agent-api) — create an Agent that uses credentials
- [Tools and credentials](/agents/mcp-tools) — capabilities that consume these secrets
- [Services](/agents/services) — publish an Agent with its credentials available at runtime
