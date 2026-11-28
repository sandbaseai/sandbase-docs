---
i18nSource: ac4e3b9b9eef4c7d
title: Errores de la API
description: Gestiona los errores de la API de SandBase según el estado HTTP, la familia de endpoints, la forma de respuesta documentada y la seguridad de los reintentos.
---

# Errores de la API {#api-errors}

SandBase usa códigos de estado HTTP estándar, pero no expone un cuerpo de error universal. Ramifica primero según el estado HTTP y luego analiza el esquema de respuesta documentado para el endpoint al que llamaste. No exijas que todos los errores contengan `code`, `param`, `message` o `request_id`.

## Formas de respuesta {#response-shapes}

El middleware principal y varios endpoints `/v1/*` devuelven un error plano:

```json
{"error":"organization rate limit exceeded"}
```

Los recursos de la plataforma de Agents (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*`) devuelven un objeto al estilo de OpenAI con un `code` estable. Consulta [Errores de la plataforma de Agents](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

La Events API de webhooks (`/events/webhooks*`) devuelve `{"code":<http status>,"message":"..."}`. Consulta [Webhooks](/api-reference/webhooks#authentication-and-errors).

Los endpoints compatibles con OpenAI conservan un sobre compatible con OpenAI. `POST /v1/messages` conserva un sobre compatible con Anthropic:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

Usa la [especificación OpenAPI](/openapi.yaml) para conocer los códigos de estado y esquemas exactos de una operación pública.

## Manejo de estados HTTP {#http-status-handling}

| Estado | Significado habitual | Acción del cliente |
|---|---|---|
| `400` | Entrada no válida o parámetro no admitido | Corrige la solicitud según el esquema del endpoint y del modelo seleccionado. |
| `401` | Credencial ausente, no válida, revocada o caducada | Reemplaza o rota la credencial; no reintentes sin cambios. |
| `402` | La solicitud no se puede financiar o se alcanzó un límite de gasto | Resuelve el saldo o el límite de la clave antes de reintentar. |
| `403` | La credencial no tiene permiso, o un endpoint de compatibilidad asigna un fallo de gasto a 403 | Revisa el sobre específico del endpoint y usa una clave autorizada. |
| `404` | El modelo o recurso no está disponible para quien llama | Verifica el ID de modelo o de recurso actual. |
| `409` | Conflicto de estado del recurso | Lee el estado más reciente antes de decidir si es seguro reintentar. |
| `422` | Entrada de recurso semánticamente no válida | Corrige los valores de los campos documentados. |
| `429` | Límite de solicitudes de la organización o límite de concurrencia de video | Reintenta con backoff acotado y jitter cuando la operación se pueda repetir con seguridad. |
| `500`, `502`, `503`, `504` | Fallo de SandBase o del proveedor upstream | Reintenta solo cuando la operación se pueda repetir con seguridad. |

No todos los endpoints documentan todos los estados de esta tabla. El mapa de respuestas OpenAPI de la operación es el que manda.

## Errores de autenticación {#authentication-errors}

Los mensajes de autenticación documentados incluyen:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Una clave con alcance limitado usada fuera de su alcance devuelve `403` con un cuerpo anidado: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Los recursos de la plataforma de Agents devuelven el mismo `code` en su propio sobre.

Usa `Authorization: Bearer $SANDBASE_API_KEY` para los endpoints estándar. `POST /v1/messages` también acepta `x-api-key`; los endpoints compatibles con el protocolo de Google documentan sus propios encabezados de clave admitidos.

Una clave revocada no se puede volver a habilitar. Crea una de reemplazo, actualiza la aplicación que la usa, verifícala y luego elimina cualquier referencia restante a la clave antigua.

## Límites de tasa {#rate-limits}

`organization rate limit exceeded` (`429`) significa que tu organización alcanzó su límite asignado de solicitudes por minuto, que comparten todas sus claves de API. Los endpoints compatibles con protocolos lo devuelven en su propio sobre. SandBase no publica un límite numérico universal porque el límite se asigna por organización.

Si una respuesta incluye `Retry-After`, respétalo. De lo contrario, usa backoff exponencial acotado con jitter. Consulta [Límites de tasa](/guides/rate-limiting) para ver patrones de suavizado de solicitudes.

Los envíos de tareas tienen dos comprobaciones adicionales. `organization concurrency limit exceeded` (`429`) significa que tu organización ya tiene en curso tantas tareas como permite su nivel de cuenta; se resuelve cuando termina una tarea en ejecución. Se aplica a todos los tipos de modelo en `POST /v1/run` y `/v1/api/*`, y a los envíos de video en otros endpoints. `insufficient credit for estimated video cost` (`402`) significa que el costo estimado supera tu saldo más tu línea de crédito; recarga antes de reintentar. Consulta [Límites de concurrencia](/guides/concurrency-limits).

## Seguridad de los reintentos {#retry-safety}

Sigue este orden de decisión:

1. Determina si la operación ya produjo un efecto visible externamente.
2. No reintentes sin cambios una solicitud `400`, `401`, `402`, `403`, `404` o `422`.
3. Para `409`, lee el estado actual del recurso antes de reintentar.
4. Reintenta las respuestas `429` y `5xx` transitorias solo un número pequeño y acotado de veces.
5. Antes de repetir una solicitud de creación, disparo, subida o acción externa, confirma que la operación es idempotente o que tu aplicación puede conciliar duplicados.

Un retraso adecuado es:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Errores de la plataforma de Agents {#agents-platform-errors}

Agents, Sessions, Skills, conexiones MCP y Secrets devuelven un único sobre. Para la mayoría de los códigos, `message` es una frase fija y segura; `invalid_request` puede incluir una breve explicación, como qué forma de entrada u opción no se admite. Ramifica según `code`, no según `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` es `authentication_error` para 401, `server_error` para 5xx e `invalid_request_error` en los demás casos.

| HTTP | `code` | Significado | Qué hacer |
|---|---|---|---|
| 400 | `invalid_request` | Campos mal formados o desconocidos, validación fallida o una opción no admitida | Corrige la solicitud; no reintentes sin cambios |
| 400 | `skill_not_found` | Una Skill o versión referenciada no está disponible | Corrige los `skills` del Agent |
| 401 | `unauthorized` | Encabezados de clave de API ausentes, no válidos o en conflicto | Revisa `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Se agotó el límite de gasto de la clave o el saldo de la organización | Añade créditos o aumenta el límite |
| 403 | `insufficient_scope` | La clave tiene alcance limitado y no puede usar recursos de Agents | Usa una clave estándar creada en la Console |
| 403 | `org_disabled` | La organización no tiene permitido ejecutar Agents | Contacta con soporte |
| 404 | `not_found` | El recurso no existe en tu organización | Revisa el ID |
| 409 | `conflict` | `row_version` obsoleto, un estado que no permite el cambio o una `Idempotency-Key` reutilizada con otro cuerpo | Vuelve a leer el recurso y luego decide |
| 409 | `session_input_pending` | Una entrada anterior aún se está entregando | Espera; no la reenvíes con una clave nueva |
| 409 | `session_input_expired` | La admisión de la entrada caducó | Revisa el historial antes de volver a enviar |
| 409 | `session_environment_unavailable` | El entorno de ejecución no está disponible | Espera o crea una Session nueva |
| 413 | `request_too_large` | El cuerpo de la solicitud, o la configuración de Session congelada a partir de él, supera el límite de tamaño | Envía un cuerpo más pequeño; no reintentes sin cambios |
| 429 | `quota_exceeded` | Se superó la cuota de Agents | Reintenta más tarde |
| 502 | `executor_rejected`, `executor_contract_error` | La capa de ejecución rechazó la solicitud o respondió de forma inesperada | Revisa la configuración del Agent y luego reintenta |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Una dependencia no está disponible temporalmente | Reintenta con backoff y la misma `Idempotency-Key` |

También puede aparecer `skill_runtime_incompatible`; se devuelve como 503 con el mensaje `internal error`.

## Fallos de streaming {#streaming-failures}

Una vez iniciado un stream, un error puede llegar en el formato de stream de ese protocolo en lugar de como una nueva respuesta HTTP. Trata el stream como incompleto, conserva cualquier salida parcial que necesite tu aplicación y reintenta solo cuando sea seguro regenerar la solicitud. No supongas que todos los proveedores emiten el mismo evento final o motivo de finalización.

## Depuración operativa {#operational-debugging}

Registra el endpoint, el estado HTTP, el modelo o ID de recurso seleccionado, la marca de tiempo y cualquier identificador de solicitud seguro devuelto por el servidor. Nunca registres encabezados de autorización, claves de API, valores de credenciales ni contenido sensible de los prompts.

Usa [Developer → Activities](https://www.sandbase.ai/console/activities) para revisar el historial de solicitudes de la organización. Al reportar un fallo persistente, incluye metadatos de la solicitud depurados y la solicitud reproducible más pequeña.

## Consulta también {#see-also}

- [Autenticación](/api-reference/authentication)
- [Errores y reintentos](/guides/error-handling)
- [Límites de tasa](/guides/rate-limiting)
- [Guía de errores legible por IA](/for-agents/errors)
