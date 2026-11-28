---
i18nSource: 996f166544016111
title: Cập nhật Skill
description: Thay đổi phiên bản mặc định, trạng thái hoặc metadata của Skill.
aside: false
outline: false
apiReference:
  title: Cập nhật Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}
  description: Thay đổi default_version, status hoặc market metadata. row_version là bắt buộc khi gửi metadata; nếu không, giá trị hiện tại sẽ được dùng.
  groups:
    - title: Tham số đường dẫn
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID của Skill (tiền tố skl_).
    - title: Body của request
      description: Đối tượng JSON.
      fields:
        - name: default_version
          type: string
          required: false
          description: Phiên bản mặc định được dùng khi gắn Skill này lần đầu mà không chỉ định phiên bản. Các liên kết Agent hiện có vẫn giữ phiên bản đã ghim.
        - name: status
          type: string
          required: false
          description: active hoặc disabled.
        - name: metadata
          type: object | null
          required: false
          description: Metadata hiển thị chỉ trong namespace market (tối đa 16 KiB). Yêu cầu row_version; thay thế toàn bộ đối tượng metadata. Namespace hoặc trường không xác định sẽ trả về 400. Xem ví dụ về metadata bên dưới.
        - name: row_version
          type: integer
          required: false
          description: row_version hiện tại từ Get Skill. Giá trị đã cũ sẽ trả về 409 conflict; bắt buộc khi có metadata.
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

## Ví dụ về metadata {#metadata-example}

Gửi `row_version` hiện tại cùng với toàn bộ đối tượng metadata:

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

Market metadata mô tả Skill để hiển thị. Nó không cài đặt máy chủ, không cấp thông tin xác thực và không thay đổi lựa chọn MCP của Agent. `metadata: {}` hoặc `metadata: null` sẽ xóa metadata; cả hai vẫn yêu cầu `row_version`.
