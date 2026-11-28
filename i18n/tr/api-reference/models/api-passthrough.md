---
i18nSource: fb62188053fb216d
title: API Passthrough
description: Etkin katalog API yeteneklerini sağlayıcı önekli yolları üzerinden çağırın.
aside: false
outline: false
apiReference:
  title: API Passthrough
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: vendor/upstream_path adlı etkin bir katalog yeteneğini çözümleyin ve bir JSON nesnesini birleşik SandBase işlem hattı üzerinden yürütün. GET kullanan yetenekler için GET de desteklenir.
  groups:
    - title: Yol parametreleri
      fields:
        - name: vendor
          type: string
          required: true
          description: Yetenek adının ilk segmenti.
        - name: upstream_path
          type: string
          required: true
          description: Kalan yol
          including literal slash-separated segments when present.: null
    - title: İstek gövdesi
      fields:
        - name: model
          type: string
          required: false
          description: URL'den türetilen vendor/path kimliğini kullanmak için atlayın. Sağlanırsa
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: Seçilen yeteneğin canlı şemasında tanımlanan alanlar.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"url":"https://example.com"}'
---

<ApiReferencePage />

URL, `vendor/upstream_path` adlı etkin bir modele çözümlenir. [Models API](./) tarafından döndürülen, sağlayıcı önekli tam adı kullanın. İç içe yetenek adları, yüzde kodlamalı eğik çizgiler yerine düz yol segmentleri olarak kalır.

POST yalnızca bir JSON nesnesi kabul eder. Boş bir POST gövdesine izin verilir ve URL'den türetilen modeli içeren bir nesne gibi davranır. GET boş bir gövde kullanır. Yanıt alanları ile eşzamanlı veya eşzamansız davranış seçilen yeteneğe bağlıdır; eşzamansız sonuçları `GET /v1/run/{id}` üzerinden sorgulayın.
