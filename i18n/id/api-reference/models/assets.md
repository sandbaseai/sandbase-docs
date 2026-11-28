---
i18nSource: 43d08f60800d37f5
title: Media Assets API
description: Daftarkan Asset media yang dapat digunakan ulang dan ambil metadata serta URL unduhan terkininya.
---

# Media Assets API {#media-assets-api}

Gunakan protokol Asset yang kompatibel dengan versi resmi di `/v1/assets` untuk mendaftarkan URL media dan mendapatkan `asset_url` untuk
permintaan pembuatan video native.

Untuk contoh menyeluruh yang mendaftarkan media dan menggunakan referensi `asset://` yang dikembalikan dengan Seedance, lihat
[Menggunakan Asset media terdaftar](/api-reference/volcengine-contents-generations#use-registered-media-assets) di referensi Seedance.

## Ikhtisar {#overview}

| Metode | Path | Deskripsi |
|--------|------|-------------|
| `POST` | `/v1/assets` | Mendaftarkan Asset |
| `GET` | `/v1/assets/{id}` | Mendapatkan metadata Asset dan URL unduhan terkini |

## POST /v1/assets {#post-v1-assets}

Mendaftarkan URL file yang dapat diakses publik ke pustaka aset dan mengembalikan `asset_url` yang dapat dirujuk dalam permintaan pembuatan video.

### Permintaan {#request}

```http
POST /v1/assets
Authorization: Bearer $SANDBASE_API_KEY
Content-Type: application/json
```

```json
{
  "url": "https://example.com/tea-ad.mp4",
  "asset_type": "Video",
  "name": "Tea ad reference video"
}
```

| Field | Tipe | Wajib | Deskripsi |
|-------|------|----------|--------------|
| `url` | string | Ya | URL file yang dapat diakses publik |
| `asset_type` | string | Ya | Tipe aset: `Image` / `Video` / `Audio` (peka huruf besar-kecil) |
| `name` | string | Tidak | Nama aset opsional |

### Respons {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Field | Deskripsi |
|-------|--------------|
| `id` | ID record internal |
| `asset_url` | Alamat referensi yang digunakan dalam permintaan pembuatan video |
| `asset_type` | Tipe aset |
| `name` | Nama aset |
| `created_at` | Timestamp pembuatan |

### Menggunakan asset_url {#using-asset-url}

Setelah terdaftar, teruskan `asset_url` ke field input yang menerima referensi Asset dalam skema live model yang dipilih. Nama field berbeda-beda per model; misalnya:

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### Error {#errors}

| Status HTTP | Deskripsi |
|-------------|--------------|
| 400 | Field wajib tidak ada atau `asset_type` tidak valid |
| 502 | Pendaftaran aset di upstream gagal |
| 500 | Tidak ada kredensial yang tersedia atau terjadi error internal |

---

## GET /v1/assets/{id}

Mengambil URL unduhan bertanda tangan untuk aset terdaftar berdasarkan ID eksternalnya. Digunakan untuk pratinjau atau mengunduh file yang mendasarinya.

### Permintaan {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| Parameter | Lokasi | Deskripsi |
|-----------|----------|--------------|
| `id` | path | ID eksternal (bagian setelah `asset://` dalam `asset_url`) |

### Respons {#response-1}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "download_url": "https://cdn.example.com/...?X-Tos-Expires=43200",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Field | Deskripsi |
|-------|--------------|
| `asset_url` | Alamat referensi untuk pembuatan video (permanen) |
| `status` | Status siklus hidup Asset yang dilaporkan penyedia. Perlakukan sebagai string terbuka. |
| `download_url` | URL unduhan yang dikembalikan penyedia; bisa kosong selama Asset belum siap |

### Error {#errors-1}

| Status HTTP | Deskripsi |
|-------------|--------------|
| 404 | Asset tidak ditemukan atau bukan milik organisasi Anda |
| 502 | Kueri upstream gagal |

---

## Catatan {#notes}

::: tip Penting
- `asset_url` berformat `asset://{external_id}` dan merupakan referensi yang dapat digunakan ulang untuk diteruskan ke input model yang didukung
- Perlakukan `download_url` sebagai nilai yang dikelola penyedia. Jika kosong atau tidak berfungsi lagi, kueri endpoint ini lagi untuk mendapatkan nilai terkini
- `asset_type` peka huruf besar-kecil: `Image` / `Video` / `Audio`
- URL yang dikirim harus dapat diakses publik (platform harus dapat mengambilnya)
:::

