---
i18nSource: 7b24f4b0b5cd2c33
title: Build Agent
description: Definisikan, uji, dan jalankan Agent yang dapat digunakan ulang dan memiliki versi di Session SandBase.
---

# Build Agent {#build-agent}

Build Agent adalah tempat Anda mendefinisikan dan menguji Agent, lalu menentukan cara Agent dijalankan.

Agent adalah konfigurasi tersimpan yang memiliki versi: sebuah Model, instruksi, profil runtime, Skills, dan koneksi MCP ke tool eksternal. Menyimpan Agent tidak menjalankannya.

## Apa itu Agent {#what-an-agent-is}

| Pertanyaan | Tempatnya |
|---|---|
| Apa yang harus dilakukan? | `instructions` |
| Model mana yang mengerjakan tugas? | `model`, ID model dari [Models API](/api-reference/models/) |
| Apa yang ia ketahui cara melakukannya? | [Skills](/agents/mcp-tools#skills), bundle instruksi yang memiliki versi |
| Tool eksternal apa yang dapat dipanggilnya? | [Koneksi MCP](/agents/mcp-tools#mcp-connections), dengan [kredensial](/agents/api-credentials) jika server memerlukan token |
| Bagaimana cara menjalankannya? | Di dalam [Session](/agents/sessions) |

Setiap perubahan efektif membuat versi baru yang tidak dapat diubah. Anda dapat menampilkan daftar versi dan memulihkan versi sebelumnya kapan saja.

## Cara Agent berjalan {#how-an-agent-runs}

Anda menjalankan Agent di dalam [Session](/agents/sessions). Session adalah resource `ses_` yang Anda kirimi input dan Anda stream event-nya, baik untuk percakapan interaktif, uji coba, maupun panggilan dari aplikasi Anda. Setiap Session membekukan versi Agent saat Session dimulai, sehingga Anda dapat terus mengedit Agent tanpa mengubah Session yang sudah ada.

## Lifecycle Agent: Draft → Uji di Session → Jalankan dari aplikasi → Periksa Session {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. Draft {#_1-draft}

Buat Agent di Console pada **Build → Agents**, atau dengan [`POST /v1/agents`](/agents/agent-api). Mulailah dengan alur kerja terkecil yang berguna dan tambahkan Skills serta koneksi MCP hanya jika instruksi memerlukannya.

### 2. Uji di Session {#_2-test-in-a-session}

Buat Session untuk Agent, kirim input yang representatif, lalu baca output, aktivitas tool, dan error. Uji input yang hilang, tool yang tidak tersedia, hasil kosong, dan persyaratan format output, bukan hanya skenario ideal.

### 3. Jalankan dari aplikasi {#_3-run-from-your-app}

Buat Session untuk Agent yang sudah diuji dari aplikasi Anda dengan [Sessions API](/api-reference/sessions/).

### 4. Periksa Session {#_4-inspect-sessions}

Baca item dan turn setiap Session dengan Sessions API untuk meninjau percakapan lengkap, aktivitas tool, dan error.

## Checklist production {#production-checklist}

- `model` menggunakan ID model terkini dari Models API.
- Skills dikunci ke satu versi jika perilakunya tidak boleh berubah diam-diam.
- Koneksi MCP hanya mengekspos tool yang dibutuhkan Agent, menggunakan `allowed_tools`.
- Token disimpan sebagai [Secret](/agents/api-credentials), tidak pernah ditulis ke instruksi, input, atau metadata.
- Pembuatan Session mengirim `Idempotency-Key`, dan retry menggunakan ulang key tersebut.
- Status dan error Session diperiksa setelah peluncuran.

## Agent katalog {#catalog-agents}

[Katalog Agent](/api-reference/agents/catalog) publik menampilkan Agent yang diterbitkan oleh SandBase. Anda dapat membaca Agent katalog, tetapi untuk mengubahnya, clone terlebih dahulu ke organisasi Anda dengan `POST /v1/agents/catalog/{agent_id}/clone`. Hasil clone adalah Agent privat baru yang Anda miliki dan dapat Anda jalankan.

::: tip Menggunakan OpenAI SDK
Agents, Sessions, dan Skills mengikuti OpenAI Agents API, sehingga OpenAI SDK resmi dapat digunakan dengan `base_url="https://api.sandbase.ai/v1"`. Lihat [Kompatibilitas OpenAI](/agents/openai-compatibility) untuk contoh yang sudah diverifikasi dan perbedaannya.
:::

## Langkah berikutnya {#next-steps}

- [Mendefinisikan Agent](/agents/agent-api)
- [Kompatibilitas OpenAI](/agents/openai-compatibility)
- [Skills dan tool MCP](/agents/mcp-tools)
- [Sessions](/agents/sessions)
