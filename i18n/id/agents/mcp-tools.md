---
i18nSource: 417ea5dc930a8786
title: Skills dan tool MCP
description: Berikan Skills yang dapat digunakan ulang dan tool MCP jarak jauh kepada SandBase Agent, serta atur versi dan tool yang digunakan setiap Session.
---

# Skills dan tool MCP {#skills-and-mcp-tools}

Agent mendapatkan kemampuan dengan dua cara:

- **Skills** mengajari Agent cara menyelesaikan suatu pekerjaan. Skill adalah bundel ZIP berversi yang berisi instruksi dan sumber daya.
- **Koneksi MCP** memungkinkan Agent memanggil tool pada server MCP jarak jauh melalui HTTPS, opsional dengan autentikasi menggunakan [Secret](/agents/api-credentials).

Sebagian besar Agent yang berguna menggabungkan keduanya: server MCP mengambil data atau melakukan tindakan, dan Skill menjelaskan cara menggunakan hasilnya.

## Skills {#skills}

1. Kemas folder yang berisi `SKILL.md` dengan frontmatter `name` dan `description`, lalu zip folder itu sendiri (`zip -r release-notes.zip release-notes/`, maksimal 5 MiB). Folder tersebut harus berada di tingkat teratas ZIP; `SKILL.md` di root ZIP menghasilkan `400 invalid_request`.
2. Unggah dengan `POST /v1/skills` sebagai field multipart `files`. Respons berisi ID `skl_` dan `default_version: "1"`.
3. Rujuk Skill tersebut dalam array `skills` milik Agent.

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- Pada pemasangan pertama, `"version": null` di-resolve ke `default_version` Skill saat ini ketika Agent disimpan. String seperti `"2"` memilih versi tersebut secara eksplisit.
- Agent yang disimpan menyematkan versinya. Mengubah default Skill tidak meningkatkan versi pada Agent yang sudah ada atau Session barunya. Perbarui Agent dengan versi eksplisit untuk meningkatkan versi; mengirim `null` untuk binding yang sudah ada mempertahankan versi yang disematkan.
- Unggah versi baru dengan `POST /v1/skills/{skill_id}/versions`, dan ganti default dengan `default=true` atau `POST /v1/skills/{skill_id}`.
- Skill yang dinonaktifkan membuat Session baru dari Agent yang merujuknya gagal dengan `400 skill_not_found`.

Anda juga dapat menelusuri Skills publik di [katalog Skills](/api-reference/skills/catalog). Lihat [Skills API](/api-reference/skills/) untuk panduan lengkapnya.

## Tool bawaan SandBase {#built-in-sandbase-tools}

Setiap Agent baru dapat menggunakan tool milik SandBase sendiri tanpa penyiapan. Dengan `sandbase_discover`, `sandbase_inspect`, dan `sandbase_run`, Agent menemukan model atau API di katalog, membaca skema dan harganya, lalu memanggilnya dengan kunci Anda. Jika Anda tidak menyertakan `mcp_connections` saat membuat Agent, Agent mendapatkan default berikut:

```json
{
  "mcp_connections": [
    {
      "connection_id": "builtin:sandbase",
      "server_label": "sandbase_builtin",
      "allowed_tools": null,
      "required": true
    }
  ]
}
```

- **Daftar yang Anda kirim menggantikan default.** Untuk menambahkan server MCP Anda sendiri sekaligus mempertahankan tool SandBase, sertakan entri bawaan dalam daftar Anda.
- **`builtin:sandbase` memerlukan `server_label: "sandbase_builtin"`.** Label lain, atau label tersebut pada koneksi lain, menghasilkan `400`.
- **Untuk membuat Agent tanpa tool,** kirim `"mcp_connections": []`.
- **Tool bawaan gratis.** Anda hanya membayar model dan API yang dipanggil Agent melalui tool tersebut.

## Koneksi MCP {#mcp-connections}

1. Jika server MCP memerlukan Bearer token, [buat Secret](/agents/api-credentials) untuk URL persisnya.
2. Daftarkan server dengan `POST /v1/mcp-connections`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. Rujuk koneksi tersebut dalam array `mcp_connections` milik Agent:

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| Field | Arti |
|---|---|
| `connection_id` | ID koneksi `mcp_` di organisasi Anda, atau `builtin:sandbase` untuk server SandBase bawaan |
| `server_label` | Diawali huruf; berisi huruf, angka, `_`, dan `-`; maksimal 64 karakter; unik dalam Agent |
| `allowed_tools` | Jika dihilangkan atau `null`, semua tool dari server diizinkan; `[]` tidak mengizinkan satu pun; daftar hanya mengizinkan nama-nama tersebut (maksimal 256 nama, masing-masing tidak kosong dan paling banyak 128 byte) |
| `required` | Apakah Session wajib memuat server ini |

Agent dapat merujuk hingga 32 koneksi. Koneksi organisasi harus berstatus `active` saat Session dimulai.

### Tool bawaan SandBase {#built-in-sandbase-tools-1}

Membuat Agent tanpa `mcp_connections` akan memilih server SandBase bawaan. Untuk tetap menyertakannya secara eksplisit bersama server Anda sendiri, sertakan entri ini dalam array:

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

Array eksplisit menggantikan seluruh pilihan; contoh khusus server kustom di atas tidak menyertakan server bawaan. Kirim `[]` untuk menonaktifkan semua tool MCP. Menghilangkan field ini saat memperbarui Agent mempertahankan pilihan yang ada; `null` menghasilkan `400`. Entri bawaan tidak memerlukan pembuatan koneksi MCP atau Secret. Jangan kirim field `use_sandbase_mcp` yang sudah tidak digunakan.

::: info Berbeda dari OpenAI
Agents API OpenAI mendeklarasikan server MCP secara inline sebagai `tools: [{"type": "mcp", ...}]`. SandBase mengembalikan `400` untuk bentuk tersebut: daftarkan server sebagai sumber daya koneksi dan rujuk dalam `mcp_connections`. OpenAI SDK tidak memiliki metode untuk `/v1/mcp-connections` atau `/v1/secrets`, jadi panggil keduanya dengan `client.post(...)` dan teruskan `mcp_connections` melalui `extra_body` (Python) atau body permintaan (Node.js). Lihat [Kompatibilitas OpenAI](/agents/openai-compatibility#mcp-connections-with-the-sdk).
:::

## Perubahan dan Session yang sedang berjalan {#changes-and-running-sessions}

Setiap Session membekukan versi Agent, versi Skill, dan konfigurasi koneksi MCP-nya saat dimulai.

- Setelah Anda mengganti koneksi atau merotasi Secret-nya, Session baru menggunakan konfigurasi baru; Session yang sudah ada tetap memakai snapshot-nya.
- Menonaktifkan koneksi atau mencabut Secret-nya akan memblokir Session baru dan menolak input lanjutan ke Session yang sudah ada yang menggunakannya. Panggilan tool yang sedang berjalan tidak diinterupsi.

## Jauhkan token dari prompt {#keep-tokens-out-of-prompts}

Simpan token sebagai Secret. Jangan letakkan token di instruksi, input Session, metadata, atau bundel Skill: semua itu dapat dibaca oleh siapa pun yang memiliki akses ke Agent atau Session.

## Langkah berikutnya {#next-steps}

- [Kredensial untuk tool MCP](/agents/api-credentials)
- [MCP Connections API](/api-reference/mcp-connections/)
- [Skills API](/api-reference/skills/)
- [Mendefinisikan Agent](/agents/agent-api)

