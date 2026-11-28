---
i18nSource: 096e3c57e599c5ca
title: Subir versión de Skill
description: Sube una nueva versión de una Skill.
aside: false
outline: false
apiReference:
  title: Subir versión de Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: Sube un nuevo paquete ZIP como la siguiente versión (200 OK). La estructura del ZIP es la misma que en Crear Skill (una carpeta de nivel superior que contiene SKILL.md). Envía default=true para convertirla en la versión predeterminada. Lista las versiones con GET /v1/skills/{skill_id}/versions, lee una con GET /v1/skills/{skill_id}/versions/{version} y descarga una con GET /v1/skills/{skill_id}/versions/{version}/content. Los identificadores de versión son cadenas.
  groups:
    - title: Parámetros de ruta
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID de la Skill (prefijo skl_).
    - title: Encabezados
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcional, de 1 a 128 bytes sin espacios al principio ni al final. Si se omite, el servicio genera una, por lo que una solicitud reintentada puede crear un duplicado. Envía tu propia clave estable para los reintentos.
    - title: Cuerpo de la solicitud
      description: multipart/form-data.
      fields:
        - name: files
          type: file
          required: true
          description: Archivo ZIP de hasta 5 MiB.
        - name: default
          type: string
          required: false
          description: true la convierte en la predeterminada para futuras asociaciones; false u omitido mantiene la predeterminada actual. Las vinculaciones existentes de los Agents no cambian.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: release-notes-v2" \
          -F "files=@release-notes-v2.zip;type=application/zip" \
          -F "default=true"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        with open("release-notes-v2.zip", "rb") as bundle:
            version = client.skills.versions.create(
                "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
                files=[("release-notes-v2.zip", bundle.read(), "application/zip")],
                default=True,
            )
        print(version.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "release-notes-v2",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions",
            headers=headers,
            files={"files": open("release-notes-v2.zip", "rb")},
            data={"default": "true"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        import { readFile } from 'node:fs/promises';

        const form = new FormData();
        form.append('files', new Blob([await readFile('release-notes-v2.zip')], { type: 'application/zip' }), 'release-notes-v2.zip');
        form.append('default', 'true');

        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'release-notes-v2',
          },
          body: form,
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "skill.version",
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57:2",
        "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "version": "2",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "created_at": 1791360000
      }
---

<ApiReferencePage />

## Listar y descargar versiones {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions` acepta `limit` (0-100, 20 por defecto), `order` (`asc` o `desc`, `desc` por defecto) y `after`. Su respuesta contiene `object: "list"`, `data`, `has_more`, `first_id` y `last_id`. Pasa `last_id` sin cambios como el siguiente `after`; es un ID de versión con el prefijo de la Skill, no el número de versión solo.

`GET /v1/skills/{skill_id}/versions/{version}` devuelve un objeto de versión. El endpoint `/content` correspondiente devuelve los bytes del ZIP; consulta el [ejemplo de descarga](./#download-a-bundle).
