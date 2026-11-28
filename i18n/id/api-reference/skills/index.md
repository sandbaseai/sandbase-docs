---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: Unggah bundel Skill berversi dan lampirkan ke Agents.
---

# Skills API {#skills-api}

Skill adalah bundel ZIP berversi berisi instruksi dan resource yang dapat di-mount oleh Agent. ID Skill menggunakan prefiks `skl_`, dan identifier versi berupa string seperti `"1"`.

## Operasi Skill {#skill-operations}

| Metode | Path | Tujuan |
|---|---|---|
| `POST` | `/v1/skills` | [Membuat Skill](./create) dari unggahan ZIP |
| `GET` | `/v1/skills` | [Mencantumkan Skills](./list) |
| `GET` | `/v1/skills/{skill_id}` | [Mendapatkan Skill](./get) |
| `POST` | `/v1/skills/{skill_id}` | [Memperbarui](./update) versi default, status, atau metadata |
| `DELETE` | `/v1/skills/{skill_id}` | [Menghapus Skill](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | Mengunduh ZIP versi default |
| `GET` | `/v1/skills/{skill_id}/versions` | [Mencantumkan versi](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [Mengunggah versi](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [Mendapatkan versi](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | Mengunduh ZIP versi |
| `GET` | `/v1/skills/catalog` | [Menjelajahi Skills publik](./catalog) |

## Penyiapan lima menit {#five-minute-setup}

1. Buat folder dengan `SKILL.md` yang frontmatter-nya mengatur `name` dan `description`:

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. Zip folder tersebut (`zip -r release-notes.zip release-notes/`). Ukuran arsip maksimal 5 MiB.
3. Unggah sebagai satu bagian multipart `files`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. Rujuk dari Agent dengan [Update Agent](/api-reference/agents/update):

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

Saat pertama kali melampirkan Skill, `"version": null` (atau `version` yang dihilangkan) diselesaikan ke `default_version` saat ini ketika Agent disimpan. Agent yang tersimpan berisi versi eksplisit. Mengubah default Skill tidak meng-upgrade Agent yang sudah ada. Untuk meng-upgrade, perbarui array `skills`-nya dengan versi eksplisit seperti `"2"`; mengirim `null` untuk binding yang sudah ada mempertahankan versi yang disematkan. Setiap Session menggunakan versi Agent yang tersimpan dan melaporkan Skills yang telah diselesaikan di `environment.skills`.

Sebuah Agent mendukung hingga 32 Skills. ID Skill dan nama Skill harus unik dalam pilihannya.

## Versi {#versions}

- Mengunggah ke `POST /v1/skills/{skill_id}/versions` menambahkan versi berikutnya. Kirim field form `default=true` untuk menjadikannya default.
- `POST /v1/skills/{skill_id}` dengan `default_version` mengganti default tanpa mengunggah.
- `status` bernilai `active` atau `disabled`. Sessions baru dari Agent yang merujuk Skill yang dinonaktifkan gagal dengan `400 skill_not_found`; Sessions yang sudah membekukan sebuah versi tetap menggunakannya.
- Skill yang dirujuk oleh versi Agent mana pun tidak dapat dihapus (409). Nonaktifkan saja. Menghapusnya dari versi Agent terbaru tidak menghapus referensi di versi-versi historis.

## Paginasi dan error {#pagination-and-errors}

Daftar menggunakan paginasi cursor dengan `limit` 0-100, `after`, dan `order`. Error menggunakan [envelope error Agents](/api-reference/errors#agents-platform-errors).

## Mengunduh bundel {#download-a-bundle}

Endpoint content mengembalikan `application/zip`, bukan JSON. Simpan respons ke file:

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

Gunakan `/v1/skills/{skill_id}/content` untuk versi default saat ini. Untuk bundel katalog publik, gunakan `/v1/skills/catalog/{skill_id}/versions/{version}/content`.

Daftar versi menggunakan parameter cursor yang sama dengan daftar Skill. Teruskan `last_id` yang dikembalikan (misalnya, `skl_…:2`) sebagai `after`; jangan meneruskan nomor versi saja.
