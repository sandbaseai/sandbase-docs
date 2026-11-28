---
i18nSource: be0b17847a19a11c
title: Obtener Session
description: Lee una Session.
aside: false
outline: false
apiReference:
  title: Obtener Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}
  description: Lee una Session. El estado de ejecución se lee en tiempo real, así que consulta este endpoint periódicamente o usa el stream de eventos para seguir el progreso.
  groups:
    - title: Parámetros de ruta
      fields:
        - name: session_id
          type: string
          required: true
          description: ID de la Session (prefijo ses_).
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
          description: "Estado de ejecución: idle, in_progress o failed. requires_action todavía no es compatible y aparece como 502 executor_contract_error."
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
          description: Instantánea con formato de OpenAI de la configuración efectiva del Agent, y uso de tokens (null hasta que un turno informe el uso).
        - name: source · source_id
          type: string · null
          required: false
          description: Origen de la Session. Las Sessions creadas con POST /v1/agents/sessions informan direct y un source_id null.
        - name: row_version
          type: integer
          required: true
          description: Token de comparación e intercambio (compare-and-set) para rename, archive y unarchive.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83 \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        session = client.beta.agents.sessions.retrieve("ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83")
        print(session.status, session.failure)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "GET",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
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
        "status": "in_progress",
        "lifecycle_status": "active",
        "sync_status": "ready",
        "execution_status": "in_progress",
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
