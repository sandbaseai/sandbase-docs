---
i18nSource: efa205ed7505643c
title: Ejecutar un modelo o una capacidad de API
description: Envía un modelo o una capacidad de API de SandBase a través del endpoint de ejecución unificado.
aside: false
outline: false
apiReference:
  title: Ejecutar un modelo o una capacidad de API
  operation: Models
  method: POST
  path: /v1/run
  description: Ejecuta un modelo o una capacidad de API habilitados de SandBase. Los campos de la solicitud dependen de la capacidad; usa la página de referencia del modelo o de la API en el sitio web de SandBase para ver el esquema de la capacidad seleccionada.
  groups:
    - title: Cuerpo de la solicitud
      fields:
        - name: model
          type: string
          required: true
          description: Identificador del modelo lógico o de la capacidad de API habilitados.
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: Sugerencia de modo de ejecución. `auto` usa el valor por defecto configurado de la capacidad seleccionada; los demás valores requieren que la capacidad los admita.
        - name: stream
          type: boolean
          required: false
          description: "Solicita salida en streaming cuando la capacidad seleccionada lo admite. Equivale a `mode: stream`."
        - name: webhook_url
          type: string
          required: false
          description: Callback HTTPS opcional para imagen asíncrona compatible
          video: null
          or audio tasks. See the Webhooks reference for validation and delivery behavior.: null
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## Ejecución y resultados {#execution-and-results}

Las capacidades síncronas devuelven una respuesta completa en la solicitud original. Las capacidades asíncronas devuelven `202 Accepted` con un `id` opaco; consulta [Obtener una ejecución asíncrona](./run-get) hasta que el estado sea final.

Los campos de solicitud y las formas de salida específicos de cada capacidad se definen en la página del modelo o de la operación de API seleccionada. Envía esos campos en el nivel superior del cuerpo JSON; no los envuelvas en un objeto `input`. No supongas que todas las capacidades aceptan los mismos parámetros.

## Callbacks de webhook {#webhook-callbacks}

Define `webhook_url` solo para las tareas asíncronas de imagen, video o audio compatibles. SandBase envía el evento final de la ejecución al endpoint HTTPS cuando termina o falla; el callback es un aviso de entrega, no un sustituto de `GET /v1/run/{id}`. Sigue consultando siempre el endpoint de la ejecución para obtener el estado definitivo y reintenta de forma segura cuando un callback se retrase o llegue duplicado. Las respuestas síncronas de modelos y los endpoints nativos de proveedores no usan este campo de callback.
