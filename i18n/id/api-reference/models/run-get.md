---
i18nSource: 2ffb24dad49b9c79
title: Mendapatkan run asinkron
description: Lakukan polling run model atau API asinkron SandBase dan ambil hasil terkini atau akhirnya.
aside: false
outline: false
apiReference:
  title: Mendapatkan run asinkron
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: Ambil status terkini atau akhir dari run asinkron yang dibuat oleh POST /v1/run.
  groups:
    - title: Parameter path
      fields:
        - name: id
          type: string
          required: true
          description: Pengenal run buram yang dikembalikan oleh POST /v1/run. Gunakan persis seperti yang dikembalikan; tidak ada prefiks yang dijamin.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/run/opaque-run-id \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "completed",
        "outputs": [{"url":"https://media.sandbase.ai/files/result.png","content_type":"image/png"}]
      }
---

<ApiReferencePage />

## Polling {#polling}

Lakukan polling setiap 5–10 detik untuk tugas media atau API yang berjalan lama. Berhenti saat `status` bernilai `completed`, `failed`, atau `timeout`. Respons yang belum final dapat menghilangkan `outputs`; perlakukan ID run sebagai nilai buram dan jangan menyusun URL status yang berbeda.

