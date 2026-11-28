---
i18nSource: 3dc57d405dbf561d
title: API key
description: Cara membuat, mengelola, dan mengamankan API key SandBase Anda untuk mengautentikasi permintaan API.
---

# API key {#api-keys}

API key mengautentikasi permintaan Anda ke SandBase. Panduan ini membahas cara membuat key, menggunakannya dalam permintaan, dan menjaga keamanannya.

## Membuat API key {#create-an-api-key}

1. Masuk ke [SandBase Console](https://www.sandbase.ai/console)
2. Buka **Developer → API Keys** (atau langsung ke [API Keys](https://www.sandbase.ai/console/keys))
3. Klik **New key**
4. Masukkan **Name** yang deskriptif (misalnya, "Production Server", "Local Development")
5. Jika perlu, atur **Spending limit** (kosong berarti tanpa batas) dan tanggal **Expires** (kosong berarti tidak kedaluwarsa)
6. Klik **Create key**
7. Segera salin key dari banner **API key created** — key hanya ditampilkan satu kali

::: danger Penting
API key Anda hanya ditampilkan satu kali saat dibuat. Jika hilang, Anda harus membuat key baru. Simpan dengan aman sebelum menutup dialog.
:::

## Format key {#key-format}

API key baru yang dibuat di Console menggunakan prefiks `sk-` diikuti 64 karakter heksadesimal:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Key `sk-sb-...` yang sudah ada tetap valid hingga kedaluwarsa atau dicabut. Jangan menggunakan prefiks saja untuk memvalidasi
kredensial; selalu perlakukan nilai lengkapnya sebagai secret yang opaque.

## Metode autentikasi {#authentication-methods}

SandBase mendukung dua cara untuk meneruskan API key dalam permintaan:

### Header Authorization (Disarankan) {#authorization-header-recommended}

Gunakan header standar `Authorization: Bearer`. Header ini kompatibel dengan SDK OpenAI dan Anthropic:

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages: header x-api-key {#anthropic-messages-x-api-key-header}

`POST /v1/messages` juga menerima header native Anthropic `x-api-key`:

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
Di antara gateway model, hanya `POST /v1/messages` yang membaca `x-api-key`, dan header ini diprioritaskan jika kedua header yang didukung
ada. [Resource platform Agents](/api-reference/authentication#agents-platform-resources) juga menerima
`X-API-Key`. Gunakan header Bearer untuk semua endpoint publik lainnya.
:::

## Izin key {#key-permissions}

API key SandBase memiliki cakupan di **tingkat organisasi**:

- Key standar yang dibuat di Console dapat memanggil resource API publik yang tersedia bagi organisasi
- Penggunaan ditagihkan ke organisasi pemilik key
- Key dapat memiliki tanggal kedaluwarsa dan batas pengeluaran opsional
- Kredensial yang diterbitkan SandBase, seperti key CLI Login, dapat membawa scope terbatas dan mengembalikan `403` di luar scope tersebut

Console saat ini tidak menyediakan scope yang dapat dipilih pengguna untuk key standar. Key CLI Login dibuat saat Anda menghubungkan tool AI. Halaman API Keys mengelompokkannya dalam satu baris **CLI Login** yang dapat diperluas, dan key tersebut tidak dapat diedit seperti key standar. Key yang dibuat SandBase untuk Anda memiliki lencana **Auto-created**; key ini tidak memiliki batas tingkat key dan dibatasi oleh saldo akun.

Daftar key menampilkan **Name**, **Key Prefix**, **Spent**, **Limit**, **Expires**, dan **Status** untuk setiap key. Gunakan **Edit** untuk mengubah nama, batas pengeluaran, atau tanggal kedaluwarsa key standar.

Perlakukan setiap key sebagai kredensial aplikasi, bukan kata sandi pribadi. Gunakan keanggotaan organisasi untuk akses manusia dan API key untuk beban kerja.

## Strategi lingkungan {#environment-strategy}

Buat key yang berbeda untuk setiap aplikasi dan lingkungan:

| Key | Contoh nama | Alasan |
|---|---|---|
| Pengembangan lokal | `research-app-dev` | Rotasi tanpa mengganggu produksi |
| Staging | `research-app-staging` | Mengisolasi penggunaan dan insiden pengujian |
| Produksi | `research-app-production` | Memberi produksi pemilik yang jelas dan paparan terbatas |
| Otomasi sementara | `release-check-2026-08` | Atur tanggal kedaluwarsa dan cabut secara terpisah |

Catat pemilik dan deployment yang menggunakan setiap key. Saat rotasi, deploy key baru, verifikasi bahwa permintaan berhasil, dan baru setelah itu cabut key lama.

## Kedaluwarsa dan pencabutan key {#key-expiration-and-revocation}

### Kedaluwarsa {#expiration}

Saat membuat key, Anda dapat mengatur tanggal kedaluwarsa secara opsional. Setelah kedaluwarsa, key berhenti berfungsi dan permintaan akan mengembalikan error `401 Unauthorized`.

Key tanpa tanggal kedaluwarsa tetap valid hingga dicabut secara manual.

### Mencabut key {#revoking-a-key}

Untuk mencabut (menonaktifkan) key:

1. Buka [Developer → API Keys](https://www.sandbase.ai/console/keys)
2. Temukan key yang ingin Anda cabut
3. Klik **Revoke**
4. Konfirmasi tindakan tersebut

Key yang dicabut tidak dapat mengautentikasi permintaan baru. Pencabutan tidak dapat dibatalkan — buat key baru jika Anda tidak sengaja mencabut key.

## Praktik terbaik keamanan {#security-best-practices}

### Jangan pernah meng-commit key ke version control {#never-commit-keys-to-version-control}

Gunakan variabel lingkungan atau secrets manager:

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### Gunakan key terpisah untuk lingkungan yang berbeda {#use-separate-keys-for-different-environments}

Buat key yang berbeda untuk pengembangan, staging, dan produksi. Dengan begitu, Anda dapat mencabut key pengembangan yang bocor tanpa memengaruhi produksi.

### Rotasi key secara berkala {#rotate-keys-regularly}

Buat key baru secara berkala dan pensiunkan key lama. Ini membatasi jangka waktu paparan jika key bocor.

### Pantau aktivitas {#monitor-activity}

Periksa **Developer → Activities** secara rutin untuk melihat lonjakan permintaan atau penggunaan yang tidak terduga, yang dapat menandakan key telah bocor. **Request History** dapat difilter berdasarkan API key.

Jika key terekspos, segera cabut, buat penggantinya, perbarui aplikasi yang menggunakannya, dan periksa Activities serta penagihan untuk penggunaan yang tidak terduga. Jangan menunggu rotasi terjadwal.

### Atur tanggal kedaluwarsa {#set-expiration-dates}

Untuk akses sementara (pipeline CI/CD, akses kontraktor, demo), atur tanggal kedaluwarsa agar key otomatis berhenti berfungsi.

## Pemecahan masalah {#troubleshooting}

| Error | Penyebab | Solusi |
|-------|-------|-----|
| `401 - missing API key` | Tidak ada key dalam permintaan | Tambahkan header `Authorization: Bearer <key>` |
| `401 - invalid API key` | Key tidak ada | Periksa salah ketik dan pastikan key lengkap disertakan |
| `401 - API key has been revoked` | Key telah dicabut permanen di Console | Buat key pengganti |
| `401 - API key has expired` | Key telah melewati tanggal kedaluwarsanya | Buat key baru atau perpanjang masa berlakunya |
| `402 - API key spending limit exceeded` | Key telah mencapai batas pengeluaran yang dikonfigurasi | Naikkan batasnya atau gunakan key lain yang berwenang |
| `403 - insufficient_scope` | Kredensial dengan scope tidak dapat memanggil endpoint ini | Gunakan key yang berwenang untuk endpoint tersebut |

## Langkah berikutnya {#next-steps}

- [**Panggilan API Pertama**](/getting-started/first-call) — Lakukan panggilan API terperinci dengan panduan lengkap permintaan/respons
- [**Autentikasi**](/api-reference/authentication) — Header yang didukung, siklus hidup, dan error khusus protokol
- [**Referensi API**](/api-reference/) — Dokumentasi endpoint lengkap
