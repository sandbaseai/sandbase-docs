---
title: SandBase CLI for Codex, Claude Code, and Cursor
description: Connect Codex, Claude Code, Cursor, Gemini CLI, Windsurf, and other MCP clients to 2,000+ AI models with one SandBase CLI command.
---

# Connect AI clients with SandBase CLI

[SandBase CLI](https://github.com/sandbaseai/cli) is the open-source onboarding
tool and local MCP bridge for SandBase. It connects Codex, Claude Code, Cursor,
Gemini CLI, Windsurf, OpenCode, and other supported clients to 2,000+ AI models.

## Quick start

Connect every supported client detected on your computer:

```sh
npx -y @sandbaseai/cli connect
```

The command opens browser authorization, stores the resulting credential locally
with restricted file permissions, and adds a SandBase-owned MCP configuration to
each selected client.

To configure one client only:

```sh
# OpenAI Codex
npx -y @sandbaseai/cli connect --client codex

# Claude Code
npx -y @sandbaseai/cli connect --client claude-code

# Cursor
npx -y @sandbaseai/cli connect --client cursor
```

## Verify the connection

Run the health check after reconnecting or changing a client configuration:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

You can also preview the complete compatibility catalog without signing in or
changing local files:

```sh
npx -y @sandbaseai/cli catalog --json
```

## What your agent receives

The local bridge exposes six progressively disclosed MCP tools:

| Tool | Purpose |
| --- | --- |
| `sandbase_discover` | Search the catalog of 2,000+ AI models |
| `sandbase_inspect` | Read the selected model's schema and pricing |
| `sandbase_run` | Start a model or API request |
| `sandbase_run_get` | Poll an asynchronous request |
| `sandbase_runs` | Review recent requests and costs |
| `sandbase_account` | Check the current account balance |

The normal agent workflow is `discover → inspect → run`. The bridge starts on
demand over stdio; it does not install a background daemon.

## Remove the managed configuration

Remove only the SandBase-owned entry for one client:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

SandBase leaves unrelated and user-managed MCP entries unchanged. Revoke the
corresponding credential in the SandBase Dashboard when it is no longer needed.

## Source and support

- [Source code](https://github.com/sandbaseai/cli)
- [npm package](https://www.npmjs.com/package/@sandbaseai/cli)
- [Questions and examples](https://github.com/sandbaseai/cli/discussions)
- [Bug reports](https://github.com/sandbaseai/cli/issues/new/choose)

If the integration helps your workflow, [star SandBase CLI on
GitHub](https://github.com/sandbaseai/cli) so other agent developers can find it.

