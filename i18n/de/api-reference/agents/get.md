---
i18nSource: 75530d38a1e4b215
title: Agent abrufen
description: Einen Agent anhand seiner ID lesen.
aside: false
outline: false
apiReference:
  title: Agent abrufen
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}
  description: Liest einen Agent, auch archivierte Agents.
  groups:
    - title: Pfadparameter
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent-ID (Präfix agt_).
    - title: Agent-Objekt
      description: Wird von create, get, update, archive, unarchive, restore und clone zurückgegeben.
      fields:
        - name: id
          type: string
          required: true
          description: Agent-ID mit dem Präfix agt_.
        - name: object
          type: string
          required: true
          description: Immer agent.
        - name: version
          type: integer
          required: true
          description: Aktuelle Version. Jeder wirksame Schreibvorgang erzeugt eine neue Version.
        - name: row_version
          type: integer
          required: true
          description: Compare-and-Set-Token für PATCH, archive, unarchive und restore.
        - name: status
          type: string
          required: true
          description: active oder archived.
        - name: projection_status
          type: string
          required: true
          description: Ausführungsbereitschaft der aktuellen Version. Sessions benötigen ready; ein neuer Agent kann kurzzeitig pending melden.
        - name: runtime_profile
          type: string
          required: true
          description: codex, claude oder mcode.
        - name: visibility
          type: string
          required: true
          description: private für deine Agents; public für Katalogeinträge.
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Unix-Sekunden. archived_at ist null, solange der Agent aktiv ist.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.retrieve("agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60")
        print(agent.version, agent.status)
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
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
        "mcp_connections": [],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
