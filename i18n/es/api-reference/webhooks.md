---
i18nSource: efd4d5f7b8980661
title: Webhooks
description: Registra y gestiona webhooks de SandBase para eventos asíncronos de modelos.
---

# Webhooks {#webhooks}

SandBase admite dos modos de callback salientes:

- **Webhooks registrados**: pertenecen a tu organización, se suscriben a eventos asíncronos de modelos e incluyen una firma HMAC en `X-Signature`.
- **Callbacks de modelo por tarea**: usan `webhook_url` en una sola solicitud asíncrona de imagen, video o audio. No requieren registro y no incluyen `X-Signature`.

Ambos modos usan entrega at-least-once (al menos una vez). Haz que tus handlers sean idempotentes usando el ID del evento.

## Registrar un webhook {#register-a-webhook}

La Events API es la superficie pública con API key:

```text
POST https://api.sandbase.ai/events/webhooks
```

También puedes crear y gestionar webhooks desde la [página Webhooks de la Console](https://www.sandbase.ai/console/webhooks).

```bash
curl -X POST https://api.sandbase.ai/events/webhooks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Model generation monitor",
    "url": "https://example.com/hooks/sandbase",
    "resourceType": "model",
    "events": ["model.generation.completed", "model.generation.failed"]
  }'
```

| Campo | Tipo | Obligatorio | Descripción |
|---|---|---:|---|
| `name` | string | Sí | Un nombre legible. |
| `url` | string | Sí | Un endpoint HTTP(S) válido. Usa HTTPS en producción. |
| `resourceType` | `model` | Sí | Selecciona los eventos asíncronos de modelos que se indican más abajo. `model` es el único valor admitido. |
| `events` | string[] | No | Vacío u omitido significa todos los eventos actuales y futuros del tipo de recurso seleccionado. |
| `enabled` | boolean | No | El valor predeterminado es `true`. |
| `signatureSecret` | string | No | Omite este campo para que SandBase genere un secreto de alta entropía. Los clientes existentes pueden seguir enviando su propio valor no vacío. |

Los tipos de recurso `session`, `sandbox` y `template` están retirados: crear un webhook con cualquiera de ellos devuelve HTTP 400. Los registros existentes de estos tipos se listan para que puedas limpiarlos: un `PATCH` sobre ellos devuelve HTTP 400 salvo que la misma solicitud cambie `resourceType` a `model` (y la suscripción resultante sea válida), así que elimínalos o conviértelos a `model`. Las suscripciones `model` solo están disponibles para los eventos terminales asíncronos de imagen, video y audio que se indican más abajo. La API rechaza eventos de otros tipos de recurso y nombres de eventos desconocidos.

### Respuesta correcta {#successful-response}

La Events API devuelve directamente el webhook registrado. El `signatureSecret` final solo se incluye en esta respuesta de creación. Guárdalo de forma segura ahora: las respuestas de listado y edición nunca lo devuelven y no se puede recuperar más adelante.

```json
{
  "id": "wh_01...",
  "name": "Model generation monitor",
  "url": "https://example.com/hooks/sandbase",
  "resourceType": "model",
  "events": ["model.generation.completed", "model.generation.failed"],
  "enabled": true,
  "createdAt": "2026-07-15T12:00:00Z",
  "signatureSecret": "whsec_<one-time-value>"
}
```

La [página Webhooks de la Console](https://www.sandbase.ai/console/webhooks) muestra el secreto generado una sola vez tras el registro y te pide que lo guardes antes de cerrar el diálogo.

### Listar, editar y eliminar {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

Usa la misma autenticación con API key. Un `PATCH` puede incluir uno o varios de `name`, `url`, `resourceType`, `events` y `enabled`; los campos omitidos no cambian. La suscripción resultante completa de `resourceType` y `events` debe ser válida. Un array `events` vacío sigue significando todos los eventos de ese tipo de recurso.

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

`signatureSecret` no se puede ver ni cambiar mediante `PATCH`; se rechaza cualquier solicitud que lo contenga. Si pierdes el secreto, elimina y vuelve a crear el webhook. También puedes ver, editar, habilitar o deshabilitar y eliminar registros desde la [página Webhooks de la Console](https://www.sandbase.ai/console/webhooks).

`GET` devuelve un array JSON de webhooks (sin `signatureSecret`), `PATCH` devuelve el webhook actualizado y `DELETE`
devuelve `204 No Content`.

### Autenticación y errores {#authentication-and-errors}

La Events API acepta la API key como `Authorization: Bearer $SANDBASE_API_KEY` o `X-API-Key: $SANDBASE_API_KEY`. Si
se envían ambos, se usa el encabezado Bearer.

Los errores usan su propio cuerpo, con el estado HTTP repetido en `code`:

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

Decide según el estado HTTP. `401` significa que la clave falta, no es válida o fue revocada; `400` significa que el cuerpo de la solicitud o
la suscripción no son válidos; `404` (`webhook not found`) significa que el webhook no existe en tu organización.

## Callback de modelo por tarea {#per-task-model-callback}

Para una sola tarea asíncrona de imagen, video o audio, añade `webhook_url` a `POST /v1/run` en lugar de registrar un webhook nuevo:

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "example/async-image-model",
    "mode": "async",
    "prompt": "A lighthouse at night",
    "webhook_url": "https://hooks.example.com/sandbase/task?token=opaque-token"
  }'
```

El campo solo se analiza y valida cuando el modelo seleccionado es de imagen, video o audio y la solicitud se resuelve como ejecución asíncrona. En ese caso debe ser una cadena no vacía que contenga una URL HTTPS pública, válida y segura; de lo contrario, la solicitud devuelve HTTP 400. En solicitudes síncronas, de streaming, de LLM u otras no admitidas, SandBase ignora `webhook_url` sea cual sea su valor JSON: no programa ningún callback, no almacena ninguna URL de callback y no reenvía el campo al proveedor del modelo. Omitir el campo mantiene el flujo de consulta periódica existente.

El destino debe ser una URL HTTPS pública. SandBase envía el mismo sobre terminal de modelo documentado más abajo, con `Content-Type: application/json` y `X-Event-ID`, para completed, failed, timeout o cancelled. Puede reintentar una entrega fallida, así que elimina duplicados por `id` o `X-Event-ID` y devuelve 2xx rápidamente.

Un callback por tarea no tiene un secreto compartido de SandBase y, por tanto, **no** incluye `X-Signature`. Si tu endpoint requiere verificación HMAC, omite `webhook_url` y registra en su lugar un Model Webhook de la organización. Puedes incluir en la query de la URL HTTPS un token de capacidad opaco generado por tu propio sistema y validarlo en tu endpoint. Trata esa URL como información sensible.

Para cada tarea de modelo asíncrona, la selección del destino es exclusiva. Si la solicitud incluye un `webhook_url` válido, SandBase envía el evento terminal de esa Prediction solo a la URL de la tarea y omite todos los Model Webhooks registrados de la organización para ese evento. Si la solicitud omite `webhook_url`, los Model Webhooks registrados de la organización siguen recibiendo los eventos coincidentes con normalidad. Un fallo de entrega por tarea se reintenta en la misma URL de la tarea y nunca recurre a un webhook registrado. Esta prioridad no crea, reemplaza, deshabilita ni modifica ningún registro, y no afecta a otros eventos de modelos.

## Tipos de eventos {#event-types}

### Generación de modelos {#model-generation}

Los webhooks de modelos solo están disponibles para la generación asíncrona de imagen, video y audio. No se emiten para solicitudes síncronas de imagen/video/audio ni para ninguna solicitud síncrona de LLM: esos resultados se devuelven en la respuesta HTTP original.

| Evento | Descripción |
|---|---|
| `model.generation.completed` | Se completó una generación asíncrona de imagen, video o audio. |
| `model.generation.failed` | Falló una generación asíncrona de imagen, video o audio. |
| `model.generation.timeout` | Se agotó el tiempo de una generación asíncrona de imagen, video o audio. |
| `model.generation.cancelled` | Se canceló una generación asíncrona de imagen, video o audio. |

## Payload de entrega {#delivery-payload}

SandBase envía `Content-Type: application/json` y el siguiente sobre JSON. `data` es específico de cada evento y puede incorporar campos con el tiempo.

### Ejemplo de finalización de modelo {#model-completion-example}

```json
{
  "id": "model_pred_01_completed",
  "resourceType": "model",
  "resourceID": "pred_01...",
  "type": "model.generation.completed",
  "data": {
    "predictionID": "pred_01...",
    "model": "example-image-model",
    "generationType": "image",
    "status": "completed",
    "completedAt": "2026-07-14T09:30:38Z",
    "outputs": ["https://.../generated-image.png"]
  },
  "createdAt": "2026-07-14T09:30:38Z"
}
```

Los eventos de fallo y de tiempo agotado omiten las salidas y solo contienen la categoría de error saneada.

| Campo | Descripción |
|---|---|
| `id` | ID único del evento. Úsalo, o `X-Event-ID`, como clave de idempotencia. |
| `resourceType` | `model`. |
| `resourceID` | El ID de la Prediction afectada. |
| `type` | Tipo de evento de la tabla anterior. |
| `data` | Datos específicos del evento. |
| `createdAt` | Hora de creación del evento en RFC 3339 UTC. |

## Verificar la firma de un webhook registrado {#verify-a-registered-webhook-signature}

Cada entrega de un webhook registrado incluye estos encabezados:

| Encabezado | Valor |
|---|---|
| `X-Event-ID` | El `id` del payload. |
| `X-Signature` | HMAC-SHA256 en hexadecimal en minúsculas del cuerpo sin procesar de la solicitud, con `signatureSecret` como clave. |

Verifica la firma con los bytes sin procesar de la solicitud antes de analizar el JSON. Los callbacks `webhook_url` por tarea no incluyen este encabezado y no pueden usar este flujo de verificación. Los siguientes handlers son para webhooks registrados: primero verifican, después analizan, usan `id` como clave de idempotencia y delegan el trabajo a una función asíncrona. Reemplaza la llamada de cola de ejemplo por tu propia cola o worker duradero.

::: code-group

```javascript [Node.js + Express]
import crypto from 'node:crypto'
import express from 'express'

const app = express()
const webhookSecret = process.env.SANDBASE_WEBHOOK_SECRET
if (!webhookSecret) throw new Error('SANDBASE_WEBHOOK_SECRET is required')
const acceptedEventIDs = new Set() // Use a DB unique key in production.

function enqueueSandBaseEvent(event) {
  setImmediate(() => {
    console.log(`processing ${event.type} (${event.id})`)
    // Perform slow business work here or publish to your durable queue.
  })
}

// This route must be registered before express.json() for the webhook path.
app.post('/hooks/sandbase', express.raw({ type: 'application/json' }), (req, res) => {
  const rawBody = req.body
  const signature = req.get('X-Signature') || ''

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')

  const received = Buffer.from(signature, 'utf8')
  const expectedBuffer = Buffer.from(expected, 'utf8')
  if (received.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, received)) {
    return res.status(401).json({ error: 'invalid signature' })
  }

  const event = JSON.parse(rawBody.toString('utf8'))
  if (acceptedEventIDs.has(event.id)) return res.sendStatus(204)
  acceptedEventIDs.add(event.id)
  enqueueSandBaseEvent(event)
  return res.sendStatus(204)
})

app.listen(3000)
```

```python [Python + Flask]
import hashlib
import hmac
import json
import os
import threading

from flask import Flask, abort, request

app = Flask(__name__)
webhook_secret = os.environ["SANDBASE_WEBHOOK_SECRET"].encode()
accepted_event_ids = set()  # Use a DB unique key in production.
accepted_event_ids_lock = threading.Lock()

def process_sandbase_event(event):
    print(f"processing {event['type']} ({event['id']})")
    # Perform slow business work here or publish to your durable queue.

@app.post("/hooks/sandbase")
def sandbase_webhook():
    raw_body = request.get_data(cache=True)
    received = request.headers.get("X-Signature", "")
    expected = hmac.new(webhook_secret, raw_body, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, received):
        abort(401, "invalid signature")

    event = json.loads(raw_body)
    with accepted_event_ids_lock:
        if event["id"] in accepted_event_ids:
            return "", 204
        accepted_event_ids.add(event["id"])
    threading.Thread(target=process_sandbase_event, args=(event,), daemon=True).start()
    return "", 204
```

:::

La entrada del HMAC es el cuerpo sin procesar exacto. No llames a un parser JSON ni vuelvas a serializar el payload antes de calcularlo.

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## Comportamiento de la entrega {#delivery-behavior}

- Una respuesta en el rango `2xx` en menos de 10 segundos se considera correcta.
- Los errores de red, los tiempos agotados y las respuestas que no son 2xx son fallos. El despachador de eventos existente puede reintentar las entregas fallidas; los receptores deben tolerar entregas duplicadas.
- Devuelve una respuesta 2xx tras aceptar el evento de forma duradera y luego realiza el trabajo lento de forma asíncrona. Los ejemplos usan deduplicación en memoria solo para poder ejecutarse; los receptores de producción deben reemplazarla por una clave única en base de datos o una cola duradera. No supongas una entrega exactly-once ni un orden de eventos.
