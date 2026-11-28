---
i18nSource: dab112fdbbc56799
title: Kredensial untuk tool MCP
description: Simpan Bearer token write-only sebagai Secret agar Agent dapat memanggil server MCP yang memerlukan autentikasi.
---

# Kredensial untuk tool MCP {#credentials-for-mcp-tools}

Jika server MCP memerlukan autentikasi, simpan Bearer token-nya sebagai **Secret** lalu lampirkan Secret tersebut ke [koneksi MCP](/agents/mcp-tools#mcp-connections). Lingkungan eksekusi hanya mengirim token ke server tersebut.

## Cara kerja Secret {#how-secrets-work}

- `kind` selalu `mcp_bearer`: Bearer token untuk satu server MCP.
- Setiap Secret terikat ke satu `server_url` yang persis. Koneksi hanya dapat menggunakannya jika `server_url`-nya cocok. Untuk URL lain, buat Secret lain.
- Token bersifat write-only. API mengembalikan nama, URL, status, dan `row_version` Secret, tetapi tidak pernah mengembalikan token.
- Secret bukan environment variable. Secret tidak disuntikkan ke runtime Agent, dan Agent tidak dapat membacanya.

Versi SandBase sebelumnya menyimpan kredensial dengan cakupan workspace atau Agent dan menyuntikkannya sebagai environment variable seperti `GITHUB_TOKEN`. Model tersebut sudah dihentikan dan datanya tidak dimigrasikan. Buat ulang nilai yang masih Anda perlukan sebagai Secret pada koneksi MCP.

## Dengan API {#with-the-api}
Buat, rotasi, dan cabut Secret dengan API. Panduan ini adalah kontrak API; halaman Credentials di Console, yang dibuka dari editor Agent, bukan acuan untuk perilaku Secret. Panggil endpoint ini dari backend tepercaya, jangan pernah dari kode browser: endpoint ini menerima API key SandBase dan token dalam bentuk plaintext.

| Metode | Path | Tujuan |
|---|---|---|
| `POST` | `/v1/secrets` | [Membuat Secret](#create-a-secret) |
| `GET` | `/v1/secrets` | [Menampilkan daftar Secret](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Mengambil Secret](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [Merotasi token](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Mencabut Secret](#revoke-a-secret) |

Setiap operasi tulis memerlukan `Idempotency-Key` (1-128 byte, tanpa spasi di awal atau akhir). Objek Secret memiliki `id` (prefiks `sec_`), `name`, `kind`, `server_url`, `status`, `row_version`, `created_at`, dan `updated_at`. `status` bernilai `pending` selama token sedang disimpan, `active` saat dapat digunakan, dan `disabled` setelah dicabut. `created_at` dan `updated_at` adalah string timestamp RFC 3339.

### Membuat Secret {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind` harus `mcp_bearer`.
- `server_url` harus HTTPS tanpa user info, query, atau fragment. Secret hanya berfungsi untuk URL yang persis ini.
- `name` dan `token` wajib diisi dan tidak boleh kosong. `name` maksimal 128 byte, `token` maksimal 16384 byte, dan `server_url` maksimal 2048 byte.

Respons berupa `201 Created` tanpa token. Gunakan ID `sec_` sebagai `secret_id` saat Anda [membuat koneksi MCP](/api-reference/mcp-connections/#create-a-connection).

### Menampilkan daftar Secret {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Paginasi offset dengan `data`, `total`, `limit`, dan `offset`. `limit` default-nya 20 dan maksimal 200; nilai yang tidak ada, tidak valid, atau tidak positif akan menggunakan 20. `offset` default-nya 0; nilai yang tidak valid atau tidak positif akan menggunakan 0. Majukan sebesar `limit` yang dikembalikan hingga `offset + data.length >= total`. Secret yang dinonaktifkan tetap ada di daftar.

### Mengambil Secret {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### Merotasi Secret {#rotate-a-secret}

Atur `SECRET_ROW_VERSION` ke `row_version` terbaru dari Mengambil Secret.

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

Rotasi mengganti token dan mempertahankan Secret serta `server_url` yang sama. `token` dan `row_version` berupa bilangan bulat positif wajib diisi, Secret harus `active`, dan `row_version` harus cocok dengan nilai terbaru. Mengembalikan `201 Created`. Session baru menggunakan token baru; Session yang sudah berjalan tetap memakai kredensial yang telah dibekukannya.

### Mencabut Secret {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

Mengembalikan `204 No Content` dan mengatur `status` menjadi `disabled`. Koneksi yang menggunakan Secret tersebut berhenti berfungsi untuk Session baru dan untuk input berikutnya ke Session yang sudah ada. Pencabutan tidak dapat dibatalkan: buat Secret baru dan ganti koneksinya.

### Error dan retry {#errors-and-retries}

Error menggunakan [amplop error Agents](/api-reference/errors#agents-platform-errors). Field yang tidak valid atau idempotency key yang tidak ada pada operasi tulis mengembalikan `400 invalid_request`; Secret yang tidak dikenal atau tidak dapat diakses mengembalikan `404 not_found`. `row_version` yang usang, status lifecycle yang tidak sesuai, atau penggunaan ulang key pembuatan dengan input berbeda mengembalikan `409 conflict`. Baca ulang Secret sebelum mencoba lagi, dan gunakan key baru untuk setiap operasi tulis baru.

## Keamanan {#security}

- Buat dan rotasi Secret dari backend tepercaya, jangan pernah dari kode browser.
- Baca token dari secret store atau environment Anda sendiri, seperti `$GITHUB_MCP_TOKEN` di atas, alih-alih menempelkannya ke skrip.
- Jangan masukkan token ke instruksi, input Session, metadata, maupun bundle Skill.
- Cabut Secret segera setelah token-nya mungkin bocor, lalu buat yang baru dan ganti koneksinya.

## Langkah berikutnya {#next-steps}

- [Skills dan tool MCP](/agents/mcp-tools)
- [API Koneksi MCP](/api-reference/mcp-connections/)
