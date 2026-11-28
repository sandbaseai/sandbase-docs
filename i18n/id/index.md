---
i18nSource: c063864501452a7b
title: Dokumentasi SandBase
description: Bangun langsung dengan Models dan APIs, atau definisikan Agents yang dapat digunakan ulang dan berjalan di infrastruktur terkelola.
---

# Dokumentasi SandBase {#sandbase-docs}

Bangun langsung dengan Models dan APIs, atau definisikan Agents yang dapat digunakan ulang dan berjalan di infrastruktur terkelola.

SandBase menyediakan dua cara yang saling melengkapi untuk membangun aplikasi AI. Mulailah dengan permukaan terkecil yang sesuai dengan pekerjaan; Anda dapat menggabungkan keduanya seiring berkembangnya aplikasi.

## Memilih cara membangun {#choose-how-to-build}

| | Models dan APIs | Managed Agents |
|---|---|---|
| **Apa itu** | Akses langsung ke API bahasa, gambar, video, audio, dan pihak ketiga | Konfigurasi Agent berversi yang dapat digunakan ulang dan dijalankan oleh SandBase |
| **Paling cocok untuk** | Loop aplikasi kustom dan kontrol permintaan yang terperinci | Pekerjaan multi-langkah, asinkron, atau berulang |
| **Yang Anda kelola** | Prompt, orkestrasi, percobaan ulang, dan status aplikasi | Definisi Agent, kemampuan yang diaktifkan, input, dan perilaku pengiriman hasil |
| **Mulai di sini** | [Models dan APIs](https://www.sandbase.ai/models) | [Build Agent](/agents/) |

::: tip Satu kunci API SandBase
Kunci API yang sama dapat memanggil Models, APIs, dan Agents. Simpan kunci di server dan jangan pernah mengeksposnya di kode browser.
:::

## Konsep inti {#core-concepts}

### Models dan APIs {#models-and-apis}

Gunakan Models untuk beban kerja bahasa, gambar, video, dan audio. Gunakan APIs jika aplikasi memerlukan data atau tindakan eksternal. Katalog di situs web SandBase menampilkan kemampuan yang tersedia, harga, schema input, dan contoh yang berfungsi.

- [Jelajahi Models](https://www.sandbase.ai/models)
- [Jelajahi APIs](https://www.sandbase.ai/apis)
- [Lakukan panggilan API pertama Anda](/getting-started/first-call)
- [Buka Referensi API](/api-reference/)

### Agents {#agents}

Agent adalah konfigurasi berversi yang dapat digunakan ulang, berisi Model, instruksi, Skills, dan koneksi MCP. Definisikan sekali, lalu jalankan dalam Sessions.

- [Memahami Agents](/agents/)
- [Mendefinisikan Agent](/agents/agent-api)
- [Menambahkan Skills dan tool MCP](/agents/mcp-tools)

### Sessions {#sessions}
Session menjalankan satu versi Agent. Buat dengan `POST /v1/agents/sessions`, kirim input, streaming event, lalu baca percakapan lengkapnya setelah itu.

- [Panduan Sessions](/agents/sessions)
- [API Sessions](/api-reference/sessions/)

## Langkah pertama {#first-steps}

1. Buat organisasi dan [kunci API](/getting-started/api-keys).
2. Pilih Model, API, atau Agent dari [katalog](https://www.sandbase.ai/models).
3. Kirim permintaan langsung atau definisikan dan uji Agent.
4. Jalankan Agent yang telah diuji dalam Sessions dari aplikasi Anda.
5. Tinjau Sessions, error, latensi, dan biaya di Console.

## Panduan operasional {#operational-guidance}

- [Respons streaming](/guides/streaming)
- [Penanganan error dan percobaan ulang](/guides/error-handling)
- [Pembatasan rate](/guides/rate-limiting)
- [Penagihan dan harga](/guides/billing)
- [Administrasi workspace](/admin/)

## Langkah berikutnya {#next-steps}

- Berkreasi dengan Skills lokal: [Tutorial Skill](/guides/skills/)

- Baru mengenal SandBase: [Memulai](/getting-started/)
- Memanggil Model atau API: [Katalog Models](https://www.sandbase.ai/models) dan [katalog APIs](https://www.sandbase.ai/apis)
- API inferensi dan Agent: [Referensi API](/api-reference/)
- Membangun pekerjaan yang dapat digunakan ulang: [Build Agent](/agents/)
- Menghubungkan tool AI: [Setup](/setup/)
