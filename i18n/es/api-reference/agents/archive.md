---
i18nSource: 9643801af097736d
title: Archivar Agent
description: Archiva un Agent con row_version.
aside: false
outline: false
apiReference:
  title: Archivar Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}/archive
  description: Archiva un Agent con compare-and-set. Los Agents archivados no pueden iniciar nuevas Sessions.
  groups:
    - title: Parámetros de ruta
      fields:
        - name: agent_id
          type: string
          required: true
          description: ID del Agent (prefijo agt_).
    - title: Encabezados
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcional. Si lo omites, el servicio genera uno, por lo que una solicitud reintentada puede crear un duplicado. Envía tu propia clave estable para los reintentos.
    - title: Cuerpo de la solicitud
      description: Objeto JSON.
      fields:
        - name: row_version
          type: integer
          required: true
          description: El row_version que leíste por última vez. Un valor obsoleto devuelve 409.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/archive \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "row_version": 3
          }'
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/archive",
            headers=headers,
            json={
                "row_version": 3
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/archive', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "row_version": 3
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "object": "agent",
        "name": "Research assistant",
        "model": "deepseek/deepseek-v4-flash",
        "instructions": "Answer with cited sources.",
        "tools": [],
        "text": {
          "format": {
            "type": "text"
          },
          "verbosity": "medium"
        },
        "reasoning": {
          "effort": null,
          "summary": null
        },
        "service_tier": "auto",
        "multi_agent": {
          "enabled": false,
          "max_concurrent_subagents": null
        },
        "visibility": "private",
        "status": "archived",
        "version": 3,
        "row_version": 4,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "",
        "metadata": {
          "team": "research"
        },
        "mcp_connections": [],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": 1791360000
      }
---

<ApiReferencePage />
