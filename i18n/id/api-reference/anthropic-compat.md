---
i18nSource: 04f3657850b71e58
title: Buat Pesan Anthropic
description: Membuat pesan yang kompatibel dengan Anthropic menggunakan model SandBase.
aside: false
outline: false
apiReference:
  title: Buat Pesan Anthropic
  operation: Inference
  method: POST
  path: /v1/messages
  description: Membuat pesan melalui endpoint Messages SandBase yang kompatibel dengan Anthropic. SandBase memetakan model untuk penyedia yang dipilih dan mempertahankan field permintaan serta respons yang kompatibel.
  signature: client.messages.create(params)
  groups:
    - title: Header permintaan
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "API key SandBase. Authorization: Bearer juga diterima; x-api-key diprioritaskan jika keduanya ada."
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: Versi API Anthropic yang diteruskan ke upstream. SandBase menggunakan 2023-06-01 jika tidak dikirim.
        - name: anthropic-beta
          type: string
          required: false
          description: Identifier fitur beta yang dipisahkan koma, bergantung pada kompatibilitas penyedia.
    - title: Body permintaan
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identifier model yang kompatibel dengan Anthropic.
        - name: messages
          type: object[]
          required: true
          description: Pesan user dan assistant yang berisi teks atau blok konten bertipe.
        - name: max_tokens
          type: integer
          required: true
          description: Jumlah maksimum token output.
        - name: system
          type: string | object[]
          required: false
          description: Instruksi system tingkat atas.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Temperature sampling dari 0 hingga 1.
        - name: top_p
          type: number
          required: false
          description: Ambang nucleus sampling.
        - name: top_k
          type: integer
          required: false
          description: Membatasi sampling ke K token teratas.
        - name: stop_sequences
          type: string[]
          required: false
          description: Urutan kustom yang menghentikan generasi.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Mengembalikan Server-Sent Events bergaya Anthropic.
        - name: metadata
          type: object
          required: false
          description: Metadata permintaan, termasuk user_id opsional.
        - name: tools
          type: object[]
          required: false
          description: Definisi tool yang tersedia untuk model.
        - name: tool_choice
          type: object
          required: false
          description: Mengontrol perilaku pemilihan tool.
        - name: thinking
          type: object
          required: false
          description: Konfigurasi extended thinking untuk model yang didukung.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/messages \
          -H "x-api-key: $SANDBASE_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "Content-Type: application/json" \
          -d '{"model":"anthropic/claude-sonnet-4","max_tokens":256,"messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from anthropic import Anthropic

        client = Anthropic(api_key="sk-sb-...", base_url="https://api.sandbase.ai")
        message = client.messages.create(
            model="anthropic/claude-sonnet-4",
            max_tokens=256,
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(message.content[0].text)
    - label: TypeScript
      language: typescript
      code: |-
        import Anthropic from "@anthropic-ai/sdk";

        const client = new Anthropic({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai" });
        const message = await client.messages.create({
          model: "anthropic/claude-sonnet-4",
          max_tokens: 256,
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "msg_01...",
        "type": "message",
        "role": "assistant",
        "model": "anthropic/claude-sonnet-4",
        "content": [{ "type": "text", "text": "Hello! How can I help?" }],
        "stop_reason": "end_turn",
        "usage": { "input_tokens": 8, "output_tokens": 7 }
      }
  notes:
    - title: Autentikasi
      description: "Gunakan x-api-key atau Authorization: Bearer. Jika keduanya dikirim, x-api-key diprioritaskan."
    - title: Protokol transparan
      description: Selain pemetaan model dan aturan kompatibilitas penyedia yang dikonfigurasi, SandBase meneruskan field permintaan yang kompatibel, respons non-stream, dan event SSE tanpa translasi protokol.
    - title: Fitur beta
      description: anthropic-beta diteruskan jika ada. Aturan kompatibilitas suatu kandidat dapat menghapus field beta yang tidak didukung atau melewati kandidat tersebut.
  errors:
    - status: "400"
      description: Body permintaan tidak valid atau fitur tidak didukung.
    - status: "401"
      description: API key tidak ada atau tidak valid.
    - status: "402"
      description: Batas pengeluaran organisasi tercapai.
    - status: "403"
      description: Batas pengeluaran API Key tercapai atau izin organisasi gagal.
    - status: "404"
      description: Model tidak ditemukan atau tidak tersedia.
    - status: "413"
      description: Penyedia menolak permintaan karena terlalu besar.
    - status: "429"
      description: Batas laju penyedia terlampaui.
    - status: "500"
      description: Error lifecycle prediksi atau error penyedia.
    - status: "502"
      description: Stream upstream berakhir sebelum ada konten yang dapat digunakan.
    - status: "503"
      description: Routing gagal atau semua kandidat penyedia tidak tersedia.
---

<ApiReferencePage />
