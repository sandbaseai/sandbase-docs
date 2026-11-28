---
i18nSource: cb4bad8f3f97ecc6
title: Agent の削除
description: Agent を削除（アーカイブ）します。
aside: false
outline: false
apiReference:
  title: Agent の削除
  operation: Agents
  method: DELETE
  path: /v1/agents/{agent_id}
  description: Agent をアーカイブします。Agent が完全に削除されることはありません。既存の Session は固定された設定で実行を続け、Agent は後でアーカイブを解除できます。
  groups:
    - title: パスパラメーター
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID（agt_ プレフィックス）。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X DELETE https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        result = client.beta.agents.delete("agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60")
        print(result.deleted)
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
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
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
        "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "object": "agent.deleted",
        "deleted": true
      }
---

<ApiReferencePage />
