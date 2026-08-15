---
title: Pricing
description: SandBase credit system, top-up flow, per-model pricing, usage tracking, and cost optimization tips.
---

# Pricing

SandBase uses a pay-as-you-go credit system. You purchase credits, and they're consumed based on the models you use and the tokens processed.

## Credit System

### How Credits Work

1 credit = $1 USD. Credits are consumed per-token based on the model's pricing:

```
Cost per request = (input_tokens × input_price) + (output_tokens × output_price)
```

For models with special token types:

```
Total cost = (prompt_tokens × input_price)
           + (cached_tokens × input_price × cache_read_multiplier)
           + (cache_creation_tokens × input_price × cache_write_multiplier)
           + (completion_tokens × output_price)
           + (reasoning_tokens × reasoning_price)
```

### Top-Up Flow

1. Navigate to **Dashboard → Billing**
2. Click **Add Credits**
3. Choose an amount ($5, $20, $50, $100, or custom)
4. Complete payment via Stripe (credit card, Apple Pay, Google Pay)
5. Credits are available immediately

::: tip
Credits never expire. There's no monthly subscription — you only pay for what you use.
:::

### Checking Your Balance

::: code-group

```python [Python]
import requests

response = requests.get(
    "https://api.sandbase.ai/v1/account/balance",
    headers={"Authorization": "Bearer sk-sb-your-key"}
)
print(response.json())
# {"balance": 42.50, "currency": "USD"}
```

```bash [cURL]
curl https://api.sandbase.ai/v1/account/balance \
  -H "Authorization: Bearer sk-sb-your-key"
```

:::

## Per-Model Pricing

Pricing is per 1 million tokens (1M tokens). All prices are in USD.

### OpenAI Models

| Model | Input (per 1M) | Output (per 1M) | Notes |
|-------|----------------|-----------------|-------|
| gpt-4o | $2.50 | $10.00 | Best value for complex tasks |
| gpt-4o-mini | $0.15 | $0.60 | Great for simple tasks |
| o3 | $10.00 | $40.00 | Reasoning tokens billed at output rate |
| o3-mini | $1.10 | $4.40 | Budget reasoning model |

### Anthropic Models

| Model | Input (per 1M) | Output (per 1M) | Notes |
|-------|----------------|-----------------|-------|
| claude-sonnet-4 | $3.00 | $15.00 | Best for coding and analysis |
| claude-3.5-haiku | $0.80 | $4.00 | Fast and affordable |

### Google Models

| Model | Input (per 1M) | Output (per 1M) | Notes |
|-------|----------------|-----------------|-------|
| gemini-2.5-pro | $1.25 | $10.00 | 1M context window |
| gemini-2.5-flash | $0.15 | $0.60 | Fastest response times |

### DeepSeek Models

| Model | Input (per 1M) | Output (per 1M) | Notes |
|-------|----------------|-----------------|-------|
| deepseek-v3 | $0.27 | $1.10 | Strong general-purpose |
| deepseek-chat | $0.27 | $1.10 | Optimized for conversation |
| deepseek-reasoner | $0.55 | $2.19 | Chain-of-thought reasoning |

### Open-Source Models

| Model | Input (per 1M) | Output (per 1M) | Notes |
|-------|----------------|-----------------|-------|
| llama-4-maverick | $0.20 | $0.60 | Meta's latest open model |
| qwen3-32b | $0.10 | $0.30 | Alibaba's efficient model |

### Other Models

| Model | Input (per 1M) | Output (per 1M) | Notes |
|-------|----------------|-----------------|-------|
| seed-1.6 | $0.50 | $2.00 | ByteDance multimodal |

::: info
Prices are subject to change. Check the [Models page](/models/) for the latest pricing.
:::

## Caching Discounts

Models that support prompt caching offer significant savings on repeated prompts:

| Provider | Cache Read Discount | Cache Write Premium |
|----------|-------------------|-------------------|
| Anthropic | 90% off (0.1× input price) | 25% premium (1.25× input price) |
| OpenAI | 50% off (0.5× input price) | No premium |
| DeepSeek | 90% off (0.1× input price) | No premium |

**Example:** A cached Anthropic request with 10,000 cached input tokens at $3.00/1M:
- Without cache: 10,000 × $3.00/1M = $0.03
- With cache hit: 10,000 × $3.00/1M × 0.1 = $0.003 (90% savings)

## Usage Tracking

### Dashboard

The **Dashboard → Usage** page shows:
- Daily/weekly/monthly token consumption
- Cost breakdown by model
- Request count and average tokens per request
- Trend charts for cost forecasting

### API

Query your usage programmatically:

```bash
curl "https://api.sandbase.ai/v1/account/usage?start=2024-01-01&end=2024-01-31" \
  -H "Authorization: Bearer sk-sb-your-key"
```

Response:

```json
{
  "total_cost": 12.45,
  "total_tokens": 2450000,
  "by_model": [
    {
      "model": "gpt-4o",
      "input_tokens": 1200000,
      "output_tokens": 300000,
      "cost": 6.00
    },
    {
      "model": "claude-sonnet-4",
      "input_tokens": 500000,
      "output_tokens": 150000,
      "cost": 3.75
    }
  ]
}
```

## Cost Optimization Tips

### 1. Choose the Right Model for the Task

Not every task needs GPT-4o or Claude Sonnet. Use smaller models for simple operations:

| Task | Recommended Model | Cost vs GPT-4o |
|------|------------------|----------------|
| Classification | gpt-4o-mini | 17x cheaper |
| Summarization | gemini-2.5-flash | 17x cheaper |
| Simple Q&A | claude-3.5-haiku | 3x cheaper |
| Code generation | claude-sonnet-4 | Similar |
| Complex reasoning | o3 | 4x more expensive |

### 2. Use Prompt Caching

For applications with repeated system prompts or context (RAG, agents), enable caching:

```python
# Anthropic caching — mark the system prompt as cacheable
response = client.chat.completions.create(
    model="claude-sonnet-4",
    messages=[
        {
            "role": "system",
            "content": long_system_prompt,
            # Cache this across requests
        },
        {"role": "user", "content": user_query}
    ],
    extra_body={
        "anthropic": {
            "cache_control": [{"type": "ephemeral"}]
        }
    }
)
```

### 3. Minimize Input Tokens

- Trim unnecessary context from prompts
- Use concise system prompts
- Summarize conversation history instead of sending full transcripts
- Remove redundant examples from few-shot prompts

### 4. Set Appropriate `max_tokens`

Don't set `max_tokens` higher than needed — while you only pay for generated tokens, lower limits prevent runaway generation:

```python
# For a yes/no classification, limit output
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": "Is this spam? 'Buy now!'"}],
    max_tokens=10  # Only need "yes" or "no"
)
```

### 5. Batch Similar Requests

Process multiple items in a single request when possible:

```python
# Instead of 10 separate requests:
items = ["item1", "item2", "item3", ...]

# Send one request with all items
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{
        "role": "user",
        "content": f"Classify each item as positive/negative:\n" + 
                   "\n".join(f"- {item}" for item in items)
    }]
)
```

### 6. Monitor and Set Budgets

Set spending alerts in the dashboard to avoid unexpected costs:

1. Go to **Dashboard → Billing → Alerts**
2. Set a daily or monthly spending threshold
3. Receive email notifications when approaching the limit

## Insufficient Credits

When your balance reaches zero, API requests return HTTP 402. On the OpenAI-compatible endpoint the body is:

```json
{
  "error": {
    "message": "insufficient balance",
    "type": "invalid_request_error",
    "code": null,
    "param": null
  }
}
```

Top up your account to resume service. There's no service interruption for in-flight streaming requests — they'll complete normally.
