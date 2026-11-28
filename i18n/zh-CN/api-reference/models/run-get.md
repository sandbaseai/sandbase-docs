---
i18nSource: 2ffb24dad49b9c79
title: 获取异步运行
description: 轮询 SandBase 异步模型或 API 运行，获取其当前或最终结果。
aside: false
outline: false
apiReference:
  title: 获取异步运行
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: 获取由 POST /v1/run 创建的异步运行的当前或最终状态。
  groups:
    - title: 路径参数
      fields:
        - name: id
          type: string
          required: true
          description: POST /v1/run 返回的不透明运行标识符。请按原样使用；不保证带有特定前缀。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/run/opaque-run-id \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "completed",
        "outputs": [{"url":"https://media.sandbase.ai/files/result.png","content_type":"image/png"}]
      }
---

<ApiReferencePage />

## 轮询 {#polling}

对于耗时较长的媒体或 API 任务，请每 5–10 秒轮询一次。当 `status` 为 `completed`、`failed` 或 `timeout` 时停止。非终态响应可能不包含 `outputs`；请将 run ID 视为不透明值，不要自行拼接其他状态 URL。
