---
i18nSource: e566962f42a5f6b0
title: SandBase-Leitfaden zur AI API
description: Erweiterter SandBase-API-Leitfaden für KI-Agents mit zentralen Workflows, Anfragebeispielen und Links zur maßgeblichen OpenAPI-Spezifikation.
---

# Leitfaden zur AI API {#ai-api-guide}

::: info Session-Vertrag
Eine Session (`ses_*`) führt eine gespeicherte Agent-Version aus und wird direkt mit `POST /v1/agents/sessions` erstellt. Interne Runtime-Session-IDs werden nicht offengelegt.
:::

> Ein einseitiger Leitfaden zu den häufigsten API-Workflows. Den vollständigen maschinenlesbaren Vertrag findest du in der [OpenAPI-Spezifikation](https://www.sandbase.ai/docs/openapi.yaml). Klartextversion: [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt).

## Authentifizierung {#authentication}

Alle Anfragen erfordern:

```
Authorization: Bearer sk-YOUR_KEY
```

Base-URL: `https://api.sandbase.ai/v1`

---

## Begriffe {#terminology}

| Begriff | Bedeutung |
|------|---------|
| **Task** | Ein abrechenbarer Ausführungsdatensatz für Operationen wie Modellinferenz. Nicht jede API-Operation erzeugt einen. |
| **Run** | Eine Anfrage zur Mediengenerierung über `POST /v1/run`. Kann synchron oder asynchron sein. Abfragen mit `GET /v1/run/{id}`. |
| **Session** | Eine Agent-Ausführung über `POST /v1/agents/sessions`, die Unterhaltung, Tool-Aktivität und Ausgabe enthält. Abfragen mit `GET /v1/agents/sessions/{session_id}`. |
> **Run vs. Session**: Ein Modell-„Run“ (`/v1/run`) ist ein Task zur Modellgenerierung. Eine „Session“ (`/v1/agents/sessions`) ist eine Agent-Ausführung. Alle IDs sind opak und dürfen nicht geparst werden.
>
> **Task vs. Run**: Ein „Run“ oder eine „Session“ ist die Anfrage, die du stellst; ein „Task“ ist ein abrechenbarer Ausführungsdatensatz. Verwende
> `GET /v1/tasks/{task_id}/cost`, wenn eine Operation eine Task-ID zurückgibt. Nicht jede API-Operation erzeugt einen Task.

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

OpenAI-kompatibel. Die Unterstützung für Streaming, Tools, Vision, Reasoning und strukturierte Ausgabe hängt vom ausgewählten Modell und seinem deklarierten Schema ab.

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

**Antwort:**

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

> Manche abrechenbaren Operationen können `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc` zurückgeben; falls vorhanden, frage damit
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost` ab.

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

Anthropic-kompatible Messages API. Caching und andere optionale Features hängen vom ausgewählten Modell und Request-Schema ab.

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

**Antwort:**

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

## Bildgenerierung {#image-generation}

### POST /v1/run {#post-v1-run}

Der Endpunkt `/v1/run` ist ein **einheitlicher Generierungs-Endpunkt**: Das Feld `model` bestimmt den Ausgabetyp (Bild, Video oder Audio).

> **So behandelst du die Antwort:** Prüfe das Feld `status`.
> - `"completed"` → Ergebnisse stehen in `outputs`, fertig.
> - `"pending"` oder `"running"` → frage `GET /v1/run/{id}` alle 2–5 s ab, bis ein Endstatus erreicht ist (`completed`, `failed` oder `timeout`).

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

**Antwort (synchron):**

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

## Videogenerierung {#video-generation}

### POST /v1/run {#post-v1-run-1}

Prüfe den `execution_mode` des ausgewählten Modells. Wenn die Übermittlung `pending` oder `running` zurückgibt, frage `GET /v1/run/{id}` ab, bis ein Endstatus erreicht ist.

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

**Antwort (asynchron, initial):**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**Status abfragen: `GET /v1/run/{id}`**

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

**Antwort:**

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

## Modelle auflisten {#list-models}

### GET /v1/models {#get-v1-models}

Gibt aktivierte logische Modelle im OpenAI-kompatiblen Format für Modelllisten zurück. Der Endpunkt ist nicht paginiert und
verwendet standardmäßig `type=llm`. Detaillierte Fähigkeiten und Preise sind bewusst nicht enthalten.

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Die Antwort enthält `object: "list"` und ein Array `data`. Jedes Element enthält `id`, `object`, `created` und
`owned_by`; verwende `id` als logischen Modellnamen. Rufe dieses Modell ab, um Metadaten zu Fähigkeiten und Preisen zu erhalten.

---

## Modell abrufen {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Die Detailantwort ergänzt `unified_schema`, `supported_modes` und `model_card`. Detaillierte Preise stehen in
`model_card`; es gibt kein `pricing`-Objekt auf oberster Ebene.

---

## Task-Kosten abrufen {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

Prüfe die erfassten Kosten eines Tasks anhand der Task-ID, die die API-Operation zurückgegeben hat.

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Antwort:**

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

## Konventionen der Agents-Plattform {#agents-platform-conventions}

- Base-URL `https://api.sandbase.ai/v1`. Sende `Authorization: Bearer sk-YOUR_KEY` oder `X-API-Key: sk-YOUR_KEY` (bei beiden derselbe Wert). `OpenAI-Beta` ist optional; wenn gesendet, muss es `agents=v1` sein. Das offizielle OpenAI SDK (`client.beta.agents`, `client.skills`) funktioniert mit `base_url="https://api.sandbase.ai/v1"`; Unterschiede stehen unter [OpenAI-Kompatibilität](/agents/openai-compatibility).

- Bodies sind striktes JSON mit bis zu 1 MiB; unbekannte Felder ergeben 400.

- Fehler: `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`. Verzweige anhand von `code`; siehe den [Fehlerleitfaden](./errors#agents-platform-errors).

- `row_version` ist das Compare-and-set-Token für PATCH, archive, restore und rotate. Bei 409 erneut lesen.

- Cursor-Listen (Agents, Sessions, Items, Turns, Skills): `limit` 1–100, `after`, `order`; Antwort `{object:"list", data, has_more, first_id, last_id}`.

- Offset-Listen (Agent-Versionen, Anhänge, MCP-Verbindungen, Secrets): `limit`, `offset`; Antwort `{data, total, limit, offset}`.

- IDs: Agent `agt_`, Session `ses_`, Skill `skl_`, MCP-Verbindung `mcp_`, Secret `sec_`, Anhang `fil_`. Behandle sie als opak.

---

## Agents {#agents}

### POST /v1/agents — Agent erstellen {#post-v1-agents-—-create-agent}

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

Pflicht: `model`. Optional: `name`, `instructions`, `description`, `runtime_profile` (Standard `codex`, `claude`, `mcode`), `skills` (`[{"skill_id","version"}]`), `mcp_connections` (`[{"connection_id","server_label","allowed_tools","required"}]`), `tools`, `text`, `reasoning`, `service_tier`, `metadata`, `note`. Gibt `201` mit `id` (`agt_`), `version`, `row_version`, `status` und `projection_status` zurück; starte Sessions, sobald `projection_status` den Wert `ready` hat. `web_search`-Tools müssen `mode: "disabled"` verwenden, und clientseitige Funktionsergebnisse (`requires_action`) werden nicht unterstützt.

### GET /v1/agents — Agents auflisten {#get-v1-agents-—-list-agents}

Query `status` (Standard `active`, `archived`, `all`) plus Cursor-Paginierung.

### GET /v1/agents/{agent_id} — Agent abrufen {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — Agent aktualisieren (SDK-Stil) {#post-v1-agents-agent-id-—-update-agent-sdk-style}

Teilaktualisierung von `name`, `instructions`, `model`, `metadata`, `service_tier`, `tools`, `text`, `reasoning`, `runtime_profile`, `mcp_connections`, `skills`. Ohne `row_version`; erzeugt eine neue Version.

### PATCH /v1/agents/{agent_id} — Agent aktualisieren (Compare-and-set) {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

Dieselben Felder plus `description` und `note`; `row_version` ist erforderlich. Explizites `null` ergibt 400.

### Versionen, Archivierung, Wiederherstellung, Katalog {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` und `GET /v1/agents/{agent_id}/versions/{version}` lesen unveränderliche Snapshots.

- `POST /v1/agents/{agent_id}/archive` und `POST /v1/agents/{agent_id}/unarchive` erwarten `{"row_version"}`. `DELETE /v1/agents/{agent_id}` archiviert ebenfalls.

- `POST /v1/agents/{agent_id}/restore` erwartet `{"source_version","row_version"}`.

- `GET /v1/agents/catalog` listet öffentliche Agents auf; `POST /v1/agents/catalog/{agent_id}/clone` kopiert einen in deine Organisation (`201`, neue `agt_`).

---

## Sessions {#sessions}

Eine Session führt eine gespeicherte Agent-Version aus. Die Pfade liegen unter `/v1/agents/sessions`. Agent-Version, Skill-Versionen und MCP-Verbindungen werden beim Erstellen eingefroren.

### POST /v1/agents/sessions — Session erstellen {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

Sende `agent_id` (gespeicherter Agent), `agent` (Inline-Agent oder Überschreibungen pro Session für `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` und `multi_agent`) oder beides. Optional: `version` (nur gespeicherte Agents), `title`, `input` (ein String oder ein Array mit genau einer User-Message, die genau einen `input_text`-Part enthält), `model` oder `agent.model`, `metadata`, `model_provider` (`{"type":"custom","base_url":"https://...","api_key":"..."}`; fehlt es, wird dein aufrufender Key verwendet). `stream: true` mit nicht leerem `input` gibt `201` als Server-Sent-Events-Stream des ersten Turns zurück, beginnend mit `agent.session.created`. Sessions laufen immer in der gehosteten Cloud von SandBase, daher gibt es keine Umgebung zur Auswahl; das OpenAI SDK verlangt trotzdem `environment={"type": "openai_hosted"}`. Gibt `201` mit `status` (`idle`, `in_progress`, `failed`), `lifecycle_status` (`active`, `archived`), `failure`, `source` (`direct`, `service`, `schedule`) und `row_version` zurück.

### GET /v1/agents/sessions/{session_id}/events — Events streamen (SSE) {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

Nur live. Öffne den Stream, bevor du Eingaben sendest. `Last-Event-ID` oder `after` ergeben 400; Events werden nicht erneut gesendet. Werte von `type` beginnen mit `agent.session.`.

### POST /v1/agents/sessions/{session_id}/events — Eingabe senden {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

Genau ein Event pro Anfrage: `agent.session.input.message` oder `agent.session.input.cancel`. Gibt `202` ohne Body zurück. Erweiterte Form: `{"input": "...", "file_ids": ["fil_..."]}` (bis zu 10 bereite Anhänge). `409 session_input_pending` bedeutet, dass eine frühere Eingabe noch zugestellt wird; warte und sende nicht erneut mit einem neuen Key.

### Verlauf und weitere Session-Operationen {#history-and-other-session-operations}

- `GET /v1/agents/sessions` (Query `lifecycle_status`, `agent_id`), `GET /v1/agents/sessions/{session_id}`.

- `GET /v1/agents/sessions/{session_id}/items`, `GET /v1/agents/sessions/{session_id}/turns` und `GET /v1/agents/sessions/{session_id}/turns/{turn_id}` lesen den Verlauf.

- `POST /v1/agents/sessions/{session_id}` ersetzt `metadata`; `PATCH /v1/agents/sessions/{session_id}` benennt mit `{"title","row_version"}` um.

- `POST /v1/agents/sessions/{session_id}/cancel` (erfordert `Idempotency-Key`) bricht den laufenden Turn ab.

- `DELETE /v1/agents/sessions/{session_id}` archiviert; `POST /v1/agents/sessions/{session_id}/unarchive` stellt wieder her.

- `POST /v1/agents/sessions/{session_id}/files` lädt einen Anhang hoch (Multipart `file`, 5 MiB, `Idempotency-Key` erforderlich).

- `POST /v1/agents/sessions/{session_id}/reconnect` gibt `stream_url` für `GET /v1/agents/sessions/{session_id}/events/stream` zurück, das `session.snapshot` und danach Live-Events sendet.

---

### Workspace-Dateien und Ausgabe-Artifacts {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files` listet aktuelle Datei-Metadaten unter `path` auf (Standard `/workspace`). Query `limit` (1–100, Standard 20), `order` (Standard `asc` oder `desc`) und `page` (der vorherige `next`-Cursor). Gibt `{object:"page", data:[{path,size_bytes}], next, has_more}` zurück. Bei einem ungültigen Cursor musst du wieder bei Seite eins beginnen.
- `GET /v1/agents/sessions/{session_id}/artifacts` listet unveränderliche Ausgaben auf, die unter `/workspace/outputs/` erfasst wurden. Query `limit` (Standard 20), `order` (Standard `desc`) und `after` (verwende `last_id`, wenn `has_more` true ist).
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` lädt ein vollständiges Artifact anhand seiner zurückgegebenen opaken `art_`-ID herunter. Downloads sind auf 200 MiB begrenzt; `Range` wird nicht unterstützt (`416`). Workspace-Metadaten, hochgeladene Anhänge und erfasste Artifacts sind separate Ressourcen.

---

## Skills, MCP-Verbindungen und Secrets {#skills-mcp-connections-and-secrets}

### POST /v1/skills — Skill erstellen {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

Ein ZIP-Part `files` (5 MiB). Das ZIP muss einen Ordner auf oberster Ebene enthalten, in dem `SKILL.md` liegt (mit Frontmatter `name` und `description`), zum Beispiel `zip -r release-notes.zip release-notes/`; eine `SKILL.md` im Stammverzeichnis des ZIP ergibt `400 invalid_request`. Ein Skill, auf den eine beliebige Agent-Version verweist (auch bei archivierten Agents), kann nicht gelöscht werden (`409`); deaktiviere ihn stattdessen mit `POST /v1/skills/{skill_id}` und `{"status": "disabled"}`. Gibt `201` mit `id` (`skl_`) und `default_version` zurück. Versionen fügst du mit `POST /v1/skills/{skill_id}/versions` hinzu; auflisten mit `GET /v1/skills`. In einem Agent referenzierst du ihn als `{"skill_id": "skl_...", "version": null}`.

### POST /v1/mcp-connections — MCP-Server registrieren {#post-v1-mcp-connections-—-register-an-mcp-server}

Body `{"name", "server_url" (HTTPS), "secret_id"?}`; `Idempotency-Key` erforderlich. Referenziere die Verbindung in den `mcp_connections` eines Agents. Wird sie deaktiviert, sind neue Sessions und weitere Eingaben blockiert.

### POST /v1/secrets — MCP-Bearer-Token speichern {#post-v1-secrets-—-store-an-mcp-bearer-token}

Body `{"name", "kind": "mcp_bearer", "server_url", "token"}`; `Idempotency-Key` erforderlich. Das Token ist nur schreibbar und an genau diese URL gebunden. Secrets sind keine Umgebungsvariablen. Rotieren mit `POST /v1/secrets/{secret_id}/rotate`; widerrufen mit `DELETE /v1/secrets/{secret_id}` (204).

---

## Abrechnung und Kosten {#billing-cost}

### So werden Kosten berechnet {#how-costs-are-calculated}

- Lies die aktuelle Preisformel und die Einheiten des ausgewählten Modells aus seiner `model_card`.
- Modelle mit Token-Preisen können Input-, Output-, Cache- oder Reasoning-Anteile enthalten, sofern deklariert.
- Medien- und andere Modelle können Einheiten pro Anfrage, nach Dauer, Auflösung oder andere modellspezifische Einheiten verwenden.
- Daten-APIs (Suche, Social, Scraping, E-Commerce, Finanzen) enthalten 100 kostenlose Aufrufe pro Organisation und UTC-Tag, geteilt über alle berechtigten Daten-APIs und zurückgesetzt um 00:00 UTC. Spätere Aufrufe werden pro Aufruf abgerechnet, nicht abgelehnt. Organisationen mit einem Guthaben von null können die kostenlosen Aufrufe trotzdem nutzen.
- Nicht berechtigt: LLMs, Medienmodelle und teurere oder per Formel bepreiste Daten-APIs (zum Beispiel manche Batch-Endpunkte, Crawl, Xiaohongshu PGY und die Douyin-Xingtu-Routen `kol-*`), die ab dem ersten Aufruf abgerechnet werden. Maßgeblich ist `pricing.free_quota` in `sandbase_inspect`.
- MCP: `sandbase_inspect` zeigt `pricing.free_quota` bei berechtigten Tools; `sandbase_account` gibt `free_api_quota` zurück (`daily_limit`, `used_today`, `remaining`, `resets_at`); abgerechnete Ergebnisse von `sandbase_run` und `sandbase_run_get` enthalten `free_quota_status` (`free`, `overage` oder `degraded`).
- Wenn eine abrechenbare Operation eine Task-ID zurückgibt (auch im Response-Header `x-task-id`), verwende `GET /v1/tasks/{task_id}/cost` für Abrechnung und Nutzung.
- Bei asynchronen Antworten von `POST /v1/run` fragst du das Generierungsergebnis mit `GET /v1/run/{id}` ab; eine Run-ID ist keine Task-ID und darf nicht an den Kosten-Endpunkt gesendet werden.

### Budgetkontrolle {#budget-control}

- Lege beim Erstellen oder Bearbeiten eines Standard-Keys unter [Developer → API Keys](https://www.sandbase.ai/console/keys) optional ein Ausgabenlimit fest.
- Überwache Anfragen und Kosten unter **Developer → Activities → Usage**.
- Prüfe Guthaben und Credit-Transaktionen unter [Developer → Billing](https://www.sandbase.ai/console/billing).

---

## Siehe auch {#see-also}

- [Modelle und Preise](./models): Modelle aktuell finden, Fähigkeiten und Hinweise zu Preisen
- [Fehlerleitfaden](./errors): dokumentierte Antwortformen, HTTP-Behandlung und sichere Retries
- [OpenAPI-Spezifikation](https://www.sandbase.ai/docs/openapi.yaml): maschinenlesbares Schema


## Skill-Versionsbindungen von Agents {#agent-skill-version-bindings}

Beim Speichern eines Agents wird jede neue Skill-Referenz auf eine explizite Version gepinnt. Bei einer neuen Bindung wählt `version: null` den Standard zum Zeitpunkt des Speicherns. Bei einer bestehenden Bindung behält `version: null` die gepinnte Version. Eine Änderung des Skill-Standards aktualisiert weder gespeicherte Agents noch bestehende Sessions; speichere eine explizite Version am Agent, um künftige Sessions zu aktualisieren.
