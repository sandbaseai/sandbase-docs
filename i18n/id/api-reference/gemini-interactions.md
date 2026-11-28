---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: Buat, stream, dan polling Interaction model melalui protokol Google native.
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: Membuat Interaction Google native. Periksa status meskipun mendapat HTTP 200; respons in_progress harus di-polling.
  groups:
    - title: Body permintaan
      fields:
        - name: model
          type: string
          required: true
          description: Nama model logis SandBase.
        - name: input
          type: string | object | array
          required: true
          description: Input Interaction Google native.
        - name: stream
          type: boolean
          required: false
          description: Mengembalikan event SSE Google Interactions jika didukung oleh model.
        - name: background
          type: boolean
          required: false
          description: Mengirim secara durable dan mengembalikan Interaction yang dapat langsung di-polling. Tidak dapat digabungkan dengan stream.
        - name: previous_interaction_id
          type: string
          required: false
          description: Melanjutkan dari Interaction upstream sambil mempertahankan provider affinity.
        - name: store
          type: boolean
          required: false
          description: Meneruskan preferensi penyimpanan upstream tanpa perubahan.
        - name: system_instruction
          type: string
          required: false
          description: Instruksi system native.
        - name: tools
          type: array
          required: false
          description: Definisi tool Google native.
        - name: generation_config
          type: object
          required: false
          description: Konfigurasi generasi native.
        - name: response_format
          type: object | array
          required: false
          description: Format respons yang diminta.
        - name: response_modalities
          type: array
          required: false
          description: Modalitas output yang diminta.
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## Autentikasi {#authentication}

Gunakan `x-goog-api-key`, `Authorization: Bearer …`, atau parameter query `key`, dengan urutan prioritas tersebut. Sebaiknya gunakan header karena kredensial di query string dapat tercatat di log.

## Model yang didukung {#supported-models}

Endpoint Interactions bukan rute generik untuk setiap model yang nama katalognya diawali `google/`. Model
harus memiliki pemetaan penyedia yang kompatibel dengan Interactions. Saat ini SandBase mendokumentasikan model kompatibel berikut:

- Gemini Omni Flash Preview: `google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview: `google/gemini-omni-1.1-flash-preview`

Model Google lainnya menggunakan endpoint lain. Misalnya, Nano Banana Pro dan Nano Banana 2 menggunakan
[`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content), bukan `/v1beta/interactions`. Model yang tidak didukung akan gagal alih-alih dirutekan
melalui protokol Google yang berbeda.

## Keberhasilan dan polling {#success-and-polling}

Pengiriman yang berhasil mengembalikan HTTP `200`, termasuk pekerjaan background dan permintaan sinkron yang batas waktu tunggunya habis. Selalu periksa `status`:

- `completed`, `failed`, `cancelled`, dan `incomplete` adalah status akhir.
- `in_progress` masih berjalan. Lakukan polling `GET /v1beta/interactions/{id}`; respons juga dapat menyertakan path tersebut di header `Location`.
- `requires_action` adalah status protokol, tetapi saat ini SandBase belum menyediakan endpoint konfirmasi tool yang diperlukan untuk melanjutkannya.

ID polling adalah `id` Interaction upstream yang dikembalikan oleh `POST`, bukan ID prediksi SandBase. API key SandBase yang sama dengan yang membuat Interaction harus digunakan untuk mengambilnya.

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

Respons GET yang belum mencapai status akhir tidak menyertakan output parsial dan penggunaan. Respons status akhir dapat menyertakan data gambar, audio, atau video inline dan bisa berukuran beberapa megabyte. Segera unduh dan simpan media yang diperlukan: setelah masa retensi upstream berakhir, SandBase hanya dapat mengembalikan fallback status akhir yang tidak lengkap berisi struktur dan metadata, bukan byte media asli.

## Streaming {#streaming}

Atur `stream: true` di body permintaan. Responsnya berupa `text/event-stream`; `?alt=sse` tidak digunakan oleh protokol ini. Tipe event dan delta bersifat terbuka dan diteruskan tanpa allowlist tetap, sehingga klien harus dapat menoleransi nilai yang tidak dikenal. Setelah header streaming ditulis, kegagalan dikirim sebagai event `error`, bukan status HTTP yang berbeda.

Streaming bergantung pada model. Penyedia upstream dapat menolak `stream: true` meskipun protokol mendukungnya.

## Batasan saat ini {#current-limits}

Saat ini SandBase hanya menyediakan create dan get:

- Agent Interactions ditolak; gunakan `model`.
- `background: true` dan `stream: true` tidak dapat digabungkan.
- List, delete, dan cancel Interaction tidak disediakan.
- Pengiriman URI dan koneksi ulang stream berbasis GET tidak disediakan.
- `previous_interaction_id` memerlukan pemetaan provider-affinity yang masih aktif dan dukungan upstream. SandBase akan gagal alih-alih diam-diam berganti penyedia jika affinity tidak tersedia.

Error menggunakan amplop Google `{ "error": { "code", "message", "status" } }`. Anggap status HTTP sebagai nilai yang stabil; teks upstream yang telah disanitasi di `message` dapat berubah.
