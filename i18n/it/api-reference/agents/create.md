---
i18nSource: f3150233afd08b90
title: Crea Agent
description: Crea un Agent salvato e con versioni tramite POST /v1/agents.
aside: false
outline: false
apiReference:
  title: Crea Agent
  operation: Agents
  method: POST
  path: /v1/agents
  description: "Crea un Agent salvato alla versione 1. Il body è JSON rigoroso: i campi sconosciuti restituiscono 400. multi_agent deve essere omesso o null."
  groups:
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Facoltativo. Se omesso, il servizio ne genera uno, quindi una richiesta ritentata può creare un duplicato. Invia una tua chiave stabile per i retry.
    - title: Body della richiesta
      description: Oggetto JSON.
      fields:
        - name: model
          type: string
          required: true
          description: "ID del modello obbligatorio ricavato dalla Models API, fino a 200 caratteri. Non esiste un valore predefinito: se ometti model ottieni 400. Gli esempi usano deepseek/deepseek-v4-flash."
        - name: name
          type: string
          required: false
          description: Nome visualizzato, fino a 128 caratteri.
        - name: instructions
          type: string
          required: false
          description: Istruzioni di sistema, fino a 256 KiB.
        - name: runtime_profile
          type: string
          required: false
          description: "Runtime di esecuzione: codex (predefinito), claude o mcode."
        - name: skills
          type: array
          required: false
          description: "Riferimenti alle Skill: {\"skill_id\": \"skl_…\", \"version\": null | \"<version>\"}. Fino a 32. Su un nuovo binding, null fissa la versione predefinita corrente al momento del salvataggio dell'Agent. Per un binding esistente, null mantiene la versione fissata; specifica una versione esplicita per aggiornarla."
        - name: mcp_connections
          type: array
          required: false
          description: "Riferimenti MCP: {connection_id, server_label, allowed_tools, required}. Fino a 32; server_label deve essere univoco nell'Agent. Omettilo per ottenere gli strumenti SandBase integrati ({\"connection_id\": \"builtin:sandbase\", \"server_label\": \"sandbase_builtin\"}); una lista inviata sostituisce questo valore predefinito e [] crea un Agent senza strumenti. Vedi Strumenti SandBase integrati (/agents/mcp-tools#built-in-sandbase-tools)."
        - name: tools
          type: array
          required: false
          description: Fino a 64 strumenti function più al massimo uno strumento web_search. Le Session richiedono attualmente la modalità web_search disattivata e i risultati di function lato client non sono ancora supportati.
        - name: text
          type: object
          required: false
          description: format.type text o json_schema (con uno schema object); verbosity low, medium o high.
        - name: reasoning
          type: object
          required: false
          description: effort none, minimal, low, medium, high, xhigh o max; summary concise, detailed o auto.
        - name: service_tier
          type: string
          required: false
          description: auto (predefinito), default, flex, priority o fast.
        - name: metadata
          type: object
          required: false
          description: Fino a 16 coppie di stringhe; chiavi fino a 64 e valori fino a 512 caratteri.
        - name: description
          type: string
          required: false
          description: Descrizione estesa, fino a 4096 caratteri.
        - name: note
          type: string
          required: false
          description: Nota di modifica registrata sulla versione 1.
    - title: Oggetto Agent
      description: Restituito da create, get, update, archive, unarchive, restore e clone.
      fields:
        - name: id
          type: string
          required: true
          description: ID dell'Agent con prefisso agt_.
        - name: object
          type: string
          required: true
          description: Sempre agent.
        - name: version
          type: integer
          required: true
          description: Versione corrente. Ogni scrittura effettiva crea una nuova versione.
        - name: row_version
          type: integer
          required: true
          description: Token compare-and-set per PATCH, archive, unarchive e restore.
        - name: status
          type: string
          required: true
          description: active o archived.
        - name: projection_status
          type: string
          required: true
          description: Stato di prontezza all'esecuzione della versione corrente. Le Session richiedono ready; un nuovo Agent può indicare brevemente pending.
        - name: runtime_profile
          type: string
          required: true
          description: codex, claude o mcode.
        - name: visibility
          type: string
          required: true
          description: private per i tuoi Agent; public per le voci del catalogo.
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Secondi Unix. archived_at è null finché l'Agent è attivo.
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
