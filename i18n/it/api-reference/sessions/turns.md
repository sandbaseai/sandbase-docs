---
i18nSource: 1a980a4dd8761b1b
title: Elencare i turni della Session
description: Leggi la cronologia dei turni della Session.
aside: false
outline: false
apiReference:
  title: Elencare i turni della Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/turns
  description: Legge i Turn con paginazione a cursore. Un Turn raggruppa un input e il lavoro che ha generato, incluso il suo stato. Leggi un singolo Turn con GET /v1/agents/sessions/{session_id}/turns/{turn_id}.
  groups:
    - title: Parametri di percorso
      fields:
        - name: session_id
          type: string
          required: true
          description: ID della Session (prefisso ses_).
    - title: Parametri di query
      fields:
        - name: limit
          type: integer
          required: false
          description: Dimensione della pagina da 1 a 100. I valori fuori intervallo restituiscono 400.
          default: "20"
        - name: after
          type: string
          required: false
          description: Cursore. Passa il last_id della pagina precedente.
        - name: order
          type: string
          required: false
          description: asc o desc per data di creazione.
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
