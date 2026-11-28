---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: Gọi SandBase bằng giao thức Google Gemini GenerateContent gốc.
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: Gửi request Gemini gốc và nhận response tương thích Gemini. Dùng streamGenerateContent để streaming.
  groups:
    - title: Tham số đường dẫn
      fields:
        - name: model
          type: string
          required: true
          description: Tên model Google đơn thuần, chẳng hạn gemini-3.5-flash. SandBase phân giải nó thành google/{model}.
    - title: Body của request
      fields:
        - name: contents
          type: array
          required: false
          description: Nội dung hội thoại Gemini gồm role và parts.
        - name: systemInstruction
          type: object
          required: false
          description: Chỉ dẫn hệ thống dạng văn bản theo định dạng Gemini Content.
        - name: generationConfig
          type: object
          required: false
          description: Thiết lập lấy mẫu, độ dài output, structured output và thinking.
        - name: tools
          type: array
          required: false
          description: Khai báo hàm hoặc cấu hình công cụ tích hợp sẵn của Gemini được hỗ trợ.
        - name: toolConfig
          type: object
          required: false
          description: Chính sách function calling của Gemini.
        - name: safetySettings
          type: array
          required: false
          description: Danh mục và ngưỡng an toàn của Gemini.
        - name: cachedContent
          type: string
          required: false
          description: Tài nguyên cached-content của Gemini, được chuyển tiếp khi được hỗ trợ.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST \
          "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:generateContent" \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"contents":[{"role":"user","parts":[{"text":"Explain immutable infrastructure in one sentence."}]}]}'
  response:
    status: 200 OK
    code: |-
      {
        "candidates": [
          {
            "content": {
              "role": "model",
              "parts": [{"text": "Immutable infrastructure replaces servers from versioned images instead of modifying them in place."}]
            },
            "finishReason": "STOP",
            "index": 0
          }
        ],
        "usageMetadata": {
          "promptTokenCount": 8,
          "candidatesTokenCount": 15,
          "totalTokenCount": 23
        }
      }
---

<ApiReferencePage />

## Xác thực {#authentication}

Request tương thích Google có thể mang SandBase API key trong `x-goog-api-key`, `Authorization: Bearer …` hoặc tham số query `key`, theo thứ tự ưu tiên đó. Nên dùng header: thông tin xác thực trong query string có thể xuất hiện trong log của proxy và lịch sử trình duyệt.

## Streaming {#streaming}

Thay hậu tố phương thức bằng `:streamGenerateContent`. Khi không có tham số query, SandBase trả về các đối tượng response tương thích Google dưới dạng một mảng JSON được stream. Thêm `?alt=sse` để dùng Server-Sent Events:

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## Tạo ảnh gốc {#native-image-generation}

Các model ảnh sau có ánh xạ GenerateContent gốc riêng:

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs): `gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs): `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs): `gemini-nano-banana-2.1`

Trang của từng model liệt kê giá token và chi phí cho mỗi ảnh.

Với các ánh xạ này, SandBase chuyển tiếp payload của request và response mà không chuyển đổi qua Chat
Completions. Nhờ đó các phần ảnh, response modality và các trường do nhà cung cấp định nghĩa được giữ nguyên. Dùng tên model đơn thuần trong
URL; ví dụ, `google/gemini-3.1-flash-image` trở thành `gemini-3.1-flash-image` trong đường dẫn.
### Chỉnh sửa ảnh {#edit-an-image}

Thêm ảnh nguồn dưới dạng một phần `inlineData` bên cạnh chỉ dẫn văn bản. Dùng MIME type đúng với dữ liệu byte bạn gửi:

```json
{
  "contents": [{
    "role": "user",
    "parts": [
      {"text": "Keep the subject unchanged and turn the background into a paper-cut landscape."},
      {"inlineData": {"mimeType": "image/png", "data": "<base64-input-image>"}}
    ]
  }],
  "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"imageSize": "1K"}}
}
```

### Dùng Google Gen AI SDK {#use-the-google-gen-ai-sdk}

Trỏ SDK chính thức tới SandBase và dùng SandBase API key của bạn:

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="YOUR_SANDBASE_API_KEY",
    http_options=types.HttpOptions(base_url="https://api.sandbase.ai"),
)

response = client.models.generate_content(
    model="gemini-nano-banana-2.1",
    contents="Create a wide editorial illustration of a solar-powered city at sunrise.",
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(aspect_ratio="16:9", image_size="1K"),
    ),
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        with open("output.jpg", "wb") as f:
            f.write(part.inline_data.data)
```

Để streaming, gọi `:streamGenerateContent?alt=sse` (SDK: `generate_content_stream`) với cùng body.

### Xử lý response {#response-handling}
Đọc media được tạo từ các phần của candidate trả về. Vì các model này dùng passthrough gốc, cách viết hoa của trường
và metadata MIME do nhà cung cấp định nghĩa được trả về nguyên trạng. Hãy giải mã payload base64 và kiểm tra dữ liệu byte thực tế của media
trước khi chọn phần mở rộng file.

## Định tuyến và giới hạn chuyển đổi {#routing-and-translation-boundaries}

SandBase chỉ chọn các nhà cung cấp hỗ trợ giao thức Gemini gốc được yêu cầu. Nếu model được chọn không có
ánh xạ gốc tương thích, request sẽ thất bại thay vì chuyển sang nhà cung cấp dùng giao thức khác.

Các model dùng đường GenerateContent có chuyển đổi hỗ trợ văn bản, function call và response, dữ liệu `image/*` inline
và tham chiếu ảnh HTTP(S) công khai. Đường chuyển đổi đó từ chối MIME type inline không được hỗ trợ, Google Files riêng tư hoặc
tham chiếu `gs://`, nhiều candidate và response modality không được hỗ trợ bằng response `400 INVALID_ARGUMENT`
theo kiểu Google. Các ánh xạ tạo ảnh liệt kê ở trên dùng passthrough thô và không chịu các giới hạn chỉ áp dụng cho chuyển đổi;
hãy kiểm tra các trường media trả về theo response của nhà cung cấp được chọn.
