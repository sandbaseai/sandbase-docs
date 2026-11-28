---
i18nSource: 1b680f7f0804feb7
title: 更新 Agent
description: 使用 OpenAI SDK 风格的 POST 更新对 Agent 进行部分更新。
aside: false
outline: false
apiReference:
  title: 更新 Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: SDK 风格的部分更新。提供的字段会替换已保存的值并创建新版本；省略的字段保持原值。无需 row_version。此处不接受 description 和 note；如需修改请使用 Replace (PATCH)。已归档的 Agent 返回 404。
  groups:
    - title: 路径参数
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID（agt_ 前缀）。
    - title: 请求头
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 可选。省略时服务会自动生成一个，因此重试请求可能会创建重复项。重试时请发送你自己的固定键。
    - title: 请求体
      description: 以下字段的任意子集。其他字段返回 400。
      fields:
        - name: model
          type: string
          required: false
          description: 来自 Models API 的模型 ID，最多 200 个字符。
        - name: name
          type: string
          required: false
          description: 显示名称，最多 128 个字符。
        - name: instructions
          type: string
          required: false
          description: 系统指令，最大 256 KiB。
        - name: runtime_profile
          type: string
          required: false
          description: 执行运行时：codex（默认）、claude 或 mcode。
        - name: skills
          type: array
          required: false
          description: 'Skill 引用：{"skill_id": "skl_…", "version": null | "<version>"}。最多 32 个。对于新绑定，null 会在保存 Agent 时固定为当前默认版本。对于已有绑定，null 会保留其固定版本；如需升级，请指定明确版本。'
        - name: mcp_connections
          type: array
          required: false
          description: MCP 引用：{connection_id, server_label, allowed_tools, required}。最多 32 个；server_label 在 Agent 内必须唯一。
        - name: tools
          type: array
          required: false
          description: 最多 64 个 function 工具，以及最多一个 web_search 工具。目前 Session 要求 web_search 的 mode 为 disabled，且暂不支持客户端返回 function 结果。
        - name: text
          type: object
          required: false
          description: format.type 为 text 或 json_schema（使用对象 schema）；verbosity 为 low、medium 或 high。
        - name: reasoning
          type: object
          required: false
          description: effort 为 none、minimal、low、medium、high、xhigh 或 max；summary 为 concise、detailed 或 auto。
        - name: service_tier
          type: string
          required: false
          description: auto（默认）、default、flex、priority 或 fast。
        - name: metadata
          type: object
          required: false
          description: 最多 16 个字符串键值对；键最多 64 个字符，值最多 512 个字符。
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
