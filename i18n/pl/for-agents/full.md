---
i18nSource: e566962f42a5f6b0
title: Przewodnik po API SandBase dla AI
description: Rozszerzony przewodnik po API SandBase dla agentów AI z podstawowymi przepływami pracy, przykładami żądań i odnośnikami do wiążącej specyfikacji OpenAPI.
---

# Przewodnik po API dla AI {#ai-api-guide}

::: info Kontrakt Session
Session (`ses_*`) uruchamia jedną zapisaną wersję Agenta i jest tworzona bezpośrednio przez `POST /v1/agents/sessions`. Wewnętrzne identyfikatory Runtime Session nie są udostępniane.
:::

> Jednostronicowy przewodnik po najczęstszych przepływach pracy z API. Pełny kontrakt w formie czytelnej maszynowo znajdziesz w [specyfikacji OpenAPI](https://www.sandbase.ai/docs/openapi.yaml). Wersja tekstowa: [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt).

## Uwierzytelnianie {#authentication}

Wszystkie żądania wymagają:

```
Authorization: Bearer sk-YOUR_KEY
```

Bazowy URL: `https://api.sandbase.ai/v1`

---

## Terminologia {#terminology}

| Termin | Znaczenie |
|------|---------|
| **Task** | Rozliczany rekord wykonania operacji, takich jak inferencja modelu. Nie każda operacja API go tworzy. |
| **Run** | Żądanie generowania mediów przez `POST /v1/run`. Może być synchroniczne lub asynchroniczne. Odpytuj przez `GET /v1/run/{id}`. |
| **Session** | Wykonanie Agenta przez `POST /v1/agents/sessions`, zawierające rozmowę, aktywność narzędzi i wyjście. Odpytuj przez `GET /v1/agents/sessions/{session_id}`. |
> **run a session**: „run” modelu (`/v1/run`) to zadanie generowania przez model. „Session” (`/v1/agents/sessions`) to wykonanie Agenta. Wszystkie identyfikatory są nieprzezroczyste i nie wolno ich parsować.
>
> **task a run**: „run” lub „session” to wysyłane przez Ciebie żądanie; „task” to rozliczany rekord wykonania. Gdy operacja zwraca identyfikator zadania,
> użyj `GET /v1/tasks/{task_id}/cost`. Nie każda operacja API tworzy zadanie.

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

Zgodne z OpenAI. Obsługa strumieniowania, narzędzi, obrazu, rozumowania i ustrukturyzowanego wyjścia zależy od wybranego modelu i jego zadeklarowanego schematu.

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

**Odpowiedź:**

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

> Niektóre rozliczane operacje mogą zwracać `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc`; jeśli występuje, użyj go do odpytania
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost`.

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

Messages API zgodne z Anthropic. Buforowanie i inne opcjonalne funkcje zależą od wybranego modelu i schematu żądania.

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

**Odpowiedź:**

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

## Generowanie obrazów {#image-generation}

### POST /v1/run {#post-v1-run}

Endpoint `/v1/run` to **ujednolicony endpoint generowania** — pole `model` określa typ wyjścia (obraz, wideo lub audio).

> **Jak obsłużyć odpowiedź:** sprawdź pole `status`.
> - `"completed"` → wyniki są w `outputs`, gotowe.
> - `"pending"` lub `"running"` → odpytuj `GET /v1/run/{id}` co 2–5 s, aż do statusu końcowego (`completed`, `failed` lub `timeout`).

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

**Odpowiedź (synchroniczna):**

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

## Generowanie wideo {#video-generation}

### POST /v1/run {#post-v1-run-1}

Sprawdź `execution_mode` wybranego modelu. Gdy zgłoszenie zwraca `pending` lub `running`, odpytuj `GET /v1/run/{id}` aż do statusu końcowego.

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

**Odpowiedź (asynchroniczna — początkowa):**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**Odpytywanie statusu: `GET /v1/run/{id}`**

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

## Audio (zamiana tekstu na mowę) {#audio-text-to-speech}

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

**Odpowiedź:**

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

## Lista modeli {#list-models}

### GET /v1/models {#get-v1-models}

Zwraca włączone modele logiczne w formacie listy modeli zgodnym z OpenAI. Endpoint nie jest paginowany i
domyślnie używa `type=llm`. Szczegółowe możliwości i ceny są celowo pominięte.

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Odpowiedź zawiera `object: "list"` i tablicę `data`. Każdy element zawiera `id`, `object`, `created` i
`owned_by`; używaj `id` jako logicznej nazwy modelu. Metadane możliwości i cen pobierzesz, odczytując ten model.

---

## Pobieranie modelu {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Odpowiedź ze szczegółami dodaje `unified_schema`, `supported_modes` i `model_card`. Szczegółowe ceny znajdują się w
`model_card`; nie ma obiektu `pricing` na najwyższym poziomie.

---

## Pobieranie kosztu zadania {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

Sprawdź zarejestrowany koszt zadania za pomocą identyfikatora zadania zwróconego przez operację API.

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Odpowiedź:**

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

## Konwencje platformy Agents {#agents-platform-conventions}

- Bazowy URL `https://api.sandbase.ai/v1`. Wysyłaj `Authorization: Bearer sk-YOUR_KEY` lub `X-API-Key: sk-YOUR_KEY` (tę samą wartość, jeśli wysyłasz oba). `OpenAI-Beta` jest opcjonalny; jeśli zostanie wysłany, musi mieć wartość `agents=v1`. Oficjalny OpenAI SDK (`client.beta.agents`, `client.skills`) działa z `base_url="https://api.sandbase.ai/v1"`; różnice opisano w [Zgodność z OpenAI](/agents/openai-compatibility).

- Treści to ścisły JSON o rozmiarze do 1 MiB; nieznane pola zwracają 400.

- Błędy: `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`. Rozgałęziaj logikę według `code`; zobacz [Przewodnik po błędach](./errors#agents-platform-errors).

- `row_version` to token compare-and-set dla PATCH, archive, restore i rotate. Po 409 odczytaj zasób ponownie.

- Listy kursorowe (Agents, Sessions, items, turns, Skills): `limit` 1-100, `after`, `order`; odpowiedź `{object:"list", data, has_more, first_id, last_id}`.

- Listy offsetowe (wersje Agenta, załączniki, połączenia MCP, Secrets): `limit`, `offset`; odpowiedź `{data, total, limit, offset}`.

- Identyfikatory: Agent `agt_`, Session `ses_`, Skill `skl_`, połączenie MCP `mcp_`, Secret `sec_`, załącznik `fil_`. Traktuj je jako nieprzezroczyste.

---

## Agents {#agents}

### POST /v1/agents — Utworzenie Agenta {#post-v1-agents-—-create-agent}

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

Wymagane: `model`. Opcjonalne: `name`, `instructions`, `description`, `runtime_profile` (domyślnie `codex`, `claude`, `mcode`), `skills` (`[{"skill_id","version"}]`), `mcp_connections` (`[{"connection_id","server_label","allowed_tools","required"}]`), `tools`, `text`, `reasoning`, `service_tier`, `metadata`, `note`. Zwraca `201` z `id` (`agt_`), `version`, `row_version`, `status` i `projection_status`; uruchamiaj Sessions, gdy `projection_status` ma wartość `ready`. Narzędzia `web_search` muszą używać `mode: "disabled"`, a wyniki funkcji po stronie klienta (`requires_action`) nie są obsługiwane.

### GET /v1/agents — Lista Agents {#get-v1-agents-—-list-agents}

Zapytanie `status` (domyślnie `active`, `archived`, `all`) oraz paginacja kursorowa.

### GET /v1/agents/{agent_id} — Pobranie Agenta {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — Aktualizacja Agenta (styl SDK) {#post-v1-agents-agent-id-—-update-agent-sdk-style}

Częściowa aktualizacja `name`, `instructions`, `model`, `metadata`, `service_tier`, `tools`, `text`, `reasoning`, `runtime_profile`, `mcp_connections`, `skills`. Bez `row_version`; tworzy nową wersję.

### PATCH /v1/agents/{agent_id} — Aktualizacja Agenta (compare-and-set) {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

Te same pola oraz `description` i `note`; `row_version` jest wymagany. Jawne `null` zwraca 400.

### Wersje, archiwizacja, przywracanie, katalog {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` i `GET /v1/agents/{agent_id}/versions/{version}` odczytują niezmienne migawki.

- `POST /v1/agents/{agent_id}/archive` i `POST /v1/agents/{agent_id}/unarchive` przyjmują `{"row_version"}`. `DELETE /v1/agents/{agent_id}` również archiwizuje.

- `POST /v1/agents/{agent_id}/restore` przyjmuje `{"source_version","row_version"}`.

- `GET /v1/agents/catalog` wyświetla publiczne Agents; `POST /v1/agents/catalog/{agent_id}/clone` kopiuje jednego z nich do Twojej organizacji (`201`, nowy `agt_`).

---

## Sessions {#sessions}

Session uruchamia jedną zapisaną wersję Agenta. Ścieżki znajdują się pod `/v1/agents/sessions`. Wersja Agenta, wersje Skills i połączenia MCP są zamrażane przy tworzeniu.

### POST /v1/agents/sessions — Utworzenie Session {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

Wyślij `agent_id` (zapisany Agent), `agent` (Agent inline lub nadpisania dla danej Session pól `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` i `multi_agent`) albo oba. Opcjonalne: `version` (tylko zapisane Agents), `title`, `input` (ciąg znaków lub tablica z dokładnie jedną wiadomością użytkownika zawierającą jedną część `input_text`), `model` lub `agent.model`, `metadata`, `model_provider` (`{"type":"custom","base_url":"https://...","api_key":"..."}`; pominięcie oznacza użycie klucza wywołującego). `stream: true` z niepustym `input` zwraca `201` jako strumień Server-Sent Events pierwszej tury, zaczynający się od `agent.session.created`. Sessions zawsze działają w hostowanej chmurze SandBase, więc nie wybiera się środowiska; OpenAI SDK nadal wymaga `environment={"type": "openai_hosted"}`. Zwraca `201` z `status` (`idle`, `in_progress`, `failed`), `lifecycle_status` (`active`, `archived`), `failure`, `source` (`direct`, `service`, `schedule`) i `row_version`.

### GET /v1/agents/sessions/{session_id}/events — Strumień zdarzeń (SSE) {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

Tylko na żywo. Otwórz go przed wysłaniem wejścia. `Last-Event-ID` lub `after` zwraca 400; zdarzenia nie są odtwarzane. Wartości `type` zdarzeń zaczynają się od `agent.session.`.

### POST /v1/agents/sessions/{session_id}/events — Wysłanie wejścia {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

Dokładnie jedno zdarzenie na żądanie: `agent.session.input.message` lub `agent.session.input.cancel`. Zwraca `202` bez treści. Forma rozszerzona: `{"input": "...", "file_ids": ["fil_..."]}` (do 10 gotowych załączników). `409 session_input_pending` oznacza, że wcześniejsze wejście jest wciąż dostarczane; poczekaj i nie wysyłaj ponownie z nowym kluczem.

### Historia i inne operacje na Session {#history-and-other-session-operations}

- `GET /v1/agents/sessions` (zapytanie `lifecycle_status`, `agent_id`), `GET /v1/agents/sessions/{session_id}`.

- `GET /v1/agents/sessions/{session_id}/items`, `GET /v1/agents/sessions/{session_id}/turns` i `GET /v1/agents/sessions/{session_id}/turns/{turn_id}` odczytują historię.

- `POST /v1/agents/sessions/{session_id}` zastępuje `metadata`; `PATCH /v1/agents/sessions/{session_id}` zmienia nazwę za pomocą `{"title","row_version"}`.

- `POST /v1/agents/sessions/{session_id}/cancel` (wymaga `Idempotency-Key`) anuluje trwającą turę.

- `DELETE /v1/agents/sessions/{session_id}` archiwizuje; `POST /v1/agents/sessions/{session_id}/unarchive` przywraca.

- `POST /v1/agents/sessions/{session_id}/files` przesyła jeden załącznik (multipart `file`, 5 MiB, wymagany `Idempotency-Key`).

- `POST /v1/agents/sessions/{session_id}/reconnect` zwraca `stream_url` dla `GET /v1/agents/sessions/{session_id}/events/stream`, który wysyła `session.snapshot`, a potem zdarzenia na żywo.

---

### Pliki obszaru roboczego i artefakty wyjściowe {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files` wyświetla metadane bieżących plików pod `path` (domyślnie `/workspace`). Zapytanie: `limit` (1-100, domyślnie 20), `order` (domyślnie `asc` lub `desc`) i `page` (poprzedni kursor `next`). Zwraca `{object:"page", data:[{path,size_bytes}], next, has_more}`. Nieprawidłowy kursor wymaga rozpoczęcia od pierwszej strony.
- `GET /v1/agents/sessions/{session_id}/artifacts` wyświetla niezmienne wyniki przechwycone w `/workspace/outputs/`. Zapytanie: `limit` (domyślnie 20), `order` (domyślnie `desc`) i `after` (użyj `last_id`, gdy `has_more` ma wartość true).
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` pobiera cały artefakt za pomocą zwróconego nieprzezroczystego identyfikatora `art_`. Pobieranie ma limit 200 MiB; `Range` nie jest obsługiwany (`416`). Metadane obszaru roboczego, przesłane załączniki i przechwycone artefakty to oddzielne zasoby.

---

## Skills, połączenia MCP i Secrets {#skills-mcp-connections-and-secrets}

### POST /v1/skills — Utworzenie Skill {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

Jedna część ZIP `files` (5 MiB). ZIP musi zawierać jeden folder najwyższego poziomu z plikiem `SKILL.md` (frontmatter z `name` i `description`), na przykład `zip -r release-notes.zip release-notes/`; `SKILL.md` w katalogu głównym ZIP zwraca `400 invalid_request`. Skill, do którego odwołuje się jakakolwiek wersja Agenta (także zarchiwizowanego), nie może zostać usunięty (`409`); zamiast tego wyłącz go przez `POST /v1/skills/{skill_id}` z `{"status": "disabled"}`. Zwraca `201` z `id` (`skl_`) i `default_version`. Wersje dodawaj przez `POST /v1/skills/{skill_id}/versions`; listę pobierzesz przez `GET /v1/skills`. W Agencie odwołuj się do niego jako `{"skill_id": "skl_...", "version": null}`.

### POST /v1/mcp-connections — Rejestracja serwera MCP {#post-v1-mcp-connections-—-register-an-mcp-server}

Treść `{"name", "server_url" (HTTPS), "secret_id"?}`; wymagany `Idempotency-Key`. Odwołuj się do niego w `mcp_connections` Agenta. Wyłączenie blokuje nowe Sessions i dalsze wejście.

### POST /v1/secrets — Zapisanie tokena Bearer MCP {#post-v1-secrets-—-store-an-mcp-bearer-token}

Treść `{"name", "kind": "mcp_bearer", "server_url", "token"}`; wymagany `Idempotency-Key`. Token jest tylko do zapisu i powiązany z tym konkretnym URL. Secrets nie są zmiennymi środowiskowymi. Rotacja przez `POST /v1/secrets/{secret_id}/rotate`; unieważnienie przez `DELETE /v1/secrets/{secret_id}` (204).

---

## Rozliczenia i koszty {#billing-cost}

### Jak obliczane są koszty {#how-costs-are-calculated}

- Odczytaj aktualną formułę cenową i jednostki wybranego modelu z jego `model_card`.
- Modele rozliczane za tokeny mogą zawierać składniki wejścia, wyjścia, cache lub rozumowania, jeśli zostały zadeklarowane.
- Modele mediów i inne mogą używać jednostek za żądanie, czas trwania, rozdzielczość lub innych jednostek specyficznych dla modelu.
- Data APIs (wyszukiwanie, media społecznościowe, scrapowanie, e-commerce, finanse) obejmują 100 darmowych wywołań na organizację na dobę UTC, współdzielonych przez kwalifikujące się Data APIs i resetowanych o 00:00 UTC. Kolejne wywołania są rozliczane za każde wywołanie; nie są odrzucane. Organizacje z zerowym saldem nadal mogą korzystać z darmowych wywołań.
- Nie kwalifikują się: LLM, modele mediów oraz droższe lub wyceniane formułą Data APIs (np. niektóre endpointy wsadowe, crawl, Xiaohongshu PGY i trasy Douyin Xingtu `kol-*`), które są rozliczane od pierwszego wywołania. Sprawdzianem jest `pricing.free_quota` w `sandbase_inspect`.
- MCP: `sandbase_inspect` pokazuje `pricing.free_quota` dla kwalifikujących się narzędzi; `sandbase_account` zwraca `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`); rozliczone wyniki `sandbase_run` i `sandbase_run_get` zawierają `free_quota_status` (`free`, `overage` lub `degraded`).
- Gdy rozliczana operacja zwraca identyfikator zadania (także w nagłówku odpowiedzi `x-task-id`), użyj `GET /v1/tasks/{task_id}/cost`, aby uzyskać rozliczenie i użycie.
- W przypadku asynchronicznych odpowiedzi `POST /v1/run` odpytuj wynik generowania przez `GET /v1/run/{id}`; identyfikator run nie jest identyfikatorem zadania i nie wolno wysyłać go do endpointu kosztów.

### Kontrola budżetu {#budget-control}

- Ustaw opcjonalny limit wydatków podczas tworzenia lub edycji standardowego klucza w [Developer → API Keys](https://www.sandbase.ai/console/keys).
- Monitoruj żądania i koszty w **Developer → Activities → Usage**.
- Saldo i transakcje kredytowe sprawdzisz w [Developer → Billing](https://www.sandbase.ai/console/billing).

---

## Zobacz także {#see-also}

- [Modele i ceny](./models) — aktualne wyszukiwanie modeli, możliwości i wskazówki cenowe
- [Przewodnik po błędach](./errors) — udokumentowane kształty odpowiedzi, obsługa HTTP i bezpieczeństwo ponowień
- [Specyfikacja OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) — schemat czytelny maszynowo


## Powiązania wersji Skill w Agencie {#agent-skill-version-bindings}

Zapisanie Agenta przypina każde nowe odwołanie do Skill do jawnej wersji. Dla nowego powiązania `version: null` wybiera bieżącą wersję domyślną w momencie zapisu. Dla istniejącego powiązania `version: null` zachowuje przypiętą wersję. Zmiana domyślnej wersji Skill nie aktualizuje zapisanych Agents ani istniejących Sessions; aby zaktualizować przyszłe Sessions, zapisz w Agencie jawną wersję.
