---
i18nSource: e566962f42a5f6b0
title: Guía de la API de IA de SandBase
description: Guía ampliada de la API de SandBase para agentes de IA, con los flujos de trabajo principales, ejemplos de solicitudes y enlaces a la especificación OpenAPI oficial.
---

# Guía de la API de IA {#ai-api-guide}

::: info Contrato de Session
Una Session (`ses_*`) ejecuta una versión guardada de un Agent y se crea directamente con `POST /v1/agents/sessions`. Los IDs internos de las Runtime Sessions no se exponen.
:::

> Una guía de una sola página con los flujos de trabajo más comunes de la API. Para el contrato completo legible por máquinas, usa la [especificación OpenAPI](https://www.sandbase.ai/docs/openapi.yaml). Versión en texto plano: [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt).

## Autenticación {#authentication}

Todas las solicitudes requieren:

```
Authorization: Bearer sk-YOUR_KEY
```

URL base: `https://api.sandbase.ai/v1`

---

## Terminología {#terminology}

| Término | Significado |
|------|---------|
| **Task** | Un registro de ejecución facturable para operaciones como la inferencia de modelos. No todas las operaciones de la API crean uno. |
| **Run** | Una solicitud de generación multimedia mediante `POST /v1/run`. Puede ser síncrona o asíncrona. Consulta su estado con `GET /v1/run/{id}`. |
| **Session** | Una ejecución de un Agent mediante `POST /v1/agents/sessions`, que contiene la conversación, la actividad de las herramientas y la salida. Consúltala con `GET /v1/agents/sessions/{session_id}`. |
> **run frente a session**: un "run" de modelo (`/v1/run`) es una tarea de generación de un modelo. Una "Session" (`/v1/agents/sessions`) es una ejecución de un Agent. Todos los IDs son opacos y no deben analizarse.
>
> **task frente a run**: un "run" o una "session" es la solicitud que haces; un "task" es un registro de ejecución facturable. Usa
> `GET /v1/tasks/{task_id}/cost` cuando una operación devuelva un ID de task. No todas las operaciones de la API crean un task.

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

Compatible con OpenAI. La compatibilidad con streaming, herramientas, visión, razonamiento y salida estructurada depende del modelo seleccionado y de su esquema declarado.

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

**Respuesta:**

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

> Algunas operaciones facturables pueden devolver `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc`; si está presente, úsalo para consultar
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost`.

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

API Messages compatible con Anthropic. El almacenamiento en caché y otras funciones opcionales dependen del modelo seleccionado y del esquema de la solicitud.

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

**Respuesta:**

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

## Generación de imágenes {#image-generation}

### POST /v1/run {#post-v1-run}

El endpoint `/v1/run` es un **endpoint de generación unificado**: el campo `model` determina el tipo de salida (imagen, video o audio).

> **Cómo manejar la respuesta:** revisa el campo `status`.
> - `"completed"` → los resultados están en `outputs` y terminaste.
> - `"pending"` o `"running"` → consulta `GET /v1/run/{id}` cada 2–5 s hasta llegar a un estado final (`completed`, `failed` o `timeout`).

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

**Respuesta (síncrona):**

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

## Generación de video {#video-generation}

### POST /v1/run {#post-v1-run-1}

Revisa el `execution_mode` del modelo seleccionado. Cuando el envío devuelve `pending` o `running`, consulta `GET /v1/run/{id}` hasta llegar a un estado final.

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

**Respuesta (asíncrona, inicial):**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**Consultar el estado: `GET /v1/run/{id}`**

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

## Audio (texto a voz) {#audio-text-to-speech}

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

**Respuesta:**

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

## Listar modelos {#list-models}

### GET /v1/models {#get-v1-models}

Devuelve los modelos lógicos habilitados en el formato de lista de modelos compatible con OpenAI. El endpoint no está paginado y
usa `type=llm` por defecto. Las capacidades y los precios detallados se omiten a propósito.

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

La respuesta contiene `object: "list"` y un array `data`. Cada elemento contiene `id`, `object`, `created` y
`owned_by`; usa `id` como nombre lógico del modelo. Obtén ese modelo para ver los metadatos de capacidades y precios.

---

## Obtener modelo {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

La respuesta detallada agrega `unified_schema`, `supported_modes` y `model_card`. Los precios detallados están dentro de
`model_card`; no hay un objeto `pricing` de nivel superior.

---

## Obtener el costo de un task {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

Consulta el costo registrado de un task con el ID de task que devolvió la operación de la API.

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Respuesta:**

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

## Convenciones de la plataforma de Agents {#agents-platform-conventions}

- URL base `https://api.sandbase.ai/v1`. Envía `Authorization: Bearer sk-YOUR_KEY` o `X-API-Key: sk-YOUR_KEY` (el mismo valor si envías ambos). `OpenAI-Beta` es opcional; si lo envías, debe ser `agents=v1`. El SDK oficial de OpenAI (`client.beta.agents`, `client.skills`) funciona con `base_url="https://api.sandbase.ai/v1"`; las diferencias se detallan en [Compatibilidad con OpenAI](/agents/openai-compatibility).

- Los cuerpos son JSON estricto de hasta 1 MiB; los campos desconocidos devuelven 400.

- Errores: `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`. Decide según `code`; consulta la [Guía de errores](./errors#agents-platform-errors).

- `row_version` es el token de comparación e intercambio (compare-and-set) para PATCH, archive, restore y rotate. Ante un 409, vuelve a leer el recurso.

- Listas con cursor (Agents, Sessions, items, turns, Skills): `limit` de 1 a 100, `after`, `order`; respuesta `{object:"list", data, has_more, first_id, last_id}`.

- Listas con offset (versiones de Agent, adjuntos, conexiones MCP, Secrets): `limit`, `offset`; respuesta `{data, total, limit, offset}`.

- IDs: Agent `agt_`, Session `ses_`, Skill `skl_`, conexión MCP `mcp_`, Secret `sec_`, adjunto `fil_`. Trátalos como opacos.

---

## Agents {#agents}

### POST /v1/agents — Crear Agent {#post-v1-agents-—-create-agent}

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

Obligatorio: `model`. Opcionales: `name`, `instructions`, `description`, `runtime_profile` (`codex` por defecto, `claude`, `mcode`), `skills` (`[{"skill_id","version"}]`), `mcp_connections` (`[{"connection_id","server_label","allowed_tools","required"}]`), `tools`, `text`, `reasoning`, `service_tier`, `metadata`, `note`. Devuelve `201` con `id` (`agt_`), `version`, `row_version`, `status` y `projection_status`; inicia Sessions cuando `projection_status` sea `ready`. Las herramientas `web_search` deben usar `mode: "disabled"`, y los resultados de funciones del lado del cliente (`requires_action`) no son compatibles.

### GET /v1/agents — Listar Agents {#get-v1-agents-—-list-agents}

Query `status` (`active` por defecto, `archived`, `all`) más paginación por cursor.

### GET /v1/agents/{agent_id} — Obtener Agent {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — Actualizar Agent (estilo SDK) {#post-v1-agents-agent-id-—-update-agent-sdk-style}

Actualización parcial de `name`, `instructions`, `model`, `metadata`, `service_tier`, `tools`, `text`, `reasoning`, `runtime_profile`, `mcp_connections`, `skills`. Sin `row_version`; crea una versión nueva.

### PATCH /v1/agents/{agent_id} — Actualizar Agent (compare-and-set) {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

Los mismos campos más `description` y `note`; `row_version` es obligatorio. Un `null` explícito devuelve 400.

### Versiones, archivado, restauración y catálogo {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` y `GET /v1/agents/{agent_id}/versions/{version}` leen instantáneas inmutables.

- `POST /v1/agents/{agent_id}/archive` y `POST /v1/agents/{agent_id}/unarchive` reciben `{"row_version"}`. `DELETE /v1/agents/{agent_id}` también archiva.

- `POST /v1/agents/{agent_id}/restore` recibe `{"source_version","row_version"}`.

- `GET /v1/agents/catalog` lista los Agents públicos; `POST /v1/agents/catalog/{agent_id}/clone` copia uno en tu organización (`201`, nuevo `agt_`).

---

## Sessions {#sessions}

Una Session ejecuta una versión guardada de un Agent. Las rutas están bajo `/v1/agents/sessions`. La versión del Agent, las versiones de las Skills y las conexiones MCP quedan congeladas al crearla.

### POST /v1/agents/sessions — Crear Session {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

Envía `agent_id` (Agent guardado), `agent` (Agent en línea o sobrescrituras por Session de `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` y `multi_agent`), o ambos. Opcionales: `version` (solo Agents guardados), `title`, `input` (una cadena, o un array con exactamente un mensaje de usuario que contenga una parte `input_text`), `model` o `agent.model`, `metadata`, `model_provider` (`{"type":"custom","base_url":"https://...","api_key":"..."}`; si se omite, se usa tu clave de llamada). `stream: true` con un `input` no vacío devuelve `201` como un stream de Server-Sent Events del primer turno, que empieza con `agent.session.created`. Las Sessions siempre se ejecutan en la nube alojada de SandBase, así que no hay que elegir entorno; aun así, el SDK de OpenAI requiere `environment={"type": "openai_hosted"}`. Devuelve `201` con `status` (`idle`, `in_progress`, `failed`), `lifecycle_status` (`active`, `archived`), `failure`, `source` (`direct`, `service`, `schedule`) y `row_version`.

### GET /v1/agents/sessions/{session_id}/events — Stream de eventos (SSE) {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

Solo en vivo. Ábrelo antes de enviar entradas. `Last-Event-ID` o `after` devuelven 400; los eventos no se reenvían. Los valores de `type` de los eventos empiezan por `agent.session.`.

### POST /v1/agents/sessions/{session_id}/events — Enviar entrada {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

Exactamente un evento por solicitud: `agent.session.input.message` o `agent.session.input.cancel`. Devuelve `202` sin cuerpo. Forma extendida: `{"input": "...", "file_ids": ["fil_..."]}` (hasta 10 adjuntos listos). `409 session_input_pending` significa que una entrada anterior todavía se está entregando; espera y no la reenvíes con una clave nueva.

### Historial y otras operaciones de Session {#history-and-other-session-operations}

- `GET /v1/agents/sessions` (query `lifecycle_status`, `agent_id`), `GET /v1/agents/sessions/{session_id}`.

- `GET /v1/agents/sessions/{session_id}/items`, `GET /v1/agents/sessions/{session_id}/turns` y `GET /v1/agents/sessions/{session_id}/turns/{turn_id}` leen el historial.

- `POST /v1/agents/sessions/{session_id}` reemplaza `metadata`; `PATCH /v1/agents/sessions/{session_id}` cambia el nombre con `{"title","row_version"}`.

- `POST /v1/agents/sessions/{session_id}/cancel` (requiere `Idempotency-Key`) cancela el turno en ejecución.

- `DELETE /v1/agents/sessions/{session_id}` archiva; `POST /v1/agents/sessions/{session_id}/unarchive` restaura.

- `POST /v1/agents/sessions/{session_id}/files` sube un adjunto (`file` multipart, 5 MiB, `Idempotency-Key` obligatorio).

- `POST /v1/agents/sessions/{session_id}/reconnect` devuelve `stream_url` para `GET /v1/agents/sessions/{session_id}/events/stream`, que envía `session.snapshot` y luego los eventos en vivo.

---

### Archivos del espacio de trabajo y artifacts de salida {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files` lista los metadatos actuales de los archivos bajo `path` (por defecto `/workspace`). Query `limit` (1-100, 20 por defecto), `order` (`asc` por defecto o `desc`) y `page` (el cursor `next` anterior). Devuelve `{object:"page", data:[{path,size_bytes}], next, has_more}`. Si el cursor no es válido, hay que volver a empezar desde la primera página.
- `GET /v1/agents/sessions/{session_id}/artifacts` lista las salidas inmutables capturadas en `/workspace/outputs/`. Query `limit` (20 por defecto), `order` (`desc` por defecto) y `after` (usa `last_id` cuando `has_more` sea true).
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` descarga un artifact completo usando el ID opaco `art_` devuelto. Las descargas tienen un límite de 200 MiB; `Range` no es compatible (`416`). Los metadatos del espacio de trabajo, los adjuntos subidos y los artifacts capturados son recursos distintos.

---

## Skills, conexiones MCP y Secrets {#skills-mcp-connections-and-secrets}

### POST /v1/skills — Crear Skill {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

Una parte ZIP `files` (5 MiB). El ZIP debe contener una sola carpeta de nivel superior con `SKILL.md` dentro (con `name` y `description` en el frontmatter), por ejemplo `zip -r release-notes.zip release-notes/`; un `SKILL.md` en la raíz del ZIP devuelve `400 invalid_request`. Una Skill referenciada por cualquier versión de un Agent (incluidos los Agents archivados) no se puede eliminar (`409`); en su lugar, deshabilítala con `POST /v1/skills/{skill_id}` y `{"status": "disabled"}`. Devuelve `201` con `id` (`skl_`) y `default_version`. Agrega versiones con `POST /v1/skills/{skill_id}/versions`; lista con `GET /v1/skills`. Haz referencia a ella desde un Agent como `{"skill_id": "skl_...", "version": null}`.

### POST /v1/mcp-connections — Registrar un servidor MCP {#post-v1-mcp-connections-—-register-an-mcp-server}

Cuerpo `{"name", "server_url" (HTTPS), "secret_id"?}`; `Idempotency-Key` obligatorio. Haz referencia a ella desde `mcp_connections` de un Agent. Deshabilitarla bloquea las Sessions nuevas y las entradas adicionales.

### POST /v1/secrets — Guardar un token Bearer de MCP {#post-v1-secrets-—-store-an-mcp-bearer-token}

Cuerpo `{"name", "kind": "mcp_bearer", "server_url", "token"}`; `Idempotency-Key` obligatorio. El token es de solo escritura y está vinculado a esa URL exacta. Los Secrets no son variables de entorno. Rota con `POST /v1/secrets/{secret_id}/rotate`; revoca con `DELETE /v1/secrets/{secret_id}` (204).

---

## Facturación y costos {#billing-cost}

### Cómo se calculan los costos {#how-costs-are-calculated}

- Consulta la fórmula de precios y las unidades vigentes del modelo seleccionado en su `model_card`.
- Los modelos con precio por token pueden incluir componentes de entrada, salida, caché o razonamiento cuando se declaran.
- Los modelos multimedia y otros pueden usar unidades por solicitud, duración, resolución u otras propias del modelo.
- Las API de datos (búsqueda, redes sociales, scraping, comercio electrónico, finanzas) incluyen 100 llamadas gratuitas por organización y por día UTC, compartidas entre las API de datos elegibles y reiniciadas a las 00:00 UTC. Las llamadas posteriores se facturan por llamada; no se rechazan. Las organizaciones con saldo cero pueden seguir usando las llamadas gratuitas.
- No elegibles: los LLM, los modelos multimedia y las API de datos más caras o con precio por fórmula (por ejemplo, algunos endpoints por lotes, crawl, Xiaohongshu PGY y las rutas `kol-*` de Douyin Xingtu), que se facturan desde la primera llamada. La referencia es `pricing.free_quota` en `sandbase_inspect`.
- MCP: `sandbase_inspect` muestra `pricing.free_quota` en las herramientas elegibles; `sandbase_account` devuelve `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`); los resultados liquidados de `sandbase_run` y `sandbase_run_get` incluyen `free_quota_status` (`free`, `overage` o `degraded`).
- Cuando una operación facturable devuelve un ID de task (incluido el encabezado de respuesta `x-task-id`), usa `GET /v1/tasks/{task_id}/cost` para ver la liquidación y el uso.
- Para las respuestas asíncronas de `POST /v1/run`, consulta el resultado de la generación con `GET /v1/run/{id}`; un ID de run no es un ID de task y no debe enviarse al endpoint de costos.

### Control del presupuesto {#budget-control}

- Define un límite de gasto opcional al crear o editar una clave estándar en [Developer → API Keys](https://www.sandbase.ai/console/keys).
- Supervisa las solicitudes y el costo en **Developer → Activities → Usage**.
- Revisa el saldo y las transacciones de créditos en [Developer → Billing](https://www.sandbase.ai/console/billing).

---

## Consulta también {#see-also}

- [Modelos y precios](./models): descubrimiento de modelos en tiempo real, capacidades y orientación sobre precios
- [Guía de errores](./errors): formatos de respuesta documentados, manejo de HTTP y seguridad de los reintentos
- [Especificación OpenAPI](https://www.sandbase.ai/docs/openapi.yaml): esquema legible por máquinas


## Vinculación de versiones de Skills en los Agents {#agent-skill-version-bindings}

Al guardar un Agent, cada nueva referencia a una Skill queda fijada a una versión explícita. En una vinculación nueva, `version: null` selecciona la versión predeterminada vigente en el momento de guardar. En una vinculación existente, `version: null` conserva la versión fijada. Cambiar la versión predeterminada de una Skill no actualiza los Agents guardados ni las Sessions existentes; guarda una versión explícita en el Agent para actualizar las Sessions futuras.
