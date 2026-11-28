---
i18nSource: f3150233afd08b90
title: Agent erstellen
description: Erstelle mit POST /v1/agents einen gespeicherten, versionierten Agent.
aside: false
outline: false
apiReference:
  title: Agent erstellen
  operation: Agents
  method: POST
  path: /v1/agents
  description: "Erstellt einen gespeicherten Agent in Version 1. Der Body ist striktes JSON: Unbekannte Felder liefern 400. multi_agent muss weggelassen werden oder null sein."
  groups:
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Optional. Fehlt der Header, erzeugt der Dienst einen Key, sodass eine wiederholte Anfrage ein Duplikat erstellen kann. Sende für Retries einen eigenen stabilen Key.
    - title: Request-Body
      description: JSON-Objekt.
      fields:
        - name: model
          type: string
          required: true
          description: Erforderliche Modell-ID aus der Models API, bis zu 200 Zeichen. Es gibt keinen Standardwert; ohne model wird 400 zurückgegeben. Die Beispiele verwenden deepseek/deepseek-v4-flash.
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
          description: 'Skill-Referenzen: {"skill_id": "skl_…", "version": null | "<version>"}. Bis zu 32. Bei einer neuen Bindung legt null beim Speichern des Agents die aktuelle Standardversion fest. Bei einer bestehenden Bindung behält null die festgelegte Version bei; gib für ein Upgrade eine explizite Version an.'
        - name: mcp_connections
          type: array
          required: false
          description: 'MCP-Referenzen: {connection_id, server_label, allowed_tools, required}. Bis zu 32; server_label muss innerhalb des Agents eindeutig sein. Lass das Feld weg, um die integrierten SandBase-Tools zu erhalten ({"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin"}); eine gesendete Liste ersetzt diesen Standard, und [] erstellt einen Agent ohne Tools. Siehe Integrierte SandBase-Tools (/agents/mcp-tools#built-in-sandbase-tools).'
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
          description: Bis zu 16 String-Paare; Keys bis 64 und Werte bis 512 Zeichen.
        - name: description
          type: string
          required: false
          description: Ausführlichere Beschreibung, bis zu 4096 Zeichen.
        - name: note
          type: string
          required: false
          description: Änderungsnotiz für Version 1.
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
