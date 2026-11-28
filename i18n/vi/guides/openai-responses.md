---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: Dùng Responses API tương thích OpenAI với các model GPT qua SandBase.
---

# OpenAI Responses {#openai-responses}

Các model GPT hỗ trợ Responses API tương thích OpenAI tại `POST /v1/responses`.
Dùng `input` cho prompt hoặc nội dung có cấu trúc và đọc các item được tạo từ
`output`.

```bash
curl https://api.sandbase.ai/v1/responses \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/<gpt-model>",
    "input": "Explain immutable infrastructure in one sentence."
  }'
```

## Tương thích với Chat Completions {#chat-completions-compatibility}

Các model GPT này cũng hỗ trợ `POST /v1/chat/completions`. Giao thức đó
dùng `messages` trong request và `choices` trong response, còn Responses
dùng `input` và `output`. Cấu trúc tham số của hai giao thức không thể dùng thay thế cho nhau;
hãy chọn endpoint phù hợp với SDK của bạn.

Xem [Chat Completions](./chat-completions) để biết định dạng request tương thích
và [tài liệu tham chiếu model GPT](https://www.sandbase.ai/models) để biết
các trường và giới hạn riêng của từng model.

## Bước tiếp theo {#next-steps}

- [Tham chiếu Responses API](/api-reference/responses)
- [Tham chiếu Chat Completions API](/api-reference/llm-gateway)
- [Danh mục Models](https://www.sandbase.ai/models)
