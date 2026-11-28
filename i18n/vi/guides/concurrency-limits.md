---
i18nSource: fc051d55a0cfa8bd
title: Giới hạn đồng thời
description: Tổ chức của bạn có thể chạy bao nhiêu tác vụ cùng lúc, giới hạn tăng theo cấp tài khoản như thế nào và cách xử lý 429 và 402 khi gửi video.
---

# Giới hạn đồng thời {#concurrency-limits}

Giới hạn đồng thời kiểm soát số tác vụ mà tổ chức của bạn có thể chạy cùng lúc. Mỗi tổ chức có một cấp tài khoản, và cấp này quyết định giới hạn đồng thời. Khi chạm giới hạn, các lượt gửi mới trên những endpoint được kiểm tra bên dưới sẽ bị từ chối với `429` cho đến khi một tác vụ đang chạy của bạn hoàn thành. Các lượt gửi này không được đưa vào hàng đợi.

Giới hạn áp dụng cho toàn bộ tổ chức, trên mọi API key. Lượt gửi nào được kiểm tra phụ thuộc vào endpoint:

- `POST /v1/run` và các lệnh gọi Platform API qua `/v1/api/{vendor}/...` được kiểm tra với mọi loại model, bao gồm hình ảnh, âm thanh, LLM và các thao tác data API.
- Các endpoint khác, như Chat Completions, Responses, Messages, OpenAI Images và các endpoint tương thích giao thức Gemini và Volcengine, chỉ kiểm tra lượt gửi video.

## Cách hoạt động {#how-it-works}

Khi bạn gửi một tác vụ thuộc diện kiểm tra, SandBase đếm số tác vụ tổ chức của bạn đang xử lý, tức là các tác vụ ở trạng thái `pending` hoặc `running`. Nếu số này đã bằng giới hạn, lượt gửi bị từ chối ngay với `429`. Không có tác vụ nào được tạo và không bị tính phí.

Số đếm bao gồm mọi request đang xử lý trong tổ chức, không chỉ video. Một chat completion dạng streaming vẫn đang mở khi bạn gửi tác vụ thuộc diện kiểm tra sẽ chiếm một slot. Nếu cùng một tổ chức chạy cả chat streaming dài và job video, hãy tính tất cả khi lập kế hoạch dung lượng.

Slot được giải phóng ngay khi tác vụ đạt trạng thái cuối (`completed`, `failed` hoặc `timeout`). Bạn không cần giải phóng gì ở phía mình. Vì slot được giải phóng khi tác vụ kết thúc chứ không theo bộ đếm thời gian, lỗi `429` này khác với [giới hạn tốc độ](/guides/rate-limiting) theo phút. Chờ một khoảng cố định không đảm bảo có slot. Thay vào đó, hãy chờ một tác vụ của chính bạn hoàn thành.

## Giới hạn mặc định {#default-limits}

Mỗi tổ chức mới bắt đầu ở cấp **Bronze**, với giới hạn 2 tác vụ đồng thời. Cấp của bạn tự động tăng dựa trên số tiền của một lần nạp thành công.

| Cấp | Một lần nạp | Tác vụ đồng thời |
|-------|---------------|------------------|
| Bronze | Mặc định | 2 |
| Silver | Từ $10 | 10 |
| Gold | Từ $100 | 100 |
| Platinum | Từ $500 | 500 |
| Diamond | Liên hệ bộ phận kinh doanh | Không giới hạn |

- **Tính theo một lần nạp, không cộng dồn.** Hai lần nạp $60 vẫn giữ bạn ở Silver. Một lần nạp $100 đưa bạn lên Gold.
- **Chỉ nâng cấp.** Lần nạp sau với số tiền nhỏ hơn không bao giờ hạ cấp của bạn.
- **Chỉ tính lần nạp trả phí.** Credit khuyến mãi, credit đăng ký và coupon không thay đổi cấp của bạn.
- **Có hiệu lực ngay.** Giới hạn mới áp dụng cho lượt gửi video tiếp theo ngay khi thanh toán thành công.

## Tăng giới hạn {#increasing-your-limit}

Cách trực tiếp nhất để tăng giới hạn là một lần nạp đạt ngưỡng tiếp theo trong bảng trên.

Nếu cần hơn 500 tác vụ đồng thời hoặc hạn mức credit hằng tháng, hãy liên hệ [contact@sandbase.ai](mailto:contact@sandbase.ai) về cấp **Diamond**. Diamond không có giới hạn đồng thời. Cấp này do đội ngũ SandBase thiết lập và không bao giờ thay đổi theo lần nạp.

## Kiểm tra credit khi gửi video {#credit-check-on-video-submissions}

Cùng với kiểm tra đồng thời, SandBase ước tính chi phí của mỗi tác vụ video trước khi chấp nhận. Nếu chi phí ước tính lớn hơn credit khả dụng của bạn (số dư cộng hạn mức credit nếu có), lượt gửi bị từ chối với `402`. Không có tác vụ nào được tạo và không bị tính phí.

- Mỗi lượt gửi được kiểm tra dựa trên số dư hiện tại. Các tác vụ còn đang chạy chưa bị tính phí, vì vậy hãy chừa khoảng dư khi gửi nhiều video cùng lúc.
- Nếu giá của model phụ thuộc vào đầu ra chỉ có sau khi chạy, chi phí không thể ước tính trước. Lượt gửi sẽ được chấp nhận và tính phí bình thường khi tác vụ hoàn thành.

## Xử lý lỗi đồng thời {#handling-concurrency-errors}

### 429: đã chạm giới hạn đồng thời {#_429-concurrency-limit-reached}

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

Không có header `Retry-After` được gửi. Giới hạn đã biết trước, nên cách đáng tin cậy nhất là không bao giờ vượt quá. Hãy giới hạn số tác vụ video đang chạy ở phía client và chỉ gửi tác vụ tiếp theo sau khi một tác vụ trước đó hoàn thành:

::: code-group

```python [Python]
import asyncio

MAX_CONCURRENT_VIDEOS = 2  # set to your level's limit
slots = asyncio.Semaphore(MAX_CONCURRENT_VIDEOS)

async def generate_video(submit, wait_for_result, payload):
    # Hold a slot for the whole lifetime of the task, not just the submit call.
    async with slots:
        task = await submit(payload)
        return await wait_for_result(task)

async def main(submit, wait_for_result, payloads):
    return await asyncio.gather(
        *(generate_video(submit, wait_for_result, p) for p in payloads)
    )
```

```javascript [JavaScript]
const MAX_CONCURRENT_VIDEOS = 2; // set to your level's limit

async function runAll(payloads, submit, waitForResult) {
  const results = [];
  const queue = [...payloads.entries()];

  async function worker() {
    for (let next = queue.shift(); next; next = queue.shift()) {
      const [index, payload] = next;
      // Each worker holds one slot until its task finishes.
      const task = await submit(payload);
      results[index] = await waitForResult(task);
    }
  }

  await Promise.all(
    Array.from({ length: MAX_CONCURRENT_VIDEOS }, worker)
  );
  return results;
}
```

:::

Nếu vẫn nhận `429`, chẳng hạn vì một dịch vụ khác trong cùng tổ chức cũng đang gửi, hãy lùi lại rồi thử lại. Dùng exponential backoff kèm jitter, và dừng sau một số lần thử có giới hạn thay vì thử lại liên tục trong vòng lặp chặt.

### 402: không đủ credit cho video này {#_402-not-enough-credit-for-this-video}

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

Đừng thử lại. Hãy nạp tiền, hoặc chọn thời lượng ngắn hơn hay độ phân giải thấp hơn để giảm chi phí.

### API tương thích {#compatible-apis}

Các endpoint tương thích giao thức trả về những lỗi này theo định dạng gốc của riêng chúng. Ví dụ, endpoint tương thích Volcengine `/api/v3/contents/generations/tasks` trả về `RateLimitExceeded` cho `429` và `AccountOverdueError` cho `402`.

## Liên quan {#related}

- [Giới hạn tốc độ](/guides/rate-limiting): giới hạn request theo phút
- [Bảng giá](/guides/billing): credit và nạp tiền
- [Lỗi](/api-reference/errors): tất cả mã lỗi
