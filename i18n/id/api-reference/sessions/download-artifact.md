---
i18nSource: faccf5122e785ea0
title: Unduh Artifact Session
description: Unduh artifact Session yang tertangkap berdasarkan ID. Pelajari batas unduhan file lengkap, jenis respons yang didukung, dan perilaku Range.
aside: false
outline: false
apiReference:
  title: Unduh Artifact Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: Unduh artifact lengkap yang tidak dapat diubah menggunakan ID-nya dari List Session Artifacts. File hingga 200 MiB didukung. Parameter query tidak diterima; permintaan Range mengembalikan 416 setelah validasi akses.
  groups:
    - title: Parameter path
      fields:
        - name: session_id
          type: string
          required: true
          description: ID Session (prefiks ses_).
        - name: artifact_id
          type: string
          required: true
          description: ID art_ opaque persis seperti yang dikembalikan oleh daftar artifact Session ini. ID lampiran dan path workspace tidak diterima.
    - title: Header respons
      fields:
        - name: Content-Type
          type: string
          required: true
          description: Media type yang disimpulkan dari ekstensi file, atau application/octet-stream.
        - name: Content-Disposition
          type: string
          required: true
          description: attachment dengan nama file artifact.
        - name: Content-Length
          type: integer
          required: true
          description: Ukuran file lengkap dalam byte.
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

Respons yang berhasil berupa byte file, bukan JSON. Unduh seluruh file; transfer parsial dan unduhan Range yang dapat dilanjutkan tidak didukung. Artifact yang tidak tersedia mengembalikan `404`; layanan artifact yang tidak tersedia mengembalikan `executor_unavailable`.
