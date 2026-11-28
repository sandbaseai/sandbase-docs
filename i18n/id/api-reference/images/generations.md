---
i18nSource: 39ce638efc41350d
title: Membuat Gambar
description: Buat gambar dengan API sinkron yang kompatibel dengan OpenAI Images.
aside: false
outline: false
apiReference:
  title: Membuat Gambar
  operation: Images
  method: POST
  path: /v1/images/generations
  description: Buat gambar melalui endpoint sinkron SandBase yang kompatibel dengan OpenAI Images. Endpoint ini berbeda dari API model umum /v1/run.
  signature: client.images.generate(params)
  groups:
    - title: Body permintaan
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: Salah satu dari gpt-image-2, gpt-image-2.5-flare, atau gpt-image-2.5-sunburst.
        - name: prompt
          type: string
          required: true
          description: Deskripsi teks gambar yang akan dibuat.
        - name: n
          type: integer
          required: false
          description: Jumlah gambar yang dibuat jika didukung.
        - name: size
          type: string
          required: false
          description: Dimensi output yang didukung oleh model.
        - name: quality
          type: string
          required: false
          description: Kualitas output seperti low, medium, high, atau auto.
        - name: background
          type: string
          required: false
          description: Pengaturan latar belakang seperti transparent, opaque, atau auto.
        - name: output_format
          type: string
          required: false
          description: Encoding output seperti png, webp, atau jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Tingkat kompresi output dari 0 hingga 100.
        - name: moderation
          type: string
          required: false
          description: Pengaturan moderasi yang kompatibel dengan penyedia.
        - name: user
          type: string
          required: false
          description: Pengenal pengguna akhir yang kompatibel dengan penyedia.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/generations \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"gpt-image-2","prompt":"A paper-cut city floating above the clouds","size":"1024x1024"}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        result = client.images.generate(
            model="gpt-image-2",
            prompt="A paper-cut city floating above the clouds",
            size="1024x1024",
        )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 12,
          "output_tokens": 4096,
          "total_tokens": 4108,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 0}
        }
      }
  notes:
    - title: Hanya sinkron
      description: stream=true, mode=stream, dan mode=async ditolak. Gunakan array data yang dikembalikan secara langsung.
    - title: Field yang kompatibel
      description: Field JSON tambahan diteruskan tanpa perubahan, tetapi dukungannya tetap bergantung pada model dan penyedia.
  errors:
    - status: "400"
      description: JSON tidak valid, model tidak didukung, mode streaming, atau permintaan ke penyedia.
    - status: "401"
      description: Kunci API tidak ada atau tidak valid.
    - status: "402"
      description: Batas pengeluaran organisasi atau API Key telah tercapai.
    - status: "403"
      description: Cakupan kunci API tidak mengizinkan endpoint ini.
    - status: "404"
      description: Model gambar tujuan routing tidak tersedia.
    - status: "429"
      description: Batas rate terlampaui.
    - status: "500"
      description: Penyimpanan permintaan atau pemrosesan respons gagal.
    - status: "502"
      description: Penyedia mengembalikan respons native yang tidak valid.
    - status: "503"
      description: Tidak ada rute penyedia yang berhasil.
---

<ApiReferencePage />

## Model yang didukung {#supported-models}
Model gambar OpenAI berikut menggunakan Images API native pada endpoint ini. Kirim nama model publik di `model`:

| `model` | Paling cocok untuk |
| --- | --- |
| `gpt-image-2.5-flare` | Pembuatan dan pengeditan cepat berkualitas tinggi untuk pekerjaan kreatif sehari-hari |
| `gpt-image-2.5-sunburst` | Pekerjaan yang paling mengutamakan fidelitas visual dan presisi |
| `gpt-image-2` | Generasi GPT Image sebelumnya |

Permintaan bersifat sinkron dan mengembalikan data gambar di `data` sebagai `b64_json` atau URL. Endpoint ini terpisah dari endpoint model asinkron umum `/v1/run`; halaman setiap model di [katalog model](https://www.sandbase.ai/models/image-video) mendokumentasikan kontrak tersebut beserta harganya.

Untuk mengedit gambar, kirim `multipart/form-data` ke [`POST /v1/images/edits`](/api-reference/images/edits) dengan nama model yang sama.
