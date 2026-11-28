---
i18nSource: 06a65ded83bf9438
title: Workspace फ़ाइलों की सूची
description: path, size और pagination के साथ मौजूदा Session workspace फ़ाइलों की सूची पाएँ। यह read-only endpoint file metadata लौटाता है।
aside: false
outline: false
apiReference:
  title: Workspace फ़ाइलों की सूची
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: एक Session workspace directory में मौजूदा file paths और sizes की सूची पाएँ। यह केवल metadata की listing है, attachment history या artifact content नहीं। अज्ञात या दोहराए गए query parameters 400 लौटाते हैं।
  groups:
    - title: Path parameters
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID (ses_ prefix)।
    - title: Query parameters
      fields:
        - name: path
          type: string
          required: false
          description: Absolute directory /workspace या उसके नीचे की normalized directory। अधिकतम 4096 bytes; traversal, backslashes या trailing slash नहीं।
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: पेज का आकार 1 से 100 तक।
          default: "20"
        - name: order
          type: string
          required: false
          description: "Path sort order: asc या desc।"
          default: asc
        - name: page
          type: string
          required: false
          description: पिछले response से मिला opaque next मान। पहले पेज पर न भेजें; खाली string न भेजें। path, order और limit को न बदलें।
    - title: Response fields
      fields:
        - name: object
          type: string
          required: true
          description: हमेशा page।
        - name: data
          type: array
          required: true
          description: मौजूदा directory की फ़ाइलें, हर एक path और size_bytes के साथ। यह recursive listing नहीं है।
        - name: next
          type: string | null
          required: true
          description: आगे जारी रखने के लिए यह मान page के रूप में भेजें; अंत में null।
        - name: has_more
          type: boolean
          required: true
          description: क्या एक और पेज उपलब्ध है।
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "page",
        "data": [
          {
            "path": "/workspace/notes.md",
            "size_bytes": 1024
          }
        ],
        "next": null,
        "has_more": false
      }
---

<ApiReferencePage />

Workspace reads `workspace_provisioning`, `workspace_environment_missing`, `workspace_cursor_invalid` या `workspace_unavailable` लौटा सकते हैं। Cursor अमान्य होने पर पहले पेज से फिर शुरू करें। Download किए जा सकने वाले generated outputs खोजने के लिए [Artifacts](./list-artifacts) इस्तेमाल करें।
