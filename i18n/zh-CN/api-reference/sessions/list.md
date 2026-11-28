---
i18nSource: 55d1b73d25426dca
title: 列出 Sessions
description: 使用游标分页列出 Sessions。
aside: false
outline: false
apiReference:
  title: 列出 Sessions
  operation: Sessions
  method: GET
  path: /v1/agents/sessions
  description: 使用游标分页列出你组织中的 Sessions。无法实时读取的记录仍会出现在列表中，并带有 session_not_ready 或 session_snapshot_unavailable 等失败信息。
  groups:
    - title: 查询参数
      fields:
        - name: lifecycle_status
          type: string
          required: false
          description: active、archived 或 all。
          default: active
        - name: agent_id
          type: string
          required: false
          description: 仅返回该 Agent 的 Sessions。
        - name: limit
          type: integer
          required: false
          description: 每页数量，范围 1 到 100。超出范围返回 400。
          default: "20"
        - name: after
          type: string
          required: false
          description: 游标。传入上一页的 last_id。
        - name: order
          type: string
          required: false
          description: 按创建时间 asc 或 desc 排序。
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
