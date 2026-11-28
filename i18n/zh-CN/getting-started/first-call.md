---
i18nSource: 0ca53876f04eb96d
title: 第一次 API 调用
description: 详细演示如何发起第一次 SandBase API 调用，理解请求结构、响应结构和流式输出。
---

# 第一次 API 调用 {#first-api-call}

本指南详细讲解 SandBase API 请求和响应的结构。读完后，你将了解请求体中的每个字段、如何解读响应，以及如何使用流式输出。

## 开始之前 {#before-you-start}

你需要一个有效的 SandBase 组织、一个 [API 密钥](/getting-started/api-keys)，以及 [Models 目录](https://www.sandbase.ai/models)中的一个模型 ID。先导出密钥，避免在示例源代码中出现密钥：

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

先从非流式请求开始。认证和响应处理跑通后，再加入流式输出和生产环境的重试逻辑。

## 请求结构 {#request-anatomy}

本示例使用兼容 OpenAI 的 Chat Completions 路由：

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### 必需的请求头 {#required-headers}

| 请求头 | 值 | 说明 |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | 你的 SandBase API 密钥 |
| `Content-Type` | `application/json` | 请求体格式 |

### 请求体 {#request-body}

```json
{
  "model": "deepseek/deepseek-v4-flash",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"}
  ],
  "temperature": 0.7,
  "max_tokens": 256
}
```

### 请求体参数 {#body-parameters}

| 参数 | 类型 | 必填 | 说明 |
|-----------|------|----------|-------------|
| `model` | string | 是 | 由 `GET /v1/models` 返回的已启用模型 ID（例如 `deepseek/deepseek-v4-flash`） |
| `messages` | array | 是 | 以消息对象数组表示的对话历史 |
| `temperature` | number | 否 | 采样温度（0–2）。支持情况和默认值因模型而异。 |
| `max_tokens` | integer | 否 | 响应中最多生成的 token 数 |
| `top_p` | number | 否 | 核采样参数（0–1） |
| `stream` | boolean | 否 | 是否以流式返回响应。默认值：`false` |
| `stop` | string 或 array | 否 | 停止序列，遇到时停止生成 |
| `frequency_penalty` | number | 否 | 提供商兼容的重复惩罚（如支持） |
| `presence_penalty` | number | 否 | 提供商兼容的存在惩罚（如支持） |

### 消息角色 {#message-roles}

| 角色 | 用途 |
|------|---------|
| `system` | 设定助手的行为和个性 |
| `user` | 用户输入 |
| `assistant` | 助手之前的回复（用于多轮对话） |
| `developer`、`tool` | 所选模型和路由支持时可用的其他 OpenAI 兼容角色 |

## 完整请求示例 {#full-request-example}

::: code-group

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

response = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ],
    temperature=0.7,
    max_tokens=256
)

print(response.choices[0].message.content)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
  temperature: 0.7,
  max_tokens: 256,
});

console.log(response.choices[0].message.content);
```

:::

## 响应结构 {#response-structure}

### 典型的非流式响应 {#typical-non-streaming-response}

```json
{
  "id": "chatcmpl-abc123def456",
  "object": "chat.completion",
  "created": 1719000000,
  "model": "deepseek/deepseek-v4-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 8,
    "total_tokens": 32
  }
}
```

### 响应字段说明 {#response-fields-explained}

| 字段 | 说明 |
|-------|-------------|
| `id` | 本次补全的唯一标识符 |
| `object` | 兼容 OpenAI 的响应对象，在此路由上通常为 `"chat.completion"` |
| `created` | 响应生成时的 Unix 时间戳 |
| `model` | 生成响应的模型 |
| `choices` | 补全选项数组（通常只有一个） |
| `choices[].index` | 该选项在数组中的索引 |
| `choices[].message.role` | 生成消息的角色，通常为 `"assistant"` |
| `choices[].message.content` | 生成的文本 |
| `choices[].finish_reason` | 停止生成的原因（见下文） |
| `usage.prompt_tokens` | 输入中的 token 数 |
| `usage.completion_tokens` | 生成输出中的 token 数 |
| `usage.total_tokens` | prompt 与 completion token 数之和 |

### 结束原因 {#finish-reasons}

结束原因取决于提供商。常见的 OpenAI 兼容值包括：

| 值 | 常见含义 |
|-------|---------|
| `stop` | 响应自然结束或遇到停止序列 |
| `length` | 达到 `max_tokens` 上限，响应被截断 |

遇到未知值时，应将其视为有效的提供商输出，而不是拒绝该响应。

## 流式响应 {#streaming-responses}

如需实时输出（例如聊天机器人逐字显示），请使用流式输出。响应以 Server-Sent Events（SSE）形式返回：

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Write a haiku about coding."}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()  # newline at the end
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Write a haiku about coding.' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}
console.log();
```

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -N \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Write a haiku about coding."}],
    "stream": true
  }'
```

:::

### 流式 SSE 格式 {#streaming-sse-format}

兼容的流通常会发出如下 Server-Sent Events：

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

要点：

- 按顺序处理数据块，并拼接所有 `delta.content` 片段
- 容忍仅含元数据的数据块、空 delta 以及无法识别的提供商兼容字段
- 在流关闭或收到终止标记时停止；Chat Completions 通常使用 `data: [DONE]`
- 不要假设每个模型发出的首个或最后一个数据块结构完全相同

## 使用 Anthropic SDK {#using-the-anthropic-sdk}

SandBase 还在 `POST /v1/messages` 提供兼容 Anthropic 的端点。只需修改 `base_url` 即可使用 Anthropic SDK：

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

message = client.messages.create(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)
print(message.content[0].text)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai',
});

const message = await client.messages.create({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'What is the capital of France?' }],
});
console.log(message.content[0].text);
```

:::

### Anthropic 响应结构 {#anthropic-response-structure}

兼容 Anthropic 的端点返回 Anthropic 风格的响应。典型的文本响应如下：

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The capital of France is Paris."
    }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 14,
    "output_tokens": 8
  }
}
```

| 字段 | 说明 |
|-------|-------------|
| `id` | 消息 ID（以 `msg_` 为前缀） |
| `type` | 消息对象类型，通常为 `"message"` |
| `role` | 生成消息的角色，通常为 `"assistant"` |
| `content` | 类型化内容块数组；不要假设每个块都是文本 |
| `model` | 生成响应的模型 |
| `stop_reason` | `"end_turn"`（自然停止）、`"max_tokens"`（达到上限）或 `"stop_sequence"` |
| `usage.input_tokens` | 输入中的 token 数 |
| `usage.output_tokens` | 生成输出中的 token 数 |

### Anthropic 流式输出 {#anthropic-streaming}

使用 Anthropic SDK 进行流式输出的方式相同，只需传入 `stream=True`：

```python
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about coding."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()
```

## 选择模型 {#choosing-a-model}

选择模型时，请查看其实时模型卡片，了解可用性、定价、上下文长度、支持的输入和能力。这些信息会各自独立变化，因此不要依赖复制来的模型对比表。

- 浏览当前的 [Models 目录](https://www.sandbase.ai/models)。
- 在目录中打开模型页面，查看该模型特有的请求字段。
- 当集成需要以编程方式获取最新模型元数据时，查询 `GET /v1/models`。

对于共享同一兼容接口的模型，切换时通常只需修改 `model` 参数。在沿用可选字段、工具、媒体输入或结构化输出设置之前，请重新核对所选模型的能力和 schema。

## 后续步骤 {#next-steps}

上线生产环境前，请设置请求超时，仅对瞬时故障使用有上限的指数退避进行重试，在可用时记录请求 ID，并在不记录 prompt 或 API 密钥的前提下监控用量。

- [**API 参考**](/api-reference/)：推理端点和平台 API 契约
- [**流式输出指南**](/guides/streaming)：进阶流式模式和错误处理
- [**模型**](https://www.sandbase.ai/models)：模型发现、能力和当前定价
- [**错误**](/guides/error-handling)：处理失败和重试
