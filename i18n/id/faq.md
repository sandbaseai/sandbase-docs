---
i18nSource: a86346e2696c732c
title: FAQ
description: Pertanyaan yang sering diajukan tentang menghubungkan tool AI, katalog SandBase, Model, API, Agents, Session, dan penagihan.
---

# Pertanyaan yang Sering Diajukan {#frequently-asked-questions}

## Apa itu SandBase? {#what-is-sandbase}

SandBase membantu Agents terhubung ke dunia nyata.

Anda dapat menggunakan Model dan API siap pakai, menggunakannya dari tool AI Anda setelah menghubungkannya di AI tools, atau membangun Agents yang dapat digunakan ulang dan menjalankannya dalam Session.

## Untuk siapa SandBase? {#who-is-sandbase-for}

SandBase terutama ditujukan untuk tiga kelompok:

- **Pengguna tool AI** yang menginginkan kemampuan berguna di dalam Codex, Claude, Cursor, atau Kiro
- **Builder** yang ingin memanggil Model dan API secara langsung
- **FDE dan tim** yang membangun Agents yang dapat digunakan ulang untuk pelanggan atau alur kerja internal

## Di mana saya dapat menelusuri kapabilitas? {#where-do-i-browse-capabilities}
Situs web SandBase mencantumkan katalog kapabilitas:

- [Model](https://www.sandbase.ai/models) dan [model gambar dan video](https://www.sandbase.ai/models/image-video)
- [API](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
Anda dapat memeriksa, menguji, memasang, memanggil, atau meng-clone, tergantung jenis kapabilitasnya.

## Apa itu AI tools? {#what-is-ai-tools}

**Build → AI tools** di Console menghubungkan SandBase ke tool AI yang sudah Anda gunakan, seperti Claude Code, Codex, Cursor, atau Kiro. Tempelkan `set up https://www.sandbase.ai/SKILL.md` ke agent Anda, atau jalankan `npx -y @sandbaseai/cli@latest connect`. Tool yang terhubung dapat mencari dan menjalankan katalog Model dan API SandBase, dengan tagihan ke workspace Anda. Lihat [Menghubungkan tool AI](/setup/).

## Apa itu Build Agent? {#what-is-build-agent}

Build Agent adalah tempat Anda mendefinisikan dan menguji Agent.

Agent menggabungkan instruksi, Model, Skills, dan tool MCP menjadi satu alur kerja berversi yang dapat digunakan ulang.

## Apakah Agent berbeda dari API? {#is-an-agent-different-from-an-api}
Ya. Agent adalah konfigurasi berversi yang Anda edit dan uji, dan Anda menjalankannya dengan membuat Session. Aplikasi Anda dapat membuat Session dengan [Sessions API](/api-reference/sessions/) sementara Anda terus mengedit Agent.

## Apa itu Session? {#what-are-sessions}
Session adalah satu eksekusi Agent beserta percakapan, aktivitas tool, dan output-nya.

## Bagaimana cara memberi Agent akses ke API eksternal? {#how-do-i-give-an-agent-access-to-external-apis}

Hubungkan sistem eksternal sebagai server MCP dan tambahkan ke koneksi MCP milik Agent. Jika server memerlukan Bearer token, simpan token tersebut dengan [Secrets API](/agents/api-credentials#with-the-api) sebagai Secret hanya-tulis yang terikat ke URL server tersebut. Token hanya dikirim ke server itu dan tidak pernah muncul di prompt atau runtime Agent. Lihat [Kredensial untuk tool MCP](/agents/api-credentials).

## Di mana Model berada? {#where-do-models-live}

Model memiliki [katalog](https://www.sandbase.ai/models) tersendiri karena merupakan komponen dasar yang penting.

Anda dapat memanggil Model secara langsung, menggunakannya dari tool AI yang terhubung, atau menggunakannya di dalam Agent.

## Apakah saya perlu menulis kode? {#do-i-need-to-write-code}

Tidak selalu.

[Hubungkan tool AI Anda](/setup/) jika Anda menginginkan kapabilitas di dalamnya tanpa menulis kode.

Gunakan Referensi API jika Anda ingin memanggil SandBase dari aplikasi Anda.

Gunakan Build Agent jika Anda menginginkan pekerjaan multi-langkah yang dapat digunakan ulang.

## Bagaimana cara mendapatkan API key? {#how-do-i-get-an-api-key}

Buka Console, masuk ke **Developer → API Keys**, lalu pilih **New key**.

Gunakan kunci tersebut sebagai:

```http
Authorization: Bearer sk-YOUR_KEY
```

## Bagaimana cara kerja penagihan? {#how-does-billing-work}

SandBase menggunakan kredit dan penagihan berbasis penggunaan.

Model, API, Agents, dan pekerjaan runtime dapat memiliki biaya yang berbeda. Periksa Console untuk penggunaan dan harga terkini.

## Langkah berikutnya {#next-steps}

- [Memulai](/getting-started/)
- [Katalog Model dan API](https://www.sandbase.ai/models)
- [Menghubungkan tool AI](/setup/)
- [Build Agent](/agents/)
- [Referensi API](/api-reference/)

