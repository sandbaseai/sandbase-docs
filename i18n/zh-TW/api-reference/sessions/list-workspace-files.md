---
i18nSource: 06a65ded83bf9438
title: 列出工作區檔案
description: 列出目前 Session 工作區中的檔案，包含路徑、大小與分頁。此唯讀端點回傳檔案中繼資料。
aside: false
outline: false
apiReference:
  title: 列出工作區檔案
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: 列出某個 Session 工作區目錄中目前的檔案路徑與大小。這只是中繼資料清單，不是附件歷史紀錄或成品內容。未知或重複的查詢參數會回傳 400。
  groups:
    - title: 路徑參數
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前綴）。
    - title: 查詢參數
      fields:
        - name: path
          type: string
          required: false
          description: 絕對目錄 /workspace 或其下經過正規化的目錄。最多 4096 位元組；不可包含路徑穿越、反斜線或結尾斜線。
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: 每頁筆數，範圍 1 到 100。
          default: "20"
        - name: order
          type: string
          required: false
          description: 路徑排序方式：asc 或 desc。
          default: asc
        - name: page
          type: string
          required: false
          description: 上一個回應中不透明的 next 值。第一頁請省略；不要傳送空字串。path、order 與 limit 請保持不變。
    - title: 回應欄位
      fields:
        - name: object
          type: string
          required: true
          description: 一律為 page。
        - name: data
          type: array
          required: true
          description: 目前目錄中的檔案，每個都包含 path 與 size_bytes。此清單不會遞迴列出。
        - name: next
          type: string | null
          required: true
          description: 將此值作為 page 傳入以繼續；到結尾時為 null。
        - name: has_more
          type: boolean
          required: true
          description: 是否還有下一頁。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "page",
        "data": [
          {
            "path": "/workspace/notes.md",
            "size_bytes": 1024
          }
        ],
        "next": null,
        "has_more": false
      }
---

<ApiReferencePage />

讀取工作區時可能回傳 `workspace_provisioning`、`workspace_environment_missing`、`workspace_cursor_invalid` 或 `workspace_unavailable`。若游標無效，請從第一頁重新開始。若要尋找可下載的生成輸出，請使用 [Artifacts](./list-artifacts)。
