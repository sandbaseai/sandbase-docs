---
i18nSource: 335b45fb98c53890
title: Respons streaming
description: Stream output model SandBase dengan SDK yang kompatibel dengan OpenAI atau Anthropic dan tangani hasil parsial dengan aman.
---

# Respons streaming {#streaming-responses}

Streaming mengembalikan output model segera setelah tersedia. SandBase mempertahankan format event dari API kompatibel yang Anda
panggil: OpenAI Chat Completions menggunakan Server-Sent Events (SSE) yang hanya berisi data, sedangkan Anthropic Messages menggunakan event SSE bernama.

Gunakan SDK resmi yang kompatibel jika memungkinkan. SDK menangani framing event, argumen tool-call inkremental, dan
penghentian protokol dengan lebih aman dibandingkan memisahkan teks respons mentah sendiri.

## OpenAI Chat Completions {#openai-chat-completions}

Atur `stream: true` pada `POST /v1/chat/completions`.

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
    stream=True,
)

for chunk in stream:
    text = chunk.choices[0].delta.content
    if text:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
  stream: true,
});

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content;
  if (text) process.stdout.write(text);
}
```

```bash [cURL]
curl -N https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Explain quantum computing briefly."}],
    "stream": true
  }'
```

:::

Chunk yang kompatibel dengan OpenAI menempatkan teks inkremental di `choices[0].delta.content`. Argumen tool-call, jika didukung oleh
model yang dipilih, dikirim sebagai fragmen string di `delta.tool_calls`; gabungkan fragmen berdasarkan indeks choice dan tool-call
sebelum mem-parse JSON yang sudah lengkap. Stream biasanya diakhiri dengan `data: [DONE]`.

Jangan berasumsi setiap penyedia mengembalikan penggunaan token di dalam stream. Jika model yang Anda pilih mendukung
`stream_options.include_usage` dari OpenAI, data penggunaan dapat muncul menjelang akhir; jika tidak, gunakan respons non-streaming atau
alur task-cost yang berlaku.

## Anthropic Messages {#anthropic-messages}

Gunakan Anthropic SDK dengan `POST /v1/messages`. Helper stream SDK menyusun event bernama dan blok konten.

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key=os.environ["SANDBASE_API_KEY"],
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = client.messages.stream({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
});

stream.on('text', (text) => process.stdout.write(text));
await stream.finalMessage();
```

:::

Stream Anthropic mentah menggunakan nama event seperti `message_start`, `content_block_start`, `content_block_delta`,
`content_block_stop`, `message_delta`, dan `message_stop`. Teks dibawa oleh blok `text_delta`. Input tool menggunakan
blok JSON inkremental dan harus disusun sebelum di-parse.

## Menangani interupsi dan pembatalan {#handle-interruption-and-cancellation}

Error HTTP yang dikembalikan sebelum streaming dimulai menggunakan body error normal dari endpoint tersebut. Setelah respons dimulai,
kegagalan jaringan dapat meninggalkan teks parsial tanpa event akhir. Anggap output lengkap hanya setelah sinyal penghentian normal
dari protokol diterima.

- Pisahkan output parsial dari state aplikasi yang sudah di-commit.
- Batasi timeout koneksi dan inaktivitas di klien atau proxy Anda sendiri sesuai workload.
- Gunakan mekanisme pembatalan SDK atau `AbortController` di JavaScript saat pengguna menghentikan generasi.
- Jangan secara otomatis menambahkan stream hasil retry ke output parsial; retry adalah generasi baru.
- Hindari buffering SSE di reverse proxy yang Anda kendalikan.

```javascript
const controller = new AbortController();

const response = await fetch('https://api.sandbase.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek/deepseek-v4-flash',
    messages: [{ role: 'user', content: 'Write a short story.' }],
    stream: true,
  }),
  signal: controller.signal,
});

// Call controller.abort() when the user cancels.
```

Saat membaca SSE mentah, parse frame event lengkap yang dipisahkan oleh baris kosong. Chunk jaringan tidak berkorespondensi satu-satu
dengan event SSE, dan satu karakter UTF-8 dapat terbagi di beberapa chunk. Gunakan streaming text decoder dan simpan frame yang belum lengkap
hingga byte berikutnya tiba.

## Panduan terkait {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [Penanganan error](/guides/error-handling)
- [Batas laju](/guides/rate-limiting)
