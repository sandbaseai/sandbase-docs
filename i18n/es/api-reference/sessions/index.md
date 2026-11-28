---
i18nSource: 99170a141af66587
title: Sessions API
description: Ejecuta una versión guardada de un Agent, envía entradas, transmite eventos y lee el historial de la Session.
---

# Sessions API {#sessions-api}

Una Session ejecuta una versión guardada de un [Agent](/api-reference/agents/) en la nube alojada de SandBase; no hay que elegir entorno de ejecución. Los IDs de Session usan el prefijo `ses_`. Las Sessions son un subrecurso de los Agents: todas las rutas empiezan por `/v1/agents/sessions`.

Las operaciones estándar siguen el protocolo de OpenAI Agents (`client.beta.agents.sessions`); consulta [Compatibilidad con OpenAI](/agents/openai-compatibility) para ver qué puede y qué no puede hacer el SDK oficial. Las extensiones de SandBase añaden cambio de nombre, estado de archivado, cancelación, adjuntos, metadatos de archivos del workspace, artefactos inmutables y un flujo de producto con reconexión.

::: info De dónde vienen las Sessions
Creas una Session directamente con `POST /v1/agents/sessions`. La Session indica `source: "direct"` y `source_id: null`.
:::

## Flujo recomendado {#recommended-flow}

1. [Crea una Session](./create) para un Agent guardado. La Session congela la versión del Agent seleccionada y las conexiones MCP, y usa las versiones de Skills ya fijadas en esa versión del Agent.
2. [Abre el flujo de eventos](./stream) con `GET /v1/agents/sessions/{session_id}/events`. El flujo es solo en vivo, así que ábrelo antes de enviar la entrada.
3. [Envía la entrada](./send-events) con `POST /v1/agents/sessions/{session_id}/events` y un evento `agent.session.input.message`. La llamada devuelve 202.
4. Lee los resultados del flujo o, después, de los [items](./items) y los [turns](./turns).

## Operaciones de Session {#session-operations}

| Método | Ruta | Propósito |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [Crear una Session](./create) |
| `GET` | `/v1/agents/sessions` | [Listar Sessions](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [Obtener una Session](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [Reemplazar metadatos](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | [Renombrar](./rename) con `row_version` |
| `DELETE` | `/v1/agents/sessions/{session_id}` | [Eliminar](./delete), lo que archiva la Session |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [Enviar un evento de entrada o de cancelación](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [Transmitir eventos en vivo](./stream) (SSE) |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [Listar items](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [Listar turns](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [Obtener un turn](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [Cancelar el turn en curso](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [Archivar](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [Desarchivar](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | [Reconectar](./reconnect) tras una caída del flujo |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [Flujo de instantánea y luego en vivo](./stream-snapshot) (SSE) |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [Subir un adjunto](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [Listar adjuntos](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [Descargar un adjunto](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [Eliminar un adjunto](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [Listar metadatos de archivos del workspace](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [Listar artefactos inmutables](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [Descargar un artefacto](./download-artifact) |

## Campos de estado {#status-fields}

- `status` es el estado de ejecución: `idle`, `in_progress` o `failed`. Las herramientas de función que requieren un resultado del cliente (`requires_action`) aún no se admiten; leer una Session en ese estado devuelve `502 executor_contract_error`.
- `lifecycle_status` es `active` o `archived`. Las Sessions archivadas rechazan entradas, actualizaciones de metadatos y flujos. `DELETE` archiva; `unarchive` restaura.
- `failure` es `null` o un objeto con `code`, `message`, `action` y, a veces, `retryable`.

| `failure.code` | Significado | `action` sugerida |
|---|---|---|
| `session_creation_rejected` | La capa de ejecución rechazó la Session | `create_new_session` |
| `model_authentication_failed` | El proveedor del modelo rechazó la clave | `create_session_with_updated_model_provider` |
| `model_rate_limited` | El proveedor del modelo está limitando la frecuencia (reintentable) | `retry_later` |
| `model_quota_exceeded` | La cuenta del modelo no tiene cuota | `check_model_account` |
| `context_limit_exceeded` | La conversación supera el contexto del modelo | `create_new_session` |
| `environment_connection_timeout` | El entorno no se conectó a tiempo (reintentable) | `retry_later` |
| `runtime_unavailable` | El entorno de ejecución no está disponible (reintentable) | `retry_later` |
| `model_request_failed` | La solicitud al modelo no se completó | `inspect_history` |
| `model_configuration_rejected` | El modelo o la capa de ejecución rechazó la configuración | `create_session_with_updated_model_provider` |
| `execution_failed` | Fallo sin una causa pública más específica | `inspect_history` |

Los resultados de las listas también pueden contener filas de marcador con `session_not_ready`, `session_execution_unavailable`, `session_configuration_unavailable` o `session_snapshot_unavailable` cuando una Session no se puede leer en vivo.

## Credenciales del modelo {#model-credentials}

De forma predeterminada, una Session llama a los modelos con la misma API key de SandBase que la creó. Envía `model_provider` para elegir de forma explícita:

- `{"type": "sandbase"}` usa la clave con la que llamas. No se permite `base_url`.
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}` llama a tu propio endpoint HTTPS compatible con OpenAI. La URL no puede contener credenciales, query ni fragmento, y SandBase nunca recurre a tu clave de SandBase como alternativa.

`model_provider` es de solo escritura y nunca aparece en las respuestas.

## Admisión y errores {#admission-and-errors}

Crear una Session y enviar entradas comprueba la admisión de la ejecución: `402 spending_limit_exceeded` cuando se agota el límite de la clave o el saldo de la organización, `403 org_disabled` cuando la organización no puede ejecutar Agents y `503 admission_unavailable` cuando la comprobación no puede completarse. Las lecturas, la cancelación y el archivado no se bloquean por el saldo.

Enviar entradas también puede devolver `409 session_input_pending` (una entrada anterior aún se está entregando; espera y no la reenvíes con una clave nueva), `409 session_input_expired` (revisa el historial antes de volver a enviar) o `409 session_environment_unavailable` (espera o crea una Session nueva). Consulta [Errores](/api-reference/errors#agents-platform-errors).

## Paginación {#pagination}

Las Sessions, los items, los turns y los artefactos usan paginación por cursor (`limit` 1-100, `after`, `order`). Los adjuntos usan paginación por desplazamiento (`limit` 1-100, `offset`).

Los archivos del workspace usan en su lugar paginación `page` / `next`. Consulta [Listar archivos del workspace](./list-workspace-files).
