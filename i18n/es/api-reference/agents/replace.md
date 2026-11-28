---
i18nSource: 4e711691737c9671
title: Reemplazar Agent (CAS)
description: Actualiza un Agent con compare-and-set sobre row_version.
aside: false
outline: false
apiReference:
  title: Reemplazar Agent (CAS)
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: Actualización de producto con compare-and-set. row_version es obligatorio y debe coincidir con el valor actual; de lo contrario, devuelve 409. Los campos que envíes reemplazan los valores guardados; los valores null explícitos devuelven 400. Usa esta forma cuando varios editores puedan modificar el mismo Agent.
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
      description: row_version más cualquier subconjunto de los campos del Agent.
      fields:
        - name: row_version
          type: integer
          required: true
          description: El row_version que leíste por última vez. Un valor obsoleto devuelve 409.
        - name: model
          type: string
          required: false
          description: ID de modelo de la Models API, hasta 200 caracteres.
        - name: name
          type: string
          required: false
          description: Nombre visible, hasta 128 caracteres.
        - name: instructions
          type: string
          required: false
          description: Instrucciones del sistema, hasta 256 KiB.
        - name: runtime_profile
          type: string
          required: false
          description: "Runtime de ejecución: codex (predeterminado), claude o mcode."
        - name: skills
          type: array
          required: false
          description: 'Referencias de Skills: {"skill_id": "skl_…", "version": null | "<version>"}. Hasta 32. En una vinculación nueva, null fija la versión predeterminada actual al guardar el Agent. En una vinculación existente, null conserva la versión fijada; indica una versión explícita para actualizarla.'
        - name: mcp_connections
          type: array
          required: false
          description: "Referencias de MCP: {connection_id, server_label, allowed_tools, required}. Hasta 32; server_label debe ser único dentro del Agent."
        - name: tools
          type: array
          required: false
          description: Hasta 64 herramientas de función y como máximo una herramienta web_search. Actualmente las Sessions requieren el modo web_search desactivado, y aún no se admiten resultados de funciones del lado del cliente.
        - name: text
          type: object
          required: false
          description: format.type text o json_schema (con un esquema de objeto); verbosity low, medium o high.
        - name: reasoning
          type: object
          required: false
          description: effort none, minimal, low, medium, high, xhigh o max; summary concise, detailed o auto.
        - name: service_tier
          type: string
          required: false
          description: auto (predeterminado), default, flex, priority o fast.
        - name: metadata
          type: object
          required: false
          description: Hasta 16 pares de cadenas; claves de hasta 64 caracteres y valores de hasta 512.
        - name: description
          type: string
          required: false
          description: Hasta 4096 caracteres.
        - name: note
          type: string
          required: false
          description: Nota de cambio registrada en la nueva versión.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
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
            "PATCH",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "row_version": 2,
                "description": "Research Agent used by the weekly brief.",
                "note": "Add description"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
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
        "status": "active",
        "version": 3,
        "row_version": 3,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "Research Agent used by the weekly brief.",
        "metadata": {
          "team": "research"
        },
        "mcp_connections": [],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
