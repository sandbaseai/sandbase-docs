---
i18nSource: 8cb9626a2127cb8d
title: Mulai Cepat
description: Pilih cara menggunakan SandBase — di platform, melalui API, atau dengan Agent Anda. Temukan Skills dan Tools, ikuti langkah-langkahnya, dan mulai dari repositori SDK atau CLI.
pageClass: quickstart-page
---

# Mulai Cepat {#quick-start}

## Pilih cara Anda menggunakan SandBase {#connect}

Ini adalah **tiga cara alternatif untuk memulai**, bukan tiga langkah yang harus Anda selesaikan semuanya. Gunakan akun dan workspace SandBase yang sama di ketiganya.

<QuickstartPaths />

Hanya butuh tugas siap pakai? [Jelajahi Tools](#use-tools) atau [pilih Skill](#use-skills). Anda dapat menelusuri katalog publik dan dokumentasi sebelum masuk.

### Mulai dari repositori open-source {#start-from-the-open-source-repositories}

- **[SandBase — SDK & contoh](https://github.com/sandbaseai/sandbase)**: klien Python, TypeScript, dan Go, contoh API, serta alur kerja Agent terkelola. Gunakan ini saat membangun aplikasi Anda sendiri.
- **[SandBase CLI & MCP](https://github.com/sandbaseai/cli)**: pasang dan hubungkan tool AI Anda, atau temukan dan jalankan kapabilitas dari terminal. Gunakan ini dengan Agent yang sudah Anda miliki.

## Sebelum memulai: masuk {#create-account}

Masuklah sebelum menggunakan Playground, menjalankan Skill terkelola, atau membuat API key. Tool gratis yang berfungsi tanpa akun dapat langsung digunakan. **Sudah masuk? Lewati langkah ini** dan pastikan menu akun menampilkan workspace yang ingin Anda gunakan.

SandBase menggunakan GitHub atau Google. Tidak ada pendaftaran terpisah dengan email dan kata sandi.

1. Buka [Buat akun / Masuk](https://www.sandbase.ai/login){target="_blank"}.
2. Selesaikan pemeriksaan keamanan, lalu pilih **Sign in with GitHub** atau **Sign in with Google**.
3. Setujui akses di jendela penyedia.
4. Kembali ke halaman yang sedang Anda gunakan, atau buka [Console](https://www.sandbase.ai/console){target="_blank"}.

Login pertama akan membuat akun Anda dan **workspace pribadi**. Anda tidak perlu membuat organisasi sebelum mencoba SandBase.

Jika kredit sambutan muncul, Anda dapat memulai tanpa menambahkan metode pembayaran. Kartu **Balance** di Dashboard Console dan [Billing](https://www.sandbase.ai/console/billing){target="_blank"} menampilkan saldo saat ini.

## Di platform {#use-on-website}

Pilih cara ini jika Anda ingin mencoba Model, API, atau Agent di browser terlebih dahulu — tanpa memasang klien dan tanpa kode.

1. Masuk, lalu buka katalog:
   - [Model bahasa](https://www.sandbase.ai/models){target="_blank"}
   - [Model gambar dan video](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [API](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. Buka halaman detail model atau API dan pilih **Playground** jika tersedia.
3. Masukkan input yang diperlukan, seperti prompt, gambar, kueri pencarian, atau URL. Periksa harga yang ditampilkan sebelum menjalankan.
4. Jalankan permintaan dan lihat teks, data, gambar, video, atau status tugas yang dikembalikan.

Anda tidak perlu membuat API key terpisah untuk Playground di situs web. Jika suatu kapabilitas tidak menyediakan Playground, gunakan tab **API**-nya dan ikuti jalur API di bawah.

## Melalui API {#call-api}

Pilih cara ini jika Anda menambahkan satu kapabilitas ke aplikasi Anda.

1. Gunakan kembali kunci yang valid untuk workspace yang Anda tuju, atau buat [API key](/getting-started/api-keys) di [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} dengan **New key**. Salin segera; kunci hanya ditampilkan satu kali.
2. Filter katalog dan buka halaman detail:
   - [Model bahasa](https://www.sandbase.ai/models){target="_blank"} — filter berdasarkan penyedia, kapabilitas, konteks, dan harga
   - [Model gambar dan video](https://www.sandbase.ai/models/image-video){target="_blank"} — filter model multimodal seperti text-to-image, image-to-image, text-to-video, dan image-to-video
   - [API](https://www.sandbase.ai/apis){target="_blank"} — filter resource API berdasarkan platform dan sumber data
3. Buka tab **API**, salin contoh permintaan, dan isi field wajib endpoint tersebut.
4. Simpan kunci SandBase Anda di variabel lingkungan server dan jalankan permintaan. Jangan letakkan kunci di kode browser atau repositori publik.
5. Periksa respons. Untuk tugas asinkron, ikuti contoh polling status endpoint hingga selesai.

Contoh panggilan model bahasa untuk **Bash / zsh** (macOS, Linux, atau Windows dengan WSL). Ganti kunci placeholder secara lokal. Untuk lingkungan lain, gunakan contoh Python, TypeScript, atau Go di repositori di bawah; perintah shell tidak dapat dipertukarkan dengan PowerShell.

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

Mulai dari kode: [SDK & contoh SandBase di GitHub](https://github.com/sandbaseai/sandbase).

Pelajari lebih lanjut: [Panggilan API Pertama](/getting-started/first-call).

## Dengan Agent Anda {#use-in-ai-tool}

Pilih cara ini jika Anda menggunakan Claude Code, Codex, Cursor, Kiro, atau klien lain yang didukung dan menginginkan Model serta API SandBase di dalam aplikasi tersebut.

**Untuk penyiapan lokal otomatis:** klien Anda harus dapat menjalankan perintah, dan mesinnya memerlukan Node.js 20+ dengan npm. Jika Anda menggunakan klien khusus chat, ikuti [petunjuk koneksi khusus klien](/setup/) sebagai gantinya.

1. Buka [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"} di Console.
2. Tempelkan baris ini ke chat asisten AI Anda, lalu beri tahu apa yang ingin Anda bangun. Ini adalah instruksi chat, bukan perintah shell:

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. Setujui proses masuk di browser yang dibuka oleh agent. Tidak ada API key yang perlu ditempel.
4. Mulai sesi baru atau mulai ulang aplikasi agar tool SandBase dimuat.
5. Minta agent menemukan dan memeriksa tool yang relevan, lalu membuat satu permintaan terbatas sesuai otorisasi dan anggaran Anda. Untuk pengembangan, minta agent mengintegrasikan respons ke proyek Anda serta memberikan perintah untuk menjalankan dan hasil uji yang sebenarnya. Penemuan saja tidak memverifikasi panggilan API bisnis.

Lebih suka terminal? Jalankan `npx -y @sandbaseai/cli@latest connect`. Perintah ini mengonfigurasi klien yang didukung dan terdeteksi; untuk mengonfigurasi satu klien saja, gunakan `npx -y @sandbaseai/cli@latest connect --client codex` (ganti `codex` dengan klien Anda yang didukung). Setelah itu, mulai ulang klien tersebut. Periksa workspace yang dipilih sebelum menjalankan permintaan berbayar.

Misalnya, Anda dapat meminta:

> Temukan SandBase API untuk mencari postingan publik di X tentang agen AI. Periksa input wajib dan harganya terlebih dahulu, lalu beri tahu saya biaya satu permintaan sebelum menjalankannya. Pertahankan tautan sumber asli dalam hasilnya.

Sumber dan petunjuk pemasangan: [SandBase CLI & MCP di GitHub](https://github.com/sandbaseai/cli).

Pelajari lebih lanjut: [Menghubungkan tool AI](/setup/).

### Biarkan asisten AI Anda membantu membangun {#start-with-your-agent}

[Skill penyiapan](https://www.sandbase.ai/SKILL.md) memandu agent Anda sesuai situasi Anda saat ini: belum punya akun, sudah punya API key, tool sudah terhubung, proyek yang sudah ada, atau fitur baru. Skill ini memeriksa input dan harga endpoint, membantu mengimplementasikan integrasi, dan membedakan antara penyiapan, panggilan yang terverifikasi, dan fitur yang berfungsi. Sampaikan tujuan dan batas pengeluaran Anda; jangan tempelkan kunci Anda ke chat.

Sudah punya kunci atau proyek? Sampaikan saja; Anda tidak perlu memulai dari awal. Misalnya: “Saya punya kunci SandBase. Tambahkan pencarian traffic Similarweb ke proyek ini; periksa API-nya dan tunjukkan biaya uji live terlebih dahulu.” Asisten yang tidak dapat menjalankan perintah atau memuat tool memerlukan [jalur penyiapan khusus klien](/setup/).

[Berikan Quickstart Markdown kepada agent Anda](https://www.sandbase.ai/quickstart.md), atau gunakan langkah-langkah di bawah. Memasang Skill penyiapan tidak dengan sendirinya membuat Agent terkelola.

### Opsional: jalankan Agent terkelola di SandBase {#build-agent}

Pilih cara ini jika pekerjaan memiliki beberapa langkah atau perlu digunakan ulang.

1. Buka [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"} dan pilih **Create**.
2. Isi **Overview** dan **Instructions**.
3. Pilih **Model**.
4. Tambahkan Skills dan tool MCP di bawah **Capabilities**, lalu atur **Runtime**.
5. Pilih **Create & Chat** untuk mengujinya dalam Session.
6. Panggil versi yang telah diuji dari aplikasi Anda melalui tab **API** milik Agent.

Pelajari lebih lanjut: [Build Agent](/agents/). Untuk melakukan hal yang sama dari kode dengan OpenAI SDK resmi, lihat [Kompatibilitas OpenAI](/agents/openai-compatibility).

## Skills, Tools, dan cara lain untuk membangun {#skills-and-tools}

Pilih resource yang sesuai dengan tugas Anda. Anda tidak perlu memasang Skill atau membuat Agent terkelola untuk menggunakan API.

- **[Tools](https://www.sandbase.ai/tools):** selesaikan tugas tertentu di antarmuka siap pakai, seperti memformat teks atau mencari data publik.
- **[Skills](https://www.sandbase.ai/skills):** berikan agent alur kerja yang dapat digunakan ulang beserta instruksi, skrip, dan contoh.
- **Model & API:** panggil kapabilitas dari Playground, kode Anda, atau agent yang terhubung. Jelajahi [model bahasa](https://www.sandbase.ai/models), [gambar & video](https://www.sandbase.ai/models/image-video), atau [data API](https://www.sandbase.ai/apis).
- **[Agent terkelola](/agents/):** konfigurasikan dan jalankan agent yang dapat digunakan ulang di SandBase.
- **[Sandbox](/sandbox/):** berikan kode lingkungan terisolasi untuk eksekusi dan bekerja dengan file.

### Menggunakan Tool {#use-tools}

1. Buka [Tools](https://www.sandbase.ai/tools) dan pilih tugas yang ingin Anda selesaikan.
2. Baca persyaratan input tool serta label harga atau kuotanya. Utilitas gratis dapat berfungsi tanpa akun; tool data memerlukan masuk ke SandBase untuk dijalankan, dan uji model mungkin memerlukan kunci Anda sendiri.
3. Masukkan teks, URL, file, atau input lain yang diminta, lalu gunakan tindakan run pada tool.
4. Tinjau output dan gunakan tindakan salin atau unduh jika tersedia. Untuk tool data, gunakan API tertaut dan contoh permintaannya jika Anda ingin mengotomatiskan tugas yang sama.

**Kuota harian gratis dibagi untuk seluruh workspace**, bukan jatah terpisah untuk setiap tool. Periksa kelayakan dan harga yang ditampilkan sebelum menjalankan; utilitas gratis tidak membuat panggilan model atau API menjadi gratis.

### Menggunakan Skill {#use-skills}

1. Buka [Skills](https://www.sandbase.ai/skills), pilih alur kerja, lalu baca contoh, input wajib, dan dependensinya.
2. Pilih salah satu opsi yang tersedia di halaman detail Skill tersebut:
   - **Run online:** masuk dan jalankan contoh terkelola jika tersedia. Ikuti progresnya dan buka output atau file yang dihasilkan. Periksa jatah yang ditampilkan; ketersediaan dan batasnya berbeda-beda untuk setiap Skill.
   - **Install / Download:** masuk untuk mengunduh paket jika tersedia. Ekstrak seluruh paket ke folder kerja, lalu ikuti petunjuk pemasangannya atau minta agent lokal Anda membaca `SKILL.md`-nya.
3. Untuk penggunaan lokal, berikan tugas, input, output yang diinginkan, dan batas pengeluaran Anda. Hubungkan SandBase menggunakan [jalur Agent](#use-in-ai-tool); jika skrip Skill memerlukan kunci, konfigurasikan di lingkungan eksekusi alih-alih menempelkannya ke chat.
4. Tinjau hasil yang sebenarnya. Mengunduh Skill atau menghubungkan agent Anda tidak berarti alur kerja telah berhasil dijalankan.

**Skill penyiapan** SandBase menghubungkan klien Anda; Skills di katalog menjelaskan alur kerja masing-masing. Periksa dependensi dan klien yang didukung setiap Skill sebelum memasang. Panggilan model dan API yang digunakan oleh alur kerja lokal dapat dikenai biaya penggunaan.

Lihat [Menggunakan Skill secara lokal](/guides/skills/local-use) untuk panduan lengkap, termasuk folder input dan hasil kerja yang disimpan.

## Opsional: berbagi workspace tim {#create-organization}

API key, penggunaan, dan penagihan dimiliki oleh organisasi. Tetap gunakan workspace pribadi jika Anda mengevaluasi sendiri. Buat tim jika beberapa orang akan berbagi kunci dan pengeluaran.

| Workspace | Kapan digunakan |
|---|---|
| **Pribadi** | Dibuat otomatis saat login pertama. Satu per pengguna. |
| **Tim** | Anggota, kunci, dan saldo bersama. Buat ini untuk perusahaan atau proyek. |

### Membuat tim {#create-team}

1. Buka [Buat tim](https://www.sandbase.ai/console/members?create=1){target="_blank"}, atau pilih **Create Team** di menu akun di kanan atas Console.
2. Masukkan **Team name**, lalu pilih **Create team**.
3. Pastikan menu akun sekarang menampilkan tim tersebut sebagai workspace aktif.
4. Di **Developer → Team**, pilih **Add member**, masukkan **Account email** dari akun SandBase yang sudah ada, dan pilih **Workspace role** (Member atau Admin).

Orang yang diundang harus sudah memiliki akun SandBase. Jika belum, kirimkan [halaman ini](/getting-started/quickstart) agar mereka dapat masuk terlebih dahulu, lalu tambahkan mereka.

Jika Anda tergabung di lebih dari satu organisasi, beralihlah melalui menu akun. Kunci dan penagihan mengikuti organisasi yang **aktif**. Lihat [Organisasi](/admin/organizations) untuk peran.

## Pastikan semuanya berfungsi {#confirm-it-works}

Anda siap jika semua hal berikut terpenuhi:

- Menu akun Console menampilkan organisasi yang ingin Anda gunakan.
- Anda telah menyelesaikan satu jalur: panggilan API, run di situs web, tool AI yang terhubung, atau Agent.
- Satu permintaan berhasil.

Jika permintaan gagal, periksa organisasi aktif, kunci, dan [Error](/guides/error-handling). Isi ulang saldo di [Billing](https://www.sandbase.ai/console/billing){target="_blank"} jika workspace tidak memiliki sisa saldo.

### Jika Anda mengalami kendala {#if-you-get-stuck}

| Yang Anda lihat | Yang perlu diperiksa |
| --- | --- |
| Harus masuk | Masuk, kembali ke halaman semula, dan periksa workspace aktif. |
| Kunci tidak valid atau akses ditolak | Pastikan kunci milik workspace yang dituju dan memiliki akses ke endpoint. Menambah kredit tidak memperbaiki izin. |
| Saldo tidak mencukupi atau kuota habis | Baca respons: periksa Billing untuk masalah saldo, atau waktu reset yang ditampilkan untuk batas kuota. |
| Tidak ada tool di Agent Anda | Mulai sesi klien baru, lalu ikuti diagnostik di [Menghubungkan tool AI](/setup/). |
| Tugas masih berjalan | Ikuti status tugas yang dikembalikan atau indikator progres di halaman. Hindari mengirim permintaan berbayar yang sama berulang kali. |

## Penagihan dan penggunaan {#billing-and-usage}

Setelah masuk, tinjau pengeluaran untuk organisasi aktif:

<QuickstartResources group="ops" />

## Langkah selanjutnya {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools) — selesaikan tugas di browser
- [Skills](https://www.sandbase.ai/skills) — temukan alur kerja agent yang dapat digunakan ulang
- [API key](/getting-started/api-keys) — buat dan rotasi kunci organisasi
- [Katalog Model dan API](https://www.sandbase.ai/models) — coba Model, API, dan Agents di situs web
- [Menghubungkan tool AI](/setup/) — berikan katalog SandBase ke tool AI Anda
- [Build Agent](/agents/) — buat Agents yang dapat digunakan ulang
- [Referensi API](/api-reference/) — integrasikan dengan kode

