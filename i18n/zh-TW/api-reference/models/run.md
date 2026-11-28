---
i18nSource: efa205ed7505643c
title: 執行模型或 API 功能
description: 透過統一的執行端點提交 SandBase 模型或 API 功能。
aside: false
outline: false
apiReference:
  title: 執行模型或 API 功能
  operation: Models
  method: POST
  path: /v1/run
  description: 執行已啟用的 SandBase 模型或 API 功能。請求欄位依功能而異；所選功能的結構描述請參閱 SandBase 網站上的模型或 API 參考頁面。
  groups:
    - title: 請求本文
      fields:
        - name: model
          type: string
          required: true
          description: 已啟用的邏輯模型或 API 功能識別碼。
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: 執行模式提示。`auto` 會使用所選功能設定的預設值；其他值需要該功能支援。
        - name: stream
          type: boolean
          required: false
          description: "在所選功能支援時要求串流輸出。等同於 `mode: stream`。"
        - name: webhook_url
          type: string
          required: false
          description: 選用的 HTTPS 回呼，適用於支援的非同步圖片
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

## 執行與結果 {#execution-and-results}

同步功能會在原始請求中傳回已完成的回應。非同步功能會傳回帶有不透明 `id` 的 `202 Accepted`；請輪詢[取得非同步執行](./run-get)，直到狀態變為終止狀態。

各功能專屬的請求欄位與輸出格式，定義於所選模型或 API 操作的頁面。請將這些欄位放在 JSON 本文的頂層；不要包在 `input` 物件中。請勿假設所有功能都接受相同的參數。

## Webhook 回呼 {#webhook-callbacks}

僅對支援的非同步圖片、影片或音訊任務設定 `webhook_url`。SandBase 會在任務完成或失敗後，將最終的執行事件傳送到該 HTTPS 端點；回呼僅作為送達提示，無法取代 `GET /v1/run/{id}`。請持續輪詢執行端點以取得權威狀態，並在回呼延遲或重複時安全地重試。同步模型回應與供應商原生端點不使用此回呼欄位。
