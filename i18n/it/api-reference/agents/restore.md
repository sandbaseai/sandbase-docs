---
i18nSource: dcaf28fee73ca27e
title: Ripristina versione Agent
description: Ripristina una versione precedente dell'Agent come nuova versione corrente.
aside: false
outline: false
apiReference:
  title: Ripristina versione Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}/restore
  description: Copia la configurazione di source_version in una nuova versione corrente. La cronologia non viene mai riscritta.
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
          description: Facoltativo. Se omesso, il servizio ne genera uno, quindi una richiesta ripetuta può creare un duplicato. Invia una tua chiave stabile per i retry.
    - title: Corpo della richiesta
      description: Oggetto JSON.
      fields:
        - name: source_version
          type: integer
          required: true
          description: Versione precedente da ripristinare.
        - name: row_version
          type: integer
          required: true
          description: La row_version letta per ultima. Un valore obsoleto restituisce 409.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/restore \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "source_version": 1,
            "row_version": 3
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
            "POST",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/restore",
            headers=headers,
            json={
                "source_version": 1,
                "row_version": 3
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/restore', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "source_version": 1,
            "row_version": 3
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
        "version": 4,
        "row_version": 4,
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
