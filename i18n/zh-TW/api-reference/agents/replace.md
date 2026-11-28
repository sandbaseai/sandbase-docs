---
i18nSource: 4e711691737c9671
title: 取代 Agent（CAS）
description: 以 row_version 進行 compare-and-set 來更新 Agent。
aside: false
outline: false
apiReference:
  title: 取代 Agent（CAS）
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: 使用 compare-and-set 的產品更新。row_version 為必填，且必須等於目前的值，否則回傳 409。提供的欄位會取代已儲存的值；明確傳入 null 會回傳 400。當多位編輯者可能修改同一個 Agent 時，請使用此形式。
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
          description: 選填。若省略，服務會自動產生一個，因此重試請求可能會建立重複項目。重試時請傳送您自己的固定金鑰。
    - title: 請求本文
      description: row_version 加上任意 Agent 欄位子集。
      fields:
        - name: row_version
          type: integer
          required: true
          description: 您最後讀取到的 row_version。值過期時會回傳 409。
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
          description: 'Skill 參照：{"skill_id": "skl_…", "version": null | "<version>"}。最多 32 個。對於新的綁定，null 會在儲存 Agent 時固定為當下的預設版本。對於既有的綁定，null 會保留其已固定的版本；若要升級，請提供明確的版本。'
        - name: mcp_connections
          type: array
          required: false
          description: MCP 參照：{connection_id, server_label, allowed_tools, required}。最多 32 個；server_label 在 Agent 中必須唯一。
        - name: tools
          type: array
          required: false
          description: 最多 64 個 function 工具，外加最多一個 web_search 工具。Session 目前需要停用 web_search 模式，且尚未支援用戶端 function 結果。
        - name: text
          type: object
          required: false
          description: format.type 為 text 或 json_schema（搭配 object schema）；verbosity 為 low、medium 或 high。
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
          description: 最多 16 組字串鍵值對；鍵最多 64 個字元，值最多 512 個字元。
        - name: description
          type: string
          required: false
          description: 最多 4096 個字元。
        - name: note
          type: string
          required: false
          description: 記錄在新版本上的變更說明。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
          }'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "PATCH",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "row_version": 2,
                "description": "Research Agent used by the weekly brief.",
                "note": "Add description"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
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
        "version": 3,
        "row_version": 3,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "Research Agent used by the weekly brief.",
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
