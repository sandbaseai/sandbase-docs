---
i18nSource: 20679b8b1344acb5
title: Sandbox Playground (Eksperimental)
description: Coba sandbox SandBase sungguhan dengan API key Anda sendiri. Buat sandbox, jalankan perintah, verifikasi file setelah jeda dan lanjut, serta periksa event siklus hidup.
outline: false
aside: false
pageClass: sandbox-playground-page
---

# Sandbox Playground {#sandbox-playground}

Coba Sandbox API dengan kunci Anda sendiri. Operasi terhubung ke **sandbox.sandbase.ai** dan dapat dikenai biaya.

<ClientOnly>
  <SandboxPlayground />
</ClientOnly>

## Kunci Anda tetap dalam kendali Anda {#your-key-stays-under-your-control}

- **Hanya di memori halaman.** Playground ini tidak menyimpan API key atau token koneksi Anda ke penyimpanan browser atau cookie, tidak menaruhnya di URL, dan tidak mencatatnya di aktivitas halaman atau contoh permintaan.
- **Hapus kapan saja.** Pilih **Clear key** untuk menghapus kunci, token koneksi, dan aktivitas yang ditampilkan, bahkan saat permintaan sedang berjalan. Memuat ulang atau meninggalkan halaman ini juga akan menghapusnya. Anda perlu memasukkan kunci lagi untuk menyambung kembali.
- **Hanya digunakan untuk permintaan Anda.** Kunci Anda dikirim ke SandBase untuk mengautentikasi operasi Sandbox yang Anda minta. Menghapus halaman ini tidak mencabut kunci; cabut di [Developer → API Keys](https://www.sandbase.ai/console/keys) jika diperlukan.

Jaminan ini mencakup cara Playground ini menangani kredensial. Jaminan ini tidak berarti aktivitas Sandbox atau catatan penggunaan di sisi layanan ikut terhapus. Hindari memasukkan secret di perintah atau file, karena isinya dapat tetap tersimpan di sandbox Anda.

## Bersihkan resource secara terpisah {#clean-up-resources-separately}

Menghapus kunci tidak membatalkan operasi yang sudah diterima layanan dan tidak menghapus sandbox. Hapus instans setelah selesai. Jika hasil pembuatan tidak diketahui, periksa instans Anda sebelum membuat yang baru. Simpan ID instans yang Anda perlukan untuk pembersihan sebelum menghapus halaman ini.

[Ikhtisar dan kapabilitas](./index) · [Mulai cepat / E2B SDK](./quickstart)
