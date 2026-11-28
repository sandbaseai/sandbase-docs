---
i18nSource: f63049c1cf01130e
title: Error dan percobaan ulang
description: Klasifikasikan kegagalan SandBase API, tentukan kapan percobaan ulang aman, dan simpan diagnostik yang berguna tanpa mengekspos secret.
---

# Error dan percobaan ulang {#errors-and-retries}

Tangani error berdasarkan status HTTP, kelompok endpoint, dan semantik operasi. SandBase menyediakan beberapa protokol yang kompatibel,
sehingga tidak ada satu bentuk JSON error yang digunakan bersama oleh semua endpoint.

## Baca bentuk error dari endpoint {#read-the-endpoint-s-error-shape}

- Operasi yang kompatibel dengan OpenAI biasanya mengembalikan objek `error` berisi pesan dan tipe.
- Anthropic Messages mengembalikan envelope error yang kompatibel dengan Anthropic.
- Operasi platform inti dapat mengembalikan body datar `{ "error": "..." }` atau error khusus resource yang terdokumentasi.
- Operasi Google dan operasi native penyedia mempertahankan bentuk protokol kompatibelnya jika didokumentasikan.

Gunakan status HTTP dan body respons yang terdokumentasi. Jangan mewajibkan field opsional seperti `code`, `param`, atau
`request_id` kecuali endpoint yang dipilih menjaminnya. Lihat [referensi error API](/api-reference/errors) untuk
contoh dan [spesifikasi OpenAPI](/openapi.yaml) untuk respons khusus operasi.

## Tentukan tindakan berdasarkan status {#decide-what-to-do-by-status}

| Status | Penyebab umum | Tindakan yang disarankan |
|---|---|---|
| `400` / `422` | Body, parameter tidak valid, atau kapabilitas model tidak didukung | Perbaiki permintaan sebelum mencoba ulang. |
| `401` | Kredensial tidak ada, tidak valid, kedaluwarsa, atau dicabut | Ganti kredensial. |
| `402` | Status penagihan tidak mengizinkan permintaan | Selesaikan masalah saldo akun atau kontrol pengeluaran. |
| `403` | Cakupan kredensial atau akses resource tidak memadai | Gunakan kunci atau resource yang diotorisasi. |
| `404` | Model, tugas, atau resource platform tidak ditemukan | Verifikasi pengenal dan organisasi. |
| `409` | Konflik status resource atau operasi bersamaan | Baca status saat ini, lalu putuskan apakah akan mencoba ulang. |
| `429` | SandBase atau penyedia upstream membatasi permintaan | Patuhi `Retry-After` jika ada; jika tidak, lakukan backoff dengan jitter. |
| `500` / `502` / `503` / `504` | Kegagalan internal, upstream, atau ketersediaan sementara | Coba ulang hanya jika mengulang operasi aman dilakukan. |

Tabel ini adalah panduan penanganan, bukan jaminan bahwa setiap endpoint mengeluarkan setiap status.

## Gunakan kebijakan percobaan ulang yang terbatas {#use-a-bounded-retry-policy}

Untuk permintaan yang aman diulang, gunakan exponential backoff dengan jitter, batasi jeda, dan terapkan anggaran total permintaan.
Nonaktifkan percobaan ulang SDK jika lapisan aplikasi luar sudah melakukan percobaan ulang, atau perhitungkan kedua lapisan saat menetapkan anggaran.

```python
import os
import random
import time

from openai import APIStatusError, OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def chat_with_backoff(messages, attempts=4):
    for attempt in range(attempts):
        try:
            return client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages,
            )
        except APIStatusError as error:
            retryable = error.status_code in {429, 500, 502, 503, 504}
            if not retryable or attempt == attempts - 1:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

Jika respons menyertakan `Retry-After`, parse dan patuhi nilai tersebut alih-alih menggunakan jeda cadangan. Jaga agar kebijakan
dapat dikonfigurasi; jumlah percobaan dan tenggat yang tepat bergantung pada anggaran latensi dan biaya pemanggil.

## Lindungi dari efek samping ganda {#protect-against-duplicate-side-effects}

Mengulang permintaan inferensi akan membuat hasil baru dan dapat menimbulkan biaya tambahan. Hal ini hanya dapat diterima jika
aplikasi membutuhkan jawaban valid apa pun dan dapat menoleransi pembuatan ulang.

Lebih berhati-hatilah dengan operasi yang membuat, memperbarui, menghapus, memublikasikan, menjadwalkan, atau memicu pekerjaan:

- gunakan dukungan idempotensi yang terdokumentasi jika endpoint menyediakannya;
- jika tidak, baca status saat ini sebelum mengulang permintaan yang hasilnya tidak pasti;
- jangan pernah memutar ulang panggilan tool hanya karena stream model di sekitarnya terputus;
- simpan ID operasi klien di sistem Anda sendiri jika Anda perlu merekonsiliasi percobaan ulang.

## Tangani timeout dan stream secara terpisah {#handle-timeouts-and-streams-separately}

Timeout tidak membuktikan bahwa server berhenti memproses permintaan. Sebelum mencoba ulang operasi asinkron atau yang mengubah status,
kueri status resource atau tugas yang terdokumentasi jika memungkinkan.

Untuk respons streaming, bedakan error HTTP sebelum stream dimulai dari pemutusan koneksi setelah output parsial.
Hanya sinyal penghentian protokol yang normal yang membuktikan stream lengkap. Lihat [Respons streaming](/guides/streaming).

## Catat diagnostik yang berguna dan aman {#log-useful-safe-diagnostics}

Catat:

- endpoint dan pengenal model;
- status HTTP dan tipe error kompatibel jika ada;
- pengenal penyedia atau permintaan jika dikembalikan;
- jumlah percobaan, waktu yang berlalu, dan apakah ada byte respons yang diterima.

Jangan mencatat API key, nilai kredensial, prompt sensitif lengkap, atau respons penyedia yang tidak disamarkan. Tampilkan kepada pengguna pesan
singkat yang dapat ditindaklanjuti, sambil menyimpan diagnostik yang telah disanitasi untuk operator.

## Panduan terkait {#related-guidance}

- [Referensi error API](/api-reference/errors)
- [Batas laju](/guides/rate-limiting)
- [Respons streaming](/guides/streaming)
- [Autentikasi](/api-reference/authentication)

