---
i18nSource: 071e97a48f9c4f4c
title: Referensi API
description: Panggil model SandBase dan kelola Agents, Sessions, Skills, koneksi MCP, Secrets, dan resource akun.
---

# Referensi API {#api-reference}

Gunakan API untuk memanggil model secara langsung, atau untuk mendefinisikan Agents yang dapat digunakan ulang, menjalankannya di Sessions, dan menghubungkannya ke Skills dan tools MCP.

::: tip Mencari inferensi model?
Kontrak inferensi (Chat Completions, Responses, Anthropic Messages, Gemini, Images, dan video Seedance) ada di bagian **Model inference** pada referensi ini. Field dan harga setiap model tercantum di halamannya di [katalog Models](https://www.sandbase.ai/models).
:::

## Pilih titik awal {#choose-a-starting-point}

| Tujuan | Mulai dengan | Yang terjadi selanjutnya |
|---|---|---|
| Mendefinisikan perilaku yang dapat digunakan ulang | [Agents](/api-reference/agents/) | Buat dan beri versi konfigurasi Agent |
| Menjalankan Agent secara langsung | [Sessions](/api-reference/sessions/) | Kirim input, stream event, dan baca riwayat |
| Menggunakan ulang bundel instruksi | [Skills](/api-reference/skills/) | Unggah bundel ZIP berversi dan lampirkan ke Agents |
| Memanggil tools eksternal | [MCP Connections](/api-reference/mcp-connections/) | Daftarkan server MCP HTTPS jarak jauh untuk Agents |
| Mengautentikasi tools eksternal | [Secrets](/agents/api-credentials#with-the-api) | Simpan Bearer token hanya-tulis untuk koneksi MCP |

## Siklus hidup resource {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- **Agent** (`agt_`) adalah konfigurasi tersimpan dan berversi; membuatnya tidak mengeksekusinya.
- **Session** (`ses_`) menjalankan satu versi Agent dan membekukan Skills serta koneksi MCP-nya. Path Session berada di bawah `/v1/agents/sessions`.
- **Skill** (`skl_`) adalah bundel instruksi berversi. **Koneksi MCP** (`mcp_`) mendaftarkan server tool jarak jauh, dan **Secret** (`sec_`) menyimpan Bearer token-nya.

## Konvensi untuk resource platform Agents {#conventions-for-agents-platform-resources}

Agents, Sessions, Skills, koneksi MCP, dan Secrets dilayani di bawah `https://api.sandbase.ai/v1` dan mengikuti aturan yang sama:

- Autentikasi dengan `Authorization: Bearer` atau `X-API-Key`. Lihat [Autentikasi](/api-reference/authentication#agents-platform-resources).
- Body permintaan berupa JSON ketat hingga 1 MiB; field yang tidak dikenal mengembalikan 400.
- Penulisan yang membuat koneksi MCP atau Secrets memerlukan `Idempotency-Key`. Penulisan lain menerimanya secara opsional.
- Konkurensi optimistis menggunakan `row_version`: kirim nilai yang terakhir Anda baca, dan tangani 409 dengan membaca ulang.
- Agents, Sessions, item, turn, dan Skills menggunakan paginasi cursor (`limit`, `after`, `order`; respons memiliki `has_more` dan `last_id`). Versi Agent, lampiran, koneksi MCP, dan Secrets menggunakan paginasi offset (`limit`, `offset`; respons memiliki `total`).
- Error menggunakan `{"error": {"type", "code", "param", "message"}}`. Lihat [Error platform Agents](/api-reference/errors#agents-platform-errors).

## Autentikasi {#authentication}

Kirim API key SandBase sebagai Bearer token:

```http
Authorization: Bearer sk-YOUR_KEY
```

Perlakukan key sebagai secret yang opaque, simpan di server, dan jangan pernah menyertakannya dalam kode browser atau log. Lihat [Autentikasi](/api-reference/authentication) untuk detail kompatibilitas dan [Error](/api-reference/errors) untuk envelope error publik.

## Organisasi dan penggunaan {#organization-and-usage}

Resource platform dimiliki oleh organisasi yang terkait dengan API key. Gunakan [Account API](/api-reference/account/) untuk memeriksa saldo dan tampilan riwayat eksekusi terbaru yang didukung. Administrasi organisasi dan pengelolaan penagihan tetap merupakan alur kerja Console kecuali ada endpoint publik yang didokumentasikan di sini.

## Format referensi {#reference-formats}

- Jelajahi operasi dari sidebar untuk contoh dan detail respons.
- Unduh [spesifikasi OpenAPI](/openapi.yaml) yang dapat dibaca mesin.
- Buka halaman model di [katalog Models](https://www.sandbase.ai/models) atau halaman API di [katalog APIs](https://www.sandbase.ai/apis) untuk field permintaan yang tepat.

## Langkah berikutnya {#next-steps}

- Baru mengenal Agents terkelola: [Membangun Agent](/agents/)
- Memanggil model secara langsung: [Chat Completions](/api-reference/llm-gateway) atau [katalog Models](https://www.sandbase.ai/models)
