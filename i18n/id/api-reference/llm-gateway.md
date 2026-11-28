---
i18nSource: 9ee3d6d77d12e944
title: API Chat Completions
description: Buat chat completion yang kompatibel dengan OpenAI menggunakan model bahasa dan vision SandBase.
aside: false
outline: false
apiReference:
  title: Membuat Chat Completion
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: Buat chat completion yang kompatibel dengan OpenAI menggunakan model chat SandBase apa pun yang didukung. Field yang kompatibel dengan penyedia dipertahankan jika didukung oleh rute yang dipilih.
  signature: client.chat.completions.create(params)
  groups:
    - title: Body permintaan
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Pengenal model dari Models API.
        - name: messages
          type: object[]
          required: true
          description: Pesan percakapan menggunakan peran yang didukung oleh penyedia yang dipilih, umumnya system, developer, user, assistant, atau tool.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Temperature sampling dari 0 hingga 2.
        - name: top_p
          type: number
          required: false
          default: "1"
          description: Ambang nucleus sampling.
        - name: max_tokens
          type: integer
          required: false
          description: Jumlah maksimum token output.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Kembalikan Server-Sent Events secara bertahap.
        - name: stop
          type: string | string[]
          required: false
          description: Satu atau beberapa urutan yang menghentikan pembuatan.
        - name: tools
          type: object[]
          required: false
          description: Definisi fungsi yang tersedia untuk model.
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: Mengontrol apakah tool dipilih dan tool mana yang dipilih.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Izinkan model yang didukung memancarkan beberapa panggilan tool dalam satu turn.
        - name: user
          type: string
          required: false
          description: Pengenal pengguna akhir yang kompatibel dengan penyedia.
        - name: response_format
          type: object
          required: false
          description: Konfigurasi output JSON object atau JSON Schema.
        - name: reasoning_effort
          type: string
          required: false
          description: Pengaturan reasoning effort yang kompatibel dengan penyedia.
        - name: reasoning
          type: object
          required: false
          description: Konfigurasi reasoning seperti effort atau max_tokens.
        - name: thinking
          type: object
          required: false
          description: Konfigurasi thinking seperti type atau budget_tokens.
        - name: extra_body
          type: object
          required: false
          description: Parameter khusus penyedia untuk rute yang memerlukan penerjemahan protokol.
        - name: n
          type: integer
          required: false
          default: "1"
          description: Jumlah pilihan completion yang dibuat.
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: Presence penalty dari -2 hingga 2.
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: Frequency penalty dari -2 hingga 2.
        - name: stream_options
          type: object
          required: false
          description: Opsi streaming seperti include_usage.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/chat/completions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"deepseek/deepseek-v4-flash","messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(response.choices[0].message.content)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.chat.completions.create({
          model: "deepseek/deepseek-v4-flash",
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(response.choices[0].message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "chatcmpl_01...",
        "object": "chat.completion",
        "model": "deepseek/deepseek-v4-flash",
        "choices": [{
          "index": 0,
          "message": { "role": "assistant", "content": "Hello! How can I help?" },
          "finish_reason": "stop"
        }],
        "usage": { "prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15 }
      }
  notes:
    - title: Streaming dan tool
      description: "Atur stream ke true untuk SSE; stream diakhiri dengan data: [DONE]. Tambahkan stream_options.include_usage untuk chunk usage terakhir. Panggilan tool dan konten multimodal mengikuti schema yang kompatibel dengan OpenAI."
    - title: Kompatibilitas penyedia
      description: SandBase mempertahankan field tambahan yang kompatibel pada rute dengan protokol yang sama. Dukungan field lintas protokol dan khusus penyedia bervariasi; gunakan extra_body jika berlaku.
  errors:
    - status: "400"
      description: Body permintaan tidak valid atau parameter tidak didukung.
    - status: "401"
      description: Kunci API tidak ada atau tidak valid.
    - status: "402"
      description: Batas pengeluaran organisasi telah tercapai.
    - status: "404"
      description: Model tidak ditemukan atau tidak tersedia.
    - status: "429"
      description: Batas rate terlampaui.
    - status: "500"
      description: Penyimpanan permintaan atau pencarian organisasi gagal.
    - status: "502"
      description: Penyedia yang dipilih mengembalikan respons yang tidak valid.
    - status: "503"
      description: Tidak ada rute penyedia yang berhasil.
---

<ApiReferencePage />
