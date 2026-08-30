---
title: Guides
description: Practical guides for using SandBase Models, APIs, Agents, Setup, billing, streaming, and production reliability.
---

# Guides

These guides cover common patterns for using SandBase in production.

## Available Guides

| Guide | Description |
|-------|-------------|
| [Chat Completions](./chat-completions) | Call SandBase through the OpenAI-compatible chat protocol |
| [OpenAI Responses](./openai-responses) | Call GPT models through the OpenAI-compatible Responses protocol |
| [Anthropic Messages](./anthropic-messages) | Call SandBase through the Anthropic-compatible messages protocol |
| [Image and Video Models](./image-video) | Generate images and videos through the shared asynchronous Run API |
| [API Catalog](/store/apis) | Browse API capabilities and their vendor-qualified endpoints |
| [Streaming](./streaming) | Stream compatible Model output to your application |
| [Errors](./error-handling) | Classify failures and retry only when an operation is safe to repeat |
| [Rate limits](./rate-limiting) | Handle 429 responses and smooth request bursts |
| [Pricing](./billing) | Understand credits, usage, and cost controls |

## Quick Tips

- Use [Setup](/setup/) when the user wants tools inside Codex, Claude, Cursor, or Kiro.
- Use [Models](/models/) or [APIs](/store/apis) when your app needs one capability.
- Use [Build Agent](/agents/) when the work has multiple steps or should be reused.
- Use [Activities](https://www.sandbase.ai/console/activities) in the Console to review requests and usage together.
