---
i18nSource: 36f9771126ee9243
title: Pobierz wersję Agenta
description: Odczytaj jedną niezmienną wersję Agenta.
aside: false
outline: false
apiReference:
  title: Pobierz wersję Agenta
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}/versions/{version}
  description: Odczytaj jedną migawkę wersji. version musi być dodatnią liczbą całkowitą, w przeciwnym razie zwracany jest 400. created_at jest tutaj ciągiem ISO 8601, natomiast obiekty Agent używają sekund Unix. note pojawia się tylko wtedy, gdy zmiana, która utworzyła wersję, ją wysłała.
  groups:
    - title: Parametry ścieżki
      fields:
        - name: agent_id
          type: string
          required: true
          description: Identyfikator Agenta (prefiks agt_).
        - name: version
          type: integer
          required: true
          description: Numer wersji, począwszy od 1.
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
