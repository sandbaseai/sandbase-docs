---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: Crea, transmite en streaming y consulta Interactions de modelos con el protocolo nativo de Google.
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: Crea una Interaction nativa de Google. Revisa status incluso con HTTP 200; una respuesta in_progress debe consultarse periódicamente.
  groups:
    - title: Cuerpo de la solicitud
      fields:
        - name: model
          type: string
          required: true
          description: Nombre lógico del modelo en SandBase.
        - name: input
          type: string | object | array
          required: true
          description: Entrada nativa de la Interaction de Google.
        - name: stream
          type: boolean
          required: false
          description: Devuelve eventos SSE de Google Interactions cuando el modelo lo admite.
        - name: background
          type: boolean
          required: false
          description: Envía la solicitud de forma persistente y devuelve una Interaction que se puede consultar de inmediato. No se puede combinar con stream.
        - name: previous_interaction_id
          type: string
          required: false
          description: Continúa a partir de una Interaction del proveedor conservando la afinidad de proveedor.
        - name: store
          type: boolean
          required: false
          description: Reenvía sin cambios la preferencia de almacenamiento del proveedor.
        - name: system_instruction
          type: string
          required: false
          description: Instrucción de sistema nativa.
        - name: tools
          type: array
          required: false
          description: Definiciones nativas de herramientas de Google.
        - name: generation_config
          type: object
          required: false
          description: Configuración nativa de generación.
        - name: response_format
          type: object | array
          required: false
          description: Formato de respuesta solicitado.
        - name: response_modalities
          type: array
          required: false
          description: Modalidades de salida solicitadas.
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## Autenticación {#authentication}

Usa `x-goog-api-key`, `Authorization: Bearer …` o el parámetro de consulta `key`, en ese orden de prioridad. Es preferible usar un encabezado, porque las credenciales en la query string pueden quedar registradas en logs.

## Modelos compatibles {#supported-models}

El endpoint Interactions no es una ruta genérica para cualquier modelo cuyo nombre en el catálogo empiece por `google/`. El modelo
debe tener una asignación de proveedor compatible con Interactions. Actualmente, SandBase documenta estos modelos compatibles:

- Gemini Omni Flash Preview: `google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview: `google/gemini-omni-1.1-flash-preview`

Otros modelos de Google usan otros endpoints. Por ejemplo, Nano Banana Pro y Nano Banana 2 usan
[`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content), no `/v1beta/interactions`. Un modelo no compatible falla en lugar de enrutarse
a través de otro protocolo de Google.

## Éxito y consulta periódica {#success-and-polling}

Los envíos correctos devuelven HTTP `200`, incluidos el trabajo en segundo plano y las solicitudes síncronas cuyo tiempo de espera limitado expira. Revisa siempre `status`:

- `completed`, `failed`, `cancelled` e `incomplete` son estados finales.
- `in_progress` sigue en ejecución. Consulta `GET /v1beta/interactions/{id}`; la respuesta también puede incluir esa ruta en el encabezado `Location`.
- `requires_action` es un estado del protocolo, pero SandBase actualmente no expone el endpoint de confirmación de herramientas necesario para avanzarlo.

El ID de consulta es el `id` de la Interaction del proveedor que devuelve `POST`, no un ID de predicción de SandBase. La misma clave de API de SandBase que creó la Interaction debe recuperarla.

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

Las respuestas GET no finales omiten la salida parcial y el uso. Las respuestas finales pueden incluir datos de imagen, audio o video en línea y ocupar varios megabytes. Descarga y guarda cuanto antes los archivos multimedia que necesites: cuando vence la retención del proveedor, SandBase solo puede devolver una respuesta final de respaldo con pérdida, con la estructura y los metadatos, pero no los bytes originales.

## Streaming {#streaming}

Define `stream: true` en el cuerpo de la solicitud. La respuesta es `text/event-stream`; este protocolo no usa `?alt=sse`. Los tipos de evento y de delta son abiertos y se reenvían sin una lista de permitidos fija, así que los clientes deben tolerar valores desconocidos. Una vez escritos los encabezados de streaming, los fallos llegan como un evento `error` en lugar de con otro estado HTTP.

El streaming depende del modelo. Un proveedor puede rechazar `stream: true` aunque el protocolo lo admita.

## Límites actuales {#current-limits}

Actualmente, SandBase solo expone create y get:

- Las Interactions de Agent se rechazan; usa `model`.
- `background: true` y `stream: true` no se pueden combinar.
- No se exponen las operaciones de listar, eliminar ni cancelar Interactions.
- No se exponen la entrega por URI ni la reconexión del stream mediante GET.
- `previous_interaction_id` requiere una asignación de afinidad de proveedor activa y compatibilidad del proveedor. SandBase falla en lugar de cambiar de proveedor sin aviso cuando la afinidad no está disponible.

Los errores usan el sobre de Google `{ "error": { "code", "message", "status" } }`. Considera estable el estado HTTP; el texto saneado del proveedor en `message` puede cambiar.
