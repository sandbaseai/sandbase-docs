---
title: Setup
description: Connect an AI client to your SandBase workspace toolkit.
---

# Setup

Setup connects Codex, Claude Code, Cursor, and other supported clients to SandBase's remote MCP gateway. Your workspace toolkit determines which Models, APIs, and Services those clients can discover.

For a terminal-first setup, follow the [SandBase CLI guide](./cli) or run:

```sh
npx -y @sandbaseai/cli connect
```

## Connect a client

1. Open **Setup** in the Console and choose a supported client.
2. Run the displayed install command.
3. Complete browser authorization when prompted.
4. Restart the client if it was already open.
5. Ask it to discover SandBase tools and make a small test call.

The JavaScript CLI manages authorization, the local client configuration, and the remote capability bridge. Transport endpoints are managed by the CLI and are not part of the public API contract.

## Manage the workspace toolkit

Use **Installed Tools** to enable or remove Models, APIs, and Services. Connected clients receive the effective workspace toolkit on their next discovery; there is no user-selected active Setup Group.

SandBase may provide curated platform groups. A workspace can enable or disable those groups as inputs to its effective toolkit, but it does not clone or edit them as private groups.

## Troubleshooting

| Problem | What to check |
|---|---|
| Tool does not appear | Restart the client, run `sandbase doctor --client <client>`, and retry discovery. |
| Authorization is missing | Run `sandbase connect --client <client>` and complete the browser flow. |
| Tool is unavailable | Confirm it is enabled in the workspace toolkit and any required credential is configured. |

## Next steps

- [SandBase CLI guide](/setup/cli)
- [Installed Tools](/setup/installed)
- [Platform groups](/setup/groups)
- [Store](/store/)
- [Services](/agents/services)
