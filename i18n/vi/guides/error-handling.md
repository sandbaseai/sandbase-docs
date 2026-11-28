---
i18nSource: f63049c1cf01130e
title: Lỗi và thử lại
description: Phân loại lỗi SandBase API, quyết định khi nào thử lại là an toàn và giữ thông tin chẩn đoán hữu ích mà không làm lộ secret.
---

# Lỗi và thử lại {#errors-and-retries}

Hãy xử lý lỗi theo mã trạng thái HTTP, nhóm endpoint và ngữ nghĩa của thao tác. SandBase cung cấp nhiều giao thức tương thích,
nên không có một cấu trúc JSON lỗi duy nhất dùng chung cho mọi endpoint.

## Đọc cấu trúc lỗi của endpoint {#read-the-endpoint-s-error-shape}

- Các thao tác tương thích OpenAI thường trả về object `error` có message và type.
- Anthropic Messages trả về envelope lỗi tương thích Anthropic.
- Các thao tác cốt lõi của nền tảng có thể trả về body phẳng `{ "error": "..." }` hoặc một lỗi riêng của tài nguyên đã được mô tả.
- Các thao tác của Google và thao tác gốc của nhà cung cấp giữ nguyên cấu trúc giao thức tương thích như đã mô tả.

Hãy dùng mã trạng thái HTTP và body đã được mô tả của phản hồi. Đừng yêu cầu các trường tùy chọn như `code`, `param` hay
`request_id` trừ khi endpoint được chọn đảm bảo có chúng. Xem [tài liệu tham khảo lỗi API](/api-reference/errors) để có
ví dụ và [đặc tả OpenAPI](/openapi.yaml) để biết phản hồi của từng thao tác.

## Quyết định cách xử lý theo mã trạng thái {#decide-what-to-do-by-status}

| Mã trạng thái | Nguyên nhân thường gặp | Hành động khuyến nghị |
|---|---|---|
| `400` / `422` | Body, tham số không hợp lệ hoặc khả năng model không được hỗ trợ | Sửa request trước khi thử lại. |
| `401` | Thông tin xác thực bị thiếu, không hợp lệ, hết hạn hoặc bị thu hồi | Thay thông tin xác thực. |
| `402` | Trạng thái thanh toán không cho phép request | Xử lý số dư tài khoản hoặc kiểm soát chi tiêu. |
| `403` | Phạm vi thông tin xác thực hoặc quyền truy cập tài nguyên không đủ | Dùng key hoặc tài nguyên được cấp quyền. |
| `404` | Không tìm thấy model, tác vụ hoặc tài nguyên nền tảng | Kiểm tra lại định danh và tổ chức. |
| `409` | Xung đột trạng thái tài nguyên hoặc thao tác đồng thời | Đọc trạng thái hiện tại rồi quyết định có thử lại hay không. |
| `429` | SandBase hoặc nhà cung cấp upstream đã giới hạn request | Tuân theo `Retry-After` nếu có; nếu không, hãy backoff kèm jitter. |
| `500` / `502` / `503` / `504` | Lỗi nội bộ, lỗi upstream hoặc tạm thời không khả dụng | Chỉ thử lại nếu việc lặp lại thao tác là an toàn. |

Bảng này là hướng dẫn xử lý, không phải cam kết rằng mọi endpoint đều trả về mọi mã trạng thái.

## Dùng chính sách thử lại có giới hạn {#use-a-bounded-retry-policy}

Với request an toàn khi lặp lại, hãy dùng exponential backoff kèm jitter, giới hạn độ trễ và áp dụng ngân sách tổng cho request.
Tắt cơ chế thử lại của SDK nếu lớp ứng dụng bên ngoài đã thử lại, hoặc tính đến cả hai lớp khi đặt ngân sách.

```python
import os
import random
import time

from openai import APIStatusError, OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def chat_with_backoff(messages, attempts=4):
    for attempt in range(attempts):
        try:
            return client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages,
            )
        except APIStatusError as error:
            retryable = error.status_code in {429, 500, 502, 503, 504}
            if not retryable or attempt == attempts - 1:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

Khi phản hồi có `Retry-After`, hãy phân tích và tuân theo giá trị đó thay vì dùng độ trễ dự phòng. Giữ chính sách
có thể cấu hình; số lần thử và hạn chót phù hợp phụ thuộc vào ngân sách độ trễ và chi phí của bên gọi.

## Tránh tác dụng phụ trùng lặp {#protect-against-duplicate-side-effects}

Lặp lại một request suy luận sẽ tạo ra một lần tạo nội dung mới và có thể phát sinh thêm chi phí. Điều này chỉ chấp nhận được khi
ứng dụng cần một câu trả lời hợp lệ bất kỳ và chấp nhận việc tạo lại.

Hãy thận trọng hơn với các thao tác tạo, cập nhật, xóa, xuất bản, lên lịch hoặc kích hoạt công việc:

- dùng cơ chế idempotency đã được mô tả khi endpoint hỗ trợ;
- nếu không, hãy đọc trạng thái hiện tại trước khi lặp lại một request không rõ kết quả;
- không bao giờ phát lại lệnh gọi công cụ chỉ vì luồng model bao quanh bị ngắt kết nối;
- lưu một client operation ID trong hệ thống của bạn khi cần đối soát các lần thử lại.

## Xử lý riêng timeout và stream {#handle-timeouts-and-streams-separately}

Timeout không chứng minh rằng máy chủ đã ngừng xử lý request. Trước khi thử lại một thao tác bất đồng bộ hoặc thay đổi trạng thái,
hãy truy vấn trạng thái tài nguyên hoặc tác vụ đã được mô tả của nó khi có thể.

Với phản hồi streaming, hãy phân biệt lỗi HTTP trước khi stream bắt đầu với việc ngắt kết nối sau khi đã có một phần output.
Chỉ tín hiệu kết thúc bình thường của giao thức mới chứng minh stream đã hoàn tất. Xem [Phản hồi streaming](/guides/streaming).

## Ghi log chẩn đoán hữu ích và an toàn {#log-useful-safe-diagnostics}

Hãy ghi lại:

- endpoint và định danh model;
- mã trạng thái HTTP và loại lỗi tương thích nếu có;
- định danh của nhà cung cấp hoặc request nếu được trả về;
- số lần thử, thời gian đã trôi qua và liệu đã nhận được byte phản hồi nào chưa.

Đừng ghi log API key, giá trị thông tin xác thực, toàn bộ prompt nhạy cảm hay phản hồi chưa được che của nhà cung cấp. Hãy hiển thị cho người dùng một thông báo ngắn gọn,
có thể hành động, đồng thời giữ lại thông tin chẩn đoán đã làm sạch cho người vận hành.

## Hướng dẫn liên quan {#related-guidance}

- [Tài liệu tham khảo lỗi API](/api-reference/errors)
- [Giới hạn tốc độ](/guides/rate-limiting)
- [Phản hồi streaming](/guides/streaming)
- [Xác thực](/api-reference/authentication)
