---
title: Store
description: Browse SandBase Models, APIs, Agents, and Skills. Use a capability directly, add it to Setup, or clone it into Build Agent.
---

# Store

Store is where you find useful building blocks for your Agent.

Browse the live catalogs: [Models](https://www.sandbase.ai/models), [APIs](https://www.sandbase.ai/apis), [Agents](https://www.sandbase.ai/agents), and [Skills](https://www.sandbase.ai/skills).

You can start from four kinds of things:

| Kind | What it is | What you do with it |
|---|---|---|
| **Models** | AI models for text, image, audio, video, and embeddings | Call them directly, or use them inside an Agent |
| **APIs** | Ready-to-use capabilities like search, scrape, data, media, and SaaS actions | Copy a request, add to Setup, or give to an Agent |
| **Agents** | Proven Agent examples and best-practice workflows | Test them, clone them, or publish your own Service |
| **Skills** | Reusable task packages for Agents | Attach them when building an Agent |

## How to choose

If you only need one capability, start with **Models** or **APIs**.

If you want a complete example, start with **Agents**.

If you are building your own Agent and want reusable implementation knowledge, use **Skills**.

### Decision guide

| Your goal | Start with | Then |
|---|---|---|
| Add one capability to an AI tool | Model or API | Add it to [Setup](/setup/) |
| Call a capability from code | Model or API | Open its detail page, then use the [API Reference](/api-reference/) |
| Automate a multi-step job | Agent | Clone, test, and publish it in [Build Agent](/agents/) |
| Reuse a proven workflow | Skill | Attach it while building an Agent |

When two entries look similar, compare their input, output, pricing, latency, and authentication requirements before installing or cloning them.

## Models

Models are AI engines for text generation and reasoning, image generation or editing, audio, video, and embeddings.

You can call a Model directly, add it to Setup for a connected AI tool, or select it when building an Agent. The Model determines how an Agent thinks; APIs and Skills determine what it can do.

Most text Models use the OpenAI-compatible Chat Completions API. See [Supported Models](/models/supported) and the [Model capability matrix](/models/capabilities).

## APIs

APIs give your application or Agent access to real-world data and actions, including web search, scraping, business data, media generation, SaaS tools, and provider-specific capabilities.

Use an API in one of three ways:

1. call it directly from your application
2. add it to Setup so a connected AI tool can use it
3. add it to an Agent as a tool

Models think and generate; APIs fetch data, take actions, or connect external systems. See the [API Reference](/api-reference/) for request formats and endpoints.

## Agents

Store Agents are working examples that combine a Model, APIs, Skills, and workflow instructions.

You can inspect and test a public Agent, clone it into your workspace, customize it, and publish or schedule your version. Clone the public Agent first when you need to change its prompt, tools, model, credentials, schedule, or output format.

## Skills

Skills are reusable task packages for Agents. They can contain instructions, workflows, code, assets, and repeatable know-how.

Use a Skill when an Agent needs consistent expertise, such as company research, code review, structured reporting, page analysis, or a customer-support workflow. Skills are attached in Build Agent; they are not top-level Setup tools.

## Common paths

### Use it in your AI app

Add Models, APIs, or published Agents to **Workspace Services**, then follow the client-specific flow in **Setup**. Supported clients and prerequisites are shown in the Console and can change independently of this overview.

### Call it from your app

Open a Model or API detail page, copy a working request, and call it with your SandBase key.

### Build your own Agent

Clone an Agent example or start from scratch in **Build Agent**. Add Models, APIs, and Skills, test it, then publish it as a Service or create a Schedule.

## Before you add an item

Check the detail page for:

- the exact input and output shape
- pricing and whether usage is per token or per call
- required API credentials
- whether the item is public, maintained by SandBase, or owned by your workspace
- examples you can run before adopting it

## Next steps

- [Setup](/setup/)
- [Build Agent](/agents/)
- [API Reference](/api-reference/)
