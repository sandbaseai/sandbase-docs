---
i18nSource: 08bc15c123b1c466
title: Session-Dateien auflisten
description: Session-Anhänge auflisten.
aside: false
outline: false
apiReference:
  title: Session-Dateien auflisten
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/files
  description: Listet Anhänge mit Offset-Paginierung auf. limit muss zwischen 1 und 100 liegen.
  groups:
    - title: Pfadparameter
      fields:
        - name: session_id
          type: string
          required: true
          description: Session-ID (Präfix ses_).
    - title: Query-Parameter
      fields:
        - name: limit
          type: integer
          required: false
          description: Seitengröße bis 100; Werte über 100 ergeben 400, und 0 oder nicht numerische Werte fallen auf 20 zurück.
          default: "20"
        - name: offset
          type: integer
          required: false
          description: Anzahl der zu überspringenden Datensätze.
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
