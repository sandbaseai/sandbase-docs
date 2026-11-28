---
i18nSource: efa205ed7505643c
title: Menjalankan model atau kapabilitas API
description: Kirim model atau kapabilitas API SandBase melalui endpoint run terpadu.
aside: false
outline: false
apiReference:
  title: Menjalankan model atau kapabilitas API
  operation: Models
  method: POST
  path: /v1/run
  description: Eksekusi model atau kapabilitas API SandBase yang aktif. Field permintaan bersifat khusus kapabilitas; gunakan halaman referensi model atau API di situs SandBase untuk skema kapabilitas yang dipilih.
  groups:
    - title: Body permintaan
      fields:
        - name: model
          type: string
          required: true
          description: Identifier model logis atau kapabilitas API yang aktif.
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: Petunjuk mode eksekusi. `auto` menggunakan default yang dikonfigurasi untuk kapabilitas yang dipilih; nilai lain memerlukan dukungan kapabilitas.
        - name: stream
          type: boolean
          required: false
          description: "Minta output streaming jika kapabilitas yang dipilih mendukungnya. Setara dengan `mode: stream`."
        - name: webhook_url
          type: string
          required: false
          description: Callback HTTPS opsional untuk gambar asinkron yang didukung
          video: null
          or audio tasks. See the Webhooks reference for validation and delivery behavior.: null
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## Eksekusi dan hasil {#execution-and-results}

Kapabilitas sinkron mengembalikan respons yang sudah selesai pada permintaan awal. Kapabilitas asinkron mengembalikan `202 Accepted` dengan `id` opaque; lakukan polling [Mendapatkan run asinkron](./run-get) hingga statusnya terminal.

Field permintaan dan bentuk output yang khusus kapabilitas didefinisikan di halaman operasi model atau API yang dipilih. Kirim field tersebut di tingkat atas body JSON; jangan membungkusnya dalam objek `input`. Jangan berasumsi setiap kapabilitas menerima parameter yang sama.

## Callback webhook {#webhook-callbacks}

Atur `webhook_url` hanya untuk tugas gambar, video, atau audio asinkron yang didukung. SandBase mengirim event run akhir ke endpoint HTTPS setelah selesai atau gagal; callback ini hanya petunjuk pengiriman, bukan pengganti `GET /v1/run/{id}`. Tetap lakukan polling ke endpoint run untuk status yang otoritatif dan coba ulang dengan aman jika callback tertunda atau terduplikasi. Respons model sinkron dan endpoint native penyedia tidak menggunakan field callback ini.
