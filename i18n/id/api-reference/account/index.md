---
i18nSource: 3b9b3fc27f878cd5
title: Account API
description: Periksa saldo organisasi dan riwayat eksekusi terkini yang terkait dengan API key.
---

# Account API {#account-api}

Endpoint akun bersifat hanya-baca dan bekerja pada organisasi yang ditentukan dari Bearer API key.

| Operasi | Endpoint |
|---|---|
| [Mendapatkan saldo](./balance) | `GET /v1/account/balance` |
| [Mencantumkan riwayat eksekusi](./history) | `GET /v1/account/history` |

Nilai saldo dan biaya berupa string desimal yang presisi. Simpan sebagai nilai desimal, jangan dikonversi melalui
aritmetika floating-point biner.

Riwayat eksekusi ditujukan untuk pemeriksaan operasional terkini. Gunakan catatan penagihan atau ekspor untuk rekonsiliasi
keuangan jangka panjang.

Pemfilteran riwayat menggunakan timestamp UTC mentah. Tanpa `request_id`, parameter kompatibilitas opsional `timezone` divalidasi sebagai nama zona waktu IANA, tetapi tidak mengubah timestamp respons; mode `request_id` persis mengabaikannya bersama filter lainnya. Nilai `type` yang tidak dikenal tidak menerapkan filter jenis eksekusi; gunakan `multimodal`, `llm`, atau `api` agar filter berlaku. Nilai `range` yang tidak didukung kembali ke `7d`.

Entri riwayat dapat berisi parameter permintaan yang tersimpan dan output model. Batasi akses ke API key sesuai hal tersebut,
dan jangan menyalin respons riwayat ke log atau tiket dukungan tanpa memeriksanya terlebih dahulu dari data sensitif.

