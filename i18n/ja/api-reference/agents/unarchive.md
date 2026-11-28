---
i18nSource: 0ca7c063b8a050fd
title: Agent のアーカイブ解除
description: row_version を指定して Agent のアーカイブを解除します。
aside: false
outline: false
apiReference:
  title: Agent のアーカイブ解除
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}/unarchive
  description: compare-and-set で、アーカイブされた Agent をアクティブに戻します。
  groups:
    - title: パスパラメータ
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID（agt_ プレフィックス）。
    - title: ヘッダー
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 任意。省略するとサービス側で生成されるため、リトライしたリクエストで重複が作成される可能性があります。リトライに備えて、固定のキーを自分で送信してください。
    - title: リクエストボディ
      description: JSON オブジェクト。
      fields:
        - name: row_version
          type: integer
          required: true
          description: 最後に読み取った row_version。古い値の場合は 409 が返されます。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/unarchive \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/unarchive",
            headers=headers,
            json={
                "row_version": 3
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/unarchive', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
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
        "version": 3,
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
