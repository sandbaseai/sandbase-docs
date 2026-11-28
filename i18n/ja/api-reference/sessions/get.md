---
i18nSource: be0b17847a19a11c
title: Session の取得
description: Session を 1 つ読み取ります。
aside: false
outline: false
apiReference:
  title: Session の取得
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}
  description: Session を読み取ります。実行ステータスはリアルタイムで読み取られるため、進行状況を追うには、このエンドポイントをポーリングするかイベントストリームを使ってください。
  groups:
    - title: パスパラメーター
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ プレフィックス）。
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
          description: "実行ステータス: idle、in_progress、または failed。requires_action はまだサポートされておらず、502 executor_contract_error として返されます。"
        - name: lifecycle_status
          type: string
          required: true
          description: active または archived。アーカイブされた Session は入力を拒否します。
        - name: failure
          type: object · null
          required: true
          description: code、message、action、任意の retryable を含む公開エラー。
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: 固定された Agent バージョンと実際に使われるモデル。
        - name: agent · usage
          type: object · object | null
          required: true
          description: 実際に適用される Agent 設定の OpenAI 形式のスナップショットと、トークン使用量（ターンが使用量を報告するまでは null）。
        - name: source · source_id
          type: string · null
          required: false
          description: Session の作成元。POST /v1/agents/sessions で作成された Session は direct を返し、source_id は null になります。
        - name: row_version
          type: integer
          required: true
          description: rename、archive、unarchive 用の compare-and-set トークン。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83 \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        session = client.beta.agents.sessions.retrieve("ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83")
        print(session.status, session.failure)
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
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83', {
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
        "status": "in_progress",
        "lifecycle_status": "active",
        "sync_status": "ready",
        "execution_status": "in_progress",
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
