---
i18nSource: 28b1ef75a197824a
title: Menghubungkan tools AI
description: Berikan katalog Models dan APIs SandBase kepada Claude Code, Codex, Cursor, Kiro, dan tools AI lainnya dengan satu prompt atau satu perintah CLI.
---

# Menghubungkan tools AI {#connect-ai-tools}

Halaman [AI tools](https://www.sandbase.ai/console/setup) di Console (**Build → AI tools**) menghubungkan SandBase ke agent atau tool AI yang sudah Anda gunakan. Tools yang terhubung dapat mencari katalog Models dan APIs SandBase, membaca skema input dan harga setiap tool, lalu menjalankannya. Setiap panggilan ditagihkan ke workspace aktif.

Klien yang didukung meliputi Claude Code, Codex, Cursor, Kiro IDE dan Kiro CLI, Windsurf, Gemini CLI, OpenCode, Qwen Code, Warp, Amp, Crush, OpenClaw, Hermes, Claude Desktop, dan ChatGPT. Halaman AI tools mencantumkan daftar terkini.

## Mulai cepat: tempel satu prompt {#quick-start-paste-one-prompt}

Tempel baris ini ke agent Anda:

```text
set up https://www.sandbase.ai/SKILL.md
```

Agent membaca Skill SandBase, menginstal CLI, dan meminta Anda menyetujui satu proses masuk melalui browser. Anda tidak perlu menempelkan API key. Setelah agent melaporkan bahwa klien sudah dikonfigurasi, mulai sesi baru atau mulai ulang aplikasi agar tools `sandbase_*` dimuat.

Skill memerlukan Node.js 20 atau yang lebih baru di mesin yang menjalankan agent.

## Cara lain untuk terhubung {#other-ways-to-connect}

### CLI {#cli}

Hubungkan dari terminal. Tanpa `--client`, CLI mengonfigurasi setiap klien yang didukung yang ditemukannya:

```sh
npx -y @sandbaseai/cli@latest connect
```

Untuk mengonfigurasi satu klien, teruskan id-nya, misalnya `codex`, `claude-code`, `cursor`, atau `kiro`:

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

Skrip installer menjalankan perintah yang sama:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

Untuk mencantumkan klien yang dikenali installer tanpa mengubah konfigurasi lokal:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` membuka otorisasi browser, membuat key **CLI Login** untuk workspace yang Anda setujui, dan hanya menulis konfigurasi klien milik SandBase. [SandBase CLI](https://github.com/sandbaseai/cli) yang open source mendokumentasikan setiap klien.

### Klien MCP yang Anda konfigurasi secara manual {#mcp-clients-you-configure-by-hand}

Pengguna yang sudah masuk dapat melihat alamat server MCP di bagian **Other ways to connect** pada halaman [AI tools](https://www.sandbase.ai/console/setup). Autentikasi dengan [API key](/getting-started/api-keys) dari **Developer → API Keys**, dan simpan key di konfigurasi secret klien.

## Memverifikasi koneksi {#verify-the-connection}

Instalasi atau otorisasi saja tidak membuktikan bahwa klien sudah terhubung. Pastikan bahwa:

- server atau konektor SandBase terlihat di klien
- tools `sandbase_*` dapat ditemukan di sesi baru
- satu permintaan bahasa alami yang aman berhasil diselesaikan

Untuk klien yang dikelola CLI, jalankan diagnostik setelah menyambungkan ulang atau mengubah konfigurasi:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` memeriksa kredensial lokal, entri MCP, dan Skill, lalu melakukan satu round trip ke SandBase. Selalu lakukan panggilan tool terakhir di dalam klien itu sendiri.

Run yang dilakukan oleh tools yang terhubung muncul di [Activities](https://www.sandbase.ai/console/activities) beserta biayanya.

## Pemecahan masalah {#troubleshooting}

| Masalah | Yang perlu diperiksa |
|---|---|
| Tools tidak muncul | Mulai sesi klien baru atau mulai ulang aplikasi, jalankan `npx -y @sandbaseai/cli doctor --client <client>`, lalu coba lagi. |
| Otorisasi tidak ada | Jalankan `connect` lagi dan setujui proses masuk browser untuk workspace yang ingin Anda tagih. |
| Panggilan gagal dengan HTTP 402 | Tambahkan kredit di [Billing](https://www.sandbase.ai/console/billing) untuk workspace aktif. |

## Menghapus konfigurasi terkelola {#remove-the-managed-configuration}

Hapus hanya entri milik SandBase untuk satu klien:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

Perintah ini hanya menghapus konfigurasi yang kepemilikan SandBase-nya dapat diverifikasi dan membiarkan entri yang tidak terkait atau dikelola pengguna tanpa perubahan. Setelah itu, cabut key **CLI Login** yang sesuai di **Developer → API Keys** jika Anda tidak lagi membutuhkannya.

## Sumber dan dukungan {#source-and-support}

- [Kode sumber](https://github.com/sandbaseai/cli)
- [Paket npm](https://www.npmjs.com/package/@sandbaseai/cli)
- [Pertanyaan dan contoh](https://github.com/sandbaseai/cli/discussions)
- [Laporan bug](https://github.com/sandbaseai/cli/issues/new/choose)

## Langkah berikutnya {#next-steps}

- [Katalog Models dan APIs](https://www.sandbase.ai/models)
- [Tutorial Skill](/guides/skills/)
- [Membangun Agent](/agents/)
