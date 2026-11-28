---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: Dùng messages, content block, công cụ, thinking và streaming tương thích Anthropic với SandBase.
---

# Anthropic Messages {#anthropic-messages}

SandBase cung cấp endpoint tương thích Anthropic tại `POST /v1/messages`. Ứng dụng dùng Anthropic SDK có thể kết nối chỉ bằng cách đổi API key và base URL.

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## Header xác thực và phiên bản {#authentication-and-version-headers}

Dùng `x-api-key` hoặc `Authorization: Bearer …`. Khi có cả hai, `x-api-key` được ưu tiên. Header tùy chọn `anthropic-version` được chuyển tiếp lên upstream và mặc định là `2023-06-01` nếu bỏ qua. Các giá trị `anthropic-beta` tùy chọn cũng được chuyển tiếp, tùy thuộc vào khả năng tương thích của nhà cung cấp.

## Tin nhắn và content block {#messages-and-content-blocks}

Tin nhắn dùng vai trò `user` và `assistant`. Đặt system instruction trong trường `system` ở cấp cao nhất. Nội dung có thể là văn bản thuần hoặc một mảng các block có kiểu như `text`, `image`, `tool_use` và `tool_result`.

## Công cụ và extended thinking {#tools-and-extended-thinking}

Thêm định nghĩa công cụ trong `tools` và điều khiển việc chọn công cụ qua `tool_choice`. Khi model đã chọn hỗ trợ, hãy cấu hình suy luận mở rộng bằng `thinking`; giữ nguyên các thinking block được trả về khi tiếp tục hội thoại.

## Streaming {#streaming}

Đặt `stream: true` để nhận các sự kiện SSE theo kiểu Anthropic, gồm `message_start`, các sự kiện content block, `message_delta` và `message_stop`. SandBase cũng chuyển tiếp sự kiện keepalive và các sự kiện beta do nhà cung cấp định nghĩa. Bên tiêu thụ nên bỏ qua các loại sự kiện không xác định để tương thích về sau và xử lý các sự kiện `error` ở cấp giao thức.

## Khả năng tương thích {#compatibility}

SandBase ánh xạ tên model công khai sang nhà cung cấp đã chọn. Các trường request tương thích khác và byte của response được giữ nguyên, trừ khi nhà cung cấp đó có quy tắc tương thích rõ ràng loại bỏ trường không được hỗ trợ hoặc từ chối ứng viên. Các tính năng beta riêng của nhà cung cấp có thể không khả dụng trên mọi model. Để xem đầy đủ schema request và response, hãy xem [Tạo Anthropic Message](/api-reference/anthropic-compat).
