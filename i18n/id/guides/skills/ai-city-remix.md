---
i18nSource: ff1347dede49419a
agentDoc: ai-city-remix-agent-en
title: Ikuti AI City Remix
description: Klaim kredit AI City Remix, pilih kota dan Skill, buat video dengan agent lokal Anda, lalu unggah untuk ditinjau.
---

# Ikuti AI City Remix {#enter-ai-city-remix}

Pilih Skill dan kota di halaman acara, lalu serahkan instruksi lengkapnya ke agent lokal Anda. Setelah pembuatan selesai, agent mengunggah video, sampul, dan detail karya, lalu mengirimkannya untuk ditinjau.


## Prasyarat {#prerequisites}

- Akun SandBase.
- Agent lokal dengan kemampuan menjalankan perintah dan mengakses file.
- Folder kerja untuk video, sampul, dan file proyek.

Untuk penyiapan lokal pertama Anda, ikuti [Menggunakan Skill secara lokal](/guides/skills/local-use).

## 1. Buka acara dan klaim kredit {#_1-open-the-event-and-claim-credits}

1. Buka [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en) dan baca [aturan acara](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en) yang berlaku.
2. Klik “Klaim $5 gratis & buat” dan masuk saat diminta.
3. Sistem mengklaim kredit acara dan mencoba menukarkannya secara otomatis. Periksa saldo dan status penukaran; gunakan tindakan penukaran jika perlu mencoba lagi.
4. Setelah mengklaim, klik “Buat sekarang” untuk membuka dialog pembuatan.

Tanggal klaim, ketersediaan, dan kelayakan ditampilkan di halaman acara. Panggilan model menggunakan kredit sesuai penggunaan sebenarnya; tinjau di [Billing](https://www.sandbase.ai/console/billing).

## 2. Konfigurasikan API key model {#_2-configure-a-model-api-key}

Jika akun Anda tidak memiliki API key yang dapat digunakan, alur ini menampilkan dialog “Buat API key”.

1. Tinjau batas pengeluaran dan masa berlaku yang ditampilkan, lalu klik “Buat API key”.
2. Klik “Buat dengan key ini”. Key baru disertakan dalam instruksi lengkap yang diserahkan ke agent.
3. Kirim instruksi lengkap ke agent yang Anda percayai dan simpan di workspace privat.

Untuk key yang sudah ada, konfigurasikan `SANDBASE_API_KEY` melalui pengaturan aman atau lingkungan eksekusi agent lokal Anda. Kelola key di [API Keys](https://www.sandbase.ai/console/keys).

## 3. Pilih Skill dan brief {#_3-choose-a-skill-and-brief}

Dialog dimulai dengan Skill resmi, kota, cerita, dan arahan kreatif yang sudah dipilih.

- Bentangkan “Skill resmi” untuk membaca ringkasan dan detailnya, lalu pilih pendekatan visual.
- Bentangkan “Brief kreatif” untuk mencari kota atau memilih lokasi di peta.
- Acak saran atau edit cerita dan arahan kreatif secara langsung.
- Konfirmasi lokasi peta, bahasa yang didukung, dan gaya output.

Gunakan sumber yang dapat diverifikasi untuk sejarah, tokoh, dan peristiwa. Periksa detail Skill yang dipilih untuk dukungan bahasa dan durasi.

## 4. Salin instruksi dan mulai membuat {#_4-copy-the-instructions-and-create}

1. Klik “Salin semua” di area prompt.
2. Buka folder proyek di agent lokal Anda, mulai tugas, lalu tempel instruksi lengkapnya.
3. Kirim instruksi, berikan input yang diminta, konfigurasikan dependensi, dan mulai pembuatan.

Instruksi berisi Skill yang dipilih, brief kreatif, format metadata karya, dan otorisasi unggah. Simpan seluruh instruksi serah terima agar agent dapat membuat dan mengirimkan karya.

“Menyiapkan” berarti akses unggah sedang disiapkan. Gunakan “Coba lagi” untuk menyiapkannya ulang, atau “Lengkapi brief” untuk mengisi detail yang kurang.

## 5. Pantau progres pembuatan {#_5-follow-creation-progress}

Pembuatan dapat memakan waktu puluhan menit hingga berjam-jam, tergantung Skill, model, dan durasi video, serta menggunakan kredit model. Biarkan agent tetap berjalan dan komputer tetap menyala.

Tambahkan instruksi anggaran dan progres ke tugas yang sama:

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

Gunakan MiniMax M3.1 Flash melalui SandBase sesuai aturan acara yang berlaku. Ikuti persyaratan acara dan halaman unggah untuk durasi, resolusi, subtitle, dan ukuran file.

## 6. Kirim dan periksa status peninjauan {#_6-submit-and-check-review-status}

Agent mengikuti instruksi lengkap untuk menggunakan klien unggah resmi, mengunggah video, sampul, dan metadata, lalu mengirimkannya untuk ditinjau.

Buka [Karya saya](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en) untuk memeriksa progres:

| Status | Langkah berikutnya |
|---|---|
| Draf | Selesaikan film, unggah file, dan kirim untuk ditinjau. |
| Menunggu peninjauan | Pantau status peninjauan. |
| Disetujui | Buka halaman karya publik dan bagikan. |
| Perlu perubahan | Revisi sesuai catatan peninjauan dan kirim lagi. |

Untuk film yang sudah ada, pilih “Unggah video yang sudah ada” di halaman acara, isi detailnya, unggah video dan sampul, lalu kirim untuk ditinjau.

## 7. Lanjutkan unggahan {#_7-resume-an-upload}

Jika otorisasi kedaluwarsa atau unggahan terputus, lanjutkan dengan file aslinya:

1. Simpan video, sampul, `entry.json`, dan folder kerja.
2. Temukan draf yang sama di Karya saya dan klik “Lanjutkan unggahan”.
3. Salin instruksi lanjutan yang baru ke tugas agent semula.
4. Minta agent mengunggah dan mengirimkan file yang sudah ada, lalu periksa statusnya di Karya saya.

## 8. Bagikan karya Anda {#_8-share-your-entry}

Di halaman karya yang disetujui, klik “Bagikan di X” untuk membuka composer yang sudah terisi. Composer tersebut menyertakan tautan karya, `#AICityRemix`, `@SandbaseAI`, dan postingan resmi acara.

Untuk memublikasikan postingan video, klik “Unduh video” terlebih dahulu, tambahkan file di composer X, tinjau teksnya, lalu publikasikan.

## Dokumentasi terkait {#related-documentation}

- [Menggunakan Skill secara lokal](/guides/skills/local-use)
- [Menghubungkan agent Anda](/setup/)
- [Mengonfigurasi API key](/getting-started/api-keys)
