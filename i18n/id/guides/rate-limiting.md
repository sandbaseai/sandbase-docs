---
i18nSource: d326fdb78ea64bdf
title: Batas rate
description: Tangani batas rate SandBase API dengan aman menggunakan percobaan ulang terbatas, jitter, antrean, dan penanganan permintaan yang memperhatikan idempotensi.
---

# Batas rate {#rate-limits}

SandBase dapat menetapkan batas permintaan per menit untuk organisasi Anda. Batas ini dibagi oleh setiap kunci API di organisasi
dan dihitung dalam jendela geser satu menit. Penyedia model upstream juga dapat mengembalikan respons
`429 Too Many Requests` mereka sendiri. Jangan melakukan hardcode kuota kecuali SandBase telah menetapkannya untuk beban kerja Anda.

## Batas organisasi Anda {#your-organization-s-limit}
SandBase tidak memublikasikan satu angka tetap permintaan per menit, karena batasnya ditetapkan per organisasi. Setiap
kunci API di organisasi dihitung terhadap batas yang sama, sehingga membuat lebih banyak kunci tidak menaikkannya. Batas ini
saat ini tidak ditampilkan di API publik maupun di Console.

Jika beban kerja Anda memerlukan batas yang terjamin atau lebih tinggi, hubungi dukungan SandBase dengan menyertakan organisasi, aplikasi,
laju stabil yang diharapkan, dan laju lonjakan yang diharapkan. Jangan merancang klien produksi berdasarkan nilai default numerik yang tidak didokumentasikan.

## Menangani respons 429 {#handle-a-429-response}

Respons batas rate `/v1/*` yang dihasilkan platform menggunakan body error datar:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

Batas organisasi berlaku untuk `POST /v1/run`, `POST /v1/chat/completions`, `POST /v1/responses`, `POST /v1/messages`, `POST /v1/upload`, serta endpoint Gemini `generateContent`, `streamGenerateContent`, dan `POST /v1beta/interactions`. Endpoint polling seperti
`GET /v1/run/{id}` tidak dihitung. Endpoint yang kompatibel secara protokol mengembalikan `429` yang sama dalam envelope error mereka sendiri,
seperti bentuk error Anthropic atau Google. Respons yang berasal dari penyedia dapat menggunakan bentuk error endpoint yang kompatibel
dan dapat menyertakan header batas rate dari penyedia.

Header `Retry-After` dan sisa kuota tidak dijamin ada. Jika `Retry-After` ada, patuhi nilainya. Jika tidak, gunakan
exponential backoff dengan jitter dan jumlah percobaan maksimum.

```python
import os
import random
import time

from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def create_with_backoff(**request):
    for attempt in range(5):
        try:
            return client.chat.completions.create(**request)
        except RateLimitError:
            if attempt == 4:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

SDK OpenAI juga mendukung percobaan ulang bawaan melalui `max_retries`. Pilih dengan sengaja antara percobaan ulang SDK atau loop percobaan ulang
di aplikasi agar percobaan ulang tidak berlipat ganda di beberapa lapisan.

## Hanya coba ulang operasi yang aman {#retry-only-safe-operations}

Permintaan inferensi yang diulang dapat menghasilkan generasi kedua dan menimbulkan biaya tambahan. Coba ulang hanya jika
aplikasi Anda menerima generasi ulang. Jangan otomatis mencoba ulang permintaan yang mengubah status kecuali operasinya mendokumentasikan
idempotensi atau aplikasi Anda dapat membuktikan bahwa percobaan pertama tidak berhasil.

Untuk permintaan streaming, `429` biasanya datang sebelum stream dimulai. Setelah byte mulai diterima, perlakukan pemutusan koneksi
sebagai generasi yang terinterupsi, bukan sebagai error batas rate. Simpan atau buang output parsial sesuai
kebutuhan produk Anda; memulai ulang akan membuat generasi baru.

## Mengontrol throughput {#control-throughput}

- Batasi konkurensi alih-alih melepaskan batch tanpa batas sekaligus.
- Antrekan pekerjaan yang datang bergelombang dan ratakan laju pengiriman.
- Hindari permintaan duplikat dan cache hasil yang dapat digunakan ulang jika persyaratan privasi dan kesegaran data mengizinkan.
- Gunakan kunci terpisah untuk kepemilikan, kontrol pengeluaran, dan pencabutan, bukan untuk menghindari batas platform.
- Catat endpoint, model, status HTTP, dan body error yang sudah disanitasi untuk pemecahan masalah.
- Hubungi dukungan SandBase jika beban kerja memerlukan batas kapasitas yang ditetapkan atau lebih tinggi.

```python
import asyncio

semaphore = asyncio.Semaphore(8)

async def run_one(client, prompt):
    async with semaphore:
        return await client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
```

Konkurensi tidak sama dengan permintaan per menit. Sesuaikan keduanya berdasarkan latensi yang teramati dan kapasitas yang ditetapkan untuk
aplikasi Anda.

::: info Panggilan API gratis harian
100 panggilan API data gratis per hari UTC untuk organisasi adalah jatah penagihan, bukan batas rate. Panggilan di luar jatah
ditagih per panggilan, bukan ditolak. Lihat [Panggilan API gratis harian](/guides/billing#daily-free-api-calls).
:::

::: tip Tugas video
Pengiriman video juga dibatasi oleh jumlah tugas yang dapat dijalankan organisasi Anda sekaligus, berdasarkan level akunnya.
`429` tersebut berbunyi `organization concurrency limit exceeded` dan hilang ketika tugas yang sedang berjalan selesai, bukan berdasarkan timer. Lihat
[Batas konkurensi](/guides/concurrency-limits).
:::

## Panduan terkait {#related-guidance}

- [Penanganan error](/guides/error-handling)
- [Streaming](/guides/streaming)
- [Referensi error API](/api-reference/errors)
- [Kunci API](/getting-started/api-keys)
