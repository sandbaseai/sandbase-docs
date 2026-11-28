---
i18nSource: d6c92171e494b8d9
title: 下載 Session 檔案
description: 下載 Session 附件。
aside: false
outline: false
apiReference:
  title: 下載 Session 檔案
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/files/{file_id}/content
  description: 下載已就緒附件的原始位元組。其他狀態會回傳 404。
  groups:
    - title: 路徑參數
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前綴）。
        - name: file_id
          type: string
          required: true
          description: 附件 ID（fil_ 前綴）。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files/fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72/content \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
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
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files/fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72/content",
            headers=headers,
        )
        response.raise_for_status()
        with open("q3-report.pdf", "wb") as f:
            f.write(response.content)
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files/fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72/content', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        const bytes = new Uint8Array(await response.arrayBuffer());
        console.log(bytes.length, response.headers.get('content-type'));
---

<ApiReferencePage />
