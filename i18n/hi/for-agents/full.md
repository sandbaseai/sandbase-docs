---
i18nSource: e566962f42a5f6b0
title: SandBase AI API गाइड
description: AI agents के लिए विस्तृत SandBase API guide, जिसमें मुख्य workflows, request उदाहरण और आधिकारिक OpenAPI specification के links हैं।
---

# AI API गाइड {#ai-api-guide}

::: info Session contract
एक Session (`ses_*`) एक saved Agent version चलाता है और सीधे `POST /v1/agents/sessions` से बनाया जाता है। Internal Runtime Session IDs उजागर नहीं किए जाते।
:::

> सबसे आम API workflows के लिए एक-पेज guide। पूरे machine-readable contract के लिए [OpenAPI specification](https://www.sandbase.ai/docs/openapi.yaml) इस्तेमाल करें। Plain-text version: [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt)।

## प्रमाणीकरण {#authentication}

सभी requests के लिए यह ज़रूरी है:

```
Authorization: Bearer sk-YOUR_KEY
```

Base URL: `https://api.sandbase.ai/v1`

---

## शब्दावली {#terminology}

| शब्द | अर्थ |
|------|---------|
| **Task** | Model inference जैसे operations के लिए एक billable execution record। हर API operation एक task नहीं बनाता। |
| **Run** | `POST /v1/run` के ज़रिए एक media generation request। Sync या async हो सकता है। `GET /v1/run/{id}` से poll करें। |
| **Session** | `POST /v1/agents/sessions` के ज़रिए एक Agent execution, जिसमें बातचीत, tool activity और output होते हैं। `GET /v1/agents/sessions/{session_id}` से query करें। |
> **run बनाम session**: Model "run" (`/v1/run`) एक model generation task है। "Session" (`/v1/agents/sessions`) एक Agent execution है। सभी IDs opaque हैं और उन्हें parse नहीं करना चाहिए।
>
> **task बनाम run**: "run" या "session" वह request है जो आप करते हैं; "task" एक billable execution record है। जब कोई operation task ID लौटाता है, तो
> `GET /v1/tasks/{task_id}/cost` इस्तेमाल करें। हर API operation एक task नहीं बनाता।

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

OpenAI-compatible। Streaming, tools, vision, reasoning और structured-output का समर्थन चुने गए model और उसके declared schema पर निर्भर करता है।

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

**Response:**

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

> कुछ billable operations `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc` लौटा सकते हैं; मौजूद होने पर, इसका इस्तेमाल
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost` query करने के लिए करें।

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

Anthropic-compatible Messages API। Caching और अन्य वैकल्पिक features चुने गए model और request schema पर निर्भर करते हैं।

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

**Response:**

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

## इमेज जनरेशन {#image-generation}

### POST /v1/run {#post-v1-run}

`/v1/run` endpoint एक **unified generation endpoint** है — `model` field output type (image, video या audio) तय करता है।

> **Response कैसे संभालें:** `status` field जाँचें।
> - `"completed"` → परिणाम `outputs` में हैं, काम पूरा।
> - `"pending"` या `"running"` → terminal status (`completed`, `failed` या `timeout`) आने तक हर 2–5s पर `GET /v1/run/{id}` poll करें।

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

**Response (sync):**

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

## वीडियो जनरेशन {#video-generation}

### POST /v1/run {#post-v1-run-1}

चुने गए model का `execution_mode` जाँचें। जब submission `pending` या `running` लौटाता है, तो terminal status आने तक `GET /v1/run/{id}` poll करें।

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

**Response (async — शुरुआती):**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**Status poll करें: `GET /v1/run/{id}`**

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

## ऑडियो (टेक्स्ट-टू-स्पीच) {#audio-text-to-speech}

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

**Response:**

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

## Models की सूची {#list-models}

### GET /v1/models {#get-v1-models}

OpenAI-compatible model-list format में enabled logical models लौटाता है। यह endpoint paginated नहीं है और
default रूप से `type=llm` इस्तेमाल करता है। विस्तृत क्षमताएँ और pricing जानबूझकर शामिल नहीं की गई हैं।

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Response में `object: "list"` और एक `data` array होता है। हर item में `id`, `object`, `created` और
`owned_by` होते हैं; `id` को logical model name के रूप में इस्तेमाल करें। क्षमता और pricing metadata के लिए उस model को retrieve करें।

---

## Model प्राप्त करें {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Detail response में `unified_schema`, `supported_modes` और `model_card` जुड़ते हैं। विस्तृत कीमतें
`model_card` के अंदर होती हैं; कोई top-level `pricing` object नहीं है।

---

## Task की लागत प्राप्त करें {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

API operation द्वारा लौटाए गए task ID से किसी task की दर्ज लागत जाँचें।

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Response:**

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

## Agents platform की परंपराएँ {#agents-platform-conventions}

- Base URL `https://api.sandbase.ai/v1`। `Authorization: Bearer sk-YOUR_KEY` या `X-API-Key: sk-YOUR_KEY` भेजें (दोनों भेजने पर एक ही मान)। `OpenAI-Beta` वैकल्पिक है; भेजा जाए तो यह `agents=v1` होना चाहिए। आधिकारिक OpenAI SDK (`client.beta.agents`, `client.skills`) `base_url="https://api.sandbase.ai/v1"` के साथ काम करता है; अंतर [OpenAI compatibility](/agents/openai-compatibility) में दिए गए हैं।

- Bodies अधिकतम 1 MiB का strict JSON होती हैं; अज्ञात fields 400 लौटाते हैं।

- Errors: `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`। `code` के आधार पर branch करें; [Error Guide](./errors#agents-platform-errors) देखें।

- `row_version` PATCH, archive, restore और rotate के लिए compare-and-set token है। 409 मिलने पर फिर से पढ़ें।

- Cursor lists (Agents, Sessions, items, turns, Skills): `limit` 1-100, `after`, `order`; response `{object:"list", data, has_more, first_id, last_id}`।

- Offset lists (Agent versions, attachments, MCP connections, Secrets): `limit`, `offset`; response `{data, total, limit, offset}`।

- IDs: Agent `agt_`, Session `ses_`, Skill `skl_`, MCP connection `mcp_`, Secret `sec_`, attachment `fil_`। इन्हें opaque मानें।

---

## Agents {#agents}

### POST /v1/agents — Agent बनाएँ {#post-v1-agents-—-create-agent}

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

ज़रूरी: `model`। वैकल्पिक: `name`, `instructions`, `description`, `runtime_profile` (`codex` default, `claude`, `mcode`), `skills` (`[{"skill_id","version"}]`), `mcp_connections` (`[{"connection_id","server_label","allowed_tools","required"}]`), `tools`, `text`, `reasoning`, `service_tier`, `metadata`, `note`। `id` (`agt_`), `version`, `row_version`, `status` और `projection_status` के साथ `201` लौटाता है; `projection_status` के `ready` होने पर Sessions शुरू करें। `web_search` tools को `mode: "disabled"` इस्तेमाल करना होगा, और client-side function results (`requires_action`) समर्थित नहीं हैं।

### GET /v1/agents — Agents की सूची {#get-v1-agents-—-list-agents}

`status` (`active` default, `archived`, `all`) और cursor pagination के साथ query करें।

### GET /v1/agents/{agent_id} — Agent प्राप्त करें {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — Agent update करें (SDK style) {#post-v1-agents-agent-id-—-update-agent-sdk-style}

`name`, `instructions`, `model`, `metadata`, `service_tier`, `tools`, `text`, `reasoning`, `runtime_profile`, `mcp_connections`, `skills` का आंशिक update। `row_version` नहीं चाहिए; एक नया version बनाता है।

### PATCH /v1/agents/{agent_id} — Agent update करें (compare-and-set) {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

वही fields, साथ में `description` और `note`; `row_version` ज़रूरी है। स्पष्ट `null` 400 लौटाता है।

### संस्करण, आर्काइव, रीस्टोर, कैटलॉग {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` और `GET /v1/agents/{agent_id}/versions/{version}` immutable snapshots पढ़ते हैं।

- `POST /v1/agents/{agent_id}/archive`, `POST /v1/agents/{agent_id}/unarchive` `{"row_version"}` लेते हैं। `DELETE /v1/agents/{agent_id}` भी archive करता है।

- `POST /v1/agents/{agent_id}/restore` `{"source_version","row_version"}` लेता है।

- `GET /v1/agents/catalog` public Agents की सूची देता है; `POST /v1/agents/catalog/{agent_id}/clone` किसी एक को आपकी organization में कॉपी करता है (`201`, नया `agt_`)।

---

## सेशन {#sessions}

एक Session एक saved Agent version चलाता है। Paths `/v1/agents/sessions` के अंतर्गत हैं। Agent version, Skill versions और MCP connections बनाते समय freeze हो जाते हैं।

### POST /v1/agents/sessions — Session बनाएँ {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

`agent_id` (saved Agent), `agent` (inline Agent या `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` और `multi_agent` के प्रति-Session overrides), या दोनों भेजें। वैकल्पिक: `version` (केवल saved Agents), `title`, `input` (एक string, या एक array जिसमें ठीक एक user message हो जिसमें एक `input_text` part हो), `model` या `agent.model`, `metadata`, `model_provider` (`{"type":"custom","base_url":"https://...","api_key":"..."}`; न देने पर आपकी calling key इस्तेमाल होती है)। गैर-खाली `input` के साथ `stream: true` पहले turn का Server-Sent Events stream `201` के रूप में लौटाता है, जो `agent.session.created` से शुरू होता है। Sessions हमेशा SandBase के hosted cloud में चलते हैं, इसलिए कोई environment चुनना नहीं होता; OpenAI SDK को फिर भी `environment={"type": "openai_hosted"}` चाहिए। `status` (`idle`, `in_progress`, `failed`), `lifecycle_status` (`active`, `archived`), `failure`, `source` (`direct`, `service`, `schedule`) और `row_version` के साथ `201` लौटाता है।

### GET /v1/agents/sessions/{session_id}/events — Events stream करें (SSE) {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

केवल live। Input भेजने से पहले इसे खोलें। `Last-Event-ID` या `after` 400 लौटाता है; events दोबारा नहीं भेजे जाते। Event `type` मान `agent.session.` से शुरू होते हैं।

### POST /v1/agents/sessions/{session_id}/events — Input भेजें {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

हर request में ठीक एक event: `agent.session.input.message` या `agent.session.input.cancel`। बिना body के `202` लौटाता है। Extension रूप: `{"input": "...", "file_ids": ["fil_..."]}` (अधिकतम 10 ready attachments)। `409 session_input_pending` का अर्थ है कि पहले का input अभी पहुँचाया जा रहा है; इंतज़ार करें और नई key के साथ दोबारा न भेजें।

### इतिहास और अन्य Session operations {#history-and-other-session-operations}

- `GET /v1/agents/sessions` (query `lifecycle_status`, `agent_id`), `GET /v1/agents/sessions/{session_id}`।

- `GET /v1/agents/sessions/{session_id}/items`, `GET /v1/agents/sessions/{session_id}/turns`, `GET /v1/agents/sessions/{session_id}/turns/{turn_id}` इतिहास पढ़ते हैं।

- `POST /v1/agents/sessions/{session_id}` `metadata` को बदल देता है; `PATCH /v1/agents/sessions/{session_id}` `{"title","row_version"}` से नाम बदलता है।

- `POST /v1/agents/sessions/{session_id}/cancel` (`Idempotency-Key` ज़रूरी) चल रहे turn को cancel करता है।

- `DELETE /v1/agents/sessions/{session_id}` archive करता है; `POST /v1/agents/sessions/{session_id}/unarchive` restore करता है।

- `POST /v1/agents/sessions/{session_id}/files` एक attachment upload करता है (multipart `file`, 5 MiB, `Idempotency-Key` ज़रूरी)।

- `POST /v1/agents/sessions/{session_id}/reconnect` `GET /v1/agents/sessions/{session_id}/events/stream` के लिए `stream_url` लौटाता है, जो `session.snapshot` और फिर live events भेजता है।

---

### Workspace files और output artifacts {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files` `path` (default `/workspace`) के अंतर्गत मौजूदा file metadata की सूची देता है। `limit` (1-100, default 20), `order` (`asc` default या `desc`) और `page` (पिछला `next` cursor) के साथ query करें। `{object:"page", data:[{path,size_bytes}], next, has_more}` लौटाता है। अमान्य cursor होने पर पहले पेज से फिर शुरू करना होगा।
- `GET /v1/agents/sessions/{session_id}/artifacts` `/workspace/outputs/` के अंतर्गत capture किए गए immutable outputs की सूची देता है। `limit` (default 20), `order` (`desc` default) और `after` (`has_more` true होने पर `last_id` इस्तेमाल करें) के साथ query करें।
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` लौटाए गए opaque `art_` ID से पूरा artifact download करता है। Downloads की सीमा 200 MiB है; `Range` समर्थित नहीं है (`416`)। Workspace metadata, uploaded attachments और captured artifacts अलग-अलग resources हैं।

---

## Skills, MCP Connections और Secrets {#skills-mcp-connections-and-secrets}

### POST /v1/skills — Skill बनाएँ {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

एक ZIP part `files` (5 MiB)। ZIP में एक top-level folder होना चाहिए जिसके अंदर `SKILL.md` (`name` और `description` frontmatter के साथ) हो, उदाहरण के लिए `zip -r release-notes.zip release-notes/`; ZIP root पर `SKILL.md` होने पर `400 invalid_request` मिलता है। किसी भी Agent version (archived Agents सहित) द्वारा referenced Skill delete नहीं की जा सकती (`409`); इसके बजाय `POST /v1/skills/{skill_id}` और `{"status": "disabled"}` से उसे disable करें। `id` (`skl_`) और `default_version` के साथ `201` लौटाता है। `POST /v1/skills/{skill_id}/versions` से versions जोड़ें; `GET /v1/skills` से सूची पाएँ। Agent से `{"skill_id": "skl_...", "version": null}` के रूप में reference करें।

### POST /v1/mcp-connections — MCP server register करें {#post-v1-mcp-connections-—-register-an-mcp-server}

Body `{"name", "server_url" (HTTPS), "secret_id"?}`; `Idempotency-Key` ज़रूरी। Agent के `mcp_connections` से reference करें। इसे disable करने से नए Sessions और आगे का input रुक जाता है।

### POST /v1/secrets — MCP Bearer token store करें {#post-v1-secrets-—-store-an-mcp-bearer-token}

Body `{"name", "kind": "mcp_bearer", "server_url", "token"}`; `Idempotency-Key` ज़रूरी। Token write-only है और उसी सटीक URL से बंधा है। Secrets environment variables नहीं हैं। `POST /v1/secrets/{secret_id}/rotate` से rotate करें; `DELETE /v1/secrets/{secret_id}` (204) से revoke करें।

---

## बिलिंग और लागत {#billing-cost}

### लागत की गणना कैसे होती है {#how-costs-are-calculated}

- चुने गए model का मौजूदा pricing formula और units उसके `model_card` से पढ़ें।
- Token-priced models में declared होने पर input, output, cache या reasoning components शामिल हो सकते हैं।
- Media और अन्य models प्रति-request, अवधि, resolution या अन्य model-specific units इस्तेमाल कर सकते हैं।
- Data APIs (search, social, scraping, e-commerce, finance) में प्रति organization प्रति UTC दिन 100 मुफ़्त calls शामिल हैं, जो पात्र data APIs में साझा होती हैं और 00:00 UTC पर reset होती हैं। बाद की calls का बिल प्रति call बनता है; उन्हें अस्वीकार नहीं किया जाता। शून्य balance वाली organizations भी मुफ़्त calls इस्तेमाल कर सकती हैं।
- पात्र नहीं: LLMs, media models, और महँगी या formula-priced data APIs (उदाहरण के लिए कुछ batch endpoints, crawl, Xiaohongshu PGY, और Douyin Xingtu `kol-*` routes), जिनका बिल पहली call से बनता है। जाँच के लिए `sandbase_inspect` पर `pricing.free_quota` देखें।
- MCP: `sandbase_inspect` पात्र tools पर `pricing.free_quota` दिखाता है; `sandbase_account` `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`) लौटाता है; settled `sandbase_run` और `sandbase_run_get` परिणामों में `free_quota_status` (`free`, `overage` या `degraded`) शामिल होता है।
- जब कोई billable operation task ID लौटाता है (`x-task-id` response header सहित), तो settlement और usage के लिए `GET /v1/tasks/{task_id}/cost` इस्तेमाल करें।
- Asynchronous `POST /v1/run` responses के लिए, generation result को `GET /v1/run/{id}` से query करें; run ID task ID नहीं है और इसे cost endpoint पर नहीं भेजना चाहिए।

### Budget नियंत्रण {#budget-control}

- [Developer → API Keys](https://www.sandbase.ai/console/keys) में standard key बनाते या edit करते समय वैकल्पिक spending limit सेट करें।
- **Developer → Activities → Usage** में requests और लागत पर नज़र रखें।
- [Developer → Billing](https://www.sandbase.ai/console/billing) में balance और credit transactions की समीक्षा करें।

---

## यह भी देखें {#see-also}

- [Models & Pricing](./models) — live model खोज, क्षमताएँ और pricing मार्गदर्शन
- [Error Guide](./errors) — documented response shapes, HTTP handling और retry सुरक्षा
- [OpenAPI Spec](https://www.sandbase.ai/docs/openapi.yaml) — machine-readable schema


## Agent Skill संस्करण बाइंडिंग {#agent-skill-version-bindings}

Agent को save करने पर हर नया Skill reference एक स्पष्ट version पर pin हो जाता है। नई binding के लिए, `version: null` save करते समय का मौजूदा default चुनता है। मौजूदा binding के लिए, `version: null` उसका pinned version बनाए रखता है। Skill का default बदलने से saved Agents या मौजूदा Sessions upgrade नहीं होते; भविष्य के Sessions को upgrade करने के लिए Agent पर एक स्पष्ट version save करें।
