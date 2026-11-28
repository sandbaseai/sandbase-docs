---
i18nSource: 1315141eb7505641
title: Lista Agents
description: Wyświetl listę Agents z paginacją kursorową.
aside: false
outline: false
apiReference:
  title: Lista Agents
  operation: Agents
  method: GET
  path: /v1/agents
  description: "Wyświetl listę Agents należących do Twojej organizacji. Wyniki używają paginacji kursorowej: przekazuj last_id jako after, dopóki has_more ma wartość true."
  groups:
    - title: Parametry zapytania
      fields:
        - name: status
          type: string
          required: false
          description: active, archived lub all. Inne wartości zwracają 400.
          default: active
        - name: limit
          type: integer
          required: false
          description: Rozmiar strony od 1 do 100. Wartości spoza zakresu zwracają 400.
          default: "20"
        - name: after
          type: string
          required: false
          description: Kursor. Przekaż last_id z poprzedniej strony.
        - name: order
          type: string
          required: false
          description: asc lub desc według czasu utworzenia.
          default: desc
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET "https://api.sandbase.ai/v1/agents?status=active&limit=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        for agent in client.beta.agents.list(limit=20):
            print(agent.id, agent.name)
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
            "https://api.sandbase.ai/v1/agents?status=active&limit=20",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents?status=active&limit=20', {
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
            "mcp_connections": [],
            "skills": [],
            "created_at": 1791273600,
            "updated_at": 1791273600,
            "archived_at": null
          }
        ],
        "has_more": false,
        "first_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "last_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"
      }
---

<ApiReferencePage />
