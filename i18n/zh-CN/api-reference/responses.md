---
i18nSource: b5cf676d897d17a3
title: 创建 Response
description: 创建 OpenAI 兼容的模型响应，支持流式请求和启用工具的请求。
aside: false
outline: false
apiReference:
  title: 创建 Response
  operation: Inference
  method: POST
  path: /v1/responses
  description: 创建 OpenAI 兼容的模型响应。SandBase 在完成模型映射后保留请求字段，并将响应清理为仅包含 OpenAI 公开字段。
  signature: client.responses.create(params)
  groups:
    - title: 请求体
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: 来自 Models API 的模型标识符。
        - name: input
          type: string | object[]
          required: false
          description: 文本、消息项，或所选模型和服务商支持的其他输入。
        - name: instructions
          type: string
          required: false
          description: 本次响应的 system 或 developer 指令。
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: 返回 OpenAI 兼容的 Server-Sent Events。
        - name: background
          type: boolean
          required: false
          description: 在所选服务商支持时请求后台执行。
        - name: include
          type: string[]
          required: false
          description: 在支持时额外包含的公开响应数据。
        - name: max_output_tokens
          type: integer
          required: false
          description: 最大生成 token 数。
        - name: max_tool_calls
          type: integer
          required: false
          description: 在支持时允许的最大内置工具调用次数。
        - name: metadata
          type: object
          required: false
          description: 转发给服务商的请求元数据。
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: 允许支持的模型并行调用工具。
        - name: previous_response_id
          type: string
          required: false
          description: 在所选路由支持时要继续的上一个响应。
        - name: reasoning
          type: object
          required: false
          description: 支持的模型的推理配置。
        - name: store
          type: boolean
          required: false
          description: 在支持时请求服务商端存储响应。
        - name: text
          type: object
          required: false
          description: 文本输出和结构化格式配置。
        - name: tool_choice
          type: string | object
          required: false
          description: 控制工具选择。
        - name: tools
          type: object[]
          required: false
          description: 模型可用的工具。
        - name: truncation
          type: string
          required: false
          description: 输入截断行为。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/responses \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-5.2","input":"Explain immutable infrastructure in one sentence."}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.responses.create(
            model="openai/gpt-5.2",
            input="Explain immutable infrastructure in one sentence.",
        )
        print(response.output_text)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.responses.create({
          model: "openai/gpt-5.2",
          input: "Explain immutable infrastructure in one sentence.",
        });
        console.log(response.output_text);
  response:
    status: 200 OK
    code: |-
      {
        "id": "resp_01...",
        "object": "response",
        "status": "completed",
        "model": "openai/gpt-5.2",
        "output": [],
        "usage": {
          "input_tokens": 18,
          "output_tokens": 12,
          "total_tokens": 30,
          "input_tokens_details": {"cached_tokens": 0},
          "output_tokens_details": {"reasoning_tokens": 0}
        }
      }
  notes:
    - title: 请求兼容性
      description: SandBase 会将 model 改写为所选的上游模型，并保留其他请求字段。各服务商的支持情况仍有差异。
    - title: 清理后的响应
      description: 仅返回 OpenAI 公开响应字段和 token 用量。服务商的计费、账户、路由信息以及未知的顶层扩展字段会被移除；输出项内容会保留。
    - title: 流式传输
      description: 公开的 response.* 和 error SSE 事件经清理后转发。未知的私有事件会被丢弃；遇到格式错误的数据时会关闭流，而不会转发不安全的内容。
  errors:
    - status: "400"
      description: JSON 无效、缺少 model，或服务商请求无效。
    - status: "401"
      description: API 密钥缺失或无效。
    - status: "402"
      description: 已达到组织或 API Key 的消费上限。
    - status: "403"
      description: API 密钥权限范围不足或被上游拒绝。
    - status: "413"
      description: 上游服务商以请求过大为由拒绝了该请求。
    - status: "500"
      description: 预测生命周期或组织查询失败。
    - status: "502"
      description: 无法安全地解析和清理上游响应。
    - status: "503"
      description: 路由失败，或所有候选服务商均已尝试失败。
---

<ApiReferencePage />
