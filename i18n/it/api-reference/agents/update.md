---
i18nSource: 1b680f7f0804feb7
title: Aggiornare un Agent
description: Aggiorna parzialmente un Agent con l'aggiornamento POST in stile SDK OpenAI.
aside: false
outline: false
apiReference:
  title: Aggiornare un Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: Aggiornamento parziale in stile SDK. I campi forniti sostituiscono i valori salvati e creano una nuova versione; i campi omessi mantengono i loro valori. Non serve row_version. description e note non sono accettati qui; per modificarli usa Replace (PATCH). Gli Agents archiviati restituiscono 404.
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
          description: Facoltativo. Se omesso, il servizio ne genera uno, quindi una richiesta ritentata può creare un duplicato. Per i retry invia una tua chiave stabile.
    - title: Body della richiesta
      description: Qualsiasi sottoinsieme di questi campi. Altri campi restituiscono 400.
      fields:
        - name: model
          type: string
          required: false
          description: ID del modello dall'API Models, fino a 200 caratteri.
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
          description: "Riferimenti alle Skills: {\"skill_id\": \"skl_…\", \"version\": null | \"<version>\"}. Fino a 32. Su un nuovo binding, null fissa la versione predefinita corrente al salvataggio dell'Agent. Per un binding esistente, null mantiene la versione fissata; indica una versione esplicita per aggiornare."
        - name: mcp_connections
          type: array
          required: false
          description: "Riferimenti MCP: {connection_id, server_label, allowed_tools, required}. Fino a 32; server_label deve essere univoco nell'Agent."
        - name: tools
          type: array
          required: false
          description: Fino a 64 tool function più al massimo un tool web_search. Attualmente le Sessions richiedono web_search con mode disabled, e i risultati delle function lato client non sono ancora supportati.
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
          description: Fino a 16 coppie di stringhe; chiavi fino a 64 e valori fino a 512 caratteri.
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
