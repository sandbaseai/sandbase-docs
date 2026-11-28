---
i18nSource: be0b17847a19a11c
title: Ottieni Session
description: Leggi una Session.
aside: false
outline: false
apiReference:
  title: Ottieni Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}
  description: Leggi una Session. Lo stato di esecuzione viene letto in tempo reale, quindi interroga periodicamente questo endpoint o usa lo stream di eventi per seguire l'avanzamento.
  groups:
    - title: Parametri di percorso
      fields:
        - name: session_id
          type: string
          required: true
          description: ID della Session (prefisso ses_).
    - title: Oggetto Session
      description: Restituito da create, get, update, rename, archive e unarchive.
      fields:
        - name: id
          type: string
          required: true
          description: ID della Session con prefisso ses_.
        - name: status
          type: string
          required: true
          description: "Stato di esecuzione: idle, in_progress o failed. requires_action non è ancora supportato e viene esposto come 502 executor_contract_error."
        - name: lifecycle_status
          type: string
          required: true
          description: active o archived. Le Session archiviate rifiutano l'input.
        - name: failure
          type: object · null
          required: true
          description: Errore pubblico con code, message, action e retryable facoltativo.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: Versione dell'Agent congelata e modello effettivo.
        - name: agent · usage
          type: object · object | null
          required: true
          description: Snapshot in formato OpenAI della configurazione effettiva dell'Agent e utilizzo dei token (null finché un turno non riporta l'utilizzo).
        - name: source · source_id
          type: string · null
          required: false
          description: Origine della Session. Le Session create con POST /v1/agents/sessions riportano direct e un source_id null.
        - name: row_version
          type: integer
          required: true
          description: Token compare-and-set per rename, archive e unarchive.
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
