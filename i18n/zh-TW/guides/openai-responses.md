---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: 透過 SandBase 搭配 GPT 模型使用 OpenAI 相容的 Responses API。
---

# OpenAI Responses {#openai-responses}

GPT 模型支援位於 `POST /v1/responses` 的 OpenAI 相容 Responses API。
使用 `input` 傳入提示或結構化內容，並從
`output` 讀取產生的項目。

```bash
curl https://api.sandbase.ai/v1/responses \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/<gpt-model>",
    "input": "Explain immutable infrastructure in one sentence."
  }'
```

## Chat Completions 相容性 {#chat-completions-compatibility}

相同的 GPT 模型也支援 `POST /v1/chat/completions`。該協定
在請求中使用 `messages`，在回應中使用 `choices`，而 Responses
則使用 `input` 與 `output`。兩者的參數封裝格式無法互換；
請選擇與您的 SDK 相符的端點。

相容的請求格式請參閱 [Chat Completions](./chat-completions)，
模型專屬的欄位與限制請參閱
[GPT 模型參考](https://www.sandbase.ai/models)。

## 後續步驟 {#next-steps}

- [Responses API 參考](/api-reference/responses)
- [Chat Completions API 參考](/api-reference/llm-gateway)
- [Models 目錄](https://www.sandbase.ai/models)
