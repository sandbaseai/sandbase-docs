---
i18nSource: 36f9771126ee9243
title: 获取 Agent 版本
description: 读取一个不可变的 Agent 版本。
aside: false
outline: false
apiReference:
  title: 获取 Agent 版本
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}/versions/{version}
  description: 读取一个版本快照。version 必须为正整数，否则返回 400。此处 created_at 为 ISO 8601 字符串，而 Agent 对象使用 Unix 秒级时间戳。仅当创建该版本的修改附带了 note 时，才会返回 note。
  groups:
    - title: 路径参数
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID（agt_ 前缀）。
        - name: version
          type: integer
          required: true
          description: 版本号，从 1 开始。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions/1 \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions/1",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/versions/1', {
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
        "version": 1,
        "agent": {
          "name": "Research assistant",
          "model": "deepseek/deepseek-v4-flash",
          "instructions": "Answer with cited sources."
        },
        "checksum": "d04d38eb890a1273fa7965a6a7cdc2426232326e43b901d1aad3ed669455acbf",
        "created_at": "2026-10-05T08:00:00.000Z"
      }
---

<ApiReferencePage />
