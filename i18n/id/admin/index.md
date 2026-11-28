---
i18nSource: adfacb669489863e
title: Akun dan penagihan
description: Kelola organisasi SandBase, API key, penagihan, penggunaan, dan batas Anda.
---

# Akun dan penagihan {#account-and-billing}

Pengaturan organisasi Anda menentukan siapa pemilik penggunaan, cara aplikasi melakukan autentikasi, dan cara pengeluaran dipantau.

## Yang Anda kelola {#what-you-manage}

| Area | Kegunaan |
|---|---|
| [Organisasi](/admin/organizations) | Mengelola batas workspace, anggota, dan kepemilikan |
| [API Key](/getting-started/api-keys) | Membuat, merotasi, dan mencabut kredensial aplikasi |
| [Penagihan dan kredit](/admin/billing) | Meninjau saldo, membeli kredit, menyiapkan isi ulang otomatis, dan meninjau penggunaan di Activities dan Analysis |
| [Harga dan penggunaan](/guides/billing) | Melihat harga model, panggilan API gratis harian, dan biaya satu tugas |
| [Batas laju](/guides/rate-limiting) | Memahami batas permintaan dan perilaku retry yang aman |

## Penyiapan yang disarankan {#recommended-setup}

1. Pastikan Anda bekerja di organisasi yang benar.
2. Buat API key terpisah untuk development, staging, dan production.
3. Beri nama key sesuai aplikasi dan lingkungannya.
4. Tinjau Activities dan penagihan setelah permintaan production pertama.
5. Cabut key yang tidak digunakan dan segera selidiki penggunaan yang tidak terduga.

## Kepemilikan dan akses {#ownership-and-access}

API key dan penggunaan dimiliki oleh sebuah organisasi. Berpindah organisasi akan mengubah resource, key, dan konteks penagihan yang terlihat di Console. Sebelum mengubah konfigurasi production, periksa organisasi yang dipilih dan koordinasikan rotasi key dengan aplikasi yang menggunakannya.

## Dasar-dasar keamanan {#security-basics}

- simpan key di environment variable atau secrets manager
- jangan pernah menempelkan key ke instruksi Agent, kode sumber, tangkapan layar, atau pesan dukungan
- gunakan key terpisah untuk setiap aplikasi dan lingkungan
- segera cabut key jika key tersebut mungkin telah terekspos
- pantau Activities untuk volume, model, atau endpoint yang tidak terduga
