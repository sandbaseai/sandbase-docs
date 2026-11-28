---
i18nSource: f3150233afd08b90
title: 建立 Agent
description: 使用 POST /v1/agents 建立已儲存且具版本控制的 Agent。
aside: false
outline: false
apiReference:
  title: 建立 Agent
  operation: Agents
  method: POST
  path: /v1/agents
  description: 建立版本為 1 的已儲存 Agent。請求本文為嚴格 JSON：未知欄位會傳回 400。multi_agent 必須省略或為 null。
  groups:
    - title: 標頭
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 選用。省略時由服務自動產生，因此重試的請求可能會建立重複項目。重試時請傳送您自己的固定金鑰。
    - title: 請求本文
      description: JSON 物件。
      fields:
        - name: model
          type: string
          required: true
          description: 必填，來自 Models API 的模型 ID，最多 200 個字元。沒有預設值；省略 model 會傳回 400。範例使用 deepseek/deepseek-v4-flash。
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
          description: 'Skill 參照：{"skill_id": "skl_…", "version": null | "<version>"}。最多 32 個。新增繫結時，null 會在儲存 Agent 時鎖定當下的預設版本。對於既有繫結，null 會保留其已鎖定的版本；若要升級請提供明確的版本。'
        - name: mcp_connections
          type: array
          required: false
          description: 'MCP 參照：{connection_id, server_label, allowed_tools, required}。最多 32 個；server_label 在 Agent 內必須唯一。省略時會使用內建的 SandBase 工具（{"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin"}）；您傳送的清單會取代此預設值，傳送 [] 則會建立沒有工具的 Agent。請參閱內建 SandBase 工具（/agents/mcp-tools#built-in-sandbase-tools）。'
        - name: tools
          type: array
          required: false
          description: 最多 64 個 function 工具，以及至多一個 web_search 工具。Session 目前要求停用 web_search 模式，且尚不支援用戶端 function 結果。
        - name: text
          type: object
          required: false
          description: format.type 為 text 或 json_schema（搭配 object 結構描述）；verbosity 為 low、medium 或 high。
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
          description: 最多 16 組字串配對；鍵最多 64 個字元，值最多 512 個字元。
        - name: description
          type: string
          required: false
          description: 較長的描述，最多 4096 個字元。
        - name: note
          type: string
          required: false
          description: 記錄於版本 1 的變更說明。
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
        curl -X POST https://api.sandbase.ai/v1/agents \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: create-research-agent-1" \
          -H "Content-Type: application/json" \
          -d '{
            "name": "Research assistant",
            "model": "deepseek/deepseek-v4-flash",
            "instructions": "Answer with cited sources.",
            "metadata": {
              "team": "research"
            }
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.create(
            model="deepseek/deepseek-v4-flash",
            name="Research assistant",
            instructions="Answer with cited sources.",
            metadata={"team": "research"},
        )
        print(agent.id, agent.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "create-research-agent-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents",
            headers=headers,
            json={
                "name": "Research assistant",
                "model": "deepseek/deepseek-v4-flash",
                "instructions": "Answer with cited sources.",
                "metadata": {
                    "team": "research"
                }
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'create-research-agent-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "name": "Research assistant",
            "model": "deepseek/deepseek-v4-flash",
            "instructions": "Answer with cited sources.",
            "metadata": {
              "team": "research"
            }
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
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
        "mcp_connections": [
          {"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin", "allowed_tools": null, "required": true}
        ],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
