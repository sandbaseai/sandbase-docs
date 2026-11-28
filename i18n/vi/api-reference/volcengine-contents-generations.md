---
i18nSource: 4bd032d88bac0470
title: Video Seedance (giao thức Volcengine Ark)
description: Tạo video Seedance 2.0 và 2.5 qua giao thức tác vụ Volcengine Ark Contents Generations, bao gồm input, poll, thanh toán và media Asset.
aside: false
outline: false
apiReference:
  title: Video Seedance
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Gửi một tác vụ video Seedance. Lần gửi thành công trả về HTTP 200 và id tác vụ SandBase.
  groups:
    - title: Body request
      fields:
        - name: model
          type: string
          required: true
          description: "Định danh model được hỗ trợ: bytedance/seedance/2.0-official hoặc bytedance/seedance/2.5-official."
        - name: content
          type: array
          required: true
          description: Input văn bản có kiểu và input media tùy chọn. Cấu trúc item được model kiểm tra.
        - name: duration
          type: integer
          required: false
          description: Được chuyển tiếp nguyên vẹn tới model. Áp dụng kiểm tra của model.
        - name: resolution
          type: string
          required: false
          description: Được chuyển tiếp nguyên vẹn tới model. Áp dụng kiểm tra của model.
        - name: ratio
          type: string
          required: false
          description: Được chuyển tiếp nguyên vẹn tới model. Áp dụng kiểm tra của model.
        - name: generate_audio
          type: boolean
          required: false
          description: Được chuyển tiếp nguyên vẹn tới model. Yêu cầu tạo audio khi được hỗ trợ.
  examples:
    - label: Text to video
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "bytedance/seedance/2.0-official",
            "content": [{"type": "text", "text": "A paper boat crossing a rain puddle"}],
            "duration": 5,
            "resolution": "720p"
          }'
  response:
    status: 200 OK
    code: '{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }'
---

<ApiReferencePage />

## Hướng dẫn Seedance {#seedance-guide}

Seedance tạo video từ văn bản, khung hình mở đầu và kết thúc, cùng các tham chiếu đa phương thức như ảnh, video và
audio. Bạn có thể dùng nó cho mọi thứ, từ một clip text-to-video đơn giản đến một cảnh quay có đạo diễn bám theo chủ thể hình ảnh, chuyển động
máy quay và nhạc nền.

Quá trình tạo là bất đồng bộ. Gửi một tác vụ, sau đó poll cho đến khi tác vụ đạt trạng thái kết thúc.

## Chọn model {#choosing-a-model}

| `model` | Phù hợp nhất cho | Độ phân giải đầu ra |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | Xuất 1080p và độ phân giải đầu ra cao nhất hiện có | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | Tạo video với chi phí thấp hơn khi 480p hoặc 720p là đủ | 480p, 720p |

Cả hai model đều nhận cùng loại input đa phương thức và hỗ trợ các quy trình text-to-video, image-to-video và tham chiếu đa phương thức
với cùng một cấu trúc request. Chọn `2.0-official` khi 480p hoặc 720p đáp ứng nhu cầu và bạn muốn lựa chọn
giá thấp hơn. Chọn `2.5-official` khi bạn cần 1080p.

## Tài liệu tham khảo API {#api-reference}

| Phương thức | Path |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

Không hỗ trợ liệt kê tác vụ, cũng như hủy hoặc xóa tác vụ. Hãy lưu `id` tác vụ được trả về để lấy kết quả.

Xác thực mọi request bằng cùng API key đã dùng để tạo tác vụ:

```
Authorization: Bearer $SANDBASE_API_KEY
```

Giá trị `model` phải khớp với một trong các tên trong [Chọn model](#choosing-a-model). Poll là cách được hỗ trợ để
nhận kết quả; đừng dựa vào `callback_url` cho endpoint này.

## Bắt đầu nhanh {#quickstart}

Gửi một tác vụ:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "A slow cinematic push across an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "generate_audio": true
  }'
```

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

Poll tác vụ bằng id đó mỗi 5 đến 10 giây cho đến khi `status` là `succeeded`, `failed`, `expired` hoặc `cancelled`:

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.5-official",
  "status": "succeeded",
  "created_at": 1787059000,
  "updated_at": 1787059150,
  "content": { "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4" },
  "usage": { "completion_tokens": 108900, "total_tokens": 108900 }
}
```

Video được tạo có tại `content.video_url`.

## Chọn quy trình input {#choose-an-input-workflow}

API hỗ trợ bảy quy trình input phổ biến. Mỗi item trong `content` có một `type`; tổ hợp các loại item và
role sẽ quyết định quy trình:

| Mục tiêu | Tổ hợp `content` | Dùng khi |
| --- | --- | --- |
| Văn bản thành video | Văn bản | Có thể mô tả cảnh hoàn toàn trong prompt |
| Tạo chuyển động cho khung hình mở đầu | Văn bản (tùy chọn) + ảnh với `first_frame` | Khung hình đầu tiên phải khớp với ảnh được cung cấp |
| Chuyển cảnh giữa hai khung hình | Văn bản (tùy chọn) + `first_frame` + `last_frame` | Cảnh quay cần phần mở đầu và kết thúc được kiểm soát |
| Bám theo tham chiếu hình ảnh | Văn bản (tùy chọn) + ảnh với `reference_image` | Chủ thể, sản phẩm, trang phục hoặc phong cách hình ảnh cần giữ được nét nhận diện |
| Bám theo chuyển động hoặc ngôn ngữ máy quay | Văn bản (tùy chọn) + video với `reference_video` | Chuyển động, nhịp thời gian, nhịp dựng hoặc chuyển động máy quay lấy từ một clip tham chiếu |
| Thêm tham chiếu audio | Văn bản/ảnh/video + audio với `reference_audio` | Lời thoại, nhạc, giọng nói hoặc thiết kế âm thanh cần định hướng kết quả |
| Định hướng đa phương thức đầy đủ | Tham chiếu văn bản + ảnh + video + audio | Các tài nguyên khác nhau kiểm soát hình thức, chuyển động và âm thanh trong cùng một cảnh quay |

Audio không thể đứng riêng. Mọi request có item audio cũng phải có ít nhất một item văn bản, ảnh hoặc video.

### Cấu trúc item content {#content-item-shapes}

```json
{ "type": "text", "text": "A puppy running across a sunlit lawn" }
```

```json
{ "type": "image_url", "image_url": { "url": "https://example.com/ref.jpg" }, "role": "reference_image" }
```

```json
{ "type": "video_url", "video_url": { "url": "https://example.com/ref.mp4" }, "role": "reference_video" }
```

```json
{ "type": "audio_url", "audio_url": { "url": "https://example.com/bgm.mp3" }, "role": "reference_audio" }
```

`role` cho biết model nên dùng tài nguyên như thế nào:

| Tài nguyên | `role` | Tác dụng |
| --- | --- | --- |
| Ảnh | `first_frame` | Dùng ảnh làm khung hình mở đầu |
| Ảnh | `last_frame` | Dùng ảnh làm khung hình kết thúc; cần có `first_frame` trong cùng request |
| Ảnh | `reference_image` | Tham chiếu chủ thể, bố cục, sản phẩm, trang phục hoặc phong cách hình ảnh |
| Video | `reference_video` | Tham chiếu chuyển động, cách quay, nhịp thời gian hoặc nhịp dựng |
| Audio | `reference_audio` | Tham chiếu giọng nói, lời thoại, nhạc hoặc thiết kế âm thanh |

Item ảnh nhận URL công khai hoặc giá trị inline `data:image/...;base64,...`. Tham chiếu video và audio nên
dùng URL công khai mà model có thể tải xuống.

Có bất kỳ item `video_url` nào sẽ đưa request vào chế độ video-to-video, làm thay đổi đơn giá token. Xem
[Thanh toán](#billing).

## Công thức thường dùng {#common-recipes}

Các ví dụ dưới đây là body request. Gửi bất kỳ ví dụ nào tới endpoint tạo tác vụ trong phần [Bắt đầu nhanh](#quickstart).

### Tạo chuyển động cho khung hình đầu tiên {#animate-a-first-frame}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "The woman slowly looks up and smiles as the camera gently pushes in"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 5,
  "generate_audio": true
}
```

### Tạo chuyển cảnh từ khung hình đầu đến khung hình cuối {#create-a-first-to-last-frame-transition}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "A smooth transition from a bright afternoon into a neon-lit night"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"},
    {"type": "image_url", "image_url": {"url": "https://example.com/last-frame.jpg"}, "role": "last_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 6
}
```

### Định hướng cảnh quay bằng tham chiếu ảnh, video và audio {#direct-a-shot-with-image-video-and-audio-references}

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "First-person fruit tea commercial, camera pushes in on the layered foam"},
      {"type": "image_url", "image_url": {"url": "https://example.com/ref.jpg"}, "role": "reference_image"},
      {"type": "video_url", "video_url": {"url": "https://example.com/ref.mp4"}, "role": "reference_video"},
      {"type": "audio_url", "audio_url": {"url": "https://example.com/bgm.mp3"}, "role": "reference_audio"}
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 11
  }'
```

Hãy dùng prompt để giao nhiệm vụ rõ ràng cho từng tham chiếu, ví dụ: “giữ hình thức sản phẩm từ ảnh, dùng
chuyển động máy quay từ video và theo nhịp độ của audio.” Cách này đáng tin cậy hơn việc yêu cầu mọi tài nguyên
cùng kiểm soát toàn bộ kết quả.

## Viết prompt hiệu quả {#writing-an-effective-prompt}

Một prompt thực tế thường theo thứ tự sau:

1. **Chủ thể**: ai hoặc cái gì xuất hiện trong cảnh quay.
2. **Hành động**: cái gì thay đổi hoặc chuyển động.
3. **Bối cảnh**: địa điểm, thời điểm trong ngày, thời tiết và các chi tiết xung quanh.
4. **Phong cách hình ảnh**: điện ảnh, phim tài liệu, quảng cáo sản phẩm, hoạt hình, v.v.
5. **Máy quay**: khung hình, cảm giác ống kính, chuyển động máy quay và các đoạn cắt.
6. **Âm thanh**: lời thoại, âm thanh môi trường, nhạc hoặc hiệu ứng khi bật `generate_audio`.

Hãy nói rõ những gì phải giữ ổn định. Ví dụ: “Nhãn sản phẩm luôn đọc được, máy quay đẩy vào chậm một lần,
không cắt cảnh, âm thanh phòng tự nhiên.” Khi có nhiều tham chiếu, hãy mô tả chất lượng hình ảnh hoặc chuyển động
cần lấy từ mỗi tham chiếu.

## Tùy chọn đầu ra {#output-options}

| Tham số | Kiểu | Mặc định | Giá trị |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`, `720p`, `1080p`. `2.0-official` không hỗ trợ `1080p` |
| `ratio` | string | `adaptive` | `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`, `adaptive`. `adaptive` chọn tỷ lệ dựa trên input và prompt |
| `duration` | integer | `5` | 4 đến 15 giây, hoặc `-1` để model tự chọn trong phạm vi được hỗ trợ |
| `generate_audio` | boolean | `true` | Tạo giọng nói, hiệu ứng âm thanh và nhạc nền đồng bộ |
| `seed` | integer | `-1` | `-1` đến `2^32-1`. Cùng prompt và seed tạo ra kết quả tương tự, không giống hệt |
| `watermark` | boolean | `false` | Thêm watermark AI-generated vào góc dưới bên phải |
| `tools` | array | `[]` | `[{"type": "web_search"}]` bật tìm kiếm web khi lên kế hoạch cảnh quay |

### Kiểm soát tác vụ {#task-control}

| Tham số | Kiểu | Mặc định | Ghi chú |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | Thời gian chờ tác vụ tính bằng giây, từ 3600 đến 259200. Tác vụ vượt quá thời gian này sẽ chuyển thành `expired` |
| `service_tier` | string | `default` | Các model này không hỗ trợ `flex` |
| `safety_identifier` | string | — | Định danh người dùng cuối dạng chuỗi mờ, tối đa 64 ký tự. Hãy gửi giá trị băm, không gửi dữ liệu cá nhân thô |

### Kích thước khung hình {#frame-size}

`resolution` và `ratio` cùng nhau quyết định kích thước pixel:

| Độ phân giải | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## Trạng thái tác vụ {#task-status}

| `status` | Ý nghĩa | Việc cần làm |
| --- | --- | --- |
| `queued` | Đã được chấp nhận, đang chờ bắt đầu | Tiếp tục poll mỗi 5 đến 10 giây |
| `running` | Đang tạo | Tiếp tục poll |
| `succeeded` | Hoàn tất | Tải xuống `content.video_url` |
| `failed` | Bị kiểm duyệt nội dung từ chối hoặc model gặp lỗi | Đọc `error.message`. Điều chỉnh prompt trước khi thử lại |
| `expired` | Chạy quá `execution_expires_after` | Gửi lại |
| `cancelled` | Kết thúc trước khi bắt đầu tạo | Gửi lại |

### Trường của tác vụ {#task-fields}

| Trường | Kiểu | Ghi chú |
| --- | --- | --- |
| `id` | string | id tác vụ được trả về khi gửi |
| `model` | string | Giá trị `model` bạn đã gửi |
| `status` | string | Xem ở trên |
| `created_at` | integer | Giây Unix |
| `updated_at` | integer | Giây Unix. Bằng `created_at` cho đến khi tác vụ kết thúc |
| `content` | object | Rỗng cho đến khi tác vụ thành công. Chứa `video_url` được tạo |
| `usage` | object | Số token. Xem [Thanh toán](#billing) |
| `error` | object | Có mặt với `failed` và `expired`. Chứa `code` và `message` |

### Quy trình Python hoàn chỉnh {#complete-python-flow}

```python
import os
import time

import requests

BASE_URL = "https://api.sandbase.ai/api/v3/contents/generations/tasks"
HEADERS = {
    "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
    "Content-Type": "application/json",
}

task = requests.post(
    BASE_URL,
    headers=HEADERS,
    json={
        "model": "bytedance/seedance/2.5-official",
        "content": [
            {
                "type": "text",
                "text": "A quiet shoreline at sunrise, gentle waves, one slow camera push-in",
            }
        ],
        "ratio": "16:9",
        "resolution": "720p",
        "duration": 5,
        "generate_audio": True,
    },
)
task.raise_for_status()
task_id = task.json()["id"]

while True:
    time.sleep(8)
    result = requests.get(f"{BASE_URL}/{task_id}", headers=HEADERS)
    result.raise_for_status()
    data = result.json()
    print(data["status"])

    if data["status"] == "succeeded":
        print(data["content"]["video_url"])
        break
    if data["status"] in {"failed", "expired", "cancelled"}:
        raise RuntimeError(data.get("error", {"message": data["status"]}))
```

## Thanh toán {#billing}

Các model này tính phí dựa trên `usage.completion_tokens`, được tác vụ báo cáo khi hoàn tất. Đơn giá token phụ thuộc vào hai
yếu tố:

- **Input có chứa video hay không.** Request video-to-video, tức là có bất kỳ item `content` nào thuộc loại `video_url`, được tính
  theo đơn giá thấp hơn text-to-video.
- **Độ phân giải đầu ra.** Với `2.5-official`, 1080p có giá cao hơn 480p và 720p. Đơn giá của `2.0-official` không thay đổi
  theo độ phân giải.

`usage` báo cáo `completion_tokens` và `total_tokens`, hiện hai giá trị này bằng nhau. Trường này rỗng khi tác vụ đang chạy.
Xem [lịch sử tài khoản](/api-reference/account/history) để biết chi phí thực tế, và
[hướng dẫn giá](/guides/billing) để biết đơn giá hiện tại.

## Lỗi {#errors}

Request không hợp lệ trả về lỗi ngay lập tức. Lỗi trong quá trình tạo xuất hiện trong tác vụ khi poll. Cả hai đều dùng
đối tượng `error` với `code` cho máy đọc và `message` cho người đọc:

```json
{ "error": { "code": "InvalidParameter", "message": "model is required", "type": "BadRequest" } }
```

| HTTP | `code` | `type` |
| --- | --- | --- |
| 400 | `InvalidParameter` | `BadRequest` |
| 401 | `AuthenticationError` | `Unauthorized` |
| 403 | `PermissionDenied` | `Forbidden` |
| 404 | `ResourceNotFound` | `NotFound` |
| 429 | `RateLimitExceeded` | `TooManyRequests` |
| 500 | `InternalServiceError` | `InternalServerError` |
| 503 | `InternalServiceError` | `ServiceUnavailable` |

Các bước khắc phục thường gặp:

| Kết quả | Cách thử |
| --- | --- |
| `400 InvalidParameter` | Kiểm tra tên model, nội dung bắt buộc, role, độ phân giải, thời lượng và URL tài nguyên |
| Trạng thái tác vụ `failed` với lỗi kiểm duyệt nội dung | Viết lại prompt hoặc thay tài nguyên tham chiếu bị gắn cờ trước khi gửi lại |
| Trạng thái tác vụ `expired` | Gửi tác vụ mới; cân nhắc tăng `execution_expires_after` cho clip độ phân giải cao hoặc dài |
| `429 RateLimitExceeded` | Thử lại với exponential backoff và giảm số lượng gửi đồng thời |
| `503 ServiceUnavailable` | Thử lại cùng request sau một khoảng ngắn |

## Dùng media Asset đã đăng ký {#use-registered-media-assets}

SandBase cung cấp giao thức Asset tương thích chính thức tại `/v1/assets`. Request Asset và tham chiếu `asset://`
được trả về tuân theo giao thức chính thức, và tham chiếu này được chuyển tiếp nguyên vẹn trong request ByteDance Contents
Generations gốc. Cả
`bytedance/seedance/2.5-official` và `bytedance/seedance/2.0-official` đều nhận tham chiếu đó
ở những chỗ thường nhận URL HTTP(S) công khai.

Quy trình đầy đủ là:

1. Đăng ký một URL media có thể truy cập bằng `POST /v1/assets`.
2. Truy vấn `GET /v1/assets/{external_id}` cho đến khi nhà cung cấp báo Asset đã sẵn sàng sử dụng.
3. Đặt `asset_url` được trả về vào một item `content` của Seedance và gửi tác vụ tạo video.

### Thao tác Asset tương thích chính thức {#official-compatible-asset-operations}

| Phương thức | Path | Mục đích |
| --- | --- | --- |
| `POST` | `/v1/assets` | Đăng ký URL media có thể truy cập và nhận tham chiếu `asset://` tương thích chính thức |
| `GET` | `/v1/assets/{external_id}` | Đọc trạng thái từ nhà cung cấp và lấy URL xem trước/tải xuống hiện tại |

API công khai hiện chỉ cung cấp đăng ký và tra cứu. Nhóm Asset, liệt kê, đổi tên, cập nhật và xóa
không phải là thao tác công khai. Asset thuộc về tổ chức gắn với API key.

### Bước 1: đăng ký Asset {#step-1-register-the-asset}

Gửi URL có thể truy cập tới `POST /v1/assets`. `asset_type` phân biệt chữ hoa chữ thường và phải là `Image`, `Video` hoặc `Audio`:

```bash
curl -X POST https://api.sandbase.ai/v1/assets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/product-reference.png",
    "asset_type": "Image",
    "name": "Product reference"
  }'
```

Lưu `asset_url` từ response:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

Giá trị sau `asset://` là `external_id` được thao tác tra cứu tương thích chính thức sử dụng.

### Bước 2: kiểm tra trạng thái sẵn sàng {#step-2-check-readiness}

Truy vấn Asset bằng `external_id`, không kèm tiền tố `asset://`:

```bash
curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Image",
  "name": "Product reference",
  "download_url": "https://media.example.com/current-signed-url",
  "created_at": "2026-07-10T15:04:03Z"
}
```

Hãy coi `status` là giá trị mở do nhà cung cấp trả về chứ không phải một enum đầy đủ. Chờ đến khi nhà cung cấp báo trạng thái
có thể sử dụng rồi mới gửi tác vụ tạo video; giá trị sẵn sàng thường gặp là `Active`. `download_url` do nhà cung cấp quản lý và
có thể rỗng trong khi đang xử lý. Truy vấn lại Asset khi bạn cần URL xem trước hiện tại. Hãy tiếp tục dùng
`asset_url` cố định trong request Seedance thay vì sao chép `download_url`.

### Bước 3: tạo video với Asset {#step-3-generate-with-the-asset}

Đặt `asset_url` vào trường URL tương ứng với loại media. Ví dụ này dùng ảnh đã đăng ký làm tham chiếu
hình ảnh:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {
        "type": "text",
        "text": "Create a cinematic product shot. Keep the bottle shape and label from the reference image."
      },
      {
        "type": "image_url",
        "image_url": {"url": "asset://asset-20260710150403-hx4hf"},
        "role": "reference_image"
      }
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 5,
    "generate_audio": true
  }'
```

Response tạo tác vụ trả về `id` của tác vụ. Poll
`GET /api/v3/contents/generations/tasks/{task_id}` như mô tả trên trang của model đã chọn.

### Chọn item content và role {#choose-the-content-item-and-role}

| Loại Asset | `content[].type` | Trường URL | Role được hỗ trợ | Dùng cho |
| --- | --- | --- | --- | --- |
| Ảnh | `image_url` | `image_url.url` | `first_frame` | Bắt đầu video từ đúng khung hình này |
| Ảnh | `image_url` | `image_url.url` | `last_frame` | Kết thúc ở khung hình này; cần có `first_frame` trong cùng request |
| Ảnh | `image_url` | `image_url.url` | `reference_image` | Giữ chủ thể, sản phẩm, bố cục, trang phục hoặc phong cách hình ảnh |
| Video | `video_url` | `video_url.url` | `reference_video` | Bám theo chuyển động, nhịp thời gian, cách quay hoặc nhịp dựng |
| Audio | `audio_url` | `audio_url.url` | `reference_audio` | Bám theo giọng nói, lời thoại, nhạc hoặc thiết kế âm thanh |

Audio không thể là input duy nhất. Hãy kết hợp Asset `reference_audio` với văn bản, ảnh hoặc video. Mọi request
có chứa `video_url` đều dùng đơn giá video-to-video.

#### Ví dụ Asset video {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### Ví dụ Asset audio {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### Dùng URL trực tiếp hay tham chiếu `asset://`? {#direct-url-or-asset-reference}

| Input | Phù hợp nhất khi | Đánh đổi |
| --- | --- | --- |
| URL HTTP(S) công khai | Media đã được lưu trữ sẵn và chỉ dùng một lần | Cách nhanh nhất, nhưng URL phải truy cập được trong suốt quá trình gửi tác vụ và khi nhà cung cấp tải về |
| Tham chiếu `asset://` | Media được dùng lại qua giao thức Asset chính thức | Thêm một bước đăng ký/kiểm tra sẵn sàng, sau đó cung cấp tham chiếu cố định cho các tác vụ Seedance sau này |

Về tham số request, poll, trạng thái tác vụ và thanh toán, hãy xem [Hướng dẫn Seedance](#seedance-guide) ở trên.

## Tài nguyên chính thức của ByteDance {#official-bytedance-resources}
- [Tài liệu tạo video Seedance](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [API tạo tác vụ contents generation](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Hướng dẫn viết prompt cho Seedance 2.0](https://www.volcengine.com/docs/82379/2222480?lang=en)
