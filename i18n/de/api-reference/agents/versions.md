---
i18nSource: f42ec611f7c14ba0
title: Agent-Versionen auflisten
description: Unveränderliche Versions-Snapshots eines Agents auflisten.
aside: false
outline: false
apiReference:
  title: Agent-Versionen auflisten
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}/versions
  description: Listet Versions-Snapshots mit Offset-Paginierung auf. Jeder Eintrag enthält das gespeicherte Konfigurationsdokument, eine Prüfsumme, eine optionale Notiz und ein created_at im Format RFC 3339.
  groups:
    - title: Pfadparameter
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent-ID (Präfix agt_).
    - title: Query-Parameter
      fields:
        - name: limit
          type: integer
          required: false
          description: Seitengröße. Werte über 200 werden auf 200 begrenzt.
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
