---
i18nSource: 9ee3d6d77d12e944
title: Chat Completions API
description: 使用 SandBase 语言模型和视觉模型创建兼容 OpenAI 的对话补全。
aside: false
outline: false
apiReference:
  title: 创建对话补全
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: 使用任意受支持的 SandBase 对话模型创建兼容 OpenAI 的对话补全。在所选路由支持的情况下，会保留提供商兼容字段。
  signature: client.chat.completions.create(params)
  groups:
    - title: 请求体
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: 来自 Models API 的模型标识符。
        - name: messages
          type: object[]
          required: true
          description: 对话消息，使用所选提供商支持的角色，常见的有 system、developer、user、assistant 或 tool。
        - name: temperature
          type: number
          required: false
          default: "1"
          description: 采样温度，取值 0 到 2。
        - name: top_p
          type: number
          required: false
          default: "1"
          description: 核采样阈值。
        - name: max_tokens
          type: integer
          required: false
          description: 最大输出 token 数。
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: 以 Server-Sent Events 增量返回。
        - name: stop
          type: string | string[]
          required: false
          description: 用于停止生成的一个或多个序列。
        - name: tools
          type: object[]
          required: false
          description: 可供模型使用的函数定义。
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: 控制是否选择工具以及选择哪个工具。
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: 允许受支持的模型在一轮中发出多个工具调用。
        - name: user
          type: string
          required: false
          description: 提供商兼容的终端用户标识符。
        - name: response_format
          type: object
          required: false
          description: JSON 对象或 JSON Schema 输出配置。
        - name: reasoning_effort
          type: string
          required: false
          description: 提供商兼容的推理强度设置。
        - name: reasoning
          type: object
          required: false
          description: 推理配置，例如 effort 或 max_tokens。
        - name: thinking
          type: object
          required: false
          description: 思考配置，例如 type 或 budget_tokens。
        - name: extra_body
          type: object
          required: false
          description: 用于需要协议转换的路由的提供商特定参数。
        - name: n
          type: integer
          required: false
          default: "1"
          description: 要生成的补全选项数量。
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: 存在惩罚，取值 -2 到 2。
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: 频率惩罚，取值 -2 到 2。
        - name: stream_options
          type: object
          required: false
          description: 流式选项，例如 include_usage。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/chat/completions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"deepseek/deepseek-v4-flash","messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(response.choices[0].message.content)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.chat.completions.create({
          model: "deepseek/deepseek-v4-flash",
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(response.choices[0].message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "chatcmpl_01...",
        "object": "chat.completion",
        "model": "deepseek/deepseek-v4-flash",
        "choices": [{
          "index": 0,
          "message": { "role": "assistant", "content": "Hello! How can I help?" },
          "finish_reason": "stop"
        }],
        "usage": { "prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15 }
      }
  notes:
    - title: 流式输出与工具
      description: "将 stream 设为 true 以使用 SSE；流以 data: [DONE] 结束。添加 stream_options.include_usage 可获取最后的用量数据块。工具调用和多模态内容遵循兼容 OpenAI 的 schema。"
    - title: 提供商兼容性
      description: 在同协议路由上，SandBase 会保留额外的兼容字段。跨协议及提供商特定字段的支持情况各不相同；适用时请使用 extra_body。
  errors:
    - status: "400"
      description: 请求体无效或参数不受支持。
    - status: "401"
      description: API 密钥缺失或无效。
    - status: "402"
      description: 已达到组织支出上限。
    - status: "404"
      description: 模型不存在或不可用。
    - status: "429"
      description: 超出速率限制。
    - status: "500"
      description: 请求持久化或组织查询失败。
    - status: "502"
      description: 所选提供商返回了无效响应。
    - status: "503"
      description: 所有提供商路由均未成功。
---

<ApiReferencePage />
