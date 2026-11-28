---
i18nSource: a0929402586b263c
title: 刪除 Skill
description: 刪除 Skill。
aside: false
outline: false
apiReference:
  title: 刪除 Skill
  operation: Skills
  method: DELETE
  path: /v1/skills/{skill_id}
  description: 刪除 Skill。若 Skill 被任何 Agent 版本參照，即使該 Agent 已封存，仍會回傳 409；請改用 Update Skill（status disabled）將其停用。
  groups:
    - title: 路徑參數
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID（skl_ 前綴）。
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
