---
i18nSource: e904f2b8bbd0ccc4
title: Sessions
description: Jalankan Agent dalam Session, streaming event-nya, baca riwayat, lampirkan file, dan tangani kegagalan.
---

# Sessions {#sessions}

**Session** menjalankan satu versi Agent yang tersimpan di cloud terkelola SandBase; Anda tidak memilih lingkungan eksekusi. ID-nya diawali `ses_`, dan semua path Session berada di bawah `/v1/agents/sessions`. Session membekukan versi Agent, versi Skill, dan konfigurasi koneksi MCP yang digunakan saat dimulai.

## Cara Session dimulai {#how-sessions-start}

Buat Session dengan `POST /v1/agents/sessions`. Session melaporkan `source: "direct"`.

## Menjalankan Session {#run-a-session}

Stream event native bersifat **hanya live**: event tidak diputar ulang setelah koneksi terputus. Buka stream sebelum Anda mengirim input, dan baca riwayat dari item atau turn.

```bash
# 1. Create the Session
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-2026-10-06" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"}'

# 2. In another terminal, follow live events (server-sent events)
curl -N https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# 3. Send input (202 Accepted, no body)
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "List three notable launches this week."}]}'

# 4. Read the history afterwards
curl "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Alur yang sama dengan SDK Python resmi OpenAI. Buka stream terlebih dahulu, kirim input dari thread lain, dan berhenti pada event turn terminal. Lihat [Kompatibilitas OpenAI](/agents/openai-compatibility) untuk versi Node.js dan perbedaan SDK.

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
session = client.beta.agents.sessions.create(
    agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
        }],
        idempotency_key="market-scan-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break
```

Setiap pengiriman membawa tepat satu event. `input` berupa string teks, atau array dengan tepat satu pesan pengguna yang memiliki tepat satu bagian `input_text`: `[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`. Bentuk lain mengembalikan `400 invalid_request`. Untuk menghentikan turn yang sedang berjalan, kirim `{"type": "agent.session.input.cancel"}` atau panggil `POST /v1/agents/sessions/{session_id}/cancel` dengan `Idempotency-Key`. Membatalkan Session yang idle tetap mengembalikan `202 {"accepted": true}` dan tidak mengubah apa pun. Anda juga dapat memberikan `input` pertama saat membuat Session. `stream: true` saat pembuatan tidak didukung.

## Status dan kegagalan {#status-and-failures}

| Field | Nilai | Arti |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | Status eksekusi Session |
| `lifecycle_status` | `active`, `archived` | Apakah Session menerima input |
| `failure` | `null` atau `{code, message, action, retryable?}` | Alasan publik kegagalan dan langkah berikutnya yang disarankan |

`failure.action` memberi tahu Anda apa yang harus dilakukan: `retry_later`, `inspect_history`, `create_new_session`, `check_model_account`, atau `create_session_with_updated_model_provider`. Lihat [tabel kode kegagalan](/api-reference/sessions/#status-fields).

Function tool yang meminta hasil dari klien (`requires_action`) belum didukung; membaca Session seperti itu mengembalikan `502 executor_contract_error`.

Jika pengiriman mengembalikan `409 session_input_pending`, input sebelumnya masih dalam proses pengiriman. Tunggu dan baca Session; jangan kirim ulang dengan `Idempotency-Key` baru, karena input bisa berjalan dua kali.

## Arsip {#archive}

`DELETE /v1/agents/sessions/{session_id}` mengarsipkan Session; Session tidak dihapus permanen. `POST /v1/agents/sessions/{session_id}/archive` dan `/unarchive` menerima `{"row_version": …}`. Session yang diarsipkan tetap menyimpan riwayatnya, tetapi menolak input, pembaruan metadata, dan stream.

## Lampiran {#attachments}

Unggah file ke workspace Session dengan `POST /v1/agents/sessions/{session_id}/files` (field multipart `file`, hingga 5 MiB, `Idempotency-Key` wajib). Jenis yang didukung adalah `.txt`, `.md`, `.csv`, `.log`, `.json`, `.pdf`, `.png`, `.jpg`, `.jpeg`, dan `.webp`. Setelah `status` file bernilai `ready`, kirimkan bersama hingga sembilan file lainnya:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## Menyambungkan ulang klien {#reconnecting-clients}

Klien bergaya browser yang memerlukan tampilan konsisten setelah koneksi terputus dapat memanggil `POST /v1/agents/sessions/{session_id}/reconnect`. Endpoint ini mengembalikan Session dan `stream_url` untuk `GET /v1/agents/sessions/{session_id}/events/stream`, yang mengirim `session.snapshot` terlebih dahulu, lalu event live dan `heartbeat`. Jika stream tersebut memancarkan `stream.interrupted`, sambungkan ulang alih-alih mengirim ulang input.

## Repositori GitHub {#github-repository}

Kirim `github_workspace` saat pembuatan untuk meng-clone repositori GitHub ke `/workspace` dan mengizinkan Agent melakukan push ke branch Session miliknya sendiri. Lihat [Workspace repositori GitHub](/agents/github-workspace).

## Kredensial model {#model-credentials}

Session memanggil model dengan kunci API yang membuatnya, kecuali Anda mengirim `model_provider`. Gunakan `{"type": "custom", "base_url": "https://…", "api_key": "…"}` untuk menjalankannya terhadap endpoint HTTPS kompatibel OpenAI milik Anda sendiri. `model_provider` bersifat write-only.

## ID {#ids}

| Prefiks | Resource |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `skl_` | Skill |
| `mcp_` | Koneksi MCP |
| `sec_` | Secret |
| `fil_` | Lampiran Session |

Perlakukan ID sebagai string opaque.

## Langkah berikutnya {#next-steps}

- [Referensi API Sessions](/api-reference/sessions/)
- [Kompatibilitas OpenAI](/agents/openai-compatibility)

## File workspace dan artifact yang dihasilkan {#workspace-files-and-generated-artifacts}

Ketiga resource ini memiliki tujuan yang berbeda:

| Resource | Gunakan untuk | Paginasi |
|---|---|---|
| [Lampiran](/api-reference/sessions/list-files) | File yang Anda unggah dan dapat direferensikan dalam input dengan `file_id` | `limit` / `offset` |
| [File workspace](/api-reference/sessions/list-workspace-files) | Path file dan ukuran saat ini di direktori workspace | `page` / `next` |
| [Artifact](/api-reference/sessions/list-artifacts) | Output hasil generate yang tidak dapat diubah dan tersedia untuk diunduh | `after` / `last_id` |

Tampilkan daftar artifact untuk mendapatkan ID `art_`, lalu berikan ID persis tersebut ke [Download Artifact](/api-reference/sessions/download-artifact). Path workspace atau `file_id` lampiran tidak dapat menggantikannya. Daftar workspace hanya mengembalikan metadata dan bukan API unduhan untuk path sembarang. Artifact dapat diunduh sebagai file utuh hingga 200 MiB; unduhan parsial dengan `Range` tidak didukung.
