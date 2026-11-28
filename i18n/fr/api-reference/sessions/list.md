---
i18nSource: 55d1b73d25426dca
title: Lister les Sessions
description: Listez les Sessions avec pagination par curseur.
aside: false
outline: false
apiReference:
  title: Lister les Sessions
  operation: Sessions
  method: GET
  path: /v1/agents/sessions
  description: Liste les Sessions de votre organisation avec pagination par curseur. Les lignes qui ne peuvent pas être lues en direct apparaissent quand même, avec un échec tel que session_not_ready ou session_snapshot_unavailable.
  groups:
    - title: Paramètres de requête
      fields:
        - name: lifecycle_status
          type: string
          required: false
          description: active, archived ou all.
          default: active
        - name: agent_id
          type: string
          required: false
          description: Uniquement les Sessions de cet Agent.
        - name: limit
          type: integer
          required: false
          description: Taille de page de 1 à 100. Les valeurs hors de cette plage renvoient 400.
          default: "20"
        - name: after
          type: string
          required: false
          description: Curseur. Passez le last_id de la page précédente.
        - name: order
          type: string
          required: false
          description: asc ou desc selon la date de création.
          default: desc
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET "https://api.sandbase.ai/v1/agents/sessions?agent_id=agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60&limit=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        for session in client.beta.agents.sessions.list(limit=20):
            print(session.id, session.status)
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
            "https://api.sandbase.ai/v1/agents/sessions?agent_id=agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60&limit=20",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions?agent_id=agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60&limit=20', {
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
        "object": "list",
        "data": [
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
            "status": "idle",
            "lifecycle_status": "active",
            "sync_status": "ready",
            "execution_status": "idle",
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
        ],
        "has_more": false,
        "first_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
        "last_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83"
      }
---

<ApiReferencePage />
