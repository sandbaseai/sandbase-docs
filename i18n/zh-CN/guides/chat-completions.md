---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: 在 SandBase 中使用兼容 OpenAI 的 chat completions、流式输出、工具、多模态输入和结构化输出。
---

# Chat Completions {#chat-completions}

SandBase 在 `POST /v1/chat/completions` 提供兼容 OpenAI 的 Chat Completions 端点。现有的 OpenAI SDK 应用只需更换 API 密钥和 base URL 即可使用 SandBase。

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## 消息与多模态内容 {#messages-and-multimodal-content}

按对话顺序发送消息，使用所选提供商支持的角色，常见的有 `system`、`developer`、`user`、`assistant` 和 `tool`。文本可以是字符串。支持视觉的模型还接受 `text` 和 `image_url` 等内容部分。

## 流式输出 {#streaming}

设置 `stream: true` 以接收 Server-Sent Events。按顺序读取每个 `data:` 事件，并拼接 `choices[0].delta.content`。流以 `data: [DONE]` 结束。如果所选提供商支持流式用量统计，可添加 `stream_options: {"include_usage": true}`；否则可能不返回用量。

## 工具 {#tools}

在 `tools` 中定义可调用的函数。当助手返回 `tool_calls` 时，在你的应用中执行每个函数，然后追加一条包含对应 `tool_call_id` 的 `tool` 消息，再继续对话。

## 结构化输出 {#structured-output}

使用 `response_format` 请求 JSON 对象或 JSON Schema 格式的响应。支持情况因模型而异，因此在依赖严格的 schema 约束之前，请先确认所选模型的能力。

## 提供商特定参数 {#provider-specific-parameters}

SandBase 使用 `model` 和 `stream` 进行路由。当所选提供商使用相同协议时，其他兼容 OpenAI 的请求字段会被保留。当 SandBase 在不同协议之间转换时，请使用文档中列出的字段或 `extra_body`；支持情况因提供商而异。

## 错误与重试 {#errors-and-retries}

仅在重新生成是安全的情况下，对可重试的 `429` 和瞬时服务器响应使用有上限的退避重试。不要自动重试格式错误的请求、认证失败，或工具副作用可能已经发生的请求。参见[错误与重试](/guides/error-handling)。完整的字段和响应 schema 请参阅 [Chat Completions API](/api-reference/llm-gateway)。
