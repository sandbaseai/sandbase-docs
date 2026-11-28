---
i18nSource: d637409019c8109d
title: Kompatibilitas OpenAI
description: Gunakan SDK resmi OpenAI dengan SandBase Agents, Sessions, dan Skills, serta lihat perbedaan SandBase dengan OpenAI Agents API.
---

# Kompatibilitas OpenAI {#openai-compatibility}

SandBase Agents mengimplementasikan protokol [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) untuk Agents, Sessions, event session, item, turn, dan Skills. Untuk resource tersebut, Anda dapat langsung menggunakan SDK resmi OpenAI: arahkan `base_url` ke `https://api.sandbase.ai/v1` dan berikan kunci API SandBase.

Koneksi MCP, Secrets, dan katalog adalah resource khusus SandBase. SDK tidak memiliki metode untuk resource ini, jadi panggil melalui HTTP (atau dengan `client.post` / `client.get` generik milik SDK).

Versi SDK yang telah diverifikasi:

| SDK | Versi | Catatan |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | `sessions.update(agent=...)` dan `sessions.traces` tidak ada di 3.13.0 |
| openai-node | 7.28.0 (Node.js 26) | Gunakan dispatcher HTTP/1.1 untuk streaming, lihat [di bawah](#node-js-and-http-2) |

## Menyiapkan klien {#set-up-the-client}

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],  # your SandBase API key
    base_url="https://api.sandbase.ai/v1",
)
```

```js [Node.js]
// npm install openai@7.28.0 undici
import OpenAI from 'openai'
import { Agent } from 'undici'

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY, // your SandBase API key
  baseURL: 'https://api.sandbase.ai/v1',
  // HTTP/1.1 keeps the live event stream and the input request on separate connections.
  fetchOptions: { dispatcher: new Agent({ allowH2: false }) },
})
```

:::

SDK mengirim `OpenAI-Beta: agents=v1` secara otomatis. SandBase menerima nilai tersebut, atau tanpa header sama sekali; nilai lain mengembalikan `400`.

## Menjalankan Agent dari awal hingga akhir {#run-an-agent-end-to-end}

Buat Agent, buat Session, buka stream event live, kirim satu input, lalu baca riwayatnya. Stream ini hanya live, jadi bukalah sebelum Anda mengirim input.

::: code-group

```python [Python]
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")

agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Keep output brief.",
    metadata={"team": "research"},
)
session = client.beta.agents.sessions.create(
    agent_id=agent.id,
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "Reply with exactly: ok"}]}],
        }],
        idempotency_key="research-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break

for item in client.beta.agents.sessions.items.list(session.id, order="asc", limit=100).data:
    print(item.type, getattr(item, "role", None))

# Clean up: both calls archive the resource.
client.beta.agents.sessions.delete(session.id)
client.beta.agents.delete(agent.id)
```

```js [Node.js]
import OpenAI from 'openai'
import { Agent } from 'undici'

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
  fetchOptions: { dispatcher: new Agent({ allowH2: false }) },
})

const agent = await client.beta.agents.create({
  model: 'deepseek/deepseek-v4-flash',
  name: 'Research assistant',
  instructions: 'Keep output brief.',
  metadata: { team: 'research' },
})
const session = await client.beta.agents.sessions.create({
  agent_id: agent.id,
  environment: { type: 'openai_hosted' }, // Required by the SDK types; SandBase always runs in its hosted cloud.
})

const stream = await client.beta.agents.sessions.events.stream(session.id)
const done = (async () => {
  for await (const event of stream) {
    console.log(event.type)
    if (/^agent\.session\.turn\.(completed|failed|cancelled)$/.test(event.type)) break
  }
})()

await client.beta.agents.sessions.events.create(session.id, {
  events: [{ type: 'agent.session.input.message', input: 'Reply with exactly: ok' }],
  'Idempotency-Key': 'research-input-1',
})
await done

const items = await client.beta.agents.sessions.items.list(session.id, { order: 'asc', limit: 100 })
for (const item of items.data) console.log(item.type, item.role)

// Clean up: both calls archive the resource.
await client.beta.agents.sessions.delete(session.id)
await client.beta.agents.delete(agent.id)
```

:::

`events.create` mengembalikan `202` tanpa body. Setiap permintaan membawa tepat satu event. Menggunakan ulang `Idempotency-Key` yang sama dengan body yang sama tidak memulai turn kedua. Untuk menghentikan turn yang sedang berjalan, kirim `{"type": "agent.session.input.cancel"}` sebagai satu-satunya event.

### Node.js dan HTTP/2 {#node-js-and-http-2}

`fetch` di Node.js 26 dapat menegosiasikan HTTP/2 dengan SandBase API. Jika itu terjadi, pada koneksi HTTP/2 bersama, `events.create` dapat macet selama `events.stream` terbuka di koneksi yang sama, hingga stream ditutup. Dispatcher `undici` dengan `allowH2: false` di atas menghindari masalah ini. SDK Python menggunakan HTTP/1.1 secara default dan tidak perlu diubah.

## Skills dengan SDK {#skills-with-the-sdk}

`client.skills` berfungsi seperti di OpenAI, kecuali penghapusan satu versi Skill tidak tersedia. ZIP harus berisi satu folder tingkat atas dengan `SKILL.md` di dalamnya (`zip -r release-notes.zip release-notes/`). `SKILL.md` di root ZIP mengembalikan `400 invalid_request`.

::: code-group

```python [Python]
with open("release-notes.zip", "rb") as bundle:
    skill = client.skills.create(files=[("release-notes.zip", bundle.read(), "application/zip")])
print(skill.id, skill.default_version)

zip_bytes = client.skills.content.retrieve(skill.id).read()
```

```js [Node.js]
import fs from 'node:fs'

const skill = await client.skills.create({ files: fs.createReadStream('release-notes.zip') })
console.log(skill.id, skill.default_version)

const zip = Buffer.from(await (await client.skills.content.retrieve(skill.id)).arrayBuffer())
```

:::

`skills.retrieve`, `skills.list`, `skills.update(default_version=...)`, `skills.versions.create / list / retrieve`, `skills.versions.content.retrieve`, dan `skills.delete` juga berfungsi. Skill yang direferensikan oleh versi Agent mana pun tidak dapat dihapus (`409`); sebagai gantinya, atur `status` ke `disabled` dengan Update Skill.

## Koneksi MCP dengan SDK {#mcp-connections-with-the-sdk}

OpenAI mendeklarasikan server MCP secara inline sebagai `tools: [{"type": "mcp", ...}]`. SandBase mengembalikan `400` untuk bentuk tersebut. Daftarkan server sekali dengan [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) dan referensikan dari `mcp_connections` milik Agent. Metode permintaan generik SDK dan field body tambahan mencakup kedua langkah tersebut:

::: code-group

```python [Python]
import uuid

connection = client.post(
    "/mcp-connections",
    cast_to=object,
    body={"name": "DeepWiki", "server_url": "https://mcp.deepwiki.com/mcp"},
    options={"headers": {"Idempotency-Key": str(uuid.uuid4())}},  # Use a new key per create; reusing one returns the original (possibly disabled) connection.
)
agent = client.beta.agents.update(
    agent.id,
    extra_body={"mcp_connections": [
        {"connection_id": connection["id"], "server_label": "deepwiki", "allowed_tools": None, "required": False},
    ]},
)
```

```js [Node.js]
const connection = await client.post('/mcp-connections', {
  body: { name: 'DeepWiki', server_url: 'https://mcp.deepwiki.com/mcp' },
  headers: { 'Idempotency-Key': crypto.randomUUID() }, // Use a new key per create; reusing one returns the original (possibly disabled) connection.
})
await client.beta.agents.update(agent.id, {
  mcp_connections: [
    { connection_id: connection.id, server_label: 'deepwiki', allowed_tools: null, required: false },
  ],
})
```

:::

Panggilan Node.js meneruskan `mcp_connections` dalam JavaScript biasa; di TypeScript, field ini bukan bagian dari tipe SDK. Bearer token untuk server MCP disimpan sebagai [Secrets](/agents/api-credentials), bukan vault OpenAI.

## Lingkungan eksekusi {#execution-environment}

SandBase menjalankan setiap Session di cloud terkelolanya; tidak ada lingkungan yang perlu dipilih atau dikelola.

- Panggilan HTTP langsung tidak menyertakan `environment`.
- SDK OpenAI mewajibkan argumen `environment` pada `sessions.create` (Python memunculkan `TypeError` tanpanya, dan tipe Node.js mewajibkannya). Berikan `{"type": "openai_hosted"}`; SandBase menerimanya. Nilai lain, seperti `self_hosted`, mengembalikan `400`.
- Respons Session menyertakan objek `environment` untuk kompatibilitas SDK. Anda tidak perlu membaca atau menindaklanjutinya.

## Ringkasan kompatibilitas {#compatibility-at-a-glance}

| Area | Status | Detail |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | Kompatibel, dengan ekstensi | Respons menambahkan `status`, `version`, `row_version`, `projection_status`, `runtime_profile`, `skills`, `mcp_connections`, dan lainnya. `delete` mengarsipkan Agent dan mengembalikan `agent.deleted`. |
| `beta.agents.sessions.create / retrieve / update / list / delete` | Kompatibel, dengan batasan | Menerima `agent_id` yang tersimpan, `agent` inline, atau keduanya; `agent` menerima `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning`, dan `multi_agent`. `stream=True` melakukan streaming turn pertama dan memerlukan `input` awal. `update` hanya menerima `metadata`. `delete` mengarsipkan Session. |
| `sessions.events.stream` | Kompatibel | Hanya live, seperti OpenAI. `Last-Event-ID` atau `?after=` mengembalikan `400`. |
| `sessions.events.create` | Kompatibel, dengan batasan | Tepat satu event `agent.session.input.message` atau `agent.session.input.cancel` per permintaan; pesan berisi satu bagian `input_text` dari pengguna atau string biasa. |
| `sessions.items.list`, `sessions.turns.list / retrieve` | Kompatibel | Paginasi cursor dengan `limit` 1-100, `after`, `order`. |
| `client.skills` dan `skills.versions` | Kompatibel, kecuali penghapusan versi | `skills.versions.delete` mengembalikan `404`. |
| Envelope error | Kompatibel | `{"error": {"type", "code", "param", "message"}}`; exception SDK menyediakannya sebagai `exc.body`. |
| Versi Agent, restore, archive, katalog, rename/archive/reconnect/files/workspace-files/artifacts Session | Khusus SandBase | Lihat referensi API [Agents](/api-reference/agents/) dan [Sessions](/api-reference/sessions/). |
| Koneksi MCP, Secrets | Khusus SandBase | Gunakan HTTP atau `client.post` / `client.get`. |

SandBase menyediakan [daftar artifact](/api-reference/sessions/list-artifacts) dan [unduhan konten](/api-reference/sessions/download-artifact) melalui HTTP. ID artifact bersifat opaque dan terbatas pada Session. Ini tidak berarti setiap metode artifact SDK didukung; endpoint metadata artifact terpisah tidak tersedia.

### Tidak didukung {#not-supported}

Panggilan SDK OpenAI berikut gagal terhadap SandBase. Pesannya adalah `error.message` aktual yang dikembalikan.

| Panggilan SDK | Hasil |
|---|---|
| `sessions.create(..., stream=True)` tanpa `input` awal | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`: `only openai_hosted environment is supported` |
| `sessions.create(..., agent={...})` dengan field selain `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning`, dan `multi_agent` | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400` (openai-python 3.13.0 tidak memiliki parameter `agent` dan memunculkan `TypeError`) |
| `agents.create(..., multi_agent={"enabled": True})` | `400`: `multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`; tool `tool_search`, `programmatic_tool_calling`, dan `computer_use` | `400 invalid_request`. Hanya `function` dan satu tool `web_search` yang diterima |
| `events.create` dengan event `tool_result` atau persetujuan computer-use | `400 invalid_request`. Session yang mencapai `requires_action` tidak didukung |
| `events.create` dengan lebih dari satu event | `400`: `exactly one text input or cancel event is supported per request` |
| `sessions.traces`, `sessions.subagents`, `environments.templates` | `404 not_found` (openai-python 3.13.0 tidak memiliki `traces`) |
| `beta.agents.vaults` | `404` dengan body teks biasa (`404 page not found`), bukan envelope error JSON |
| `skills.versions.delete` | `404 not_found` |

### Perbedaan field {#field-differences}

- Session melaporkan kegagalan di `failure` (`{code, message, action, retryable?}`), bukan `error` seperti di OpenAI. Dengan SDK, `session.error` bernilai `None`; baca `session.failure` sebagai gantinya.
- `required_actions` dan `vault_ids` selalu berupa array kosong.
- Timestamp Agent dan Session menggunakan detik Unix. `created_at` versi Agent, koneksi MCP, dan Secrets menggunakan string ISO 8601.
- `402 spending_limit_exceeded` tidak memiliki kelas exception SDK khusus; error ini muncul sebagai `APIStatusError` generik.
- Metode yang tidak didukung pada path yang dikenal (misalnya `PUT` pada `/v1/agents`) mengembalikan `404` dengan envelope error JSON, bukan `405`.

## Langkah berikutnya {#next-steps}

- [Sessions](/agents/sessions)
- [Skills dan tool MCP](/agents/mcp-tools)
- [Referensi API Agents](/api-reference/agents/)
