---
i18nSource: be0b17847a19a11c
title: 获取 Session
description: 读取单个 Session。
aside: false
outline: false
apiReference:
  title: 获取 Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}
  description: 读取一个 Session。执行状态为实时读取，可轮询此端点或使用事件流跟踪进度。
  groups:
    - title: 路径参数
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前缀）。
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
          description: 执行状态：idle、in_progress 或 failed。requires_action 暂不支持，会以 502 executor_contract_error 形式出现。
        - name: lifecycle_status
          type: string
          required: true
          description: active 或 archived。已归档的 Session 会拒绝输入。
        - name: failure
          type: object · null
          required: true
          description: 公开的失败信息，包含 code、message、action 以及可选的 retryable。
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: 冻结的 Agent 版本和实际使用的模型。
        - name: agent · usage
          type: object · object | null
          required: true
          description: 实际生效的 Agent 配置的 OpenAI 格式快照，以及 token 用量（在某个轮次上报用量之前为 null）。
        - name: source · source_id
          type: string · null
          required: false
          description: Session 的来源。通过 POST /v1/agents/sessions 创建的 Session 报告为 direct，且 source_id 为 null。
        - name: row_version
          type: integer
          required: true
          description: 用于 rename、archive 和 unarchive 的比较并设置（compare-and-set）令牌。
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
