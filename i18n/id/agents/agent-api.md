---
i18nSource: 2ba7f0f41847d04f
title: Mendefinisikan Agent
description: Buat dan perbarui Agent berversi dengan Agents API, termasuk field, batasan, versi, dan arsip.
---

# Mendefinisikan Agent {#define-an-agent}

Buat Agent dengan `POST /v1/agents`. API ini mengikuti protokol OpenAI Agents, sehingga Anda dapat menggunakan HTTP biasa atau `client.beta.agents` dari OpenAI SDK dengan `base_url="https://api.sandbase.ai/v1"`. Header `OpenAI-Beta` bersifat opsional; jika Anda mengirimkannya, nilainya harus `agents=v1`. Lihat [Kompatibilitas OpenAI](/agents/openai-compatibility) untuk fitur yang didukung SDK.

## Membuat Agent {#create-an-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question, compare at least two sources, and cite them.",
    "metadata": {"team": "research"}
  }'
```

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Research the question, compare at least two sources, and cite them.",
    metadata={"team": "research"},
)
print(agent.id, agent.version)  # agt_..., 1
```

Respons berupa `201 Created` beserta Agent: ID `agt_`, `version: 1`, `row_version`, `status: "active"`, dan `projection_status`. Versi baru disiapkan untuk eksekusi di latar belakang; mulai Session setelah `projection_status` bernilai `ready`.

`Idempotency-Key` bersifat opsional. Jika Anda tidak menyertakannya, layanan akan membuatkannya, sehingga permintaan yang diulang dapat membuat Agent kedua. Kirim kunci stabil Anda sendiri saat mengulang permintaan.

## Field {#fields}

Body berupa JSON ketat (maksimal 1 MiB). Field yang tidak dikenal menghasilkan 400.

| Field | Wajib | Batas dan nilai |
|---|---|---|
| `model` | Ya | ID model, maksimal 200 karakter |
| `name` | Tidak | Maksimal 128 karakter |
| `instructions` | Tidak | Maksimal 256 KiB |
| `description` | Tidak | Maksimal 4096 karakter |
| `runtime_profile` | Tidak | `codex` (default), `claude`, atau `mcode` |
| `skills` | Tidak | Maksimal 32 referensi. Binding baru dengan `version: null` menyematkan versi default saat ini ketika disimpan; binding yang sudah ada mempertahankan versi yang disematkan. Berikan versi eksplisit untuk meningkatkan versi; lihat [Skills](/agents/mcp-tools#skills) |
| `mcp_connections` | Tidak | Maksimal 32 referensi; lihat [Koneksi MCP](/agents/mcp-tools#mcp-connections) |
| `tools` | Tidak | Maksimal 64 tool `function` dan paling banyak satu tool `web_search` |
| `text` | Tidak | `format.type` `text` atau `json_schema` (skema objek); `verbosity` `low`, `medium`, atau `high` |
| `reasoning` | Tidak | `effort` `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, atau `max`; `summary` `concise`, `detailed`, atau `auto` |
| `service_tier` | Tidak | `auto` (default), `default`, `flex`, `priority`, atau `fast` |
| `metadata` | Tidak | Maksimal 16 pasangan string; kunci maksimal 64 dan nilai maksimal 512 karakter |
| `note` | Tidak | Catatan perubahan yang disimpan pada versi |

## Batasan saat ini {#current-limits}

- `web_search` harus menggunakan `"mode": "disabled"` agar Session dapat dimulai.
- Tool `function` dapat disimpan, tetapi Run yang memerlukan klien mengembalikan hasil tool (`requires_action`) belum didukung. Session dalam status tersebut mengembalikan `502 executor_contract_error`. Sebagai gantinya, berikan kemampuan eksternal kepada Agent melalui [koneksi MCP](/agents/mcp-tools#mcp-connections).
- `multi_agent` harus dihilangkan atau bernilai `null`.

## Memperbarui Agent {#update-an-agent}

Ada dua bentuk pembaruan. Keduanya membuat versi baru.

- `POST /v1/agents/{agent_id}` adalah pembaruan ala OpenAI SDK. Kirim hanya field yang ingin Anda ubah. `row_version` tidak diperlukan, sehingga penulis terakhir yang menang. `description` dan `note` tidak diterima dalam bentuk ini.
- `PATCH /v1/agents/{agent_id}` adalah pembaruan compare-and-set. Bentuk ini memerlukan `row_version` yang terakhir Anda baca dan mengembalikan 409 jika Agent berubah sementara itu. Nilai `null` eksplisit ditolak.

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## Versi, arsip, dan pemulihan {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` mencantumkan snapshot yang tidak dapat diubah; `GET /v1/agents/{agent_id}/versions/{version}` membaca salah satunya.
- `POST /v1/agents/{agent_id}/restore` dengan `{"source_version": 1, "row_version": 3}` menyalin konfigurasi sebelumnya ke versi terkini yang baru.
- `POST /v1/agents/{agent_id}/archive` dan `/unarchive` menerima `{"row_version": …}`. Agent yang diarsipkan tidak dapat memulai Session baru.
- `DELETE /v1/agents/{agent_id}` mengarsipkan Agent. Agent tidak pernah dihapus permanen.

## Langkah berikutnya {#next-steps}

- [Skills dan tool MCP](/agents/mcp-tools)
- [Menjalankan Agent dalam Session](/agents/sessions)
- [Referensi API Agents](/api-reference/agents/)

