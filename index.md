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
| **What it is** | Direct access to language, image, video, audio, embedding, and third-party APIs | Reusable, versioned Agent configurations executed by SandBase |
| **Best for** | Custom application loops and fine-grained request control | Multi-step, asynchronous, scheduled, or repeatable work |
| **You manage** | Prompts, orchestration, retries, and application state | Agent definition, enabled capabilities, inputs, and delivery behavior |
| **Start here** | [Models and APIs](/models/) | [Build Agent](/agents/) |

::: tip One SandBase API key
The same API key can call Models, APIs, Agents, Services, and scheduled workloads. Keep keys on the server and never expose them in browser code.
:::

## Core concepts

### Models and APIs

Use Models for language, image, video, audio, and embedding workloads. Use APIs when the application needs external data or actions. The Store shows available capabilities, pricing, input schemas, and working examples.

- [Browse the Store](/store/)
- [Supported Models](/models/supported)
- [Make your first API call](/getting-started/first-call)
- [Open the Model API Reference](/model-api-reference/)

### Agents

An Agent is a reusable, versioned configuration containing a Model, instructions, APIs, Skills, and credentials. Define it once, test it, and then choose how it should run.

- [Understand Agents](/agents/)
- [Define an Agent](/agents/agent-api)
- [Add APIs, Skills, and credentials](/agents/mcp-tools)

### Services and Sessions

A Service exposes a tested Agent to applications. Its compatibility API path is `/v1/endpoints`; invoking it creates or continues a Session whose `session_id` identifies the durable interaction.

- [Services guide](/agents/services)
- [Services API](/api-reference/endpoints/)
- [Sessions API](/api-reference/sessions/)

### Schedules, DeploymentRuns, and Sessions

Schedules execute an Agent later or repeatedly. Their API resource is a Deployment. Every trigger creates a distinct `drun_*` DeploymentRun and, on successful Session creation, links it to a new `sess_*` Session.

- [Schedules guide](/agents/schedules)
- [Schedules API](/api-reference/deployments/)
- [Sessions guide](/agents/sessions)

## First steps

1. Create an organization and [API key](/getting-started/api-keys).
2. Choose a Model, API, or Agent from the [Store](/store/).
3. Make a direct request or define and test an Agent.
4. Publish the Agent as a Service when an application needs to invoke it.
5. Add a Schedule when the work should run automatically.
6. Review Sessions, errors, latency, and cost in the Console.

## Operational guidance

- [Streaming responses](/guides/streaming)
- [Error handling and retries](/guides/error-handling)
- [Rate limiting](/guides/rate-limiting)
- [Billing and pricing](/guides/billing)
- [Workspace administration](/admin/)

## Next steps

- New to SandBase: [Getting started](/getting-started/)
- Calling a Model or API: [Model API Reference](/model-api-reference/)
- Managing Agents and workloads: [Platform API Reference](/api-reference/)
- Building reusable work: [Build Agent](/agents/)
- Connecting an AI tool: [Setup](/setup/)
