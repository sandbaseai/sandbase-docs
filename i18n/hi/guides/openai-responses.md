---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: SandBase के ज़रिए GPT models के साथ OpenAI-compatible Responses API इस्तेमाल करें।
---

# OpenAI Responses {#openai-responses}

GPT models `POST /v1/responses` पर OpenAI-compatible Responses API सपोर्ट करते हैं।
Prompts या structured content के लिए `input` इस्तेमाल करें और generated items को
`output` से पढ़ें।

```bash
curl https://api.sandbase.ai/v1/responses \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/<gpt-model>",
    "input": "Explain immutable infrastructure in one sentence."
  }'
```

## Chat Completions संगतता {#chat-completions-compatibility}

यही GPT models `POST /v1/chat/completions` भी सपोर्ट करते हैं। वह protocol
request में `messages` और response में `choices` इस्तेमाल करता है, जबकि Responses
`input` और `output` इस्तेमाल करता है। दोनों के parameter envelopes आपस में बदले नहीं जा सकते;
अपने SDK से मेल खाने वाला endpoint चुनें।

Compatible request format के लिए [Chat Completions](./chat-completions) और
model-specific fields और सीमाओं के लिए [GPT model references](https://www.sandbase.ai/models)
देखें।

## अगले कदम {#next-steps}

- [Responses API reference](/api-reference/responses)
- [Chat Completions API reference](/api-reference/llm-gateway)
- [Models catalog](https://www.sandbase.ai/models)
