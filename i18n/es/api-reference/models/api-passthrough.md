---
i18nSource: fb62188053fb216d
title: API Passthrough
description: Invoca capacidades de API habilitadas del catálogo mediante sus rutas calificadas con el proveedor.
aside: false
outline: false
apiReference:
  title: API Passthrough
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: Resuelve una capacidad habilitada del catálogo llamada vendor/upstream_path y ejecuta un objeto JSON a través del pipeline unificado de SandBase. También se admite GET para las capacidades que lo usan.
  groups:
    - title: Parámetros de ruta
      fields:
        - name: vendor
          type: string
          required: true
          description: Primer segmento del nombre de la capacidad.
        - name: upstream_path
          type: string
          required: true
          description: Resto de la ruta
          including literal slash-separated segments when present.: null
    - title: Cuerpo de la solicitud
      fields:
        - name: model
          type: string
          required: false
          description: Omítelo para usar la identidad vendor/path derivada de la URL. Si se indica
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: Campos definidos por el esquema en vivo de la capacidad seleccionada.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"url":"https://example.com"}'
---

<ApiReferencePage />

La URL se resuelve a un modelo habilitado llamado `vendor/upstream_path`. Usa el nombre exacto, calificado con el proveedor, que devuelve la [Models API](./). Los nombres de capacidades anidados se mantienen como segmentos de ruta literales, no como barras codificadas con porcentaje.

POST solo acepta un objeto JSON. Se permite un cuerpo POST vacío, que se comporta como un objeto que contiene el modelo derivado de la URL. GET usa un cuerpo vacío. Los campos de la respuesta y el comportamiento síncrono o asíncrono dependen de la capacidad seleccionada; consulta los resultados asíncronos mediante `GET /v1/run/{id}`.
