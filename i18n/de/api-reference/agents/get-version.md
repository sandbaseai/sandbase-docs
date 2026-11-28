---
i18nSource: 36f9771126ee9243
title: Agent-Version abrufen
description: Eine unveränderliche Agent-Version lesen.
aside: false
outline: false
apiReference:
  title: Agent-Version abrufen
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}/versions/{version}
  description: Liest einen Versions-Snapshot. version muss eine positive ganze Zahl sein, sonst 400. created_at ist hier ein ISO-8601-String, während Agent-Objekte Unix-Sekunden verwenden. note erscheint nur, wenn die Änderung, die die Version erzeugt hat, eine Notiz gesendet hat.
  groups:
    - title: Pfadparameter
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent-ID (Präfix agt_).
        - name: version
          type: integer
          required: true
          description: Versionsnummer, beginnend bei 1.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions/1 \
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions/1",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions/1', {
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
        "version": 1,
        "agent": {
          "name": "Research assistant",
          "model": "deepseek/deepseek-v4-flash",
          "instructions": "Answer with cited sources."
        },
        "checksum": "d04d38eb890a1273fa7965a6a7cdc2426232326e43b901d1aad3ed669455acbf",
        "created_at": "2026-10-05T08:00:00.000Z"
      }
---

<ApiReferencePage />
