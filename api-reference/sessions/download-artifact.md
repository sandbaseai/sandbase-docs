---
title: Download Session Artifact
description: Download a captured Session artifact by ID. Learn the complete-file download limit, supported response types, and Range behavior.
aside: false
outline: false
apiReference:
  title: Download Session Artifact
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: Download a complete immutable artifact using its ID from List Session Artifacts. Files up to 200 MiB are supported. No query parameters are accepted; Range requests return 416 after access validation.
  groups:
    - title: Path parameters
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID (ses_ prefix).
        - name: artifact_id
          type: string
          required: true
          description: Exact opaque art_ ID returned by this Session artifact list. Attachment IDs and workspace paths are not accepted.
    - title: Response headers
      fields:
        - name: Content-Type
          type: string
          required: true
          description: Media type inferred from the file extension, or application/octet-stream.
        - name: Content-Disposition
          type: string
          required: true
          description: attachment with the artifact filename.
        - name: Content-Length
          type: integer
          required: true
          description: Complete file size in bytes.
        - name: Cache-Control
          type: string
          required: true
          description: no-store.
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

A successful response is the file bytes, not JSON. Download the whole file; partial transfers and resumable Range downloads are unsupported. An unavailable artifact returns `404`; an unavailable artifact service returns `executor_unavailable`.
