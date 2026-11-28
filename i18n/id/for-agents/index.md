---
i18nSource: 0314b37a870481ae
title: Dokumentasi yang Dapat Dibaca AI
description: Semua yang dibutuhkan agen AI untuk menemukan dan menggunakan SandBase API — ringkasan satu halaman.
---

# Ikhtisar API yang Ramah AI {#ai-friendly-api-overview}

::: info Kontrak Session
Session (`ses_*`) menjalankan satu versi Agent tersimpan; buat secara langsung dengan `POST /v1/agents/sessions`. Instans runtime tetap internal dan tidak pernah dikembalikan.
:::

> Referensi ringkas untuk manusia maupun agen AI. Untuk versi teks biasa yang dioptimalkan bagi LLM, lihat [`llms.txt`](https://www.sandbase.ai/docs/llms.txt).

## Apa itu SandBase? {#what-is-sandbase}

SandBase adalah platform infrastruktur agen AI. Satu API key dapat mengakses Model dan API yang aktif untuk bahasa, gambar, video, audio, pencarian, dan data, serta alur kerja Agent. Temukan katalog terkini alih-alih mengandalkan jumlah yang tetap.

## Base URL API {#api-base-url}

```
https://api.sandbase.ai/v1
```

## Autentikasi {#authentication}

Semua permintaan memerlukan Bearer token:

```
Authorization: Bearer sk-YOUR_KEY
```

Dapatkan kunci Anda di [Developer → API Keys](https://www.sandbase.ai/console/keys).

## Contoh Singkat {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## API Inti {#core-apis}

| Metode | Route | Deskripsi |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | Chat yang kompatibel dengan OpenAI; kapabilitas opsional bergantung pada model yang dipilih |
| `POST` | `/v1/messages` | Messages API yang kompatibel dengan Anthropic |
| `POST` | `/v1/run` | Mengirim pembuatan model menggunakan skema khusus model tersebut |
| `GET` | `/v1/run/{id}` | Polling status pembuatan asinkron dan mengambil hasil |
| `GET` | `/v1/models` | Mencantumkan model logis yang aktif; default-nya tipe LLM |
| `GET` | `/v1/models/{id_or_name}` | Mendapatkan detail model, skema, kapabilitas, dan harga |
| `GET` | `/v1/tasks/{task_id}/cost` | Mendapatkan biaya dan penggunaan tugas |

## Grup API Tambahan {#additional-api-groups}

Selain API pembuatan inti, SandBase menyediakan API untuk pengelolaan siklus hidup agen. Lihat [Panduan API AI](./full) untuk alur kerja umum dan [spesifikasi OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) untuk kontrak lengkapnya.

| Grup | Route utama | Tujuan |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{agent_id}` | Membuat dan mengelola versi definisi Agent tersimpan |
| **Sessions** | `POST /v1/agents/sessions`, `POST /v1/agents/sessions/{session_id}/events`, `GET /v1/agents/sessions/{session_id}/events` | Menjalankan Agent, mengirim input, dan streaming event live |
| **Skills** | `POST /v1/skills`, `GET /v1/skills` | Bundel instruksi berversi yang dipasang oleh Agents |
| **MCP Connections dan Secrets** | `POST /v1/mcp-connections`, `POST /v1/secrets` | Tool MCP HTTPS jarak jauh dan Bearer token hanya-tulisnya |

Resource platform Agents menerima `Authorization: Bearer` atau `X-API-Key` dan mengembalikan `{"error":{"type","code","param","message"}}` saat gagal.

## Model Harga {#pricing-model}

Bayar sesuai penggunaan. Harga bersifat spesifik per model dan dapat berubah secara terpisah dari halaman ini:

- **Harga model**: baca formula dan satuan terkini dari model yang dipilih di `model_card`
- **Harga token**: dapat mencakup komponen input, output, cache, atau reasoning jika dideklarasikan oleh model tersebut
- **Media dan operasi lain**: dapat menggunakan satuan per permintaan, durasi, resolusi, atau satuan khusus model lainnya
- **Data API** (pencarian, media sosial, scraping, e-commerce, keuangan): setiap organisasi mendapat 100 panggilan gratis per hari UTC, dibagi di antara data API yang memenuhi syarat; setelah itu, panggilan ditagih per panggilan, bukan diblokir. Di MCP, tool yang memenuhi syarat menampilkan `pricing.free_quota` di `sandbase_inspect`, dan `sandbase_account` mengembalikan `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`). Lihat [Panggilan API gratis harian](/guides/billing#daily-free-api-calls).

Temukan ID model terkini dengan `GET /v1/models`, lalu periksa `GET /v1/models/{id_or_name}` sebelum mengirim permintaan. Jangan berasumsi bahwa harga atau diskon cache berlaku sama di semua penyedia.

Jika suatu operasi mengembalikan ID tugas, periksa biaya yang tercatat:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## Batas Laju {#rate-limits}

Tidak ada nilai default numerik universal yang dipublikasikan. Permintaan tunduk pada batas permintaan per menit opsional
yang ditetapkan untuk organisasi Anda dan dibagi oleh semua API key-nya. Respons `429` tidak menyertakan header kuota atau `Retry-After`; gunakan
exponential backoff terbatas dengan jitter. Lihat [Panduan Error](./errors).

---

## Bacaan Lanjutan {#further-reading}

- [Panduan API AI](./full) — alur kerja inti, bentuk permintaan/respons, dan contoh curl
- [Model & Harga](./models) — penemuan model live, harga, dan panduan kapabilitas
- [Panduan Error](./errors) — bentuk respons yang terdokumentasi, penanganan HTTP, dan keamanan percobaan ulang
- [Spesifikasi OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) — OpenAPI 3.1 yang dapat dibaca mesin

## Versi Teks Biasa (untuk agen AI) {#plain-text-versions-for-ai-agents}

| File | URL | Konten |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | Ringkasan padat (~60 baris) |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | Panduan API berorientasi AI yang diperluas |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | Spesifikasi OpenAPI 3.1 yang dapat dibaca mesin |

