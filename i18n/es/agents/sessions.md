---
i18nSource: e904f2b8bbd0ccc4
title: Sessions
description: Ejecuta un Agent en una Session, transmite sus eventos, lee el historial, adjunta archivos y gestiona los fallos.
---

# Sessions {#sessions}

Una **Session** ejecuta una versión guardada de un Agent en la nube alojada de SandBase; no eliges un entorno de ejecución. Su ID empieza por `ses_` y todas las rutas de Session están bajo `/v1/agents/sessions`. La Session congela la versión del Agent, las versiones de las Skills y la configuración de las conexiones MCP con las que se inició.

## Cómo se inician las Sessions {#how-sessions-start}

Crea una Session con `POST /v1/agents/sessions`. La Session indica `source: "direct"`.

## Ejecutar una Session {#run-a-session}

El flujo de eventos nativo es **solo en vivo**: los eventos no se reproducen tras una desconexión. Ábrelo antes de enviar la entrada y lee el historial desde los items o los turnos.

```bash
# 1. Create the Session
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-2026-10-06" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"}'

# 2. In another terminal, follow live events (server-sent events)
curl -N https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# 3. Send input (202 Accepted, no body)
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "List three notable launches this week."}]}'

# 4. Read the history afterwards
curl "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

El mismo flujo con el SDK oficial de OpenAI para Python. Abre primero el flujo, envía la entrada desde otro hilo y detente en el evento de turno final. Consulta [Compatibilidad con OpenAI](/agents/openai-compatibility) para ver la versión de Node.js y las diferencias del SDK.

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
session = client.beta.agents.sessions.create(
    agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
        }],
        idempotency_key="market-scan-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break
```

Cada envío lleva exactamente un evento. `input` es una cadena de texto o un array con exactamente un mensaje de usuario que tiene exactamente una parte `input_text`: `[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`. Cualquier otra forma devuelve `400 invalid_request`. Para detener el turno en curso, envía `{"type": "agent.session.input.cancel"}` o llama a `POST /v1/agents/sessions/{session_id}/cancel` con un `Idempotency-Key`. Cancelar una Session inactiva también devuelve `202 {"accepted": true}` y no cambia nada. También puedes pasar un primer `input` al crear la Session. No se admite `stream: true` al crearla.

## Estado y fallos {#status-and-failures}

| Campo | Valores | Significado |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | Estado de ejecución de la Session |
| `lifecycle_status` | `active`, `archived` | Si la Session acepta entradas |
| `failure` | `null` o `{code, message, action, retryable?}` | Motivo público del fallo y el siguiente paso sugerido |

`failure.action` te indica qué hacer: `retry_later`, `inspect_history`, `create_new_session`, `check_model_account` o `create_session_with_updated_model_provider`. Consulta la [tabla de códigos de fallo](/api-reference/sessions/#status-fields).

Las herramientas de función que piden un resultado al cliente (`requires_action`) aún no se admiten; leer una Session así devuelve `502 executor_contract_error`.

Si un envío devuelve `409 session_input_pending`, la entrada anterior todavía se está entregando. Espera y lee la Session; no reenvíes con un nuevo `Idempotency-Key`, o la entrada podría ejecutarse dos veces.

## Archivar {#archive}

`DELETE /v1/agents/sessions/{session_id}` archiva una Session; las Sessions no se eliminan de forma definitiva. `POST /v1/agents/sessions/{session_id}/archive` y `/unarchive` reciben `{"row_version": …}`. Las Sessions archivadas conservan su historial, pero rechazan entradas, actualizaciones de metadatos y flujos.

## Adjuntos {#attachments}

Sube un archivo al espacio de trabajo de la Session con `POST /v1/agents/sessions/{session_id}/files` (campo multipart `file`, hasta 5 MiB, `Idempotency-Key` obligatorio). Los tipos admitidos son `.txt`, `.md`, `.csv`, `.log`, `.json`, `.pdf`, `.png`, `.jpg`, `.jpeg` y `.webp`. Cuando el `status` del archivo sea `ready`, envíalo junto con hasta nueve más:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## Reconexión de clientes {#reconnecting-clients}

Los clientes de tipo navegador que necesitan una vista coherente tras perder la conexión pueden llamar a `POST /v1/agents/sessions/{session_id}/reconnect`. Devuelve la Session y una `stream_url` para `GET /v1/agents/sessions/{session_id}/events/stream`, que envía primero un `session.snapshot` y después los eventos en vivo y `heartbeat`. Si ese flujo emite `stream.interrupted`, vuelve a reconectar en lugar de reenviar la entrada.

## Repositorio de GitHub {#github-repository}

Envía `github_workspace` al crear la Session para clonar un repositorio de GitHub en `/workspace` y permitir que el Agent haga push a sus propias ramas de Session. Consulta [Espacio de trabajo con repositorio de GitHub](/agents/github-workspace).

## Credenciales del modelo {#model-credentials}

Una Session llama a los modelos con la API key que la creó, salvo que envíes `model_provider`. Usa `{"type": "custom", "base_url": "https://…", "api_key": "…"}` para ejecutarla contra tu propio endpoint HTTPS compatible con OpenAI. `model_provider` es de solo escritura.

## ID {#ids}

| Prefijo | Recurso |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `skl_` | Skill |
| `mcp_` | Conexión MCP |
| `sec_` | Secret |
| `fil_` | Adjunto de Session |

Trata los ID como cadenas opacas.

## Próximos pasos {#next-steps}

- [Referencia de la API de Sessions](/api-reference/sessions/)
- [Compatibilidad con OpenAI](/agents/openai-compatibility)

## Archivos del espacio de trabajo y artefactos generados {#workspace-files-and-generated-artifacts}

Estos tres recursos tienen propósitos distintos:

| Recurso | Úsalo para | Paginación |
|---|---|---|
| [Adjuntos](/api-reference/sessions/list-files) | Archivos que subiste y que puedes referenciar en la entrada con un `file_id` | `limit` / `offset` |
| [Archivos del espacio de trabajo](/api-reference/sessions/list-workspace-files) | Rutas y tamaños actuales de los archivos en un directorio del espacio de trabajo | `page` / `next` |
| [Artefactos](/api-reference/sessions/list-artifacts) | Resultados generados inmutables disponibles para descargar | `after` / `last_id` |

Lista los artefactos para obtener un ID `art_` y pasa exactamente ese ID a [Download Artifact](/api-reference/sessions/download-artifact). Una ruta del espacio de trabajo o el `file_id` de un adjunto no pueden sustituirlo. El listado del espacio de trabajo solo devuelve metadatos y no es una API de descarga de rutas arbitrarias. Los artefactos se pueden descargar como archivos completos de hasta 200 MiB; no se admiten descargas parciales con `Range`.
