---
i18nSource: fb62188053fb216d
title: API 直通
description: 透過含供應商前綴的路徑，呼叫目錄中已啟用的 API 能力。
aside: false
outline: false
apiReference:
  title: API 直通
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: 解析名為 vendor/upstream_path 的已啟用目錄能力，並透過統一的 SandBase 管線執行 JSON 物件。對使用 GET 的能力也支援 GET。
  groups:
    - title: 路徑參數
      fields:
        - name: vendor
          type: string
          required: true
          description: 能力名稱的第一個區段。
        - name: upstream_path
          type: string
          required: true
          description: 其餘路徑
          including literal slash-separated segments when present.: null
    - title: 請求主體
      fields:
        - name: model
          type: string
          required: false
          description: 省略時使用由 URL 推導出的 vendor/path 識別。若有提供
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: 由所選能力的即時 schema 定義的欄位。
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

此 URL 會解析名為 `vendor/upstream_path` 的已啟用模型。請使用 [Models API](./) 回傳的、含供應商前綴的確切名稱。巢狀的能力名稱會保留為字面上的路徑區段，而非經百分比編碼的斜線。

POST 只接受 JSON 物件。允許空的 POST 主體，其行為等同於只包含由 URL 推導出之模型的物件。GET 使用空主體。回應欄位以及同步或非同步行為取決於所選的能力；非同步結果請透過 `GET /v1/run/{id}` 輪詢。
