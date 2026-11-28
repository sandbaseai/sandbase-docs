---
i18nSource: 096e3c57e599c5ca
title: Unggah Versi Skill
description: Mengunggah versi Skill baru.
aside: false
outline: false
apiReference:
  title: Unggah Versi Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: Mengunggah bundle ZIP baru sebagai versi berikutnya (200 OK). Struktur ZIP sama dengan Create Skill (satu folder tingkat atas yang berisi SKILL.md). Kirim default=true untuk menjadikannya versi default. Tampilkan daftar versi dengan GET /v1/skills/{skill_id}/versions, baca satu versi dengan GET /v1/skills/{skill_id}/versions/{version}, dan unduh satu versi dengan GET /v1/skills/{skill_id}/versions/{version}/content. Identifier versi berupa string.
  groups:
    - title: Parameter path
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID Skill (prefiks skl_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opsional, 1-128 byte tanpa spasi di awal atau akhir. Jika tidak dikirim, layanan akan membuatnya, sehingga permintaan yang di-retry dapat membuat duplikat. Kirim key stabil Anda sendiri untuk retry.
    - title: Body permintaan
      description: multipart/form-data.
      fields:
        - name: files
          type: file
          required: true
          description: Arsip ZIP, hingga 5 MiB.
        - name: default
          type: string
          required: false
          description: true menjadikan versi ini default untuk lampiran berikutnya; false atau tidak dikirim mempertahankan default saat ini. Binding Agent yang sudah ada tidak berubah.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: release-notes-v2" \
          -F "files=@release-notes-v2.zip;type=application/zip" \
          -F "default=true"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        with open("release-notes-v2.zip", "rb") as bundle:
            version = client.skills.versions.create(
                "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
                files=[("release-notes-v2.zip", bundle.read(), "application/zip")],
                default=True,
            )
        print(version.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "release-notes-v2",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions",
            headers=headers,
            files={"files": open("release-notes-v2.zip", "rb")},
            data={"default": "true"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        import { readFile } from 'node:fs/promises';

        const form = new FormData();
        form.append('files', new Blob([await readFile('release-notes-v2.zip')], { type: 'application/zip' }), 'release-notes-v2.zip');
        form.append('default', 'true');

        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'release-notes-v2',
          },
          body: form,
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "skill.version",
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57:2",
        "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "version": "2",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "created_at": 1791360000
      }
---

<ApiReferencePage />

## Menampilkan daftar dan mengunduh versi {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions` menerima `limit` (0-100, default 20), `order` (`asc` atau `desc`, default `desc`), dan `after`. Responsnya berisi `object: "list"`, `data`, `has_more`, `first_id`, dan `last_id`. Kirim `last_id` tanpa perubahan sebagai `after` berikutnya; nilai ini adalah ID versi berprefiks Skill, bukan sekadar nomor versi.

`GET /v1/skills/{skill_id}/versions/{version}` mengembalikan satu objek versi. Endpoint `/content` yang sesuai mengembalikan byte ZIP; lihat [contoh unduhan](./#download-a-bundle).
