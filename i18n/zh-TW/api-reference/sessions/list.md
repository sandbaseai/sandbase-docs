---
i18nSource: 55d1b73d25426dca
title: 列出 Session
description: 以游標分頁列出 Session。
aside: false
outline: false
apiReference:
  title: 列出 Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions
  description: 以游標分頁列出您組織中的 Session。無法即時讀取的資料列仍會出現，並帶有 session_not_ready 或 session_snapshot_unavailable 等失敗資訊。
  groups:
    - title: 查詢參數
      fields:
        - name: lifecycle_status
          type: string
          required: false
          description: active、archived 或 all。
          default: active
        - name: agent_id
          type: string
          required: false
          description: 僅限此 Agent 的 Session。
        - name: limit
          type: integer
          required: false
          description: 每頁筆數，範圍 1 到 100。超出範圍會傳回 400。
          default: "20"
        - name: after
          type: string
          required: false
          description: 游標。傳入上一頁的 last_id。
        - name: order
          type: string
          required: false
          description: 依建立時間 asc 或 desc 排序。
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
