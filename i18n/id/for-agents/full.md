---
i18nSource: e566962f42a5f6b0
title: Panduan API AI SandBase
description: Panduan API SandBase yang diperluas untuk AI agent, dengan alur kerja inti, contoh permintaan, dan tautan ke spesifikasi OpenAPI resmi.
---

# Panduan API AI {#ai-api-guide}

::: info Kontrak Session
Session (`ses_*`) menjalankan satu versi Agent yang tersimpan dan dibuat langsung dengan `POST /v1/agents/sessions`. ID Runtime Session internal tidak diekspos.
:::

> Panduan satu halaman untuk alur kerja API yang paling umum. Untuk kontrak lengkap yang dapat dibaca mesin, gunakan [spesifikasi OpenAPI](https://www.sandbase.ai/docs/openapi.yaml). Versi teks biasa: [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt).

## Autentikasi {#authentication}

Semua permintaan memerlukan:

```
Authorization: Bearer sk-YOUR_KEY
```

Base URL: `https://api.sandbase.ai/v1`

---

## Terminologi {#terminology}

| Istilah | Arti |
|------|---------|
| **Task** | Record eksekusi yang dapat ditagih untuk operasi seperti inferensi model. Tidak setiap operasi API membuatnya. |
| **Run** | Permintaan pembuatan media melalui `POST /v1/run`. Dapat berupa sinkron atau asinkron. Lakukan polling dengan `GET /v1/run/{id}`. |
| **Session** | Eksekusi Agent melalui `POST /v1/agents/sessions`, yang menyimpan percakapan, aktivitas tool, dan output. Kueri dengan `GET /v1/agents/sessions/{session_id}`. |
> **run vs session**: "run" model (`/v1/run`) adalah tugas generasi model. "Session" (`/v1/agents/sessions`) adalah eksekusi Agent. Semua ID bersifat opaque dan tidak boleh di-parse.
>
> **task vs run**: "run" atau "session" adalah permintaan yang Anda buat; "task" adalah record eksekusi yang dapat ditagih. Gunakan
> `GET /v1/tasks/{task_id}/cost` jika suatu operasi mengembalikan task ID. Tidak setiap operasi API membuat task.

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

Kompatibel dengan OpenAI. Dukungan streaming, tool, vision, reasoning, dan output terstruktur bergantung pada model yang dipilih dan skema yang dideklarasikannya.

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing in one paragraph."}
    ],
    "temperature": 0.7,
    "max_tokens": 500,
    "stream": false
  }'
```

**Respons:**

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "openai/gpt-5.6-luna",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Quantum computing leverages quantum mechanical phenomena..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113
  }
}
```

> Beberapa operasi yang dapat ditagih dapat mengembalikan `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc`; jika ada, gunakan untuk melakukan kueri
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost`.

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

Messages API yang kompatibel dengan Anthropic. Caching dan fitur opsional lainnya bergantung pada model yang dipilih dan skema permintaan.

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-5",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "What is SandBase?"}]
  }'
```

**Respons:**

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    { "type": "text", "text": "SandBase is an AI agent infrastructure platform..." }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 12, "output_tokens": 64 }
}
```

---

## Pembuatan Gambar {#image-generation}

### POST /v1/run {#post-v1-run}

Endpoint `/v1/run` adalah **endpoint generasi terpadu** — field `model` menentukan tipe output (gambar, video, atau audio).

> **Cara menangani respons:** Periksa field `status`.
> - `"completed"` → hasil ada di `outputs`, selesai.
> - `"pending"` atau `"running"` → lakukan polling `GET /v1/run/{id}` setiap 2–5 detik hingga mencapai status akhir (`completed`, `failed`, atau `timeout`).

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bfl/flux-2/flash",
    "prompt": "A futuristic city at sunset, cyberpunk style",
    "aspect_ratio": "1:1"
  }'
```

**Respons (sinkron):**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "model": "bfl/flux-2/flash",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/f3d2e8a1-7c4b-4a12-9d2e-123456789abc.png",
    "content_type": "image/png",
    "width": 1024,
    "height": 1024
  }]
}
```

---

## Pembuatan Video {#video-generation}

### POST /v1/run {#post-v1-run-1}

Periksa `execution_mode` model yang dipilih. Jika pengiriman mengembalikan `pending` atau `running`, lakukan polling `GET /v1/run/{id}` hingga mencapai status akhir.

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kwaivgi/kling-video/v3/standard/text-to-video",
    "prompt": "A drone flying over mountains at golden hour",
    "duration": 5
  }'
```

**Respons (asinkron — awal):**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**Status polling: `GET /v1/run/{id}`**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "completed",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/6a7b9c10-2d3e-4f50-8a61-23456789abcd.mp4",
    "content_type": "video/mp4",
    "duration": 5
  }]
}
```

---

## Audio (Text-to-Speech) {#audio-text-to-speech}

### POST /v1/run {#post-v1-run-2}

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seed-speech/tts/2.0",
    "text": "Hello world, this is a test of text to speech."
  }'
```

**Respons:**

```json
{
  "id": "7b8c0d21-3e4f-5061-9b72-3456789abcde",
  "status": "completed",
  "model": "bytedance/seed-speech/tts/2.0",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/7b8c0d21-3e4f-5061-9b72-3456789abcde.mp3",
    "content_type": "audio/mpeg",
    "duration_seconds": 3.2
  }]
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- DISCOVERY APIs                                           -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Daftar Model {#list-models}

### GET /v1/models {#get-v1-models}

Mengembalikan model logis yang aktif dalam format daftar model yang kompatibel dengan OpenAI. Endpoint ini tidak menggunakan paginasi dan
default-nya `type=llm`. Detail kemampuan dan harga sengaja tidak disertakan.

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Respons berisi `object: "list"` dan array `data`. Setiap item berisi `id`, `object`, `created`, dan
`owned_by`; gunakan `id` sebagai nama model logis. Ambil model tersebut untuk metadata kemampuan dan harga.

---

## Ambil Model {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Respons detail menambahkan `unified_schema`, `supported_modes`, dan `model_card`. Detail harga ada di dalam
`model_card`; tidak ada objek `pricing` di tingkat atas.

---

## Ambil Biaya Task {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

Periksa biaya yang tercatat untuk suatu task menggunakan task ID yang dikembalikan oleh operasi API.

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Respons:**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "settled": true,
  "currency": "USD",
  "cost": "0.000325",
  "estimated_cost": "0.000325",
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113,
    "cached_tokens": 0,
    "cache_creation_tokens": 0,
    "reasoning_tokens": 0
  }
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- PLATFORM APIs                                            -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Konvensi platform Agents {#agents-platform-conventions}

- Base URL `https://api.sandbase.ai/v1`. Kirim `Authorization: Bearer sk-YOUR_KEY` atau `X-API-Key: sk-YOUR_KEY` (nilai yang sama jika keduanya dikirim). `OpenAI-Beta` bersifat opsional; jika dikirim, nilainya harus `agents=v1`. OpenAI SDK resmi (`client.beta.agents`, `client.skills`) dapat digunakan dengan `base_url="https://api.sandbase.ai/v1"`; perbedaannya tercantum di [Kompatibilitas OpenAI](/agents/openai-compatibility).

- Body berupa JSON ketat hingga 1 MiB; field yang tidak dikenal mengembalikan 400.

- Error: `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`. Gunakan `code` untuk percabangan logika; lihat [Panduan Error](./errors#agents-platform-errors).

- `row_version` adalah token compare-and-set untuk PATCH, archive, restore, dan rotate. Saat mendapat 409, baca ulang.

- Daftar cursor (Agent, Session, item, turn, Skill): `limit` 1-100, `after`, `order`; respons `{object:"list", data, has_more, first_id, last_id}`.

- Daftar offset (versi Agent, lampiran, koneksi MCP, Secret): `limit`, `offset`; respons `{data, total, limit, offset}`.

- ID: Agent `agt_`, Session `ses_`, Skill `skl_`, koneksi MCP `mcp_`, Secret `sec_`, lampiran `fil_`. Perlakukan sebagai opaque.

---

## Agents {#agents}

### POST /v1/agents — Buat Agent {#post-v1-agents-—-create-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question and cite sources."
  }'
```

Wajib: `model`. Opsional: `name`, `instructions`, `description`, `runtime_profile` (default `codex`, `claude`, `mcode`), `skills` (`[{"skill_id","version"}]`), `mcp_connections` (`[{"connection_id","server_label","allowed_tools","required"}]`), `tools`, `text`, `reasoning`, `service_tier`, `metadata`, `note`. Mengembalikan `201` dengan `id` (`agt_`), `version`, `row_version`, `status`, dan `projection_status`; mulai Session saat `projection_status` bernilai `ready`. Tool `web_search` harus menggunakan `mode: "disabled"`, dan hasil fungsi sisi klien (`requires_action`) tidak didukung.

### GET /v1/agents — Daftar Agent {#get-v1-agents-—-list-agents}

Kueri `status` (default `active`, `archived`, `all`) ditambah paginasi cursor.

### GET /v1/agents/{agent_id} — Ambil Agent {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — Perbarui Agent (gaya SDK) {#post-v1-agents-agent-id-—-update-agent-sdk-style}

Pembaruan parsial untuk `name`, `instructions`, `model`, `metadata`, `service_tier`, `tools`, `text`, `reasoning`, `runtime_profile`, `mcp_connections`, `skills`. Tanpa `row_version`; membuat versi baru.

### PATCH /v1/agents/{agent_id} — Perbarui Agent (compare-and-set) {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

Field yang sama ditambah `description` dan `note`; `row_version` wajib. `null` eksplisit mengembalikan 400.

### Versi, arsip, pemulihan, katalog {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` dan `GET /v1/agents/{agent_id}/versions/{version}` membaca snapshot yang tidak dapat diubah.

- `POST /v1/agents/{agent_id}/archive`, `POST /v1/agents/{agent_id}/unarchive` menerima `{"row_version"}`. `DELETE /v1/agents/{agent_id}` juga mengarsipkan.

- `POST /v1/agents/{agent_id}/restore` menerima `{"source_version","row_version"}`.

- `GET /v1/agents/catalog` menampilkan daftar Agent publik; `POST /v1/agents/catalog/{agent_id}/clone` menyalin salah satunya ke organisasi Anda (`201`, `agt_` baru).

---

## Sessions {#sessions}

Session menjalankan satu versi Agent yang tersimpan. Path berada di bawah `/v1/agents/sessions`. Versi Agent, versi Skill, dan koneksi MCP dibekukan saat pembuatan.

### POST /v1/agents/sessions — Buat Session {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

Kirim `agent_id` (Agent tersimpan), `agent` (Agent inline atau override per Session untuk `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning`, dan `multi_agent`), atau keduanya. Opsional: `version` (hanya untuk Agent tersimpan), `title`, `input` (string, atau array dengan tepat satu pesan user yang berisi satu bagian `input_text`), `model` atau `agent.model`, `metadata`, `model_provider` (`{"type":"custom","base_url":"https://...","api_key":"..."}`; jika tidak dikirim, key pemanggil Anda yang digunakan). `stream: true` dengan `input` yang tidak kosong mengembalikan `201` sebagai stream Server-Sent Events dari turn pertama, dimulai dengan `agent.session.created`. Session selalu berjalan di cloud terkelola SandBase, sehingga tidak ada environment yang perlu dipilih; OpenAI SDK tetap memerlukan `environment={"type": "openai_hosted"}`. Mengembalikan `201` dengan `status` (`idle`, `in_progress`, `failed`), `lifecycle_status` (`active`, `archived`), `failure`, `source` (`direct`, `service`, `schedule`), dan `row_version`.

### GET /v1/agents/sessions/{session_id}/events — Stream Event (SSE) {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

Hanya langsung. Buka sebelum mengirim input. `Last-Event-ID` atau `after` mengembalikan 400; event tidak diputar ulang. Nilai `type` event diawali dengan `agent.session.`.

### POST /v1/agents/sessions/{session_id}/events — Kirim Input {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

Tepat satu event per permintaan: `agent.session.input.message` atau `agent.session.input.cancel`. Mengembalikan `202` tanpa body. Bentuk ekstensi: `{"input": "...", "file_ids": ["fil_..."]}` (hingga 10 lampiran yang siap). `409 session_input_pending` berarti input sebelumnya masih dikirim; tunggu dan jangan kirim ulang dengan key baru.

### Riwayat dan operasi Session lainnya {#history-and-other-session-operations}

- `GET /v1/agents/sessions` (kueri `lifecycle_status`, `agent_id`), `GET /v1/agents/sessions/{session_id}`.

- `GET /v1/agents/sessions/{session_id}/items`, `GET /v1/agents/sessions/{session_id}/turns`, `GET /v1/agents/sessions/{session_id}/turns/{turn_id}` membaca riwayat.

- `POST /v1/agents/sessions/{session_id}` mengganti `metadata`; `PATCH /v1/agents/sessions/{session_id}` mengganti nama dengan `{"title","row_version"}`.

- `POST /v1/agents/sessions/{session_id}/cancel` (memerlukan `Idempotency-Key`) membatalkan turn yang sedang berjalan.

- `DELETE /v1/agents/sessions/{session_id}` mengarsipkan; `POST /v1/agents/sessions/{session_id}/unarchive` memulihkan.

- `POST /v1/agents/sessions/{session_id}/files` mengunggah satu lampiran (multipart `file`, 5 MiB, `Idempotency-Key` wajib).

- `POST /v1/agents/sessions/{session_id}/reconnect` mengembalikan `stream_url` untuk `GET /v1/agents/sessions/{session_id}/events/stream`, yang mengirim `session.snapshot` lalu event langsung.

---

### File workspace dan artifact output {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files` menampilkan metadata file saat ini di bawah `path` (default `/workspace`). Kueri `limit` (1-100, default 20), `order` (default `asc` atau `desc`), dan `page` (cursor `next` sebelumnya). Mengembalikan `{object:"page", data:[{path,size_bytes}], next, has_more}`. Cursor yang tidak valid mengharuskan Anda memulai ulang dari halaman pertama.
- `GET /v1/agents/sessions/{session_id}/artifacts` menampilkan output yang tidak dapat diubah yang ditangkap di bawah `/workspace/outputs/`. Kueri `limit` (default 20), `order` (default `desc`), dan `after` (gunakan `last_id` saat `has_more` bernilai true).
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` mengunduh artifact lengkap menggunakan ID `art_` opaque yang dikembalikan. Unduhan dibatasi 200 MiB; `Range` tidak didukung (`416`). Metadata workspace, lampiran yang diunggah, dan artifact yang ditangkap adalah resource yang terpisah.

---

## Skills, Koneksi MCP, dan Secret {#skills-mcp-connections-and-secrets}

### POST /v1/skills — Buat Skill {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

Satu bagian ZIP `files` (5 MiB). ZIP harus berisi satu folder tingkat atas dengan `SKILL.md` (frontmatter `name` dan `description`) di dalamnya, misalnya `zip -r release-notes.zip release-notes/`; `SKILL.md` di root ZIP mengembalikan `400 invalid_request`. Skill yang direferensikan oleh versi Agent mana pun (termasuk Agent yang diarsipkan) tidak dapat dihapus (`409`); sebagai gantinya, nonaktifkan dengan `POST /v1/skills/{skill_id}` dan `{"status": "disabled"}`. Mengembalikan `201` dengan `id` (`skl_`) dan `default_version`. Tambahkan versi dengan `POST /v1/skills/{skill_id}/versions`; tampilkan daftar dengan `GET /v1/skills`. Referensikan dari Agent sebagai `{"skill_id": "skl_...", "version": null}`.

### POST /v1/mcp-connections — Mendaftarkan server MCP {#post-v1-mcp-connections-—-register-an-mcp-server}

Body `{"name", "server_url" (HTTPS), "secret_id"?}`; `Idempotency-Key` wajib. Referensikan dari `mcp_connections` milik Agent. Menonaktifkannya akan memblokir Session baru dan input berikutnya.

### POST /v1/secrets — Menyimpan Bearer token MCP {#post-v1-secrets-—-store-an-mcp-bearer-token}

Body `{"name", "kind": "mcp_bearer", "server_url", "token"}`; `Idempotency-Key` wajib. Token bersifat write-only dan terikat ke URL yang persis tersebut. Secret bukan environment variable. Rotasi dengan `POST /v1/secrets/{secret_id}/rotate`; cabut dengan `DELETE /v1/secrets/{secret_id}` (204).

---

## Penagihan & Biaya {#billing-cost}

### Cara biaya dihitung {#how-costs-are-calculated}

- Baca formula harga dan satuan terkini untuk model yang dipilih dari `model_card`-nya.
- Model dengan harga per token dapat mencakup komponen input, output, cache, atau reasoning jika dideklarasikan.
- Model media dan model lainnya dapat menggunakan satuan per permintaan, durasi, resolusi, atau satuan khusus model lainnya.
- Data API (search, social, scraping, e-commerce, finance) mencakup 100 panggilan gratis per organisasi per hari UTC, dibagi di antara data API yang memenuhi syarat dan direset pada pukul 00:00 UTC. Panggilan berikutnya ditagih per panggilan; panggilan tersebut tidak ditolak. Organisasi dengan saldo nol tetap dapat menggunakan panggilan gratis.
- Tidak memenuhi syarat: LLM, model media, dan data API yang lebih mahal atau berharga berbasis formula (misalnya beberapa endpoint batch, crawl, Xiaohongshu PGY, dan rute Douyin Xingtu `kol-*`), yang ditagih sejak panggilan pertama. `pricing.free_quota` pada `sandbase_inspect` adalah cara memeriksanya.
- MCP: `sandbase_inspect` menampilkan `pricing.free_quota` pada tool yang memenuhi syarat; `sandbase_account` mengembalikan `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`); hasil `sandbase_run` dan `sandbase_run_get` yang sudah diselesaikan menyertakan `free_quota_status` (`free`, `overage`, atau `degraded`).
- Jika operasi yang dapat ditagih mengembalikan task ID (termasuk header respons `x-task-id`), gunakan `GET /v1/tasks/{task_id}/cost` untuk penyelesaian tagihan dan penggunaan.
- Untuk respons `POST /v1/run` asinkron, kueri hasil generasi dengan `GET /v1/run/{id}`; run ID bukan task ID dan tidak boleh dikirim ke endpoint biaya.

### Kontrol anggaran {#budget-control}

- Tetapkan batas pengeluaran opsional saat membuat atau mengedit key standar di [Developer → API Keys](https://www.sandbase.ai/console/keys).
- Pantau permintaan dan biaya di **Developer → Activities → Usage**.
- Tinjau saldo dan transaksi kredit di [Developer → Billing](https://www.sandbase.ai/console/billing).

---

## Lihat Juga {#see-also}

- [Model & Harga](./models) — penemuan model secara langsung, kemampuan, dan panduan harga
- [Panduan Error](./errors) — bentuk respons yang terdokumentasi, penanganan HTTP, dan keamanan retry
- [Spesifikasi OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) — skema yang dapat dibaca mesin


## Binding versi Skill pada Agent {#agent-skill-version-bindings}

Menyimpan Agent akan mengunci setiap referensi Skill baru ke versi eksplisit. Untuk binding baru, `version: null` memilih default saat ini pada waktu penyimpanan. Untuk binding yang sudah ada, `version: null` mempertahankan versi yang dikuncinya. Mengubah default Skill tidak meng-upgrade Agent yang tersimpan maupun Session yang sudah ada; simpan versi eksplisit pada Agent untuk meng-upgrade Session berikutnya.
