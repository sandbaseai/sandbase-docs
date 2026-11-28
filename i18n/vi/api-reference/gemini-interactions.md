---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: Tạo, stream và poll model Interaction qua giao thức Google gốc.
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: Tạo một Google Interaction gốc. Hãy kiểm tra status ngay cả khi nhận HTTP 200; response in_progress cần được poll.
  groups:
    - title: Body của request
      fields:
        - name: model
          type: string
          required: true
          description: Tên model logic của SandBase.
        - name: input
          type: string | object | array
          required: true
          description: Input Google Interaction gốc.
        - name: stream
          type: boolean
          required: false
          description: Trả về event SSE của Google Interactions khi model hỗ trợ.
        - name: background
          type: boolean
          required: false
          description: Gửi một cách bền vững và trả về Interaction có thể poll ngay. Không thể kết hợp với stream.
        - name: previous_interaction_id
          type: string
          required: false
          description: Tiếp tục từ một Interaction upstream đồng thời giữ provider affinity.
        - name: store
          type: boolean
          required: false
          description: Chuyển tiếp nguyên trạng tùy chọn lưu trữ của upstream.
        - name: system_instruction
          type: string
          required: false
          description: Chỉ dẫn hệ thống gốc.
        - name: tools
          type: array
          required: false
          description: Định nghĩa công cụ Google gốc.
        - name: generation_config
          type: object
          required: false
          description: Cấu hình sinh nội dung gốc.
        - name: response_format
          type: object | array
          required: false
          description: Định dạng response được yêu cầu.
        - name: response_modalities
          type: array
          required: false
          description: Các modality output được yêu cầu.
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## Xác thực {#authentication}

Dùng `x-goog-api-key`, `Authorization: Bearer …` hoặc tham số query `key`, theo thứ tự ưu tiên đó. Nên dùng header vì thông tin xác thực trong query string có thể bị ghi vào log.

## Model được hỗ trợ {#supported-models}

Endpoint Interactions không phải route chung cho mọi model có tên catalog bắt đầu bằng `google/`. Model
phải có ánh xạ nhà cung cấp tương thích Interactions. Hiện SandBase mô tả các model tương thích sau:

- Gemini Omni Flash Preview: `google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview: `google/gemini-omni-1.1-flash-preview`

Các model Google khác dùng endpoint khác. Ví dụ, Nano Banana Pro và Nano Banana 2 dùng
[`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content), không phải `/v1beta/interactions`. Model không được hỗ trợ sẽ thất bại thay vì được định tuyến
qua một giao thức Google khác.

## Thành công và polling {#success-and-polling}

Các lần gửi thành công trả về HTTP `200`, kể cả tác vụ nền và request đồng bộ đã hết thời gian chờ giới hạn. Luôn kiểm tra `status`:

- `completed`, `failed`, `cancelled` và `incomplete` là trạng thái kết thúc.
- `in_progress` nghĩa là vẫn đang chạy. Poll `GET /v1beta/interactions/{id}`; response cũng có thể chứa đường dẫn đó trong header `Location`.
- `requires_action` là một trạng thái của giao thức, nhưng hiện SandBase chưa cung cấp endpoint xác nhận công cụ cần thiết để tiếp tục trạng thái này.

ID dùng để poll là `id` của Interaction upstream do `POST` trả về, không phải prediction ID của SandBase. Phải dùng chính SandBase API key đã tạo Interaction để lấy nó.

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

Response GET chưa ở trạng thái kết thúc không chứa output từng phần và mức sử dụng. Response ở trạng thái kết thúc có thể chứa dữ liệu ảnh, âm thanh hoặc video inline và có thể nặng vài megabyte. Hãy tải xuống và lưu trữ media cần thiết kịp thời: sau khi thời hạn lưu giữ ở upstream kết thúc, SandBase chỉ có thể trả về bản dự phòng ở trạng thái kết thúc bị mất dữ liệu, gồm cấu trúc và metadata, không có dữ liệu byte gốc của media.

## Streaming {#streaming}

Đặt `stream: true` trong body của request. Response là `text/event-stream`; giao thức này không dùng `?alt=sse`. Các loại event và delta không cố định và được chuyển tiếp mà không qua danh sách cho phép cố định, vì vậy client nên chấp nhận các giá trị chưa biết. Khi header streaming đã được ghi, lỗi sẽ đến dưới dạng event `error` thay vì một mã trạng thái HTTP khác.

Streaming phụ thuộc vào model. Nhà cung cấp upstream có thể từ chối `stream: true` dù giao thức có hỗ trợ.

## Giới hạn hiện tại {#current-limits}

Hiện SandBase chỉ cung cấp create và get:

- Agent Interactions bị từ chối; hãy dùng `model`.
- Không thể kết hợp `background: true` và `stream: true`.
- Chưa cung cấp list, delete và cancel cho Interaction.
- Chưa cung cấp phân phối qua URI và kết nối lại stream dựa trên GET.
- `previous_interaction_id` yêu cầu ánh xạ provider affinity đang hoạt động và hỗ trợ từ upstream. SandBase sẽ báo lỗi thay vì âm thầm chuyển nhà cung cấp khi không có affinity.

Lỗi dùng định dạng của Google `{ "error": { "code", "message", "status" } }`. Hãy coi mã trạng thái HTTP là ổn định; văn bản upstream đã được làm sạch trong `message` có thể thay đổi.
