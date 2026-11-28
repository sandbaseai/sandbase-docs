---
i18nSource: d560e2374d91a8d6
title: Penagihan dan kredit
description: Tinjau saldo organisasi SandBase, beli kredit dengan Stripe atau Airwallex, siapkan top-up otomatis, tukarkan kupon, dan pahami kontrol pengeluaran API key.
---

# Penagihan dan kredit {#billing-and-credits}

Halaman ini membahas pengelolaan penagihan di [SandBase Console](https://www.sandbase.ai/console). Untuk tarif dan optimasi biaya, lihat [Harga](/guides/billing).

SandBase menagih beban kerja yang didukung dari saldo organisasi. Harga terkini, penawaran, penyedia pembayaran,
jumlah top-up minimum, dan ketersediaan regional ditampilkan di Console dan dapat berubah terlepas dari
panduan ini.

## Saldo {#balance}

Buka [Developer → Billing](https://www.sandbase.ai/console/billing). Halaman **Credits** menampilkan informasi organisasi aktif berikut:

| Item | Artinya |
|------|---------------|
| **Available balance** | Siap digunakan untuk Models dan APIs |
| **Credit limit** | Batas pengeluaran workspace |
| **Current level** | Tingkat akun dan konkurensinya |

Saldo yang sama muncul di kartu **Balance** pada Dashboard Console dan di header situs saat Anda masuk.
Jadikan Console sebagai sumber kebenaran untuk promosi dan ketentuan checkout; jangan mengotomatiskan permintaan
jaringan internalnya.

## Membeli kredit {#buy-credits}

1. Buka [Billing](https://www.sandbase.ai/console/billing) dan pastikan **Credits go to** menampilkan workspace yang ingin Anda danai.
2. Di bagian **Buy credits**, pilih jumlah preset atau masukkan **Custom amount** dalam USD. Top-up minimum ditampilkan di halaman.
3. Jika tersedia lebih dari satu **Payment provider**, pilih **Stripe** (kartu dan dompet digital global) atau **Airwallex** (kartu dan metode pembayaran lokal).
4. Periksa **Pay**, **Bonus**, dan **Receive** di pratinjau, lalu pilih **Continue with Stripe** (atau penyedia yang Anda pilih) dan selesaikan checkout yang di-host.
5. Pastikan saldo sudah diperbarui di **Credit transactions** sebelum memulai beban kerja yang sensitif terhadap biaya.

SandBase tidak pernah menyimpan detail kartu; halaman pembayaran di-host oleh penyedia.

### Bonus top-up pertama {#first-top-up-bonus}

Jika akun dan workspace belum pernah melakukan top-up, **Current offers** menampilkan bonus top-up pertama. Halaman tersebut menyebutkan
persentase bonus dan batas maksimumnya. Satu bonus berlaku per akun dan per workspace, dan refund akan menarik kembali bonus
secara proporsional. Bonus muncul sebagai baris tersendiri di **Credit transactions**.

## Top-up otomatis {#auto-top-up}

**Auto Top-up** mengisi ulang saldo dengan kartu tersimpan saat saldo turun di bawah ambang batas. Saat ini fitur ini hanya mendukung Stripe,
dan hanya pemilik serta admin workspace yang dapat mengelolanya.

1. Di bagian **Payment cards**, pilih **Add Card** dan simpan kartu di Stripe.
2. Pilih **Turn on auto top-up**, lalu atur **When balance goes below**, **Top-up amount**, **Monthly limit** opsional, dan kartunya.
3. Centang **I authorize these automatic charges** lalu konfirmasi.

Setelah batas bulanan tercapai, top-up otomatis berhenti hingga akhir bulan kalender (UTC). Tagihan otomatis
muncul di **Credit transactions** dengan kanal `Auto top-up · Stripe`.

## Menukarkan kupon {#redeem-a-coupon}

Masukkan **Coupon code** di bagian **Redeem a coupon**, lalu pilih **Redeem credit**. Kupon hanya berlaku untuk workspace
aktif, jadi pastikan organisasi yang dipilih sudah benar terlebih dahulu.

## Kontrol pengeluaran {#spending-controls}

| Kontrol | Cakupan | Perilaku |
|---------|-------|----------|
| Batas pendanaan organisasi | Seluruh organisasi | Saldo tersedia ditambah credit limit yang dikonfigurasi; permintaan tanpa dana dapat mengembalikan HTTP 402 |
| Batas pengeluaran key | Per API key | Batas opsional per key, dibatasi oleh saldo organisasi |
| Batas bulanan top-up otomatis | Seluruh organisasi | Membatasi tagihan otomatis per bulan kalender (UTC) |

Untuk mengatur batas pengeluaran per key, lihat [API Keys](/getting-started/api-keys).

## Activities dan Analysis {#activities-and-analysis}

[Developer → Activities](https://www.sandbase.ai/console/activities) memiliki dua tab:

- **Request History** mencantumkan setiap permintaan beserta API key, model, status, latensi, dan biayanya.
- **Usage** menampilkan permintaan dan biaya selama 7 atau 30 hari, **Model APIs by Archived Spend**, dan **Billing Records**. Kedua tabel memiliki **Export CSV**. Ekspor billing records menyertakan kolom **Free Quota** yang menandai panggilan yang ditanggung kuota gratis harian.

[Developer → Analysis](https://www.sandbase.ai/console/analytics) menambahkan **Overview**, **Cost analysis**, dan
**Health diagnostics** untuk 7 atau 30 hari UTC penuh terakhir.

Untuk harga publik dan kontrak biaya tugas, lihat [Harga dan Penggunaan](/guides/billing) dan
[Get Task Cost](/api-reference/tasks/cost).
