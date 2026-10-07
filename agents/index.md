---
title: Build Agent
description: Define, test, and deploy reusable, versioned Agents in SandBase as Sessions, Services, and Schedules.
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
| How does it run? | A Session, a Service, or a Schedule |

Every effective change creates a new immutable version. You can list versions and restore an earlier one at any time.

## Three ways to run an Agent

| Mode | Use it when | What you get |
|---|---|---|
| [Session](/agents/sessions) | You want an interactive conversation or a test run | A `ses_` Session you send input to and stream events from |
| [Service](/agents/services) | An app or another tool should invoke the Agent on demand | A `run_` Run per invocation, each with its own Session |
| [Schedule](/agents/schedules) | The Agent should run on a cron schedule | A `run_` Run per firing or manual trigger, each with its own Session |

Services and Schedules are pinned to an Agent version when you create them (the current version if you do not choose one). They stay pinned to that version until you update their `agent_version`, so you can keep editing the Agent without changing what is deployed.

## Agent lifecycle: Draft → Test in a Session → Deploy → Inspect Runs

### 1. Draft

Create an Agent in the Console under **Build → Agents**, or with [`POST /v1/agents`](/agents/agent-api). Start with the smallest useful workflow and add Skills and MCP connections only when the instructions need them.

### 2. Test in a Session

Create a Session for the Agent, send representative input, and read the output, tool activity, and errors. Test missing input, unavailable tools, empty results, and output-format requirements, not only the happy path.

### 3. Deploy as a Service or Schedule

Create a Service when an application or MCP client should call the tested version. Create a Schedule when it should run repeatedly. Both are pinned to the version you tested.

### 4. Inspect Runs and Sessions

Every Service invocation and every Schedule firing creates a Run. A Run has a `status` (`pending`, `succeeded`, `failed`, `cancelled`, or `skipped` for Schedules) and a `session_id` that you can open with the Sessions API to read the full conversation.

## Production checklist

- `model` uses a current model ID from the Models API.
- Skills are pinned to a version when behavior must not change silently.
- MCP connections expose only the tools the Agent needs, using `allowed_tools`.
- Tokens are stored as [Secrets](/agents/api-credentials), never written into instructions, input, or metadata.
- Service and Schedule writes send an `Idempotency-Key`, and retries reuse it.
- Run `status` and `error_code` are checked after launch, and scheduled work has an owner.

## Catalog Agents

The public [Agent catalog](/api-reference/agents/catalog) lists Agents published by SandBase. You can read a catalog Agent, but to change it, clone it into your organization first with `POST /v1/agents/catalog/{agent_id}/clone`. The clone is a new private Agent that you own and can deploy.

::: tip Using the OpenAI SDK
Agents, Sessions, and Skills follow the OpenAI Agents API, so the official OpenAI SDK works with `base_url="https://api.sandbase.ai/v1"`. See [OpenAI compatibility](/agents/openai-compatibility) for verified examples and differences.
:::

## Next steps

- [Define an Agent](/agents/agent-api)
- [OpenAI compatibility](/agents/openai-compatibility)
- [Skills and MCP tools](/agents/mcp-tools)
- [Sessions](/agents/sessions)
- [Services](/agents/services)
- [Schedules](/agents/schedules)
