---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: Gunakan messages, content block, tools, thinking, dan streaming yang kompatibel dengan Anthropic di SandBase.
---

# Anthropic Messages {#anthropic-messages}

SandBase menyediakan endpoint yang kompatibel dengan Anthropic di `POST /v1/messages`. Aplikasi Anthropic SDK dapat terhubung dengan mengganti API key dan base URL.

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## Header autentikasi dan versi {#authentication-and-version-headers}

Gunakan `x-api-key` atau `Authorization: Bearer …`. Jika keduanya diberikan, `x-api-key` yang diprioritaskan. Header opsional `anthropic-version` diteruskan ke upstream dan default-nya `2023-06-01` jika dihilangkan. Nilai opsional `anthropic-beta` juga diteruskan, tergantung kompatibilitas penyedia.

## Messages dan content block {#messages-and-content-blocks}

Messages menggunakan role `user` dan `assistant`. Letakkan instruksi sistem di field `system` tingkat atas. Konten dapat berupa teks biasa atau array block bertipe seperti `text`, `image`, `tool_use`, dan `tool_result`.

## Tools dan extended thinking {#tools-and-extended-thinking}

Tambahkan definisi tool di `tools` dan kontrol pemilihannya melalui `tool_choice`. Jika didukung oleh model yang dipilih, konfigurasikan extended reasoning dengan `thinking`; pertahankan thinking block yang dikembalikan saat melanjutkan percakapan.

## Streaming {#streaming}

Atur `stream: true` untuk menerima event SSE bergaya Anthropic, termasuk `message_start`, event content-block, `message_delta`, dan `message_stop`. SandBase juga meneruskan event keepalive dan event beta yang didefinisikan penyedia. Konsumen sebaiknya mengabaikan jenis event yang tidak dikenal demi kompatibilitas ke depan dan menangani event `error` tingkat protokol.

## Kompatibilitas {#compatibility}

SandBase memetakan nama model publik ke penyedia yang dipilih. Field permintaan lain yang kompatibel dan byte respons dipertahankan, kecuali penyedia tersebut memiliki aturan kompatibilitas eksplisit yang menghapus field yang tidak didukung atau menolak kandidat. Fitur beta khusus penyedia mungkin tidak tersedia di setiap model. Untuk skema permintaan dan respons lengkap, lihat [Create Anthropic Message](/api-reference/anthropic-compat).
