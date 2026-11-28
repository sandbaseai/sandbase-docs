---
i18nSource: 06feb27e20f1b7f5
title: Liệt kê lịch sử tài khoản
description: Liệt kê các bản ghi thực thi gần đây của tổ chức sở hữu API key.
aside: false
outline: false
apiReference:
  title: Liệt kê lịch sử tài khoản
  operation: Account
  method: GET
  path: /v1/account/history
  description: Liệt kê các bản ghi thực thi gần đây trong phạm vi tổ chức, mới nhất trước. Thông báo lỗi được làm sạch, và các snapshot JSON đã lưu sẽ bị bỏ qua khi không thể giải mã.
  groups:
    - title: Tham số query
      fields:
        - name: model
          type: string
          required: false
          description: Tên model logic chính xác.
        - name: api_key_id
          type: string
          required: false
          description: ID tài nguyên API Key chính xác.
        - name: type
          type: multimodal | llm | api
          required: false
          description: Danh mục thực thi; multimodal bao gồm image, video và audio.
        - name: status
          type: completed | failure | in_progress
          required: false
          description: Trạng thái thực thi đã nhóm.
        - name: error_type
          type: string
          required: false
          description: Loại lỗi chính xác, hoặc unknown cho các bản ghi không có loại lỗi.
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: Khoảng thời gian tạo cuốn chiếu; mặc định là 7d.
        - name: page
          type: integer
          required: false
          description: Số trang, bắt đầu từ 1.
        - name: page_size
          type: integer
          required: false
          description: Số mục mỗi trang từ 1 đến 100; mặc định là 20.
        - name: request_id
          type: string
          required: false
          description: ID thực thi chính xác trong phạm vi tổ chức. Khi được đặt, các bộ lọc khác bị bỏ qua và chỉ yêu cầu một kết quả.
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: Mốc thời gian dùng cho khoảng thời gian cụ thể.
        - name: billing_scope
          type: any | positive | token
          required: false
          description: Bộ lọc quyết toán; positive và token yêu cầu time_basis=settled_at.
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: Thời điểm bắt đầu khoảng (bao gồm), đi kèm với end_at.
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: Thời điểm kết thúc khoảng (không bao gồm); khoảng thời gian không được vượt quá 32 ngày.
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: Chỉ lấy các mẫu độ trễ có giá trị dương.
        - name: min_latency_ms
          type: integer
          required: false
          description: Độ trễ tối thiểu tính bằng mili giây.
        - name: timezone
          type: IANA time-zone name
          required: false
          description: Chỉ dùng để kiểm tra tương thích. Timestamp vẫn ở UTC; tra cứu request_id chính xác bỏ qua tham số này.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/account/history?range=24h&page_size=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "items": [
          {
            "id": "opaque-task-id",
            "model": "openai/gpt-5.4",
            "type": "llm",
            "execution_mode": "sync",
            "status": "completed",
            "latency_ms": 842,
            "user_cost": "0.001250",
            "prompt_tokens": 120,
            "completion_tokens": 48,
            "total_tokens": 168,
            "cached_tokens": 0,
            "cache_creation_tokens": 0,
            "created_at": "2026-08-24T00:00:00Z",
            "completed_at": "2026-08-24T00:00:01Z",
            "api_key_prefix": "sk-1234567"
          }
        ],
        "total": 1,
        "page": 1,
        "page_size": 20
      }
---

<ApiReferencePage />
