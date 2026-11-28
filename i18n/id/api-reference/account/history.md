---
i18nSource: 06feb27e20f1b7f5
title: Menampilkan Riwayat Akun
description: Tampilkan daftar catatan eksekusi terbaru untuk organisasi pemilik kunci API.
aside: false
outline: false
apiReference:
  title: Menampilkan Riwayat Akun
  operation: Account
  method: GET
  path: /v1/account/history
  description: Tampilkan daftar catatan eksekusi terbaru dalam lingkup organisasi, dari yang terbaru. Pesan error disanitasi, dan snapshot JSON yang tersimpan dihilangkan jika tidak dapat didekode.
  groups:
    - title: Parameter query
      fields:
        - name: model
          type: string
          required: false
          description: Nama model logis yang persis.
        - name: api_key_id
          type: string
          required: false
          description: ID resource API Key yang persis.
        - name: type
          type: multimodal | llm | api
          required: false
          description: Kategori eksekusi; multimodal mencakup gambar, video, dan audio.
        - name: status
          type: completed | failure | in_progress
          required: false
          description: Status eksekusi yang dikelompokkan.
        - name: error_type
          type: string
          required: false
          description: Jenis error yang persis, atau unknown untuk catatan tanpa jenis error.
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: Rentang created-at bergulir; default 7d.
        - name: page
          type: integer
          required: false
          description: Nomor halaman, dimulai dari 1.
        - name: page_size
          type: integer
          required: false
          description: Jumlah item per halaman dari 1 hingga 100; default 20.
        - name: request_id
          type: string
          required: false
          description: ID eksekusi yang persis dalam lingkup organisasi. Jika diatur, filter lain diabaikan dan satu hasil diminta.
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: Dasar timestamp untuk jendela waktu eksplisit.
        - name: billing_scope
          type: any | positive | token
          required: false
          description: Filter settlement; positive dan token memerlukan time_basis=settled_at.
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: Awal jendela waktu (inklusif), dipasangkan dengan end_at.
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: Akhir jendela waktu (eksklusif); jendela tidak boleh melebihi 32 hari.
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: Batasi sampel latensi ke nilai positif.
        - name: min_latency_ms
          type: integer
          required: false
          description: Latensi minimum dalam milidetik.
        - name: timezone
          type: IANA time-zone name
          required: false
          description: Hanya untuk validasi kompatibilitas. Timestamp tetap dalam UTC; pencarian request_id yang persis mengabaikan parameter ini.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/account/history?range=24h&page_size=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "items": [
          {
            "id": "opaque-task-id",
            "model": "openai/gpt-5.4",
            "type": "llm",
            "execution_mode": "sync",
            "status": "completed",
            "latency_ms": 842,
            "user_cost": "0.001250",
            "prompt_tokens": 120,
            "completion_tokens": 48,
            "total_tokens": 168,
            "cached_tokens": 0,
            "cache_creation_tokens": 0,
            "created_at": "2026-08-24T00:00:00Z",
            "completed_at": "2026-08-24T00:00:01Z",
            "api_key_prefix": "sk-1234567"
          }
        ],
        "total": 1,
        "page": 1,
        "page_size": 20
      }
---

<ApiReferencePage />
