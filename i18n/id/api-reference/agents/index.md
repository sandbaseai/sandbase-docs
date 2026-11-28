---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: Buat, beri versi, arsipkan, dan clone konfigurasi Agent tersimpan.
---

# Agents API {#agents-api}

Agent adalah konfigurasi tersimpan dan berversi: model, instruksi, profil runtime, Skills, koneksi MCP, dan pengaturan output. Membuat atau memperbarui Agent tidak menjalankannya. Jalankan Agent di dalam [Session](/api-reference/sessions/).

Agents API mengikuti protokol OpenAI Agents (`client.beta.agents` di OpenAI Python SDK). Header `OpenAI-Beta` bersifat opsional; jika Anda mengirimnya, nilainya harus `agents=v1`. SandBase menambahkan versi, pembaruan compare-and-set, arsip dan pemulihan, serta katalog publik.

## Operasi Agent {#agent-operations}

| Metode | Path | Tujuan |
|---|---|---|
| `POST` | `/v1/agents` | [Membuat Agent](./create) pada versi 1 |
| `GET` | `/v1/agents` | [Mencantumkan Agents](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Mendapatkan Agent](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Memperbarui Agent](./update) (pembaruan parsial gaya SDK) |
| `PATCH` | `/v1/agents/{agent_id}` | [Mengganti dengan compare-and-set](./replace) pada `row_version` |
| `DELETE` | `/v1/agents/{agent_id}` | [Menghapus](./delete), yang mengarsipkan Agent |
| `POST` | `/v1/agents/{agent_id}/archive` | [Mengarsipkan Agent](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [Membatalkan arsip Agent](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [Memulihkan versi sebelumnya](./restore) sebagai versi baru |
| `GET` | `/v1/agents/{agent_id}/versions` | [Mencantumkan versi](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [Mendapatkan satu versi](./get-version) |
| `GET` | `/v1/agents/catalog` | [Menjelajahi katalog publik](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | [Meng-clone Agent katalog](./catalog#clone-a-catalog-agent) ke organisasi Anda |

ID Agent menggunakan prefiks `agt_`. Body permintaan berupa JSON ketat hingga 1 MiB; field yang tidak dikenal mengembalikan 400.

## Versi dan pembaruan {#versions-and-updates}

- Setiap penulisan yang efektif (create, update, replace, restore) menghasilkan versi yang tidak dapat diubah. `version` adalah nomor versi saat ini.
- `POST /v1/agents/{agent_id}` adalah pembaruan OpenAI SDK. Operasi ini tidak memerlukan `row_version`, sehingga penulis terakhir yang menang.
- `PATCH /v1/agents/{agent_id}` memerlukan `row_version` yang terakhir Anda baca dan mengembalikan 409 jika pihak lain telah mengubah Agent lebih dulu. Gunakan dari editor dan otomasi yang dapat berjalan bersamaan.
- Setiap Session membekukan versi Agent, versi Skill, dan konfigurasi koneksi MCP yang digunakan saat Session dimulai.

## Kesiapan {#readiness}

Versi yang baru ditulis melaporkan `projection_status` selama dipersiapkan untuk eksekusi. Sessions memerlukan Agent aktif dengan `projection_status` bernilai `ready`; jika tidak, Sessions mengembalikan 409. Agents yang diarsipkan juga mengembalikan 409 untuk eksekusi baru.

## Batasan saat ini {#current-limits}

- `tools` menerima tool `function` dan paling banyak satu tool `web_search`. Eksekusi saat ini mengharuskan `web_search.mode` bernilai `disabled`.
- Function tool dapat disimpan, tetapi Runs yang meminta klien mengembalikan hasil tool (`requires_action`) belum didukung dan muncul sebagai `502 executor_contract_error`.
- `multi_agent` harus dihilangkan atau bernilai `null`.

## Paginasi {#pagination}

`GET /v1/agents` dan katalog menggunakan paginasi cursor: `limit` (1-100, default 20), `after`, dan `order` (`asc` atau `desc`, default `desc`). Respons berisi `object: "list"`, `data`, `has_more`, `first_id`, dan `last_id`; teruskan `last_id` sebagai `after` untuk halaman berikutnya.

`GET /v1/agents/{agent_id}/versions` menggunakan paginasi offset: `limit` dan `offset`, dengan `data`, `total`, `limit`, dan `offset` di respons.

## Error {#errors}

Error menggunakan envelope Agents `{"error":{"type","code","param":null,"message"}}`. Lihat [Error](/api-reference/errors#agents-platform-errors) untuk daftar kode.
