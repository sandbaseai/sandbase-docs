---
title: Build Agent
description: Define, test, and run reusable, versioned Agents in SandBase Sessions.
---

# Build Agent

Build Agent is where you define and test an Agent, then decide how it runs.

An Agent is a saved, versioned configuration: a Model, instructions, a runtime profile, Skills, and MCP connections to external tools. Saving an Agent does not run it.

## What an Agent is

| Question | Where it lives |
|---|---|
| What should it do? | `instructions` |
| Which model does the work? | `model`, a model ID from the [Models API](/api-reference/models/) |
| What does it know how to do? | [Skills](/agents/mcp-tools#skills), versioned instruction bundles |
| Which external tools can it call? | [MCP connections](/agents/mcp-tools#mcp-connections), with [credentials](/agents/api-credentials) when the server needs a token |
| How does it run? | In a [Session](/agents/sessions) |

Every effective change creates a new immutable version. You can list versions and restore an earlier one at any time.

## How an Agent runs

You run an Agent in a [Session](/agents/sessions). A Session is a `ses_` resource that you send input to and stream events from, whether for an interactive conversation, a test run, or a call from your application. Each Session freezes the Agent version it started with, so you can keep editing the Agent without changing Sessions that already exist.

## Agent lifecycle: Draft → Test in a Session → Run from your app → Inspect Sessions

### 1. Draft

Create an Agent in the Console under **Build → Agents**, or with [`POST /v1/agents`](/agents/agent-api). Start with the smallest useful workflow and add Skills and MCP connections only when the instructions need them.

### 2. Test in a Session

Create a Session for the Agent, send representative input, and read the output, tool activity, and errors. Test missing input, unavailable tools, empty results, and output-format requirements, not only the happy path.

### 3. Run from your app

Create Sessions for the tested Agent from your application with the [Sessions API](/api-reference/sessions/).

### 4. Inspect Sessions

Read each Session's items and turns with the Sessions API to review the full conversation, tool activity, and errors.

## Production checklist

- `model` uses a current model ID from the Models API.
- Skills are pinned to a version when behavior must not change silently.
- MCP connections expose only the tools the Agent needs, using `allowed_tools`.
- Tokens are stored as [Secrets](/agents/api-credentials), never written into instructions, input, or metadata.
- Session creation sends an `Idempotency-Key`, and retries reuse it.
- Session status and errors are checked after launch.

## Catalog Agents

The public [Agent catalog](/api-reference/agents/catalog) lists Agents published by SandBase. You can read a catalog Agent, but to change it, clone it into your organization first with `POST /v1/agents/catalog/{agent_id}/clone`. The clone is a new private Agent that you own and can run.

::: tip Using the OpenAI SDK
Agents, Sessions, and Skills follow the OpenAI Agents API, so the official OpenAI SDK works with `base_url="https://api.sandbase.ai/v1"`. See [OpenAI compatibility](/agents/openai-compatibility) for verified examples and differences.
:::

## Next steps

- [Define an Agent](/agents/agent-api)
- [OpenAI compatibility](/agents/openai-compatibility)
- [Skills and MCP tools](/agents/mcp-tools)
- [Sessions](/agents/sessions)
