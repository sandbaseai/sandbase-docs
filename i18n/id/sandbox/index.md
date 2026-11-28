---
i18nSource: 4191d2eb16a594f5
title: Ikhtisar dan Kemampuan Sandbox
description: Buat sandbox dengan E2B SDK atau SandBase Console, periksa status, log, dan metrik, serta jelajahi Playground eksperimental yang terpisah.
---

# Ikhtisar dan kemampuan Sandbox {#sandbox-overview-and-capabilities}

Sandbox menyediakan lingkungan terisolasi untuk menjalankan perintah, mengeksekusi kode, serta membaca atau menulis file. Jeda instance, sambungkan kembali ke instance tersebut, dan baca kembali file untuk memverifikasi persistensi.

[Mulai cepat / E2B SDK](./quickstart) · [Buka Playground (Eksperimental)](./playground)

Gunakan [E2B SDK resmi](./quickstart) untuk mengintegrasikan Sandbox ke dalam aplikasi Anda. Masuk ke [Sandbox Console](https://www.sandbase.ai/console/sandboxes) untuk membuat sandbox serta melihat status, log, dan metrik instance. Lihat [ikhtisar produk Sandbox](https://www.sandbase.ai/sandbox) untuk pengenalannya. Panduan langkah demi langkah dan tabel dukungan di bawah menjelaskan Playground Eksperimental yang terpisah.

## Panduan Playground lima menit {#a-five-minute-playground-walkthrough}

1. Masukkan [kunci API](/getting-started/api-keys) dengan izin Sandbox. Menghubungkan hanya membaca template dan instance.
2. Pilih template yang tersedia, setujui pemberitahuan resource, lalu buat instance berumur pendek.
3. Jalankan contoh informasi sistem atau Python. Amati output dan event proses di samping panel perintah.
4. Tulis dan verifikasi file teks, jeda instance, lanjutkan kembali, lalu baca file yang sama lagi.
5. Periksa event siklus hidup, metrik, log, dan bukti waktu mesin. Hapus instance Anda setelah selesai.

Me-refresh halaman menghapus kredensial halaman dan riwayat operasi lokal; tindakan ini tidak menghapus sandbox. Instance yang berjalan mengikuti batas waktu server. Instance yang dijeda mungkin tetap menahan resource. Catat ID instance dan gunakan tool organisasi Anda untuk merekonsiliasi dan membersihkan resource setelah meninggalkan halaman.

## Kemampuan dan batasan {#capabilities-and-boundaries}

| Kemampuan | Dukungan Playground |
| --- | --- |
| Membuat, menampilkan daftar, menjeda, melanjutkan, memperpanjang batas waktu, menghapus | Tersedia; kontrol perubahan hanya berlaku untuk instance yang dibuat dalam session halaman ini |
| Perintah dan file teks | Tersedia; perintah berjalan hingga 25 detik, dengan pengeditan file terbatas pada `/tmp/` dan 32 KiB |
| Event siklus hidup, log, metrik, waktu mesin | Ketersediaan bervariasi menurut lingkungan; periksa hasil yang dikembalikan |
| Chat AI dan konteks percakapan | Tidak terintegrasi; memerlukan konfigurasi model dan beban kerja Agent |
| PTY, port aplikasi, webhook, build template | Tidak tersedia di antarmuka ini |
| Snapshot dan fork | Tidak tersedia di Playground ini |

Interaksi shell bukan chat AI. Pemulihan instance, persistensi file, kelangsungan proses, dan kesinambungan percakapan adalah hal-hal terpisah yang perlu diverifikasi.

## Memahami event {#understanding-events}

Entri **Sandbox lifecycle** adalah event server native yang diambil saat refresh dan dapat datang dengan jeda. Entri **Sandbox process** menjelaskan dimulainya proses dan output yang di-stream. Entri **Playground** mencatat penyelesaian atau kegagalan permintaan lokal; entri ini bukan event siklus hidup layanan.

Daftar kosong tidak membuktikan penggunaan nol, dan event yang tidak ada tidak membuktikan bahwa operasi gagal. Bukti waktu mesin bukan tagihan akhir. Rekonsiliasi instance setelah batas waktu habis atau koneksi terputus sebelum mencoba permintaan create lainnya.

## Visibilitas template {#template-visibility}

Template dapat bersifat publik atau privat untuk organisasi Anda. Jumlahnya tidak tetap. Entri tanpa nama tetap terlihat, dengan alias atau ID sebagai label pengganti. Akses organisasi Anda dan ketersediaan template menentukan template mana yang dapat Anda lihat dan gunakan.

## Sandbox dan Agent Session {#sandboxes-and-agent-sessions}

Agents Session berjalan di cloud terkelola SandBase. Session ini terpisah dari instance Sandbox yang Anda buat dengan E2B SDK, dan Agents API tidak menyediakan akses ke instance Sandbox. Lihat [Sessions](/agents/sessions).
