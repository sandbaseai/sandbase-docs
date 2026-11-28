---
i18nSource: 4e711691737c9671
title: Agent の置換（CAS）
description: row_version に対する compare-and-set で Agent を更新します。
aside: false
outline: false
apiReference:
  title: Agent の置換（CAS）
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: compare-and-set による製品向けの更新です。row_version は必須で、現在の値と一致しない場合は 409 が返されます。指定したフィールドは保存済みの値を置き換えます。明示的な null 値を指定すると 400 が返されます。複数の編集者が同じ Agent を変更する可能性がある場合は、この形式を使用してください。
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
      description: row_version と、Agent フィールドの任意の組み合わせ。
      fields:
        - name: row_version
          type: integer
          required: true
          description: 最後に読み取った row_version。古い値の場合は 409 が返されます。
        - name: model
          type: string
          required: false
          description: Models API のモデル ID（最大 200 文字）。
        - name: name
          type: string
          required: false
          description: 表示名（最大 128 文字）。
        - name: instructions
          type: string
          required: false
          description: システム指示（最大 256 KiB）。
        - name: runtime_profile
          type: string
          required: false
          description: 実行ランタイム：codex（デフォルト）、claude、または mcode。
        - name: skills
          type: array
          required: false
          description: 'Skill 参照：{"skill_id": "skl_…", "version": null | "<version>"}。最大 32 個。新しいバインディングでは、null を指定すると Agent の保存時点の現在のデフォルトに固定されます。既存のバインディングでは、null を指定すると固定済みのバージョンが維持されます。アップグレードするには明示的なバージョンを指定してください。'
        - name: mcp_connections
          type: array
          required: false
          description: MCP 参照：{connection_id, server_label, allowed_tools, required}。最大 32 個。server_label は Agent 内で一意である必要があります。
        - name: tools
          type: array
          required: false
          description: 最大 64 個の function ツールと、最大 1 個の web_search ツール。現在 Sessions では web_search モードを無効にする必要があり、クライアント側の function の結果にはまだ対応していません。
        - name: text
          type: object
          required: false
          description: format.type は text または json_schema（object スキーマを指定）。verbosity は low、medium、または high。
        - name: reasoning
          type: object
          required: false
          description: effort は none、minimal、low、medium、high、xhigh、または max。summary は concise、detailed、または auto。
        - name: service_tier
          type: string
          required: false
          description: auto（デフォルト）、default、flex、priority、または fast。
        - name: metadata
          type: object
          required: false
          description: 最大 16 個の文字列ペア。キーは最大 64 文字、値は最大 512 文字です。
        - name: description
          type: string
          required: false
          description: 最大 4096 文字。
        - name: note
          type: string
          required: false
          description: 新しいバージョンに記録される変更メモ。
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
