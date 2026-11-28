---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: 通过 SandBase 使用与 Anthropic 兼容的消息、内容块、工具、思考和流式传输。
---

# Anthropic Messages {#anthropic-messages}

SandBase 在 `POST /v1/messages` 提供与 Anthropic 兼容的端点。使用 Anthropic SDK 的应用只需更改 API 密钥和 base URL 即可接入。

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## 认证与版本请求头 {#authentication-and-version-headers}

使用 `x-api-key` 或 `Authorization: Bearer …`。两者同时提供时，`x-api-key` 优先。可选的 `anthropic-version` 请求头会转发给上游，省略时默认为 `2023-06-01`。可选的 `anthropic-beta` 值也会被转发，具体取决于服务商的兼容性。

## 消息与内容块 {#messages-and-content-blocks}

消息使用 `user` 和 `assistant` 角色。将系统指令放在顶层的 `system` 字段中。内容可以是纯文本，也可以是由带类型的块组成的数组，例如 `text`、`image`、`tool_use` 和 `tool_result`。

## 工具与扩展思考 {#tools-and-extended-thinking}

在 `tools` 中添加工具定义，并通过 `tool_choice` 控制工具选择。在所选模型支持的情况下，可使用 `thinking` 配置扩展推理；继续对话时请保留返回的 thinking 块。

## 流式传输 {#streaming}

设置 `stream: true` 以接收 Anthropic 风格的 SSE 事件，包括 `message_start`、内容块事件、`message_delta` 和 `message_stop`。SandBase 还会转发保活事件和服务商定义的 beta 事件。为保证向前兼容，客户端应忽略未知的事件类型，并处理协议层面的 `error` 事件。

## 兼容性 {#compatibility}

SandBase 会将公开的模型名称映射到所选的服务商。除非该服务商有明确的兼容性规则会移除不支持的字段或拒绝该候选项，其他兼容的请求字段和响应字节都会原样保留。服务商特有的 beta 功能不一定在所有模型上可用。完整的请求和响应结构请参阅[创建 Anthropic Message](/api-reference/anthropic-compat)。
