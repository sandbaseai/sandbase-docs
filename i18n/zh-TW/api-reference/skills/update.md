---
i18nSource: 996f166544016111
title: 更新 Skill
description: 變更 Skill 的預設版本、狀態或中繼資料。
aside: false
outline: false
apiReference:
  title: 更新 Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: 變更 default_version、status 或 market 中繼資料。傳送 metadata 時必須提供 row_version；否則使用目前的值。
  groups:
    - title: 路徑參數
      fields:
        - name: skill_id
          type: string
          required: true
          description: Skill ID（skl_ 前綴）。
    - title: 請求本文
      description: JSON 物件。
      fields:
        - name: default_version
          type: string
          required: false
          description: 首次附加此 Skill 且未指定版本時使用的預設版本。既有的 Agent 綁定會維持其固定的版本。
        - name: status
          type: string
          required: false
          description: active 或 disabled。
        - name: metadata
          type: object | null
          required: false
          description: 僅限 market 命名空間下的展示用中繼資料（最多 16 KiB）。需要 row_version；會取代整個 metadata 物件。未知的命名空間或欄位會回傳 400。請參閱下方的中繼資料範例。
        - name: row_version
          type: integer
          required: false
          description: 取得 Skill 回傳的目前 row_version。值過期時會回傳 409 conflict；有 metadata 時為必填。
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

## 中繼資料範例 {#metadata-example}

將目前的 `row_version` 與完整的中繼資料物件一併傳送：

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

Market 中繼資料用於描述 Skill 的顯示資訊。它不會安裝伺服器、授予憑證，也不會變更 Agent 的 MCP 選擇。`metadata: {}` 或 `metadata: null` 會清除中繼資料；兩者仍需要 `row_version`。
