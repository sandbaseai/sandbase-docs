---
i18nSource: efd4d5f7b8980661
title: Webhooks
description: Daftarkan dan kelola webhook SandBase untuk event model asinkron.
---

# Webhooks {#webhooks}

SandBase mendukung dua mode callback keluar:

- **Webhook terdaftar** dibatasi untuk organisasi Anda, berlangganan event Model asinkron, dan menyertakan HMAC `X-Signature`.
- **Callback model per tugas** menggunakan `webhook_url` pada satu permintaan gambar, video, atau audio asinkron. Mode ini tidak memerlukan pendaftaran dan tidak menyertakan `X-Signature`.

Kedua mode menggunakan pengiriman at-least-once. Buat handler Anda idempoten dengan ID event.

## Mendaftarkan webhook {#register-a-webhook}

Events API adalah antarmuka publik berbasis API key:

```text
POST https://api.sandbase.ai/events/webhooks
```

Anda juga dapat membuat dan mengelola webhook dari [halaman Webhooks di Console](https://www.sandbase.ai/console/webhooks).

```bash
curl -X POST https://api.sandbase.ai/events/webhooks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Model generation monitor",
    "url": "https://example.com/hooks/sandbase",
    "resourceType": "model",
    "events": ["model.generation.completed", "model.generation.failed"]
  }'
```

| Field | Tipe | Wajib | Deskripsi |
|---|---|---:|---|
| `name` | string | Ya | Nama yang mudah dibaca. |
| `url` | string | Ya | Endpoint HTTP(S) yang valid. Gunakan HTTPS di produksi. |
| `resourceType` | `model` | Ya | Memilih event Model asinkron di bawah. `model` adalah satu-satunya nilai yang didukung. |
| `events` | string[] | Tidak | Kosong atau dihilangkan berarti semua event saat ini dan mendatang pada tipe resource yang dipilih. |
| `enabled` | boolean | Tidak | Default-nya `true`. |
| `signatureSecret` | string | Tidak | Hilangkan field ini agar SandBase membuat secret berentropi tinggi. Klien yang sudah ada boleh tetap memberikan nilai tidak kosong milik mereka sendiri. |

Tipe resource `session`, `sandbox`, dan `template` sudah tidak digunakan: membuat webhook dengan salah satunya menghasilkan HTTP 400. Pendaftaran yang sudah ada dengan tipe-tipe ini tetap dicantumkan agar dapat dibersihkan: `PATCH` pada pendaftaran tersebut menghasilkan HTTP 400 kecuali permintaan yang sama mengubah `resourceType` menjadi `model` (dan langganan yang dihasilkan valid), jadi hapus atau ubah menjadi `model`. Langganan `model` hanya tersedia untuk event terminal gambar, video, dan audio asinkron yang tercantum di bawah. API menolak event dari tipe resource lain dan nama event yang tidak dikenal.

### Respons berhasil {#successful-response}

Events API mengembalikan webhook yang terdaftar secara langsung. `signatureSecret` final hanya disertakan dalam respons pembuatan ini. Simpan dengan aman sekarang: respons daftar dan edit tidak pernah mengembalikannya, dan secret tidak dapat dipulihkan nanti.

```json
{
  "id": "wh_01...",
  "name": "Model generation monitor",
  "url": "https://example.com/hooks/sandbase",
  "resourceType": "model",
  "events": ["model.generation.completed", "model.generation.failed"],
  "enabled": true,
  "createdAt": "2026-07-15T12:00:00Z",
  "signatureSecret": "whsec_<one-time-value>"
}
```

[Halaman Webhooks di Console](https://www.sandbase.ai/console/webhooks) menampilkan secret yang dibuat satu kali setelah pendaftaran dan mengharuskan Anda menyimpannya sebelum menutup dialog.

### Mencantumkan, mengedit, dan menghapus {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

Gunakan autentikasi API key yang sama. `PATCH` dapat menyertakan satu atau beberapa dari `name`, `url`, `resourceType`, `events`, dan `enabled`; field yang dihilangkan tidak berubah. Langganan `resourceType` dan `events` yang dihasilkan secara keseluruhan harus valid. Array `events` kosong tetap berarti semua event pada tipe resource tersebut.

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

`signatureSecret` tidak dapat dilihat atau diubah melalui `PATCH`; permintaan yang berisi field tersebut ditolak. Jika secret hilang, hapus lalu buat ulang webhook. Anda juga dapat melihat, mengedit, mengaktifkan atau menonaktifkan, dan menghapus pendaftaran dari [halaman Webhooks di Console](https://www.sandbase.ai/console/webhooks).

`GET` mengembalikan array JSON berisi webhook (tanpa `signatureSecret`), `PATCH` mengembalikan webhook yang diperbarui, dan `DELETE`
mengembalikan `204 No Content`.

### Autentikasi dan error {#authentication-and-errors}

Events API menerima API key sebagai `Authorization: Bearer $SANDBASE_API_KEY` atau `X-API-Key: $SANDBASE_API_KEY`. Jika
keduanya dikirim, header Bearer yang digunakan.

Error menggunakan body tersendiri, dengan status HTTP diulang di `code`:

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

Tentukan penanganan berdasarkan status HTTP. `401` berarti kunci tidak ada, tidak valid, atau telah dicabut; `400` berarti body permintaan atau
langganan tidak valid; `404` (`webhook not found`) berarti webhook tidak ada di organisasi Anda.

## Callback model per tugas {#per-task-model-callback}

Untuk satu tugas gambar, video, atau audio asinkron, tambahkan `webhook_url` ke `POST /v1/run` alih-alih mendaftarkan webhook baru:

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "example/async-image-model",
    "mode": "async",
    "prompt": "A lighthouse at night",
    "webhook_url": "https://hooks.example.com/sandbase/task?token=opaque-token"
  }'
```

Field ini hanya di-parse dan divalidasi ketika model yang dipilih adalah gambar, video, atau audio dan permintaan di-resolve ke eksekusi asinkron. Dalam kasus tersebut, nilainya harus berupa string tidak kosong yang berisi URL HTTPS publik yang valid dan aman; jika tidak, permintaan menghasilkan HTTP 400. Untuk permintaan sinkron, streaming, LLM, atau permintaan lain yang tidak didukung, SandBase mengabaikan `webhook_url` apa pun nilai JSON-nya: tidak ada callback yang dijadwalkan, tidak ada URL callback yang disimpan, dan field tersebut tidak diteruskan ke penyedia model. Menghilangkan field ini mempertahankan alur polling yang ada.

Target harus berupa URL HTTPS publik. SandBase mengirim envelope terminal Model yang sama seperti yang didokumentasikan di bawah, dengan `Content-Type: application/json` dan `X-Event-ID`, untuk status completed, failed, timeout, atau cancelled. SandBase dapat mencoba ulang pengiriman yang gagal, jadi lakukan deduplikasi berdasarkan `id` atau `X-Event-ID` dan kembalikan 2xx dengan cepat.

Callback per tugas tidak memiliki secret SandBase bersama, sehingga **tidak** menyertakan `X-Signature`. Jika endpoint Anda memerlukan verifikasi HMAC, hilangkan `webhook_url` dan daftarkan Model Webhook organisasi sebagai gantinya. Anda dapat menempatkan token kapabilitas buram yang dibuat oleh sistem Anda sendiri di query URL HTTPS dan memvalidasinya di endpoint Anda. Perlakukan URL tersebut sebagai data sensitif.

Untuk setiap tugas model asinkron, pemilihan target bersifat eksklusif. Jika permintaan menyertakan `webhook_url` yang valid, SandBase mengirim event terminal Prediction tersebut hanya ke URL per tugas dan melewati semua Model Webhook organisasi yang terdaftar untuk event itu. Jika permintaan tidak menyertakan `webhook_url`, Model Webhook organisasi yang terdaftar tetap menerima event yang cocok seperti biasa. Kegagalan pengiriman per tugas akan dicoba ulang ke URL tugas yang sama dan tidak pernah beralih ke webhook terdaftar. Prioritas ini tidak membuat, mengganti, menonaktifkan, atau mengubah pendaftaran apa pun, dan tidak memengaruhi event Model lainnya.

## Tipe event {#event-types}

### Pembuatan model {#model-generation}

Webhook model hanya tersedia untuk pembuatan gambar, video, dan audio asinkron. Webhook ini tidak dikirim untuk permintaan gambar/video/audio sinkron atau permintaan LLM sinkron apa pun: hasilnya dikembalikan oleh respons HTTP asli.

| Event | Deskripsi |
|---|---|
| `model.generation.completed` | Pembuatan gambar, video, atau audio asinkron selesai. |
| `model.generation.failed` | Pembuatan gambar, video, atau audio asinkron gagal. |
| `model.generation.timeout` | Pembuatan gambar, video, atau audio asinkron melewati batas waktu. |
| `model.generation.cancelled` | Pembuatan gambar, video, atau audio asinkron dibatalkan. |

## Payload pengiriman {#delivery-payload}

SandBase mengirim `Content-Type: application/json` dan envelope JSON berikut. `data` bersifat spesifik per event dan dapat bertambah field seiring waktu.

### Contoh penyelesaian model {#model-completion-example}

```json
{
  "id": "model_pred_01_completed",
  "resourceType": "model",
  "resourceID": "pred_01...",
  "type": "model.generation.completed",
  "data": {
    "predictionID": "pred_01...",
    "model": "example-image-model",
    "generationType": "image",
    "status": "completed",
    "completedAt": "2026-07-14T09:30:38Z",
    "outputs": ["https://.../generated-image.png"]
  },
  "createdAt": "2026-07-14T09:30:38Z"
}
```

Event failure dan timeout tidak menyertakan output dan hanya berisi kategori error yang telah disanitasi.

| Field | Deskripsi |
|---|---|
| `id` | ID event unik. Gunakan ini, atau `X-Event-ID`, sebagai kunci idempotensi Anda. |
| `resourceType` | `model`. |
| `resourceID` | ID Prediction yang terdampak. |
| `type` | Tipe event dari tabel di atas. |
| `data` | Data spesifik event. |
| `createdAt` | Waktu pembuatan event dalam RFC 3339 UTC. |

## Memverifikasi signature webhook terdaftar {#verify-a-registered-webhook-signature}

Setiap pengiriman webhook terdaftar menyertakan header berikut:

| Header | Nilai |
|---|---|
| `X-Event-ID` | `id` payload. |
| `X-Signature` | HMAC-SHA256 heksadesimal huruf kecil dari body permintaan mentah, dengan kunci `signatureSecret`. |

Verifikasi signature terhadap byte permintaan mentah sebelum mem-parse JSON. Callback `webhook_url` per tugas tidak menyertakan header ini dan tidak dapat menggunakan alur verifikasi ini. Handler berikut ditujukan untuk webhook terdaftar: handler memverifikasi terlebih dahulu, lalu mem-parse, menggunakan `id` sebagai kunci idempotensi, dan menyerahkan pekerjaan ke fungsi asinkron. Ganti panggilan antrean placeholder dengan antrean durable atau worker Anda sendiri.

::: code-group

```javascript [Node.js + Express]
import crypto from 'node:crypto'
import express from 'express'

const app = express()
const webhookSecret = process.env.SANDBASE_WEBHOOK_SECRET
if (!webhookSecret) throw new Error('SANDBASE_WEBHOOK_SECRET is required')
const acceptedEventIDs = new Set() // Use a DB unique key in production.

function enqueueSandBaseEvent(event) {
  setImmediate(() => {
    console.log(`processing ${event.type} (${event.id})`)
    // Perform slow business work here or publish to your durable queue.
  })
}

// This route must be registered before express.json() for the webhook path.
app.post('/hooks/sandbase', express.raw({ type: 'application/json' }), (req, res) => {
  const rawBody = req.body
  const signature = req.get('X-Signature') || ''

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')

  const received = Buffer.from(signature, 'utf8')
  const expectedBuffer = Buffer.from(expected, 'utf8')
  if (received.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, received)) {
    return res.status(401).json({ error: 'invalid signature' })
  }

  const event = JSON.parse(rawBody.toString('utf8'))
  if (acceptedEventIDs.has(event.id)) return res.sendStatus(204)
  acceptedEventIDs.add(event.id)
  enqueueSandBaseEvent(event)
  return res.sendStatus(204)
})

app.listen(3000)
```

```python [Python + Flask]
import hashlib
import hmac
import json
import os
import threading

from flask import Flask, abort, request

app = Flask(__name__)
webhook_secret = os.environ["SANDBASE_WEBHOOK_SECRET"].encode()
accepted_event_ids = set()  # Use a DB unique key in production.
accepted_event_ids_lock = threading.Lock()

def process_sandbase_event(event):
    print(f"processing {event['type']} ({event['id']})")
    # Perform slow business work here or publish to your durable queue.

@app.post("/hooks/sandbase")
def sandbase_webhook():
    raw_body = request.get_data(cache=True)
    received = request.headers.get("X-Signature", "")
    expected = hmac.new(webhook_secret, raw_body, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, received):
        abort(401, "invalid signature")

    event = json.loads(raw_body)
    with accepted_event_ids_lock:
        if event["id"] in accepted_event_ids:
            return "", 204
        accepted_event_ids.add(event["id"])
    threading.Thread(target=process_sandbase_event, args=(event,), daemon=True).start()
    return "", 204
```

:::

Input HMAC adalah body mentah yang persis. Jangan memanggil parser JSON atau men-serialisasi ulang payload sebelum menghitungnya.

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## Perilaku pengiriman {#delivery-behavior}

- Respons dalam rentang `2xx` dalam 10 detik dianggap berhasil.
- Error jaringan, timeout, dan respons non-2xx dianggap gagal. Dispatcher event yang ada dapat mencoba ulang pengiriman yang gagal; penerima harus dapat menangani pengiriman duplikat.
- Kembalikan respons 2xx setelah penerimaan yang durable, lalu kerjakan tugas yang lambat secara asinkron. Contoh di atas menggunakan deduplikasi in-memory hanya agar tetap dapat dijalankan; penerima produksi harus menggantinya dengan kunci unik database atau antrean durable. Jangan mengasumsikan pengiriman exactly-once atau urutan event.

