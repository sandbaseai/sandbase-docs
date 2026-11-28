---
i18nSource: 096e3c57e599c5ca
title: Skill Sürümü Yükle
description: Yeni bir Skill sürümü yükleyin.
aside: false
outline: false
apiReference:
  title: Skill Sürümü Yükle
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: Yeni bir ZIP paketini sonraki sürüm olarak yükleyin (200 OK). ZIP düzeni Skill Oluştur ile aynıdır (SKILL.md içeren tek bir üst düzey klasör). Varsayılan sürüm yapmak için default=true gönderin. Sürümleri GET /v1/skills/{skill_id}/versions ile listeleyin, birini GET /v1/skills/{skill_id}/versions/{version} ile okuyun ve GET /v1/skills/{skill_id}/versions/{version}/content ile indirin. Sürüm tanımlayıcıları dizedir.
  groups:
    - title: Yol parametreleri
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill kimliği (skl_ önekli).
    - title: Header'lar
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: İsteğe bağlı, başında veya sonunda boşluk olmadan 1-128 bayt. Gönderilmezse servis bir anahtar üretir; bu nedenle yeniden denenen bir istek kopya oluşturabilir. Yeniden denemeler için kendi sabit anahtarınızı gönderin.
    - title: İstek gövdesi
      description: multipart/form-data.
      fields:
        - name: files
          type: file
          required: true
          description: En fazla 5 MiB boyutunda ZIP arşivi.
        - name: default
          type: string
          required: false
          description: true, bunu gelecekteki eklemeler için varsayılan yapar; false veya gönderilmemesi mevcut varsayılanı korur. Mevcut Agent bağlamaları değişmez.
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

## Sürümleri listeleme ve indirme {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions`; `limit` (0-100, varsayılan 20), `order` (`asc` veya `desc`, varsayılan `desc`) ve `after` parametrelerini kabul eder. Yanıtı `object: "list"`, `data`, `has_more`, `first_id` ve `last_id` içerir. `last_id` değerini değiştirmeden sonraki `after` olarak gönderin; bu, yalın sürüm numarası değil, Skill önekli bir sürüm kimliğidir.

`GET /v1/skills/{skill_id}/versions/{version}` tek bir sürüm nesnesi döndürür. İlgili `/content` endpoint'i ZIP baytlarını döndürür; [indirme örneğine](./#download-a-bundle) bakın.
