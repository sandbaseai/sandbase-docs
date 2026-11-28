---
i18nSource: 08bc15c123b1c466
title: Список файлов сессии
description: Список вложений сессии.
aside: false
outline: false
apiReference:
  title: Список файлов сессии
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/files
  description: Список вложений с пагинацией по смещению. limit должен быть от 1 до 100.
  groups:
    - title: Параметры пути
      fields:
        - name: session_id
          type: string
          required: true
          description: ID сессии (префикс ses_).
    - title: Параметры запроса
      fields:
        - name: limit
          type: integer
          required: false
          description: Размер страницы до 100; значения больше 100 возвращают 400, а 0 или нечисловые значения заменяются на 20.
          default: "20"
        - name: offset
          type: integer
          required: false
          description: Количество пропускаемых записей.
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
