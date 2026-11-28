---
i18nSource: 39ce638efc41350d
title: Tạo ảnh
description: Tạo ảnh bằng API đồng bộ tương thích OpenAI Images.
aside: false
outline: false
apiReference:
  title: Tạo ảnh
  operation: Images
  method: POST
  path: /v1/images/generations
  description: Tạo ảnh qua endpoint đồng bộ tương thích OpenAI Images của SandBase. Endpoint này khác với API model chung /v1/run.
  signature: client.images.generate(params)
  groups:
    - title: Body request
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: Một trong gpt-image-2, gpt-image-2.5-flare hoặc gpt-image-2.5-sunburst.
        - name: prompt
          type: string
          required: true
          description: Mô tả bằng văn bản cho ảnh cần tạo.
        - name: n
          type: integer
          required: false
          description: Số lượng ảnh cần tạo khi được hỗ trợ.
        - name: size
          type: string
          required: false
          description: Kích thước đầu ra mà model hỗ trợ.
        - name: quality
          type: string
          required: false
          description: Chất lượng đầu ra như low, medium, high hoặc auto.
        - name: background
          type: string
          required: false
          description: Thiết lập nền như transparent, opaque hoặc auto.
        - name: output_format
          type: string
          required: false
          description: Định dạng mã hóa đầu ra như png, webp hoặc jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Mức nén đầu ra từ 0 đến 100.
        - name: moderation
          type: string
          required: false
          description: Thiết lập kiểm duyệt tương thích với nhà cung cấp.
        - name: user
          type: string
          required: false
          description: Định danh người dùng cuối tương thích với nhà cung cấp.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/generations \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"gpt-image-2","prompt":"A paper-cut city floating above the clouds","size":"1024x1024"}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        result = client.images.generate(
            model="gpt-image-2",
            prompt="A paper-cut city floating above the clouds",
            size="1024x1024",
        )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 12,
          "output_tokens": 4096,
          "total_tokens": 4108,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 0}
        }
      }
  notes:
    - title: Chỉ đồng bộ
      description: stream=true, mode=stream và mode=async bị từ chối. Hãy dùng trực tiếp mảng data được trả về.
    - title: Trường tương thích
      description: Các trường JSON bổ sung được chuyển tiếp nguyên vẹn, nhưng mức hỗ trợ vẫn tùy thuộc vào model và nhà cung cấp.
  errors:
    - status: "400"
      description: JSON không hợp lệ, model không được hỗ trợ, chế độ streaming hoặc request tới nhà cung cấp không hợp lệ.
    - status: "401"
      description: Thiếu API key hoặc API key không hợp lệ.
    - status: "402"
      description: Đã đạt giới hạn chi tiêu của tổ chức hoặc API Key.
    - status: "403"
      description: Phạm vi của API key không cho phép dùng endpoint này.
    - status: "404"
      description: Model hình ảnh được định tuyến không khả dụng.
    - status: "429"
      description: Vượt quá giới hạn tốc độ.
    - status: "500"
      description: Lưu request hoặc xử lý response thất bại.
    - status: "502"
      description: Nhà cung cấp trả về response gốc không hợp lệ.
    - status: "503"
      description: Không có tuyến nhà cung cấp nào thành công.
---

<ApiReferencePage />

## Model được hỗ trợ {#supported-models}
Các model hình ảnh OpenAI sau dùng Images API gốc trên endpoint này. Gửi tên model công khai trong `model`:

| `model` | Phù hợp nhất cho |
| --- | --- |
| `gpt-image-2.5-flare` | Tạo và chỉnh sửa ảnh nhanh, chất lượng cao cho công việc sáng tạo hằng ngày |
| `gpt-image-2.5-sunburst` | Công việc đòi hỏi độ trung thực hình ảnh và độ chính xác cao nhất |
| `gpt-image-2` | Thế hệ GPT Image trước đó |

Request là đồng bộ và trả về dữ liệu ảnh trong `data` dưới dạng `b64_json` hoặc URL. Endpoint này tách biệt với endpoint model bất đồng bộ chung `/v1/run`; trang của từng model trong [danh mục model](https://www.sandbase.ai/models/image-video) mô tả hợp đồng đó và giá của model.

Để chỉnh sửa ảnh, hãy gửi `multipart/form-data` tới [`POST /v1/images/edits`](/api-reference/images/edits) với cùng các tên model.
