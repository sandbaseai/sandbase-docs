---
i18nSource: f3150233afd08b90
title: Agent の作成
description: POST /v1/agents で、保存されバージョン管理される Agent を作成します。
aside: false
outline: false
apiReference:
  title: Agent の作成
  operation: Agents
  method: POST
  path: /v1/agents
  description: 保存済みの Agent をバージョン 1 として作成します。ボディは厳密な JSON で、不明なフィールドは 400 を返します。multi_agent は省略するか null にする必要があります。
  groups:
    - title: ヘッダー
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 任意。省略するとサービスが生成するため、再試行したリクエストで重複が作成される可能性があります。再試行には独自の安定したキーを送信してください。
    - title: リクエストボディ
      description: JSON オブジェクト。
      fields:
        - name: model
          type: string
          required: true
          description: 必須。Models API のモデル ID で、最大 200 文字。デフォルトはなく、model を省略すると 400 を返します。例では deepseek/deepseek-v4-flash を使用しています。
        - name: name
          type: string
          required: false
          description: 表示名。最大 128 文字。
        - name: instructions
          type: string
          required: false
          description: システム指示。最大 256 KiB。
        - name: runtime_profile
          type: string
          required: false
          description: "実行ランタイム: codex（デフォルト）、claude、または mcode。"
        - name: skills
          type: array
          required: false
          description: 'Skill の参照: {"skill_id": "skl_…", "version": null | "<version>"}。最大 32 件。新しいバインディングでは、null を指定すると Agent の保存時点の現在のデフォルトに固定されます。既存のバインディングでは、null は固定済みのバージョンを維持します。アップグレードするには明示的なバージョンを指定してください。'
        - name: mcp_connections
          type: array
          required: false
          description: 'MCP の参照: {connection_id, server_label, allowed_tools, required}。最大 32 件で、server_label は Agent 内で一意である必要があります。省略すると組み込みの SandBase ツール（{"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin"}）が使用されます。リストを送信するとこのデフォルトが置き換えられ、[] を指定するとツールなしの Agent が作成されます。組み込みの SandBase ツール（/agents/mcp-tools#built-in-sandbase-tools）を参照してください。'
        - name: tools
          type: array
          required: false
          description: 最大 64 個の関数ツールと、最大 1 つの web_search ツール。現在、Session では web_search のモードを無効にする必要があり、クライアント側の関数結果はまだサポートされていません。
        - name: text
          type: object
          required: false
          description: format.type は text または json_schema（object スキーマ付き）。verbosity は low、medium、または high。
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
          description: 最大 16 個の文字列ペア。キーは最大 64 文字、値は最大 512 文字。
        - name: description
          type: string
          required: false
          description: 詳しい説明。最大 4096 文字。
        - name: note
          type: string
          required: false
          description: バージョン 1 に記録される変更メモ。
    - title: Agent オブジェクト
      description: create、get、update、archive、unarchive、restore、clone で返されます。
      fields:
        - name: id
          type: string
          required: true
          description: agt_ プレフィックス付きの Agent ID。
        - name: object
          type: string
          required: true
          description: 常に agent。
        - name: version
          type: integer
          required: true
          description: 現在のバージョン。実質的な書き込みのたびに新しいバージョンが作成されます。
        - name: row_version
          type: integer
          required: true
          description: PATCH、archive、unarchive、restore 用の compare-and-set トークン。
        - name: status
          type: string
          required: true
          description: active または archived。
        - name: projection_status
          type: string
          required: true
          description: 現在のバージョンの実行準備状態。Session には ready が必要です。新しい Agent は一時的に pending を報告することがあります。
        - name: runtime_profile
          type: string
          required: true
          description: codex、claude、または mcode。
        - name: visibility
          type: string
          required: true
          description: 自分の Agent は private、カタログのエントリは public。
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Unix 秒。アクティブな間、archived_at は null です。
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
