---
i18nSource: ac4e3b9b9eef4c7d
title: Error API
description: Tangani error API SandBase berdasarkan status HTTP, keluarga endpoint, bentuk respons yang didokumentasikan, dan keamanan percobaan ulang.
---

# Error API {#api-errors}

SandBase menggunakan kode status HTTP standar, tetapi tidak menyediakan satu body error universal. Tentukan percabangan berdasarkan status HTTP terlebih dahulu, lalu parse skema respons yang didokumentasikan untuk endpoint yang Anda panggil. Jangan mengharuskan setiap error berisi `code`, `param`, `message`, atau `request_id`.

## Bentuk respons {#response-shapes}

Middleware inti dan beberapa endpoint `/v1/*` mengembalikan error datar:

```json
{"error":"organization rate limit exceeded"}
```

Resource platform Agents (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*`) mengembalikan objek bergaya OpenAI dengan `code` yang stabil. Lihat [Error platform Agents](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Events API webhook (`/events/webhooks*`) mengembalikan `{"code":<http status>,"message":"..."}`. Lihat [Webhooks](/api-reference/webhooks#authentication-and-errors).

Endpoint yang kompatibel dengan OpenAI mempertahankan envelope yang kompatibel dengan OpenAI. `POST /v1/messages` mempertahankan envelope yang kompatibel dengan Anthropic:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

Gunakan [spesifikasi OpenAPI](/openapi.yaml) untuk kode status dan skema yang tepat dari operasi publik.

## Penanganan status HTTP {#http-status-handling}

| Status | Arti umum | Tindakan klien |
|---|---|---|
| `400` | Input tidak valid atau parameter tidak didukung | Perbaiki permintaan berdasarkan skema endpoint dan model yang dipilih. |
| `401` | Kredensial tidak ada, tidak valid, dicabut, atau kedaluwarsa | Ganti atau rotasi kredensial; jangan coba ulang tanpa perubahan. |
| `402` | Permintaan tidak dapat didanai atau batas pengeluaran tercapai | Selesaikan masalah saldo atau batas key sebelum mencoba ulang. |
| `403` | Kredensial tidak memiliki izin, atau endpoint kompatibilitas memetakan kegagalan pengeluaran ke 403 | Periksa envelope khusus endpoint dan gunakan key yang berwenang. |
| `404` | Model atau resource tidak tersedia bagi pemanggil | Verifikasi ID model atau ID resource saat ini. |
| `409` | Konflik status resource | Baca status terbaru sebelum memutuskan apakah percobaan ulang aman. |
| `422` | Input resource tidak valid secara semantik | Perbaiki nilai field yang didokumentasikan. |
| `429` | Batas permintaan organisasi atau batas konkurensi video | Coba ulang dengan backoff terbatas dan jitter jika operasi aman diulang. |
| `500`, `502`, `503`, `504` | Kegagalan SandBase atau upstream | Coba ulang hanya jika operasi aman diulang. |

Tidak setiap endpoint mendokumentasikan setiap status dalam tabel ini. Peta respons OpenAPI dari operasi tersebut yang menjadi acuan.

## Error autentikasi {#authentication-errors}

Pesan autentikasi yang didokumentasikan meliputi:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Key dengan scope yang digunakan di luar scope-nya justru mengembalikan `403` dengan body bertingkat: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Resource platform Agents mengembalikan `code` yang sama dalam envelope mereka sendiri.

Gunakan `Authorization: Bearer $SANDBASE_API_KEY` untuk endpoint standar. `POST /v1/messages` juga menerima `x-api-key`; endpoint Google yang kompatibel secara protokol mendokumentasikan header key yang didukungnya sendiri.

Key yang telah dicabut tidak dapat diaktifkan kembali. Buat key pengganti, perbarui aplikasi yang menggunakannya, verifikasi, lalu hapus semua referensi yang tersisa ke key lama.

## Batas laju {#rate-limits}

`organization rate limit exceeded` (`429`) berarti organisasi Anda telah mencapai batas permintaan per menit yang ditetapkan, yang digunakan bersama oleh semua API key-nya. Endpoint yang kompatibel secara protokol mengembalikannya dalam envelope mereka sendiri. SandBase tidak memublikasikan satu batas numerik universal karena batas ditetapkan per organisasi.

Jika respons menyertakan `Retry-After`, patuhi nilainya. Jika tidak, gunakan exponential backoff terbatas dengan jitter. Lihat [Batas laju](/guides/rate-limiting) untuk pola meratakan permintaan.

Pengiriman tugas memiliki dua pemeriksaan tambahan. `organization concurrency limit exceeded` (`429`) berarti organisasi Anda sudah memiliki tugas berjalan sebanyak yang diizinkan level akunnya; kondisi ini hilang saat tugas yang berjalan selesai. Pemeriksaan ini berlaku untuk setiap jenis model pada `POST /v1/run` dan `/v1/api/*`, serta untuk pengiriman video di endpoint lain. `insufficient credit for estimated video cost` (`402`) berarti estimasi biaya melebihi saldo ditambah batas kredit Anda; lakukan top-up sebelum mencoba ulang. Lihat [Batas konkurensi](/guides/concurrency-limits).

## Keamanan percobaan ulang {#retry-safety}

Gunakan urutan keputusan berikut:

1. Tentukan apakah operasi sudah menghasilkan efek yang terlihat secara eksternal.
2. Jangan coba ulang permintaan `400`, `401`, `402`, `403`, `404`, atau `422` tanpa perubahan.
3. Untuk `409`, baca status resource saat ini sebelum mencoba ulang.
4. Coba ulang respons `429` dan `5xx` sementara hanya dalam jumlah kecil dan terbatas.
5. Sebelum mengulangi permintaan create, trigger, upload, atau tindakan eksternal, pastikan operasi bersifat idempoten atau aplikasi Anda dapat merekonsiliasi duplikat.

Penundaan yang sesuai adalah:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Error platform Agents {#agents-platform-errors}

Agents, Sessions, Skills, koneksi MCP, dan Secrets mengembalikan satu envelope. Untuk sebagian besar kode, `message` berupa kalimat tetap yang aman; `invalid_request` dapat membawa penjelasan singkat, misalnya bentuk input atau opsi mana yang tidak didukung. Tentukan percabangan berdasarkan `code`, bukan `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` bernilai `authentication_error` untuk 401, `server_error` untuk 5xx, dan `invalid_request_error` untuk lainnya.

| HTTP | `code` | Arti | Yang harus dilakukan |
|---|---|---|---|
| 400 | `invalid_request` | Field salah format atau tidak dikenal, validasi gagal, atau opsi tidak didukung | Perbaiki permintaan; jangan coba ulang tanpa perubahan |
| 400 | `skill_not_found` | Skill atau versi yang dirujuk tidak tersedia | Perbaiki `skills` pada Agent |
| 401 | `unauthorized` | Header API key tidak ada, tidak valid, atau saling bertentangan | Periksa `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Batas pengeluaran key atau saldo organisasi habis | Tambahkan kredit atau naikkan batasnya |
| 403 | `insufficient_scope` | Key memiliki scope dan tidak dapat menggunakan resource Agents | Gunakan key standar yang dibuat di Console |
| 403 | `org_disabled` | Organisasi tidak diizinkan menjalankan Agents | Hubungi dukungan |
| 404 | `not_found` | Resource tidak ada di organisasi Anda | Periksa ID-nya |
| 409 | `conflict` | `row_version` usang, status yang tidak mengizinkan perubahan, atau `Idempotency-Key` yang digunakan ulang dengan body berbeda | Baca ulang resource, lalu putuskan |
| 409 | `session_input_pending` | Input sebelumnya masih sedang dikirim | Tunggu; jangan kirim ulang dengan key baru |
| 409 | `session_input_expired` | Penerimaan input kedaluwarsa | Periksa riwayat sebelum mengirim lagi |
| 409 | `session_environment_unavailable` | Lingkungan eksekusi tidak tersedia | Tunggu atau buat Session baru |
| 413 | `request_too_large` | Body permintaan, atau konfigurasi Session yang dibekukan darinya, melebihi batas ukuran | Kirim body yang lebih kecil; jangan coba ulang tanpa perubahan |
| 429 | `quota_exceeded` | Kuota Agents terlampaui | Coba lagi nanti |
| 502 | `executor_rejected`, `executor_contract_error` | Lapisan eksekusi menolak permintaan atau memberikan jawaban tak terduga | Periksa konfigurasi Agent, lalu coba ulang |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Sebuah dependensi untuk sementara tidak tersedia | Coba ulang dengan backoff dan `Idempotency-Key` yang sama |

`skill_runtime_incompatible` juga dapat muncul; kode ini dikembalikan sebagai 503 dengan pesan `internal error`.

## Kegagalan streaming {#streaming-failures}

Setelah stream dimulai, error dapat tiba dalam format stream protokol tersebut, bukan sebagai respons HTTP baru. Anggap stream tidak lengkap, simpan output parsial yang dibutuhkan aplikasi Anda, dan coba ulang hanya jika membuat ulang permintaan aman dilakukan. Jangan berasumsi setiap penyedia memancarkan event terminal atau finish reason yang sama.

## Debugging operasional {#operational-debugging}

Catat endpoint, status HTTP, ID model atau resource yang dipilih, timestamp, dan identifier permintaan aman apa pun yang dikembalikan server. Jangan pernah mencatat header otorisasi, API key, nilai kredensial, atau konten prompt yang sensitif.

Gunakan [Developer → Activities](https://www.sandbase.ai/console/activities) untuk memeriksa riwayat permintaan organisasi. Saat melaporkan kegagalan yang terus berulang, sertakan metadata permintaan yang sudah disanitasi dan permintaan terkecil yang dapat direproduksi.

## Lihat juga {#see-also}

- [Autentikasi](/api-reference/authentication)
- [Error dan percobaan ulang](/guides/error-handling)
- [Batas laju](/guides/rate-limiting)
- [Panduan Error yang dapat dibaca AI](/for-agents/errors)
