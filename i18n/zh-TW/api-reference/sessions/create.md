---
i18nSource: 91ce9f65766e9662
title: 建立 Session
description: 使用 POST /v1/agents/sessions 為已儲存或內嵌的 Agent 建立 Session，並可選擇串流第一個 turn。
aside: false
outline: false
apiReference:
  title: 建立 Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: 為已儲存的 Agent 版本，或在請求中定義的內嵌 Agent 建立 Session。Agent 設定、Skill 版本與 MCP 連線會在 Session 的整個生命週期內凍結。Session 一律在 SandBase 的託管雲端執行，因此無須選擇執行環境。若設定 stream=true 並提供初始輸入，回應會是第一個 turn 的 201 Server-Sent Events 串流，而非 JSON Session。執行准入（餘額與組織狀態）會在此檢查。OpenAI SDK 需要 environment 引數；請參閱 OpenAI 相容性（/agents/openai-compatibility）。
  groups:
    - title: 標頭
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 選用。省略時服務會自動產生一組，因此重試的請求可能會建立重複項目。重試時請傳送您自己的固定金鑰。
    - title: 請求主體
      description: 嚴格的 JSON 物件。
      fields:
        - name: agent_id
          type: string
          required: false
          description: 已儲存的 Agent ID（agt_ 前綴）。該 Agent 必須為 active 且 projection_status 為 ready。可傳送 agent_id、agent 或兩者。
        - name: agent
          type: object
          required: false
          description: Agent 設定。可接受的欄位有 model、instructions、runtime_profile（codex、claude 或 mcode；預設 codex）、service_tier、tools、text、reasoning 與 multi_agent，驗證方式與建立 Agent 相同。未提供 agent_id 時，它會定義內嵌 Agent，且 model 為必填；內嵌 Agent 不帶任何 Skills 或 MCP 連線。提供 agent_id 時，您傳送的每個欄位只會在此 Session 中取代已儲存版本的對應欄位。未知欄位會回傳 400。
        - name: version
          type: integer
          required: false
          description: Agent 版本。預設為目前版本。內嵌 Agent 不可使用。
        - name: title
          type: string
          required: false
          description: Session 標題。
        - name: input
          type: string | array
          required: false
          description: 選用的第一個輸入：字串，或恰好包含一則訊息的陣列，例如 [{"role":"user","content":[{"type":"input_text","text":"…"}]}]。單純的物件會回傳 400。
        - name: model
          type: string
          required: false
          description: 模型覆寫。agent.model 是 OpenAI SDK 的形式；兩者同時傳送時必須一致。
        - name: metadata
          type: object
          required: false
          description: 最多 16 組字串鍵值。
        - name: stream
          type: boolean
          required: false
          description: "設為 true 時，必須提供非空的輸入，並回傳 201 與 text/event-stream 主體。事件採用 Stream 事件格式（event: <type>, data: <json>）；第一個事件 agent.session.created 帶有 Session 快照，之後是該 turn 的 item 與輸出事件。在串流開始前發生的驗證、准入及其他錯誤會回傳一般的 JSON 錯誤。預設為 false。"
        - name: environment
          type: object
          required: false
          description: 僅供 OpenAI SDK 相容使用。直接呼叫 HTTP 時請省略；接受 {"type":"openai_hosted"}，其他任何類型都會回傳 400。
        - name: model_provider
          type: object
          required: false
          description: 模型憑證。省略時使用您呼叫時的 API 金鑰。{"type":"custom","base_url":"https://…","api_key":"…"} 會呼叫您自己的 OpenAI 相容端點。僅可寫入。
        - name: github_workspace
          type: object
          required: false
          description: 要為此 Session 複製到 /workspace 的 GitHub 儲存庫：{"repository_id":"1195090324","ref":"main","connection_id":"plc_…"}。只有 repository_id 為必填；ref 預設為預設分支。省略或為 null 時，會使用 Agent 的工作區儲存庫（若有），否則不複製任何內容。該儲存庫必須在 Agent 的 GitHub 連線範圍內。請參閱 GitHub 儲存庫工作區（/agents/github-workspace）。
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
          description: 實際 Agent 設定的 OpenAI 格式快照，以及 token 用量（在 turn 回報用量前為 null）。
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
