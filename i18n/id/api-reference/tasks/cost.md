---
i18nSource: 6f238c169e0f931d
title: Mengambil Biaya Tugas
description: Ambil status settlement, biaya akhir, dan penggunaan token untuk tugas terbaru yang dibuat oleh kunci API yang sama.
aside: false
outline: false
apiReference:
  title: Mengambil Biaya Tugas
  operation: Tasks
  method: GET
  path: /v1/tasks/{task_id}/cost
  description: Ambil status settlement asinkron, biaya akhir, dan penggunaan token untuk tugas SandBase terbaru.
  groups:
    - title: Parameter path
      fields:
        - name: task_id
          type: string
          required: true
          description: ID tugas opaque yang dikembalikan oleh operasi berbayar, termasuk header respons x-task-id jika ada.
    - title: Respons
      fields:
        - name: settled
          type: boolean
          required: true
          description: Apakah settlement biaya akhir telah selesai. cost belum final hingga nilainya true.
        - name: cost · estimated_cost
          type: string
          required: true
          description: Jumlah USD dengan enam angka desimal. estimated_cost adalah referensi perkiraan terbaik sebelum settlement.
        - name: usage
          type: object
          required: true
          description: Jumlah token yang dicatat untuk tugas tersebut.
        - name: pricing
          type: object
          required: false
          description: "Setelah settlement, jika diskon dicatat: original_cost, discount_amount, discount_percent, dan discount_type opsional. original_cost dikurangi discount_amount sama dengan cost."
  examples:
    - label: HTTP
      language: http
      code: "Authorization: Bearer sk-YOUR_API_KEY"
    - label: cURL
      language: bash
      code: |-
        curl -sS \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          "https://api.sandbase.ai/v1/tasks/$TASK_ID/cost" | jq .
  response:
    status: 200 OK
    code: |-
      {
        "id": "f3d2e8a1-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
        "status": "completed",
        "settled": true,
        "currency": "USD",
        "cost": "0.001234",
        "estimated_cost": "0.001234",
        "usage": {
          "prompt_tokens": 1000,
          "completion_tokens": 200,
          "total_tokens": 1200,
          "cached_tokens": 800,
          "cache_creation_tokens": 0,
          "reasoning_tokens": 0
        }
      }
---

<ApiReferencePage />
