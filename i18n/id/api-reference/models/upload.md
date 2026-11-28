---
i18nSource: e047946a41e1be8b
title: Mengunggah Media
description: Unggah file gambar, audio, atau video untuk digunakan sebagai input model.
aside: false
outline: false
apiReference:
  title: Mengunggah Media
  operation: Assets
  method: POST
  path: /v1/upload
  description: Unggah file gambar, audio, atau video dan terima URL tersimpan untuk input model yang didukung.
  groups:
    - title: Form multipart
      fields:
        - name: file
          type: binary
          required: true
          description: Gambar hingga 20 MB, audio hingga 50 MB, atau video hingga 500 MB. Format yang didukung tercantum di bawah.
        - name: type
          type: image | audio | video
          required: false
          description: Petunjuk kategori opsional. Deteksi MIME dari file tetap menentukan validasi.
    - title: Tipe MIME yang didukung
      fields:
        - name: Image
          type: string
          required: false
          description: image/jpeg, image/png, image/webp, image/gif — maksimum 20 MB.
        - name: Audio
          type: string
          required: false
          description: audio/mpeg, audio/mp4, audio/wav, audio/x-wav, audio/ogg, audio/aac, audio/flac — maksimum 50 MB.
        - name: Video
          type: string
          required: false
          description: video/mp4, video/quicktime, video/webm — maksimum 500 MB.
    - title: Respons
      fields:
        - name: url
          type: string
          required: true
          description: URL media tersimpan untuk diberikan ke input model yang didukung.
        - name: filename · size
          type: string · integer
          required: true
          description: Nama file multipart asli dan ukuran file dalam byte.
        - name: type · content_type
          type: string
          required: true
          description: Tipe MIME terdeteksi yang digunakan saat menyimpan file.
        - name: duration_seconds
          type: number
          required: false
          description: "Hanya audio dan video: durasi media dalam detik, jika dapat dibaca dari file."
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/upload \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -F "file=@reference.mp4" \
          -F "type=video"
  response:
    status: 200 OK
    code: |-
      {
        "url": "https://media.sandbase.ai/uploads/2026/08/550e8400-e29b-41d4-a716-446655440000.mp4",
        "filename": "reference.mp4",
        "size": 1048576,
        "type": "video/mp4",
        "content_type": "video/mp4",
        "duration_seconds": 5.04
      }
  notes:
    - title: Deteksi MIME
      description: Server mendeteksi tipe file dari byte dan nama filenya. Field type opsional tidak memaksakan tipe MIME.
---

<ApiReferencePage />
