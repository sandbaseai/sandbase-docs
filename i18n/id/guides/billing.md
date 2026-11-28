---
i18nSource: 91c5a0d1b6de6434
title: Harga dan Penggunaan
description: Temukan harga model terkini, periksa biaya tugas, dan kelola penagihan SandBase dengan aman.
---

# Harga dan Penggunaan {#pricing-and-usage}

SandBase menggunakan penagihan pay-as-you-go. Ketersediaan model, rumus harga, pengali cache, dan biaya khusus kemampuan
dapat berubah secara independen, jadi integrasi sebaiknya membaca metadata live alih-alih mengandalkan tabel harga
yang disalin.

## Panggilan API gratis harian {#daily-free-api-calls}

Setiap organisasi mendapatkan 100 panggilan API data gratis (pencarian, media sosial, scraping, e-commerce, keuangan) per hari UTC. Jatah
ini dibagi oleh semua API data yang memenuhi syarat dan semua kunci organisasi, serta direset pada pukul 00:00 UTC. LLM dan
model media tidak termasuk. Beberapa API data juga tidak termasuk: API yang lebih mahal atau berharga berbasis rumus, seperti beberapa
endpoint batch, endpoint crawl, Xiaohongshu PGY, dan rute Douyin Xingtu `kol-*`, ditagih sejak panggilan pertama.
Untuk memeriksa sebuah tool, jalankan `sandbase_inspect`: tool yang memenuhi syarat memiliki `pricing.free_quota`, dan tool tanpanya selalu
ditagih.

- Panggilan dalam jatah tidak dikenakan biaya, dan organisasi dengan saldo nol tetap dapat menggunakannya.
- Setelah panggilan ke-100, panggilan yang memenuhi syarat tetap berfungsi dan ditagih per panggilan sesuai harga yang ditampilkan tool. Panggilan tersebut tidak
  ditolak atau dibatasi rate-nya karena jatah sudah habis.
- Panggilan yang tidak terpakai tidak terbawa ke hari berikutnya.

Di [tool MCP SandBase](/setup/), `sandbase_inspect` menandai tool yang memenuhi syarat dengan `pricing.free_quota`
(`daily_limit`, `scope`, `resets`). `sandbase_account` mengembalikan jatah hari ini sebagai `free_api_quota` dengan
`daily_limit`, `used_today`, `remaining`, dan `resets_at`; `used_today` dan `remaining` dihilangkan jika hitungannya
sementara tidak tersedia. Setelah run selesai di-settle, `sandbase_run` dan `sandbase_run_get` melaporkan `free_quota_status`:
`free` (ditanggung oleh jatah), `overage` (ditagih setelah jatah habis), atau `degraded` (tidak dikenakan biaya
karena hitungan jatah tidak tersedia).

## Mengelola penagihan di Console {#manage-billing-in-the-console}

Gunakan **Developer → Billing** untuk melihat saldo, membeli kredit, mengatur top-up otomatis, menukarkan kupon, dan mengelola pengaturan penagihan yang tersedia untuk
organisasi Anda. Buka **Developer → Activities → Usage** untuk ringkasan permintaan, token, dan biaya di tingkat organisasi.

::: info Batas API publik
Endpoint saldo, top-up, ekspor penagihan, dan penggunaan seluruh organisasi saat ini bukan bagian dari API publik
yang didukung. Jangan mengotomatiskan permintaan jaringan Console atau bergantung pada rute internal Console.
:::

## Membaca harga model saat ini {#read-current-model-pricing}

Pertama, temukan model yang aktif:

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Lalu minta kartu model lengkapnya:

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Endpoint list dioptimalkan untuk penemuan dan sengaja tidak menyertakan harga token, cache, dan reasoning yang terperinci.
Baca harga terperinci model yang dipilih dari `model_card` di respons detail. Tidak ada rumus universal
yang berlaku untuk setiap LLM, model media, model embedding, atau kemampuan API.

## Memeriksa biaya yang tercatat untuk satu tugas {#check-one-task-s-recorded-cost}

Jika operasi mengembalikan ID tugas, query catatan settlement-nya:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Respons membedakan `cost` saat ini dari `estimated_cost` dan melaporkan apakah settlement sudah final. Jangan
gunakan `cost` untuk rekonsiliasi penagihan hingga `settled` bernilai `true`. Catatan tugas adalah data pencarian operasional, bukan
buku besar akuntansi. Gunakan catatan penagihan dan ekspor CSV yang tersedia di **Developer → Activities → Usage**
untuk rekonsiliasi dan catatan jangka panjang.

## Praktik pengendalian biaya {#cost-control-practices}

- Ambil kartu model terbaru sebelum meluncurkan beban kerja baru.
- Periksa `capability_tags`, `supported_modes`, dan `unified_schema`; alternatif yang lebih murah hanya berguna jika
  mendukung perilaku input dan output yang diperlukan.
- Batasi konteks prompt yang tidak perlu dan atur batas token output yang sesuai jika model yang dipilih mendukungnya.
- Perlakukan caching sebagai fitur khusus model. Periksa kartu model dan field usage yang dikembalikan alih-alih mengasumsikan diskon
  yang berlaku untuk seluruh penyedia.
- Catat ID tugas hanya untuk pencarian biaya tugas; untuk pekerjaan `/v1/run` asinkron, catat ID run opaque yang dikembalikan dan lakukan polling `GET /v1/run/{id}` hanya selama status bernilai `pending` atau `running`.
- Gunakan kontrol pengeluaran yang tersedia di Console untuk organisasi Anda.

## Error pembayaran {#payment-errors}

Operasi API dapat mengembalikan HTTP `402` jika organisasi tidak dapat mendanai permintaan. Envelope error bervariasi menurut
permukaan kompatibilitas API, jadi tangani status HTTP dan objek error yang didokumentasikan alih-alih mencocokkan satu
string pesan. Setelah menyelesaikan masalah penagihan di Console, coba ulang sesuai aturan idempotensi dan pemulihan operasi tersebut.

Pengiriman video juga diperiksa terhadap estimasi biayanya sebelum dimulai. Satu kali top-up sebesar $10 atau lebih
menaikkan level akun Anda, sehingga lebih banyak tugas video dapat berjalan bersamaan. Lihat
[Batas konkurensi](/guides/concurrency-limits).

Lihat [Model dan Harga](/for-agents/models), [Biaya Tugas](/api-reference/tasks/cost), dan
[Error](/api-reference/errors) untuk kontrak publik saat ini.
