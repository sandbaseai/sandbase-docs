---
title: Models
description: Browse and call SandBase model APIs, or use Models inside Setup and Build Agent.
---

# Models

Models are the AI engines your app or Agent can use.

SandBase lets you browse model APIs, inspect capabilities, copy a working request, and use the same Model inside Setup or Build Agent.

## Where Models fit

| Place | How Models are used |
|---|---|
| **Store** | Browse Models and inspect pricing, IDs, and capabilities |
| **Setup** | Add selected Models to your AI tool |
| **Build Agent** | Pick the Model your Agent should use |
| **API Reference** | Call Models directly from your app |

## Call a Model

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Write a short customer brief."}]
  }'
```

## Use a Model in an Agent

In Build Agent, the Model is one part of the Agent.

The Agent can also include APIs, Skills, instructions, and credentials.

## Model capabilities

Different Models support different input and output types.

Examples:

- text in / text out
- image input
- image generation
- audio
- video
- embeddings
- tool calling
- structured output

Check capability details before using a Model in production.

## Next steps

- [Supported Models](/models/supported)
- [Capability Matrix](/models/capabilities)
- [Chat Completions API](/api-reference/llm-gateway)
- [Browse the Store](/store/)
- [Build Agent](/agents/)
