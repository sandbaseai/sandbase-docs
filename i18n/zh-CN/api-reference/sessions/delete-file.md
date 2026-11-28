---
i18nSource: 68a27799c99852dc
title: 删除 Session 文件
description: 删除 Session 附件。
aside: false
outline: false
apiReference:
  title: 删除 Session 文件
  operation: Sessions
  method: DELETE
  path: /v1/agents/sessions/{session_id}/files/{file_id}
  description: 删除附件。上传尚未完成或 Session 已归档时返回 409。
  groups:
    - title: 路径参数
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前缀）。
        - name: file_id
          type: string
          required: true
          description: 附件 ID（fil_ 前缀）。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X DELETE https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files/fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72 \
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
            "DELETE",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files/fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/files/fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72', {
          method: 'DELETE',
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
        "deleted": true,
        "id": "fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"
      }
---

<ApiReferencePage />
