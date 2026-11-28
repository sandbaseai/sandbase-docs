---
i18nSource: 096e3c57e599c5ca
title: 上传 Skill 版本
description: 上传新的 Skill 版本。
aside: false
outline: false
apiReference:
  title: 上传 Skill 版本
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: 上传新的 ZIP 包作为下一个版本（200 OK）。ZIP 结构与创建 Skill 相同（一个包含 SKILL.md 的顶层文件夹）。发送 default=true 可将其设为默认版本。使用 GET /v1/skills/{skill_id}/versions 列出版本，使用 GET /v1/skills/{skill_id}/versions/{version} 读取单个版本，使用 GET /v1/skills/{skill_id}/versions/{version}/content 下载单个版本。版本标识符为字符串。
  groups:
    - title: 路径参数
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID（skl_ 前缀）。
    - title: 请求头
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 可选，1-128 字节，首尾不能有空白。省略时由服务生成，因此重试请求可能会创建重复项。重试时请发送你自己的固定键。
    - title: 请求体
      description: multipart/form-data。
      fields:
        - name: files
          type: file
          required: true
          description: ZIP 压缩包，最大 5 MiB。
        - name: default
          type: string
          required: false
          description: true 表示将其设为后续关联的默认版本；false 或省略则保留当前默认版本。已有的 Agent 绑定不受影响。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: release-notes-v2" \
          -F "files=@release-notes-v2.zip;type=application/zip" \
          -F "default=true"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        with open("release-notes-v2.zip", "rb") as bundle:
            version = client.skills.versions.create(
                "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
                files=[("release-notes-v2.zip", bundle.read(), "application/zip")],
                default=True,
            )
        print(version.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "release-notes-v2",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions",
            headers=headers,
            files={"files": open("release-notes-v2.zip", "rb")},
            data={"default": "true"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        import { readFile } from 'node:fs/promises';

        const form = new FormData();
        form.append('files', new Blob([await readFile('release-notes-v2.zip')], { type: 'application/zip' }), 'release-notes-v2.zip');
        form.append('default', 'true');

        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'release-notes-v2',
          },
          body: form,
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "skill.version",
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57:2",
        "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "version": "2",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "created_at": 1791360000
      }
---

<ApiReferencePage />

## 列出和下载版本 {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions` 接受 `limit`（0-100，默认 20）、`order`（`asc` 或 `desc`，默认 `desc`）和 `after`。其响应包含 `object: "list"`、`data`、`has_more`、`first_id` 和 `last_id`。将 `last_id` 原样作为下一次请求的 `after` 传入；它是带 Skill 前缀的版本 ID，而不是单纯的版本号。

`GET /v1/skills/{skill_id}/versions/{version}` 返回单个版本对象。对应的 `/content` 端点返回 ZIP 字节；参见[下载示例](./#download-a-bundle)。
