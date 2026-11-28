---
i18nSource: 06a65ded83bf9438
title: Liệt kê file trong workspace
description: Liệt kê các file hiện có trong workspace của Session kèm đường dẫn, kích thước và phân trang. Endpoint chỉ đọc này trả về metadata của file.
aside: false
outline: false
apiReference:
  title: Liệt kê file trong workspace
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: Liệt kê đường dẫn và kích thước hiện tại của các file trong một thư mục workspace của Session. Đây là danh sách chỉ gồm metadata, không phải lịch sử tệp đính kèm hay nội dung artifact. Tham số query không xác định hoặc bị lặp lại sẽ trả về 400.
  groups:
    - title: Tham số đường dẫn
      fields:
        - name: session_id
          type: string
          required: true
          description: ID của Session (tiền tố ses_).
    - title: Tham số query
      fields:
        - name: path
          type: string
          required: false
          description: Thư mục tuyệt đối /workspace hoặc một thư mục đã chuẩn hóa bên dưới nó. Tối đa 4096 byte; không được duyệt ngược thư mục, không dùng dấu gạch chéo ngược hoặc dấu gạch chéo ở cuối.
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: Kích thước trang từ 1 đến 100.
          default: "20"
        - name: order
          type: string
          required: false
          description: "Thứ tự sắp xếp đường dẫn: asc hoặc desc."
          default: asc
        - name: page
          type: string
          required: false
          description: Giá trị next không trong suốt từ response trước. Bỏ qua ở trang đầu tiên; không gửi chuỗi rỗng. Giữ nguyên path, order và limit.
    - title: Các trường của response
      fields:
        - name: object
          type: string
          required: true
          description: Luôn là page.
        - name: data
          type: array
          required: true
          description: Các file trong thư mục hiện tại, mỗi file có path và size_bytes. Đây không phải danh sách đệ quy.
        - name: next
          type: string | null
          required: true
          description: Truyền giá trị này làm page để tiếp tục; là null ở trang cuối.
        - name: has_more
          type: boolean
          required: true
          description: Có còn trang tiếp theo hay không.
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

Thao tác đọc workspace có thể trả về `workspace_provisioning`, `workspace_environment_missing`, `workspace_cursor_invalid` hoặc `workspace_unavailable`. Nếu cursor không hợp lệ, hãy bắt đầu lại từ trang đầu tiên. Dùng [Artifacts](./list-artifacts) để tìm các output đã tạo có thể tải xuống.
