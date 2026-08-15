---
title: AI-Readable Models & Pricing
description: Complete list of SandBase models with pricing, capabilities, and context windows.
# TODO Phase 2: Auto-generate model tables from sandbase-registry/data/.
# Currently hand-written with representative examples. The generation script
# should produce this page + the models section of llms-full.txt.
---

# Models & Pricing

*Last updated: August 2026*

> All models are accessible via a single API key. Pricing is pay-per-use with no monthly minimums.

::: warning Data Freshness
Model availability and pricing change frequently. The tables below are representative examples. **Always use `GET /v1/models` for real-time, authoritative data.** If a model appears here but returns `model_not_found`, it may have been deprecated or renamed.
:::

## LLM Models

All LLM models support **chat** and **streaming** by default. The Capabilities column below only lists additional differentiating features.

| Model | Vendor | Context | Input ($/M tokens) | Output ($/M tokens) | Capabilities |
|-------|--------|---------|---------------------|----------------------|--------------|
| `openai/gpt-4o` | OpenAI | 128K | $2.50 | $10.00 | vision, tools, json_mode |
| `openai/gpt-4o-mini` | OpenAI | 128K | $0.15 | $0.60 | vision, tools, json_mode |
| `openai/o3` | OpenAI | 200K | $2.00 | $8.00 | tools, reasoning |
| `anthropic/claude-sonnet-4-20250514` | Anthropic | 200K | $3.00 | $15.00 | vision, tools, cache |
| `anthropic/claude-haiku-3-5` | Anthropic | 200K | $0.80 | $4.00 | vision, tools, cache |
| `google/gemini-2.5-pro` | Google | 1M | $1.25 | $10.00 | vision, tools |
| `google/gemini-2.5-flash` | Google | 1M | $0.15 | $0.60 | vision, tools |
| `deepseek/deepseek-chat` | DeepSeek | 128K | $0.14 | $0.28 | tools |
| `deepseek/deepseek-reasoner` | DeepSeek | 128K | $0.55 | $2.19 | tools, reasoning |
| `meta/llama-4-maverick` | Meta | 1M | $0.20 | $0.60 | tools |
| `mistral/mistral-large` | Mistral | 128K | $2.00 | $6.00 | tools |
| `qwen/qwen3-235b` | Alibaba | 128K | $0.80 | $2.40 | tools |
| `minimax/minimax-01` | MiniMax | 1M | $0.20 | $1.10 | tools |

## Image Models

| Model | Vendor | Base Price | Max Resolution | Speed |
|-------|--------|------------|----------------|-------|
| `flux/schnell` | Black Forest Labs | $0.003 | 1024×1024 | ~2s |
| `flux/pro` | Black Forest Labs | $0.05 | 2048×2048 | ~10s |
| `flux/dev` | Black Forest Labs | $0.025 | 1024×1024 | ~8s |
| `ideogram/v3` | Ideogram | $0.04 | 2048×2048 | ~8s |
| `recraft/v3` | Recraft | $0.04 | 2048×2048 | ~5s |
| `openai/dall-e-3` | OpenAI | $0.04 | 1792×1024 | ~15s |
| `google/imagen-4` | Google | $0.04 | 2048×2048 | ~6s |

## Video Models

| Model | Vendor | Base Price | Max Duration | Resolution |
|-------|--------|------------|--------------|------------|
| `kling/v1-5` | Kuaishou | $0.28 | 10s | 1080p |
| `kling/v2` | Kuaishou | $0.35 | 10s | 1080p |
| `minimax/video-01` | MiniMax | $0.30 | 6s | 1080p |
| `runway/gen4` | Runway | $0.50 | 10s | 1080p |
| `luma/ray-2` | Luma | $0.30 | 5s | 1080p |
| `vidu/vidu-2` | Vidu | $0.25 | 8s | 1080p |

## Audio Models

| Model | Vendor | Pricing | Features |
|-------|--------|---------|----------|
| `elevenlabs/multilingual-v2` | ElevenLabs | $0.30 / 1K chars | TTS, multilingual, voice cloning |
| `openai/tts-1-hd` | OpenAI | $0.030 / 1K chars | TTS, 6 voices |
| `openai/whisper-1` | OpenAI | $0.006 / min | STT, multilingual |

## Embedding Models

| Model | Vendor | Price ($/M tokens) | Dimensions | Max Input |
|-------|--------|--------------------|-----------:|-----------|
| `openai/text-embedding-3-large` | OpenAI | $0.13 | 3072 | 8191 tokens |
| `openai/text-embedding-3-small` | OpenAI | $0.02 | 1536 | 8191 tokens |
| `voyage/voyage-3` | Voyage AI | $0.06 | 1024 | 32000 tokens |

---

## Pricing Rules

### Base Pricing
- **LLM**: Input tokens and output tokens billed separately, per million tokens
- **Image/Video/Audio**: Flat per-generation price (no token counting)
- **Embedding**: Per million input tokens
- No monthly minimums, no commitments

### Caching & Discounts

Some LLM providers offer prompt caching for repeated context:

| Provider | Cache Write | Cache Read (savings) |
|----------|-------------|---------------------|
| Anthropic | 1.25× input price | 0.10× input price (90% off) |
| OpenAI | 1× input price (free) | 0.50× input price (50% off) |
| Google | 1× input price | 0.25× input price (75% off) |

Caching is automatic when supported — SandBase passes through the provider's cache behavior. Check the `usage` field in responses for `cache_read_input_tokens` and `cache_creation_input_tokens`.

### Volume & Enterprise

Contact sales@sandbase.ai for:
- Volume discounts on high-throughput usage
- Committed spend agreements
- Custom rate limits

---

## Query Pricing Programmatically

### Get all models

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

**Response:**

```json
{
  "data": [
    {
      "id": "openai/gpt-4o",
      "type": "llm",
      "vendor": "OpenAI",
      "context_window": 128000,
      "max_output_tokens": 16384,
      "pricing": {
        "input_per_million": 2.50,
        "output_per_million": 10.00,
        "cached_input_per_million": 1.25
      },
      "capabilities": ["chat", "vision", "tools", "json_mode", "streaming"],
      "status": "active"
    },
    {
      "id": "flux/schnell",
      "type": "image",
      "vendor": "Black Forest Labs",
      "pricing": {
        "base_price": 0.003
      },
      "capabilities": ["text_to_image"],
      "status": "active"
    }
  ]
}
```

### Get a specific model

```bash
curl https://api.sandbase.ai/v1/models/anthropic/claude-sonnet-4-20250514 \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

### Check cost after generation

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-sb-YOUR_KEY"
```

**Response:**

```json
{
  "task_id": "task_abc123",
  "model": "openai/gpt-4o",
  "cost_usd": 0.000325,
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "cache_read_input_tokens": 0
  },
  "created_at": "2026-08-02T12:00:00Z"
}
```
