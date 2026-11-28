---
i18nSource: f3150233afd08b90
title: Crear Agent
description: Crea un Agent guardado y versionado con POST /v1/agents.
aside: false
outline: false
apiReference:
  title: Crear Agent
  operation: Agents
  method: POST
  path: /v1/agents
  description: "Crea un Agent guardado en la versión 1. El cuerpo es JSON estricto: los campos desconocidos devuelven 400. multi_agent debe omitirse o ser null."
  groups:
    - title: Encabezados
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcional. Si se omite, el servicio genera una, por lo que una solicitud reintentada puede crear un duplicado. Envía tu propia clave estable para los reintentos.
    - title: Cuerpo de la solicitud
      description: Objeto JSON.
      fields:
        - name: model
          type: string
          required: true
          description: ID de modelo obligatorio de la Models API, hasta 200 caracteres. No hay valor por defecto; omitir model devuelve 400. Los ejemplos usan deepseek/deepseek-v4-flash.
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
          description: "Runtime de ejecución: codex (por defecto), claude o mcode."
        - name: skills
          type: array
          required: false
          description: 'Referencias de Skills: {"skill_id": "skl_…", "version": null | "<version>"}. Hasta 32. En una vinculación nueva, null fija el valor por defecto actual al guardar el Agent. En una vinculación existente, null conserva su versión fijada; indica una versión explícita para actualizarla.'
        - name: mcp_connections
          type: array
          required: false
          description: 'Referencias de MCP: {connection_id, server_label, allowed_tools, required}. Hasta 32; server_label debe ser único en el Agent. Omítelo para obtener las herramientas integradas de SandBase ({"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin"}); una lista que envíes reemplaza ese valor por defecto, y [] crea un Agent sin herramientas. Consulta Herramientas integradas de SandBase (/agents/mcp-tools#built-in-sandbase-tools).'
        - name: tools
          type: array
          required: false
          description: Hasta 64 herramientas de función y como máximo una herramienta web_search. Por ahora, las Sessions requieren el modo web_search desactivado, y los resultados de funciones del lado del cliente aún no se admiten.
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
          description: auto (por defecto), default, flex, priority o fast.
        - name: metadata
          type: object
          required: false
          description: Hasta 16 pares de cadenas; claves de hasta 64 y valores de hasta 512 caracteres.
        - name: description
          type: string
          required: false
          description: Descripción más larga, hasta 4096 caracteres.
        - name: note
          type: string
          required: false
          description: Nota de cambio registrada en la versión 1.
    - title: Objeto Agent
      description: Lo devuelven create, get, update, archive, unarchive, restore y clone.
      fields:
        - name: id
          type: string
          required: true
          description: ID del Agent con el prefijo agt_.
        - name: object
          type: string
          required: true
          description: Siempre agent.
        - name: version
          type: integer
          required: true
          description: Versión actual. Cada escritura efectiva crea una nueva versión.
        - name: row_version
          type: integer
          required: true
          description: Token de comparar y establecer para PATCH, archive, unarchive y restore.
        - name: status
          type: string
          required: true
          description: active o archived.
        - name: projection_status
          type: string
          required: true
          description: Preparación para la ejecución de la versión actual. Las Sessions necesitan ready; un Agent nuevo puede indicar pending brevemente.
        - name: runtime_profile
          type: string
          required: true
          description: codex, claude o mcode.
        - name: visibility
          type: string
          required: true
          description: private para tus Agents; public para las entradas del catálogo.
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Segundos Unix. archived_at es null mientras está activo.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: create-research-agent-1" \
          -H "Content-Type: application/json" \
          -d '{
            "name": "Research assistant",
            "model": "deepseek/deepseek-v4-flash",
            "instructions": "Answer with cited sources.",
            "metadata": {
              "team": "research"
            }
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.create(
            model="deepseek/deepseek-v4-flash",
            name="Research assistant",
            instructions="Answer with cited sources.",
            metadata={"team": "research"},
        )
        print(agent.id, agent.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "create-research-agent-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents",
            headers=headers,
            json={
                "name": "Research assistant",
                "model": "deepseek/deepseek-v4-flash",
                "instructions": "Answer with cited sources.",
                "metadata": {
                    "team": "research"
                }
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'create-research-agent-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "name": "Research assistant",
            "model": "deepseek/deepseek-v4-flash",
            "instructions": "Answer with cited sources.",
            "metadata": {
              "team": "research"
            }
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
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
        "version": 1,
        "row_version": 1,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "",
        "metadata": {
          "team": "research"
        },
        "mcp_connections": [
          {"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin", "allowed_tools": null, "required": true}
        ],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
