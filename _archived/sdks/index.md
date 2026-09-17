---
title: SDK Overview
description: Use existing OpenAI and Anthropic SDKs with AGRouter — no custom SDK needed, just change the base URL.
---

# SDK Overview

AGRouter is fully compatible with the official **OpenAI** and **Anthropic** SDKs. You don't need a custom AGRouter SDK — just point your existing SDK at AGRouter's base URL and use your AGRouter API key.

## Why No Custom SDK?

AGRouter implements the OpenAI Chat Completions API and Anthropic Messages API byte-for-byte. This means:

- ✅ All existing OpenAI SDK features work (streaming, tools, structured output)
- ✅ All existing Anthropic SDK features work (streaming, thinking, caching)
- ✅ No new library to learn or maintain
- ✅ Switch between AGRouter and direct providers by changing one line

## Quick Setup

### OpenAI SDK → AGRouter

::: code-group

```python [Python]
from openai import OpenAI

client = OpenAI(
    base_url="https://api.agrouter.ai/v1",  # ← Only change needed
    api_key="sk-sb-your-key"
)

# Everything else works exactly the same
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello!"}]
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.agrouter.ai/v1',  // ← Only change needed
  apiKey: 'sk-sb-your-key',
});

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

:::

### Anthropic SDK → AGRouter

::: code-group

```python [Python]
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.agrouter.ai",  # ← Only change needed
    api_key="sk-sb-your-key"
)

response = client.messages.create(
    model="claude-sonnet-4",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Hello!"}]
)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.agrouter.ai',  // ← Only change needed
  apiKey: 'sk-sb-your-key',
});

const response = await client.messages.create({
  model: 'claude-sonnet-4',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Hello!' }],
});
```

:::

## Supported SDK Versions

| SDK | Minimum Version | Recommended |
|-----|----------------|-------------|
| `openai` (Python) | 1.0.0+ | Latest |
| `openai` (Node.js) | 4.0.0+ | Latest |
| `anthropic` (Python) | 0.18.0+ | Latest |
| `@anthropic-ai/sdk` (Node.js) | 0.18.0+ | Latest |

## Cross-Provider Access

The key advantage of AGRouter is accessing **any model** through **any SDK**:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.agrouter.ai/v1",
    api_key="sk-sb-your-key"
)

# Access Claude through the OpenAI SDK
response = client.chat.completions.create(
    model="claude-sonnet-4",  # Anthropic model via OpenAI SDK!
    messages=[{"role": "user", "content": "Hello!"}]
)

# Access Gemini through the OpenAI SDK
response = client.chat.completions.create(
    model="gemini-2.5-pro",  # Google model via OpenAI SDK!
    messages=[{"role": "user", "content": "Hello!"}]
)
```

## SDK-Specific Guides

- [Python SDK Guide](./python) — Detailed Python examples with OpenAI and Anthropic SDKs
- [JavaScript SDK Guide](./javascript) — Node.js/TypeScript examples with both SDKs

## Environment Variables

For convenience, set these environment variables instead of hardcoding:

```bash
export OPENAI_BASE_URL="https://api.agrouter.ai/v1"
export OPENAI_API_KEY="sk-sb-your-key"

# Or for Anthropic SDK
export ANTHROPIC_BASE_URL="https://api.agrouter.ai"
export ANTHROPIC_API_KEY="sk-sb-your-key"
```

Then your code doesn't need any AGRouter-specific configuration:

```python
from openai import OpenAI
client = OpenAI()  # Reads from environment variables automatically
```
