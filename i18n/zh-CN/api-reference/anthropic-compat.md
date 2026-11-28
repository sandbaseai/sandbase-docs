---
i18nSource: 04f3657850b71e58
title: 创建 Anthropic 消息
description: 使用 SandBase 模型创建兼容 Anthropic 的消息。
aside: false
outline: false
apiReference:
  title: 创建 Anthropic 消息
  operation: Inference
  method: POST
  path: /v1/messages
  description: 通过 SandBase 兼容 Anthropic 的 Messages 端点创建消息。SandBase 会为所选提供商映射模型，并保留兼容的请求和响应字段。
  signature: client.messages.create(params)
  groups:
    - title: 请求头
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "SandBase API 密钥。也支持 Authorization: Bearer；两者同时存在时以 x-api-key 为准。"
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: 转发给上游的 Anthropic API 版本。省略时 SandBase 使用 2023-06-01。
        - name: anthropic-beta
          type: string
          required: false
          description: 以逗号分隔的 beta 功能标识符，取决于提供商的兼容性。
    - title: 请求体
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: 兼容 Anthropic 的模型标识符。
        - name: messages
          type: object[]
          required: true
          description: 包含文本或类型化内容块的 user 和 assistant 消息。
        - name: max_tokens
          type: integer
          required: true
          description: 最大输出 token 数。
        - name: system
          type: string | object[]
          required: false
          description: 顶层系统指令。
        - name: temperature
          type: number
          required: false
          default: "1"
          description: 采样温度，范围为 0 到 1。
        - name: top_p
          type: number
          required: false
          description: 核采样阈值。
        - name: top_k
          type: integer
          required: false
          description: 将采样限制在前 K 个 token 中。
        - name: stop_sequences
          type: string[]
          required: false
          description: 用于停止生成的自定义序列。
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: 返回 Anthropic 风格的 Server-Sent Events。
        - name: metadata
          type: object
          required: false
          description: 请求元数据，可包含 user_id。
        - name: tools
          type: object[]
          required: false
          description: 模型可用的工具定义。
        - name: tool_choice
          type: object
          required: false
          description: 控制工具选择行为。
        - name: thinking
          type: object
          required: false
          description: 受支持模型的扩展思考配置。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/messages \
          -H "x-api-key: $SANDBASE_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "Content-Type: application/json" \
          -d '{"model":"anthropic/claude-sonnet-4","max_tokens":256,"messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from anthropic import Anthropic

        client = Anthropic(api_key="sk-sb-...", base_url="https://api.sandbase.ai")
        message = client.messages.create(
            model="anthropic/claude-sonnet-4",
            max_tokens=256,
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(message.content[0].text)
    - label: TypeScript
      language: typescript
      code: |-
        import Anthropic from "@anthropic-ai/sdk";

        const client = new Anthropic({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai" });
        const message = await client.messages.create({
          model: "anthropic/claude-sonnet-4",
          max_tokens: 256,
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "msg_01...",
        "type": "message",
        "role": "assistant",
        "model": "anthropic/claude-sonnet-4",
        "content": [{ "type": "text", "text": "Hello! How can I help?" }],
        "stop_reason": "end_turn",
        "usage": { "input_tokens": 8, "output_tokens": 7 }
      }
  notes:
    - title: 认证
      description: "使用 x-api-key 或 Authorization: Bearer。两者同时提供时以 x-api-key 为准。"
    - title: 透明协议
      description: 除模型映射和已配置的提供商兼容规则外，SandBase 会直接转发兼容的请求字段、非流式响应和 SSE 事件，不做协议转换。
    - title: Beta 功能
      description: 存在 anthropic-beta 时会被转发。候选提供商的兼容规则可能会移除不支持的 beta 字段，或跳过该候选。
  errors:
    - status: "400"
      description: 请求体无效或功能不受支持。
    - status: "401"
      description: API 密钥缺失或无效。
    - status: "402"
      description: 已达到组织支出上限。
    - status: "403"
      description: 已达到 API Key 支出上限，或组织权限校验失败。
    - status: "404"
      description: 模型不存在或不可用。
    - status: "413"
      description: 提供商因请求过大而拒绝。
    - status: "429"
      description: 超出提供商速率限制。
    - status: "500"
      description: 预测生命周期错误或提供商错误。
    - status: "502"
      description: 上游流在产生可用内容之前结束。
    - status: "503"
      description: 路由失败，或所有候选提供商均不可用。
---

<ApiReferencePage />
