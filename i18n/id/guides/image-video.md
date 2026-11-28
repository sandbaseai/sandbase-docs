---
i18nSource: 8c960d117a998817
title: Model Gambar dan Video
description: Gunakan Run API bersama SandBase untuk membuat gambar dan video secara asinkron.
---

# Model Gambar dan Video {#image-and-video-models}

Model gambar dan video menggunakan Run API asinkron bersama milik SandBase. Kirim tugas
dengan `POST /v1/run`, lalu lakukan polling `GET /v1/run/{id}` hingga run mencapai
status akhir.

## Mengirim tugas {#submit-a-task}

Gunakan ID model yang persis dari [Model gambar dan video](https://www.sandbase.ai/models/image-video). Field
permintaan lainnya bersifat spesifik model; buka referensi API model tersebut untuk
input wajib dan batasannya.

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

Respons menyertakan `id` buram dan `status` seperti `pending` atau
`running`.

## Polling hasil {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Lanjutkan polling hingga `status` bernilai `completed`, `failed`, atau `timeout`. Run yang
selesai berisi output khusus kapabilitas, seperti URL gambar atau video. Simpan
ID run dan perlakukan respons run sebagai status yang otoritatif.

## Callback webhook {#webhook-callbacks}

Tugas asinkron yang didukung juga dapat menetapkan `webhook_url` dalam permintaan pengiriman.
Callback hanyalah petunjuk pengiriman, bukan pengganti polling; tetap
gunakan `GET /v1/run/{id}` dan tangani callback yang duplikat atau tertunda dengan aman. Lihat
[Menjalankan kapabilitas](/api-reference/models/run#webhook-callbacks) untuk kontrak
callback umum.

## Kapabilitas API menggunakan path dari URL {#api-capabilities-use-a-url-derived-path}

Run API bersama ditujukan untuk pembuatan model. Kapabilitas API dari
[katalog API](https://www.sandbase.ai/apis) menggunakan
route berbeda yang diturunkan dari URL: `GET` atau `POST /v1/api/{vendor}/{upstream_path}`.
Nama kapabilitas lengkap dengan vendor berasal dari Models API atau katalog API, sehingga
field `model` dapat dihilangkan dari body POST:

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Route ini ditujukan untuk kapabilitas API, bukan pengganti `/v1/run` saat
memanggil model gambar atau video. Jika kapabilitas API yang dipilih bersifat asinkron,
lakukan polling ID run yang dikembalikan dengan `GET /v1/run/{id}`.

## Langkah berikutnya {#next-steps}

- [Model gambar dan video](https://www.sandbase.ai/models/image-video)
- [Menjalankan kapabilitas](/api-reference/models/run)
- [Mendapatkan hasil run](/api-reference/models/run-get)
- [API Passthrough](/api-reference/models/api-passthrough)

