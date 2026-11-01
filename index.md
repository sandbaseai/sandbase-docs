---
title: SandBase Docs
description: Build with Models and APIs directly, or define reusable Agents that run on managed infrastructure.
---

# SandBase Docs

Build with Models and APIs directly, or define reusable Agents that run on managed infrastructure.

SandBase provides two complementary ways to build AI applications. Start with the smallest surface that fits the work; you can combine them as the application grows.

## Choose how to build

| | Models and APIs | Managed Agents |
|---|---|---|
| **What it is** | Direct access to language, image, video, audio, and third-party APIs | Reusable, versioned Agent configurations executed by SandBase |
| **Best for** | Custom application loops and fine-grained request control | Multi-step, asynchronous, or repeatable work |
| **You manage** | Prompts, orchestration, retries, and application state | Agent definition, enabled capabilities, inputs, and delivery behavior |
| **Start here** | [Models and APIs](https://www.sandbase.ai/models) | [Build Agent](/agents/) |

::: tip One SandBase API key
The same API key can call Models, APIs, and Agents. Keep keys on the server and never expose them in browser code.
:::

## Core concepts

### Models and APIs

Use Models for language, image, video, and audio workloads. Use APIs when the application needs external data or actions. The catalog on the SandBase website shows available capabilities, pricing, input schemas, and working examples.

- [Browse Models](https://www.sandbase.ai/models)
- [Browse APIs](https://www.sandbase.ai/apis)
- [Make your first API call](/getting-started/first-call)
- [Open the Model API Reference](/model-api-reference/)

### Agents

An Agent is a reusable, versioned configuration containing a Model, instructions, Skills, and MCP connections. Define it once, then run it in Sessions.

- [Understand Agents](/agents/)
- [Define an Agent](/agents/agent-api)
- [Add Skills and MCP tools](/agents/mcp-tools)

### Sessions
A Session runs one Agent version. Create it with `POST /v1/agents/sessions`, send input, stream events, and read the full conversation afterwards.

- [Sessions guide](/agents/sessions)
- [Sessions API](/api-reference/sessions/)

## First steps

1. Create an organization and [API key](/getting-started/api-keys).
2. Choose a Model, API, or Agent from the [catalog](https://www.sandbase.ai/models).
3. Make a direct request or define and test an Agent.
4. Run the tested Agent in Sessions from your application.
5. Review Sessions, errors, latency, and cost in the Console.

## Operational guidance

- [Streaming responses](/guides/streaming)
- [Error handling and retries](/guides/error-handling)
- [Rate limiting](/guides/rate-limiting)
- [Billing and pricing](/guides/billing)
- [Workspace administration](/admin/)

## Next steps

- Creating with local Skills: [Skill tutorials](/guides/skills/)

- New to SandBase: [Getting started](/getting-started/)
- Calling a Model or API: [Model API Reference](/model-api-reference/)
- Managing Agents and workloads: [Platform API Reference](/api-reference/)
- Building reusable work: [Build Agent](/agents/)
- Connecting an AI tool: [Setup](/setup/)
