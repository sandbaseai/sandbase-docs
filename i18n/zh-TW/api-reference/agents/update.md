---
i18nSource: 1b680f7f0804feb7
title: 更新 Agent
description: 使用 OpenAI SDK 風格的 POST 更新，部分更新 Agent。
aside: false
outline: false
apiReference:
  title: 更新 Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: SDK 風格的部分更新。提供的欄位會取代已儲存的值並建立新版本；省略的欄位保留原值。不需要 row_version。此處不接受 description 與 note；請改用 Replace（PATCH）更新這些欄位。已封存的 Agent 會回傳 404。
  groups:
    - title: 路徑參數
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID（agt_ 前綴）。
    - title: 標頭
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 選用。省略時服務會自動產生一組，因此重試的請求可能會建立重複項目。重試時請傳送您自己的固定金鑰。
    - title: 請求主體
      description: 以下欄位的任意子集。其他欄位會回傳 400。
      fields:
        - name: model
          type: string
          required: false
          description: 來自 Models API 的模型 ID，最多 200 個字元。
        - name: name
          type: string
          required: false
          description: 顯示名稱，最多 128 個字元。
        - name: instructions
          type: string
          required: false
          description: 系統指示，最多 256 KiB。
        - name: runtime_profile
          type: string
          required: false
          description: 執行環境：codex（預設）、claude 或 mcode。
        - name: skills
          type: array
          required: false
          description: 'Skill 參照：{"skill_id": "skl_…", "version": null | "<version>"}。最多 32 個。對新繫結而言，null 會在儲存 Agent 時固定為當下的預設版本。對既有繫結而言，null 會保留其已固定的版本；若要升級請指定明確版本。'
        - name: mcp_connections
          type: array
          required: false
          description: MCP 參照：{connection_id, server_label, allowed_tools, required}。最多 32 個；server_label 在 Agent 內不可重複。
        - name: tools
          type: array
          required: false
          description: 最多 64 個 function 工具，加上最多一個 web_search 工具。Session 目前要求 web_search 模式為 disabled，且尚不支援用戶端回傳的 function 結果。
        - name: text
          type: object
          required: false
          description: format.type 為 text 或 json_schema（搭配物件 schema）；verbosity 為 low、medium 或 high。
        - name: reasoning
          type: object
          required: false
          description: effort 為 none、minimal、low、medium、high、xhigh 或 max；summary 為 concise、detailed 或 auto。
        - name: service_tier
          type: string
          required: false
          description: auto（預設）、default、flex、priority 或 fast。
        - name: metadata
          type: object
          required: false
          description: 最多 16 組字串鍵值；鍵最多 64 個字元，值最多 512 個字元。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "instructions": "Answer in five bullet points with cited sources."
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.update(
            "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            instructions="Answer in five bullet points with cited sources.",
        )
        print(agent.version)
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "instructions": "Answer in five bullet points with cited sources."
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "instructions": "Answer in five bullet points with cited sources."
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
        "instructions": "Answer in five bullet points with cited sources.",
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
        "version": 2,
        "row_version": 2,
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
