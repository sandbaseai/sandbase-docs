---
i18nSource: 8c960d117a998817
title: Model ảnh và video
description: Dùng Run API dùng chung của SandBase để tạo ảnh và video bất đồng bộ.
---

# Model ảnh và video {#image-and-video-models}

Model ảnh và video dùng Run API bất đồng bộ dùng chung của SandBase. Gửi một tác vụ
bằng `POST /v1/run`, rồi poll `GET /v1/run/{id}` cho đến khi run đạt
trạng thái kết thúc.

## Gửi tác vụ {#submit-a-task}

Dùng đúng model ID từ [Model ảnh và video](https://www.sandbase.ai/models/image-video). Các trường
request còn lại phụ thuộc vào từng model; hãy mở tài liệu API của model để biết
các input bắt buộc và giới hạn.

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

Phản hồi gồm một `id` không trong suốt và một `status` như `pending` hoặc
`running`.

## Poll để lấy kết quả {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Tiếp tục poll cho đến khi `status` là `completed`, `failed` hoặc `timeout`. Run đã hoàn tất
chứa output theo từng khả năng, chẳng hạn URL ảnh hoặc video. Hãy giữ
run ID và coi phản hồi của run là nguồn trạng thái chính xác.

## Webhook callback {#webhook-callbacks}

Các tác vụ bất đồng bộ được hỗ trợ cũng có thể đặt `webhook_url` trong request gửi đi.
Callback chỉ là tín hiệu giao kết quả, không thay thế polling; hãy tiếp tục
dùng `GET /v1/run/{id}` và xử lý an toàn các callback trùng lặp hoặc bị trễ. Xem
[Chạy một khả năng](/api-reference/models/run#webhook-callbacks) để biết hợp đồng
callback chung.

## Khả năng API dùng đường dẫn suy ra từ URL {#api-capabilities-use-a-url-derived-path}

Run API dùng chung dành cho việc tạo nội dung bằng model. Các khả năng API từ
[danh mục APIs](https://www.sandbase.ai/apis) dùng
một route khác suy ra từ URL: `GET` hoặc `POST /v1/api/{vendor}/{upstream_path}`.
Tên khả năng có kèm vendor lấy từ Models API hoặc danh mục APIs, nên có thể
bỏ qua trường `model` trong body POST:

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Route này dành cho khả năng API, không thay thế `/v1/run` khi
gọi model ảnh hoặc video. Nếu khả năng API được chọn là bất đồng bộ,
hãy poll run ID được trả về bằng `GET /v1/run/{id}`.

## Bước tiếp theo {#next-steps}

- [Model ảnh và video](https://www.sandbase.ai/models/image-video)
- [Chạy một khả năng](/api-reference/models/run)
- [Lấy kết quả run](/api-reference/models/run-get)
- [API Passthrough](/api-reference/models/api-passthrough)
