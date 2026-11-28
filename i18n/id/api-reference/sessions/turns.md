---
i18nSource: 1a980a4dd8761b1b
title: Mencantumkan Giliran Session
description: Baca riwayat giliran Session.
aside: false
outline: false
apiReference:
  title: Mencantumkan Giliran Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/turns
  description: Baca Turn dengan paginasi cursor. Turn mengelompokkan satu input dan pekerjaan yang dipicunya, termasuk statusnya. Baca satu Turn dengan GET /v1/agents/sessions/{session_id}/turns/{turn_id}.
  groups:
    - title: Parameter path
      fields:
        - name: session_id
          type: string
          required: true
          description: ID Session (prefiks ses_).
    - title: Parameter query
      fields:
        - name: limit
          type: integer
          required: false
          description: Ukuran halaman dari 1 hingga 100. Nilai di luar rentang menghasilkan 400.
          default: "20"
        - name: after
          type: string
          required: false
          description: Cursor. Teruskan last_id dari halaman sebelumnya.
        - name: order
          type: string
          required: false
          description: asc atau desc berdasarkan waktu pembuatan.
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
