---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: Panggil SandBase dengan protokol Google Gemini GenerateContent native.
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: Mengirim permintaan Gemini native dan menerima respons yang kompatibel dengan Gemini. Gunakan streamGenerateContent untuk streaming.
  groups:
    - title: Parameter path
      fields:
        - name: model
          type: string
          required: true
          description: Nama model Google tanpa prefiks, seperti gemini-3.5-flash. SandBase me-resolve-nya sebagai google/{model}.
    - title: Body permintaan
      fields:
        - name: contents
          type: array
          required: false
          description: Isi percakapan Gemini yang terdiri dari role dan parts.
        - name: systemInstruction
          type: object
          required: false
          description: Instruksi system berupa teks dalam bentuk Gemini Content.
        - name: generationConfig
          type: object
          required: false
          description: Pengaturan sampling, panjang output, output terstruktur, dan thinking.
        - name: tools
          type: array
          required: false
          description: Deklarasi fungsi atau konfigurasi tool bawaan Gemini yang didukung.
        - name: toolConfig
          type: object
          required: false
          description: Kebijakan function calling Gemini.
        - name: safetySettings
          type: array
          required: false
          description: Kategori dan ambang keamanan Gemini.
        - name: cachedContent
          type: string
          required: false
          description: Resource cached-content Gemini yang diteruskan jika didukung.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST \
          "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:generateContent" \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"contents":[{"role":"user","parts":[{"text":"Explain immutable infrastructure in one sentence."}]}]}'
  response:
    status: 200 OK
    code: |-
      {
        "candidates": [
          {
            "content": {
              "role": "model",
              "parts": [{"text": "Immutable infrastructure replaces servers from versioned images instead of modifying them in place."}]
            },
            "finishReason": "STOP",
            "index": 0
          }
        ],
        "usageMetadata": {
          "promptTokenCount": 8,
          "candidatesTokenCount": 15,
          "totalTokenCount": 23
        }
      }
---

<ApiReferencePage />

## Autentikasi {#authentication}

Permintaan yang kompatibel dengan Google dapat membawa API key SandBase di `x-goog-api-key`, `Authorization: Bearer …`, atau parameter query `key`, dengan urutan prioritas tersebut. Sebaiknya gunakan header: kredensial di query string dapat muncul di log proxy dan riwayat browser.

## Streaming {#streaming}

Ganti sufiks metode dengan `:streamGenerateContent`. Tanpa parameter query, SandBase mengembalikan objek respons yang kompatibel dengan Google sebagai array JSON yang di-stream. Tambahkan `?alt=sse` untuk Server-Sent Events:

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## Pembuatan gambar native {#native-image-generation}

Model gambar berikut memiliki pemetaan GenerateContent native khusus:

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs): `gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs): `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs): `gemini-nano-banana-2.1`

Setiap halaman model mencantumkan harga token dan biaya per gambar.

Untuk pemetaan ini, SandBase meneruskan payload permintaan dan respons tanpa mengonversinya melalui Chat
Completions. Hal ini mempertahankan bagian gambar, modalitas respons, dan field yang ditentukan penyedia. Gunakan nama model tanpa prefiks di
URL; misalnya, `google/gemini-3.1-flash-image` menjadi `gemini-3.1-flash-image` di path.
### Mengedit gambar {#edit-an-image}

Tambahkan gambar sumber sebagai bagian `inlineData` di samping instruksi teks. Gunakan MIME type dari byte yang Anda kirim:

```json
{
  "contents": [{
    "role": "user",
    "parts": [
      {"text": "Keep the subject unchanged and turn the background into a paper-cut landscape."},
      {"inlineData": {"mimeType": "image/png", "data": "<base64-input-image>"}}
    ]
  }],
  "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"imageSize": "1K"}}
}
```

### Menggunakan Google Gen AI SDK {#use-the-google-gen-ai-sdk}

Arahkan SDK resmi ke SandBase dan gunakan API key SandBase Anda:

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="YOUR_SANDBASE_API_KEY",
    http_options=types.HttpOptions(base_url="https://api.sandbase.ai"),
)

response = client.models.generate_content(
    model="gemini-nano-banana-2.1",
    contents="Create a wide editorial illustration of a solar-powered city at sunrise.",
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(aspect_ratio="16:9", image_size="1K"),
    ),
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        with open("output.jpg", "wb") as f:
            f.write(part.inline_data.data)
```

Untuk streaming, panggil `:streamGenerateContent?alt=sse` (SDK: `generate_content_stream`) dengan body yang sama.

### Menangani respons {#response-handling}
Baca media yang dihasilkan dari bagian kandidat yang dikembalikan. Karena model ini menggunakan passthrough native, penulisan huruf field yang ditentukan penyedia
dan metadata MIME dikembalikan apa adanya. Dekode payload base64 dan verifikasi byte media yang sebenarnya
sebelum memilih ekstensi file.

## Batasan routing dan translasi {#routing-and-translation-boundaries}

SandBase hanya memilih penyedia yang mendukung protokol Gemini native yang diminta. Jika model yang dipilih tidak memiliki
pemetaan native yang kompatibel, permintaan akan gagal alih-alih beralih ke penyedia dengan protokol yang berbeda.

Model yang menggunakan jalur GenerateContent hasil translasi mendukung teks, function call dan respons, data `image/*` inline,
dan referensi gambar HTTP(S) publik. Jalur hasil translasi tersebut menolak MIME type inline yang tidak didukung, Google Files privat atau
referensi `gs://`, beberapa kandidat, dan modalitas respons yang tidak didukung dengan respons `400 INVALID_ARGUMENT`
bergaya Google. Pemetaan pembuatan gambar yang tercantum di atas menggunakan raw passthrough dan tidak terkena batasan khusus translasi
tersebut; validasi field media yang dikembalikan sesuai dengan respons penyedia yang dipilih.
