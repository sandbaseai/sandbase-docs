---
i18nSource: 996f166544016111
title: Perbarui Skill
description: Mengubah versi default, status, atau metadata Skill.
aside: false
outline: false
apiReference:
  title: Perbarui Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: Mengubah default_version, status, atau metadata market. row_version wajib jika metadata dikirim; jika tidak, nilai saat ini yang digunakan.
  groups:
    - title: Parameter path
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID Skill (prefiks skl_).
    - title: Body permintaan
      description: Objek JSON.
      fields:
        - name: default_version
          type: string
          required: false
          description: Default yang digunakan saat pertama kali melampirkan Skill ini tanpa versi eksplisit. Binding Agent yang sudah ada tetap memakai versi yang dikuncinya.
        - name: status
          type: string
          required: false
          description: active atau disabled.
        - name: metadata
          type: object | null
          required: false
          description: Metadata tampilan hanya di bawah namespace market (hingga 16 KiB). Memerlukan row_version; menggantikan objek metadata. Namespace atau field yang tidak dikenal mengembalikan 400. Lihat contoh metadata di bawah.
        - name: row_version
          type: integer
          required: false
          description: row_version saat ini dari Get Skill. Nilai yang usang mengembalikan 409 conflict; wajib jika metadata ada.
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

## Contoh metadata {#metadata-example}

Kirim `row_version` saat ini bersama objek metadata lengkap:

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

Metadata market mendeskripsikan Skill untuk ditampilkan. Metadata ini tidak menginstal server, tidak memberikan kredensial, dan tidak mengubah pilihan MCP milik Agent. `metadata: {}` atau `metadata: null` akan mengosongkannya; keduanya tetap memerlukan `row_version`.
