---
i18nSource: d637409019c8109d
title: Compatibilidad con OpenAI
description: Usa el SDK oficial de OpenAI con los Agents, Sessions y Skills de SandBase, y descubre en qué se diferencia SandBase de la OpenAI Agents API.
---

# Compatibilidad con OpenAI {#openai-compatibility}

Los Agents de SandBase implementan el protocolo de la [OpenAI Agents API](https://developers.openai.com/api/docs/guides/agents-api/overview) para Agents, Sessions, eventos de sesión, items, turnos y Skills. Para esos recursos puedes usar directamente el SDK oficial de OpenAI: apunta `base_url` a `https://api.sandbase.ai/v1` y pasa una API key de SandBase.

Las conexiones MCP, los Secrets y los catálogos son recursos exclusivos de SandBase. El SDK no tiene métodos para ellos, así que llámalos por HTTP (o con los métodos genéricos `client.post` / `client.get` del SDK).

Versiones del SDK verificadas:

| SDK | Versiones | Notas |
|---|---|---|
| openai-python | 3.13.0, 3.24.0 | `sessions.update(agent=...)` y `sessions.traces` no existen en 3.13.0 |
| openai-node | 7.28.0 (Node.js 26) | Usa un dispatcher HTTP/1.1 para el streaming, consulta [más abajo](#node-js-and-http-2) |

## Configurar el cliente {#set-up-the-client}

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

El SDK envía `OpenAI-Beta: agents=v1` automáticamente. SandBase acepta ese valor o la ausencia del encabezado; cualquier otro valor devuelve `400`.

## Ejecutar un Agent de principio a fin {#run-an-agent-end-to-end}

Crea un Agent, crea una Session, abre el flujo de eventos en vivo, envía una entrada y lee el historial. El flujo solo transmite en vivo, así que ábrelo antes de enviar la entrada.

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

`events.create` devuelve `202` sin cuerpo. Cada solicitud lleva exactamente un evento. Reutilizar el mismo `Idempotency-Key` con el mismo cuerpo no inicia un segundo turno. Para detener el turno en curso, envía `{"type": "agent.session.input.cancel"}` como único evento.

### Node.js y HTTP/2 {#node-js-and-http-2}

El `fetch` de Node.js 26 puede negociar HTTP/2 con la API de SandBase. Si lo hace, en una conexión HTTP/2 compartida `events.create` puede bloquearse mientras `events.stream` esté abierto en la misma conexión, hasta que el flujo se cierre. El dispatcher de `undici` con `allowH2: false` mostrado arriba lo evita. El SDK de Python usa HTTP/1.1 por defecto y no necesita cambios.

## Skills con el SDK {#skills-with-the-sdk}

`client.skills` funciona como en OpenAI, salvo que no se puede eliminar una sola versión de una Skill. El ZIP debe contener una carpeta de nivel superior con `SKILL.md` dentro (`zip -r release-notes.zip release-notes/`). Un `SKILL.md` en la raíz del ZIP devuelve `400 invalid_request`.

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

`skills.retrieve`, `skills.list`, `skills.update(default_version=...)`, `skills.versions.create / list / retrieve`, `skills.versions.content.retrieve` y `skills.delete` también funcionan. Una Skill referenciada por cualquier versión de un Agent no se puede eliminar (`409`); en su lugar, establece `status` en `disabled` con Update Skill.

## Conexiones MCP con el SDK {#mcp-connections-with-the-sdk}

OpenAI declara los servidores MCP en línea como `tools: [{"type": "mcp", ...}]`. SandBase devuelve `400` para esa forma. Registra el servidor una vez con [`POST /v1/mcp-connections`](/api-reference/mcp-connections/) y haz referencia a él desde `mcp_connections` del Agent. Los métodos de solicitud genéricos del SDK y los campos extra del cuerpo cubren ambos pasos:

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

La llamada de Node.js pasa `mcp_connections` en JavaScript plano; en TypeScript el campo no forma parte de los tipos del SDK. Los bearer tokens de los servidores MCP se guardan como [Secrets](/agents/api-credentials), no como vaults de OpenAI.

## Entorno de ejecución {#execution-environment}

SandBase ejecuta cada Session en su nube alojada; no hay ningún entorno que elegir ni gestionar.

- Las llamadas HTTP directas omiten `environment`.
- El SDK de OpenAI exige un argumento `environment` en `sessions.create` (Python lanza `TypeError` sin él y los tipos de Node.js lo requieren). Pasa `{"type": "openai_hosted"}`; SandBase lo acepta. Cualquier otro valor, como `self_hosted`, devuelve `400`.
- Las respuestas de Session incluyen un objeto `environment` por compatibilidad con el SDK. No necesitas leerlo ni actuar en función de él.

## Compatibilidad de un vistazo {#compatibility-at-a-glance}

| Área | Estado | Detalles |
|---|---|---|
| `beta.agents.create / retrieve / update / list / delete` | Compatible, con extensiones | Las respuestas añaden `status`, `version`, `row_version`, `projection_status`, `runtime_profile`, `skills`, `mcp_connections` y más. `delete` archiva el Agent y devuelve `agent.deleted`. |
| `beta.agents.sessions.create / retrieve / update / list / delete` | Compatible, con límites | Acepta un `agent_id` guardado, un `agent` en línea o ambos; `agent` acepta `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` y `multi_agent`. `stream=True` transmite el primer turno y necesita un `input` inicial. `update` solo acepta `metadata`. `delete` archiva la Session. |
| `sessions.events.stream` | Compatible | Solo en vivo, como en OpenAI. `Last-Event-ID` o `?after=` devuelve `400`. |
| `sessions.events.create` | Compatible, con límites | Exactamente un evento `agent.session.input.message` o `agent.session.input.cancel` por solicitud; el mensaje tiene una parte `input_text` de usuario o una cadena simple. |
| `sessions.items.list`, `sessions.turns.list / retrieve` | Compatible | Paginación por cursor con `limit` 1-100, `after`, `order`. |
| `client.skills` y `skills.versions` | Compatible, salvo la eliminación de versiones | `skills.versions.delete` devuelve `404`. |
| Envoltorio de error | Compatible | `{"error": {"type", "code", "param", "message"}}`; las excepciones del SDK lo exponen como `exc.body`. |
| Versiones de Agent, restauración, archivado, catálogo, renombrado/archivado/reconexión/archivos/archivos del espacio de trabajo/artefactos de Session | Solo SandBase | Consulta la referencia de la API de [Agents](/api-reference/agents/) y [Sessions](/api-reference/sessions/). |
| Conexiones MCP, Secrets | Solo SandBase | Usa HTTP o `client.post` / `client.get`. |

SandBase expone el [listado de artefactos](/api-reference/sessions/list-artifacts) y la [descarga de contenido](/api-reference/sessions/download-artifact) por HTTP. Los ID de artefacto son opacos y tienen ámbito de Session. Esto no implica compatibilidad con todos los métodos de artefactos del SDK; no se expone un endpoint independiente de metadatos de artefactos.

### No compatible {#not-supported}

Estas llamadas del SDK de OpenAI fallan contra SandBase. El mensaje es el `error.message` real que se devuelve.

| Llamada del SDK | Resultado |
|---|---|
| `sessions.create(..., stream=True)` sin un `input` inicial | `400 invalid_request` |
| `sessions.create(..., environment={"type": "self_hosted"})` | `400`: `only openai_hosted environment is supported` |
| `sessions.create(..., agent={...})` con un campo distinto de `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` y `multi_agent` | `400 invalid_request` |
| `sessions.create(..., vault_ids=[...])` | `400 invalid_request` |
| `sessions.update(..., agent={...})` | `400` (openai-python 3.13.0 no tiene el parámetro `agent` y lanza `TypeError`) |
| `agents.create(..., multi_agent={"enabled": True})` | `400`: `multi_agent is not supported` |
| `agents.create(..., tools=[{"type": "mcp", ...}])`; herramientas `tool_search`, `programmatic_tool_calling` y `computer_use` | `400 invalid_request`. Solo se aceptan `function` y una herramienta `web_search` |
| `events.create` con un evento `tool_result` o de aprobación de computer-use | `400 invalid_request`. No se admiten Sessions que llegan a `requires_action` |
| `events.create` con más de un evento | `400`: `exactly one text input or cancel event is supported per request` |
| `sessions.traces`, `sessions.subagents`, `environments.templates` | `404 not_found` (openai-python 3.13.0 no tiene `traces`) |
| `beta.agents.vaults` | `404` con un cuerpo de texto plano (`404 page not found`), no el envoltorio de error JSON |
| `skills.versions.delete` | `404 not_found` |

### Diferencias en los campos {#field-differences}

- Las Sessions informan de los fallos en `failure` (`{code, message, action, retryable?}`), no en el `error` de OpenAI. Con el SDK, `session.error` es `None`; lee `session.failure` en su lugar.
- `required_actions` y `vault_ids` son siempre arrays vacíos.
- Las marcas de tiempo de Agent y Session están en segundos Unix. El `created_at` de las versiones de Agent, las conexiones MCP y los Secrets usan cadenas ISO 8601.
- `402 spending_limit_exceeded` no tiene una clase de excepción propia en el SDK; aparece como un `APIStatusError` genérico.
- Un método no admitido en una ruta conocida (por ejemplo, `PUT` en `/v1/agents`) devuelve `404` con el envoltorio de error JSON, no `405`.

## Próximos pasos {#next-steps}

- [Sessions](/agents/sessions)
- [Skills y herramientas MCP](/agents/mcp-tools)
- [Referencia de la API de Agents](/api-reference/agents/)
