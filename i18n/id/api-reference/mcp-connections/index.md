---
i18nSource: ee126767f58b111b
title: API Koneksi MCP
description: Daftarkan server MCP HTTPS jarak jauh yang dapat dipanggil oleh Agents.
---

# API Koneksi MCP {#mcp-connections-api}

Koneksi MCP mendaftarkan server MCP jarak jauh yang dapat dijangkau melalui HTTPS. Agents mereferensikan koneksi di `mcp_connections`; setiap Session membekukan konfigurasi koneksi saat dimulai. ID koneksi menggunakan prefiks `mcp_`. Untuk melakukan autentikasi ke server dengan Bearer token, buat terlebih dahulu [Secret](/agents/api-credentials#with-the-api) untuk URL yang sama.

| Metode | Path | Tujuan |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [Membuat koneksi](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [Menampilkan daftar koneksi](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [Mengambil koneksi](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [Mengganti koneksi](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [Mengaktifkan koneksi](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [Menonaktifkan koneksi](#disable-a-connection) |

Setiap operasi tulis memerlukan `Idempotency-Key` (1-128 byte, tanpa spasi di awal atau akhir). Objek koneksi memiliki `id`, `name`, `server_url`, `secret_id` (jika diatur), `status` (`active` atau `disabled`), `row_version`, `created_at`, dan `updated_at`.

## Membuat koneksi {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name` wajib diisi dan tidak boleh kosong, hingga 128 byte.
- `server_url` harus berupa HTTPS tanpa info pengguna, query, atau fragment (hingga 2048 byte).
- `secret_id` bersifat opsional. Hilangkan untuk server anonim. Jika diatur, Secret harus berstatus `active` dan `server_url`-nya harus sama persis dengan `server_url` ini; jika tidak, permintaan gagal (409 untuk Secret yang tidak aktif, 400 untuk URL yang tidak cocok).

Mengembalikan `201 Created`.

## Menampilkan daftar koneksi {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Paginasi offset dengan `data`, `total`, `limit`, dan `offset`. `limit` default-nya 20 dan maksimum 200; nilai yang tidak ada, tidak valid, atau tidak positif menggunakan 20. `offset` default-nya 0; nilai yang tidak valid atau tidak positif menggunakan 0. Majukan sebesar `limit` yang dikembalikan hingga `offset + data.length >= total`. Resource yang dinonaktifkan tetap terlihat dalam daftar.

## Mengambil koneksi {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## Mengganti koneksi {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT` mengganti `name`, `server_url`, dan `secret_id` sekaligus; menghilangkan `secret_id` membuat koneksi menjadi anonim. `row_version` wajib diisi dan harus cocok dengan nilai saat ini yang dikembalikan oleh Get Connection. Mengembalikan `200 OK` dengan koneksi yang diperbarui. Koneksi yang dinonaktifkan tetap nonaktif setelah diganti hingga Anda mengaktifkannya.

## Mengaktifkan koneksi {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version` wajib diisi dan harus berupa bilangan bulat positif yang cocok dengan resource saat ini. Mengembalikan `200 OK` dengan koneksi. Pengaktifan mempertahankan ID koneksi yang sama. Pengaktifan tidak memulihkan Secret yang dicabut; ganti koneksi dengan Secret aktif yang baru terlebih dahulu.

## Menonaktifkan koneksi {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

Mengembalikan `204 No Content` dan mengatur `status` ke `disabled`. Session baru tidak dapat menggunakan koneksi tersebut, dan Session yang sudah ada yang membekukannya menolak input berikutnya. Panggilan tool yang sedang berjalan tidak diinterupsi.

## Perubahan dan Session yang sedang berjalan {#changes-and-running-sessions}

Session membekukan pengaturan koneksi saat dimulai. Setelah Anda mengganti koneksi atau merotasi Secret-nya, Session baru menggunakan konfigurasi baru dan Session yang sudah ada mempertahankan snapshot-nya. Menonaktifkan koneksi atau mencabut Secret-nya memblokir Session baru maupun input berikutnya ke Session yang sudah ada.

## Error dan percobaan ulang {#errors-and-retries}

Error menggunakan [envelope error Agents](/api-reference/errors#agents-platform-errors). Field yang tidak valid atau kunci idempotensi tulis yang tidak ada mengembalikan `400 invalid_request`; resource yang tidak dikenal atau tidak dapat diakses mengembalikan `404 not_found`. `row_version` yang usang, status siklus hidup yang tidak kompatibel, atau penggunaan ulang kunci create/update dengan input berbeda mengembalikan `409 conflict`. Baca ulang resource sebelum mengirim pembaruan baru, dan gunakan kunci baru untuk setiap operasi tulis baru.

`created_at` dan `updated_at` adalah string timestamp RFC 3339.
