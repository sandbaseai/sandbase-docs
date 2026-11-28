---
i18nSource: 06a65ded83bf9438
title: 列出工作区文件
description: 列出当前 Session 工作区文件的路径和大小，支持分页。此只读端点返回文件元数据。
aside: false
outline: false
apiReference:
  title: 列出工作区文件
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: 列出某个 Session 工作区目录中当前文件的路径和大小。这只是元数据列表，不是附件历史，也不包含产物内容。未知或重复的查询参数返回 400。
  groups:
    - title: 路径参数
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前缀）。
    - title: 查询参数
      fields:
        - name: path
          type: string
          required: false
          description: 绝对目录 /workspace 或其下的规范化目录。最长 4096 字节；不允许路径穿越、反斜杠或末尾斜杠。
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: 每页数量，范围为 1 到 100。
          default: "20"
        - name: order
          type: string
          required: false
          description: 路径排序顺序：asc 或 desc。
          default: asc
        - name: page
          type: string
          required: false
          description: 上一个响应返回的不透明 next 值。第一页时省略；不要发送空字符串。保持 path、order 和 limit 不变。
    - title: 响应字段
      fields:
        - name: object
          type: string
          required: true
          description: 始终为 page。
        - name: data
          type: array
          required: true
          description: 当前目录中的文件，每项包含 path 和 size_bytes。不会递归列出。
        - name: next
          type: string | null
          required: true
          description: 将此值作为 page 传入以继续获取；到末尾时为 null。
        - name: has_more
          type: boolean
          required: true
          description: 是否还有下一页。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "page",
        "data": [
          {
            "path": "/workspace/notes.md",
            "size_bytes": 1024
          }
        ],
        "next": null,
        "has_more": false
      }
---

<ApiReferencePage />

读取工作区时可能返回 `workspace_provisioning`、`workspace_environment_missing`、`workspace_cursor_invalid` 或 `workspace_unavailable`。如果游标无效，请从第一页重新开始。如需查找可下载的生成产物，请使用 [Artifacts](./list-artifacts)。
