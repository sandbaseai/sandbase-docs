---
i18nSource: 996f166544016111
title: Actualizar Skill
description: Cambia la versión predeterminada, el estado o los metadatos de una Skill.
aside: false
outline: false
apiReference:
  title: Actualizar Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: Cambia default_version, status o los metadatos de market. row_version es obligatorio cuando se envía metadata; en caso contrario, se usa el valor actual.
  groups:
    - title: Parámetros de ruta
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID de la Skill (prefijo skl_).
    - title: Cuerpo de la solicitud
      description: Objeto JSON.
      fields:
        - name: default_version
          type: string
          required: false
          description: Versión predeterminada que se usa al asociar esta Skill por primera vez sin una versión explícita. Las vinculaciones existentes de los Agents conservan sus versiones fijadas.
        - name: status
          type: string
          required: false
          description: active o disabled.
        - name: metadata
          type: object | null
          required: false
          description: Metadatos de presentación solo bajo el espacio de nombres market (hasta 16 KiB). Requiere row_version; reemplaza el objeto de metadatos. Los espacios de nombres o campos desconocidos devuelven 400. Consulta el ejemplo de metadatos más abajo.
        - name: row_version
          type: integer
          required: false
          description: row_version actual obtenido con Obtener Skill. Un valor desactualizado devuelve 409 conflict; es obligatorio cuando hay metadata.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "default_version": "2"
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        skill = client.skills.update("skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", default_version="2")
        print(skill.default_version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
            headers=headers,
            json={
                "default_version": "2"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "default_version": "2"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "object": "skill",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "default_version": "2",
        "latest_version": "2",
        "status": "active",
        "visibility": "private",
        "row_version": 3,
        "metadata": {},
        "created_at": 1791273600,
        "updated_at": 1791273600
      }
---

<ApiReferencePage />

## Ejemplo de metadatos {#metadata-example}

Envía el `row_version` actual junto con el objeto de metadatos completo:

```json
{
  "row_version": 3,
  "metadata": {
    "market": {
      "display_name": "Release notes",
      "categories": ["development"],
      "tags": ["releases"],
      "required_endpoints": ["github.issues"],
      "servers": ["github"]
    }
  }
}
```

Los metadatos de market describen la Skill para su presentación. No instalan un servidor, no otorgan credenciales ni cambian la selección MCP del Agent. `metadata: {}` o `metadata: null` los borra; ambos siguen requiriendo `row_version`.
