---
i18nSource: fb62188053fb216d
title: API Passthrough
description: Gọi các khả năng API đang bật trong danh mục qua đường dẫn có kèm vendor.
aside: false
outline: false
apiReference:
  title: API Passthrough
  operation: Models
  method: POST
  path: /v1/api/{vendor}/{upstream_path}
  description: Phân giải một khả năng đang bật trong danh mục có tên vendor/upstream_path và thực thi một object JSON qua pipeline hợp nhất của SandBase. GET cũng được hỗ trợ cho các khả năng dùng phương thức này.
  groups:
    - title: Tham số đường dẫn
      fields:
        - name: vendor
          type: string
          required: true
          description: Đoạn đầu tiên của tên khả năng.
        - name: upstream_path
          type: string
          required: true
          description: Phần đường dẫn còn lại
          including literal slash-separated segments when present.: null
    - title: Body của request
      fields:
        - name: model
          type: string
          required: false
          description: Bỏ qua để dùng định danh vendor/path suy ra từ URL. Nếu được cung cấp
          it is preserved and controls execution.: null
        - name: capability fields
          type: object
          required: false
          description: Các trường được định nghĩa bởi schema trực tiếp của khả năng được chọn.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"url":"https://example.com"}'
---

<ApiReferencePage />

URL được phân giải thành một model đang bật có tên `vendor/upstream_path`. Hãy dùng đúng tên có kèm vendor do [Models API](./) trả về. Tên khả năng lồng nhau vẫn là các đoạn đường dẫn nguyên văn, không phải dấu gạch chéo được percent-encode.

POST chỉ chấp nhận một object JSON. Body POST rỗng được cho phép và hoạt động như một object chứa model suy ra từ URL. GET dùng body rỗng. Các trường phản hồi và hành vi đồng bộ hay bất đồng bộ phụ thuộc vào khả năng được chọn; hãy poll kết quả bất đồng bộ qua `GET /v1/run/{id}`.
