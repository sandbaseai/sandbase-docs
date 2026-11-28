---
i18nSource: efa205ed7505643c
title: Chạy một model hoặc năng lực API
description: Gửi một model hoặc năng lực API của SandBase qua endpoint run hợp nhất.
aside: false
outline: false
apiReference:
  title: Chạy một model hoặc năng lực API
  operation: Models
  method: POST
  path: /v1/run
  description: Thực thi một model hoặc năng lực API đã bật của SandBase. Các trường request tùy thuộc vào từng năng lực; hãy dùng trang tham chiếu model hoặc API trên website SandBase để xem schema của năng lực đã chọn.
  groups:
    - title: Body của request
      fields:
        - name: model
          type: string
          required: true
          description: Định danh logic của model hoặc năng lực API đã bật.
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: Gợi ý chế độ thực thi. `auto` dùng giá trị mặc định đã cấu hình của năng lực được chọn; các giá trị khác cần năng lực đó hỗ trợ.
        - name: stream
          type: boolean
          required: false
          description: "Yêu cầu đầu ra dạng stream khi năng lực được chọn hỗ trợ. Tương đương `mode: stream`."
        - name: webhook_url
          type: string
          required: false
          description: Callback HTTPS tùy chọn cho hình ảnh bất đồng bộ được hỗ trợ
          video: null
          or audio tasks. See the Webhooks reference for validation and delivery behavior.: null
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## Thực thi và kết quả {#execution-and-results}

Năng lực đồng bộ trả về response hoàn chỉnh ngay trong request ban đầu. Năng lực bất đồng bộ trả về `202 Accepted` với một `id` không cần diễn giải; hãy poll [Lấy run bất đồng bộ](./run-get) cho đến khi trạng thái là trạng thái kết thúc.

Các trường request và dạng đầu ra riêng của từng năng lực được định nghĩa trên trang của model hoặc thao tác API đã chọn. Hãy gửi các trường đó ở cấp cao nhất của body JSON; không bọc chúng trong đối tượng `input`. Đừng giả định mọi năng lực đều chấp nhận cùng các tham số.

## Webhook callback {#webhook-callbacks}

Chỉ đặt `webhook_url` cho các tác vụ hình ảnh, video hoặc âm thanh bất đồng bộ được hỗ trợ. SandBase gửi sự kiện run cuối cùng đến endpoint HTTPS sau khi hoàn thành hoặc thất bại; callback chỉ là tín hiệu thông báo, không thay thế cho `GET /v1/run/{id}`. Hãy luôn tiếp tục poll endpoint run để lấy trạng thái chính xác và thử lại an toàn khi callback bị trễ hoặc trùng lặp. Response đồng bộ của model và các endpoint gốc của nhà cung cấp không dùng trường callback này.
