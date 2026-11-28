---
i18nSource: 06feb27e20f1b7f5
title: 列出帳戶歷史記錄
description: 列出 API 金鑰所屬組織的近期執行記錄。
aside: false
outline: false
apiReference:
  title: 列出帳戶歷史記錄
  operation: Account
  method: GET
  path: /v1/account/history
  description: 列出組織範圍內的近期執行記錄，依時間由新到舊排序。錯誤訊息會經過清理；儲存的 JSON 快照若無法解碼則會省略。
  groups:
    - title: 查詢參數
      fields:
        - name: model
          type: string
          required: false
          description: 完全相符的邏輯模型名稱。
        - name: api_key_id
          type: string
          required: false
          description: 完全相符的 API Key 資源 ID。
        - name: type
          type: multimodal | llm | api
          required: false
          description: 執行類別；multimodal 包含 image、video 和 audio。
        - name: status
          type: completed | failure | in_progress
          required: false
          description: 分組後的執行狀態。
        - name: error_type
          type: string
          required: false
          description: 完全相符的錯誤類型；沒有錯誤類型的記錄使用 unknown。
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: 滾動式建立時間範圍；預設為 7d。
        - name: page
          type: integer
          required: false
          description: 頁碼，從 1 開始。
        - name: page_size
          type: integer
          required: false
          description: 每頁項目數，範圍 1 到 100；預設為 20。
        - name: request_id
          type: string
          required: false
          description: 完全相符的組織範圍執行 ID。設定後會忽略其他篩選條件，並只請求一筆結果。
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: 明確時間區間所依據的時間戳記基準。
        - name: billing_scope
          type: any | positive | token
          required: false
          description: 結算篩選條件；positive 和 token 需要 time_basis=settled_at。
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: 區間起點（包含），需與 end_at 搭配使用。
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: 區間終點（不包含）；區間不可超過 32 天。
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: 僅保留正值的延遲樣本。
        - name: min_latency_ms
          type: integer
          required: false
          description: 最低延遲，單位為毫秒。
        - name: timezone
          type: IANA time-zone name
          required: false
          description: 僅供相容性驗證。時間戳記仍為 UTC；以 request_id 精確查詢時會忽略此參數。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/account/history?range=24h&page_size=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "items": [
          {
            "id": "opaque-task-id",
            "model": "openai/gpt-5.4",
            "type": "llm",
            "execution_mode": "sync",
            "status": "completed",
            "latency_ms": 842,
            "user_cost": "0.001250",
            "prompt_tokens": 120,
            "completion_tokens": 48,
            "total_tokens": 168,
            "cached_tokens": 0,
            "cache_creation_tokens": 0,
            "created_at": "2026-08-24T00:00:00Z",
            "completed_at": "2026-08-24T00:00:01Z",
            "api_key_prefix": "sk-1234567"
          }
        ],
        "total": 1,
        "page": 1,
        "page_size": 20
      }
---

<ApiReferencePage />
