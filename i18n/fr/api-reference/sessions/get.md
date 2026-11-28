---
i18nSource: be0b17847a19a11c
title: Récupérer une Session
description: Lire une Session.
aside: false
outline: false
apiReference:
  title: Récupérer une Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}
  description: "Lit une Session. Le statut d'exécution est lu en direct : interrogez régulièrement cet endpoint ou utilisez le flux d'événements pour suivre la progression."
  groups:
    - title: Paramètres de chemin
      fields:
        - name: session_id
          type: string
          required: true
          description: ID de la Session (préfixe ses_).
    - title: Objet Session
      description: Renvoyé par create, get, update, rename, archive et unarchive.
      fields:
        - name: id
          type: string
          required: true
          description: ID de la Session avec le préfixe ses_.
        - name: status
          type: string
          required: true
          description: "Statut d'exécution : idle, in_progress ou failed. requires_action n'est pas encore pris en charge et apparaît sous la forme 502 executor_contract_error."
        - name: lifecycle_status
          type: string
          required: true
          description: active ou archived. Les Sessions archivées refusent les entrées.
        - name: failure
          type: object · null
          required: true
          description: Échec public avec code, message, action et retryable facultatif.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: Version d'Agent figée et modèle effectif.
        - name: agent · usage
          type: object · object | null
          required: true
          description: Instantané au format OpenAI de la configuration effective de l'Agent, et utilisation des tokens (null tant qu'aucun tour ne rapporte d'utilisation).
        - name: source · source_id
          type: string · null
          required: false
          description: Origine de la Session. Les Sessions créées avec POST /v1/agents/sessions indiquent direct et un source_id null.
        - name: row_version
          type: integer
          required: true
          description: Jeton de compare-and-set pour rename, archive et unarchive.
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
