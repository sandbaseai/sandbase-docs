---
i18nSource: f42ec611f7c14ba0
title: Elencare le versioni di un Agent
description: Elenca gli snapshot immutabili delle versioni di un Agent.
aside: false
outline: false
apiReference:
  title: Elencare le versioni di un Agent
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}/versions
  description: Elenca gli snapshot delle versioni con paginazione a offset. Ogni elemento contiene il documento di configurazione salvato, il checksum, una nota facoltativa e un created_at in formato RFC 3339.
  groups:
    - title: Parametri di percorso
      fields:
        - name: agent_id
          type: string
          required: true
          description: ID dell'Agent (prefisso agt_).
    - title: Parametri di query
      fields:
        - name: limit
          type: integer
          required: false
          description: Dimensione della pagina. I valori superiori a 200 vengono limitati a 200.
          default: "20"
        - name: offset
          type: integer
          required: false
          description: Numero di record da saltare.
          default: "0"
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions?limit=20&offset=0" \
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions?limit=20&offset=0",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions?limit=20&offset=0', {
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
            "version": 2,
            "agent": {
              "name": "Research assistant",
              "model": "deepseek/deepseek-v4-flash",
              "instructions": "Answer in five bullet points with cited sources."
            },
            "checksum": "d04d38eb890a1273fa7965a6a7cdc2426232326e43b901d1aad3ed669455acbf",
            "created_at": "2026-10-06T08:00:00.000Z"
          }
        ],
        "total": 2,
        "limit": 20,
        "offset": 0
      }
---

<ApiReferencePage />
