---
i18nSource: 4bd032d88bac0470
title: Video Seedance (Protokol Volcengine Ark)
description: Buat video Seedance 2.0 dan 2.5 melalui protokol tugas Volcengine Ark Contents Generations, termasuk input, polling, penagihan, dan media Asset.
aside: false
outline: false
apiReference:
  title: Video Seedance
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Kirim tugas video Seedance. Pengiriman yang berhasil mengembalikan HTTP 200 dan id tugas SandBase.
  groups:
    - title: Body permintaan
      fields:
        - name: model
          type: string
          required: true
          description: "Pengenal model yang didukung: bytedance/seedance/2.0-official atau bytedance/seedance/2.5-official."
        - name: content
          type: array
          required: true
          description: Input teks bertipe dan input media opsional. Bentuk item divalidasi oleh model.
        - name: duration
          type: integer
          required: false
          description: Diteruskan ke model tanpa perubahan. Validasi model berlaku.
        - name: resolution
          type: string
          required: false
          description: Diteruskan ke model tanpa perubahan. Validasi model berlaku.
        - name: ratio
          type: string
          required: false
          description: Diteruskan ke model tanpa perubahan. Validasi model berlaku.
        - name: generate_audio
          type: boolean
          required: false
          description: Diteruskan ke model tanpa perubahan. Minta audio yang dihasilkan jika didukung.
  examples:
    - label: Text to video
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "bytedance/seedance/2.0-official",
            "content": [{"type": "text", "text": "A paper boat crossing a rain puddle"}],
            "duration": 5,
            "resolution": "720p"
          }'
  response:
    status: 200 OK
    code: '{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }'
---

<ApiReferencePage />

## Panduan Seedance {#seedance-guide}

Seedance membuat video dari teks, frame pembuka dan penutup, serta referensi multimodal seperti gambar, video, dan
audio. Gunakan untuk apa saja, mulai dari klip text-to-video sederhana hingga shot terarah yang mengikuti subjek visual, gerakan
kamera, dan soundtrack.

Pembuatan bersifat asinkron. Kirim tugas, lalu lakukan polling hingga tugas mencapai status terminal.

## Memilih model {#choosing-a-model}

| `model` | Paling cocok untuk | Resolusi output |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | Hasil 1080p dan resolusi output tertinggi yang tersedia | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | Pembuatan dengan biaya lebih rendah jika 480p atau 720p sudah cukup | 480p, 720p |

Kedua model menerima input multimodal yang sama dan mendukung alur kerja text-to-video, image-to-video, dan referensi multimodal
dalam satu bentuk permintaan. Pilih `2.0-official` jika 480p atau 720p memenuhi kebutuhan Anda dan Anda menginginkan opsi
yang lebih murah. Pilih `2.5-official` jika Anda membutuhkan 1080p.

## Referensi API {#api-reference}

| Metode | Path |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

Menampilkan daftar tugas serta membatalkan atau menghapus tugas tidak didukung. Simpan `id` tugas yang dikembalikan untuk mengambil hasilnya.

Autentikasi setiap permintaan dengan kunci API yang sama yang digunakan untuk membuat tugas:

```
Authorization: Bearer $SANDBASE_API_KEY
```

Nilai `model` harus cocok dengan salah satu nama di [Memilih model](#choosing-a-model). Polling adalah cara yang didukung untuk
menerima hasil; jangan mengandalkan `callback_url` untuk endpoint ini.

## Mulai cepat {#quickstart}

Kirim tugas:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "A slow cinematic push across an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "generate_audio": true
  }'
```

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

Lakukan polling tugas dengan id tersebut setiap 5 hingga 10 detik hingga `status` bernilai `succeeded`, `failed`, `expired`, atau `cancelled`:

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.5-official",
  "status": "succeeded",
  "created_at": 1787059000,
  "updated_at": 1787059150,
  "content": { "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4" },
  "usage": { "completion_tokens": 108900, "total_tokens": 108900 }
}
```

Video yang dihasilkan tersedia di `content.video_url`.

## Memilih alur kerja input {#choose-an-input-workflow}

API mendukung tujuh alur kerja input umum. Setiap item di `content` memiliki `type`; kombinasi jenis item dan
role menentukan alur kerjanya:

| Tujuan | Kombinasi `content` | Gunakan jika |
| --- | --- | --- |
| Teks ke video | Teks | Adegan dapat dijelaskan sepenuhnya dalam prompt |
| Menganimasikan frame pembuka | Teks (opsional) + gambar dengan `first_frame` | Frame pertama harus sesuai dengan gambar yang diberikan |
| Transisi antara dua frame | Teks (opsional) + `first_frame` + `last_frame` | Shot memerlukan awal dan akhir yang terkontrol |
| Mengikuti referensi visual | Teks (opsional) + gambar dengan `reference_image` | Subjek, produk, kostum, atau gaya visual harus tetap dikenali |
| Mengikuti gerakan atau bahasa kamera | Teks (opsional) + video dengan `reference_video` | Gerakan, timing, ritme editing, atau gerakan kamera berasal dari klip referensi |
| Menambahkan referensi audio | Teks/gambar/video + audio dengan `reference_audio` | Dialog, musik, suara, atau desain suara harus memandu hasilnya |
| Arahan multimodal penuh | Referensi teks + gambar + video + audio | Aset yang berbeda mengontrol tampilan, gerakan, dan suara dalam satu shot |

Audio tidak dapat berdiri sendiri. Setiap permintaan yang menyertakan item audio juga harus menyertakan setidaknya satu item teks, gambar, atau video.

### Bentuk item content {#content-item-shapes}

```json
{ "type": "text", "text": "A puppy running across a sunlit lawn" }
```

```json
{ "type": "image_url", "image_url": { "url": "https://example.com/ref.jpg" }, "role": "reference_image" }
```

```json
{ "type": "video_url", "video_url": { "url": "https://example.com/ref.mp4" }, "role": "reference_video" }
```

```json
{ "type": "audio_url", "audio_url": { "url": "https://example.com/bgm.mp3" }, "role": "reference_audio" }
```

`role` menentukan cara model menggunakan aset:

| Aset | `role` | Efek |
| --- | --- | --- |
| Gambar | `first_frame` | Gunakan gambar sebagai frame pembuka |
| Gambar | `last_frame` | Gunakan gambar sebagai frame penutup; sertakan `first_frame` dalam permintaan yang sama |
| Gambar | `reference_image` | Referensikan subjek, komposisi, produk, kostum, atau gaya visual |
| Video | `reference_video` | Referensikan gerakan, kerja kamera, timing, atau ritme editing |
| Audio | `reference_audio` | Referensikan suara, dialog, musik, atau desain suara |

Item gambar menerima URL publik atau nilai inline `data:image/...;base64,...`. Referensi video dan audio sebaiknya
menggunakan URL publik yang dapat diunduh oleh model.

Menyertakan item `video_url` apa pun membuat permintaan masuk ke mode video-to-video, yang mengubah tarif token. Lihat
[Penagihan](#billing).

## Resep umum {#common-recipes}

Contoh di bawah menunjukkan body permintaan. Kirim salah satunya ke endpoint pembuatan tugas yang ditunjukkan di [Mulai cepat](#quickstart).

### Menganimasikan frame pertama {#animate-a-first-frame}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "The woman slowly looks up and smiles as the camera gently pushes in"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 5,
  "generate_audio": true
}
```

### Membuat transisi dari frame pertama ke frame terakhir {#create-a-first-to-last-frame-transition}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "A smooth transition from a bright afternoon into a neon-lit night"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"},
    {"type": "image_url", "image_url": {"url": "https://example.com/last-frame.jpg"}, "role": "last_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 6
}
```

### Mengarahkan shot dengan referensi gambar, video, dan audio {#direct-a-shot-with-image-video-and-audio-references}

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "First-person fruit tea commercial, camera pushes in on the layered foam"},
      {"type": "image_url", "image_url": {"url": "https://example.com/ref.jpg"}, "role": "reference_image"},
      {"type": "video_url", "video_url": {"url": "https://example.com/ref.mp4"}, "role": "reference_video"},
      {"type": "audio_url", "audio_url": {"url": "https://example.com/bgm.mp3"}, "role": "reference_audio"}
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 11
  }'
```

Gunakan prompt untuk memberikan tugas yang jelas bagi setiap referensi: misalnya, “pertahankan tampilan produk dari gambar, gunakan
gerakan kamera dari video, dan ikuti tempo audio.” Cara ini lebih andal daripada meminta setiap aset
mengontrol seluruh hasil.

## Menulis prompt yang efektif {#writing-an-effective-prompt}

Prompt yang praktis biasanya mengikuti urutan ini:

1. **Subjek** — siapa atau apa yang muncul dalam shot.
2. **Aksi** — apa yang berubah atau bergerak.
3. **Adegan** — lokasi, waktu, cuaca, dan detail di sekitarnya.
4. **Gaya visual** — sinematik, dokumenter, iklan produk, animasi, dan sebagainya.
5. **Kamera** — framing, nuansa lensa, gerakan kamera, dan potongan.
6. **Suara** — dialog, suasana, musik, atau efek saat `generate_audio` diaktifkan.

Nyatakan secara eksplisit apa yang harus tetap stabil. Misalnya: “Label produk tetap terbaca, kamera melakukan satu push-in
lambat, tanpa potongan adegan, room tone alami.” Jika ada beberapa referensi, jelaskan kualitas visual atau gerakan mana
yang diambil dari masing-masing referensi.

## Opsi output {#output-options}

| Parameter | Tipe | Default | Nilai |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`, `720p`, `1080p`. `2.0-official` tidak mendukung `1080p` |
| `ratio` | string | `adaptive` | `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`, `adaptive`. `adaptive` memilih rasio dari input dan prompt |
| `duration` | integer | `5` | 4 hingga 15 detik, atau `-1` agar model memilih dalam rentang yang didukung |
| `generate_audio` | boolean | `true` | Membuat suara, efek suara, dan musik latar yang tersinkronisasi |
| `seed` | integer | `-1` | `-1` hingga `2^32-1`. Prompt dan seed yang sama menghasilkan output yang mirip, tetapi tidak identik |
| `watermark` | boolean | `false` | Menambahkan watermark hasil AI di sudut kanan bawah |
| `tools` | array | `[]` | `[{"type": "web_search"}]` mengaktifkan pencarian web saat merencanakan shot |

### Kontrol tugas {#task-control}

| Parameter | Tipe | Default | Catatan |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | Batas waktu tugas dalam detik, dari 3600 hingga 259200. Tugas yang melewati batas ini menjadi `expired` |
| `service_tier` | string | `default` | Model ini tidak mendukung `flex` |
| `safety_identifier` | string | — | Pengenal pengguna akhir yang opaque, maksimal 64 karakter. Kirim hash, bukan data pribadi mentah |

### Ukuran frame {#frame-size}

`resolution` dan `ratio` bersama-sama menentukan dimensi piksel:

| Resolusi | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## Status tugas {#task-status}

| `status` | Arti | Yang harus dilakukan |
| --- | --- | --- |
| `queued` | Diterima, menunggu untuk dimulai | Terus lakukan polling setiap 5 hingga 10 detik |
| `running` | Sedang dibuat | Terus lakukan polling |
| `succeeded` | Selesai | Unduh `content.video_url` |
| `failed` | Ditolak oleh peninjauan konten, atau model mengalami error | Baca `error.message`. Sesuaikan prompt sebelum mencoba ulang |
| `expired` | Melewati `execution_expires_after` | Kirim ulang |
| `cancelled` | Berakhir sebelum pembuatan dimulai | Kirim ulang |

### Field tugas {#task-fields}

| Field | Tipe | Catatan |
| --- | --- | --- |
| `id` | string | id tugas yang dikembalikan saat pengiriman |
| `model` | string | Nilai `model` yang Anda kirim |
| `status` | string | Lihat di atas |
| `created_at` | integer | Detik Unix |
| `updated_at` | integer | Detik Unix. Sama dengan `created_at` hingga tugas selesai |
| `content` | object | Kosong hingga tugas berhasil. Berisi `video_url` yang dihasilkan |
| `usage` | object | Jumlah token. Lihat [Penagihan](#billing) |
| `error` | object | Ada untuk `failed` dan `expired`. Berisi `code` dan `message` |

### Alur Python lengkap {#complete-python-flow}

```python
import os
import time

import requests

BASE_URL = "https://api.sandbase.ai/api/v3/contents/generations/tasks"
HEADERS = {
    "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
    "Content-Type": "application/json",
}

task = requests.post(
    BASE_URL,
    headers=HEADERS,
    json={
        "model": "bytedance/seedance/2.5-official",
        "content": [
            {
                "type": "text",
                "text": "A quiet shoreline at sunrise, gentle waves, one slow camera push-in",
            }
        ],
        "ratio": "16:9",
        "resolution": "720p",
        "duration": 5,
        "generate_audio": True,
    },
)
task.raise_for_status()
task_id = task.json()["id"]

while True:
    time.sleep(8)
    result = requests.get(f"{BASE_URL}/{task_id}", headers=HEADERS)
    result.raise_for_status()
    data = result.json()
    print(data["status"])

    if data["status"] == "succeeded":
        print(data["content"]["video_url"])
        break
    if data["status"] in {"failed", "expired", "cancelled"}:
        raise RuntimeError(data.get("error", {"message": data["status"]}))
```

## Penagihan {#billing}

Model ini ditagih berdasarkan `usage.completion_tokens`, yang dilaporkan tugas saat selesai. Tarif token bergantung pada dua
dimensi:

- **Apakah input menyertakan video.** Permintaan video-to-video, yaitu item `content` apa pun dengan tipe `video_url`, ditagih dengan
  tarif lebih rendah daripada text-to-video.
- **Resolusi output.** Untuk `2.5-official`, 1080p ditagih lebih tinggi daripada 480p dan 720p. Tarif `2.0-official` tidak bervariasi
  berdasarkan resolusi.

`usage` melaporkan `completion_tokens` dan `total_tokens`, yang saat ini bernilai sama. Field ini kosong selama tugas berjalan.
Lihat [riwayat akun](/api-reference/account/history) Anda untuk biaya aktual, dan
[panduan harga](/guides/billing) untuk tarif saat ini.

## Error {#errors}

Permintaan yang tidak valid langsung mengembalikan error. Error saat pembuatan muncul di tugas setelah polling. Keduanya menggunakan
objek `error` dengan `code` yang dapat dibaca mesin dan `message` yang dapat dibaca manusia:

```json
{ "error": { "code": "InvalidParameter", "message": "model is required", "type": "BadRequest" } }
```

| HTTP | `code` | `type` |
| --- | --- | --- |
| 400 | `InvalidParameter` | `BadRequest` |
| 401 | `AuthenticationError` | `Unauthorized` |
| 403 | `PermissionDenied` | `Forbidden` |
| 404 | `ResourceNotFound` | `NotFound` |
| 429 | `RateLimitExceeded` | `TooManyRequests` |
| 500 | `InternalServiceError` | `InternalServerError` |
| 503 | `InternalServiceError` | `ServiceUnavailable` |

Langkah pemulihan umum:

| Hasil | Yang dapat dicoba |
| --- | --- |
| `400 InvalidParameter` | Periksa nama model, konten wajib, role, resolusi, durasi, dan URL aset |
| Status tugas `failed` dengan error peninjauan konten | Tulis ulang prompt atau ganti aset referensi yang ditandai sebelum mengirim ulang |
| Status tugas `expired` | Kirim tugas baru; pertimbangkan `execution_expires_after` yang lebih lama untuk klip beresolusi tinggi atau panjang |
| `429 RateLimitExceeded` | Coba ulang dengan exponential backoff dan kurangi pengiriman serentak |
| `503 ServiceUnavailable` | Coba ulang permintaan yang sama setelah jeda singkat |

## Menggunakan media Asset yang terdaftar {#use-registered-media-assets}

SandBase menyediakan protokol Asset yang kompatibel dengan versi resmi di `/v1/assets`. Permintaan Asset dan referensi `asset://` yang dikembalikan
mengikuti protokol resmi, dan referensi tersebut diteruskan tanpa perubahan dalam permintaan ByteDance Contents
Generations native. Baik
`bytedance/seedance/2.5-official` maupun `bytedance/seedance/2.0-official` menerima referensi tersebut
di tempat yang biasanya menerima URL HTTP(S) publik.

Alur kerja lengkapnya adalah:

1. Daftarkan URL media yang dapat dijangkau dengan `POST /v1/assets`.
2. Query `GET /v1/assets/{external_id}` hingga penyedia melaporkan bahwa Asset dapat digunakan.
3. Masukkan `asset_url` yang dikembalikan ke item `content` Seedance dan kirim tugas pembuatan.

### Operasi Asset yang kompatibel dengan versi resmi {#official-compatible-asset-operations}

| Metode | Path | Tujuan |
| --- | --- | --- |
| `POST` | `/v1/assets` | Mendaftarkan URL media yang dapat dijangkau dan menerima referensi `asset://` yang kompatibel dengan versi resmi |
| `GET` | `/v1/assets/{external_id}` | Membaca status penyedia dan mendapatkan URL pratinjau/unduhan saat ini |

Saat ini API publik hanya menyediakan pendaftaran dan pencarian. Grup Asset, daftar, penggantian nama, pembaruan, dan penghapusan
bukan operasi publik. Asset dimiliki oleh organisasi yang terkait dengan kunci API.

### Langkah 1: daftarkan Asset {#step-1-register-the-asset}

Kirim URL yang dapat dijangkau ke `POST /v1/assets`. `asset_type` peka huruf besar/kecil dan harus berupa `Image`, `Video`, atau `Audio`:

```bash
curl -X POST https://api.sandbase.ai/v1/assets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/product-reference.png",
    "asset_type": "Image",
    "name": "Product reference"
  }'
```

Simpan `asset_url` dari respons:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

Nilai setelah `asset://` adalah `external_id` yang digunakan oleh operasi pencarian yang kompatibel dengan versi resmi.

### Langkah 2: periksa kesiapan {#step-2-check-readiness}

Query Asset dengan `external_id`, tanpa prefiks `asset://`:

```bash
curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Image",
  "name": "Product reference",
  "download_url": "https://media.example.com/current-signed-url",
  "created_at": "2026-07-10T15:04:03Z"
}
```

Perlakukan `status` sebagai nilai penyedia yang terbuka, bukan enum yang lengkap. Tunggu hingga penyedia melaporkan status
yang dapat digunakan sebelum mengirim tugas pembuatan; nilai siap yang umum adalah `Active`. `download_url` dikelola penyedia dan
dapat kosong selama pemrosesan. Query Asset lagi jika Anda memerlukan URL pratinjau terbaru. Tetap gunakan `asset_url`
yang persisten dalam permintaan Seedance, alih-alih menyalin `download_url`.

### Langkah 3: buat video dengan Asset {#step-3-generate-with-the-asset}

Tempatkan `asset_url` di field URL yang sesuai dengan jenis media. Contoh ini menggunakan gambar terdaftar sebagai referensi
visual:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {
        "type": "text",
        "text": "Create a cinematic product shot. Keep the bottle shape and label from the reference image."
      },
      {
        "type": "image_url",
        "image_url": {"url": "asset://asset-20260710150403-hx4hf"},
        "role": "reference_image"
      }
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 5,
    "generate_audio": true
  }'
```

Respons pembuatan mengembalikan `id` tugas. Lakukan polling
`GET /api/v3/contents/generations/tasks/{task_id}` seperti dijelaskan di halaman model yang dipilih.

### Memilih item content dan role {#choose-the-content-item-and-role}

| Jenis Asset | `content[].type` | Field URL | Role yang didukung | Gunakan untuk |
| --- | --- | --- | --- | --- |
| Gambar | `image_url` | `image_url.url` | `first_frame` | Memulai video dari frame persis ini |
| Gambar | `image_url` | `image_url.url` | `last_frame` | Mengakhiri pada frame ini; sertakan `first_frame` dalam permintaan yang sama |
| Gambar | `image_url` | `image_url.url` | `reference_image` | Mempertahankan subjek, produk, komposisi, kostum, atau gaya visual |
| Video | `video_url` | `video_url.url` | `reference_video` | Mengikuti gerakan, timing, kerja kamera, atau ritme editing |
| Audio | `audio_url` | `audio_url.url` | `reference_audio` | Mengikuti suara, dialog, musik, atau desain suara |

Audio tidak dapat menjadi satu-satunya input. Gabungkan Asset `reference_audio` dengan teks, gambar, atau video. Setiap permintaan yang
berisi `video_url` menggunakan tarif penagihan video-to-video.

#### Contoh Asset video {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### Contoh Asset audio {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### URL langsung atau referensi `asset://`? {#direct-url-or-asset-reference}

| Input | Paling cocok jika | Pertimbangan |
| --- | --- | --- |
| URL HTTP(S) publik | Media sudah di-hosting dan digunakan sekali | Jalur tercepat, tetapi URL harus tetap dapat dijangkau selama pengiriman tugas dan pengambilan oleh penyedia |
| Referensi `asset://` | Media digunakan ulang melalui protokol Asset resmi | Menambahkan langkah pendaftaran/kesiapan, lalu memberikan referensi persisten untuk tugas Seedance berikutnya |

Untuk parameter permintaan, polling, status tugas, dan penagihan, lihat [Panduan Seedance](#seedance-guide) di atas.

## Sumber resmi ByteDance {#official-bytedance-resources}
- [Dokumentasi pembuatan video Seedance](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [API pembuatan tugas contents generation](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Panduan prompt Seedance 2.0](https://www.volcengine.com/docs/82379/2222480?lang=en)
