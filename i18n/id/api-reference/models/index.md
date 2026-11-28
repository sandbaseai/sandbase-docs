---
i18nSource: 3ccdc1071b9be798
title: Models API
description: Temukan metadata, harga, status dukungan, dan kapabilitas model SandBase.
---

# Models API {#models-api}

Gunakan Models API untuk menemukan model sebelum memilih endpoint inferensi. Operasi list kompatibel dengan OpenAI dan mengembalikan record identitas yang ringkas. Ambil satu model untuk mendapatkan metadata kapabilitas, skema, dan harga SandBase.

| Operasi | Endpoint | Dokumentasi |
|---|---|---|
| Mencantumkan model | `GET /v1/models` | [List Models](./list) |
| Mendapatkan satu model | `GET /v1/models/{id_or_name}` | [Get Model](./get) |
| Memanggil kapabilitas API berdasarkan path | `GET/POST /v1/api/{vendor}/{upstream_path}` | [API Passthrough](./api-passthrough) |
| Menjalankan model atau kapabilitas API | `POST /v1/run` | [Run Capability](./run) |
| Mendapatkan hasil asinkron | `GET /v1/run/{id}` | [Get Run Result](./run-get) |
| Menerima callback asinkron | `webhook_url` pada `POST /v1/run` | [Callback webhook](./run#webhook-callbacks) |
| Menjelajahi model yang didukung | — | [Katalog Models](https://www.sandbase.ai/models) |

Untuk menjalankan model, buka halaman referensinya dari [katalog Models](https://www.sandbase.ai/models); setiap halaman menampilkan identifier yang tepat, field permintaan, dan harga. Halaman ini mendokumentasikan penemuan model, runner kapabilitas terpadu, API passthrough, assets, dan pencarian biaya tugas.

`GET /v1/models` mendukung `q`, `vendor`, `type`, dan `order`; endpoint ini tidak dipaginasi. Jika `type` dihilangkan, default-nya `llm`, sedangkan `type=` yang secara eksplisit kosong mencantumkan semua jenis model publik. Filter `vendor` bersifat persis dan peka huruf besar-kecil; `q` adalah pencarian substring yang tidak peka huruf besar-kecil. Setiap item daftar berisi `id`, `object`, `created`, dan `owned_by`, dengan `id` sebagai nama model logis yang digunakan dalam permintaan.

Nama model dapat mengandung `/`. Teruskan garis miring tersebut sebagai pemisah path saat memanggil endpoint detail, misalnya `/v1/models/openai/gpt-5.6-luna`; route server membaca sisa path sebagai satu identifier logis. Temukan ID terkini dari `GET /v1/models` alih-alih menyalin identifier dari panduan lama.

Untuk respons `202` asinkron dari API inferensi, lakukan polling `GET /v1/run/{id}` dengan ID opaque yang dikembalikan. Jangan menebak prefiks ID atau menyusun path polling lain dari header kompatibilitas.
