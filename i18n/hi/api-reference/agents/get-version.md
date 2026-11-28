---
i18nSource: 36f9771126ee9243
title: Agent वर्ज़न प्राप्त करें
description: Agent का एक immutable वर्ज़न पढ़ें।
aside: false
outline: false
apiReference:
  title: Agent वर्ज़न प्राप्त करें
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}/versions/{version}
  description: एक वर्ज़न snapshot पढ़ें। version एक धनात्मक पूर्णांक होना चाहिए, अन्यथा 400 मिलता है। यहाँ created_at एक ISO 8601 string है, जबकि Agent objects में Unix seconds इस्तेमाल होते हैं। note तभी दिखता है जब वर्ज़न बनाने वाले बदलाव के साथ note भेजा गया हो।
  groups:
    - title: Path parameters
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID (agt_ prefix)।
        - name: version
          type: integer
          required: true
          description: वर्ज़न संख्या, 1 से शुरू।
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
