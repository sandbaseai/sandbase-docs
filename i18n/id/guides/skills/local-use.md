---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: Menggunakan Skill Secara Lokal
description: Pilih Skill dari SandBase Lab, unduh paketnya, konfigurasikan akses model, lalu buat dan simpan proyek dengan agent lokal.
---

# Menggunakan Skill secara lokal {#use-a-skill-locally}

Unduh SandBase Skill dan selesaikan proyek dengan agent di komputer Anda. Skill berisi instruksi, skrip, dan contoh. Agent mengikuti alur kerja yang dijelaskan dalam `SKILL.md`-nya.


## 1. Pilih Skill {#_1-choose-a-skill}

1. Buka [SandBase Lab](https://www.sandbase.ai/lab/).
2. Jelajahi contoh seperti video, animasi, dan peta. Buka Skill yang sesuai dengan proyek Anda.
3. Tinjau contoh, input yang diperlukan, format output, dan bahasa yang didukung.
4. Gunakan aksi unduh Skill untuk menyimpan paket ZIP.

Untuk film peta sejarah kota, mulailah dengan contoh dan instruksi untuk [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time).

## 2. Siapkan folder kerja lokal {#_2-prepare-a-local-working-folder}

1. Buat folder proyek, misalnya `my-city-film`.
2. Ekstrak seluruh ZIP Skill ke dalamnya, dengan mempertahankan instruksi, skrip, dan aset.
3. Buka proyek di agent lokal Anda dan berikan akses ke file-filenya serta perintah yang diperlukan oleh alur kerja.
4. Ikuti instruksi instalasi di halaman Skill, atau minta agent membaca `SKILL.md` yang telah diekstrak secara langsung.

Proyek dapat menggunakan struktur berikut:

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

Gunakan nama file dan lokasi output spesifik yang diwajibkan oleh Skill.

## 3. Hubungkan SandBase {#_3-connect-sandbase}

Tempelkan `set up https://www.sandbase.ai/SKILL.md` ke agent Anda dan setujui login browser yang dibukanya, atau jalankan `npx -y @sandbaseai/cli@latest connect` di terminal. Setelah itu, mulai session agent baru agar tool SandBase dimuat. Opsi yang sama tersedia di [Build → AI tools](https://www.sandbase.ai/console/setup) di Console.

Lihat [Menghubungkan tool AI](/setup/) untuk alur koneksi lengkap.

Jika skrip Skill memerlukan `SANDBASE_API_KEY`:

1. Buka [API Keys](https://www.sandbase.ai/console/keys) lalu buat atau pilih kunci untuk proyek.
2. Konfigurasikan melalui pengaturan aman agent lokal Anda atau lingkungan eksekusi skrip.
3. Minta agent memeriksa bahwa akses telah dikonfigurasi dan melanjutkan alur kerja Skill.

Simpan kunci di konfigurasi lokal yang aman. Sertakan hanya informasi proyek dalam hasil kerja, file sumber, dan tangkapan layar publik. Lihat penggunaan model dan saldo Anda di [Billing](https://www.sandbase.ai/console/billing).

## 4. Berikan brief {#_4-provide-a-brief}

Beri tahu agent Skill mana yang digunakan, apa yang harus dibuat, persyaratan output, dan anggaran Anda. Sesuaikan contoh ini dengan proyek Anda:

```text
Read SKILL.md in the project's skill folder and follow its workflow.

Topic: the story of Shanghai's development.
Deliverables: a playable video, a cover image, and usage notes.
Language and duration: use the Skill's supported options and state the plan before starting.
Models: use suitable models through SandBase.
Budget: model calls may use up to [AMOUNT] USD; ask me before exceeding it.

Check inputs and dependencies, then execute the workflow. Save previews and final files
in outputs. When finished, provide file paths, a summary, and the models actually used.
```

Agent membaca instruksi, memeriksa dependensi, memproses input, lalu membuat atau me-render proyek. Tambahkan aset yang diminta ke proyek yang sama dan lanjutkan tugas.

## 5. Pantau progres dan tinjau hasilnya {#_5-follow-progress-and-review-the-result}

Durasi bergantung pada Skill, model, aset, dan panjang output. Proyek video dapat memakan waktu puluhan menit hingga beberapa jam. Biarkan agent tetap berjalan dan komputer tetap menyala.

Tanyakan progres dalam percakapan yang sama:

```text
Report the current step, files already saved, and the next step, then continue the task.
```

Buka path file yang dihasilkan, tinjau visual, audio, teks, dan konten, lalu simpan file akhirnya.

## 6. Revisi proyek {#_6-revise-the-project}

Minta perubahan spesifik dalam tugas awal dan gunakan ulang aset yang sudah ada:

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

Jika eksekusi terinterupsi, pertahankan folder kerja dan minta agent melanjutkan dari langkah saat ini.

## Langkah berikutnya {#next-steps}

- [Ikuti AI City Remix](/guides/skills/ai-city-remix)
- [Hubungkan agent Anda](/setup/)
- [Konfigurasikan kunci API](/getting-started/api-keys)
