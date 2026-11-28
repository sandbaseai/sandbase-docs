---
i18nSource: 06a65ded83bf9438
title: Daftar File Workspace
description: Menampilkan daftar file workspace Session saat ini beserta path, ukuran, dan paginasi. Endpoint read-only ini mengembalikan metadata file.
aside: false
outline: false
apiReference:
  title: Daftar File Workspace
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: Menampilkan daftar path dan ukuran file saat ini dalam satu direktori workspace Session. Ini hanya daftar metadata, bukan riwayat lampiran atau isi artifact. Parameter query yang tidak dikenal atau berulang mengembalikan 400.
  groups:
    - title: Parameter path
      fields:
        - name: session_id
          type: string
          required: true
          description: ID Session (prefiks ses_).
    - title: Parameter query
      fields:
        - name: path
          type: string
          required: false
          description: Direktori absolut /workspace atau direktori ternormalisasi di bawahnya. Maksimal 4096 byte; tanpa traversal, backslash, atau garis miring di akhir.
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: Ukuran halaman dari 1 hingga 100.
          default: "20"
        - name: order
          type: string
          required: false
          description: "Urutan sortir path: asc atau desc."
          default: asc
        - name: page
          type: string
          required: false
          description: Nilai next opaque dari respons sebelumnya. Jangan kirim pada halaman pertama; jangan kirim string kosong. Pertahankan path, order, dan limit tanpa perubahan.
    - title: Field respons
      fields:
        - name: object
          type: string
          required: true
          description: Selalu page.
        - name: data
          type: array
          required: true
          description: File di direktori saat ini, masing-masing dengan path dan size_bytes. Ini bukan daftar rekursif.
        - name: next
          type: string | null
          required: true
          description: Kirim nilai ini sebagai page untuk melanjutkan; null di akhir.
        - name: has_more
          type: boolean
          required: true
          description: Apakah halaman berikutnya tersedia.
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

Pembacaan workspace dapat mengembalikan `workspace_provisioning`, `workspace_environment_missing`, `workspace_cursor_invalid`, atau `workspace_unavailable`. Jika cursor tidak valid, mulai ulang dari halaman pertama. Gunakan [Artifacts](./list-artifacts) untuk menemukan output hasil generasi yang dapat diunduh.
