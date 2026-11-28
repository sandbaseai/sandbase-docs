---
i18nSource: a0929402586b263c
title: Excluir Skill
description: Exclua uma Skill.
aside: false
outline: false
apiReference:
  title: Excluir Skill
  operation: Skills
  method: DELETE
  path: /v1/skills/{skill_id}
  description: Exclui uma Skill. Uma Skill referenciada por qualquer versão de Agent retorna 409, mesmo depois que esse Agent for arquivado; em vez disso, desative-a com Update Skill (status disabled).
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID da Skill (prefixo skl_).
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X DELETE https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57 \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        print(client.skills.delete("skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57").deleted)
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
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57', {
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
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "object": "skill.deleted",
        "deleted": true
      }
---

<ApiReferencePage />
