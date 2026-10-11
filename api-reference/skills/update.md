---
title: Update Skill
description: Change the default version, status, or metadata of a Skill.
aside: false
outline: false
apiReference:
  title: Update Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: Change default_version, status, or market metadata. row_version is required when metadata is sent; otherwise the current value is used.
  groups:
    - title: Path parameters
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID (skl_ prefix).
    - title: Request body
      description: JSON object.
      fields:
        - name: default_version
          type: string
          required: false
          description: Default used when first attaching this Skill without an explicit version. Existing Agent bindings keep their pinned versions.
        - name: status
          type: string
          required: false
          description: active or disabled.
        - name: metadata
          type: object | null
          required: false
          description: Presentation metadata under the market namespace only (up to 16 KiB). Requires row_version; replaces the metadata object. Unknown namespaces or fields return 400. See the metadata example below.
        - name: row_version
          type: integer
          required: false
          description: Current row_version from Get Skill. A stale value returns 409 conflict; required when metadata is present.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "default_version": "2"
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        skill = client.skills.update("skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", default_version="2")
        print(skill.default_version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
            headers=headers,
            json={
                "default_version": "2"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "default_version": "2"
          }),
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
        "default_version": "2",
        "latest_version": "2",
        "status": "active",
        "visibility": "private",
        "row_version": 3,
        "metadata": {},
        "created_at": 1791273600,
        "updated_at": 1791273600
      }
---

<ApiReferencePage />

## Metadata example

Send the current `row_version` together with the complete metadata object:

```json
{
  "row_version": 3,
  "metadata": {
    "market": {
      "display_name": "Release notes",
      "categories": ["development"],
      "tags": ["releases"],
      "required_endpoints": ["github.issues"],
      "servers": ["github"]
    }
  }
}
```

Market metadata describes the Skill for display. It does not install a server, grant credentials, or change the Agent's MCP selection. `metadata: {}` or `metadata: null` clears it; both still require `row_version`.
