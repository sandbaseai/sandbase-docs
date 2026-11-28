---
i18nSource: faccf5122e785ea0
title: 下载 Session 产物
description: 按 ID 下载捕获的 Session 产物。了解完整文件下载的大小限制、支持的响应类型以及 Range 行为。
aside: false
outline: false
apiReference:
  title: 下载 Session 产物
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: 使用列出 Session 产物返回的 ID 下载完整的不可变产物。支持最大 200 MiB 的文件。不接受任何查询参数；Range 请求在访问校验后返回 416。
  groups:
    - title: 路径参数
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前缀）。
        - name: artifact_id
          type: string
          required: true
          description: 该 Session 产物列表返回的不透明 art_ ID，需原样传入。不接受附件 ID 和工作区路径。
    - title: 响应头
      fields:
        - name: Content-Type
          type: string
          required: true
          description: 根据文件扩展名推断的媒体类型，或 application/octet-stream。
        - name: Content-Disposition
          type: string
          required: true
          description: attachment，并附带产物文件名。
        - name: Content-Length
          type: integer
          required: true
          description: 完整文件大小（字节）。
        - name: Cache-Control
          type: string
          required: true
          description: no-store。
  examples:
    - label: cURL
      language: bash
      code: |-
        # Set SESSION_ID and ARTIFACT_ID from your Session and artifact list.
        curl --fail-with-body "https://api.sandbase.ai/v1/agents/sessions/${SESSION_ID}/artifacts/${ARTIFACT_ID}/content" \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          --output report.md
    - label: Python
      language: python
      code: |-
        import os
        from pathlib import Path
        import requests

        # Use IDs returned by your own Session and artifact list.
        session_id = os.environ["SESSION_ID"]
        artifact_id = os.environ["ARTIFACT_ID"]
        response = requests.get(
            f"https://api.sandbase.ai/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        Path("report.md").write_bytes(response.content)
    - label: TypeScript
      language: typescript
      code: |-
        import { writeFile } from 'node:fs/promises';

        const { SESSION_ID, ARTIFACT_ID, SANDBASE_API_KEY } = process.env;
        if (!SESSION_ID || !ARTIFACT_ID || !SANDBASE_API_KEY) throw new Error('Missing configuration');
        const response = await fetch(
          `https://api.sandbase.ai/v1/agents/sessions/${encodeURIComponent(SESSION_ID)}/artifacts/${encodeURIComponent(ARTIFACT_ID)}/content`,
          { headers: { Authorization: `Bearer ${SANDBASE_API_KEY}` } },
        );
        if (!response.ok) throw new Error(await response.text());
        await writeFile('report.md', new Uint8Array(await response.arrayBuffer()));
---

<ApiReferencePage />

成功的响应是文件字节流，而非 JSON。请下载完整文件；不支持部分传输和基于 Range 的断点续传。产物不可用时返回 `404`；产物服务不可用时返回 `executor_unavailable`。
