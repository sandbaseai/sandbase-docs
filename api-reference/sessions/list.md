---
title: List Sessions
description: List Sessions with cursor pagination.
aside: false
outline: false
apiReference:
  title: List Sessions
  operation: Sessions
  method: GET
  path: /v1/agents/sessions
  description: List Sessions in your organization with cursor pagination. Rows that cannot be read live still appear, with a failure such as session_not_ready or session_snapshot_unavailable.
  groups:
    - title: Query parameters
      fields:
        - name: lifecycle_status
          type: string
          required: false
          description: active, archived, or all.
          default: active
        - name: agent_id
          type: string
          required: false
          description: Only Sessions of this Agent.
        - name: limit
          type: integer
          required: false
          description: Page size from 1 to 100. Values outside the range return 400.
          default: "20"
        - name: after
          type: string
          required: false
          description: Cursor. Pass last_id from the previous page.
        - name: order
          type: string
          required: false
          description: asc or desc by creation time.
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
