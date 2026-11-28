---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: Gunakan chat completions yang kompatibel dengan OpenAI, streaming, tool, input multimodal, dan output terstruktur dengan SandBase.
---

# Chat Completions {#chat-completions}

SandBase menyediakan endpoint Chat Completions yang kompatibel dengan OpenAI di `POST /v1/chat/completions`. Aplikasi yang sudah menggunakan OpenAI SDK dapat menggunakan SandBase cukup dengan mengubah API key dan base URL.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## Pesan dan konten multimodal {#messages-and-multimodal-content}

Kirim pesan sesuai urutan percakapan menggunakan role yang didukung oleh penyedia yang dipilih, umumnya `system`, `developer`, `user`, `assistant`, dan `tool`. Teks dapat berupa string. Model yang mendukung vision juga menerima bagian konten seperti `text` dan `image_url`.

## Streaming {#streaming}

Atur `stream: true` untuk menerima Server-Sent Events. Baca setiap event `data:` secara berurutan dan gabungkan `choices[0].delta.content`. Stream diakhiri dengan `data: [DONE]`. Tambahkan `stream_options: {"include_usage": true}` jika penyedia yang dipilih menyediakan data penggunaan saat streaming; jika tidak, data penggunaan mungkin tidak ada.

## Tool {#tools}

Definisikan fungsi yang dapat dipanggil di `tools`. Saat assistant mengembalikan `tool_calls`, jalankan setiap fungsi di aplikasi Anda, lalu tambahkan pesan `tool` yang berisi `tool_call_id` yang sesuai sebelum melanjutkan.

## Output terstruktur {#structured-output}

Gunakan `response_format` untuk meminta respons berupa objek JSON atau JSON Schema. Dukungannya berbeda per model, jadi periksa kemampuan model yang dipilih sebelum mengandalkan penegakan skema yang ketat.

## Parameter khusus penyedia {#provider-specific-parameters}

SandBase menggunakan `model` dan `stream` untuk routing. Field permintaan tambahan yang kompatibel dengan OpenAI dipertahankan jika penyedia yang dipilih menggunakan protokol yang sama. Saat SandBase melakukan translasi antarprotokol, gunakan field yang terdokumentasi atau `extra_body`; dukungannya berbeda per penyedia.

## Error dan retry {#errors-and-retries}

Gunakan backoff yang dibatasi untuk `429` yang dapat di-retry dan respons server yang bersifat sementara, hanya jika generasi ulang aman dilakukan. Jangan me-retry secara otomatis permintaan yang formatnya salah, kegagalan autentikasi, atau permintaan yang efek samping tool-nya mungkin sudah terjadi. Lihat [Error dan retry](/guides/error-handling). Untuk skema field dan respons lengkap, lihat [Chat Completions API](/api-reference/llm-gateway).
