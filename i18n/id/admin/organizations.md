---
i18nSource: 258f8ff4bb1ed96f
title: Organisasi
description: Kelola organisasi, anggota, dan peran di SandBase.
---

# Organisasi {#organizations}

Organisasi adalah unit penagihan dan kontrol akses di SandBase. Kunci API, saldo, penggunaan, dan anggota semuanya dimiliki oleh sebuah organisasi.

## Jenis Organisasi {#organization-types}

| Jenis | Deskripsi |
|------|-------------|
| **Personal** | Dibuat otomatis saat login pertama. Satu per pengguna. |
| **Team** | Dibuat secara manual. Beberapa anggota dengan peran masing-masing. |

## Peran Anggota {#member-roles}

| Peran | Izin |
|------|-------------|
| **Owner** | Akses penuh ke workspace, termasuk mengubah peran anggota. |
| **Admin** | Mengelola kunci dan penagihan, serta menambah atau menghapus anggota selain owner. |
| **Member** | Menggunakan workspace dan kunci API-nya tanpa akses pengelolaan anggota. |

## Membuat Organisasi Team {#create-a-team-organization}

1. Buka menu akun di kanan atas Console.
2. Pilih **Create Team**, atau buka **Developer → Team** lalu pilih **Create team**.
3. Masukkan **Team name**, lalu pilih **Create team**.
4. Pilih **Add member**, masukkan **Account email** dari akun SandBase yang sudah ada, lalu pilih **Workspace role**: **Member** atau **Admin**.

Anggota yang ditambahkan harus sudah memiliki akun SandBase. Owner dapat mengubah peran anggota; owner dan admin dapat menghapus
anggota selain owner.

## Beralih Organisasi {#switch-organizations}

Jika Anda tergabung dalam beberapa organisasi, beralihlah di antara organisasi tersebut melalui menu akun, atau gunakan strip **Switch workspace** di **Developer → Team**. Kunci API dan penagihan Anda berlaku untuk organisasi yang sedang aktif.

## Saldo dan penagihan {#balance-and-billing}

Setiap organisasi memiliki saldonya sendiri. Panggilan model, panggilan API, Agent Session, dan pekerjaan runtime dibebankan ke saldo ini. Lihat [Penagihan](/admin/billing) untuk detailnya.
