---
title: Get Skill
description: Read one Skill.
aside: false
outline: false
apiReference:
  title: Get Skill
  operation: Skills
  method: GET
  path: /v1/skills/{skill_id}
  description: Read a Skill. Download the default version ZIP with GET /v1/skills/{skill_id}/content.
  groups:
    - title: Path parameters
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID (skl_ prefix).
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57 \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        skill = client.skills.retrieve("skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57")
        print(skill.default_version, skill.latest_version)
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
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57', {
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
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "object": "skill",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "default_version": "1",
        "latest_version": "1",
        "status": "active",
        "visibility": "private",
        "row_version": 1,
        "metadata": {},
        "created_at": 1791273600,
        "updated_at": 1791273600
      }
---

<ApiReferencePage />
