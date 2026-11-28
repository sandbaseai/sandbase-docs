---
i18nSource: e566962f42a5f6b0
title: Руководство по API SandBase AI
description: "Расширенное руководство по API SandBase для AI-агентов: основные сценарии, примеры запросов и ссылки на эталонную спецификацию OpenAPI."
---

# Руководство по AI API {#ai-api-guide}

::: info Контракт сессии
Сессия (`ses_*`) запускает одну сохранённую версию Agent и создаётся напрямую через `POST /v1/agents/sessions`. Внутренние ID сессий Runtime не раскрываются.
:::

> Руководство на одной странице по самым распространённым сценариям работы с API. Полный машиночитаемый контракт см. в [спецификации OpenAPI](https://www.sandbase.ai/docs/openapi.yaml). Текстовая версия: [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt).

## Аутентификация {#authentication}

Все запросы требуют:

```
Authorization: Bearer sk-YOUR_KEY
```

Базовый URL: `https://api.sandbase.ai/v1`

---

## Терминология {#terminology}

| Термин | Значение |
|------|---------|
| **Task** | Тарифицируемая запись о выполнении таких операций, как инференс модели. Не каждая операция API создаёт её. |
| **Run** | Запрос генерации медиа через `POST /v1/run`. Может быть синхронным или асинхронным. Опрашивайте через `GET /v1/run/{id}`. |
| **Session** | Выполнение Agent через `POST /v1/agents/sessions`, содержащее диалог, активность инструментов и вывод. Запрашивайте через `GET /v1/agents/sessions/{session_id}`. |
> **run и session**: «run» модели (`/v1/run`) — это задача генерации моделью. «Session» (`/v1/agents/sessions`) — это выполнение Agent. Все ID непрозрачны, их нельзя разбирать.
>
> **task и run**: «run» или «session» — это ваш запрос; «task» — тарифицируемая запись о выполнении. Используйте
> `GET /v1/tasks/{task_id}/cost`, когда операция возвращает ID задачи. Не каждая операция API создаёт задачу.

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

Совместим с OpenAI. Поддержка потоковой передачи, инструментов, зрения, рассуждений и структурированного вывода зависит от выбранной модели и её объявленной схемы.

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

**Ответ:**

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

> Некоторые тарифицируемые операции могут возвращать `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc`; если он есть, используйте его для запроса
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost`.

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

Anthropic-совместимый Messages API. Кэширование и другие необязательные функции зависят от выбранной модели и схемы запроса.

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

**Ответ:**

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

## Генерация изображений {#image-generation}

### POST /v1/run {#post-v1-run}

Эндпоинт `/v1/run` — это **единый эндпоинт генерации**: поле `model` определяет тип вывода (изображение, видео или аудио).

> **Как обрабатывать ответ:** проверьте поле `status`.
> - `"completed"` → результаты в `outputs`, готово.
> - `"pending"` или `"running"` → опрашивайте `GET /v1/run/{id}` каждые 2–5 с до конечного статуса (`completed`, `failed` или `timeout`).

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

**Ответ (синхронный):**

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

## Генерация видео {#video-generation}

### POST /v1/run {#post-v1-run-1}

Проверьте `execution_mode` выбранной модели. Если отправка возвращает `pending` или `running`, опрашивайте `GET /v1/run/{id}` до конечного статуса.

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

**Ответ (асинхронный, начальный):**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**Опрос статуса: `GET /v1/run/{id}`**

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

## Аудио (синтез речи) {#audio-text-to-speech}

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

**Ответ:**

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

## Список моделей {#list-models}

### GET /v1/models {#get-v1-models}

Возвращает включённые логические модели в OpenAI-совместимом формате списка моделей. Эндпоинт не использует пагинацию и
по умолчанию применяет `type=llm`. Подробные возможности и цены намеренно не включены.

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Ответ содержит `object: "list"` и массив `data`. Каждый элемент содержит `id`, `object`, `created` и
`owned_by`; используйте `id` как логическое имя модели. Чтобы получить метаданные о возможностях и ценах, запросите эту модель.

---

## Получение модели {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Подробный ответ дополнительно содержит `unified_schema`, `supported_modes` и `model_card`. Подробные цены находятся внутри
`model_card`; объекта `pricing` верхнего уровня нет.

---

## Стоимость задачи {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

Проверьте учтённую стоимость задачи по ID задачи, возвращённому операцией API.

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Ответ:**

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

## Соглашения платформы Agents {#agents-platform-conventions}

- Базовый URL `https://api.sandbase.ai/v1`. Передавайте `Authorization: Bearer sk-YOUR_KEY` или `X-API-Key: sk-YOUR_KEY` (одинаковое значение, если оба). `OpenAI-Beta` необязателен; если передан, значение должно быть `agents=v1`. Официальный OpenAI SDK (`client.beta.agents`, `client.skills`) работает с `base_url="https://api.sandbase.ai/v1"`; различия перечислены в разделе [Совместимость с OpenAI](/agents/openai-compatibility).

- Тела запросов — строгий JSON размером до 1 MiB; неизвестные поля возвращают 400.

- Ошибки: `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`. Ветвитесь по `code`; см. [руководство по ошибкам](./errors#agents-platform-errors).

- `row_version` — токен compare-and-set для PATCH, archive, restore и rotate. При 409 прочитайте ресурс заново.

- Списки с курсором (Agents, Sessions, items, turns, Skills): `limit` 1–100, `after`, `order`; ответ `{object:"list", data, has_more, first_id, last_id}`.

- Списки со смещением (версии Agent, вложения, MCP-подключения, Secrets): `limit`, `offset`; ответ `{data, total, limit, offset}`.

- ID: Agent `agt_`, Session `ses_`, Skill `skl_`, MCP-подключение `mcp_`, Secret `sec_`, вложение `fil_`. Считайте их непрозрачными.

---

## Agents {#agents}

### POST /v1/agents — создание Agent {#post-v1-agents-—-create-agent}

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

Обязательно: `model`. Необязательно: `name`, `instructions`, `description`, `runtime_profile` (`codex` по умолчанию, `claude`, `mcode`), `skills` (`[{"skill_id","version"}]`), `mcp_connections` (`[{"connection_id","server_label","allowed_tools","required"}]`), `tools`, `text`, `reasoning`, `service_tier`, `metadata`, `note`. Возвращает `201` с `id` (`agt_`), `version`, `row_version`, `status` и `projection_status`; запускайте сессии, когда `projection_status` равен `ready`. Инструменты `web_search` должны использовать `mode: "disabled"`, а результаты функций на стороне клиента (`requires_action`) не поддерживаются.

### GET /v1/agents — список Agents {#get-v1-agents-—-list-agents}

Параметр запроса `status` (`active` по умолчанию, `archived`, `all`) плюс курсорная пагинация.

### GET /v1/agents/{agent_id} — получение Agent {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — обновление Agent (в стиле SDK) {#post-v1-agents-agent-id-—-update-agent-sdk-style}

Частичное обновление `name`, `instructions`, `model`, `metadata`, `service_tier`, `tools`, `text`, `reasoning`, `runtime_profile`, `mcp_connections`, `skills`. Без `row_version`; создаёт новую версию.

### PATCH /v1/agents/{agent_id} — обновление Agent (compare-and-set) {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

Те же поля плюс `description` и `note`; `row_version` обязателен. Явный `null` возвращает 400.

### Версии, архивирование, восстановление, каталог {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` и `GET /v1/agents/{agent_id}/versions/{version}` читают неизменяемые снимки.

- `POST /v1/agents/{agent_id}/archive`, `POST /v1/agents/{agent_id}/unarchive` принимают `{"row_version"}`. `DELETE /v1/agents/{agent_id}` тоже архивирует.

- `POST /v1/agents/{agent_id}/restore` принимает `{"source_version","row_version"}`.

- `GET /v1/agents/catalog` возвращает публичные Agents; `POST /v1/agents/catalog/{agent_id}/clone` копирует один из них в вашу организацию (`201`, новый `agt_`).

---

## Сессии {#sessions}

Сессия запускает одну сохранённую версию Agent. Пути находятся под `/v1/agents/sessions`. Версия Agent, версии Skill и MCP-подключения фиксируются при создании.

### POST /v1/agents/sessions — создание сессии {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

Передайте `agent_id` (сохранённый Agent), `agent` (встроенный Agent или переопределения для сессии: `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` и `multi_agent`) или оба. Необязательно: `version` (только для сохранённых Agents), `title`, `input` (строка или массив ровно с одним сообщением пользователя, содержащим одну часть `input_text`), `model` или `agent.model`, `metadata`, `model_provider` (`{"type":"custom","base_url":"https://...","api_key":"..."}`; если не указан, используется ваш вызывающий ключ). `stream: true` с непустым `input` возвращает `201` в виде потока Server-Sent Events первого хода, начиная с `agent.session.created`. Сессии всегда выполняются в облаке SandBase, поэтому выбирать окружение не нужно; OpenAI SDK всё равно требует `environment={"type": "openai_hosted"}`. Возвращает `201` с `status` (`idle`, `in_progress`, `failed`), `lifecycle_status` (`active`, `archived`), `failure`, `source` (`direct`, `service`, `schedule`) и `row_version`.

### GET /v1/agents/sessions/{session_id}/events — поток событий (SSE) {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

Только в реальном времени. Откройте его до отправки ввода. `Last-Event-ID` или `after` возвращают 400; события не воспроизводятся повторно. Значения `type` событий начинаются с `agent.session.`.

### POST /v1/agents/sessions/{session_id}/events — отправка ввода {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

Ровно одно событие на запрос: `agent.session.input.message` или `agent.session.input.cancel`. Возвращает `202` без тела. Расширенная форма: `{"input": "...", "file_ids": ["fil_..."]}` (до 10 готовых вложений). `409 session_input_pending` означает, что предыдущий ввод ещё доставляется; подождите и не отправляйте повторно с новым ключом.

### История и другие операции с сессиями {#history-and-other-session-operations}

- `GET /v1/agents/sessions` (параметры `lifecycle_status`, `agent_id`), `GET /v1/agents/sessions/{session_id}`.

- `GET /v1/agents/sessions/{session_id}/items`, `GET /v1/agents/sessions/{session_id}/turns`, `GET /v1/agents/sessions/{session_id}/turns/{turn_id}` читают историю.

- `POST /v1/agents/sessions/{session_id}` заменяет `metadata`; `PATCH /v1/agents/sessions/{session_id}` переименовывает с `{"title","row_version"}`.

- `POST /v1/agents/sessions/{session_id}/cancel` (требует `Idempotency-Key`) отменяет выполняемый ход.

- `DELETE /v1/agents/sessions/{session_id}` архивирует; `POST /v1/agents/sessions/{session_id}/unarchive` восстанавливает.

- `POST /v1/agents/sessions/{session_id}/files` загружает одно вложение (multipart `file`, 5 MiB, требуется `Idempotency-Key`).

- `POST /v1/agents/sessions/{session_id}/reconnect` возвращает `stream_url` для `GET /v1/agents/sessions/{session_id}/events/stream`, который отправляет `session.snapshot`, а затем события в реальном времени.

---

### Файлы рабочего пространства и выходные артефакты {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files` возвращает метаданные текущих файлов в `path` (по умолчанию `/workspace`). Параметры `limit` (1–100, по умолчанию 20), `order` (`asc` по умолчанию или `desc`) и `page` (курсор `next` из предыдущего ответа). Возвращает `{object:"page", data:[{path,size_bytes}], next, has_more}`. При недействительном курсоре нужно начать с первой страницы.
- `GET /v1/agents/sessions/{session_id}/artifacts` возвращает неизменяемые результаты, сохранённые в `/workspace/outputs/`. Параметры `limit` (по умолчанию 20), `order` (`desc` по умолчанию) и `after` (используйте `last_id`, когда `has_more` равно true).
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` скачивает артефакт целиком по возвращённому непрозрачному ID `art_`. Лимит скачивания — 200 MiB; `Range` не поддерживается (`416`). Метаданные рабочего пространства, загруженные вложения и сохранённые артефакты — отдельные ресурсы.

---

## Skills, MCP-подключения и Secrets {#skills-mcp-connections-and-secrets}

### POST /v1/skills — создание Skill {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

Одна ZIP-часть `files` (5 MiB). ZIP должен содержать одну папку верхнего уровня с `SKILL.md` (frontmatter с `name` и `description`) внутри, например `zip -r release-notes.zip release-notes/`; `SKILL.md` в корне ZIP возвращает `400 invalid_request`. Skill, на который ссылается любая версия Agent (включая архивированные Agents), нельзя удалить (`409`); вместо этого отключите его через `POST /v1/skills/{skill_id}` с `{"status": "disabled"}`. Возвращает `201` с `id` (`skl_`) и `default_version`. Добавляйте версии через `POST /v1/skills/{skill_id}/versions`; список — `GET /v1/skills`. В Agent ссылайтесь как `{"skill_id": "skl_...", "version": null}`.

### POST /v1/mcp-connections — регистрация MCP-сервера {#post-v1-mcp-connections-—-register-an-mcp-server}

Тело `{"name", "server_url" (HTTPS), "secret_id"?}`; требуется `Idempotency-Key`. Ссылайтесь на подключение в `mcp_connections` Agent. Отключение блокирует новые сессии и дальнейший ввод.

### POST /v1/secrets — сохранение Bearer-токена MCP {#post-v1-secrets-—-store-an-mcp-bearer-token}

Тело `{"name", "kind": "mcp_bearer", "server_url", "token"}`; требуется `Idempotency-Key`. Токен доступен только для записи и привязан к этому точному URL. Secrets — не переменные окружения. Ротация — `POST /v1/secrets/{secret_id}/rotate`; отзыв — `DELETE /v1/secrets/{secret_id}` (204).

---

## Оплата и стоимость {#billing-cost}

### Как рассчитывается стоимость {#how-costs-are-calculated}

- Актуальную формулу цены и единицы выбранной модели смотрите в её `model_card`.
- Модели с оплатой за токены могут включать компоненты ввода, вывода, кэша или рассуждений, если они объявлены.
- Медиамодели и другие модели могут использовать единицы за запрос, длительность, разрешение или другие единицы, специфичные для модели.
- Data API (поиск, соцсети, скрейпинг, электронная коммерция, финансы) включают 100 бесплатных вызовов на организацию в сутки UTC, общих для всех подходящих data API; счётчик сбрасывается в 00:00 UTC. Последующие вызовы оплачиваются поштучно и не отклоняются. Организации с нулевым балансом тоже могут использовать бесплатные вызовы.
- Не подходят: LLM, медиамодели и более дорогие data API или API с ценой по формуле (например, некоторые пакетные эндпоинты, crawl, Xiaohongshu PGY и маршруты Douyin Xingtu `kol-*`), которые оплачиваются с первого вызова. Проверить можно по `pricing.free_quota` в `sandbase_inspect`.
- MCP: `sandbase_inspect` показывает `pricing.free_quota` для подходящих инструментов; `sandbase_account` возвращает `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`); завершённые результаты `sandbase_run` и `sandbase_run_get` содержат `free_quota_status` (`free`, `overage` или `degraded`).
- Если тарифицируемая операция возвращает ID задачи (в том числе в заголовке ответа `x-task-id`), используйте `GET /v1/tasks/{task_id}/cost` для получения расчёта и использования.
- Для асинхронных ответов `POST /v1/run` запрашивайте результат генерации через `GET /v1/run/{id}`; ID run — это не ID задачи, и его нельзя отправлять в эндпоинт стоимости.

### Контроль бюджета {#budget-control}

- Задайте необязательный лимит расходов при создании или редактировании стандартного ключа в разделе [Developer → API Keys](https://www.sandbase.ai/console/keys).
- Отслеживайте запросы и расходы в разделе **Developer → Activities → Usage**.
- Проверяйте баланс и операции с кредитами в разделе [Developer → Billing](https://www.sandbase.ai/console/billing).

---

## См. также {#see-also}

- [Модели и цены](./models) — актуальный поиск моделей, возможности и сведения о ценах
- [Руководство по ошибкам](./errors) — документированные формы ответов, обработка HTTP и безопасность повторных попыток
- [Спецификация OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) — машиночитаемая схема


## Привязка версий Skill в Agent {#agent-skill-version-bindings}

При сохранении Agent каждая новая ссылка на Skill закрепляется за явной версией. Для новой привязки `version: null` выбирает текущую версию по умолчанию на момент сохранения. Для существующей привязки `version: null` сохраняет закреплённую версию. Изменение версии Skill по умолчанию не обновляет сохранённые Agents и существующие сессии; чтобы обновить будущие сессии, сохраните в Agent явную версию.
