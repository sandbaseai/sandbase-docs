---
i18nSource: faccf5122e785ea0
title: Session Artifact डाउनलोड करें
description: ID से capture किया गया Session artifact डाउनलोड करें। पूरी फ़ाइल डाउनलोड की सीमा, सपोर्टेड response types और Range का व्यवहार जानें।
aside: false
outline: false
apiReference:
  title: Session Artifact डाउनलोड करें
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: List Session Artifacts से मिले ID का इस्तेमाल करके पूरा immutable artifact डाउनलोड करें। 200 MiB तक की फ़ाइलें सपोर्टेड हैं। कोई query parameter स्वीकार नहीं किया जाता; access validation के बाद Range requests 416 लौटाते हैं।
  groups:
    - title: Path parameters
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID (ses_ prefix)।
        - name: artifact_id
          type: string
          required: true
          description: इसी Session की artifact list से लौटा सटीक opaque art_ ID। Attachment IDs और workspace paths स्वीकार नहीं किए जाते।
    - title: Response headers
      fields:
        - name: Content-Type
          type: string
          required: true
          description: File extension से अनुमानित media type, या application/octet-stream।
        - name: Content-Disposition
          type: string
          required: true
          description: Artifact filename के साथ attachment।
        - name: Content-Length
          type: integer
          required: true
          description: Bytes में पूरी फ़ाइल का size।
        - name: Cache-Control
          type: string
          required: true
          description: no-store।
  examples:
    - label: cURL
      language: bash
      code: |-
        # Set SESSION_ID and ARTIFACT_ID from your Session and artifact list.
        curl --fail-with-body "https://api.sandbase.ai/v1/agents/sessions/${SESSION_ID}/artifacts/${ARTIFACT_ID}/content" \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          --output report.md
    - label: Python
      language: python
      code: |-
        import os
        from pathlib import Path
        import requests

        # Use IDs returned by your own Session and artifact list.
        session_id = os.environ["SESSION_ID"]
        artifact_id = os.environ["ARTIFACT_ID"]
        response = requests.get(
            f"https://api.sandbase.ai/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        Path("report.md").write_bytes(response.content)
    - label: TypeScript
      language: typescript
      code: |-
        import { writeFile } from 'node:fs/promises';

        const { SESSION_ID, ARTIFACT_ID, SANDBASE_API_KEY } = process.env;
        if (!SESSION_ID || !ARTIFACT_ID || !SANDBASE_API_KEY) throw new Error('Missing configuration');
        const response = await fetch(
          `https://api.sandbase.ai/v1/agents/sessions/${encodeURIComponent(SESSION_ID)}/artifacts/${encodeURIComponent(ARTIFACT_ID)}/content`,
          { headers: { Authorization: `Bearer ${SANDBASE_API_KEY}` } },
        );
        if (!response.ok) throw new Error(await response.text());
        await writeFile('report.md', new Uint8Array(await response.arrayBuffer()));
---

<ApiReferencePage />

सफल response फ़ाइल के bytes होते हैं, JSON नहीं। पूरी फ़ाइल डाउनलोड करें; partial transfers और resumable Range downloads सपोर्टेड नहीं हैं। उपलब्ध न होने वाला artifact `404` लौटाता है; artifact service उपलब्ध न होने पर `executor_unavailable` लौटता है।
