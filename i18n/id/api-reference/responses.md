---
i18nSource: b5cf676d897d17a3
title: Buat Response
description: Buat respons model yang kompatibel dengan OpenAI, termasuk permintaan streaming dan yang menggunakan tools.
aside: false
outline: false
apiReference:
  title: Buat Response
  operation: Inference
  method: POST
  path: /v1/responses
  description: Buat respons model yang kompatibel dengan OpenAI. SandBase mempertahankan field permintaan setelah pemetaan model, lalu menyaring respons menjadi field OpenAI publik.
  signature: client.responses.create(params)
  groups:
    - title: Body permintaan
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identifier model dari Models API.
        - name: input
          type: string | object[]
          required: false
          description: Teks, item pesan, atau input lain yang didukung oleh model dan penyedia yang dipilih.
        - name: instructions
          type: string
          required: false
          description: Instruksi system atau developer untuk respons.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Kembalikan Server-Sent Events yang kompatibel dengan OpenAI.
        - name: background
          type: boolean
          required: false
          description: Minta eksekusi di latar belakang jika didukung oleh penyedia yang dipilih.
        - name: include
          type: string[]
          required: false
          description: Data respons publik tambahan yang disertakan jika didukung.
        - name: max_output_tokens
          type: integer
          required: false
          description: Jumlah maksimum token yang dihasilkan.
        - name: max_tool_calls
          type: integer
          required: false
          description: Jumlah maksimum panggilan tool bawaan jika didukung.
        - name: metadata
          type: object
          required: false
          description: Metadata permintaan yang diteruskan ke penyedia.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Izinkan model yang didukung memanggil tools secara paralel.
        - name: previous_response_id
          type: string
          required: false
          description: Respons sebelumnya yang dilanjutkan jika didukung oleh rute yang dipilih.
        - name: reasoning
          type: object
          required: false
          description: Konfigurasi reasoning untuk model yang didukung.
        - name: store
          type: boolean
          required: false
          description: Minta penyimpanan respons di sisi penyedia jika didukung.
        - name: text
          type: object
          required: false
          description: Konfigurasi output teks dan format terstruktur.
        - name: tool_choice
          type: string | object
          required: false
          description: Mengontrol pemilihan tool.
        - name: tools
          type: object[]
          required: false
          description: Tools yang tersedia bagi model.
        - name: truncation
          type: string
          required: false
          description: Perilaku pemotongan input.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/responses \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-5.2","input":"Explain immutable infrastructure in one sentence."}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.responses.create(
            model="openai/gpt-5.2",
            input="Explain immutable infrastructure in one sentence.",
        )
        print(response.output_text)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.responses.create({
          model: "openai/gpt-5.2",
          input: "Explain immutable infrastructure in one sentence.",
        });
        console.log(response.output_text);
  response:
    status: 200 OK
    code: |-
      {
        "id": "resp_01...",
        "object": "response",
        "status": "completed",
        "model": "openai/gpt-5.2",
        "output": [],
        "usage": {
          "input_tokens": 18,
          "output_tokens": 12,
          "total_tokens": 30,
          "input_tokens_details": {"cached_tokens": 0},
          "output_tokens_details": {"reasoning_tokens": 0}
        }
      }
  notes:
    - title: Kompatibilitas permintaan
      description: SandBase menulis ulang model menjadi model upstream yang dipilih dan mempertahankan field permintaan lainnya. Dukungan penyedia tetap bervariasi.
    - title: Respons yang disaring
      description: Hanya field respons OpenAI publik dan penggunaan token yang dikembalikan. Penagihan penyedia, akun, routing, dan ekstensi tingkat atas yang tidak dikenal dihapus; konten item output dipertahankan.
    - title: Streaming
      description: Event SSE response.* publik dan error disaring lalu diteruskan. Event privat yang tidak dikenal dibuang; data yang salah format menutup stream alih-alih meneruskan konten yang tidak aman.
  errors:
    - status: "400"
      description: JSON tidak valid, model tidak ada, atau permintaan penyedia tidak valid.
    - status: "401"
      description: API key tidak ada atau tidak valid.
    - status: "402"
      description: Batas pengeluaran organisasi atau API Key tercapai.
    - status: "403"
      description: Penolakan scope API key atau izin upstream.
    - status: "413"
      description: Penyedia upstream menolak permintaan karena terlalu besar.
    - status: "500"
      description: Siklus hidup prediksi atau pencarian organisasi gagal.
    - status: "502"
      description: Respons upstream tidak dapat di-parse dan disaring dengan aman.
    - status: "503"
      description: Routing gagal atau semua kandidat penyedia telah habis.
---

<ApiReferencePage />
