---
i18nSource: d6c92171e494b8d9
title: Session 파일 다운로드
description: Session 첨부 파일을 다운로드합니다.
aside: false
outline: false
apiReference:
  title: Session 파일 다운로드
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/files/{file_id}/content
  description: ready 상태인 첨부 파일의 원본 바이트를 다운로드합니다. 다른 상태는 404를 반환합니다.
  groups:
    - title: 경로 매개변수
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID(ses_ 접두사).
        - name: file_id
          type: string
          required: true
          description: 첨부 파일 ID(fil_ 접두사).
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
