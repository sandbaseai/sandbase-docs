---
i18nSource: 996f166544016111
title: Skill update करें
description: Skill का default version, status या metadata बदलें।
aside: false
outline: false
apiReference:
  title: Skill update करें
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: default_version, status या market metadata बदलें। metadata भेजने पर row_version ज़रूरी है; अन्यथा मौजूदा मान इस्तेमाल होता है।
  groups:
    - title: Path parameters
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID (skl_ prefix)।
    - title: Request body
      description: JSON object।
      fields:
        - name: default_version
          type: string
          required: false
          description: बिना स्पष्ट version के इस Skill को पहली बार attach करते समय इस्तेमाल होने वाला default। मौजूदा Agent bindings अपने pinned versions बनाए रखते हैं।
        - name: status
          type: string
          required: false
          description: active या disabled।
        - name: metadata
          type: object | null
          required: false
          description: केवल market namespace के अंतर्गत presentation metadata (अधिकतम 16 KiB)। row_version ज़रूरी है; metadata object को बदल देता है। अज्ञात namespaces या fields 400 लौटाते हैं। नीचे metadata का उदाहरण देखें।
        - name: row_version
          type: integer
          required: false
          description: Get Skill से मिला मौजूदा row_version। पुराना मान 409 conflict लौटाता है; metadata मौजूद होने पर ज़रूरी है।
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

## Metadata का उदाहरण {#metadata-example}

मौजूदा `row_version` को पूरे metadata object के साथ भेजें:

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

Market metadata display के लिए Skill का वर्णन करता है। यह कोई server install नहीं करता, credentials नहीं देता, और Agent के MCP selection को नहीं बदलता। `metadata: {}` या `metadata: null` इसे clear कर देता है; दोनों में अब भी `row_version` ज़रूरी है।
