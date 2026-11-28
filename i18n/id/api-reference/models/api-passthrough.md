---
i18nSource: fb62188053fb216d
title: API Passthrough
description: Panggil kapabilitas API katalog yang aktif melalui path lengkap dengan vendornya.
aside: false
outline: false
apiReference:
  title: API Passthrough
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: Resolve kapabilitas katalog aktif bernama vendor/upstream_path dan eksekusi objek JSON melalui pipeline terpadu SandBase. GET juga didukung untuk kapabilitas yang menggunakannya.
  groups:
    - title: Parameter path
      fields:
        - name: vendor
          type: string
          required: true
          description: Segmen pertama nama kapabilitas.
        - name: upstream_path
          type: string
          required: true
          description: Sisa path
          including literal slash-separated segments when present.: null
    - title: Body permintaan
      fields:
        - name: model
          type: string
          required: false
          description: Hilangkan untuk menggunakan identitas vendor/path dari URL. Jika diberikan
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: Field yang didefinisikan oleh skema live kapabilitas yang dipilih.
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

URL ini me-resolve model aktif bernama `vendor/upstream_path`. Gunakan nama lengkap dengan vendor persis seperti yang dikembalikan oleh [Models API](./). Nama kapabilitas bertingkat tetap berupa segmen path literal, bukan garis miring yang di-percent-encode.

POST hanya menerima objek JSON. Body POST kosong diperbolehkan dan diperlakukan seperti objek yang berisi model dari URL. GET menggunakan body kosong. Field respons serta perilaku sinkron atau asinkron bergantung pada kapabilitas yang dipilih; lakukan polling hasil asinkron melalui `GET /v1/run/{id}`.

