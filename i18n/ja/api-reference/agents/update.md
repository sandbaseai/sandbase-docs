---
i18nSource: 1b680f7f0804feb7
title: Agent の更新
description: OpenAI SDK 形式の POST 更新で Agent を部分的に更新します。
aside: false
outline: false
apiReference:
  title: Agent の更新
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: SDK 形式の部分更新です。指定したフィールドは保存済みの値を置き換え、新しいバージョンを作成します。省略したフィールドは値を保持します。row_version は不要です。description と note はここでは受け付けないため、Replace (PATCH) を使用してください。アーカイブ済みの Agent は 404 を返します。
  groups:
    - title: パスパラメーター
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
          description: 任意。省略するとサービスが自動生成するため、リトライしたリクエストで重複が作成される可能性があります。リトライには独自の安定したキーを送信してください。
    - title: リクエストボディ
      description: 以下のフィールドの任意の組み合わせ。その他のフィールドは 400 を返します。
      fields:
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
          description: 'Skill 参照：{"skill_id": "skl_…", "version": null | "<version>"}。最大 32 件。新しいバインディングでは、null を指定すると Agent の保存時点の現在のデフォルトに固定されます。既存のバインディングでは、null は固定済みのバージョンを維持します。アップグレードするには明示的なバージョンを指定してください。'
        - name: mcp_connections
          type: array
          required: false
          description: MCP 参照：{connection_id, server_label, allowed_tools, required}。最大 32 件。server_label は Agent 内で一意である必要があります。
        - name: tools
          type: array
          required: false
          description: 最大 64 個の function ツールと、最大 1 個の web_search ツール。現在 Session では web_search モードを無効にする必要があり、クライアント側の function 結果はまだサポートされていません。
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
          description: 最大 16 組の文字列ペア。キーは最大 64 文字、値は最大 512 文字。
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
