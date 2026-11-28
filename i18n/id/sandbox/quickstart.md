---
i18nSource: 0d7d66842e233794
title: Quickstart Sandbox dengan E2B SDK
description: Hubungkan E2B SDK resmi untuk JavaScript dan Python ke SandBase, jalankan perintah, baca dan tulis file, serta kelola sandbox dengan aman.
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# Quickstart Sandbox dengan E2B SDK {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

Gunakan E2B SDK resmi dengan API key SandBase Anda untuk membuat sandbox terisolasi, menjalankan perintah, serta membaca dan menulis file. Panduan ini ditujukan untuk **E2B JavaScript and Python SDK 2.51.0**.

Untuk pembuatan dan pemantauan berbasis browser, masuk ke [Sandbox Console](https://www.sandbase.ai/console/sandboxes) untuk membuat instance dan melihat status, log, serta metriknya. Lanjutkan dengan langkah SDK di bawah untuk integrasi aplikasi, atau baca [ringkasan produk Sandbox](https://www.sandbase.ai/sandbox).

## 1. Mengonfigurasi SDK resmi {#_1-configure-the-official-sdk}

[Buat API key SandBase di Console](https://www.sandbase.ai/console/keys), lalu konfigurasikan variabel lingkungan E2B standar. SDK resmi membacanya secara otomatis di JavaScript maupun Python.

| Variabel lingkungan | Nilai |
|---|---|
| `E2B_API_KEY` | API key SandBase Anda dari [Developer → API Keys](https://www.sandbase.ai/console/keys) |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | Biarkan tidak diatur agar SDK menggunakan alamat data-plane setiap sandbox |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

Jika Anda sudah menyimpan key di `SANDBASE_API_KEY`, gunakan kembali:

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

Anda hanya memerlukan API key SandBase. Gunakan key SandBase biasa yang memenuhi syarat untuk akses Sandbox; key yang dibatasi untuk kapabilitas lain dapat ditolak. Lihat [API key](/getting-started/api-keys).

### Apakah kode E2B yang ada bisa tetap tanpa perubahan? {#can-existing-e2b-code-stay-unchanged}

Ya, untuk operasi yang didukung, jika aplikasi Anda sudah membaca pengaturan koneksi SDK dari lingkungan dan template-nya tersedia di SandBase. Pertahankan SDK resmi dan panggilan yang sudah ada; ganti key, URL API, dan domain di atas. Opsi koneksi eksplisit dalam kode aplikasi diprioritaskan di atas variabel lingkungan, jadi hapus atau perbarui endpoint, domain, atau key penyedia E2B yang di-hardcode.

Atur **keduanya**, `E2B_API_URL` dan `E2B_DOMAIN`. Jika hanya domain yang diatur, SDK 2.51.0 menurunkan host API dengan prefiks `api.` tambahan. `E2B_SANDBOX_URL` menimpa alamat perintah/file per instance; jangan mengaturnya ke origin API kontrol. Mode debug mengubah pemilihan alamat SDK untuk pengembangan lokal, jadi biarkan nonaktif untuk layanan HTTPS ini.

API kontrol membuat dan mengelola instance. Perintah, file, dan port aplikasi menggunakan subdomain per instance di bawah `sandbox.sandbase.ai`. Jangan menambahkan prefiks `/v1` milik API model. Permintaan API kontrol yang berhasil saja tidak memverifikasi akses perintah/file atau semua fitur penyedia.

Contoh-contoh ini membaca variabel lingkungan proses. File `.env` hanya berfungsi jika aplikasi atau launcher Anda memuatnya sebelum menggunakan SDK.

### Memilih template {#choose-a-template}

Gunakan key SandBase Anda untuk mencantumkan template yang terlihat oleh organisasi Anda:

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

Pilih template dengan `buildStatus: "ready"` dan salin `templateID`-nya. Nama tampilan tersedia di `names` atau `aliases`; jika keduanya kosong, gunakan ID. Field `public` membedakan template publik dari template privat yang terlihat oleh organisasi Anda.

Responsnya berupa array. Jika header respons menyertakan `X-Next-Token`, teruskan nilainya sebagai parameter query `nextToken` untuk mengambil halaman berikutnya.

Atur ID template yang dipilih:

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` adalah variabel yang digunakan oleh contoh di bawah, bukan pengaturan bawaan E2B SDK. Contoh-contoh tersebut meneruskannya secara eksplisit ke `Sandbox.create`. Kode yang sudah ada dapat mempertahankan argumen template-nya jika ID atau nama tersebut tersedia di SandBase. Jangan berasumsi ID template E2B upstream atau default SDK `base` tersedia; jika daftar kosong, minta akses template untuk organisasi Anda.

## 2. Membuat, mengeksekusi, dan membersihkan {#_2-create-execute-and-clean-up}

Contoh-contoh ini membuat resource sungguhan. Contoh menggunakan masa hidup dua menit dan menghapus instance secara eksplisit di `finally`. Jalankan satu contoh terlebih dahulu dan pastikan pembersihan berhasil sebelum menjalankannya lagi.

### JavaScript {#javascript}

Gunakan Node.js 22 atau yang lebih baru di direktori aplikasi:

```bash
npm install --save-exact e2b@2.51.0
```

Simpan sebagai `sandbox-example.mjs`:

```js
import { randomUUID } from 'node:crypto';
import { Sandbox } from 'e2b';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const options = {
  requestTimeoutMs: 30_000,
  retries: 0,
};
const template = required('SANDBASE_TEMPLATE_ID');
const runId = randomUUID();
let sandbox;

// Keep this identifier if creation times out before returning an instance ID.
console.log('Run ID:', runId);
try {
  sandbox = await Sandbox.create(template, {
    ...options,
    timeoutMs: 120_000,
    metadata: { quickstartRunId: runId },
  });
  console.log('Sandbox ID:', sandbox.sandboxId);

  const result = await sandbox.commands.run('printf hello-sandbase', {
    timeoutMs: 15_000,
  });
  if (result.exitCode !== 0 || result.stdout !== 'hello-sandbase') {
    throw new Error('Command verification failed');
  }

  const path = '/tmp/sandbase-hello.txt';
  await sandbox.files.write(path, 'hello from SandBase');
  if (await sandbox.files.read(path) !== 'hello from SandBase') {
    throw new Error('File verification failed');
  }
  console.log('Command and file checks passed');
} catch {
  console.error('Sandbox example failed; retain the run ID for troubleshooting');
  process.exitCode = 1;
} finally {
  if (sandbox) {
    try {
      await Sandbox.kill(sandbox.sandboxId, options);
      console.log('Sandbox cleanup completed');
    } catch {
      console.error('Cleanup failed; delete the recorded Sandbox ID');
      process.exitCode = 1;
    }
  }
}
```

Jalankan dengan variabel lingkungan SDK dan template yang dipilih sudah dikonfigurasi:

```bash
node sandbox-example.mjs
```

### Python {#python}

Instal SDK dengan versi yang dipatok di lingkungan Python Anda:

```bash
python -m pip install 'e2b==2.51.0'
```

Simpan sebagai `sandbox_example.py`:

```python
import os
import sys
import uuid
from e2b import Sandbox

options = {
    "request_timeout": 30,
}
template = os.environ["SANDBASE_TEMPLATE_ID"]
run_id = str(uuid.uuid4())
sandbox = None
failed = False

print("Run ID:", run_id)
try:
    sandbox = Sandbox.create(
        template, timeout=120,
        metadata={"quickstartRunId": run_id}, **options,
    )
    print("Sandbox ID:", sandbox.sandbox_id)

    result = sandbox.commands.run("printf hello-sandbase", timeout=15)
    if result.exit_code != 0 or result.stdout != "hello-sandbase":
        raise RuntimeError("Command verification failed")

    path = "/tmp/sandbase-hello.txt"
    sandbox.files.write(path, "hello from SandBase")
    if sandbox.files.read(path) != "hello from SandBase":
        raise RuntimeError("File verification failed")
    print("Command and file checks passed")
except Exception:
    print("Sandbox example failed; retain the run ID for troubleshooting")
    failed = True
finally:
    if sandbox is not None:
        try:
            Sandbox.kill(sandbox.sandbox_id, **options)
            print("Sandbox cleanup completed")
        except Exception:
            print("Cleanup failed; delete the recorded Sandbox ID")
            failed = True

sys.exit(1 if failed else 0)
```

```bash
python sandbox_example.py
```

Berhasil berarti verifikasi perintah/file dan pembersihan sudah selesai. Simpan ID run dan sandbox di dalam organisasi Anda. Jangan mencatat objek SDK ke log: objek tersebut dapat menyimpan access token.

Jika pembuatan mengalami timeout tanpa ID, resource mungkin tetap ada. Minta operator Anda menemukannya menggunakan metadata `quickstartRunId` sebelum membuat yang lain. Timeout atau proses yang terputus tidak memastikan penghapusan; `finally` tidak dapat berjalan setelah proses dihentikan paksa.

## 3. Memperpanjang masa hidup atau menjeda dan menyambungkan ulang {#_3-extend-the-lifetime-or-pause-and-reconnect}

Sisipkan cuplikan ini di dalam blok `try` pada contoh yang sesuai, setelah pemeriksaan file dan sebelum pembersihan. Pause/resume harus didukung oleh template dan penyedia yang dipilih.

JavaScript menggunakan **milidetik** untuk timeout SDK ini:

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

Python menggunakan **detik**:

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

Reconnect mengembalikan objek SDK dan kredensial sesi yang baru. Gunakan objek tersebut untuk perintah dan file selanjutnya. Menghapus sandbox mengakhiri siklus hidupnya; panduan ini tidak menjanjikan penyimpanan tetap ada setelah penghapusan. Masa hidup sandbox dan timeout untuk satu perintah atau permintaan HTTP adalah pengaturan yang berbeda.

## 4. Mengakses port aplikasi {#_4-access-application-ports}

Setelah aplikasi Anda mendengarkan di dalam sandbox, gunakan `sandbox.getHost(port)` di JavaScript atau `sandbox.get_host(port)` di Python untuk mendapatkan host-nya. Lalu lintas aplikasi memerlukan header `e2b-traffic-access-token`, menggunakan `sandbox.trafficAccessToken` atau `sandbox.traffic_access_token` dari koneksi saat ini.

Host saja tidak memberikan otorisasi akses. Klien HTTP atau WebSocket Anda harus mengirim header tersebut; membuka URL di tab browser saja tidak menambahkannya. Perlakukan traffic token dan URL file bertanda tangan sebagai kredensial, dan jauhkan dari log serta tautan yang dibagikan. Akses port harus didukung oleh lingkungan sandbox yang dipilih.

## Pemecahan masalah {#troubleshooting}

| Gejala | Yang perlu diperiksa |
|---|---|
| Error autentikasi atau scope | Validitas key SandBase, akses organisasi, dan scope key |
| Template tidak ditemukan | ID/nama template aktif yang tepat dan visibilitasnya bagi organisasi Anda |
| Pembuatan berhasil tetapi perintah/file gagal | Koneksi jaringan Anda dan kredensial sesi saat ini; sambungkan ulang dan hubungi dukungan jika masalah berlanjut |
| Permintaan menuju layanan yang salah | `E2B_API_URL`, `E2B_DOMAIN`, dan opsi SDK yang di-hardcode yang menimpanya |
| Akses gagal setelah jeda | Sambungkan ulang dan gunakan objek SDK yang baru dikembalikan |
| Port aplikasi menolak permintaan | Kesiapan aplikasi dan header traffic token saat ini |
| `unsupported_operation` | Penyedia yang dipilih tidak mendukung operasi tersebut; periksa ketersediaannya sebelum mengandalkannya |
| Respons pembuatan tidak diketahui | Rekonsiliasi ID run yang tercatat sebelum membuat instance lain |
| Pembersihan gagal | Coba ulang penghapusan untuk ID instance yang tercatat; jangan menjalankan ulang seluruh alur pembuatan |

Contoh-contoh ini mencakup alur kerja dasar perintah/file. Build template, snapshot, event, webhook, dan jaringan lanjutan memerlukan pemeriksaan kapabilitas terpisah. Menginstal E2B SDK saja tidak membuktikan kompatibilitas penuh dengan setiap penyedia.

## Referensi SDK {#sdk-references}

- [Dokumentasi E2B](https://e2b.dev/docs)
- [E2B JavaScript SDK 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [E2B Python SDK 2.51.0](https://pypi.org/project/e2b/2.51.0/)
