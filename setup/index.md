---
title: Connect AI tools
description: Give Claude Code, Codex, Cursor, Kiro, and other AI tools the SandBase catalog of Models and APIs with one prompt or one CLI command.
---

# Connect AI tools

The [AI tools](https://www.sandbase.ai/console/setup) page in the Console (**Build → AI tools**) connects SandBase to the agent or AI tool you already use. Connected tools can search the SandBase catalog of Models and APIs, read each tool's input schema and price, and run it. Every call is billed to the active workspace.

Supported clients include Claude Code, Codex, Cursor, Kiro IDE and Kiro CLI, Windsurf, Gemini CLI, OpenCode, Qwen Code, Warp, Amp, Crush, OpenClaw, Hermes, Claude Desktop, and ChatGPT. The AI tools page lists the current set.

## Quick start: paste one prompt

Paste this line into your agent:

```text
set up https://www.sandbase.ai/SKILL.md
```

The agent reads the SandBase Skill, installs the CLI, and asks you to approve one browser sign-in. You do not paste an API key. When the agent reports that the client is configured, start a new session or restart the app so the `sandbase_*` tools load.

The Skill needs Node.js 20 or newer on the machine that runs the agent.

## Other ways to connect

### CLI

Connect from a terminal. Without `--client`, the CLI configures every supported client it finds:

```sh
npx -y @sandbaseai/cli@latest connect
```

To configure one client, pass its id, for example `codex`, `claude-code`, `cursor`, or `kiro`:

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

The installer script runs the same command:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

To list the clients the installer recognizes without changing local configuration:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` opens browser authorization, creates a **CLI Login** key for the workspace you approve, and writes only SandBase-owned client configuration. The open-source [SandBase CLI](https://github.com/sandbaseai/cli) documents each client.

### MCP clients you configure by hand

Signed-in users see the MCP server address under **Other ways to connect** on the [AI tools](https://www.sandbase.ai/console/setup) page. Authenticate it with an [API key](/getting-started/api-keys) from **Developer → API Keys**, and keep the key in the client's secret configuration.

## Verify the connection

Installation or authorization alone does not prove that a client is connected. Confirm that:

- the SandBase server or connector is visible in the client
- the `sandbase_*` tools are discoverable in a new session
- one safe natural-language request completes successfully

For CLI-managed clients, run the diagnostic after reconnecting or changing configuration:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` checks the local credential, MCP entry, and Skill, then makes one round trip to SandBase. Always perform the final tool call inside the client itself.

Runs made by connected tools appear in [Activities](https://www.sandbase.ai/console/activities) with their cost.

## Troubleshooting

| Problem | What to check |
|---|---|
| Tools do not appear | Start a new client session or restart the app, run `npx -y @sandbaseai/cli doctor --client <client>`, and retry. |
| Authorization is missing | Run `connect` again and approve the browser sign-in for the workspace you want to bill. |
| Calls fail with HTTP 402 | Add credit in [Billing](https://www.sandbase.ai/console/billing) for the active workspace. |

## Remove the managed configuration

Remove only the SandBase-owned entry for one client:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

The command removes only configuration whose SandBase ownership it can verify and leaves unrelated or user-managed entries unchanged. Then revoke the matching **CLI Login** key under **Developer → API Keys** if you no longer need it.

## Source and support

- [Source code](https://github.com/sandbaseai/cli)
- [npm package](https://www.npmjs.com/package/@sandbaseai/cli)
- [Questions and examples](https://github.com/sandbaseai/cli/discussions)
- [Bug reports](https://github.com/sandbaseai/cli/issues/new/choose)

## Next steps

- [Store](/store/)
- [Skill tutorials](/guides/skills/)
- [Build Agent](/agents/)
