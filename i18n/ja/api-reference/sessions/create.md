---
i18nSource: 91ce9f65766e9662
title: Session の作成
description: POST /v1/agents/sessions で保存済みまたはインラインの Agent の Session を作成します。最初のターンをストリーミングすることもできます。
aside: false
outline: false
apiReference:
  title: Session の作成
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: 保存済みの Agent バージョン、またはリクエスト内で定義したインライン Agent の Session を作成します。Agent の設定、Skill のバージョン、MCP 接続は Session の存続期間中固定されます。Session は常に SandBase のホスト型クラウドで実行されるため、実行環境を選ぶ必要はありません。stream=true と初回 input を指定すると、レスポンスは JSON の Session ではなく、最初のターンの 201 Server-Sent Events ストリームになります。実行の受け入れ条件（残高と組織のステータス）はここでチェックされます。OpenAI SDK では environment 引数が必須です。OpenAI 互換性（/agents/openai-compatibility）を参照してください。
  groups:
    - title: ヘッダー
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 任意。省略するとサービスが自動生成するため、リトライしたリクエストで重複が作成される可能性があります。リトライには独自の安定したキーを送信してください。
    - title: リクエストボディ
      description: 厳密な JSON オブジェクト。
      fields:
        - name: agent_id
          type: string
          required: false
          description: 保存済みの Agent ID（agt_ プレフィックス）。Agent は active で、projection_status が ready である必要があります。agent_id、agent、またはその両方を送信してください。
        - name: agent
          type: object
          required: false
          description: Agent の設定。受け付けるフィールドは model、instructions、runtime_profile（codex、claude、または mcode。デフォルトは codex）、service_tier、tools、text、reasoning、multi_agent で、Create Agent と同様に検証されます。agent_id がない場合はインライン Agent を定義し、model が必須です。インライン Agent には Skill も MCP 接続も含まれません。agent_id がある場合、送信した各フィールドはこの Session に限り保存済みバージョンの該当フィールドを置き換えます。不明なフィールドは 400 を返します。
        - name: version
          type: integer
          required: false
          description: Agent のバージョン。デフォルトは現在のバージョンです。インライン Agent では指定できません。
        - name: title
          type: string
          required: false
          description: Session のタイトル。
        - name: input
          type: string | array
          required: false
          description: 任意の初回入力：文字列、またはメッセージを 1 件だけ含む配列。例：[{"role":"user","content":[{"type":"input_text","text":"…"}]}]。単独のオブジェクトは 400 を返します。
        - name: model
          type: string
          required: false
          description: モデルの上書き。agent.model は OpenAI SDK の形式です。両方を送信する場合は一致している必要があります。
        - name: metadata
          type: object
          required: false
          description: 最大 16 組の文字列ペア。
        - name: stream
          type: boolean
          required: false
          description: "true の場合、空でない input が必須となり、text/event-stream ボディ付きの 201 を返します。イベントは Stream events 形式（event: <type>, data: <json>）を使用します。最初の agent.session.created に Session のスナップショットが含まれ、その後にターンの item イベントと output イベントが続きます。ストリーム開始前の検証エラー、受け入れエラー、その他のエラーは通常の JSON エラーを返します。デフォルトは false です。"
        - name: environment
          type: object
          required: false
          description: OpenAI SDK 互換性専用です。直接 HTTP で呼び出す場合は省略してください。{"type":"openai_hosted"} は受け付けられ、それ以外の type は 400 を返します。
        - name: model_provider
          type: object
          required: false
          description: モデルの認証情報。省略すると呼び出し元の API キーを使用します。{"type":"custom","base_url":"https://…","api_key":"…"} を指定すると、独自の OpenAI 互換エンドポイントを呼び出します。書き込み専用です。
        - name: github_workspace
          type: object
          required: false
          description: この Session の /workspace にクローンする GitHub リポジトリ：{"repository_id":"1195090324","ref":"main","connection_id":"plc_…"}。必須は repository_id のみで、ref のデフォルトはデフォルトブランチです。省略または null の場合は Agent のワークスペースリポジトリがあればそれを使用し、なければ何もクローンしません。リポジトリは Agent の GitHub 接続のスコープ内にある必要があります。GitHub リポジトリワークスペース（/agents/github-workspace）を参照してください。
    - title: Session オブジェクト
      description: create、get、update、rename、archive、unarchive で返されます。
      fields:
        - name: id
          type: string
          required: true
          description: ses_ プレフィックス付きの Session ID。
        - name: status
          type: string
          required: true
          description: 実行ステータス：idle、in_progress、または failed。requires_action はまだサポートされておらず、502 executor_contract_error として返されます。
        - name: lifecycle_status
          type: string
          required: true
          description: active または archived。アーカイブ済みの Session は入力を拒否します。
        - name: failure
          type: object · null
          required: true
          description: code、message、action、任意の retryable を含む公開エラー情報。
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: 固定された Agent バージョンと実効モデル。
        - name: agent · usage
          type: object · object | null
          required: true
          description: 実効 Agent 設定の OpenAI 形式のスナップショットと、トークン使用量（ターンが使用量を報告するまでは null）。
        - name: source · source_id
          type: string · null
          required: false
          description: Session の作成元。POST /v1/agents/sessions で作成した Session は direct と null の source_id を返します。
        - name: row_version
          type: integer
          required: true
          description: rename、archive、unarchive 用の compare-and-set トークン。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-2026-10-06" \
          -H "Content-Type: application/json" \
          -d '{
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "title": "Market scan"
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        session = client.beta.agents.sessions.create(
            agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
        )
        print(session.id, session.status)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-2026-10-06",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions",
            headers=headers,
            json={
                "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
                "title": "Market scan",
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-2026-10-06',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "title": "Market scan"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
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
---

<ApiReferencePage />
