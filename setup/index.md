---
title: Connect AI tools
description: Connect Codex, Claude Code, Cursor, and other supported AI tools to SandBase with the guided Setup flow.
---

# Connect AI tools

Setup connects SandBase to the AI tool you already use. The guided flow supports Codex, Claude Code, Cursor, Gemini CLI, Windsurf, OpenCode, and other clients. Depending on the client, Setup provides a CLI command, a reviewed Skill prompt, or manual import instructions.

## Quick start

1. Open [Setup in the SandBase Console](https://www.sandbase.ai/console/setup).
2. Choose your AI tool.
3. Review its prerequisites and run the command or import steps shown.
4. Complete browser authorization when prompted.
5. Restart or reload the client if instructed, then verify the SandBase entry and make a safe tool request.

For a CLI-supported client such as Codex, the command follows this form:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

The Codex flow currently requires Node.js 20 or newer. Other clients can have different prerequisites, installation methods, policy checks, or administrator requirements; use the requirements shown after selecting that client in Console Setup. The installer starts the open-source [SandBase CLI](https://github.com/sandbaseai/cli), opens browser authorization when required, and manages only SandBase-owned client configuration. The Console is the source of truth for each client's current support status and exact completion steps.

To inspect the clients recognized by the installer without changing local configuration:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

## Verify the connection

Installation or authorization alone does not prove that a client is connected. After following the client-specific instructions, confirm that:

- the SandBase server or connector is visible in the client
- the expected SandBase tools are discoverable
- one safe natural-language request completes successfully

For CLI-managed clients, run the diagnostic command after reconnecting or changing configuration:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

The diagnostic checks local configuration and client-specific readback. Always perform the final tool call inside the client itself.

## Manage workspace services

[Workspace Services](https://www.sandbase.ai/console/setup/installed) controls what connected AI tools can discover. It organizes the workspace into Core services, My Custom, and SandBase-maintained Scenarios. My Custom can include Models, APIs, and Services selected for the organization.

Changes apply to the organization workspace. Open a new client session or run discovery again after changing the selection.

## Troubleshooting

| Problem | What to check |
|---|---|
| Tool does not appear | Restart or reload the client, run `npx -y @sandbaseai/cli doctor --client <client>` for CLI-managed clients, and retry discovery. |
| Authorization is missing | Return to Console Setup, rerun the client-specific flow, and complete browser authorization. |
| Capability is unavailable | Confirm it is enabled in Workspace Services and that any required credential is configured. |

## Remove the managed configuration

Remove only the SandBase-owned entry for one client:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

The command removes only configuration whose SandBase ownership it can verify and leaves unrelated or user-managed entries unchanged. Review the result, then revoke the corresponding **CLI Login** key under **Developer → API Keys** when it is no longer needed.

## Source and support

- [Source code](https://github.com/sandbaseai/cli)
- [npm package](https://www.npmjs.com/package/@sandbaseai/cli)
- [Questions and examples](https://github.com/sandbaseai/cli/discussions)
- [Bug reports](https://github.com/sandbaseai/cli/issues/new/choose)

## Next steps

- [Workspace Services](/setup/installed)
- [Store](/store/)
- [Services](/agents/services)
