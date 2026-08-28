---
title: Credentials for Agent tools
description: Securely store and scope API keys, tokens, and other credentials used by SandBase Agents and Services.
---

# Credentials for Agent tools

Credentials are the API keys, tokens, connection strings, and other private values an Agent needs to use external services.

## How credentials work

SandBase stores each credential as an encrypted, write-only value. The Console and public API expose its name, scope, status, and a masked hint—not the saved value. At execution time, the runtime resolves active credentials that match the Agent or Service configuration.

## Managing credentials

### In the Console

Navigate to **Developer → Credentials**.

When adding a credential, choose the narrowest useful scope:

| Scope | Use it for |
|---|---|
| Workspace | A value available to eligible Agents in the current workspace |
| Agent | A value associated with one Agent ID |
| Service | A value available to a published Service workflow |

Saved values cannot be read back. To replace one, use the credential's **Manage** action and rotate it. A credential can be disabled; disabled records remain visible as metadata.

### Common Variables

| Variable | Example | Purpose |
|----------|---------|---------|
| `GITHUB_TOKEN` | `ghp_xxxx` | Authenticate with GitHub API |
| `DATABASE_URL` | `postgres://...` | Connect to a database |
| `SLACK_WEBHOOK` | `https://hooks.slack.com/...` | Post notifications |
| `OPENAI_API_KEY` | `sk-...` | Call OpenAI directly from a tool |

## Security

- Values are encrypted before storage and omitted from credential responses
- The Console shows only masked metadata after creation
- Scopes control where a credential can be selected; use Agent scope when a workspace-wide value is unnecessary
- Keep secrets out of prompts, instructions, test input, and manually authored event payloads

## Next steps

- [Define an Agent](/agents/agent-api) — create an Agent that uses credentials
- [Tools and credentials](/agents/mcp-tools) — capabilities that consume these secrets
- [Services](/agents/services) — publish an Agent with its credentials available at runtime
