---
i18nSource: 06a65ded83bf9438
title: Listar archivos del espacio de trabajo
description: Lista los archivos actuales del espacio de trabajo de una Session con ruta, tamaño y paginación. Este endpoint de solo lectura devuelve metadatos de archivos.
aside: false
outline: false
apiReference:
  title: Listar archivos del espacio de trabajo
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: Lista las rutas y los tamaños actuales de los archivos de un directorio del espacio de trabajo de una Session. Es un listado solo de metadatos, no el historial de adjuntos ni el contenido de los artifacts. Los parámetros de consulta desconocidos o repetidos devuelven 400.
  groups:
    - title: Parámetros de ruta
      fields:
        - name: session_id
          type: string
          required: true
          description: ID de la Session (prefijo ses_).
    - title: Parámetros de consulta
      fields:
        - name: path
          type: string
          required: false
          description: Directorio absoluto /workspace o un directorio normalizado dentro de él. Máximo 4096 bytes; sin recorrido de directorios (traversal), barras invertidas ni barra final.
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: Tamaño de página de 1 a 100.
          default: "20"
        - name: order
          type: string
          required: false
          description: "Orden por ruta: asc o desc."
          default: asc
        - name: page
          type: string
          required: false
          description: Valor next opaco de la respuesta anterior. Omítelo en la primera página; no envíes una cadena vacía. No cambies path, order ni limit.
    - title: Campos de la respuesta
      fields:
        - name: object
          type: string
          required: true
          description: Siempre page.
        - name: data
          type: array
          required: true
          description: Archivos del directorio actual, cada uno con path y size_bytes. No es un listado recursivo.
        - name: next
          type: string | null
          required: true
          description: Pasa este valor como page para continuar; null al final.
        - name: has_more
          type: boolean
          required: true
          description: Indica si hay otra página disponible.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "page",
        "data": [
          {
            "path": "/workspace/notes.md",
            "size_bytes": 1024
          }
        ],
        "next": null,
        "has_more": false
      }
---

<ApiReferencePage />

Las lecturas del espacio de trabajo pueden devolver `workspace_provisioning`, `workspace_environment_missing`, `workspace_cursor_invalid` o `workspace_unavailable`. Si el cursor no es válido, vuelve a empezar desde la primera página. Usa [Artifacts](./list-artifacts) para encontrar las salidas generadas que se pueden descargar.
