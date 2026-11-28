---
i18nSource: 270917aea416aa76
title: Listar artefactos de Session
description: Lista los artefactos de salida capturados de una Session con paginación por cursor, IDs opacos, tamaños de archivo y enlaces de descarga.
aside: false
outline: false
apiReference:
  title: Listar artefactos de Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: Lista las salidas generadas inmutables de esta Session. Los IDs de artefacto son identificadores opacos con alcance de Session; pasa el ID devuelto sin cambios al endpoint de descarga. Los parámetros de consulta desconocidos o repetidos devuelven 400.
  groups:
    - title: Parámetros de ruta
      fields:
        - name: session_id
          type: string
          required: true
          description: ID de la Session (prefijo ses_).
    - title: Parámetros de consulta
      fields:
        - name: limit
          type: integer
          required: false
          description: Tamaño de página de 1 a 100; los valores no válidos devuelven 400.
          default: "20"
        - name: order
          type: string
          required: false
          description: asc o desc.
          default: desc
        - name: after
          type: string
          required: false
          description: ID de artefacto devuelto como last_id en la página anterior. Mantén el mismo orden al continuar.
    - title: Objeto artefacto
      fields:
        - name: object
          type: string
          required: true
          description: Siempre agent.session.artifact.
        - name: id
          type: string
          required: true
          description: Identificador opaco art_. No lo construyas ni lo decodifiques.
        - name: session_id
          type: string
          required: true
          description: ID de la Session propietaria.
        - name: path
          type: string
          required: true
          description: Ruta de la salida generada bajo /workspace/outputs/.
        - name: size_bytes
          type: integer
          required: true
          description: Tamaño del artefacto en bytes.
        - name: created_at
          type: integer
          required: true
          description: Marca de tiempo de creación en segundos Unix.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "agent.session.artifact",
            "id": "art_example_handle",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "path": "/workspace/outputs/report.md",
            "size_bytes": 1024,
            "created_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "art_example_handle",
        "last_id": "art_example_handle"
      }
---

<ApiReferencePage />

El identificador del ejemplo es ilustrativo. Usa el `id` devuelto por tu propia solicitud para [Descargar artefacto](./download-artifact). Cuando `has_more` sea true, envía `after=last_id` para obtener la página siguiente. `first_id` y `last_id` son null para una lista vacía. No se expone un endpoint GET independiente para los metadatos de artefactos.
