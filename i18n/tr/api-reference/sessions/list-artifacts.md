---
i18nSource: 270917aea416aa76
title: Session Artifact'larını Listeleme
description: Yakalanmış Session çıktı artifact'larını imleç tabanlı sayfalama, opak kimlikler, dosya boyutları ve indirme bağlantılarıyla listeleyin.
aside: false
outline: false
apiReference:
  title: Session Artifact'larını Listeleme
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: Bu Session için üretilmiş değiştirilemez çıktıları listeler. Artifact kimlikleri opak, Session kapsamlı tanıtıcılardır; döndürülen kimliği indirme uç noktasına değiştirmeden gönderin. Bilinmeyen veya tekrarlanan sorgu parametreleri 400 döndürür.
  groups:
    - title: Yol parametreleri
      fields:
        - name: session_id
          type: string
          required: true
          description: Session kimliği (ses_ önekli).
    - title: Sorgu parametreleri
      fields:
        - name: limit
          type: integer
          required: false
          description: 1 ile 100 arasında sayfa boyutu; geçersiz değerler 400 döndürür.
          default: "20"
        - name: order
          type: string
          required: false
          description: asc veya desc.
          default: desc
        - name: after
          type: string
          required: false
          description: Önceki sayfada last_id olarak döndürülen artifact kimliği. Devam ederken aynı sıralamayı koruyun.
    - title: Artifact nesnesi
      fields:
        - name: object
          type: string
          required: true
          description: Her zaman agent.session.artifact.
        - name: id
          type: string
          required: true
          description: Opak art_ tanıtıcısı. Bunu oluşturmaya veya çözmeye çalışmayın.
        - name: session_id
          type: string
          required: true
          description: Sahip Session kimliği.
        - name: path
          type: string
          required: true
          description: /workspace/outputs/ altındaki üretilmiş çıktı yolu.
        - name: size_bytes
          type: integer
          required: true
          description: Bayt cinsinden artifact boyutu.
        - name: created_at
          type: integer
          required: true
          description: Unix saniyesi cinsinden oluşturulma zaman damgası.
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

Örnekteki tanıtıcı yalnızca açıklama amaçlıdır. [Artifact İndirme](./download-artifact) için kendi isteğinizin döndürdüğü `id` değerini kullanın. `has_more` true olduğunda sonraki sayfa için `after=last_id` gönderin. Boş bir listede `first_id` ve `last_id` null olur. Ayrı bir artifact meta verisi GET uç noktası sunulmaz.
