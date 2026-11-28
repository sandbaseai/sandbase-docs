---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: Gunakan Responses API yang kompatibel dengan OpenAI bersama model GPT melalui SandBase.
---

# OpenAI Responses {#openai-responses}

Model GPT mendukung Responses API yang kompatibel dengan OpenAI di `POST /v1/responses`.
Gunakan `input` untuk prompt atau konten terstruktur dan baca item yang dihasilkan dari
`output`.

```bash
curl https://api.sandbase.ai/v1/responses \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/<gpt-model>",
    "input": "Explain immutable infrastructure in one sentence."
  }'
```

## Kompatibilitas Chat Completions {#chat-completions-compatibility}

Model GPT yang sama juga mendukung `POST /v1/chat/completions`. Protokol tersebut
menggunakan `messages` dalam permintaan dan `choices` dalam respons, sedangkan Responses
menggunakan `input` dan `output`. Envelope parameternya tidak dapat saling dipertukarkan;
pilih endpoint yang sesuai dengan SDK Anda.

Lihat [Chat Completions](./chat-completions) untuk format permintaan yang kompatibel
dan [referensi model GPT](https://www.sandbase.ai/models) untuk
field dan batasan khusus model.

## Langkah berikutnya {#next-steps}

- [Referensi Responses API](/api-reference/responses)
- [Referensi Chat Completions API](/api-reference/llm-gateway)
- [Katalog Models](https://www.sandbase.ai/models)
