---
i18nSource: 1315141eb7505641
title: Agent'ları Listele
description: Agent'ları cursor sayfalamayla listeleyin.
aside: false
outline: false
apiReference:
  title: Agent'ları Listele
  operation: Agents
  method: GET
  path: /v1/agents
  description: "Kuruluşunuza ait Agent'ları listeleyin. Sonuçlar cursor sayfalama kullanır: has_more true olduğu sürece last_id değerini after olarak gönderin."
  groups:
    - title: Sorgu parametreleri
      fields:
        - name: status
          type: string
          required: false
          description: active, archived veya all. Diğer değerler 400 döndürür.
          default: active
        - name: limit
          type: integer
          required: false
          description: 1 ile 100 arasında sayfa boyutu. Aralık dışındaki değerler 400 döndürür.
          default: "20"
        - name: after
          type: string
          required: false
          description: Cursor. Önceki sayfadan gelen last_id değerini gönderin.
        - name: order
          type: string
          required: false
          description: Oluşturulma zamanına göre asc veya desc.
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
