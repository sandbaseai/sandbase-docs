---
i18nSource: 04f3657850b71e58
title: Tạo Anthropic Message
description: Tạo message tương thích Anthropic với một model của SandBase.
aside: false
outline: false
apiReference:
  title: Tạo Anthropic Message
  operation: Inference
  method: POST
  path: /v1/messages
  description: Tạo message qua endpoint Messages tương thích Anthropic của SandBase. SandBase ánh xạ model cho nhà cung cấp được chọn và giữ nguyên các trường request và response tương thích.
  signature: client.messages.create(params)
  groups:
    - title: Header của request
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "SandBase API key. Authorization: Bearer cũng được chấp nhận; x-api-key được ưu tiên khi có cả hai."
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: Phiên bản Anthropic API được chuyển tiếp lên upstream. SandBase dùng 2023-06-01 nếu bỏ qua.
        - name: anthropic-beta
          type: string
          required: false
          description: Các định danh tính năng beta, phân tách bằng dấu phẩy, tùy thuộc vào khả năng tương thích của nhà cung cấp.
    - title: Body của request
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Định danh model tương thích Anthropic.
        - name: messages
          type: object[]
          required: true
          description: Các message của user và assistant chứa văn bản hoặc content block có kiểu.
        - name: max_tokens
          type: integer
          required: true
          description: Số token output tối đa.
        - name: system
          type: string | object[]
          required: false
          description: Chỉ dẫn hệ thống cấp cao nhất.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Nhiệt độ lấy mẫu từ 0 đến 1.
        - name: top_p
          type: number
          required: false
          description: Ngưỡng nucleus sampling.
        - name: top_k
          type: integer
          required: false
          description: Giới hạn việc lấy mẫu trong K token đứng đầu.
        - name: stop_sequences
          type: string[]
          required: false
          description: Các chuỗi tùy chỉnh dùng để dừng sinh nội dung.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Trả về Server-Sent Events theo kiểu Anthropic.
        - name: metadata
          type: object
          required: false
          description: Metadata của request, bao gồm user_id tùy chọn.
        - name: tools
          type: object[]
          required: false
          description: Các định nghĩa công cụ mà model có thể dùng.
        - name: tool_choice
          type: object
          required: false
          description: Điều khiển cách chọn công cụ.
        - name: thinking
          type: object
          required: false
          description: Cấu hình extended thinking cho các model được hỗ trợ.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/messages \
          -H "x-api-key: $SANDBASE_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "Content-Type: application/json" \
          -d '{"model":"anthropic/claude-sonnet-4","max_tokens":256,"messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from anthropic import Anthropic

        client = Anthropic(api_key="sk-sb-...", base_url="https://api.sandbase.ai")
        message = client.messages.create(
            model="anthropic/claude-sonnet-4",
            max_tokens=256,
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(message.content[0].text)
    - label: TypeScript
      language: typescript
      code: |-
        import Anthropic from "@anthropic-ai/sdk";

        const client = new Anthropic({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai" });
        const message = await client.messages.create({
          model: "anthropic/claude-sonnet-4",
          max_tokens: 256,
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "msg_01...",
        "type": "message",
        "role": "assistant",
        "model": "anthropic/claude-sonnet-4",
        "content": [{ "type": "text", "text": "Hello! How can I help?" }],
        "stop_reason": "end_turn",
        "usage": { "input_tokens": 8, "output_tokens": 7 }
      }
  notes:
    - title: Xác thực
      description: "Dùng x-api-key hoặc Authorization: Bearer. Khi có cả hai, x-api-key được ưu tiên."
    - title: Giao thức trong suốt
      description: Ngoài việc ánh xạ model và các quy tắc tương thích nhà cung cấp đã cấu hình, SandBase chuyển tiếp các trường request tương thích, response không stream và sự kiện SSE mà không chuyển đổi giao thức.
    - title: Tính năng beta
      description: anthropic-beta được chuyển tiếp khi có mặt. Quy tắc tương thích của một ứng viên có thể loại bỏ các trường beta không được hỗ trợ hoặc bỏ qua ứng viên đó.
  errors:
    - status: "400"
      description: Body của request không hợp lệ hoặc tính năng không được hỗ trợ.
    - status: "401"
      description: API key bị thiếu hoặc không hợp lệ.
    - status: "402"
      description: Đã đạt giới hạn chi tiêu của tổ chức.
    - status: "403"
      description: Đã đạt giới hạn chi tiêu của API Key hoặc lỗi quyền của tổ chức.
    - status: "404"
      description: Không tìm thấy model hoặc model không khả dụng.
    - status: "413"
      description: Nhà cung cấp từ chối request vì quá lớn.
    - status: "429"
      description: Vượt quá giới hạn tốc độ của nhà cung cấp.
    - status: "500"
      description: Lỗi vòng đời prediction hoặc lỗi nhà cung cấp.
    - status: "502"
      description: Stream từ upstream kết thúc trước khi có nội dung dùng được.
    - status: "503"
      description: Định tuyến thất bại hoặc tất cả ứng viên nhà cung cấp đều không khả dụng.
---

<ApiReferencePage />
