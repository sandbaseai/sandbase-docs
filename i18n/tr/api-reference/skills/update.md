---
i18nSource: 996f166544016111
title: Skill Güncelle
description: Bir Skill'in varsayılan sürümünü, durumunu veya metadata'sını değiştirin.
aside: false
outline: false
apiReference:
  title: Skill Güncelle
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: default_version, status veya market metadata'sını değiştirin. metadata gönderildiğinde row_version zorunludur; aksi halde mevcut değer kullanılır.
  groups:
    - title: Yol parametreleri
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill kimliği (skl_ önekli).
    - title: İstek gövdesi
      description: JSON nesnesi.
      fields:
        - name: default_version
          type: string
          required: false
          description: Bu Skill açık bir sürüm belirtilmeden ilk kez eklendiğinde kullanılan varsayılan. Mevcut Agent bağlamaları sabitlenmiş sürümlerini korur.
        - name: status
          type: string
          required: false
          description: active veya disabled.
        - name: metadata
          type: object | null
          required: false
          description: Yalnızca market ad alanı altındaki sunum metadata'sı (en fazla 16 KiB). row_version gerektirir; metadata nesnesinin yerini alır. Bilinmeyen ad alanları veya alanlar 400 döndürür. Aşağıdaki metadata örneğine bakın.
        - name: row_version
          type: integer
          required: false
          description: Skill Al isteğinden gelen güncel row_version. Eski bir değer 409 conflict döndürür; metadata gönderildiğinde zorunludur.
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

## Metadata örneği {#metadata-example}

Güncel `row_version` değerini eksiksiz metadata nesnesiyle birlikte gönderin:

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

Market metadata'sı Skill'i görüntüleme amacıyla tanımlar. Bir sunucu kurmaz, kimlik bilgisi vermez veya Agent'ın MCP seçimini değiştirmez. `metadata: {}` veya `metadata: null` onu temizler; ikisi de yine `row_version` gerektirir.
