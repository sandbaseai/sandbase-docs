---
i18nSource: a4db28360a2974cd
title: Chỉnh sửa ảnh
description: Chỉnh sửa ảnh đã tải lên bằng API đồng bộ tương thích OpenAI Images.
aside: false
outline: false
apiReference:
  title: Chỉnh sửa ảnh
  operation: Images
  method: POST
  path: /v1/images/edits
  description: Chỉnh sửa một hoặc nhiều ảnh đã tải lên qua endpoint multipart đồng bộ tương thích OpenAI Images của SandBase.
  signature: client.images.edit(params)
  groups:
    - title: Body của request
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: Một trong gpt-image-2, gpt-image-2.5-flare hoặc gpt-image-2.5-sunburst.
        - name: prompt
          type: string
          required: true
          description: Mô tả bằng văn bản cho chỉnh sửa mong muốn.
        - name: image
          type: file | file[]
          required: true
          description: Một hoặc nhiều tệp ảnh nguồn. Lặp lại trường multipart cho nhiều ảnh.
        - name: mask
          type: file
          required: false
          description: Ảnh mask tùy chọn cho inpainting.
        - name: n
          type: integer
          required: false
          description: Số ảnh đã chỉnh sửa cần trả về khi được hỗ trợ.
        - name: size
          type: string
          required: false
          description: Kích thước đầu ra mà model hỗ trợ.
        - name: quality
          type: string
          required: false
          description: Chất lượng đầu ra mà model hỗ trợ.
        - name: background
          type: string
          required: false
          description: Thiết lập nền của đầu ra.
        - name: input_fidelity
          type: string
          required: false
          description: Mức độ mà các model được hỗ trợ giữ lại chi tiết của ảnh nguồn.
        - name: output_format
          type: string
          required: false
          description: Định dạng mã hóa đầu ra như png, webp hoặc jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Mức nén đầu ra từ 0 đến 100.
        - name: user
          type: string
          required: false
          description: Định danh người dùng cuối tương thích với nhà cung cấp.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/edits \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -F model=gpt-image-2 \
          -F 'prompt=Turn the daytime sky into a starry night' \
          -F image=@landscape.png
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        with open("landscape.png", "rb") as image:
            result = client.images.edit(
                model="gpt-image-2",
                image=image,
                prompt="Turn the daytime sky into a starry night",
            )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 1024,
          "output_tokens": 4096,
          "total_tokens": 5120,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 1012}
        }
      }
  notes:
    - title: Tải lên multipart
      description: Gửi model, prompt và image dưới dạng multipart/form-data. Lặp lại trường image sẽ giữ được nhiều tệp nguồn.
    - title: Chỉ đồng bộ
      description: stream=true, mode=stream và mode=async bị từ chối.
  errors:
    - status: "400"
      description: Body multipart không hợp lệ, model không được hỗ trợ, chế độ streaming hoặc yêu cầu tới nhà cung cấp không hợp lệ.
    - status: "401"
      description: API key bị thiếu hoặc không hợp lệ.
    - status: "402"
      description: Đã đạt giới hạn chi tiêu của tổ chức hoặc API Key.
    - status: "403"
      description: Phạm vi API key không cho phép dùng endpoint này.
    - status: "404"
      description: Model chỉnh sửa ảnh được định tuyến hiện không khả dụng.
    - status: "429"
      description: Vượt quá giới hạn tốc độ.
    - status: "500"
      description: Lưu yêu cầu hoặc xử lý phản hồi thất bại.
    - status: "502"
      description: Nhà cung cấp trả về phản hồi gốc không hợp lệ.
    - status: "503"
      description: Không có tuyến nhà cung cấp nào thành công.
---

<ApiReferencePage />

## Model được hỗ trợ {#supported-models}
Các model ảnh OpenAI này dùng Images API gốc trên endpoint này và trên [`/v1/images/generations`](/api-reference/images/generations). Gửi tên model công khai trong `model`:

| `model` | Phù hợp nhất cho |
| --- | --- |
| `gpt-image-2.5-flare` | Tạo và chỉnh sửa ảnh nhanh, chất lượng cao cho công việc sáng tạo hằng ngày |
| `gpt-image-2.5-sunburst` | Công việc đòi hỏi độ trung thực hình ảnh và độ chính xác cao nhất |
| `gpt-image-2` | Thế hệ GPT Image trước đó |

Các yêu cầu là đồng bộ và trả về dữ liệu ảnh trong `data` dưới dạng `b64_json` hoặc URL. Endpoint này tách biệt với endpoint model bất đồng bộ chung `/v1/run`; trang của từng model trong [danh mục model](https://www.sandbase.ai/models/image-video) mô tả hợp đồng đó và giá của nó.

Cung cấp `model`, `prompt` và ít nhất một tệp `image`. Lặp lại trường `image` để ghép hoặc chỉnh sửa nhiều ảnh nguồn:

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
