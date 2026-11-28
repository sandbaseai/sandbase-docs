---
i18nSource: 7f46c6a48c4e28b0
title: Lister les items d'une Session
description: Lisez l'historique des items d'une Session.
aside: false
outline: false
apiReference:
  title: Lister les items d'une Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/items
  description: Lit les items de conversation (messages, appels d'outils et sorties) avec pagination par curseur. Utilisez cet endpoint pour récupérer les sorties produites alors qu'aucun flux n'était ouvert.
  groups:
    - title: Paramètres de chemin
      fields:
        - name: session_id
          type: string
          required: true
          description: ID de la Session (préfixe ses_).
    - title: Paramètres de requête
      fields:
        - name: limit
          type: integer
          required: false
          description: Taille de page de 1 à 100. Les valeurs hors de cette plage renvoient 400.
          default: "20"
        - name: after
          type: string
          required: false
          description: Curseur. Passez le last_id de la page précédente.
        - name: order
          type: string
          required: false
          description: asc ou desc selon la date de création.
          default: desc
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc&limit=50" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        page = client.beta.agents.sessions.items.list("ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83", order="asc", limit=50)
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
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc&limit=50",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc&limit=50', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
---

<ApiReferencePage />
