---
i18nSource: 2ffb24dad49b9c79
title: Obtener una ejecución asíncrona
description: Consulta una ejecución asíncrona de modelo o de API de SandBase y obtén su resultado actual o final.
aside: false
outline: false
apiReference:
  title: Obtener una ejecución asíncrona
  operation: Models
  method: GET
  path: /v1/run/{id}
  description: Obtén el estado actual o final de una ejecución asíncrona creada con POST /v1/run.
  groups:
    - title: Parámetros de ruta
      fields:
        - name: id
          type: string
          required: true
          description: Identificador opaco de la ejecución devuelto por POST /v1/run. Úsalo exactamente como se devuelve; no se garantiza ningún prefijo.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/run/opaque-run-id \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "completed",
        "outputs": [{"url":"https://media.sandbase.ai/files/result.png","content_type":"image/png"}]
      }
---

<ApiReferencePage />

## Consulta periódica {#polling}

Consulta cada 5–10 segundos en las tareas de medios o de API de larga duración. Detente cuando `status` sea `completed`, `failed` o `timeout`. Una respuesta no terminal puede omitir `outputs`; trata el ID de ejecución como opaco y no construyas una URL de estado distinta.
