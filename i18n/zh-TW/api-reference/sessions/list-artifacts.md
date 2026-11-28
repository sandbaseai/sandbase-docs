---
i18nSource: 270917aea416aa76
title: 列出 Session 成品
description: 以游標分頁列出已擷取的 Session 輸出成品，包含不透明 ID、檔案大小與下載連結。
aside: false
outline: false
apiReference:
  title: 列出 Session 成品
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: 列出此 Session 產生的不可變輸出。成品 ID 是不透明且限定於 Session 範圍的控制代碼；請將傳回的 ID 原封不動地傳給下載端點。未知或重複的查詢參數會傳回 400。
  groups:
    - title: 路徑參數
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前綴）。
    - title: 查詢參數
      fields:
        - name: limit
          type: integer
          required: false
          description: 每頁筆數，範圍 1 到 100；無效值會傳回 400。
          default: "20"
        - name: order
          type: string
          required: false
          description: asc 或 desc。
          default: desc
        - name: after
          type: string
          required: false
          description: 上一頁以 last_id 傳回的成品 ID。繼續分頁時請維持相同的 order。
    - title: 成品物件
      fields:
        - name: object
          type: string
          required: true
          description: 固定為 agent.session.artifact。
        - name: id
          type: string
          required: true
          description: 不透明的 art_ 控制代碼。請勿自行組出或解碼。
        - name: session_id
          type: string
          required: true
          description: 所屬的 Session ID。
        - name: path
          type: string
          required: true
          description: 位於 /workspace/outputs/ 下的產出路徑。
        - name: size_bytes
          type: integer
          required: true
          description: 成品大小（位元組）。
        - name: created_at
          type: integer
          required: true
          description: 建立時間戳記（Unix 秒數）。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "agent.session.artifact",
            "id": "art_example_handle",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "path": "/workspace/outputs/report.md",
            "size_bytes": 1024,
            "created_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "art_example_handle",
        "last_id": "art_example_handle"
      }
---

<ApiReferencePage />

範例中的控制代碼僅供說明。請使用您自己的請求所傳回的 `id` 進行[下載成品](./download-artifact)。當 `has_more` 為 true 時，傳送 `after=last_id` 以取得下一頁。清單為空時，`first_id` 與 `last_id` 皆為 null。系統未提供獨立的成品中繼資料 GET 端點。
