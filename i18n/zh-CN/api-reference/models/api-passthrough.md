---
i18nSource: fb62188053fb216d
title: API 透传
description: 通过带厂商前缀的路径调用目录中已启用的 API 能力。
aside: false
outline: false
apiReference:
  title: API 透传
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: 解析名为 vendor/upstream_path 的已启用目录能力，并通过 SandBase 统一管道执行 JSON 对象。对于使用 GET 的能力，也支持 GET。
  groups:
    - title: 路径参数
      fields:
        - name: vendor
          type: string
          required: true
          description: 能力名称的第一个段。
        - name: upstream_path
          type: string
          required: true
          description: 剩余路径
          including literal slash-separated segments when present.: null
    - title: 请求体
      fields:
        - name: model
          type: string
          required: false
          description: 省略时使用从 URL 推导出的 vendor/path 标识。如果提供
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: 由所选能力的实时 schema 定义的字段。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"url":"https://example.com"}'
---

<ApiReferencePage />

该 URL 会解析为名为 `vendor/upstream_path` 的已启用模型。请使用 [Models API](./) 返回的带厂商前缀的完整名称。嵌套的能力名称保持为字面路径段，而不是经过百分号编码的斜杠。

POST 只接受 JSON 对象。允许空的 POST 请求体，其效果等同于一个只包含从 URL 推导出的模型的对象。GET 使用空请求体。响应字段以及同步或异步行为取决于所选能力；异步结果请通过 `GET /v1/run/{id}` 轮询。
