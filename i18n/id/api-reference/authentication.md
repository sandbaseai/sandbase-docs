---
i18nSource: 5b94f91222d138de
title: Autentikasi API
description: Autentikasi API SandBase dengan Bearer token dan header API key yang kompatibel dengan protokol yang didukung.
---

# Autentikasi {#authentication}

SandBase menggunakan API key untuk mengautentikasi permintaan API publik. Halaman ini membahas metode integrasi yang didukung dan
praktik pengelolaan key. Autentikasi Console dan API internalnya bukan bagian dari kontrak API publik.

## Metode Autentikasi {#authentication-methods}

Endpoint SandBase `/v1/*` standar memerlukan Bearer token. Operasi Anthropic Messages dan yang kompatibel dengan Google Gemini juga menerima lokasi API key yang kompatibel dengan SDK native-nya.

### Bearer token {#bearer-token}

Sertakan key di header `Authorization`:

```http
Authorization: Bearer sk-your-api-key
```

Ini adalah metode standar yang digunakan oleh SDK yang kompatibel dengan OpenAI.

### Anthropic Messages: header x-api-key {#anthropic-messages-x-api-key-header}

Sertakan key di header `x-api-key`:

```http
x-api-key: sk-your-api-key
```

Header ini hanya didukung oleh `POST /v1/messages`. Endpoint publik lainnya tidak membacanya; gunakan autentikasi
Bearer untuk Chat Completions, `/v1/run`, dan API resource.

### Prioritas {#priority}

Khusus untuk `POST /v1/messages`, `x-api-key` diprioritaskan jika kedua header ada.

### API key yang kompatibel dengan Google Gemini {#google-gemini-compatible-api-keys}

Operasi Gemini GenerateContent dan Interactions menerima `x-goog-api-key`, `Authorization: Bearer …`, atau parameter query `key`, dengan urutan prioritas tersebut. Sebaiknya gunakan header karena kredensial di query string dapat muncul di log dan riwayat browser. Lihat [Google Gemini](/api-reference/gemini-generate-content) dan [Gemini Interactions](/api-reference/gemini-interactions) untuk path yang didukung.

### Logika Ekstraksi {#extraction-logic}

Endpoint standar hanya membaca `Authorization: Bearer <key>`. Middleware Anthropic Messages membaca `x-api-key`
terlebih dahulu, lalu beralih ke header Bearer. Resource platform Agents menerima `Authorization: Bearer` atau
`X-API-Key` (lihat di bawah). [Webhook Events API](/api-reference/webhooks) (`/events/webhooks*`) juga menerima kedua
header tersebut dan menggunakan header Bearer jika keduanya ada. Kredensial yang didukung tetapi tidak dikirim mengembalikan `401 Unauthorized`.

### Resource platform Agents {#agents-platform-resources}

`/v1/agents*` (termasuk `/v1/agents/sessions*`), `/v1/mcp-connections*`, `/v1/secrets*`,
dan `/v1/skills*` menerima key di salah satu header berikut:

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- Jika `Authorization: Bearer` dan `X-API-Key` dikirim bersamaan, keduanya harus berisi key yang sama; nilai yang berbeda mengembalikan `401 unauthorized`. Mengulang salah satu header juga mengembalikan 401.
- `OpenAI-Beta` bersifat opsional. Jika ada, nilainya harus `agents=v1`.
- Permintaan baca memerlukan izin `agents.read` dan permintaan tulis memerlukan `agents.write`. Key standar yang dibuat di Console memiliki keduanya. Key dengan cakupan terbatas yang diterbitkan SandBase, seperti key CLI Login, mengembalikan `403 insufficient_scope`.
- `402 spending_limit_exceeded` berarti batas pengeluaran key atau saldo organisasi telah habis.
- Kegagalan menggunakan [amplop error Agents](/api-reference/errors#agents-platform-errors), bukan bentuk datar `{"error": "…"}` yang ditunjukkan di bawah.

## Format API key {#api-key-format}

API key baru yang dibuat di Console memiliki format berikut:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Komponen | Deskripsi |
|-----------|-------------|
| `sk-` | Prefiks standar "secret key" |
| `xxxx...` | 64 karakter heksadesimal yang dihasilkan dari 32 byte acak |

Key lama `sk-sb-...` tetap dapat digunakan hingga kedaluwarsa atau dicabut. Klien sebaiknya memperlakukan key sebagai string opaque
alih-alih menolak kredensial berdasarkan prefiks atau panjangnya.

::: warning
Jangan pernah mengekspos API key Anda di kode sisi klien, repositori publik, atau log. Perlakukan seperti kata sandi.
:::

## Membuat API key {#create-api-keys}

### Melalui Console {#via-console}

1. Masuk ke [SandBase Console](https://www.sandbase.ai/console)
2. Buka **Developer → API Keys**
3. Klik **New key**
4. Beri key nama yang deskriptif (misalnya, "Production Backend", "Development")
5. Segera salin key tersebut — key tidak akan ditampilkan lagi

### Properti Key {#key-properties}

| Properti | Deskripsi |
|----------|-------------|
| Name | Label yang mudah dibaca untuk identifikasi |
| Organization | Organisasi pemilik key ini |
| Enabled | Apakah key aktif |
| Spending Limit | Batas pengeluaran opsional per key |
| Expires At | Tanggal kedaluwarsa opsional |
| Created At | Waktu key dibuat |

Key standar yang dibuat di Console menggunakan akses tingkat organisasi ke API publik yang terdokumentasi. Kredensial yang diterbitkan SandBase, seperti key CLI Login, dapat memiliki cakupan terbatas. Console tidak menyediakan pilihan cakupan oleh pengguna untuk key standar.

## Lifecycle key {#key-lifecycle}

### Rotasi {#rotation}

Untuk merotasi key:

1. Buat key baru di Console
2. Perbarui aplikasi Anda agar menggunakan key baru
3. Pastikan key baru berfungsi di production
4. Cabut key lama

::: tip
Selalu buat key baru sebelum mencabut key lama untuk menghindari downtime.
:::

### Pencabutan {#revocation}

Key yang dicabut tidak dapat mengautentikasi permintaan baru. API mengembalikan `401 Unauthorized` dengan pesan:

```json
{"error":"API key has been revoked"}
```

### Kedaluwarsa {#expiration}

Key dapat memiliki tanggal kedaluwarsa secara opsional. Key yang kedaluwarsa mengembalikan `401 Unauthorized` dengan pesan:

```json
{"error":"API key has expired"}
```

## Persyaratan Autentikasi Endpoint {#endpoint-authentication-requirements}

| Endpoint | Metode Autentikasi | Deskripsi |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | API Key (Bearer) | Chat Completions |
| `POST /v1/responses` | API Key (Bearer) | Responses API yang kompatibel dengan OpenAI |
| `POST /v1/messages` | API Key (Bearer atau x-api-key) | Anthropic Messages |
| `/v1beta/models/*` | API Key (x-goog-api-key, Bearer, atau query key) | Gemini GenerateContent |
| `/v1beta/interactions*` | API Key (x-goog-api-key, Bearer, atau query key) | Gemini Interactions |
| `/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*` | API Key (Bearer atau X-API-Key) | Resource platform Agents |

SandBase Console menggunakan alur autentikasi browser terpisah. Permintaan internalnya bukan endpoint publik yang didukung
dan tidak boleh digunakan oleh integrasi.

## Isolasi Organisasi {#organization-isolation}

API key memiliki cakupan organisasi. Saat Anda melakukan autentikasi dengan key:

- Anda hanya dapat mengakses resource milik organisasi Anda
- Penggunaan dan penagihan dilacak per organisasi

## Respons Error {#error-responses}

| Status HTTP | Pesan | Penyebab |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | Tidak ada key yang dikirim |
| 401 | `invalid API key` | Key tidak ditemukan di database |
| 401 | `API key has been revoked` | Key telah dinonaktifkan |
| 401 | `API key has expired` | Key telah melewati tanggal kedaluwarsa |
| 402 atau 403 khusus protokol | `API key spending limit exceeded` | Batas pengeluaran tingkat key tercapai; periksa kontrak error yang terdokumentasi untuk endpoint tersebut |
| 403 | `API key is not authorized for this endpoint` | Key dengan cakupan terbatas digunakan pada endpoint di luar cakupannya |

Pesan-pesan ini dikirim dalam body datar `{"error":"<message>"}`, kecuali error cakupan `403`. Pada endpoint model dan akun,
error tersebut menggunakan `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`;
pada resource platform Agents, error tersebut menggunakan [amplop error Agents](/api-reference/errors#agents-platform-errors) dengan
`code` `insufficient_scope`.

## Praktik Keamanan Terbaik {#security-best-practices}

### Lakukan {#do}

- **Simpan key di environment variable** — Jangan pernah melakukan hardcode key di kode sumber
- **Gunakan key terpisah per lingkungan** — Key berbeda untuk dev, staging, production
- **Tetapkan tanggal kedaluwarsa** — Pilih interval rotasi yang sesuai dengan kebijakan keamanan Anda
- **Pantau penggunaan** — Periksa Console untuk aktivitas yang tidak terduga
- **Gunakan key standar hanya untuk workload yang memerlukan akses API publik** — Simpan kredensial CLI Login dengan cakupan terbatas di alur terkelolanya

### Jangan {#don-t}

- **Jangan commit key ke version control** — Tambahkan `.env` ke `.gitignore`
- **Jangan berbagi satu key di antara aplikasi yang tidak berkaitan** — Key terpisah membuat rotasi dan penanganan insiden lebih aman
- **Jangan mengekspos key di kode sisi klien** — Selalu gunakan proxy melalui backend Anda
- **Jangan mencatat API key ke log** — Sensor key di log aplikasi

### Contoh Environment Variable {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## Rate Limiting per Key {#rate-limiting-by-key}

Batas permintaan ditetapkan per organisasi dan dibagi oleh semua API key-nya, sehingga membuat lebih banyak key tidak menaikkan
batas tersebut. API tidak memublikasikan nilai default numerik universal
maupun header sisa kuota.

Lihat [Rate Limiting](/guides/rate-limiting) untuk detail tentang batas dan cara menangani respons 429.
