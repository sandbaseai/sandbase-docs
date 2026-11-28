---
i18nSource: faccf5122e785ea0
title: Descargar artefacto de Session
description: Descarga por ID un artefacto capturado de una Session. Conoce el límite de descarga de archivos completos, los tipos de respuesta admitidos y el comportamiento de Range.
aside: false
outline: false
apiReference:
  title: Descargar artefacto de Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: Descarga un artefacto inmutable completo usando su ID de List Session Artifacts. Se admiten archivos de hasta 200 MiB. No se aceptan parámetros de consulta; las solicitudes Range devuelven 416 tras validar el acceso.
  groups:
    - title: Parámetros de ruta
      fields:
        - name: session_id
          type: string
          required: true
          description: ID de la Session (prefijo ses_).
        - name: artifact_id
          type: string
          required: true
          description: ID opaco art_ exacto devuelto por la lista de artefactos de esta Session. No se aceptan IDs de adjuntos ni rutas del espacio de trabajo.
    - title: Encabezados de respuesta
      fields:
        - name: Content-Type
          type: string
          required: true
          description: Tipo de medio deducido de la extensión del archivo, o application/octet-stream.
        - name: Content-Disposition
          type: string
          required: true
          description: attachment con el nombre de archivo del artefacto.
        - name: Content-Length
          type: integer
          required: true
          description: Tamaño completo del archivo en bytes.
        - name: Cache-Control
          type: string
          required: true
          description: no-store.
  examples:
    - label: cURL
      language: bash
      code: |-
        # Set SESSION_ID and ARTIFACT_ID from your Session and artifact list.
        curl --fail-with-body "https://api.sandbase.ai/v1/agents/sessions/${SESSION_ID}/artifacts/${ARTIFACT_ID}/content" \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          --output report.md
    - label: Python
      language: python
      code: |-
        import os
        from pathlib import Path
        import requests

        # Use IDs returned by your own Session and artifact list.
        session_id = os.environ["SESSION_ID"]
        artifact_id = os.environ["ARTIFACT_ID"]
        response = requests.get(
            f"https://api.sandbase.ai/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        Path("report.md").write_bytes(response.content)
    - label: TypeScript
      language: typescript
      code: |-
        import { writeFile } from 'node:fs/promises';

        const { SESSION_ID, ARTIFACT_ID, SANDBASE_API_KEY } = process.env;
        if (!SESSION_ID || !ARTIFACT_ID || !SANDBASE_API_KEY) throw new Error('Missing configuration');
        const response = await fetch(
          `https://api.sandbase.ai/v1/agents/sessions/${encodeURIComponent(SESSION_ID)}/artifacts/${encodeURIComponent(ARTIFACT_ID)}/content`,
          { headers: { Authorization: `Bearer ${SANDBASE_API_KEY}` } },
        );
        if (!response.ok) throw new Error(await response.text());
        await writeFile('report.md', new Uint8Array(await response.arrayBuffer()));
---

<ApiReferencePage />

Una respuesta correcta son los bytes del archivo, no JSON. Descarga el archivo completo; no se admiten las transferencias parciales ni las descargas reanudables con Range. Un artefacto no disponible devuelve `404`; un servicio de artefactos no disponible devuelve `executor_unavailable`.
