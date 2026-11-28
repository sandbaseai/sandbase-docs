---
i18nSource: 270917aea416aa76
title: Daftar Artifact Session
description: Cantumkan artifact output Session yang tertangkap dengan paginasi cursor, ID opaque, ukuran file, dan tautan unduhan.
aside: false
outline: false
apiReference:
  title: Daftar Artifact Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: Cantumkan output yang dihasilkan dan tidak dapat diubah untuk Session ini. ID artifact adalah handle opaque dengan cakupan Session; teruskan ID yang dikembalikan tanpa perubahan ke endpoint unduhan. Parameter query yang tidak dikenal atau berulang mengembalikan 400.
  groups:
    - title: Parameter path
      fields:
        - name: session_id
          type: string
          required: true
          description: ID Session (prefiks ses_).
    - title: Parameter query
      fields:
        - name: limit
          type: integer
          required: false
          description: Ukuran halaman dari 1 hingga 100; nilai yang tidak valid mengembalikan 400.
          default: "20"
        - name: order
          type: string
          required: false
          description: asc atau desc.
          default: desc
        - name: after
          type: string
          required: false
          description: ID artifact yang dikembalikan sebagai last_id pada halaman sebelumnya. Pertahankan order yang sama saat melanjutkan.
    - title: Objek Artifact
      fields:
        - name: object
          type: string
          required: true
          description: Selalu agent.session.artifact.
        - name: id
          type: string
          required: true
          description: Handle art_ opaque. Jangan membuat atau men-decode-nya.
        - name: session_id
          type: string
          required: true
          description: ID Session pemilik.
        - name: path
          type: string
          required: true
          description: Path output yang dihasilkan di bawah /workspace/outputs/.
        - name: size_bytes
          type: integer
          required: true
          description: Ukuran artifact dalam byte.
        - name: created_at
          type: integer
          required: true
          description: Timestamp pembuatan dalam detik Unix.
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

Handle pada contoh hanya ilustrasi. Gunakan `id` yang dikembalikan oleh permintaan Anda sendiri untuk [Download Artifact](./download-artifact). Jika `has_more` bernilai true, kirim `after=last_id` untuk halaman berikutnya. `first_id` dan `last_id` bernilai null untuk daftar kosong. Endpoint GET metadata artifact terpisah tidak disediakan.
