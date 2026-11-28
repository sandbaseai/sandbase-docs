---
i18nSource: a4db28360a2974cd
title: Mengedit Gambar
description: Edit gambar yang diunggah dengan API sinkron yang kompatibel dengan OpenAI Images.
aside: false
outline: false
apiReference:
  title: Mengedit Gambar
  operation: Images
  method: POST
  path: /v1/images/edits
  description: Edit satu atau beberapa gambar yang diunggah melalui endpoint multipart sinkron SandBase yang kompatibel dengan OpenAI Images.
  signature: client.images.edit(params)
  groups:
    - title: Body permintaan
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: Salah satu dari gpt-image-2, gpt-image-2.5-flare, atau gpt-image-2.5-sunburst.
        - name: prompt
          type: string
          required: true
          description: Deskripsi teks dari pengeditan yang diminta.
        - name: image
          type: file | file[]
          required: true
          description: Satu atau beberapa file gambar sumber. Ulangi field multipart untuk beberapa gambar.
        - name: mask
          type: file
          required: false
          description: Gambar mask opsional untuk inpainting.
        - name: n
          type: integer
          required: false
          description: Jumlah gambar hasil edit yang dikembalikan jika didukung.
        - name: size
          type: string
          required: false
          description: Dimensi output yang didukung model.
        - name: quality
          type: string
          required: false
          description: Kualitas output yang didukung model.
        - name: background
          type: string
          required: false
          description: Pengaturan latar belakang output.
        - name: input_fidelity
          type: string
          required: false
          description: Seberapa ketat model yang didukung mempertahankan detail gambar sumber.
        - name: output_format
          type: string
          required: false
          description: Encoding output seperti png, webp, atau jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Tingkat kompresi output dari 0 hingga 100.
        - name: user
          type: string
          required: false
          description: Pengenal pengguna akhir yang kompatibel dengan penyedia.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/edits \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -F model=gpt-image-2 \
          -F 'prompt=Turn the daytime sky into a starry night' \
          -F image=@landscape.png
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        with open("landscape.png", "rb") as image:
            result = client.images.edit(
                model="gpt-image-2",
                image=image,
                prompt="Turn the daytime sky into a starry night",
            )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 1024,
          "output_tokens": 4096,
          "total_tokens": 5120,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 1012}
        }
      }
  notes:
    - title: Unggahan multipart
      description: Kirim model, prompt, dan image sebagai multipart/form-data. Mengulang field image akan mempertahankan beberapa file sumber.
    - title: Hanya sinkron
      description: stream=true, mode=stream, dan mode=async ditolak.
  errors:
    - status: "400"
      description: Body multipart tidak valid, model tidak didukung, mode streaming, atau permintaan penyedia tidak valid.
    - status: "401"
      description: API key tidak ada atau tidak valid.
    - status: "402"
      description: Batas pengeluaran organisasi atau API Key telah tercapai.
    - status: "403"
      description: Cakupan API key tidak mengizinkan endpoint ini.
    - status: "404"
      description: Model edit gambar yang dirutekan tidak tersedia.
    - status: "429"
      description: Batas laju terlampaui.
    - status: "500"
      description: Penyimpanan permintaan atau pemrosesan respons gagal.
    - status: "502"
      description: Penyedia mengembalikan respons native yang tidak valid.
    - status: "503"
      description: Tidak ada rute penyedia yang berhasil.
---

<ApiReferencePage />

## Model yang didukung {#supported-models}
Model gambar OpenAI berikut menggunakan Images API native pada endpoint ini dan pada [`/v1/images/generations`](/api-reference/images/generations). Kirim nama model publik di `model`:

| `model` | Paling cocok untuk |
| --- | --- |
| `gpt-image-2.5-flare` | Pembuatan dan pengeditan yang cepat dan berkualitas tinggi untuk pekerjaan kreatif sehari-hari |
| `gpt-image-2.5-sunburst` | Pekerjaan yang paling mengutamakan ketepatan visual dan presisi |
| `gpt-image-2` | Generasi GPT Image sebelumnya |

Permintaan bersifat sinkron dan mengembalikan data gambar di `data` sebagai `b64_json` atau URL. Endpoint ini terpisah dari endpoint model asinkron umum `/v1/run`; halaman setiap model di [katalog model](https://www.sandbase.ai/models/image-video) mendokumentasikan kontrak tersebut beserta harganya.

Berikan `model`, `prompt`, dan setidaknya satu file `image`. Ulangi field `image` untuk menggabungkan atau mengedit beberapa gambar sumber:

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```

