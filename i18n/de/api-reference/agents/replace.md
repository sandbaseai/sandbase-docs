---
i18nSource: 4e711691737c9671
title: Agent ersetzen (CAS)
description: Agent per Compare-and-Set auf row_version aktualisieren.
aside: false
outline: false
apiReference:
  title: Agent ersetzen (CAS)
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: Produkt-Update per Compare-and-Set. row_version ist erforderlich und muss dem aktuellen Wert entsprechen, sonst 409. Übergebene Felder ersetzen die gespeicherten Werte; explizite null-Werte liefern 400. Verwende diese Variante, wenn mehrere Personen denselben Agent bearbeiten können.
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
      description: row_version plus eine beliebige Teilmenge der Agent-Felder.
      fields:
        - name: row_version
          type: integer
          required: true
          description: Die zuletzt gelesene row_version. Ein veralteter Wert liefert 409.
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
        - name: description
          type: string
          required: false
          description: Bis zu 4096 Zeichen.
        - name: note
          type: string
          required: false
          description: Änderungsnotiz, die bei der neuen Version gespeichert wird.
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
