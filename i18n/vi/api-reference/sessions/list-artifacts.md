---
i18nSource: 270917aea416aa76
title: Liệt kê Session Artifact
description: Liệt kê các artifact đầu ra đã được ghi lại của Session với phân trang theo cursor, ID không cần diễn giải, kích thước file và liên kết tải xuống.
aside: false
outline: false
apiReference:
  title: Liệt kê Session Artifact
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: Liệt kê các đầu ra bất biến được tạo cho Session này. ID artifact là handle không cần diễn giải, có phạm vi trong Session; hãy truyền nguyên ID được trả về đến endpoint tải xuống. Tham số query không xác định hoặc bị lặp lại sẽ trả về 400.
  groups:
    - title: Tham số đường dẫn
      fields:
        - name: session_id
          type: string
          required: true
          description: ID của Session (tiền tố ses_).
    - title: Tham số query
      fields:
        - name: limit
          type: integer
          required: false
          description: Kích thước trang từ 1 đến 100; giá trị không hợp lệ trả về 400.
          default: "20"
        - name: order
          type: string
          required: false
          description: asc hoặc desc.
          default: desc
        - name: after
          type: string
          required: false
          description: ID artifact được trả về dưới dạng last_id ở trang trước. Giữ nguyên order khi lấy tiếp.
    - title: Đối tượng Artifact
      fields:
        - name: object
          type: string
          required: true
          description: Luôn là agent.session.artifact.
        - name: id
          type: string
          required: true
          description: Handle art_ không cần diễn giải. Không tự dựng hoặc giải mã handle này.
        - name: session_id
          type: string
          required: true
          description: ID của Session sở hữu.
        - name: path
          type: string
          required: true
          description: Đường dẫn đầu ra được tạo bên dưới /workspace/outputs/.
        - name: size_bytes
          type: integer
          required: true
          description: Kích thước artifact tính bằng byte.
        - name: created_at
          type: integer
          required: true
          description: Thời điểm tạo tính bằng giây Unix.
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

Handle trong ví dụ chỉ mang tính minh họa. Hãy dùng `id` được trả về từ request của chính bạn cho [Tải Artifact](./download-artifact). Khi `has_more` là true, gửi `after=last_id` để lấy trang tiếp theo. `first_id` và `last_id` là null khi danh sách rỗng. Không có endpoint GET riêng để lấy metadata của artifact.
