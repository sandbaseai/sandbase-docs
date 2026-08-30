---
title: OpenAI Responses
description: Use the OpenAI-compatible Responses API with GPT models through SandBase.
---

# OpenAI Responses

GPT models support the OpenAI-compatible Responses API at `POST /v1/responses`.
Use `input` for prompts or structured content and read generated items from
`output`.

```bash
curl https://api.sandbase.ai/v1/responses \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/<gpt-model>",
    "input": "Explain immutable infrastructure in one sentence."
  }'
```

## Chat Completions compatibility

The same GPT models also support `POST /v1/chat/completions`. That protocol
uses `messages` in the request and `choices` in the response, while Responses
uses `input` and `output`. The parameter envelopes are not interchangeable;
choose the endpoint that matches your SDK.

See [Chat Completions](./chat-completions) for the compatible request format
and [GPT model references](/model-api-reference/llm-models#openai) for
model-specific fields and limits.

## Next steps

- [Responses API reference](/api-reference/responses)
- [Chat Completions API reference](/api-reference/llm-gateway)
- [Supported Models](/models/supported)
