---
i18nSource: efa205ed7505643c
title: 运行模型或 API 能力
description: 通过统一运行端点提交 SandBase 模型或 API 能力。
aside: false
outline: false
apiReference:
  title: 运行模型或 API 能力
  operation: Models
  method: POST
  path: /v1/run
  description: 执行一个已启用的 SandBase 模型或 API 能力。请求字段因能力而异；所选能力的结构请参阅 SandBase 网站上对应的模型或 API 参考页面。
  groups:
    - title: 请求体
      fields:
        - name: model
          type: string
          required: true
          description: 已启用的逻辑模型或 API 能力标识符。
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: 执行模式提示。`auto` 使用所选能力配置的默认模式；其他值需要该能力支持。
        - name: stream
          type: boolean
          required: false
          description: "当所选能力支持时，请求流式输出。等同于 `mode: stream`。"
        - name: webhook_url
          type: string
          required: false
          description: 可选的 HTTPS 回调，用于支持的异步图像
          video: null
          or audio tasks. See the Webhooks reference for validation and delivery behavior.: null
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## 执行与结果 {#execution-and-results}

同步能力会在原始请求中直接返回完成的响应。异步能力返回 `202 Accepted` 和一个不透明的 `id`；请轮询[获取异步运行结果](./run-get)，直到状态变为终态。

各能力特有的请求字段和输出结构在所选模型或 API 操作页面中定义。请将这些字段放在 JSON 请求体的顶层，不要包裹在 `input` 对象中。不要假定所有能力都接受相同的参数。

## Webhook 回调 {#webhook-callbacks}

仅对支持的异步图像、视频或音频任务设置 `webhook_url`。任务完成或失败后，SandBase 会将最终的运行事件发送到该 HTTPS 端点；回调只是一种投递提示，不能替代 `GET /v1/run/{id}`。请始终轮询运行端点以获取权威状态，并在回调延迟或重复时安全地处理。同步模型响应和服务商原生端点不使用此回调字段。
