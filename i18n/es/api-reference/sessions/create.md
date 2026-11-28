---
i18nSource: 91ce9f65766e9662
title: Crear Session
description: Crea una Session para un Agent guardado o en línea con POST /v1/agents/sessions y, opcionalmente, transmite el primer turno.
aside: false
outline: false
apiReference:
  title: Crear Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: Crea una Session para una versión de Agent guardada o para un Agent en línea definido en la solicitud. La configuración del Agent, las versiones de Skills y las conexiones MCP quedan congeladas durante toda la vida de la Session. Las Sessions siempre se ejecutan en la nube alojada de SandBase, así que no hay que elegir entorno de ejecución. Con stream=true y una entrada inicial, la respuesta es un flujo Server-Sent Events 201 del primer turno en lugar de una Session en JSON. La admisión de la ejecución (saldo y estado de la organización) se comprueba aquí. El SDK de OpenAI requiere un argumento environment; consulta Compatibilidad con OpenAI (/agents/openai-compatibility).
  groups:
    - title: Encabezados
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcional. Si lo omites, el servicio genera uno, por lo que una solicitud reintentada puede crear un duplicado. Envía tu propia clave estable para los reintentos.
    - title: Cuerpo de la solicitud
      description: Objeto JSON estricto.
      fields:
        - name: agent_id
          type: string
          required: false
          description: ID del Agent guardado (prefijo agt_). El Agent debe estar activo con projection_status ready. Envía agent_id, agent o ambos.
        - name: agent
          type: object
          required: false
          description: Configuración del Agent. Los campos aceptados son model, instructions, runtime_profile (codex, claude o mcode; predeterminado codex), service_tier, tools, text, reasoning y multi_agent, validados como en Crear Agent. Sin agent_id, define un Agent en línea y model es obligatorio; los Agents en línea no incluyen Skills ni conexiones MCP. Con agent_id, cada campo que envíes reemplaza ese campo de la versión guardada solo para esta Session. Los campos desconocidos devuelven 400.
        - name: version
          type: integer
          required: false
          description: Versión del Agent. De forma predeterminada, la versión actual. No se permite con un Agent en línea.
        - name: title
          type: string
          required: false
          description: Título de la Session.
        - name: input
          type: string | array
          required: false
          description: 'Primera entrada opcional: una cadena o un array con exactamente un mensaje, p. ej. [{"role":"user","content":[{"type":"input_text","text":"…"}]}]. Un objeto suelto devuelve 400.'
        - name: model
          type: string
          required: false
          description: Sobrescritura del modelo. agent.model es la forma del SDK de OpenAI; si se envían ambos, deben coincidir.
        - name: metadata
          type: object
          required: false
          description: Hasta 16 pares de cadenas.
        - name: stream
          type: boolean
          required: false
          description: "Si es true, requiere una input no vacía y devuelve 201 con un cuerpo text/event-stream. Los eventos usan el formato de Stream events (event: <type>, data: <json>); el primero, agent.session.created, contiene la instantánea de la Session, seguido de los eventos de elementos y de salida del turno. Los errores de validación, de admisión y otros anteriores al inicio del flujo devuelven el error JSON normal. Predeterminado false."
        - name: environment
          type: object
          required: false
          description: Solo para compatibilidad con el SDK de OpenAI. Omítelo en llamadas HTTP directas; se acepta {"type":"openai_hosted"} y cualquier otro tipo devuelve 400.
        - name: model_provider
          type: object
          required: false
          description: Credencial del modelo. Omítela para usar la API key con la que llamas. {"type":"custom","base_url":"https://…","api_key":"…"} llama a tu propio endpoint compatible con OpenAI. Solo escritura.
        - name: github_workspace
          type: object
          required: false
          description: 'Repositorio de GitHub que se clona en /workspace para esta Session: {"repository_id":"1195090324","ref":"main","connection_id":"plc_…"}. Solo repository_id es obligatorio; ref usa de forma predeterminada la rama principal. Si se omite o es null, se usa el repositorio de workspace del Agent, si lo hay; de lo contrario, no se clona nada. El repositorio debe estar dentro del alcance de la conexión de GitHub del Agent. Consulta Workspace de repositorio de GitHub (/agents/github-workspace).'
    - title: Objeto Session
      description: Lo devuelven create, get, update, rename, archive y unarchive.
      fields:
        - name: id
          type: string
          required: true
          description: ID de la Session con el prefijo ses_.
        - name: status
          type: string
          required: true
          description: "Estado de ejecución: idle, in_progress o failed. requires_action aún no se admite y aparece como 502 executor_contract_error."
        - name: lifecycle_status
          type: string
          required: true
          description: active o archived. Las Sessions archivadas rechazan entradas.
        - name: failure
          type: object · null
          required: true
          description: Error público con code, message, action y retryable opcional.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: Versión congelada del Agent y modelo efectivo.
        - name: agent · usage
          type: object · object | null
          required: true
          description: Instantánea con formato de OpenAI de la configuración efectiva del Agent, y uso de tokens (null hasta que un turno informe del uso).
        - name: source · source_id
          type: string · null
          required: false
          description: Origen de la Session. Las Sessions creadas con POST /v1/agents/sessions indican direct y un source_id null.
        - name: row_version
          type: integer
          required: true
          description: Token de compare-and-set para rename, archive y unarchive.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-2026-10-06" \
          -H "Content-Type: application/json" \
          -d '{
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "title": "Market scan"
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        session = client.beta.agents.sessions.create(
            agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
        )
        print(session.id, session.status)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-2026-10-06",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions",
            headers=headers,
            json={
                "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
                "title": "Market scan",
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-2026-10-06',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "title": "Market scan"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
      {
        "id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
        "object": "agent.session",
        "agent": {
          "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
          "name": "Research assistant",
          "model": "deepseek/deepseek-v4-flash",
          "instructions": "Answer with cited sources.",
          "multi_agent": {"enabled": false, "max_concurrent_subagents": null},
          "reasoning": {"effort": null, "summary": null},
          "service_tier": "auto",
          "text": {"format": {"type": "text"}, "verbosity": "medium"},
          "tools": []
        },
        "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "agent_version": 1,
        "title": "Market scan",
        "model": "deepseek/deepseek-v4-flash",
        "environment": {
          "id": "env_…",
          "type": "openai_hosted",
          "capability_directories": [],
          "files": [],
          "network": {"access": "enabled", "allowed_domains": []},
          "packages": {"npm": [], "python": [], "system": []},
          "plugins": [],
          "skills": []
        },
        "metadata": {},
        "status": "idle",
        "lifecycle_status": "active",
        "sync_status": "ready",
        "execution_status": "idle",
        "failure": null,
        "row_version": 1,
        "required_actions": [],
        "vault_ids": [],
        "usage": null,
        "created_at": 1791273600,
        "last_active_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null,
        "source": "direct",
        "source_id": null
      }
---

<ApiReferencePage />
