---
i18nSource: 91ce9f65766e9662
title: 创建 Session
description: 使用 POST /v1/agents/sessions 为已保存或内联的 Agent 创建 Session，可选择以流式方式返回第一轮。
aside: false
outline: false
apiReference:
  title: 创建 Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: 为已保存的 Agent 版本或在请求中定义的内联 Agent 创建 Session。Agent 配置、Skill 版本和 MCP 连接在 Session 的整个生命周期内保持冻结。Session 始终在 SandBase 托管云中运行，因此无需选择执行环境。当 stream=true 且提供了初始 input 时，响应为第一轮的 201 Server-Sent Events 流，而不是 JSON 格式的 Session。执行准入（余额和组织状态）在此处检查。OpenAI SDK 要求传入 environment 参数；参阅 OpenAI 兼容性 (/agents/openai-compatibility)。
  groups:
    - title: 请求头
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 可选。省略时服务会自动生成一个，因此重试请求可能会创建重复项。重试时请发送你自己的固定键。
    - title: 请求体
      description: 严格 JSON 对象。
      fields:
        - name: agent_id
          type: string
          required: false
          description: 已保存的 Agent ID（agt_ 前缀）。该 Agent 必须处于 active 状态且 projection_status 为 ready。可发送 agent_id、agent 或两者。
        - name: agent
          type: object
          required: false
          description: Agent 配置。可接受的字段为 model、instructions、runtime_profile（codex、claude 或 mcode；默认 codex）、service_tier、tools、text、reasoning 和 multi_agent，校验规则与创建 Agent 相同。不提供 agent_id 时，它定义一个内联 Agent，且 model 为必填；内联 Agent 不带 Skills 或 MCP 连接。提供 agent_id 时，你发送的每个字段仅在此 Session 中替换已保存版本的对应字段。未知字段返回 400。
        - name: version
          type: integer
          required: false
          description: Agent 版本。默认为当前版本。内联 Agent 不允许使用。
        - name: title
          type: string
          required: false
          description: Session 标题。
        - name: input
          type: string | array
          required: false
          description: 可选的首次输入：一个字符串，或恰好包含一条消息的数组，例如 [{"role":"user","content":[{"type":"input_text","text":"…"}]}]。直接传对象会返回 400。
        - name: model
          type: string
          required: false
          description: 覆盖模型。agent.model 是 OpenAI SDK 的写法；两者同时发送时必须一致。
        - name: metadata
          type: object
          required: false
          description: 最多 16 个字符串键值对。
        - name: stream
          type: boolean
          required: false
          description: "为 true 时，要求提供非空 input，并返回 201 及 text/event-stream 响应体。事件采用 Stream events 格式（event: <type>, data: <json>）；第一个事件 agent.session.created 携带 Session 快照，随后是该轮的 item 和输出事件。流开始前发生的校验、准入及其他错误会返回常规 JSON 错误。默认为 false。"
        - name: environment
          type: object
          required: false
          description: 仅用于 OpenAI SDK 兼容。直接调用 HTTP 时请省略；接受 {"type":"openai_hosted"}，其他 type 返回 400。
        - name: model_provider
          type: object
          required: false
          description: 模型凭据。省略时使用你调用时的 API 密钥。{"type":"custom","base_url":"https://…","api_key":"…"} 会调用你自己的 OpenAI 兼容端点。只写字段。
        - name: github_workspace
          type: object
          required: false
          description: 为此 Session 克隆到 /workspace 的 GitHub 仓库：{"repository_id":"1195090324","ref":"main","connection_id":"plc_…"}。只有 repository_id 为必填；ref 默认为默认分支。省略或为 null 时使用 Agent 的工作区仓库（如有），否则不克隆任何内容。该仓库必须在 Agent 的 GitHub 连接范围内。参阅 GitHub 仓库工作区 (/agents/github-workspace)。
    - title: Session 对象
      description: 由 create、get、update、rename、archive 和 unarchive 返回。
      fields:
        - name: id
          type: string
          required: true
          description: 带 ses_ 前缀的 Session ID。
        - name: status
          type: string
          required: true
          description: 执行状态：idle、in_progress 或 failed。requires_action 暂不支持，会表现为 502 executor_contract_error。
        - name: lifecycle_status
          type: string
          required: true
          description: active 或 archived。已归档的 Session 拒绝输入。
        - name: failure
          type: object · null
          required: true
          description: 公开的失败信息，包含 code、message、action 以及可选的 retryable。
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: 冻结的 Agent 版本和实际生效的模型。
        - name: agent · usage
          type: object · object | null
          required: true
          description: 实际生效的 Agent 配置的 OpenAI 格式快照，以及 token 用量（在某一轮报告用量之前为 null）。
        - name: source · source_id
          type: string · null
          required: false
          description: Session 的来源。通过 POST /v1/agents/sessions 创建的 Session 报告 direct，source_id 为 null。
        - name: row_version
          type: integer
          required: true
          description: 用于 rename、archive 和 unarchive 的比较并设置令牌。
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
