---
i18nSource: 36f9771126ee9243
title: Agent バージョンの取得
description: 変更不可の Agent バージョンを 1 つ読み取ります。
aside: false
outline: false
apiReference:
  title: Agent バージョンの取得
  operation: Agents
  method: GET
  path: /v1/agents/{agent_id}/versions/{version}
  description: バージョンのスナップショットを 1 つ読み取ります。version は正の整数である必要があり、そうでない場合は 400 を返します。ここでの created_at は ISO 8601 文字列ですが、Agent オブジェクトでは Unix 秒を使います。note は、そのバージョンを作成した変更で note が送信された場合にのみ含まれます。
  groups:
    - title: パスパラメーター
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID（agt_ プレフィックス）。
        - name: version
          type: integer
          required: true
          description: バージョン番号。1 から始まります。
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
