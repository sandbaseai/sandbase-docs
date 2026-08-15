---
title: Supported models
description: Complete list of models available through SandBase with pricing, context windows, and capabilities.
---

# Supported models

SandBase provides model APIs across major providers through one account and one key. Chat models are available via the OpenAI-compatible endpoint (`/v1/chat/completions`) and, where applicable, the Anthropic-compatible endpoint (`/v1/messages`). Embedding models are available via the OpenAI-compatible embeddings endpoint (`/v1/embeddings`).

::: tip
Browse the full model catalog with live pricing at [sandbase.ai/models](https://www.sandbase.ai/models).
:::

## Model Comparison Table

| Model | Provider | Input (per 1M tokens) | Output (per 1M tokens) | Context Window | Key Capabilities |
|-------|----------|----------------------|------------------------|----------------|-----------------|
| `openai/gpt-4o` | OpenAI | $2.50 | $10.00 | 128K | Chat, Streaming, Tools, Vision, JSON Mode, Cache |
| `openai/gpt-4o-mini` | OpenAI | $0.15 | $0.60 | 128K | Chat, Streaming, Tools, Vision, JSON Mode, Cache |
| `openai/o3` | OpenAI | $10.00 | $40.00 | 200K | Chat, Streaming, Tools, Vision, Thinking, JSON Mode |
| `openai/o3-mini` | OpenAI | $1.10 | $4.40 | 200K | Chat, Streaming, Tools, Thinking, JSON Mode |
| `anthropic/claude-sonnet-4` | Anthropic | $3.00 | $15.00 | 200K | Chat, Streaming, Tools, Vision, Thinking, Cache |
| `anthropic/claude-3.5-haiku` | Anthropic | $0.80 | $4.00 | 200K | Chat, Streaming, Tools, Vision, Cache |
| `deepseek/deepseek-v3` | DeepSeek | $0.27 | $1.10 | 128K | Chat, Streaming, Tools, JSON Mode |
| `deepseek/deepseek-chat` | DeepSeek | $0.27 | $1.10 | 128K | Chat, Streaming, Tools, JSON Mode |
| `deepseek/deepseek-reasoner` | DeepSeek | $0.55 | $2.19 | 128K | Chat, Streaming, Thinking |
| `google/gemini-2.5-pro` | Google | $1.25 | $10.00 | 1M | Chat, Streaming, Tools, Vision, Thinking, JSON Mode, Cache |
| `google/gemini-2.5-flash` | Google | $0.15 | $0.60 | 1M | Chat, Streaming, Tools, Vision, Thinking, JSON Mode, Cache |
| `meta/llama-4-maverick` | Meta | $0.20 | $0.60 | 128K | Chat, Streaming, Tools, Vision |
| `alibaba/qwen3-32b` | Alibaba | $0.10 | $0.30 | 32K | Chat, Streaming, Tools |
| `alibaba/text-embedding-v4` | Alibaba | $0.10 | — | 8K | Embeddings, Multilingual |
| `bytedance/seed-1.6` | ByteDance | $0.50 | $2.00 | 128K | Chat, Streaming, Tools, Vision |

::: tip
Prices are in USD and reflect SandBase's pass-through pricing. Actual costs may vary slightly based on provider pricing changes.
:::

## Models by Provider

### OpenAI

| Model | Best For | Context | Reasoning |
|-------|----------|---------|-----------|
| **`openai/gpt-4o`** | General-purpose, multimodal tasks | 128K | No |
| **`openai/gpt-4o-mini`** | Simple tasks, high-volume workloads | 128K | No |
| **`openai/o3`** | Complex reasoning, math, coding | 200K | Yes |
| **`openai/o3-mini`** | Budget reasoning tasks | 200K | Yes |

**Notes:**
- o3 and o3-mini support `reasoning_effort` parameter (`low`, `medium`, `high`)
- Reasoning tokens are billed at the output token rate
- All OpenAI models support automatic prompt caching (50% discount on cache hits)

### Anthropic

| Model | Best For | Context | Reasoning |
|-------|----------|---------|-----------|
| **`anthropic/claude-sonnet-4`** | Coding, analysis, complex instructions | 200K | Yes (extended thinking) |
| **`anthropic/claude-3.5-haiku`** | Fast responses, simple tasks | 200K | No |

**Notes:**
- Claude Sonnet 4 supports extended thinking with configurable `budget_tokens`
- Anthropic models support explicit prompt caching with `cache_control` (90% discount on reads)
- Available via both `/v1/chat/completions` and `/v1/messages` endpoints

### Google

| Model | Best For | Context | Reasoning |
|-------|----------|---------|-----------|
| **`google/gemini-2.5-pro`** | Long-context tasks, multimodal | 1M | Yes |
| **`google/gemini-2.5-flash`** | Fast, cost-effective general use | 1M | Yes |

**Notes:**
- 1 million token context window — largest available
- Both models support thinking/reasoning
- Gemini 2.5 Flash offers the best price-to-performance ratio for many tasks

### DeepSeek

| Model | Best For | Context | Reasoning |
|-------|----------|---------|-----------|
| **`deepseek/deepseek-v3`** | General-purpose, coding | 128K | No |
| **`deepseek/deepseek-chat`** | Conversational AI | 128K | No |
| **`deepseek/deepseek-reasoner`** | Step-by-step reasoning | 128K | Yes |

**Notes:**
- Extremely cost-effective — among the cheapest models available
- DeepSeek Reasoner uses chain-of-thought reasoning (similar to o3)
- Automatic prompt caching with 90% discount on cache hits

### Meta (Open Source)

| Model | Best For | Context | Reasoning |
|-------|----------|---------|-----------|
| **`meta/llama-4-maverick`** | General-purpose, open-source alternative | 128K | No |

**Notes:**
- Open-source model hosted by multiple providers
- Good balance of quality and cost
- Supports vision (image understanding)

### Alibaba

| Model | Best For | Context | Reasoning |
|-------|----------|---------|-----------|
| **`alibaba/qwen3-32b`** | Budget tasks, multilingual | 32K | No |
| **`alibaba/text-embedding-v4`** | Semantic search, RAG, clustering | 8K | No |

**Notes:**
- Lowest cost model available on SandBase
- Strong multilingual capabilities (especially Chinese)
- 32K context window (smaller than other models)
- `alibaba/text-embedding-v4` is an embedding model. Use `POST /v1/embeddings`, not `POST /v1/chat/completions`.

### ByteDance

| Model | Best For | Context | Reasoning |
|-------|----------|---------|-----------|
| **`bytedance/seed-1.6`** | Multimodal, creative tasks | 128K | No |

**Notes:**
- Strong multimodal capabilities
- Good for creative writing and image understanding

## Choosing a Model

### By Use Case

| Use Case | Recommended | Why |
|----------|-------------|-----|
| Chat interface | `openai/gpt-4o-mini` or `anthropic/claude-3.5-haiku` | Fast, cheap, good quality |
| Code generation | `anthropic/claude-sonnet-4` | Best coding performance |
| Complex reasoning | `openai/o3` or `google/gemini-2.5-pro` | Deep thinking capabilities |
| Budget reasoning | `openai/o3-mini` or `deepseek/deepseek-reasoner` | Reasoning at lower cost |
| Long documents | `google/gemini-2.5-pro` or `google/gemini-2.5-flash` | 1M context window |
| High volume / classification | `openai/gpt-4o-mini` or `alibaba/qwen3-32b` | Lowest cost per token |
| Multimodal (images) | `openai/gpt-4o` or `google/gemini-2.5-pro` | Best vision capabilities |

### By Budget

| Budget Level | Models | Typical Cost per 1K requests |
|-------------|--------|------------------------------|
| Ultra-low | `alibaba/qwen3-32b`, `openai/gpt-4o-mini` | $0.01–$0.05 |
| Low | `deepseek/deepseek-v3`, `google/gemini-2.5-flash` | $0.05–$0.20 |
| Medium | `anthropic/claude-3.5-haiku`, `openai/gpt-4o` | $0.20–$2.00 |
| High | `anthropic/claude-sonnet-4`, `openai/o3` | $2.00–$20.00 |

## Model Availability

Model availability can vary by provider. Use the Models API to retrieve the current catalog and availability before depending on a model in production.

Check real-time model status on the [SandBase Status Page](https://status.sandbase.ai).
