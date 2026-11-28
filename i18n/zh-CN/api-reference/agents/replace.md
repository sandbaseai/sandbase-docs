---
i18nSource: 4e711691737c9671
title: 替换 Agent（CAS）
description: 基于 row_version 以比较并设置方式更新 Agent。
aside: false
outline: false
apiReference:
  title: 替换 Agent（CAS）
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: 以比较并设置（compare-and-set）方式进行产品级更新。row_version 为必填项，且必须等于当前值，否则返回 409。所提供的字段会替换已保存的值；显式传入 null 将返回 400。当多个编辑者可能修改同一个 Agent 时，请使用此方式。
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
          description: 可选。省略时由服务自动生成，因此重试的请求可能会产生重复记录。重试时请发送你自己的稳定键。
    - title: 请求体
      description: row_version 以及任意 Agent 字段子集。
      fields:
        - name: row_version
          type: integer
          required: true
          description: 你最近一次读取到的 row_version。值已过期时返回 409。
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
          description: 'Skill 引用：{"skill_id": "skl_…", "version": null | "<version>"}。最多 32 个。对于新绑定，null 会在保存 Agent 时固定为当前默认版本。对于已有绑定，null 会保留其已固定的版本；如需升级，请提供明确的版本。'
        - name: mcp_connections
          type: array
          required: false
          description: MCP 引用：{connection_id, server_label, allowed_tools, required}。最多 32 个；server_label 在同一 Agent 内必须唯一。
        - name: tools
          type: array
          required: false
          description: 最多 64 个函数工具，外加最多一个 web_search 工具。Session 目前要求禁用 web_search 模式，且暂不支持客户端函数结果。
        - name: text
          type: object
          required: false
          description: format.type 为 text 或 json_schema（需配合 object schema）；verbosity 为 low、medium 或 high。
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
          description: 最多 4096 个字符。
        - name: note
          type: string
          required: false
          description: 记录在新版本上的变更说明。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
          }'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "PATCH",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "row_version": 2,
                "description": "Research Agent used by the weekly brief.",
                "note": "Add description"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
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
        "version": 3,
        "row_version": 3,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "Research Agent used by the weekly brief.",
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
