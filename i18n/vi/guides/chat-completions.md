---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: Dùng chat completions tương thích OpenAI, streaming, công cụ, input đa phương thức và structured output với SandBase.
---

# Chat Completions {#chat-completions}

SandBase cung cấp endpoint Chat Completions tương thích OpenAI tại `POST /v1/chat/completions`. Các ứng dụng đang dùng OpenAI SDK có thể chuyển sang SandBase chỉ bằng cách thay API key và base URL.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## Message và nội dung đa phương thức {#messages-and-multimodal-content}

Gửi message theo thứ tự hội thoại, dùng các vai trò mà nhà cung cấp được chọn hỗ trợ, thường là `system`, `developer`, `user`, `assistant` và `tool`. Văn bản có thể là một chuỗi. Các model hỗ trợ thị giác cũng chấp nhận content part như `text` và `image_url`.

## Streaming {#streaming}

Đặt `stream: true` để nhận Server-Sent Events. Đọc từng event `data:` theo thứ tự và nối các giá trị `choices[0].delta.content`. Stream kết thúc bằng `data: [DONE]`. Thêm `stream_options: {"include_usage": true}` khi nhà cung cấp được chọn trả về mức sử dụng trong stream; nếu không, thông tin mức sử dụng có thể không có.

## Công cụ {#tools}

Định nghĩa các hàm có thể gọi trong `tools`. Khi assistant trả về `tool_calls`, hãy thực thi từng hàm trong ứng dụng của bạn, sau đó thêm một message `tool` chứa `tool_call_id` tương ứng trước khi tiếp tục.

## Structured output {#structured-output}

Dùng `response_format` để yêu cầu response dạng JSON object hoặc JSON Schema. Mức hỗ trợ khác nhau tùy model, vì vậy hãy kiểm tra khả năng của model được chọn trước khi dựa vào việc áp dụng schema nghiêm ngặt.

## Tham số riêng của nhà cung cấp {#provider-specific-parameters}

SandBase dùng `model` và `stream` để định tuyến. Các trường request bổ sung tương thích OpenAI được giữ nguyên khi nhà cung cấp được chọn dùng cùng giao thức. Khi SandBase chuyển đổi giữa các giao thức, hãy dùng các trường đã được mô tả trong tài liệu hoặc `extra_body`; mức hỗ trợ khác nhau tùy nhà cung cấp.

## Lỗi và thử lại {#errors-and-retries}

Chỉ dùng backoff có giới hạn cho lỗi `429` có thể thử lại và các response tạm thời từ server khi việc sinh lại là an toàn. Không tự động thử lại request sai định dạng, lỗi xác thực hoặc request mà tác dụng phụ của công cụ có thể đã xảy ra. Xem [Lỗi và thử lại](/guides/error-handling). Để xem đầy đủ schema của các trường và response, xem [Chat Completions API](/api-reference/llm-gateway).
