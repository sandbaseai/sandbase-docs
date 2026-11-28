---
i18nSource: 1b680f7f0804feb7
title: Agent aktualisieren
description: Agent per POST-Update im Stil des OpenAI SDK teilweise aktualisieren.
aside: false
outline: false
apiReference:
  title: Agent aktualisieren
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: Teilweises Update im SDK-Stil. Übergebene Felder ersetzen die gespeicherten Werte und erzeugen eine neue Version; weggelassene Felder behalten ihre Werte. Eine row_version ist nicht nötig. description und note werden hier nicht akzeptiert; verwende dafür Replace (PATCH). Archivierte Agents liefern 404.
  groups:
    - title: Pfadparameter
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent-ID (Präfix agt_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Optional. Fehlt er, erzeugt der Dienst einen eigenen, sodass eine wiederholte Anfrage ein Duplikat anlegen kann. Sende für Wiederholungen deinen eigenen stabilen Schlüssel.
    - title: Request-Body
      description: Eine beliebige Teilmenge dieser Felder. Andere Felder liefern 400.
      fields:
        - name: model
          type: string
          required: false
          description: Modell-ID aus der Models API, bis zu 200 Zeichen.
        - name: name
          type: string
          required: false
          description: Anzeigename, bis zu 128 Zeichen.
        - name: instructions
          type: string
          required: false
          description: Systemanweisungen, bis zu 256 KiB.
        - name: runtime_profile
          type: string
          required: false
          description: "Ausführungs-Runtime: codex (Standard), claude oder mcode."
        - name: skills
          type: array
          required: false
          description: 'Skill-Referenzen: {"skill_id": "skl_…", "version": null | "<version>"}. Bis zu 32. Bei einer neuen Bindung legt null beim Speichern des Agents die aktuelle Standardversion fest. Bei einer bestehenden Bindung behält null die festgelegte Version bei; gib eine explizite Version an, um zu aktualisieren.'
        - name: mcp_connections
          type: array
          required: false
          description: "MCP-Referenzen: {connection_id, server_label, allowed_tools, required}. Bis zu 32; server_label muss innerhalb des Agents eindeutig sein."
        - name: tools
          type: array
          required: false
          description: Bis zu 64 Function-Tools plus höchstens ein web_search-Tool. Sessions erfordern derzeit einen deaktivierten web_search-Modus, und clientseitige Function-Ergebnisse werden noch nicht unterstützt.
        - name: text
          type: object
          required: false
          description: format.type text oder json_schema (mit einem Objektschema); verbosity low, medium oder high.
        - name: reasoning
          type: object
          required: false
          description: effort none, minimal, low, medium, high, xhigh oder max; summary concise, detailed oder auto.
        - name: service_tier
          type: string
          required: false
          description: auto (Standard), default, flex, priority oder fast.
        - name: metadata
          type: object
          required: false
          description: Bis zu 16 String-Paare; Schlüssel bis zu 64 und Werte bis zu 512 Zeichen.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "instructions": "Answer in five bullet points with cited sources."
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.update(
            "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            instructions="Answer in five bullet points with cited sources.",
        )
        print(agent.version)
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "instructions": "Answer in five bullet points with cited sources."
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "instructions": "Answer in five bullet points with cited sources."
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
        "instructions": "Answer in five bullet points with cited sources.",
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
        "version": 2,
        "row_version": 2,
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
