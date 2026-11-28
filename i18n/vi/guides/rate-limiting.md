---
i18nSource: d326fdb78ea64bdf
title: Giới hạn tốc độ
description: Xử lý giới hạn tốc độ của SandBase API một cách an toàn bằng thử lại có giới hạn, jitter, hàng đợi và xử lý request có tính đến idempotency.
---

# Giới hạn tốc độ {#rate-limits}

SandBase có thể cấp cho tổ chức của bạn một giới hạn số request mỗi phút. Giới hạn này được dùng chung cho mọi API key trong tổ chức
và được tính trong một cửa sổ trượt một phút. Các nhà cung cấp model upstream cũng có thể trả về response
`429 Too Many Requests` của riêng họ. Đừng hardcode hạn mức trừ khi SandBase đã cấp hạn mức đó cho khối lượng công việc của bạn.

## Giới hạn của tổ chức bạn {#your-organization-s-limit}
SandBase không công bố một con số cố định cho số request mỗi phút, vì giới hạn được cấp theo từng tổ chức. Mọi
API key trong tổ chức đều được tính vào cùng một giới hạn, vì vậy tạo thêm key không làm tăng giới hạn. Giới hạn này
hiện không hiển thị trong API công khai hay Console.

Nếu khối lượng công việc của bạn cần giới hạn được đảm bảo hoặc cao hơn, hãy liên hệ bộ phận hỗ trợ SandBase kèm thông tin tổ chức, ứng dụng,
tốc độ ổn định dự kiến và tốc độ đột biến dự kiến. Đừng thiết kế client production dựa trên một giá trị mặc định chưa được công bố.

## Xử lý response 429 {#handle-a-429-response}

Response giới hạn tốc độ `/v1/*` do nền tảng tạo ra dùng body lỗi dạng phẳng:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

Giới hạn của tổ chức áp dụng cho `POST /v1/run`, `POST /v1/chat/completions`, `POST /v1/responses`, `POST /v1/messages`, `POST /v1/upload` và các endpoint Gemini `generateContent`, `streamGenerateContent` và `POST /v1beta/interactions`. Các endpoint poll như
`GET /v1/run/{id}` không được tính. Các endpoint tương thích giao thức trả về cùng lỗi `429` trong cấu trúc lỗi riêng của chúng,
chẳng hạn cấu trúc lỗi của Anthropic hoặc Google. Response do nhà cung cấp trả về có thể dùng cấu trúc lỗi của endpoint
tương thích và có thể kèm header giới hạn tốc độ của nhà cung cấp.

Header `Retry-After` và header hạn mức còn lại không được đảm bảo. Nếu có `Retry-After`, hãy tuân theo nó. Nếu không, hãy dùng
exponential backoff kèm jitter và số lần thử tối đa.

```python
import os
import random
import time

from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def create_with_backoff(**request):
    for attempt in range(5):
        try:
            return client.chat.completions.create(**request)
        except RateLimitError:
            if attempt == 4:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

OpenAI SDK cũng hỗ trợ thử lại tích hợp qua `max_retries`. Hãy chủ động chọn dùng cơ chế thử lại của SDK hoặc vòng lặp thử lại
của ứng dụng để các lần thử lại không bị nhân lên qua nhiều lớp.

## Chỉ thử lại các thao tác an toàn {#retry-only-safe-operations}

Một request inference được lặp lại có thể tạo thêm một lần sinh nội dung và phát sinh chi phí bổ sung. Chỉ thử lại khi
ứng dụng của bạn chấp nhận việc sinh lại. Đừng tự động thử lại request làm thay đổi trạng thái, trừ khi thao tác đó có mô tả
tính idempotent hoặc ứng dụng của bạn có thể chứng minh lần thử đầu tiên chưa thành công.

Với request streaming, lỗi `429` thường đến trước khi stream bắt đầu. Khi đã nhận được byte, hãy coi việc mất kết nối
là một lần sinh bị gián đoạn thay vì mặc định đó là lỗi giới hạn tốc độ. Giữ lại hoặc bỏ đầu ra từng phần tùy theo
yêu cầu sản phẩm của bạn; bắt đầu lại sẽ tạo một lần sinh mới.

## Kiểm soát thông lượng {#control-throughput}

- Giới hạn mức đồng thời thay vì gửi một lô không giới hạn cùng lúc.
- Đưa công việc dồn dập vào hàng đợi và làm mượt tốc độ gửi.
- Tránh request trùng lặp và cache các kết quả có thể tái sử dụng khi yêu cầu về quyền riêng tư và độ mới cho phép.
- Dùng các key riêng để phân định quyền sở hữu, kiểm soát chi tiêu và thu hồi, không phải để vượt qua giới hạn của nền tảng.
- Ghi lại endpoint, model, HTTP status và body lỗi đã làm sạch để khắc phục sự cố.
- Liên hệ bộ phận hỗ trợ SandBase khi khối lượng công việc cần giới hạn năng lực được cấp riêng hoặc cao hơn.

```python
import asyncio

semaphore = asyncio.Semaphore(8)

async def run_one(client, prompt):
    async with semaphore:
        return await client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
```

Mức đồng thời không giống với số request mỗi phút. Hãy điều chỉnh cả hai dựa trên độ trễ quan sát được và năng lực được cấp cho
ứng dụng của bạn.

::: info Lượt gọi API miễn phí hằng ngày
100 lượt gọi data API miễn phí mỗi ngày theo UTC của tổ chức là hạn mức thanh toán, không phải giới hạn tốc độ. Các lượt gọi vượt quá hạn mức
được tính phí theo từng lượt chứ không bị từ chối. Xem [Lượt gọi API miễn phí hằng ngày](/guides/billing#daily-free-api-calls).
:::

::: tip Tác vụ video
Yêu cầu tạo video còn bị giới hạn bởi số tác vụ tổ chức của bạn có thể chạy cùng lúc, dựa trên cấp độ tài khoản.
Lỗi `429` đó có nội dung `organization concurrency limit exceeded` và được gỡ khi một tác vụ đang chạy kết thúc, không theo bộ đếm thời gian. Xem
[Giới hạn đồng thời](/guides/concurrency-limits).
:::

## Hướng dẫn liên quan {#related-guidance}

- [Xử lý lỗi](/guides/error-handling)
- [Streaming](/guides/streaming)
- [Tài liệu tham khảo lỗi API](/api-reference/errors)
- [API key](/getting-started/api-keys)
