---
i18nSource: dcaf28fee73ca27e
title: 還原 Agent 版本
description: 將較早的 Agent 版本還原為新的目前版本。
aside: false
outline: false
apiReference:
  title: 還原 Agent 版本
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}/restore
  description: 將 source_version 的設定複製為新的目前版本。歷史紀錄永遠不會被改寫。
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
          description: 選用。省略時由服務自動產生，因此重試的請求可能會建立重複項目。重試時請傳送您自己的固定金鑰。
    - title: 請求本文
      description: JSON 物件。
      fields:
        - name: source_version
          type: integer
          required: true
          description: 要還原的較早版本。
        - name: row_version
          type: integer
          required: true
          description: 您最後讀取的 row_version。值過期時會回傳 409。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/restore \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "source_version": 1,
            "row_version": 3
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
            "POST",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/restore",
            headers=headers,
            json={
                "source_version": 1,
                "row_version": 3
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/restore', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "source_version": 1,
            "row_version": 3
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
        "version": 4,
        "row_version": 4,
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
