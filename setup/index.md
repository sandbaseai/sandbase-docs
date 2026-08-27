---
title: Connect AI tools
description: Connect Codex, Claude Code, Cursor, and other supported AI clients to SandBase.
---

# Connect AI tools

[SandBase CLI](https://github.com/sandbaseai/cli) is the open-source onboarding tool and local MCP bridge for SandBase. It connects Codex, Claude Code, Cursor, Gemini CLI, Windsurf, OpenCode, and other supported clients to the Models, APIs, and Services enabled in your workspace toolkit.

## Quick start

Connect every supported client detected on your computer:

```sh
npx -y @sandbaseai/cli connect
```

The command opens browser authorization, stores the resulting credential locally with restricted file permissions, and adds a SandBase-owned MCP configuration to each selected client.

To configure one client only:

```sh
# OpenAI Codex
npx -y @sandbaseai/cli connect --client codex

# Claude Code
npx -y @sandbaseai/cli connect --client claude-code

# Cursor
npx -y @sandbaseai/cli connect --client cursor
```

You can also open **Setup** in the SandBase Console, choose a supported client, and run the command shown there. Restart a client if it was already open.

## Verify the connection

Run the health check after reconnecting or changing a client configuration:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

Preview the complete compatibility catalog without signing in or changing local files:

```sh
npx -y @sandbaseai/cli catalog --json
```

## What your agent receives

The local bridge exposes six progressively disclosed MCP tools:

| Tool | Purpose |
| --- | --- |
| `sandbase_discover` | Search the model and API catalog |
| `sandbase_inspect` | Read the selected capability's schema and pricing |
| `sandbase_run` | Start a model or API request |
| `sandbase_run_get` | Poll an asynchronous request |
| `sandbase_runs` | Review recent requests and costs |
| `sandbase_account` | Check the current account balance |

The normal agent workflow is `discover → inspect → run`. The bridge starts on demand over stdio; it does not install a background daemon.

Transport endpoints are managed by the CLI and are not part of the public API contract.

## Manage the workspace toolkit

Use **Installed Tools** to enable or remove Models, APIs, and Services. Connected clients receive the effective workspace toolkit on their next discovery; there is no user-selected active Setup Group.

SandBase may provide curated platform groups. A workspace can enable or disable those groups as inputs to its effective toolkit, but it does not clone or edit them as private groups.

## Troubleshooting

| Problem | What to check |
|---|---|
| Tool does not appear | Restart the client, run `sandbase doctor --client <client>`, and retry discovery. |
| Authorization is missing | Run `sandbase connect --client <client>` and complete the browser flow. |
| Tool is unavailable | Confirm it is enabled in the workspace toolkit and any required credential is configured. |

## Remove the managed configuration

Remove only the SandBase-owned entry for one client:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

SandBase leaves unrelated and user-managed MCP entries unchanged. Revoke the corresponding credential in the SandBase Console when it is no longer needed.

## Source and support

- [Source code](https://github.com/sandbaseai/cli)
- [npm package](https://www.npmjs.com/package/@sandbaseai/cli)
- [Questions and examples](https://github.com/sandbaseai/cli/discussions)
- [Bug reports](https://github.com/sandbaseai/cli/issues/new/choose)

## Next steps

- [Installed Tools](/setup/installed)
- [Platform groups](/setup/groups)
- [Store](/store/)
- [Services](/agents/services)
