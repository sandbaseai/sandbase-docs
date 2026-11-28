---
i18nSource: 08bc15c123b1c466
title: Session 파일 목록 조회
description: Session 첨부 파일 목록을 조회합니다.
aside: false
outline: false
apiReference:
  title: Session 파일 목록 조회
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/files
  description: 오프셋 페이지네이션으로 첨부 파일 목록을 조회합니다. limit은 1~100이어야 합니다.
  groups:
    - title: 경로 매개변수
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID(ses_ 접두사).
    - title: 쿼리 매개변수
      fields:
        - name: limit
          type: integer
          required: false
          description: 최대 100의 페이지 크기입니다. 100을 넘는 값은 400을 반환하며, 0이나 숫자가 아닌 값은 20으로 대체됩니다.
          default: "20"
        - name: offset
          type: integer
          required: false
          description: 건너뛸 레코드 수입니다.
          default: "0"
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files?limit=20" \
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
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files?limit=20",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files?limit=20', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "data": [
          {
            "id": "fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "name": "q3-report.pdf",
            "mime_type": "application/pdf",
            "size_bytes": 482113,
            "status": "ready",
            "created_at": "2026-10-06T08:10:00Z",
            "updated_at": "2026-10-06T08:10:02Z"
          }
        ],
        "total": 1,
        "limit": 20,
        "offset": 0
      }
---

<ApiReferencePage />
