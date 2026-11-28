---
i18nSource: 06a65ded83bf9438
title: Çalışma Alanı Dosyalarını Listele
description: Mevcut Session çalışma alanı dosyalarını yol, boyut ve sayfalamayla listeleyin. Bu salt okunur endpoint dosya metadata'sı döndürür.
aside: false
outline: false
apiReference:
  title: Çalışma Alanı Dosyalarını Listele
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: Bir Session çalışma alanı dizinindeki mevcut dosya yollarını ve boyutlarını listeleyin. Bu yalnızca metadata içeren bir listedir; ek geçmişi veya artifact içeriği değildir. Bilinmeyen veya tekrarlanan sorgu parametreleri 400 döndürür.
  groups:
    - title: Yol parametreleri
      fields:
        - name: session_id
          type: string
          required: true
          description: Session kimliği (ses_ önekli).
    - title: Sorgu parametreleri
      fields:
        - name: path
          type: string
          required: false
          description: Mutlak /workspace dizini veya onun altındaki normalize edilmiş bir dizin. En fazla 4096 bayt; dizin geçişi (traversal), ters eğik çizgi veya sondaki eğik çizgi kullanılamaz.
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: 1 ile 100 arasında sayfa boyutu.
          default: "20"
        - name: order
          type: string
          required: false
          description: "Yol sıralama düzeni: asc veya desc."
          default: asc
        - name: page
          type: string
          required: false
          description: Önceki yanıttan gelen opak next değeri. İlk sayfada göndermeyin; boş dize göndermeyin. path, order ve limit değerlerini değiştirmeyin.
    - title: Yanıt alanları
      fields:
        - name: object
          type: string
          required: true
          description: Her zaman page.
        - name: data
          type: array
          required: true
          description: Her biri path ve size_bytes içeren, mevcut dizindeki dosyalar. Bu özyinelemeli bir liste değildir.
        - name: next
          type: string | null
          required: true
          description: Devam etmek için bu değeri page olarak gönderin; sonda null olur.
        - name: has_more
          type: boolean
          required: true
          description: Başka bir sayfanın olup olmadığı.
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

Çalışma alanı okumaları `workspace_provisioning`, `workspace_environment_missing`, `workspace_cursor_invalid` veya `workspace_unavailable` döndürebilir. Cursor geçersizse ilk sayfadan yeniden başlayın. İndirilebilir üretilmiş çıktıları bulmak için [Artifacts](./list-artifacts) kullanın.
