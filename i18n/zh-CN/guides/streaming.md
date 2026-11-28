---
i18nSource: 335b45fb98c53890
title: 流式响应
description: 使用兼容 OpenAI 或 Anthropic 的 SDK 流式获取 SandBase 模型输出，并安全处理部分结果。
---

# 流式响应 {#streaming-responses}

流式输出会在模型输出可用时立即返回。SandBase 保留你所调用的兼容 API 的事件格式：OpenAI Chat Completions 使用仅含 data 的 Server-Sent Events（SSE），而 Anthropic Messages 使用具名 SSE 事件。

尽量使用官方兼容 SDK。与自己拆分原始响应文本相比，SDK 处理事件分帧、增量工具调用参数和协议终止更加安全。

## OpenAI Chat Completions {#openai-chat-completions}

在 `POST /v1/chat/completions` 上设置 `stream: true`。

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

兼容 OpenAI 的数据块将增量文本放在 `choices[0].delta.content` 中。如果所选模型支持工具调用，其参数会以字符串片段形式出现在 `delta.tool_calls` 中；请按 choice 和工具调用索引拼接这些片段，再解析完整的 JSON。流通常以 `data: [DONE]` 结束。

不要假设每个提供商都会在流中返回 token 用量。如果所选模型支持 OpenAI 的 `stream_options.include_usage`，用量可能出现在流的末尾附近；否则请使用非流式响应或相应的任务费用流程。

## Anthropic Messages {#anthropic-messages}

通过 Anthropic SDK 调用 `POST /v1/messages`。SDK 的流式辅助方法会组装具名事件和内容块。

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

原始 Anthropic 流使用 `message_start`、`content_block_start`、`content_block_delta`、`content_block_stop`、`message_delta` 和 `message_stop` 等事件名。文本由 `text_delta` 块承载。工具输入使用增量 JSON 块，必须先组装完整再解析。

## 处理中断与取消 {#handle-interruption-and-cancellation}

在流开始之前返回的 HTTP 错误使用该端点的常规错误响应体。响应开始之后，网络故障可能只留下部分文本而没有最终事件。只有收到协议的正常终止信号后，才应将输出视为完整。

- 将部分输出与已提交的应用状态分开保存。
- 根据工作负载，在你自己的客户端或代理中设置连接超时和空闲超时上限。
- 用户停止生成时，使用 SDK 的取消机制，或在 JavaScript 中使用 `AbortController`。
- 不要把重试得到的流自动追加到部分输出之后；重试是一次新的生成。
- 在你控制的反向代理中避免缓冲 SSE。

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

读取原始 SSE 时，请解析以空行分隔的完整事件帧。网络数据块与 SSE 事件并非一一对应，一个 UTF-8 字符也可能跨越多个数据块。请使用流式文本解码器，并保留不完整的帧，直到收到更多字节。

## 相关指南 {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [错误处理](/guides/error-handling)
- [速率限制](/guides/rate-limiting)
