---
i18nSource: 996f166544016111
title: 更新 Skill
description: 更改 Skill 的默认版本、状态或元数据。
aside: false
outline: false
apiReference:
  title: 更新 Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: 更改 default_version、status 或 market 元数据。发送 metadata 时必须提供 row_version；否则使用当前值。
  groups:
    - title: 路径参数
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID（skl_ 前缀）。
    - title: 请求体
      description: JSON 对象。
      fields:
        - name: default_version
          type: string
          required: false
          description: 首次关联此 Skill 且未显式指定版本时使用的默认版本。已有的 Agent 绑定保持其固定版本不变。
        - name: status
          type: string
          required: false
          description: active 或 disabled。
        - name: metadata
          type: object | null
          required: false
          description: 仅限 market 命名空间下的展示元数据（最大 16 KiB）。需要提供 row_version；会替换整个元数据对象。未知的命名空间或字段返回 400。参见下方的元数据示例。
        - name: row_version
          type: integer
          required: false
          description: 通过获取 Skill 得到的当前 row_version。值过期时返回 409 conflict；存在 metadata 时为必填项。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "default_version": "2"
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        skill = client.skills.update("skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", default_version="2")
        print(skill.default_version)
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
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
            headers=headers,
            json={
                "default_version": "2"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "default_version": "2"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "object": "skill",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "default_version": "2",
        "latest_version": "2",
        "status": "active",
        "visibility": "private",
        "row_version": 3,
        "metadata": {},
        "created_at": 1791273600,
        "updated_at": 1791273600
      }
---

<ApiReferencePage />

## 元数据示例 {#metadata-example}

将当前的 `row_version` 与完整的元数据对象一起发送：

```json
{
  "row_version": 3,
  "metadata": {
    "market": {
      "display_name": "Release notes",
      "categories": ["development"],
      "tags": ["releases"],
      "required_endpoints": ["github.issues"],
      "servers": ["github"]
    }
  }
}
```

Market 元数据用于展示 Skill 的描述信息。它不会安装服务器、授予凭据，也不会更改 Agent 的 MCP 选择。`metadata: {}` 或 `metadata: null` 会清空元数据；两者都仍需提供 `row_version`。
