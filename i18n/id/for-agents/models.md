---
i18nSource: b95a8cd6f82c3a9a
title: Model & Harga yang Dapat Dibaca AI
description: Temukan model, kapabilitas, skema, dan harga SandBase terkini melalui Models API.
---

# Model & Harga {#models-pricing}

Semua model dapat diakses dengan satu SandBase API key. Ketersediaan model, skema, kapabilitas, batas konteks,
dan harga dapat berubah secara terpisah.

::: info Gunakan metadata model live
Selalu gunakan `GET /v1/models` dan `GET /v1/models/{id_or_name}` untuk data terkini yang otoritatif. Jangan menyimpulkan bahwa setiap
LLM mendukung streaming, vision, tools, output terstruktur, atau caching, dan jangan menyalin field input atau
harga suatu model ke model lain.
:::

## Respons katalog dan detail {#catalog-and-detail-responses}

`GET /v1/models` mengembalikan record identitas yang kompatibel dengan OpenAI berisi `id`, `object`, `created`, dan `owned_by`.
Endpoint ini sengaja tidak menyertakan metadata kapabilitas, skema, dan harga SandBase.

`GET /v1/models/{id_or_name}` menambahkan `unified_schema`, `supported_modes`, dan `model_card`. Baca harga terperinci dari
`model_card`; tidak ada objek `pricing` di tingkat teratas. Perlakukan `capability_tags`, `supported_modes`, dan
`unified_schema` sebagai data spesifik model.

## Menemukan model {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Endpoint daftar mendukung `q`, `vendor`, `type`, dan `order`; endpoint ini tidak dipaginasi dan default-nya `type=llm`.
Endpoint ini mengembalikan item yang kompatibel dengan OpenAI dengan `id`, `object`, `created`, dan `owned_by`. Gunakan `id` yang dikembalikan sebagai
nama model saat meminta detail atau memanggil model.

Untuk setiap respons asinkron `202`, lakukan polling `GET /v1/run/{id}` dengan ID yang dikembalikan. Perlakukan ID sebagai nilai buram; jangan
menebak formatnya atau menyusun path polling yang berbeda dari prefiks ID atau header kompatibilitas.

## Memeriksa satu model {#inspect-one-model}

Nama model menyertakan vendor dan dapat berisi `/`:

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Sebelum eksekusi, periksa:

- `enabled` dan `execution_mode`
- `capability_tags` dan `supported_modes`
- `unified_schema` untuk field permintaan yang diterima
- `model_card` untuk formula harga terkini dan pengali token atau cache

## Memeriksa biaya tugas yang sebenarnya {#check-actual-task-cost}

Untuk tugas yang sudah selesai atau sedang berjalan, kueri biaya yang tercatat alih-alih menghitung ulang dari tabel yang sudah usang:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Lihat [referensi Models API](/api-reference/models/) untuk kontrak respons dan
[Panduan Error](/for-agents/errors) untuk panduan bentuk respons dan percobaan ulang.

