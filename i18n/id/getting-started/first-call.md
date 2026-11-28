---
i18nSource: 0ca53876f04eb96d
title: Panggilan API pertama
description: Panduan mendetail untuk membuat panggilan API SandBase pertama Anda, memahami anatomi permintaan, struktur respons, dan streaming.
---

# Panggilan API pertama {#first-api-call}

Panduan ini membahas anatomi permintaan dan respons API SandBase secara mendetail. Di akhir panduan, Anda akan memahami setiap field di body permintaan, cara membaca respons, dan cara menggunakan streaming.

## Sebelum memulai {#before-you-start}

Anda memerlukan organisasi SandBase yang aktif, [API key](/getting-started/api-keys), dan ID model dari [katalog Models](https://www.sandbase.ai/models). Ekspor key tersebut agar contoh tidak menaruh secret di kode sumber:

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

Mulailah dengan permintaan non-streaming. Setelah autentikasi dan penanganan respons berfungsi, tambahkan streaming dan perilaku retry untuk production.

## Anatomi Permintaan {#request-anatomy}

Panduan ini menggunakan rute Chat Completions yang kompatibel dengan OpenAI:

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### Header Wajib {#required-headers}

| Header | Nilai | Deskripsi |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | API key SandBase Anda |
| `Content-Type` | `application/json` | Format body permintaan |

### Body Permintaan {#request-body}

```json
{
  "model": "deepseek/deepseek-v4-flash",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"}
  ],
  "temperature": 0.7,
  "max_tokens": 256
}
```

### Parameter Body {#body-parameters}

| Parameter | Tipe | Wajib | Deskripsi |
|-----------|------|----------|-------------|
| `model` | string | Ya | ID model aktif yang dikembalikan oleh `GET /v1/models` (misalnya, `deepseek/deepseek-v4-flash`) |
| `messages` | array | Ya | Riwayat percakapan berupa array objek pesan |
| `temperature` | number | Tidak | Temperature sampling (0–2). Dukungan dan nilai default dapat berbeda per model. |
| `max_tokens` | integer | Tidak | Jumlah maksimum token yang dihasilkan dalam respons |
| `top_p` | number | Tidak | Parameter nucleus sampling (0–1) |
| `stream` | boolean | Tidak | Apakah respons di-stream. Default: `false` |
| `stop` | string atau array | Tidak | Stop sequence — generasi berhenti saat urutan ini ditemukan |
| `frequency_penalty` | number | Tidak | Penalti pengulangan yang kompatibel dengan penyedia, jika didukung |
| `presence_penalty` | number | Tidak | Penalti kehadiran yang kompatibel dengan penyedia, jika didukung |

### Role Pesan {#message-roles}

| Role | Tujuan |
|------|---------|
| `system` | Menetapkan perilaku dan kepribadian assistant |
| `user` | Input dari manusia |
| `assistant` | Respons assistant sebelumnya (untuk percakapan multi-turn) |
| `developer`, `tool` | Role tambahan yang kompatibel dengan OpenAI jika didukung oleh model dan rute yang dipilih |

## Contoh Permintaan Lengkap {#full-request-example}

::: code-group

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

response = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ],
    temperature=0.7,
    max_tokens=256
)

print(response.choices[0].message.content)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
  temperature: 0.7,
  max_tokens: 256,
});

console.log(response.choices[0].message.content);
```

:::

## Struktur Respons {#response-structure}

### Respons non-streaming yang umum {#typical-non-streaming-response}

```json
{
  "id": "chatcmpl-abc123def456",
  "object": "chat.completion",
  "created": 1719000000,
  "model": "deepseek/deepseek-v4-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 8,
    "total_tokens": 32
  }
}
```

### Penjelasan Field Respons {#response-fields-explained}

| Field | Deskripsi |
|-------|-------------|
| `id` | Identifier unik untuk completion ini |
| `object` | Objek respons yang kompatibel dengan OpenAI, biasanya `"chat.completion"` pada rute ini |
| `created` | Unix timestamp saat respons dihasilkan |
| `model` | Model yang menghasilkan respons |
| `choices` | Array pilihan completion (biasanya satu) |
| `choices[].index` | Indeks pilihan ini dalam array |
| `choices[].message.role` | Role yang dikembalikan untuk pesan yang dihasilkan, biasanya `"assistant"` |
| `choices[].message.content` | Teks yang dihasilkan |
| `choices[].finish_reason` | Alasan generasi berhenti (lihat di bawah) |
| `usage.prompt_tokens` | Token pada input Anda |
| `usage.completion_tokens` | Token pada output yang dihasilkan |
| `usage.total_tokens` | Jumlah token prompt + completion |

### Finish reason {#finish-reasons}

Finish reason bergantung pada penyedia. Nilai umum yang kompatibel dengan OpenAI antara lain:

| Nilai | Arti umum |
|-------|---------|
| `stop` | Respons berakhir secara alami atau mencapai stop sequence |
| `length` | Mencapai batas `max_tokens` — respons terpotong |

Perlakukan nilai yang tidak dikenal sebagai output penyedia yang valid alih-alih menolak respons.

## Respons Streaming {#streaming-responses}

Untuk output real-time (seperti chatbot yang sedang mengetik), gunakan streaming. Respons dikirim sebagai Server-Sent Events (SSE):

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Write a haiku about coding."}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()  # newline at the end
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Write a haiku about coding.' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}
console.log();
```

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -N \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Write a haiku about coding."}],
    "stream": true
  }'
```

:::

### Format SSE Streaming {#streaming-sse-format}

Stream yang kompatibel biasanya memancarkan Server-Sent Events seperti berikut:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

Poin penting:

- konsumsi chunk secara berurutan dan tambahkan setiap fragmen `delta.content`
- toleransi chunk yang hanya berisi metadata, delta kosong, dan field kompatibel penyedia yang tidak Anda kenali
- berhenti saat stream ditutup atau penanda akhirnya tiba; Chat Completions biasanya menggunakan `data: [DONE]`
- jangan berasumsi setiap model memancarkan bentuk chunk pertama atau terakhir yang persis sama

## Menggunakan Anthropic SDK {#using-the-anthropic-sdk}

SandBase juga menyediakan endpoint yang kompatibel dengan Anthropic di `POST /v1/messages`. Gunakan Anthropic SDK dengan mengubah `base_url`:

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

message = client.messages.create(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)
print(message.content[0].text)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai',
});

const message = await client.messages.create({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'What is the capital of France?' }],
});
console.log(message.content[0].text);
```

:::

### Struktur Respons Anthropic {#anthropic-response-structure}

Endpoint yang kompatibel dengan Anthropic mengembalikan respons bergaya Anthropic. Respons teks yang umum terlihat seperti ini:

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The capital of France is Paris."
    }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 14,
    "output_tokens": 8
  }
}
```

| Field | Deskripsi |
|-------|-------------|
| `id` | ID pesan (berprefiks `msg_`) |
| `type` | Tipe objek pesan, biasanya `"message"` |
| `role` | Role pesan yang dihasilkan, biasanya `"assistant"` |
| `content` | Array blok konten bertipe; jangan berasumsi setiap blok berupa teks |
| `model` | Model yang menghasilkan respons |
| `stop_reason` | `"end_turn"` (berhenti alami), `"max_tokens"` (mencapai batas), atau `"stop_sequence"` |
| `usage.input_tokens` | Token pada input Anda |
| `usage.output_tokens` | Token pada output yang dihasilkan |

### Streaming Anthropic {#anthropic-streaming}

Streaming dengan Anthropic SDK bekerja dengan cara yang sama — cukup kirim `stream=True`:

```python
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about coding."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()
```

## Memilih Model {#choosing-a-model}

Saat memilih model, periksa model card terkininya untuk ketersediaan, harga, panjang konteks, input yang didukung, dan kemampuan. Nilai-nilai ini berubah secara independen, jadi jangan mengandalkan perbandingan model yang disalin.

- Jelajahi [katalog Models](https://www.sandbase.ai/models) terkini.
- Buka halaman model di katalog untuk melihat field permintaan khusus model tersebut.
- Kueri `GET /v1/models` jika integrasi memerlukan metadata model terkini secara terprogram.

Untuk model yang memiliki antarmuka kompatibel yang sama, berpindah model biasanya dimulai dengan parameter `model`. Periksa kembali kemampuan dan skema model yang dipilih sebelum membawa field opsional, tool, input media, atau pengaturan output terstruktur.

## Langkah Berikutnya {#next-steps}

Sebelum ke production, atur timeout permintaan, lakukan retry hanya untuk kegagalan sementara dengan exponential backoff yang dibatasi, catat request ID jika tersedia, dan pantau penggunaan tanpa mencatat prompt atau API key ke log.

- [**Referensi API**](/api-reference/) — Endpoint inferensi dan kontrak Platform API
- [**Panduan Streaming**](/guides/streaming) — Pola streaming lanjutan dan penanganan error
- [**Models**](https://www.sandbase.ai/models) — Penemuan model, kemampuan, dan harga terkini
- [**Error**](/guides/error-handling) — Menangani kegagalan dan retry
