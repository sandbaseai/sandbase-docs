---
i18nSource: fc051d55a0cfa8bd
title: Batas konkurensi
description: Berapa banyak tugas yang dapat dijalankan organisasi Anda sekaligus, bagaimana batas ini meningkat sesuai level akun, dan cara menangani 429 dan 402 pada pengiriman video.
---

# Batas konkurensi {#concurrency-limits}

Batas konkurensi mengontrol berapa banyak tugas yang dapat berjalan secara bersamaan di organisasi Anda. Setiap organisasi memiliki level akun, dan level tersebut menentukan batas konkurensinya. Saat batas tercapai, pengiriman baru pada endpoint yang diperiksa di bawah ini ditolak dengan `429` hingga salah satu tugas Anda yang sedang berjalan selesai. Pengiriman tersebut tidak dimasukkan ke antrean.

Batas ini berlaku untuk seluruh organisasi, di semua API key. Pengiriman yang diperiksa bergantung pada endpoint:

- `POST /v1/run` dan panggilan Platform API melalui `/v1/api/{vendor}/...` diperiksa untuk setiap jenis model, termasuk operasi gambar, audio, LLM, dan data API.
- Endpoint lain, seperti Chat Completions, Responses, Messages, OpenAI Images, serta endpoint Gemini dan Volcengine yang kompatibel secara protokol, hanya memeriksa pengiriman video.

## Cara kerjanya {#how-it-works}

Saat Anda mengirim tugas yang diperiksa, SandBase menghitung tugas yang sedang berjalan di organisasi Anda, yaitu tugas dengan status `pending` atau `running`. Jika jumlah tersebut sudah mencapai batas Anda, pengiriman langsung ditolak dengan `429`. Tidak ada tugas yang dibuat dan tidak ada biaya yang dikenakan.

Hitungan ini mencakup setiap permintaan yang sedang berjalan di organisasi Anda, bukan hanya video. Chat completion streaming yang masih terbuka saat Anda mengirim tugas yang diperiksa menggunakan satu slot. Jika organisasi yang sama menjalankan chat streaming yang panjang dan pekerjaan video, perhitungkan semuanya saat merencanakan kapasitas.

Slot langsung tersedia kembali begitu tugas mencapai status akhir (`completed`, `failed`, atau `timeout`). Anda tidak perlu melepaskan apa pun. Karena slot tersedia kembali saat tugas selesai, bukan berdasarkan timer, `429` ini berbeda dari [batas laju](/guides/rate-limiting) per menit. Menunggu interval tetap tidak menjamin slot tersedia. Sebaiknya tunggu hingga salah satu tugas Anda selesai.

## Batas default {#default-limits}

Setiap organisasi baru dimulai di level **Bronze**, dengan batas 2 tugas bersamaan. Level Anda naik secara otomatis berdasarkan jumlah satu kali top-up yang berhasil.

| Level | Satu kali top-up | Tugas bersamaan |
|-------|---------------|------------------|
| Bronze | Default | 2 |
| Silver | $10 atau lebih | 10 |
| Gold | $100 atau lebih | 100 |
| Platinum | $500 atau lebih | 500 |
| Diamond | Hubungi tim sales | Tanpa batas |

- **Satu kali top-up, bukan total kumulatif.** Dua kali top-up $60 membuat Anda tetap di Silver. Satu kali top-up $100 menaikkan Anda ke Gold.
- **Hanya naik.** Top-up berikutnya yang lebih kecil tidak pernah menurunkan level Anda.
- **Hanya top-up berbayar.** Kredit promosi, kredit pendaftaran, dan kupon tidak mengubah level Anda.
- **Berlaku seketika.** Batas baru berlaku untuk pengiriman video berikutnya setelah pembayaran berhasil.

## Menaikkan batas Anda {#increasing-your-limit}

Cara paling langsung untuk menaikkan batas adalah satu kali top-up yang mencapai ambang berikutnya dalam tabel di atas.

Untuk lebih dari 500 tugas bersamaan, atau untuk batas kredit bulanan, hubungi [contact@sandbase.ai](mailto:contact@sandbase.ai) mengenai level **Diamond**. Diamond tidak memiliki batas konkurensi. Level ini disiapkan oleh tim SandBase dan tidak pernah berubah karena top-up.

## Pemeriksaan kredit pada pengiriman video {#credit-check-on-video-submissions}

Selain pemeriksaan konkurensi, SandBase memperkirakan biaya setiap tugas video sebelum menerimanya. Jika estimasi melebihi kredit yang tersedia (saldo ditambah batas kredit, jika ada), pengiriman ditolak dengan `402`. Tidak ada tugas yang dibuat dan tidak ada biaya yang dikenakan.

- Setiap pengiriman diperiksa terhadap saldo Anda saat ini. Tugas yang masih berjalan belum ditagih, jadi sisakan ruang saat Anda mengirim beberapa video sekaligus.
- Jika harga model bergantung pada output yang baru ada setelah model berjalan, biayanya tidak dapat diperkirakan di awal. Pengiriman diterima dan ditagih seperti biasa saat tugas selesai.

## Menangani error konkurensi {#handling-concurrency-errors}

### 429: batas konkurensi tercapai {#_429-concurrency-limit-reached}

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

Header `Retry-After` tidak dikirim. Batasnya sudah diketahui sebelumnya, jadi pendekatan paling andal adalah tidak pernah melampauinya. Batasi jumlah tugas video yang sedang berjalan di sisi klien, dan hanya kirim tugas berikutnya setelah tugas sebelumnya selesai:

::: code-group

```python [Python]
import asyncio

MAX_CONCURRENT_VIDEOS = 2  # set to your level's limit
slots = asyncio.Semaphore(MAX_CONCURRENT_VIDEOS)

async def generate_video(submit, wait_for_result, payload):
    # Hold a slot for the whole lifetime of the task, not just the submit call.
    async with slots:
        task = await submit(payload)
        return await wait_for_result(task)

async def main(submit, wait_for_result, payloads):
    return await asyncio.gather(
        *(generate_video(submit, wait_for_result, p) for p in payloads)
    )
```

```javascript [JavaScript]
const MAX_CONCURRENT_VIDEOS = 2; // set to your level's limit

async function runAll(payloads, submit, waitForResult) {
  const results = [];
  const queue = [...payloads.entries()];

  async function worker() {
    for (let next = queue.shift(); next; next = queue.shift()) {
      const [index, payload] = next;
      // Each worker holds one slot until its task finishes.
      const task = await submit(payload);
      results[index] = await waitForResult(task);
    }
  }

  await Promise.all(
    Array.from({ length: MAX_CONCURRENT_VIDEOS }, worker)
  );
  return results;
}
```

:::

Jika Anda tetap mendapatkan `429`, misalnya karena layanan lain di organisasi yang sama juga mengirim tugas, lakukan backoff lalu coba ulang. Gunakan exponential backoff dengan jitter, dan hentikan setelah jumlah percobaan yang terbatas alih-alih mencoba ulang dalam loop yang rapat.

### 402: kredit tidak cukup untuk video ini {#_402-not-enough-credit-for-this-video}

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

Jangan coba ulang. Lakukan top-up, atau pilih durasi yang lebih pendek atau resolusi yang lebih rendah dengan biaya lebih kecil.

### API yang kompatibel {#compatible-apis}

Endpoint yang kompatibel secara protokol mengembalikan error ini dalam format native-nya sendiri. Misalnya, endpoint `/api/v3/contents/generations/tasks` yang kompatibel dengan Volcengine mengembalikan `RateLimitExceeded` untuk `429` dan `AccountOverdueError` untuk `402`.

## Terkait {#related}

- [Batas laju](/guides/rate-limiting): batas permintaan per menit
- [Harga](/guides/billing): kredit dan top-up
- [Error](/api-reference/errors): semua kode error
