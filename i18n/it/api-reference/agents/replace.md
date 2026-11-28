---
i18nSource: 4e711691737c9671
title: Sostituisci Agent (CAS)
description: Aggiorna un Agent con compare-and-set su row_version.
aside: false
outline: false
apiReference:
  title: Sostituisci Agent (CAS)
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: Aggiornamento di prodotto con compare-and-set. row_version è obbligatorio e deve coincidere con il valore corrente, altrimenti restituisce 409. I campi forniti sostituiscono i valori salvati; i valori null espliciti restituiscono 400. Usa questa forma quando più editor possono modificare lo stesso Agent.
  groups:
    - title: Parametri di percorso
      fields:
        - name: agent_id
          type: string
          required: true
          description: ID dell'Agent (prefisso agt_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Facoltativo. Se lo ometti, il servizio ne genera uno, quindi una richiesta ripetuta può creare un duplicato. Per i retry invia una tua chiave stabile.
    - title: Corpo della richiesta
      description: row_version più un qualsiasi sottoinsieme dei campi dell'Agent.
      fields:
        - name: row_version
          type: integer
          required: true
          description: L'ultimo row_version che hai letto. Un valore non aggiornato restituisce 409.
        - name: model
          type: string
          required: false
          description: ID del modello dalla Models API, fino a 200 caratteri.
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
          description: "Riferimenti a Skill: {\"skill_id\": \"skl_…\", \"version\": null | \"<version>\"}. Fino a 32. Su un nuovo binding, null fissa la versione predefinita corrente al salvataggio dell'Agent. Su un binding esistente, null mantiene la versione fissata; indica una versione esplicita per aggiornarla."
        - name: mcp_connections
          type: array
          required: false
          description: "Riferimenti MCP: {connection_id, server_label, allowed_tools, required}. Fino a 32; server_label deve essere univoco nell'Agent."
        - name: tools
          type: array
          required: false
          description: Fino a 64 function tool più al massimo un tool web_search. Al momento le Session richiedono la modalità web_search disattivata e i risultati di function lato client non sono ancora supportati.
        - name: text
          type: object
          required: false
          description: format.type text o json_schema (con uno schema di tipo object); verbosity low, medium o high.
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
          description: Fino a 16 coppie di stringhe; chiavi fino a 64 caratteri e valori fino a 512.
        - name: description
          type: string
          required: false
          description: Fino a 4096 caratteri.
        - name: note
          type: string
          required: false
          description: Nota di modifica registrata sulla nuova versione.
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
