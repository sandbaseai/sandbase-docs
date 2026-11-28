---
i18nSource: cb4bad8f3f97ecc6
title: Supprimer un Agent
description: Supprimez (archivez) un Agent.
aside: false
outline: false
apiReference:
  title: Supprimer un Agent
  operation: Agents
  method: DELETE
  path: /v1/agents/{agent_id}
  description: Archive l'Agent. Les Agents ne sont jamais supprimés définitivement ; les Sessions existantes continuent de s'exécuter sur leur configuration figée et vous pouvez désarchiver l'Agent plus tard.
  groups:
    - title: Paramètres de chemin
      fields:
        - name: agent_id
          type: string
          required: true
          description: ID de l'Agent (préfixe agt_).
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X DELETE https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        result = client.beta.agents.delete("agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60")
        print(result.deleted)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "DELETE",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'DELETE',
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
        "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "object": "agent.deleted",
        "deleted": true
      }
---

<ApiReferencePage />
