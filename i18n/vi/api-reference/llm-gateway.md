---
i18nSource: 9ee3d6d77d12e944
title: Chat Completions API
description: Tạo chat completion tương thích OpenAI với các model ngôn ngữ và thị giác của SandBase.
aside: false
outline: false
apiReference:
  title: Tạo Chat Completion
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: Tạo chat completion tương thích OpenAI với bất kỳ model chat nào được SandBase hỗ trợ. Các trường tương thích với nhà cung cấp được giữ nguyên khi tuyến đã chọn hỗ trợ.
  signature: client.chat.completions.create(params)
  groups:
    - title: Body request
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Định danh model từ Models API.
        - name: messages
          type: object[]
          required: true
          description: Các message hội thoại dùng những role mà nhà cung cấp đã chọn hỗ trợ, thường là system, developer, user, assistant hoặc tool.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Nhiệt độ lấy mẫu từ 0 đến 2.
        - name: top_p
          type: number
          required: false
          default: "1"
          description: Ngưỡng nucleus sampling.
        - name: max_tokens
          type: integer
          required: false
          description: Số token đầu ra tối đa.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Trả về Server-Sent Events theo từng phần.
        - name: stop
          type: string | string[]
          required: false
          description: Một hoặc nhiều chuỗi dừng quá trình sinh.
        - name: tools
          type: object[]
          required: false
          description: Định nghĩa function mà model có thể dùng.
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: Kiểm soát việc có chọn tool hay không và chọn tool nào.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Cho phép các model được hỗ trợ phát nhiều lệnh gọi tool trong một turn.
        - name: user
          type: string
          required: false
          description: Định danh người dùng cuối tương thích với nhà cung cấp.
        - name: response_format
          type: object
          required: false
          description: Cấu hình đầu ra JSON object hoặc JSON Schema.
        - name: reasoning_effort
          type: string
          required: false
          description: Thiết lập mức nỗ lực suy luận tương thích với nhà cung cấp.
        - name: reasoning
          type: object
          required: false
          description: Cấu hình suy luận như effort hoặc max_tokens.
        - name: thinking
          type: object
          required: false
          description: Cấu hình thinking như type hoặc budget_tokens.
        - name: extra_body
          type: object
          required: false
          description: Tham số riêng của nhà cung cấp cho các tuyến cần chuyển đổi giao thức.
        - name: n
          type: integer
          required: false
          default: "1"
          description: Số lựa chọn completion cần tạo.
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: Presence penalty từ -2 đến 2.
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: Frequency penalty từ -2 đến 2.
        - name: stream_options
          type: object
          required: false
          description: Tùy chọn streaming như include_usage.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/chat/completions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"deepseek/deepseek-v4-flash","messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(response.choices[0].message.content)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.chat.completions.create({
          model: "deepseek/deepseek-v4-flash",
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(response.choices[0].message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "chatcmpl_01...",
        "object": "chat.completion",
        "model": "deepseek/deepseek-v4-flash",
        "choices": [{
          "index": 0,
          "message": { "role": "assistant", "content": "Hello! How can I help?" },
          "finish_reason": "stop"
        }],
        "usage": { "prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15 }
      }
  notes:
    - title: Streaming và tool
      description: "Đặt stream thành true để dùng SSE; luồng kết thúc bằng data: [DONE]. Thêm stream_options.include_usage để nhận chunk usage cuối cùng. Lệnh gọi tool và nội dung đa phương thức tuân theo schema tương thích OpenAI."
    - title: Tương thích nhà cung cấp
      description: SandBase giữ nguyên các trường tương thích bổ sung trên các tuyến cùng giao thức. Mức hỗ trợ trường giữa các giao thức khác nhau và trường riêng của nhà cung cấp có thể khác nhau; hãy dùng extra_body khi phù hợp.
  errors:
    - status: "400"
      description: Body request không hợp lệ hoặc tham số không được hỗ trợ.
    - status: "401"
      description: Thiếu API key hoặc API key không hợp lệ.
    - status: "402"
      description: Đã đạt giới hạn chi tiêu của tổ chức.
    - status: "404"
      description: Không tìm thấy model hoặc model không khả dụng.
    - status: "429"
      description: Vượt quá giới hạn tốc độ.
    - status: "500"
      description: Lưu request hoặc tra cứu tổ chức thất bại.
    - status: "502"
      description: Nhà cung cấp đã chọn trả về response không hợp lệ.
    - status: "503"
      description: Không có tuyến nhà cung cấp nào thành công.
---

<ApiReferencePage />
