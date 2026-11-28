---
i18nSource: 2ffb24dad49b9c79
title: 取得非同步 run
description: 輪詢 SandBase 非同步模型或 API run，並取得其目前或最終結果。
aside: false
outline: false
apiReference:
  title: 取得非同步 run
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: 取得由 POST /v1/run 建立之非同步 run 的目前或最終狀態。
  groups:
    - title: 路徑參數
      fields:
        - name: id
          type: string
          required: true
          description: POST /v1/run 回傳的不透明 run 識別碼。請完全照原樣使用；不保證有任何前綴。
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

## 輪詢 {#polling}

對於長時間執行的媒體或 API 任務，請每 5–10 秒輪詢一次。當 `status` 為 `completed`、`failed` 或 `timeout` 時停止。非終止狀態的回應可能不含 `outputs`；請將 run ID 視為不透明值，不要自行組出不同的狀態 URL。
