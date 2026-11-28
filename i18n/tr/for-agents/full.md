---
i18nSource: e566962f42a5f6b0
title: SandBase AI API kılavuzu
description: AI agent'ları için temel iş akışlarını, istek örneklerini ve yetkili OpenAPI belirtimine bağlantıları içeren genişletilmiş SandBase API kılavuzu.
---

# AI API kılavuzu {#ai-api-guide}

::: info Session sözleşmesi
Bir Session (`ses_*`), kaydedilmiş tek bir Agent sürümünü çalıştırır ve doğrudan `POST /v1/agents/sessions` ile oluşturulur. İç Runtime Session kimlikleri dışarıya açılmaz.
:::

> En yaygın API iş akışlarını tek sayfada anlatan bir kılavuz. Makine tarafından okunabilir sözleşmenin tamamı için [OpenAPI belirtimini](https://www.sandbase.ai/docs/openapi.yaml) kullanın. Düz metin sürümü: [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt).

## Kimlik doğrulama {#authentication}

Tüm istekler şunu gerektirir:

```
Authorization: Bearer sk-YOUR_KEY
```

Base URL: `https://api.sandbase.ai/v1`

---

## Terimler {#terminology}

| Terim | Anlamı |
|------|---------|
| **Task** | Model çıkarımı gibi işlemler için faturalandırılabilir bir yürütme kaydı. Her API işlemi bir task oluşturmaz. |
| **Run** | `POST /v1/run` ile yapılan bir medya üretimi isteği. Senkron veya asenkron olabilir. `GET /v1/run/{id}` ile yoklayın. |
| **Session** | `POST /v1/agents/sessions` ile yapılan, konuşmayı, araç etkinliğini ve çıktıyı tutan bir Agent yürütmesi. `GET /v1/agents/sessions/{session_id}` ile sorgulayın. |
> **run ve session**: Bir model "run"ı (`/v1/run`) bir model üretim görevidir. Bir "Session" (`/v1/agents/sessions`) ise bir Agent yürütmesidir. Tüm kimlikler opaktır ve ayrıştırılmamalıdır.
>
> **task ve run**: "run" veya "session" sizin yaptığınız istektir; "task" ise faturalandırılabilir bir yürütme kaydıdır. Bir işlem task kimliği döndürdüğünde
> `GET /v1/tasks/{task_id}/cost` kullanın. Her API işlemi bir task oluşturmaz.

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

OpenAI uyumludur. Streaming, araçlar, görüntü işleme, akıl yürütme ve yapılandırılmış çıktı desteği seçilen modele ve onun bildirilen şemasına bağlıdır.

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

**Yanıt:**

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

> Bazı faturalandırılabilir işlemler `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc` döndürebilir; mevcutsa bunu
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost` sorgusu için kullanın.

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

Anthropic uyumlu Messages API. Önbelleğe alma ve diğer isteğe bağlı özellikler seçilen modele ve istek şemasına bağlıdır.

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

**Yanıt:**

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

## Görsel üretimi {#image-generation}

### POST /v1/run {#post-v1-run}

`/v1/run` endpoint'i **birleşik bir üretim endpoint'idir**; çıktı türünü (görsel, video veya ses) `model` alanı belirler.

> **Yanıt nasıl ele alınır:** `status` alanını kontrol edin.
> - `"completed"` → sonuçlar `outputs` içindedir, işlem tamamdır.
> - `"pending"` veya `"running"` → son bir duruma (`completed`, `failed` veya `timeout`) ulaşana kadar her 2–5 saniyede bir `GET /v1/run/{id}` ile yoklayın.

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

**Yanıt (senkron):**

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

## Video üretimi {#video-generation}

### POST /v1/run {#post-v1-run-1}

Seçilen modelin `execution_mode` değerini kontrol edin. Gönderim `pending` veya `running` döndürdüğünde son bir duruma ulaşana kadar `GET /v1/run/{id}` ile yoklayın.

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

**Yanıt (asenkron, ilk yanıt):**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**Durumu yoklama: `GET /v1/run/{id}`**

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

## Ses (metinden konuşmaya) {#audio-text-to-speech}

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

**Yanıt:**

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

## Modelleri listeleme {#list-models}

### GET /v1/models {#get-v1-models}

Etkin mantıksal modelleri OpenAI uyumlu model listesi biçiminde döndürür. Endpoint sayfalanmaz ve
varsayılan olarak `type=llm` kullanır. Ayrıntılı yetenekler ve fiyatlandırma bilerek dahil edilmez.

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Yanıt `object: "list"` ve bir `data` dizisi içerir. Her öğe `id`, `object`, `created` ve
`owned_by` içerir; mantıksal model adı olarak `id` kullanın. Yetenek ve fiyatlandırma metadata'sı için o modeli ayrıca alın.

---

## Model alma {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Ayrıntı yanıtı `unified_schema`, `supported_modes` ve `model_card` alanlarını ekler. Ayrıntılı fiyatlar
`model_card` içinde bulunur; üst düzey bir `pricing` nesnesi yoktur.

---

## Task maliyetini alma {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

API işleminin döndürdüğü task kimliğini kullanarak bir task'ın kaydedilmiş maliyetini kontrol edin.

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Yanıt:**

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

## Agents platformu kuralları {#agents-platform-conventions}

- Base URL `https://api.sandbase.ai/v1`. `Authorization: Bearer sk-YOUR_KEY` veya `X-API-Key: sk-YOUR_KEY` gönderin (ikisi birlikte gönderilirse aynı değer). `OpenAI-Beta` isteğe bağlıdır; gönderilirse `agents=v1` olmalıdır. Resmi OpenAI SDK (`client.beta.agents`, `client.skills`) `base_url="https://api.sandbase.ai/v1"` ile çalışır; farklar [OpenAI uyumluluğu](/agents/openai-compatibility) sayfasında listelenmiştir.

- Gövdeler en fazla 1 MiB boyutunda katı JSON'dur; bilinmeyen alanlar 400 döndürür.

- Hatalar: `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`. `code` değerine göre dallanın; [Hata kılavuzuna](./errors#agents-platform-errors) bakın.

- `row_version`, PATCH, archive, restore ve rotate için compare-and-set token'ıdır. 409 aldığınızda yeniden okuyun.

- Cursor listeleri (Agents, Sessions, items, turns, Skills): `limit` 1-100, `after`, `order`; yanıt `{object:"list", data, has_more, first_id, last_id}`.

- Offset listeleri (Agent sürümleri, ekler, MCP bağlantıları, Secret'lar): `limit`, `offset`; yanıt `{data, total, limit, offset}`.

- Kimlikler: Agent `agt_`, Session `ses_`, Skill `skl_`, MCP bağlantısı `mcp_`, Secret `sec_`, ek `fil_`. Bunları opak kabul edin.

---

## Agents {#agents}

### POST /v1/agents — Agent oluşturma {#post-v1-agents-—-create-agent}

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

Zorunlu: `model`. İsteğe bağlı: `name`, `instructions`, `description`, `runtime_profile` (varsayılan `codex`, `claude`, `mcode`), `skills` (`[{"skill_id","version"}]`), `mcp_connections` (`[{"connection_id","server_label","allowed_tools","required"}]`), `tools`, `text`, `reasoning`, `service_tier`, `metadata`, `note`. `id` (`agt_`), `version`, `row_version`, `status` ve `projection_status` ile `201` döndürür; `projection_status` değeri `ready` olduğunda Session başlatın. `web_search` araçları `mode: "disabled"` kullanmalıdır ve istemci tarafı fonksiyon sonuçları (`requires_action`) desteklenmez.

### GET /v1/agents — Agent'ları listeleme {#get-v1-agents-—-list-agents}

`status` (varsayılan `active`, `archived`, `all`) ve cursor sayfalamayla sorgulayın.

### GET /v1/agents/{agent_id} — Agent alma {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — Agent güncelleme (SDK tarzı) {#post-v1-agents-agent-id-—-update-agent-sdk-style}

`name`, `instructions`, `model`, `metadata`, `service_tier`, `tools`, `text`, `reasoning`, `runtime_profile`, `mcp_connections`, `skills` alanlarının kısmi güncellemesi. `row_version` gerekmez; yeni bir sürüm oluşturur.

### PATCH /v1/agents/{agent_id} — Agent güncelleme (compare-and-set) {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

Aynı alanlara ek olarak `description` ve `note`; `row_version` zorunludur. Açık `null` değeri 400 döndürür.

### Sürümler, arşivleme, geri yükleme, katalog {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` ve `GET /v1/agents/{agent_id}/versions/{version}` değiştirilemez anlık görüntüleri okur.

- `POST /v1/agents/{agent_id}/archive` ve `POST /v1/agents/{agent_id}/unarchive`, `{"row_version"}` alır. `DELETE /v1/agents/{agent_id}` da arşivler.

- `POST /v1/agents/{agent_id}/restore`, `{"source_version","row_version"}` alır.

- `GET /v1/agents/catalog` herkese açık Agent'ları listeler; `POST /v1/agents/catalog/{agent_id}/clone` birini kuruluşunuza kopyalar (`201`, yeni `agt_`).

---

## Sessions {#sessions}

Bir Session, kaydedilmiş tek bir Agent sürümünü çalıştırır. Yollar `/v1/agents/sessions` altındadır. Agent sürümü, Skill sürümleri ve MCP bağlantıları oluşturma anında dondurulur.

### POST /v1/agents/sessions — Session oluşturma {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

`agent_id` (kaydedilmiş Agent), `agent` (satır içi Agent veya `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` ve `multi_agent` için Session başına geçersiz kılmalar) ya da ikisini birden gönderin. İsteğe bağlı: `version` (yalnızca kaydedilmiş Agent'lar), `title`, `input` (bir dize veya tek bir `input_text` parçası içeren tam olarak bir user mesajından oluşan dizi), `model` veya `agent.model`, `metadata`, `model_provider` (`{"type":"custom","base_url":"https://...","api_key":"..."}`; gönderilmezse çağıran anahtarınız kullanılır). Boş olmayan bir `input` ile `stream: true`, ilk turn'ün `agent.session.created` ile başlayan Server-Sent Events stream'i olarak `201` döndürür. Session'lar her zaman SandBase'in barındırılan bulutunda çalışır, bu nedenle seçilecek bir ortam yoktur; OpenAI SDK yine de `environment={"type": "openai_hosted"}` gerektirir. `status` (`idle`, `in_progress`, `failed`), `lifecycle_status` (`active`, `archived`), `failure`, `source` (`direct`, `service`, `schedule`) ve `row_version` ile `201` döndürür.

### GET /v1/agents/sessions/{session_id}/events — Olayları stream etme (SSE) {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

Yalnızca canlıdır. Girdi göndermeden önce açın. `Last-Event-ID` veya `after` 400 döndürür; olaylar yeniden oynatılmaz. Olay `type` değerleri `agent.session.` ile başlar.

### POST /v1/agents/sessions/{session_id}/events — Girdi gönderme {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

İstek başına tam olarak bir olay: `agent.session.input.message` veya `agent.session.input.cancel`. Gövdesiz `202` döndürür. Uzantı biçimi: `{"input": "...", "file_ids": ["fil_..."]}` (en fazla 10 hazır ek). `409 session_input_pending`, önceki girdinin hâlâ iletilmekte olduğu anlamına gelir; bekleyin ve yeni bir anahtarla yeniden göndermeyin.

### Geçmiş ve diğer Session işlemleri {#history-and-other-session-operations}

- `GET /v1/agents/sessions` (`lifecycle_status`, `agent_id` ile sorgulama), `GET /v1/agents/sessions/{session_id}`.

- `GET /v1/agents/sessions/{session_id}/items`, `GET /v1/agents/sessions/{session_id}/turns`, `GET /v1/agents/sessions/{session_id}/turns/{turn_id}` geçmişi okur.

- `POST /v1/agents/sessions/{session_id}` `metadata` değerinin yerini alır; `PATCH /v1/agents/sessions/{session_id}` `{"title","row_version"}` ile yeniden adlandırır.

- `POST /v1/agents/sessions/{session_id}/cancel` (`Idempotency-Key` gerektirir) çalışan turn'ü iptal eder.

- `DELETE /v1/agents/sessions/{session_id}` arşivler; `POST /v1/agents/sessions/{session_id}/unarchive` geri yükler.

- `POST /v1/agents/sessions/{session_id}/files` tek bir ek yükler (multipart `file`, 5 MiB, `Idempotency-Key` zorunlu).

- `POST /v1/agents/sessions/{session_id}/reconnect`, `GET /v1/agents/sessions/{session_id}/events/stream` için `stream_url` döndürür; bu stream önce `session.snapshot`, ardından canlı olayları gönderir.

---

### Çalışma alanı dosyaları ve çıktı artifact'ları {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files`, `path` altındaki (varsayılan `/workspace`) mevcut dosya metadata'sını listeler. `limit` (1-100, varsayılan 20), `order` (varsayılan `asc` veya `desc`) ve `page` (önceki `next` cursor'ı) ile sorgulayın. `{object:"page", data:[{path,size_bytes}], next, has_more}` döndürür. Geçersiz bir cursor, ilk sayfadan yeniden başlamayı gerektirir.
- `GET /v1/agents/sessions/{session_id}/artifacts`, `/workspace/outputs/` altında yakalanan değiştirilemez çıktıları listeler. `limit` (varsayılan 20), `order` (varsayılan `desc`) ve `after` (`has_more` true olduğunda `last_id` kullanın) ile sorgulayın.
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content`, döndürülen opak `art_` kimliğini kullanarak bir artifact'ın tamamını indirir. İndirmelerin 200 MiB sınırı vardır; `Range` desteklenmez (`416`). Çalışma alanı metadata'sı, yüklenen ekler ve yakalanan artifact'lar ayrı kaynaklardır.

---

## Skills, MCP bağlantıları ve Secret'lar {#skills-mcp-connections-and-secrets}

### POST /v1/skills — Skill oluşturma {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

Tek bir ZIP parçası `files` (5 MiB). ZIP, içinde `SKILL.md` (`name` ve `description` frontmatter'ı ile) bulunan tek bir üst düzey klasör içermelidir, örneğin `zip -r release-notes.zip release-notes/`; ZIP kökündeki bir `SKILL.md`, `400 invalid_request` döndürür. Herhangi bir Agent sürümünün (arşivlenmiş Agent'lar dahil) referans verdiği bir Skill silinemez (`409`); bunun yerine `POST /v1/skills/{skill_id}` ve `{"status": "disabled"}` ile devre dışı bırakın. `id` (`skl_`) ve `default_version` ile `201` döndürür. `POST /v1/skills/{skill_id}/versions` ile sürüm ekleyin; `GET /v1/skills` ile listeleyin. Bir Agent'tan `{"skill_id": "skl_...", "version": null}` olarak referans verin.

### POST /v1/mcp-connections — MCP sunucusu kaydetme {#post-v1-mcp-connections-—-register-an-mcp-server}

Gövde `{"name", "server_url" (HTTPS), "secret_id"?}`; `Idempotency-Key` zorunludur. Bir Agent'ın `mcp_connections` alanından referans verin. Devre dışı bırakmak yeni Session'ları ve sonraki girdileri engeller.

### POST /v1/secrets — MCP Bearer token'ı saklama {#post-v1-secrets-—-store-an-mcp-bearer-token}

Gövde `{"name", "kind": "mcp_bearer", "server_url", "token"}`; `Idempotency-Key` zorunludur. Token yalnızca yazılabilir ve o URL'ye birebir bağlıdır. Secret'lar ortam değişkeni değildir. `POST /v1/secrets/{secret_id}/rotate` ile yenileyin; `DELETE /v1/secrets/{secret_id}` (204) ile iptal edin.

---

## Faturalandırma ve maliyet {#billing-cost}

### Maliyetler nasıl hesaplanır {#how-costs-are-calculated}

- Seçilen modelin güncel fiyatlandırma formülünü ve birimlerini `model_card` içinden okuyun.
- Token bazında fiyatlandırılan modeller, bildirildiğinde girdi, çıktı, önbellek veya akıl yürütme bileşenleri içerebilir.
- Medya ve diğer modeller istek başına, süre, çözünürlük veya modele özgü başka birimler kullanabilir.
- Veri API'leri (arama, sosyal medya, scraping, e-ticaret, finans), kuruluş başına UTC günü başına 100 ücretsiz çağrı içerir; bu çağrılar uygun veri API'leri arasında paylaşılır ve 00:00 UTC'de sıfırlanır. Sonraki çağrılar çağrı başına faturalandırılır; reddedilmez. Bakiyesi sıfır olan kuruluşlar da ücretsiz çağrıları kullanabilir.
- Uygun olmayanlar: LLM'ler, medya modelleri ve daha pahalı ya da formülle fiyatlandırılan veri API'leri (örneğin bazı batch endpoint'leri, crawl, Xiaohongshu PGY ve Douyin Xingtu `kol-*` yolları); bunlar ilk çağrıdan itibaren faturalandırılır. Kontrol için `sandbase_inspect` üzerindeki `pricing.free_quota` değerine bakın.
- MCP: `sandbase_inspect`, uygun araçlarda `pricing.free_quota` gösterir; `sandbase_account`, `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`) döndürür; sonuçlanmış `sandbase_run` ve `sandbase_run_get` sonuçları `free_quota_status` (`free`, `overage` veya `degraded`) içerir.
- Faturalandırılabilir bir işlem bir task kimliği döndürdüğünde (`x-task-id` yanıt header'ı dahil), kesinleşen tutar ve kullanım için `GET /v1/tasks/{task_id}/cost` kullanın.
- Asenkron `POST /v1/run` yanıtları için üretim sonucunu `GET /v1/run/{id}` ile sorgulayın; run kimliği bir task kimliği değildir ve maliyet endpoint'ine gönderilmemelidir.

### Bütçe kontrolü {#budget-control}

- [Developer → API Keys](https://www.sandbase.ai/console/keys) altında standart bir anahtar oluştururken veya düzenlerken isteğe bağlı bir harcama sınırı ayarlayın.
- İstekleri ve maliyeti **Developer → Activities → Usage** altında izleyin.
- Bakiyeyi ve kredi işlemlerini [Developer → Billing](https://www.sandbase.ai/console/billing) altında inceleyin.

---

## Ayrıca bakın {#see-also}

- [Modeller ve fiyatlandırma](./models): canlı model keşfi, yetenekler ve fiyatlandırma rehberi
- [Hata kılavuzu](./errors): belgelenmiş yanıt yapıları, HTTP yönetimi ve yeniden deneme güvenliği
- [OpenAPI belirtimi](https://www.sandbase.ai/docs/openapi.yaml): makine tarafından okunabilir şema


## Agent Skill sürüm bağlamaları {#agent-skill-version-bindings}

Bir Agent'ı kaydetmek, her yeni Skill referansını açık bir sürüme sabitler. Yeni bir bağlama için `version: null`, kaydetme anındaki güncel varsayılanı seçer. Mevcut bir bağlama için `version: null`, sabitlenmiş sürümü korur. Bir Skill'in varsayılanını değiştirmek kaydedilmiş Agent'ları veya mevcut Session'ları yükseltmez; gelecekteki Session'ları yükseltmek için Agent'a açık bir sürüm kaydedin.
