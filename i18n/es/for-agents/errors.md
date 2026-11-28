---
i18nSource: 95410ff7ea741f64
title: Guía de errores legible por IA
description: Gestiona los errores de la API de SandBase según la familia de endpoints, el estado HTTP, la seguridad de los reintentos y la forma de respuesta documentada.
---

# Gestión de errores para clientes de IA {#error-handling-for-ai-clients}

SandBase no expone un esquema de error universal. Ramifica primero según el estado HTTP y después analiza la forma de respuesta
documentada para la familia de endpoints. No supongas que todas las respuestas contienen `code`, `param`, `request_id` o un
mensaje concreto.

## Formas de respuesta públicas {#public-response-shapes}

El middleware principal de `/v1/*` y varios endpoints de modelos o recursos devuelven un error plano:

```json
{"error":"organization rate limit exceeded"}
```

Los recursos de la plataforma de Agents (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`,
`/v1/skills*`) devuelven un objeto al estilo de OpenAI con un `code` estable. Consulta [Errores de la plataforma de Agents](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Los gateways compatibles con OpenAI conservan un envoltorio compatible con OpenAI. `POST /v1/messages` conserva el
envoltorio compatible con Anthropic:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## Gestión de estados HTTP {#http-status-handling}

| Estado | Significado | Acción del cliente |
|---|---|---|
| `400` | Entrada no válida o parámetro no admitido | Corrige la solicitud según el esquema del endpoint y del modelo seleccionados. |
| `401` | Credencial ausente, no válida, revocada o caducada | Sustituye o rota la credencial; no reintentes sin cambios. |
| `402` | La solicitud no se puede financiar o se alcanzó un límite de gasto | Resuelve la facturación o los límites de la clave antes de reintentar. |
| `403` | La credencial no tiene permiso, o una superficie de compatibilidad asigna un fallo de gasto a 403 | Revisa el envoltorio documentado y usa una clave autorizada. |
| `404` | Modelo o recurso no encontrado | Verifica el nombre actual del modelo o el ID del recurso. |
| `409` | Conflicto de estado del recurso | Lee el estado más reciente del recurso antes de decidir si es seguro reintentar. |
| `429` | Límite de solicitudes de la organización o límite de concurrencia de video | Reintenta con retroceso exponencial acotado y jitter. |
| `500`, `502`, `503`, `504` | Fallo transitorio de SandBase o del servicio de origen | Reintenta solo cuando sea seguro repetir la operación. |

## Mensajes de autenticación y de límite de frecuencia {#authentication-and-rate-limit-messages}

Los mensajes de autenticación documentados incluyen:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Una clave con ámbito usada fuera de su ámbito devuelve `403` con un cuerpo anidado: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Los recursos de la plataforma de Agents devuelven el mismo `code` en su propio envoltorio.

El mensaje documentado de límite de frecuencia es `organization rate limit exceeded` (el límite de solicitudes por minuto asignado a la organización,
compartido por todas sus API keys). Actualmente, una respuesta `429` no incluye los encabezados `Retry-After` ni
`X-RateLimit-*`, y no hay un valor predeterminado universal publicado de RPM ni de concurrencia.

## Búsqueda de modelos y recursos {#model-and-resource-lookup}

Usa `GET /v1/models` para descubrir los ID de modelos habilitados y `GET /v1/models/{id_or_name}` para inspeccionar un modelo antes
de ejecutarlo. Trata los ID de recursos como opacos y verifícalos con la operación de listado u obtención correspondiente. No construyas una
URL de sondeo distinta a partir del prefijo de un ID.

## Algoritmo de reintentos {#retry-algorithm}

Usa retroceso exponencial acotado con jitter:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

Aplica estas reglas:

- reintenta los `429` tras un retardo calculado por el cliente;
- reintenta las respuestas `5xx` transitorias solo un número pequeño y acotado de veces;
- no reintentes sin cambios una solicitud `400`, `401`, `402`, `403` o `404`;
- comprueba la idempotencia antes de repetir cualquier solicitud de creación, activación o acción externa;
- conserva la salida parcial cuando falle un flujo y decide si es seguro continuar o reiniciar;
- muestra al llamador el estado HTTP final y el error saneado específico del endpoint.

## Errores de la plataforma de Agents {#agents-platform-errors}

Agents, Sessions, Skills, conexiones MCP y Secrets devuelven un único envoltorio. En la mayoría de los códigos, `message` es una frase fija y segura; `invalid_request` puede incluir una breve explicación, como qué forma de entrada u opción no se admite. Ramifica según `code`, no según `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` es `authentication_error` para 401, `server_error` para 5xx e `invalid_request_error` en los demás casos.

| HTTP | `code` | Significado | Qué hacer |
|---|---|---|---|
| 400 | `invalid_request` | Campos mal formados o desconocidos, validación fallida o una opción no admitida | Corrige la solicitud; no reintentes sin cambios |
| 400 | `skill_not_found` | Una Skill o versión referenciada no está disponible | Corrige `skills` del Agent |
| 401 | `unauthorized` | Encabezados de API key ausentes, no válidos o en conflicto | Revisa `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Se agotó el límite de gasto de la clave o el saldo de la organización | Añade créditos o aumenta el límite |
| 403 | `insufficient_scope` | La clave tiene un ámbito limitado y no puede usar recursos de Agents | Usa una clave estándar creada en la Console |
| 403 | `org_disabled` | La organización no tiene permiso para ejecutar Agents | Contacta con soporte |
| 404 | `not_found` | El recurso no existe en tu organización | Revisa el ID |
| 409 | `conflict` | `row_version` obsoleto, un estado que no permite el cambio o un `Idempotency-Key` reutilizado con un cuerpo distinto | Vuelve a leer el recurso y luego decide |
| 409 | `session_input_pending` | La entrada anterior todavía se está entregando | Espera; no reenvíes con una clave nueva |
| 409 | `session_input_expired` | La admisión de la entrada caducó | Revisa el historial antes de volver a enviar |
| 409 | `session_environment_unavailable` | El entorno de ejecución no está disponible | Espera o crea una Session nueva |
| 413 | `request_too_large` | El cuerpo de la solicitud, o la configuración de Session congelada a partir de él, supera el límite de tamaño | Envía un cuerpo más pequeño; no reintentes sin cambios |
| 429 | `quota_exceeded` | Se superó la cuota de Agents | Reintenta más tarde |
| 502 | `executor_rejected`, `executor_contract_error` | La capa de ejecución rechazó la solicitud o respondió de forma inesperada | Revisa la configuración del Agent y reintenta |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Una dependencia no está disponible temporalmente | Reintenta con retroceso y el mismo `Idempotency-Key` |

También puede aparecer `skill_runtime_incompatible`; se devuelve como 503 con el mensaje `internal error`.

## Fallos en el streaming {#streaming-failures}

Una vez iniciada una respuesta en streaming, un fallo puede llegar en el formato de flujo del protocolo en lugar de como un nuevo
estado HTTP. Trata el flujo como incompleto, ciérralo, conserva el contenido parcial que necesite la aplicación y
reintenta solo cuando sea seguro repetir la solicitud.

## Consulta también {#see-also}

- [Códigos de error](/api-reference/errors): formatos de respuesta públicos y estados HTTP habituales
- [Límites de frecuencia](/guides/rate-limiting): gestión de 429 y suavizado de solicitudes
- [Errores y reintentos](/guides/error-handling): patrones de implementación
- [Autenticación](/api-reference/authentication): credenciales admitidas y ciclo de vida de las claves
