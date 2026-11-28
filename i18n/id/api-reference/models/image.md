---
i18nSource: 88501841ea0abd9d
title: Unified Image Run API
description: Jalankan kemampuan pembuatan dan pengeditan gambar melalui API model terpadu SandBase.
aside: false
outline: false
apiReference:
  title: Pembuatan Gambar
  operation: Models
  method: POST
  path: /v1/run
  description: Buat gambar menggunakan model AI seperti FLUX, Stable Diffusion, DALL-E, dan lainnya.
  groups:
    - title: Body permintaan
      fields:
        - name: model
          type: string
          required: true
          description: Pengenal model saat ini, misalnya bfl/flux-1/schnell.
        - name: prompt
          type: string
          required: true
          description: Deskripsi teks gambar
        - name: aspect_ratio
          type: string
          required: false
          description: Rasio aspek output. Default Flux 1 Schnell adalah 16:9.
        - name: guidance_scale
          type: number
          required: false
          description: Kekuatan panduan prompt dari 1 hingga 20.
        - name: output_format
          type: jpeg | png
          required: false
          description: Format gambar output. Default Flux 1 Schnell adalah jpeg.
        - name: mode
          type: string
          required: false
          description: Atur ke async hanya jika model yang dipilih mendukung eksekusi asinkron
        - name: webhook_url
          type: string
          required: false
          description: URL callback HTTPS publik khusus untuk tugas async ini
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"bfl/flux-1/schnell","prompt":"A futuristic city at sunset","aspect_ratio":"1:1"}'
    - label: Python
      language: python
      code: |-
        response = client.post("/v1/run", json={
            "model": "bfl/flux-1/schnell",
            "prompt": "A futuristic city at sunset, cyberpunk style",
            "aspect_ratio": "1:1"
        })
        print(response.json()["outputs"][0]["url"])
  response:
    status: 200 OK
    code: |-
      {
        "id": "run_01...",
        "status": "completed",
        "outputs": [{ "url": "https://media.sandbase.ai/images/output.png" }]
      }
---

<ApiReferencePage />
