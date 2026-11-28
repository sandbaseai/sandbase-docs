---
i18nSource: 270917aea416aa76
title: 列出 Session 产物
description: 使用游标分页列出捕获的 Session 输出产物，包括不透明 ID、文件大小和下载链接。
aside: false
outline: false
apiReference:
  title: 列出 Session 产物
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: 列出该 Session 生成的不可变输出。产物 ID 是不透明的、仅在该 Session 内有效的句柄；请将返回的 ID 原样传给下载端点。未知或重复的查询参数返回 400。
  groups:
    - title: 路径参数
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前缀）。
    - title: 查询参数
      fields:
        - name: limit
          type: integer
          required: false
          description: 每页数量，范围 1 到 100；无效值返回 400。
          default: "20"
        - name: order
          type: string
          required: false
          description: asc 或 desc。
          default: desc
        - name: after
          type: string
          required: false
          description: 上一页以 last_id 返回的产物 ID。继续翻页时请保持相同的排序方式。
    - title: 产物对象
      fields:
        - name: object
          type: string
          required: true
          description: 始终为 agent.session.artifact。
        - name: id
          type: string
          required: true
          description: 不透明的 art_ 句柄。请勿自行构造或解码。
        - name: session_id
          type: string
          required: true
          description: 所属 Session 的 ID。
        - name: path
          type: string
          required: true
          description: 位于 /workspace/outputs/ 下的生成输出路径。
        - name: size_bytes
          type: integer
          required: true
          description: 产物大小（字节）。
        - name: created_at
          type: integer
          required: true
          description: 创建时间戳（Unix 秒）。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "agent.session.artifact",
            "id": "art_example_handle",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "path": "/workspace/outputs/report.md",
            "size_bytes": 1024,
            "created_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "art_example_handle",
        "last_id": "art_example_handle"
      }
---

<ApiReferencePage />

示例中的句柄仅作说明。调用[下载产物](./download-artifact)时，请使用你自己的请求返回的 `id`。当 `has_more` 为 true 时，发送 `after=last_id` 获取下一页。列表为空时，`first_id` 和 `last_id` 为 null。不提供单独获取产物元数据的 GET 端点。
