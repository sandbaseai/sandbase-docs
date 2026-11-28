---
i18nSource: e566962f42a5f6b0
title: Guida all'API AI di SandBase
description: Guida estesa all'API SandBase per agent AI, con i flussi di lavoro principali, esempi di richiesta e link alla specifica OpenAPI di riferimento.
---

# Guida all'API per l'AI {#ai-api-guide}

::: info Contratto delle Session
Una Session (`ses_*`) esegue una versione salvata di un Agent e viene creata direttamente con `POST /v1/agents/sessions`. Gli ID interni delle Session di runtime non sono esposti.
:::

> Una guida in una sola pagina ai flussi di lavoro API più comuni. Per il contratto completo leggibile dalle macchine, usa la [specifica OpenAPI](https://www.sandbase.ai/docs/openapi.yaml). Versione in testo semplice: [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt).

## Autenticazione {#authentication}

Tutte le richieste richiedono:

```
Authorization: Bearer sk-YOUR_KEY
```

Base URL: `https://api.sandbase.ai/v1`

---

## Terminologia {#terminology}

| Termine | Significato |
|------|---------|
| **Task** | Un record di esecuzione fatturabile per operazioni come l'inferenza dei modelli. Non tutte le operazioni API ne creano uno. |
| **Run** | Una richiesta di generazione di media tramite `POST /v1/run`. Può essere sincrona o asincrona. Interrogala con `GET /v1/run/{id}`. |
| **Session** | Un'esecuzione di un Agent tramite `POST /v1/agents/sessions`, che contiene la conversazione, l'attività dei tool e l'output. Interrogala con `GET /v1/agents/sessions/{session_id}`. |
> **run e session**: un "run" di modello (`/v1/run`) è un task di generazione del modello. Una "Session" (`/v1/agents/sessions`) è un'esecuzione di un Agent. Tutti gli ID sono opachi e non vanno analizzati.
>
> **task e run**: un "run" o una "session" è la richiesta che invii; un "task" è un record di esecuzione fatturabile. Usa
> `GET /v1/tasks/{task_id}/cost` quando un'operazione restituisce un ID task. Non tutte le operazioni API creano un task.

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

Compatibile con OpenAI. Il supporto a streaming, tool, visione, ragionamento e output strutturato dipende dal modello selezionato e dallo schema che dichiara.

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

**Risposta:**

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

> Alcune operazioni fatturabili possono restituire `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc`; se presente, usalo per interrogare
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost`.

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

Messages API compatibile con Anthropic. Il caching e le altre funzionalità facoltative dipendono dal modello selezionato e dallo schema della richiesta.

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

**Risposta:**

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

## Generazione di immagini {#image-generation}

### POST /v1/run {#post-v1-run}

L'endpoint `/v1/run` è un **endpoint di generazione unificato**: il campo `model` determina il tipo di output (immagine, video o audio).

> **Come gestire la risposta:** controlla il campo `status`.
> - `"completed"` → i risultati sono in `outputs`, hai finito.
> - `"pending"` o `"running"` → interroga `GET /v1/run/{id}` ogni 2–5 s fino a uno stato terminale (`completed`, `failed` o `timeout`).

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

**Risposta (sincrona):**

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

## Generazione di video {#video-generation}

### POST /v1/run {#post-v1-run-1}

Controlla l'`execution_mode` del modello selezionato. Quando l'invio restituisce `pending` o `running`, interroga `GET /v1/run/{id}` fino a uno stato terminale.

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

**Risposta (asincrona, iniziale):**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**Controllo dello stato: `GET /v1/run/{id}`**

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

## Audio (text-to-speech) {#audio-text-to-speech}

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

**Risposta:**

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

## Elencare i modelli {#list-models}

### GET /v1/models {#get-v1-models}

Restituisce i modelli logici abilitati nel formato di elenco modelli compatibile con OpenAI. L'endpoint non è paginato e
usa `type=llm` per impostazione predefinita. Funzionalità dettagliate e prezzi sono omessi di proposito.

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

La risposta contiene `object: "list"` e un array `data`. Ogni elemento contiene `id`, `object`, `created` e
`owned_by`; usa `id` come nome logico del modello. Recupera quel modello per ottenere i metadati su funzionalità e prezzi.

---

## Ottenere un modello {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

La risposta di dettaglio aggiunge `unified_schema`, `supported_modes` e `model_card`. I prezzi dettagliati si trovano dentro
`model_card`; non esiste un oggetto `pricing` di primo livello.

---

## Ottenere il costo di un task {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

Controlla il costo registrato di un task usando l'ID task restituito dall'operazione API.

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Risposta:**

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

## Convenzioni della piattaforma Agents {#agents-platform-conventions}

- Base URL `https://api.sandbase.ai/v1`. Invia `Authorization: Bearer sk-YOUR_KEY` o `X-API-Key: sk-YOUR_KEY` (stesso valore se li invii entrambi). `OpenAI-Beta` è facoltativo; se inviato deve essere `agents=v1`. L'SDK ufficiale OpenAI (`client.beta.agents`, `client.skills`) funziona con `base_url="https://api.sandbase.ai/v1"`; le differenze sono elencate in [Compatibilità con OpenAI](/agents/openai-compatibility).

- I corpi sono JSON rigoroso fino a 1 MiB; i campi sconosciuti restituiscono 400.

- Errori: `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`. Gestisci i casi in base a `code`; consulta la [Guida agli errori](./errors#agents-platform-errors).

- `row_version` è il token compare-and-set per PATCH, archive, restore e rotate. In caso di 409, rileggi la risorsa.

- Elenchi a cursore (Agent, Session, item, turni, Skill): `limit` 1-100, `after`, `order`; risposta `{object:"list", data, has_more, first_id, last_id}`.

- Elenchi a offset (versioni degli Agent, allegati, connessioni MCP, Secret): `limit`, `offset`; risposta `{data, total, limit, offset}`.

- ID: Agent `agt_`, Session `ses_`, Skill `skl_`, connessione MCP `mcp_`, Secret `sec_`, allegato `fil_`. Trattali come opachi.

---

## Agents {#agents}

### POST /v1/agents — Creare un Agent {#post-v1-agents-—-create-agent}

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

Obbligatorio: `model`. Facoltativi: `name`, `instructions`, `description`, `runtime_profile` (`codex` predefinito, `claude`, `mcode`), `skills` (`[{"skill_id","version"}]`), `mcp_connections` (`[{"connection_id","server_label","allowed_tools","required"}]`), `tools`, `text`, `reasoning`, `service_tier`, `metadata`, `note`. Restituisce `201` con `id` (`agt_`), `version`, `row_version`, `status` e `projection_status`; avvia le Session quando `projection_status` è `ready`. I tool `web_search` devono usare `mode: "disabled"` e i risultati di funzioni lato client (`requires_action`) non sono supportati.

### GET /v1/agents — Elencare gli Agent {#get-v1-agents-—-list-agents}

Query `status` (`active` predefinito, `archived`, `all`) più la paginazione a cursore.

### GET /v1/agents/{agent_id} — Ottenere un Agent {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — Aggiornare un Agent (stile SDK) {#post-v1-agents-agent-id-—-update-agent-sdk-style}

Aggiornamento parziale di `name`, `instructions`, `model`, `metadata`, `service_tier`, `tools`, `text`, `reasoning`, `runtime_profile`, `mcp_connections`, `skills`. Senza `row_version`; crea una nuova versione.

### PATCH /v1/agents/{agent_id} — Aggiornare un Agent (compare-and-set) {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

Stessi campi più `description` e `note`; `row_version` è obbligatorio. Un `null` esplicito restituisce 400.

### Versioni, archiviazione, ripristino, catalogo {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` e `GET /v1/agents/{agent_id}/versions/{version}` leggono snapshot immutabili.

- `POST /v1/agents/{agent_id}/archive` e `POST /v1/agents/{agent_id}/unarchive` accettano `{"row_version"}`. Anche `DELETE /v1/agents/{agent_id}` archivia.

- `POST /v1/agents/{agent_id}/restore` accetta `{"source_version","row_version"}`.

- `GET /v1/agents/catalog` elenca gli Agent pubblici; `POST /v1/agents/catalog/{agent_id}/clone` ne copia uno nella tua organizzazione (`201`, nuovo `agt_`).

---

## Sessions {#sessions}

Una Session esegue una versione salvata di un Agent. I percorsi si trovano sotto `/v1/agents/sessions`. La versione dell'Agent, le versioni delle Skill e le connessioni MCP vengono congelate alla creazione.

### POST /v1/agents/sessions — Creare una Session {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

Invia `agent_id` (Agent salvato), `agent` (Agent inline o override per singola Session di `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` e `multi_agent`), oppure entrambi. Facoltativi: `version` (solo per Agent salvati), `title`, `input` (una stringa, o un array con esattamente un messaggio user contenente una sola parte `input_text`), `model` o `agent.model`, `metadata`, `model_provider` (`{"type":"custom","base_url":"https://...","api_key":"..."}`; se omesso viene usata la chiave della chiamata). `stream: true` con un `input` non vuoto restituisce `201` come stream di Server-Sent Events del primo turno, a partire da `agent.session.created`. Le Session vengono sempre eseguite nel cloud gestito di SandBase, quindi non c'è un ambiente da scegliere; l'SDK OpenAI richiede comunque `environment={"type": "openai_hosted"}`. Restituisce `201` con `status` (`idle`, `in_progress`, `failed`), `lifecycle_status` (`active`, `archived`), `failure`, `source` (`direct`, `service`, `schedule`) e `row_version`.

### GET /v1/agents/sessions/{session_id}/events — Stream degli eventi (SSE) {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

Solo in tempo reale. Aprilo prima di inviare l'input. `Last-Event-ID` o `after` restituiscono 400; gli eventi non vengono riprodotti. I valori `type` degli eventi iniziano con `agent.session.`.

### POST /v1/agents/sessions/{session_id}/events — Inviare input {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

Esattamente un evento per richiesta: `agent.session.input.message` o `agent.session.input.cancel`. Restituisce `202` senza corpo. Forma estesa: `{"input": "...", "file_ids": ["fil_..."]}` (fino a 10 allegati pronti). `409 session_input_pending` significa che un input precedente è ancora in consegna; attendi e non reinviarlo con una nuova chiave.

### Cronologia e altre operazioni sulle Session {#history-and-other-session-operations}

- `GET /v1/agents/sessions` (query `lifecycle_status`, `agent_id`), `GET /v1/agents/sessions/{session_id}`.

- `GET /v1/agents/sessions/{session_id}/items`, `GET /v1/agents/sessions/{session_id}/turns` e `GET /v1/agents/sessions/{session_id}/turns/{turn_id}` leggono la cronologia.

- `POST /v1/agents/sessions/{session_id}` sostituisce `metadata`; `PATCH /v1/agents/sessions/{session_id}` rinomina con `{"title","row_version"}`.

- `POST /v1/agents/sessions/{session_id}/cancel` (richiede `Idempotency-Key`) annulla il turno in esecuzione.

- `DELETE /v1/agents/sessions/{session_id}` archivia; `POST /v1/agents/sessions/{session_id}/unarchive` ripristina.

- `POST /v1/agents/sessions/{session_id}/files` carica un allegato (multipart `file`, 5 MiB, `Idempotency-Key` obbligatorio).

- `POST /v1/agents/sessions/{session_id}/reconnect` restituisce `stream_url` per `GET /v1/agents/sessions/{session_id}/events/stream`, che invia `session.snapshot` e poi gli eventi in tempo reale.

---

### File del workspace e artifact di output {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files` elenca i metadati dei file attuali sotto `path` (predefinito `/workspace`). Query `limit` (1-100, predefinito 20), `order` (`asc` predefinito o `desc`) e `page` (il cursore `next` precedente). Restituisce `{object:"page", data:[{path,size_bytes}], next, has_more}`. Con un cursore non valido devi ripartire dalla prima pagina.
- `GET /v1/agents/sessions/{session_id}/artifacts` elenca gli output immutabili acquisiti sotto `/workspace/outputs/`. Query `limit` (predefinito 20), `order` (`desc` predefinito) e `after` (usa `last_id` quando `has_more` è true).
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` scarica un artifact completo usando l'ID opaco `art_` restituito. I download hanno un limite di 200 MiB; `Range` non è supportato (`416`). Metadati del workspace, allegati caricati e artifact acquisiti sono risorse separate.

---

## Skill, connessioni MCP e Secret {#skills-mcp-connections-and-secrets}

### POST /v1/skills — Creare una Skill {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

Una parte ZIP `files` (5 MiB). Lo ZIP deve contenere una sola cartella di primo livello con `SKILL.md` al suo interno (frontmatter `name` e `description`), ad esempio `zip -r release-notes.zip release-notes/`; un `SKILL.md` nella radice dello ZIP restituisce `400 invalid_request`. Una Skill referenziata da una qualsiasi versione di Agent (inclusi gli Agent archiviati) non può essere eliminata (`409`); disabilitala invece con `POST /v1/skills/{skill_id}` e `{"status": "disabled"}`. Restituisce `201` con `id` (`skl_`) e `default_version`. Aggiungi versioni con `POST /v1/skills/{skill_id}/versions`; elencale con `GET /v1/skills`. Referenziala da un Agent come `{"skill_id": "skl_...", "version": null}`.

### POST /v1/mcp-connections — Registrare un server MCP {#post-v1-mcp-connections-—-register-an-mcp-server}

Corpo `{"name", "server_url" (HTTPS), "secret_id"?}`; `Idempotency-Key` obbligatorio. Referenziala in `mcp_connections` di un Agent. Disabilitarla blocca nuove Session e ulteriori input.

### POST /v1/secrets — Salvare un Bearer token MCP {#post-v1-secrets-—-store-an-mcp-bearer-token}

Corpo `{"name", "kind": "mcp_bearer", "server_url", "token"}`; `Idempotency-Key` obbligatorio. Il token è di sola scrittura e legato a quell'URL esatto. I Secret non sono variabili d'ambiente. Ruotalo con `POST /v1/secrets/{secret_id}/rotate`; revocalo con `DELETE /v1/secrets/{secret_id}` (204).

---

## Fatturazione e costi {#billing-cost}

### Come vengono calcolati i costi {#how-costs-are-calculated}

- Leggi la formula di prezzo attuale e le unità del modello selezionato dal suo `model_card`.
- I modelli con prezzo a token possono includere componenti di input, output, cache o ragionamento, se dichiarate.
- I modelli di media e gli altri modelli possono usare unità per richiesta, per durata, per risoluzione o altre unità specifiche del modello.
- Le API di dati (ricerca, social, scraping, e-commerce, finanza) includono 100 chiamate gratuite per organizzazione per giorno UTC, condivise tra le API di dati idonee e azzerate alle 00:00 UTC. Le chiamate successive vengono fatturate per chiamata; non vengono rifiutate. Le organizzazioni con saldo zero possono comunque usare le chiamate gratuite.
- Non idonei: LLM, modelli di media e API di dati più costose o con prezzo a formula (ad esempio alcuni endpoint batch, crawl, Xiaohongshu PGY e i percorsi Douyin Xingtu `kol-*`), che vengono fatturati dalla prima chiamata. Per verificarlo, controlla `pricing.free_quota` in `sandbase_inspect`.
- MCP: `sandbase_inspect` mostra `pricing.free_quota` sui tool idonei; `sandbase_account` restituisce `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`); i risultati conclusi di `sandbase_run` e `sandbase_run_get` includono `free_quota_status` (`free`, `overage` o `degraded`).
- Quando un'operazione fatturabile restituisce un ID task (anche tramite l'header di risposta `x-task-id`), usa `GET /v1/tasks/{task_id}/cost` per addebito e utilizzo.
- Per le risposte asincrone di `POST /v1/run`, interroga il risultato della generazione con `GET /v1/run/{id}`; un ID di run non è un ID task e non va inviato all'endpoint dei costi.

### Controllo del budget {#budget-control}

- Imposta un limite di spesa facoltativo quando crei o modifichi una chiave standard in [Developer → API Keys](https://www.sandbase.ai/console/keys).
- Monitora richieste e costi in **Developer → Activities → Usage**.
- Controlla il saldo e le transazioni di credito in [Developer → Billing](https://www.sandbase.ai/console/billing).

---

## Vedi anche {#see-also}

- [Modelli e prezzi](./models): scoperta dei modelli aggiornata, funzionalità e indicazioni sui prezzi
- [Guida agli errori](./errors): forme di risposta documentate, gestione HTTP e sicurezza dei retry
- [Specifica OpenAPI](https://www.sandbase.ai/docs/openapi.yaml): schema leggibile dalle macchine


## Versioni delle Skill collegate agli Agent {#agent-skill-version-bindings}

Salvando un Agent, ogni nuovo riferimento a una Skill viene fissato a una versione esplicita. Per un nuovo collegamento, `version: null` seleziona la versione predefinita attuale al momento del salvataggio. Per un collegamento esistente, `version: null` mantiene la versione fissata. Cambiare la versione predefinita di una Skill non aggiorna gli Agent salvati né le Session esistenti; salva una versione esplicita sull'Agent per aggiornare le Session future.
