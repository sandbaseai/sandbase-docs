---
i18nSource: b95a8cd6f82c3a9a
title: Model & Giá cho AI đọc
description: Tìm các model SandBase hiện có, khả năng, schema và giá qua Models API.
---

# Model & Giá {#models-pricing}

Mọi model đều truy cập được bằng một SandBase API key. Tính khả dụng, schema, khả năng, giới hạn context
và giá của model có thể thay đổi độc lập.

::: info Dùng metadata model trực tiếp
Luôn dùng `GET /v1/models` và `GET /v1/models/{id_or_name}` để có dữ liệu hiện tại và chính xác. Đừng suy ra rằng mọi
LLM đều hỗ trợ streaming, vision, tools, structured output hay caching, và đừng sao chép trường input hoặc
giá của model này sang model khác.
:::

## Phản hồi danh mục và chi tiết {#catalog-and-detail-responses}

`GET /v1/models` trả về các bản ghi định danh tương thích OpenAI chứa `id`, `object`, `created` và `owned_by`.
Nó cố ý bỏ qua metadata về khả năng, schema và giá của SandBase.

`GET /v1/models/{id_or_name}` bổ sung `unified_schema`, `supported_modes` và `model_card`. Đọc giá chi tiết từ
`model_card`; không có object `pricing` ở cấp cao nhất. Hãy coi `capability_tags`, `supported_modes` và
`unified_schema` là riêng cho từng model.

## Tìm model {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Endpoint danh sách hỗ trợ `q`, `vendor`, `type` và `order`; nó không phân trang và mặc định là `type=llm`.
Nó trả về các mục tương thích OpenAI với `id`, `object`, `created` và `owned_by`. Dùng `id` được trả về làm
tên model khi yêu cầu chi tiết hoặc gọi model.

Với mọi phản hồi bất đồng bộ `202`, hãy poll `GET /v1/run/{id}` bằng ID được trả về. Hãy coi ID là giá trị không trong suốt; đừng
suy đoán định dạng của nó hay tự dựng đường dẫn polling khác từ tiền tố ID hoặc header tương thích.

## Kiểm tra một model {#inspect-one-model}

Tên model có kèm vendor và có thể chứa `/`:

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Trước khi thực thi, hãy kiểm tra:

- `enabled` và `execution_mode`
- `capability_tags` và `supported_modes`
- `unified_schema` để biết các trường request được chấp nhận
- `model_card` để biết công thức giá hiện tại và hệ số token hoặc cache

## Kiểm tra chi phí thực tế của tác vụ {#check-actual-task-cost}

Với tác vụ đã hoàn tất hoặc đang chạy, hãy truy vấn chi phí đã ghi nhận thay vì tự tính lại từ một bảng đã cũ:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Xem [tài liệu tham khảo Models API](/api-reference/models/) để biết hợp đồng phản hồi và
[Hướng dẫn lỗi](/for-agents/errors) để biết cấu trúc phản hồi và hướng dẫn thử lại.
