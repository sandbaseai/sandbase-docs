---
i18nSource: 1a980a4dd8761b1b
title: 列出 Session Turns
description: 讀取 Session 的 turn 紀錄。
aside: false
outline: false
apiReference:
  title: 列出 Session Turns
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/turns
  description: 以游標分頁讀取 Turn。一個 Turn 包含一次輸入及其觸發的工作，以及其狀態。使用 GET /v1/agents/sessions/{session_id}/turns/{turn_id} 讀取單一 Turn。
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
          description: 每頁筆數，範圍 1 到 100。超出範圍的值會回傳 400。
          default: "20"
        - name: after
          type: string
          required: false
          description: 游標。傳入上一頁的 last_id。
        - name: order
          type: string
          required: false
          description: 依建立時間排序：asc 或 desc。
          default: desc
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/turns?order=asc&limit=50" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        page = client.beta.agents.sessions.turns.list("ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83", order="asc", limit=50)
        for row in page.data:
            print(row.id)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "GET",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/turns?order=asc&limit=50",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/turns?order=asc&limit=50', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
---

<ApiReferencePage />
