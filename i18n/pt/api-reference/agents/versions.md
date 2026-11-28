---
i18nSource: f42ec611f7c14ba0
title: Listar versões do Agent
description: Liste os snapshots imutáveis de versões do Agent.
aside: false
outline: false
apiReference:
  title: Listar versões do Agent
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}/versions
  description: Liste snapshots de versões com paginação por offset. Cada item contém o documento de configuração salvo, o checksum, uma nota opcional e um created_at em RFC 3339.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: agent_id
          type: string
          required: true
          description: ID do Agent (prefixo agt_).
    - title: Parâmetros de consulta
      fields:
        - name: limit
          type: integer
          required: false
          description: Tamanho da página. Valores acima de 200 são limitados a 200.
          default: "20"
        - name: offset
          type: integer
          required: false
          description: Número de registros a pular.
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
