---
i18nSource: f3150233afd08b90
title: 创建 Agent
description: 通过 POST /v1/agents 创建一个已保存、带版本的 Agent。
aside: false
outline: false
apiReference:
  title: 创建 Agent
  operation: Agents
  method: POST
  path: /v1/agents
  description: 创建一个版本为 1 的已保存 Agent。请求体为严格 JSON：未知字段会返回 400。multi_agent 必须省略或为 null。
  groups:
    - title: 请求头
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 可选。省略时由服务生成，因此重试请求可能会创建重复项。重试时请发送你自己的固定键。
    - title: 请求体
      description: JSON 对象。
      fields:
        - name: model
          type: string
          required: true
          description: 必填，来自 Models API 的模型 ID，最多 200 个字符。没有默认值；省略 model 会返回 400。示例使用 deepseek/deepseek-v4-flash。
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
          description: 'Skill 引用：{"skill_id": "skl_…", "version": null | "<version>"}。最多 32 个。对于新绑定，null 会在保存 Agent 时固定为当前默认版本。对于已有绑定，null 会保留其已固定的版本；如需升级，请显式指定版本。'
        - name: mcp_connections
          type: array
          required: false
          description: 'MCP 引用：{connection_id, server_label, allowed_tools, required}。最多 32 个；server_label 在 Agent 内必须唯一。省略时使用内置 SandBase 工具（{"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin"}）；发送的列表会替换该默认值，传入 [] 则创建不带工具的 Agent。参见内置 SandBase 工具（/agents/mcp-tools#built-in-sandbase-tools）。'
        - name: tools
          type: array
          required: false
          description: 最多 64 个 function 工具，外加至多一个 web_search 工具。Sessions 目前要求禁用 web_search 模式，且暂不支持客户端返回 function 结果。
        - name: text
          type: object
          required: false
          description: format.type 为 text 或 json_schema（需提供 object schema）；verbosity 为 low、medium 或 high。
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
        - name: description
          type: string
          required: false
          description: 较长的描述，最多 4096 个字符。
        - name: note
          type: string
          required: false
          description: 记录在版本 1 上的变更说明。
    - title: Agent 对象
      description: 由 create、get、update、archive、unarchive、restore 和 clone 返回。
      fields:
        - name: id
          type: string
          required: true
          description: 带 agt_ 前缀的 Agent ID。
        - name: object
          type: string
          required: true
          description: 始终为 agent。
        - name: version
          type: integer
          required: true
          description: 当前版本。每次有效写入都会创建一个新版本。
        - name: row_version
          type: integer
          required: true
          description: 用于 PATCH、archive、unarchive 和 restore 的比较并设置（compare-and-set）令牌。
        - name: status
          type: string
          required: true
          description: active 或 archived。
        - name: projection_status
          type: string
          required: true
          description: 当前版本的执行就绪状态。Sessions 需要 ready；新建的 Agent 可能会短暂显示 pending。
        - name: runtime_profile
          type: string
          required: true
          description: codex、claude 或 mcode。
        - name: visibility
          type: string
          required: true
          description: 你的 Agents 为 private；目录条目为 public。
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Unix 秒级时间戳。处于 active 状态时 archived_at 为 null。
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
