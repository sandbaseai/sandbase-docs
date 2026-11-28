---
i18nSource: 335b45fb98c53890
title: 串流回應
description: 使用與 OpenAI 或 Anthropic 相容的 SDK 串流 SandBase 模型輸出，並安全地處理部分結果。
---

# 串流回應 {#streaming-responses}

串流會在模型輸出產生時即時傳回。SandBase 會保留您所呼叫之相容 API 的事件格式：
OpenAI Chat Completions 使用只含資料的 Server-Sent Events（SSE），Anthropic Messages 則使用具名的 SSE 事件。

請儘可能使用官方的相容 SDK。相較於自行切割原始回應文字，SDK 能更安全地處理事件框架、遞增的工具呼叫參數與協定
終止。

## OpenAI Chat Completions {#openai-chat-completions}

在 `POST /v1/chat/completions` 上設定 `stream: true`。

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
    stream=True,
)

for chunk in stream:
    text = chunk.choices[0].delta.content
    if text:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
  stream: true,
});

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content;
  if (text) process.stdout.write(text);
}
```

```bash [cURL]
curl -N https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Explain quantum computing briefly."}],
    "stream": true
  }'
```

:::

OpenAI 相容的區塊會將遞增文字放在 `choices[0].delta.content`。所選模型支援時，工具呼叫參數
會以字串片段的形式出現在 `delta.tool_calls` 中；請依 choice 與工具呼叫
索引串接片段，再解析完整的 JSON。串流通常以 `data: [DONE]` 結束。

不要假設每個供應商都會在串流中回傳 token 用量。若所選模型支援 OpenAI 的
`stream_options.include_usage`，用量可能出現在接近結尾處；否則請使用非串流回應或
適用的任務費用流程。

## Anthropic Messages {#anthropic-messages}

搭配 `POST /v1/messages` 使用 Anthropic SDK。SDK 的串流輔助工具會組合具名事件與內容區塊。

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key=os.environ["SANDBASE_API_KEY"],
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = client.messages.stream({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
});

stream.on('text', (text) => process.stdout.write(text));
await stream.finalMessage();
```

:::

原始的 Anthropic 串流使用 `message_start`、`content_block_start`、`content_block_delta`、
`content_block_stop`、`message_delta` 與 `message_stop` 等事件名稱。文字由 `text_delta` 區塊傳送。工具輸入使用
遞增的 JSON 區塊，必須組合完成後才能解析。

## 處理中斷與取消 {#handle-interruption-and-cancellation}

在串流開始前傳回的 HTTP 錯誤會使用該端點的一般錯誤本文。回應開始後，
網路故障可能只留下部分文字而沒有最終事件。只有在收到協定的
正常終止訊號後，才將輸出視為完整。

- 將部分輸出與已確認的應用程式狀態分開保存。
- 依工作負載在您自己的用戶端或代理伺服器中限制連線與閒置逾時。
- 使用者停止生成時，使用 SDK 的取消機制，或在 JavaScript 中使用 `AbortController`。
- 不要自動將重試的串流附加到部分輸出之後；重試是一次新的生成。
- 避免在您所控制的反向代理伺服器中緩衝 SSE。

```javascript
const controller = new AbortController();

const response = await fetch('https://api.sandbase.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek/deepseek-v4-flash',
    messages: [{ role: 'user', content: 'Write a short story.' }],
    stream: true,
  }),
  signal: controller.signal,
});

// Call controller.abort() when the user cancels.
```

讀取原始 SSE 時，請解析以空白行分隔的完整事件框架。網路區塊與 SSE 事件並非一對一
對應，且一個 UTF-8 字元可能跨越多個區塊。請使用串流文字解碼器，並保留任何不完整的框架，
直到收到更多位元組。

## 相關指南 {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [錯誤處理](/guides/error-handling)
- [速率限制](/guides/rate-limiting)
