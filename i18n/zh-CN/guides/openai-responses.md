---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: 通过 SandBase 在 GPT 模型上使用 OpenAI 兼容的 Responses API。
---

# OpenAI Responses {#openai-responses}

GPT 模型支持位于 `POST /v1/responses` 的 OpenAI 兼容 Responses API。
使用 `input` 传入提示词或结构化内容，并从 `output` 中读取
生成的项。

```bash
curl https://api.sandbase.ai/v1/responses \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/<gpt-model>",
    "input": "Explain immutable infrastructure in one sentence."
  }'
```

## Chat Completions 兼容性 {#chat-completions-compatibility}

相同的 GPT 模型也支持 `POST /v1/chat/completions`。该协议在请求中
使用 `messages`，在响应中使用 `choices`，而 Responses
使用 `input` 和 `output`。两者的参数结构不能互换；
请选择与你的 SDK 匹配的端点。

兼容的请求格式请参阅 [Chat Completions](./chat-completions)，
模型特有的字段和限制请参阅
[GPT 模型参考](https://www.sandbase.ai/models)。

## 后续步骤 {#next-steps}

- [Responses API 参考](/api-reference/responses)
- [Chat Completions API 参考](/api-reference/llm-gateway)
- [Models 目录](https://www.sandbase.ai/models)
