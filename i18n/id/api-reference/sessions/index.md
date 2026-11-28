---
i18nSource: 99170a141af66587
title: Sessions API
description: Jalankan versi Agent tersimpan, kirim input, streaming event, dan baca riwayat Session.
---

# Sessions API {#sessions-api}

Session menjalankan satu versi [Agent](/api-reference/agents/) tersimpan di cloud terkelola SandBase; tidak ada lingkungan eksekusi yang perlu dipilih. ID Session menggunakan prefiks `ses_`. Session adalah sub-resource dari Agents: setiap path diawali `/v1/agents/sessions`.

Operasi standar mengikuti protokol OpenAI Agents (`client.beta.agents.sessions`); lihat [Kompatibilitas OpenAI](/agents/openai-compatibility) untuk apa yang dapat dan tidak dapat dilakukan SDK resmi. Ekstensi SandBase menambahkan penggantian nama, status arsip, pembatalan, lampiran, metadata file workspace, artefak yang tidak dapat diubah, dan stream produk yang dapat disambungkan ulang.

::: info Asal Session
Anda membuat Session secara langsung dengan `POST /v1/agents/sessions`. Session melaporkan `source: "direct"` dan `source_id: null`.
:::

## Alur yang direkomendasikan {#recommended-flow}

1. [Buat Session](./create) untuk Agent tersimpan. Session membekukan versi Agent dan koneksi MCP yang dipilih, serta menggunakan versi Skill yang sudah disematkan pada versi Agent tersebut.
2. [Buka stream event](./stream) dengan `GET /v1/agents/sessions/{session_id}/events`. Stream ini hanya menyiarkan event live, jadi buka sebelum Anda mengirim input.
3. [Kirim input](./send-events) dengan `POST /v1/agents/sessions/{session_id}/events` dan event `agent.session.input.message`. Panggilan ini mengembalikan 202.
4. Baca hasil dari stream, atau setelahnya dari [items](./items) dan [turns](./turns).

## Operasi Session {#session-operations}

| Metode | Path | Tujuan |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [Membuat Session](./create) |
| `GET` | `/v1/agents/sessions` | [Mencantumkan Session](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [Mendapatkan Session](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [Mengganti metadata](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | [Mengganti nama](./rename) dengan `row_version` |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [Menghapus](./delete), yang mengarsipkan Session |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [Mengirim satu event input atau pembatalan](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [Streaming event live](./stream) (SSE) |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [Mencantumkan item](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [Mencantumkan giliran](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [Mendapatkan satu giliran](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [Membatalkan giliran yang sedang berjalan](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [Mengarsipkan](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [Membatalkan arsip](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | [Menyambung ulang](./reconnect) setelah stream terputus |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [Stream snapshot lalu live](./stream-snapshot) (SSE) |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [Mengunggah lampiran](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [Mencantumkan lampiran](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [Mengunduh lampiran](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [Menghapus lampiran](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [Mencantumkan metadata file workspace](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [Mencantumkan artefak yang tidak dapat diubah](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [Mengunduh artefak](./download-artifact) |

## Field status {#status-fields}

- `status` adalah status eksekusi: `idle`, `in_progress`, atau `failed`. Tool function yang memerlukan hasil dari klien (`requires_action`) belum didukung; pembacaan Session seperti itu mengembalikan `502 executor_contract_error`.
- `lifecycle_status` bernilai `active` atau `archived`. Session yang diarsipkan menolak input, pembaruan metadata, dan stream. `DELETE` mengarsipkan; `unarchive` memulihkan.
- `failure` bernilai `null` atau objek dengan `code`, `message`, `action`, dan terkadang `retryable`.

| `failure.code` | Arti | `action` yang disarankan |
|---|---|---|
| `session_creation_rejected` | Lapisan eksekusi menolak Session | `create_new_session` |
| `model_authentication_failed` | Penyedia model menolak kunci | `create_session_with_updated_model_provider` |
| `model_rate_limited` | Penyedia model menerapkan pembatasan laju (dapat dicoba ulang) | `retry_later` |
| `model_quota_exceeded` | Akun model tidak memiliki kuota | `check_model_account` |
| `context_limit_exceeded` | Percakapan melebihi konteks model | `create_new_session` |
| `environment_connection_timeout` | Lingkungan tidak terhubung tepat waktu (dapat dicoba ulang) | `retry_later` |
| `runtime_unavailable` | Lingkungan eksekusi tidak tersedia (dapat dicoba ulang) | `retry_later` |
| `model_request_failed` | Permintaan model tidak selesai | `inspect_history` |
| `model_configuration_rejected` | Model atau lapisan eksekusi menolak konfigurasi | `create_session_with_updated_model_provider` |
| `execution_failed` | Kegagalan tanpa penyebab publik yang lebih spesifik | `inspect_history` |

Hasil daftar juga dapat berisi baris placeholder dengan `session_not_ready`, `session_execution_unavailable`, `session_configuration_unavailable`, atau `session_snapshot_unavailable` ketika Session tidak dapat dibaca secara live.

## Kredensial model {#model-credentials}

Secara default, Session memanggil model dengan SandBase API key yang sama dengan yang membuatnya. Kirim `model_provider` untuk memilih secara eksplisit:

- `{"type": "sandbase"}` menggunakan kunci pemanggil Anda. `base_url` tidak diperbolehkan.
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` memanggil endpoint HTTPS Anda sendiri yang kompatibel dengan OpenAI. URL tidak boleh berisi kredensial, query, atau fragment, dan SandBase tidak pernah beralih ke kunci SandBase Anda.

`model_provider` bersifat hanya-tulis dan tidak pernah muncul dalam respons.

## Penerimaan dan error {#admission-and-errors}

Membuat Session dan mengirim input akan memeriksa penerimaan eksekusi: `402 spending_limit_exceeded` jika batas kunci atau saldo organisasi habis, `403 org_disabled` jika organisasi tidak dapat menjalankan Agents, dan `503 admission_unavailable` jika pemeriksaan tidak dapat diselesaikan. Pembacaan, pembatalan, dan pengarsipan tidak diblokir oleh saldo.

Mengirim input juga dapat mengembalikan `409 session_input_pending` (input sebelumnya masih dikirim; tunggu, dan jangan kirim ulang dengan kunci baru), `409 session_input_expired` (periksa riwayat sebelum mengirim lagi), atau `409 session_environment_unavailable` (tunggu atau buat Session baru). Lihat [Error](/api-reference/errors#agents-platform-errors).

## Paginasi {#pagination}

Session, item, giliran, dan artefak menggunakan paginasi cursor (`limit` 1-100, `after`, `order`). Lampiran menggunakan paginasi offset (`limit` 1-100, `offset`).

File workspace menggunakan paginasi `page` / `next`. Lihat [Mencantumkan file workspace](./list-workspace-files).

