---
i18nSource: b5cf676d897d17a3
title: Tạo Response
description: Tạo response của model tương thích OpenAI, bao gồm request streaming và request có dùng công cụ.
aside: false
outline: false
apiReference:
  title: Tạo Response
  operation: Inference
  method: POST
  path: /v1/responses
  description: Tạo response của model tương thích OpenAI. SandBase giữ nguyên các trường request sau khi ánh xạ model, sau đó làm sạch response để chỉ còn các trường OpenAI công khai.
  signature: client.responses.create(params)
  groups:
    - title: Body của request
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Định danh model lấy từ Models API.
        - name: input
          type: string | object[]
          required: false
          description: Văn bản, message item hoặc đầu vào khác được model và nhà cung cấp đã chọn hỗ trợ.
        - name: instructions
          type: string
          required: false
          description: Chỉ dẫn system hoặc developer cho response.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Trả về Server-Sent Events tương thích OpenAI.
        - name: background
          type: boolean
          required: false
          description: Yêu cầu thực thi nền khi nhà cung cấp đã chọn hỗ trợ.
        - name: include
          type: string[]
          required: false
          description: Dữ liệu response công khai bổ sung cần đưa vào khi được hỗ trợ.
        - name: max_output_tokens
          type: integer
          required: false
          description: Số token được tạo tối đa.
        - name: max_tool_calls
          type: integer
          required: false
          description: Số lần gọi công cụ tích hợp sẵn tối đa khi được hỗ trợ.
        - name: metadata
          type: object
          required: false
          description: Metadata của request được chuyển tiếp đến nhà cung cấp.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Cho phép các model được hỗ trợ gọi công cụ song song.
        - name: previous_response_id
          type: string
          required: false
          description: Response trước đó cần tiếp tục khi route đã chọn hỗ trợ.
        - name: reasoning
          type: object
          required: false
          description: Cấu hình reasoning cho các model được hỗ trợ.
        - name: store
          type: boolean
          required: false
          description: Yêu cầu lưu response ở phía nhà cung cấp khi được hỗ trợ.
        - name: text
          type: object
          required: false
          description: Cấu hình đầu ra văn bản và định dạng có cấu trúc.
        - name: tool_choice
          type: string | object
          required: false
          description: Điều khiển việc chọn công cụ.
        - name: tools
          type: object[]
          required: false
          description: Các công cụ model có thể dùng.
        - name: truncation
          type: string
          required: false
          description: Hành vi cắt bớt đầu vào.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/responses \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-5.2","input":"Explain immutable infrastructure in one sentence."}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.responses.create(
            model="openai/gpt-5.2",
            input="Explain immutable infrastructure in one sentence.",
        )
        print(response.output_text)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.responses.create({
          model: "openai/gpt-5.2",
          input: "Explain immutable infrastructure in one sentence.",
        });
        console.log(response.output_text);
  response:
    status: 200 OK
    code: |-
      {
        "id": "resp_01...",
        "object": "response",
        "status": "completed",
        "model": "openai/gpt-5.2",
        "output": [],
        "usage": {
          "input_tokens": 18,
          "output_tokens": 12,
          "total_tokens": 30,
          "input_tokens_details": {"cached_tokens": 0},
          "output_tokens_details": {"reasoning_tokens": 0}
        }
      }
  notes:
    - title: Tương thích request
      description: SandBase ghi đè model thành model upstream đã chọn và giữ nguyên các trường request khác. Mức hỗ trợ vẫn khác nhau giữa các nhà cung cấp.
    - title: Response đã làm sạch
      description: Chỉ trả về các trường response OpenAI công khai và mức dùng token. Thông tin thanh toán, tài khoản, định tuyến của nhà cung cấp và các phần mở rộng cấp cao nhất không xác định đều bị loại bỏ; nội dung output item được giữ nguyên.
    - title: Streaming
      description: Các sự kiện SSE response.* và error công khai được làm sạch rồi chuyển tiếp. Sự kiện riêng không xác định bị bỏ qua; dữ liệu sai định dạng sẽ đóng stream thay vì chuyển tiếp nội dung không an toàn.
  errors:
    - status: "400"
      description: JSON không hợp lệ, thiếu model hoặc request đến nhà cung cấp không hợp lệ.
    - status: "401"
      description: API key bị thiếu hoặc không hợp lệ.
    - status: "402"
      description: Đã chạm hạn mức chi tiêu của tổ chức hoặc API Key.
    - status: "403"
      description: Bị từ chối do phạm vi API key hoặc quyền ở upstream.
    - status: "413"
      description: Nhà cung cấp upstream từ chối request vì quá lớn.
    - status: "500"
      description: Vòng đời prediction hoặc tra cứu tổ chức thất bại.
    - status: "502"
      description: Không thể phân tích và làm sạch response upstream một cách an toàn.
    - status: "503"
      description: Định tuyến thất bại hoặc đã thử hết mọi nhà cung cấp ứng viên.
---

<ApiReferencePage />
