---
i18nSource: 95410ff7ea741f64
title: Panduan Error untuk AI
description: Tangani error SandBase API berdasarkan keluarga endpoint, status HTTP, keamanan percobaan ulang, dan bentuk respons yang didokumentasikan.
---

# Penanganan error untuk klien AI {#error-handling-for-ai-clients}

SandBase tidak menyediakan satu schema error universal. Lakukan percabangan berdasarkan status HTTP terlebih dahulu, lalu parse bentuk respons
yang didokumentasikan untuk keluarga endpoint tersebut. Jangan berasumsi bahwa setiap respons berisi `code`, `param`, `request_id`, atau
string pesan tertentu.

## Bentuk respons publik {#public-response-shapes}

Middleware inti `/v1/*` dan beberapa endpoint model atau resource mengembalikan error datar:

```json
{"error":"organization rate limit exceeded"}
```

Resource platform Agents (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`,
`/v1/skills*`) mengembalikan objek bergaya OpenAI dengan `code` yang stabil. Lihat [Error platform Agents](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Gateway yang kompatibel dengan OpenAI mempertahankan envelope yang kompatibel dengan OpenAI. `POST /v1/messages` mempertahankan
envelope yang kompatibel dengan Anthropic:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## Penanganan status HTTP {#http-status-handling}

| Status | Arti | Tindakan klien |
|---|---|---|
| `400` | Input tidak valid atau parameter tidak didukung | Perbaiki permintaan menggunakan schema endpoint dan model yang dipilih. |
| `401` | Kredensial tidak ada, tidak valid, dicabut, atau kedaluwarsa | Ganti atau rotasi kredensial; jangan coba ulang tanpa perubahan. |
| `402` | Permintaan tidak dapat didanai atau batas pengeluaran telah tercapai | Selesaikan masalah penagihan atau batas kunci sebelum mencoba ulang. |
| `403` | Kredensial tidak memiliki izin, atau permukaan kompatibilitas memetakan kegagalan pengeluaran ke 403 | Periksa envelope yang didokumentasikan dan gunakan kunci yang berwenang. |
| `404` | Model atau resource tidak ditemukan | Verifikasi nama model atau ID resource saat ini. |
| `409` | Konflik status resource | Baca status resource terbaru sebelum memutuskan apakah percobaan ulang aman. |
| `429` | Batas permintaan organisasi atau batas konkurensi video | Coba ulang dengan exponential backoff terbatas dan jitter. |
| `500`, `502`, `503`, `504` | Kegagalan sementara di SandBase atau upstream | Coba ulang hanya jika operasi aman untuk diulang. |

## Pesan autentikasi dan batas rate {#authentication-and-rate-limit-messages}

Pesan autentikasi yang didokumentasikan meliputi:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Kunci berlingkup yang digunakan di luar lingkupnya mengembalikan `403` dengan body bertingkat: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Resource platform Agents mengembalikan `code` yang sama dalam envelope mereka sendiri.

Pesan batas rate yang didokumentasikan adalah `organization rate limit exceeded` (batas permintaan per menit yang ditetapkan untuk organisasi,
dibagi oleh semua kunci API-nya). Respons `429` saat ini tidak menyertakan header `Retry-After` atau
`X-RateLimit-*`, dan tidak ada nilai default RPM atau konkurensi universal yang dipublikasikan.

## Pencarian model dan resource {#model-and-resource-lookup}

Gunakan `GET /v1/models` untuk menemukan ID model yang aktif dan `GET /v1/models/{id_or_name}` untuk memeriksa model sebelum
eksekusi. Perlakukan ID resource sebagai opaque dan verifikasi dengan operasi list atau get yang relevan. Jangan menyusun
URL polling yang berbeda dari prefiks ID.

## Algoritme percobaan ulang {#retry-algorithm}

Gunakan exponential backoff terbatas dengan jitter:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

Terapkan aturan berikut:

- coba ulang `429` setelah jeda yang dihitung oleh klien;
- coba ulang respons `5xx` sementara hanya dalam jumlah kecil yang terbatas;
- jangan coba ulang permintaan `400`, `401`, `402`, `403`, atau `404` tanpa perubahan;
- periksa idempotensi sebelum mengulang permintaan create, trigger, atau tindakan eksternal apa pun;
- simpan output parsial saat stream gagal dan putuskan apakah melanjutkan atau memulai ulang aman;
- sampaikan status HTTP akhir dan error khusus endpoint yang sudah disanitasi kepada pemanggil.

## Error platform Agents {#agents-platform-errors}

Agents, Sessions, Skills, koneksi MCP, dan Secrets mengembalikan satu envelope. Untuk sebagian besar kode, `message` berupa kalimat tetap yang aman; `invalid_request` dapat membawa penjelasan singkat, seperti bentuk input atau opsi mana yang tidak didukung. Lakukan percabangan berdasarkan `code`, bukan `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` bernilai `authentication_error` untuk 401, `server_error` untuk 5xx, dan `invalid_request_error` untuk lainnya.

| HTTP | `code` | Arti | Yang harus dilakukan |
|---|---|---|---|
| 400 | `invalid_request` | Field salah format atau tidak dikenal, validasi gagal, atau opsi tidak didukung | Perbaiki permintaan; jangan coba ulang tanpa perubahan |
| 400 | `skill_not_found` | Skill atau versi yang direferensikan tidak tersedia | Perbaiki `skills` milik Agent |
| 401 | `unauthorized` | Header kunci API tidak ada, tidak valid, atau saling bertentangan | Periksa `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Batas pengeluaran kunci atau saldo organisasi habis | Tambahkan kredit atau naikkan batas |
| 403 | `insufficient_scope` | Kunci berlingkup dan tidak dapat menggunakan resource Agents | Gunakan kunci standar yang dibuat di Console |
| 403 | `org_disabled` | Organisasi tidak diizinkan menjalankan Agents | Hubungi dukungan |
| 404 | `not_found` | Resource tidak ada di organisasi Anda | Periksa ID |
| 409 | `conflict` | `row_version` usang, status yang tidak mengizinkan perubahan, atau `Idempotency-Key` yang digunakan ulang dengan body berbeda | Baca ulang resource, lalu putuskan |
| 409 | `session_input_pending` | Input sebelumnya masih dalam proses pengiriman | Tunggu; jangan kirim ulang dengan kunci baru |
| 409 | `session_input_expired` | Penerimaan input telah kedaluwarsa | Periksa riwayat sebelum mengirim lagi |
| 409 | `session_environment_unavailable` | Lingkungan eksekusi tidak tersedia | Tunggu atau buat Session baru |
| 413 | `request_too_large` | Body permintaan, atau konfigurasi Session yang dibekukan darinya, melebihi batas ukuran | Kirim body yang lebih kecil; jangan coba ulang tanpa perubahan |
| 429 | `quota_exceeded` | Kuota Agents terlampaui | Coba lagi nanti |
| 502 | `executor_rejected`, `executor_contract_error` | Lapisan eksekusi menolak permintaan atau memberikan jawaban yang tidak terduga | Periksa konfigurasi Agent, lalu coba ulang |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Dependensi sementara tidak tersedia | Coba ulang dengan backoff dan `Idempotency-Key` yang sama |

`skill_runtime_incompatible` juga dapat muncul; kode ini dikembalikan sebagai 503 dengan pesan `internal error`.

## Kegagalan streaming {#streaming-failures}

Setelah respons streaming dimulai, kegagalan dapat datang dalam format stream protokol, bukan sebagai status HTTP
baru. Perlakukan stream sebagai tidak lengkap, tutup stream, simpan konten parsial yang dibutuhkan aplikasi, dan
coba ulang hanya jika permintaan aman untuk diulang.

## Lihat juga {#see-also}

- [Kode Error](/api-reference/errors) — format respons publik dan status HTTP umum
- [Batas rate](/guides/rate-limiting) — penanganan 429 dan perataan permintaan
- [Error dan percobaan ulang](/guides/error-handling) — pola implementasi
- [Autentikasi](/api-reference/authentication) — kredensial yang didukung dan siklus hidup kunci
