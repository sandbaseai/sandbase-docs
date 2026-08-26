---
title: Models
description: Browse model APIs in SandBase and use them directly or inside Agents.
---

# Models

Models are AI engines you can call directly or use inside an Agent.

Use Models when you need:

- text generation or reasoning
- image generation or editing
- audio transcription or speech
- video generation
- embeddings

## How Models fit in SandBase

Models are one kind of API capability in SandBase, but they are important enough to browse separately.

You can:

- call a Model from your app
- add a Model to Setup when an AI tool should use it
- select a Model when you build an Agent

## Use a Model directly

Most text Models use the OpenAI-compatible Chat Completions API:

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

In **Build Agent**, pick the Model first, then add APIs and Skills around it.

The Model decides how the Agent thinks. APIs and Skills decide what the Agent can do.

## Next steps

- [Supported Models](/models/supported)
- [Model capability matrix](/models/capabilities)
- [Chat Completions API](/api-reference/llm-gateway)
- [Build Agent](/agents/)
