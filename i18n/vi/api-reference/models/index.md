---
i18nSource: 3ccdc1071b9be798
title: Models API
description: Tìm metadata, bảng giá, trạng thái hỗ trợ và năng lực của các model trên SandBase.
---

# Models API {#models-api}

Dùng Models API để tìm model trước khi chọn endpoint suy luận. Thao tác liệt kê tương thích OpenAI và trả về các bản ghi định danh gọn nhẹ. Hãy lấy chi tiết một model để xem metadata về năng lực, schema và bảng giá của SandBase.

| Thao tác | Endpoint | Tài liệu |
|---|---|---|
| Liệt kê model | `GET /v1/models` | [Liệt kê Models](./list) |
| Lấy một model | `GET /v1/models/{id_or_name}` | [Lấy Model](./get) |
| Gọi một năng lực API theo đường dẫn | `GET/POST /v1/api/{vendor}/{upstream_path}` | [API Passthrough](./api-passthrough) |
| Chạy một model hoặc năng lực API | `POST /v1/run` | [Chạy năng lực](./run) |
| Lấy kết quả bất đồng bộ | `GET /v1/run/{id}` | [Lấy kết quả Run](./run-get) |
| Nhận callback bất đồng bộ | `webhook_url` trên `POST /v1/run` | [Webhook callback](./run#webhook-callbacks) |
| Duyệt các model được hỗ trợ | — | [Danh mục Models](https://www.sandbase.ai/models) |

Để chạy một model, hãy mở trang tham chiếu của model đó từ [danh mục Models](https://www.sandbase.ai/models); mỗi trang hiển thị định danh chính xác, các trường request và bảng giá. Trang này mô tả việc tìm model, trình chạy năng lực hợp nhất, API passthrough, assets và tra cứu chi phí tác vụ.

`GET /v1/models` hỗ trợ `q`, `vendor`, `type` và `order`; endpoint này không phân trang. Bỏ qua `type` thì mặc định là `llm`, còn truyền rõ `type=` rỗng sẽ liệt kê mọi loại model công khai. Bộ lọc `vendor` so khớp chính xác và phân biệt chữ hoa chữ thường; `q` là tìm kiếm chuỗi con không phân biệt chữ hoa chữ thường. Mỗi mục trong danh sách chứa `id`, `object`, `created` và `owned_by`, trong đó `id` là tên model logic dùng trong request.

Tên model có thể chứa `/`. Hãy truyền các dấu gạch chéo đó như dấu phân tách đường dẫn khi gọi endpoint chi tiết, ví dụ `/v1/models/openai/gpt-5.6-luna`; route của server coi phần đường dẫn còn lại là một định danh logic. Hãy lấy ID hiện tại từ `GET /v1/models` thay vì sao chép định danh từ hướng dẫn cũ.

Với response `202` bất đồng bộ từ một API suy luận, hãy poll `GET /v1/run/{id}` bằng ID không cần diễn giải được trả về. Đừng suy đoán tiền tố ID hoặc tự dựng đường dẫn poll khác từ các header tương thích.
