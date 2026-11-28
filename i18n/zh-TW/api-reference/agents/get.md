---
i18nSource: 75530d38a1e4b215
title: 取得 Agent
description: 依 ID 讀取單一 Agent。
aside: false
outline: false
apiReference:
  title: 取得 Agent
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}
  description: 讀取 Agent，包括已封存的 Agent。
  groups:
    - title: 路徑參數
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID（agt_ 前綴）。
    - title: Agent 物件
      description: 由 create、get、update、archive、unarchive、restore 與 clone 傳回。
      fields:
        - name: id
          type: string
          required: true
          description: 帶有 agt_ 前綴的 Agent ID。
        - name: object
          type: string
          required: true
          description: 固定為 agent。
        - name: version
          type: integer
          required: true
          description: 目前版本。每次有效寫入都會建立新版本。
        - name: row_version
          type: integer
          required: true
          description: 用於 PATCH、archive、unarchive 與 restore 的比較並設定（compare-and-set）權杖。
        - name: status
          type: string
          required: true
          description: active 或 archived。
        - name: projection_status
          type: string
          required: true
          description: 目前版本的執行就緒狀態。Session 需要 ready；新建立的 Agent 可能短暫回報 pending。
        - name: runtime_profile
          type: string
          required: true
          description: codex、claude 或 mcode。
        - name: visibility
          type: string
          required: true
          description: 您的 Agent 為 private；目錄項目為 public。
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Unix 秒數。啟用期間 archived_at 為 null。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.retrieve("agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60")
        print(agent.version, agent.status)
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
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
---

<ApiReferencePage />
