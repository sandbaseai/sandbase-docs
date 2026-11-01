---
title: Guides
description: Practical guides for using SandBase Models, APIs, Agents, Setup, billing, streaming, and production reliability.
---

# Guides

These guides cover common patterns for using SandBase in production.

## Call models
| Guide | Description |
|-------|-------------|
| [Chat Completions](./chat-completions) | Call SandBase through the OpenAI-compatible chat protocol |
| [OpenAI Responses](./openai-responses) | Call GPT models through the OpenAI-compatible Responses protocol |
| [Anthropic Messages](./anthropic-messages) | Call SandBase through the Anthropic-compatible messages protocol |
| [Image and video](./image-video) | Generate images and videos through the shared asynchronous Run API |
| [Streaming](./streaming) | Stream compatible Model output to your application |
| [API Catalog](https://www.sandbase.ai/apis) | Browse API capabilities and their vendor-qualified endpoints |

## Run in production
| Guide | Description |
|-------|-------------|
| [Errors and retries](./error-handling) | Classify failures and retry only when an operation is safe to repeat |
| [Rate limits](./rate-limiting) | Handle 429 responses and smooth request bursts |
| [Concurrency limits](./concurrency-limits) | How many tasks your organization can run at once |
| [Pricing and usage](./billing) | Understand credits, usage, and cost controls |

## Quick Tips

- Use [Setup](/setup/) when the user wants tools inside Codex, Claude, Cursor, or Kiro.
- Use [Models](https://www.sandbase.ai/models) or [APIs](https://www.sandbase.ai/apis) when your app needs one capability.
- Use [Build Agent](/agents/) when the work has multiple steps or should be reused.
- Use [Activities](https://www.sandbase.ai/console/activities) in the Console to review requests and usage together.
