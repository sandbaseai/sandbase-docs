---
i18nSource: be0b17847a19a11c
title: 取得 Session
description: 讀取一個 Session。
aside: false
outline: false
apiReference:
  title: 取得 Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}
  description: 讀取 Session。執行狀態為即時讀取，因此請輪詢此端點或使用事件串流追蹤進度。
  groups:
    - title: 路徑參數
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前綴）。
    - title: Session 物件
      description: 由 create、get、update、rename、archive 與 unarchive 回傳。
      fields:
        - name: id
          type: string
          required: true
          description: 帶有 ses_ 前綴的 Session ID。
        - name: status
          type: string
          required: true
          description: 執行狀態：idle、in_progress 或 failed。尚不支援 requires_action，會以 502 executor_contract_error 呈現。
        - name: lifecycle_status
          type: string
          required: true
          description: active 或 archived。已封存的 Session 會拒絕輸入。
        - name: failure
          type: object · null
          required: true
          description: 公開的失敗資訊，包含 code、message、action 與選用的 retryable。
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: 凍結的 Agent 版本與實際使用的模型。
        - name: agent · usage
          type: object · object | null
          required: true
          description: 實際生效之 Agent 設定的 OpenAI 格式快照，以及 token 用量（在回合回報用量前為 null）。
        - name: source · source_id
          type: string · null
          required: false
          description: Session 的來源。以 POST /v1/agents/sessions 建立的 Session 會回報 direct，且 source_id 為 null。
        - name: row_version
          type: integer
          required: true
          description: 用於 rename、archive 與 unarchive 的比較並設定（compare-and-set）權杖。
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
