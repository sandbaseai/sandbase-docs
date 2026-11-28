---
i18nSource: 270917aea416aa76
title: Session Artifacts की सूची
description: Capture किए गए Session output artifacts को cursor pagination, opaque IDs, file sizes और download links के साथ सूचीबद्ध करें।
aside: false
outline: false
apiReference:
  title: Session Artifacts की सूची
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: इस Session के immutable generated outputs की सूची। Artifact IDs opaque, Session-scoped handles हैं; लौटाया गया ID बिना बदले download endpoint को भेजें। अनजान या दोहराए गए query parameters पर 400 लौटता है।
  groups:
    - title: Path parameters
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID (ses_ prefix)।
    - title: Query parameters
      fields:
        - name: limit
          type: integer
          required: false
          description: 1 से 100 तक page size; गलत values पर 400 लौटता है।
          default: "20"
        - name: order
          type: string
          required: false
          description: asc या desc।
          default: desc
        - name: after
          type: string
          required: false
          description: पिछले पेज पर last_id के रूप में लौटा Artifact ID। आगे जारी रखते समय वही order रखें।
    - title: Artifact object
      fields:
        - name: object
          type: string
          required: true
          description: हमेशा agent.session.artifact।
        - name: id
          type: string
          required: true
          description: Opaque art_ handle। इसे खुद न बनाएं और न decode करें।
        - name: session_id
          type: string
          required: true
          description: मालिक Session का ID।
        - name: path
          type: string
          required: true
          description: /workspace/outputs/ के अंदर generated output का path।
        - name: size_bytes
          type: integer
          required: true
          description: Bytes में artifact का size।
        - name: created_at
          type: integer
          required: true
          description: Unix seconds में creation timestamp।
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "agent.session.artifact",
            "id": "art_example_handle",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "path": "/workspace/outputs/report.md",
            "size_bytes": 1024,
            "created_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "art_example_handle",
        "last_id": "art_example_handle"
      }
---

<ApiReferencePage />

उदाहरण वाला handle सिर्फ़ समझाने के लिए है। [Download Artifact](./download-artifact) के लिए अपने request से लौटा `id` इस्तेमाल करें। `has_more` true होने पर अगले पेज के लिए `after=last_id` भेजें। खाली सूची में `first_id` और `last_id` null होते हैं। Artifact metadata के लिए कोई अलग GET endpoint उपलब्ध नहीं है।
