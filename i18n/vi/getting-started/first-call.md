---
i18nSource: 0ca53876f04eb96d
title: Lệnh gọi API đầu tiên
description: Hướng dẫn chi tiết cách thực hiện lệnh gọi SandBase API đầu tiên, hiểu cấu trúc request, cấu trúc response và streaming.
---

# Lệnh gọi API đầu tiên {#first-api-call}

Hướng dẫn này đi qua chi tiết cấu trúc của một request và response SandBase API. Khi hoàn thành, bạn sẽ hiểu mọi trường trong body của request, cách đọc response và cách dùng streaming.

## Trước khi bắt đầu {#before-you-start}

Bạn cần một tổ chức SandBase đang hoạt động, một [API key](/getting-started/api-keys) và một model ID từ [catalog Models](https://www.sandbase.ai/models). Hãy export key để các ví dụ không đặt secret trong mã nguồn:

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

Hãy bắt đầu với request không streaming. Khi xác thực và xử lý response đã hoạt động, hãy thêm streaming và cơ chế thử lại cho production.

## Cấu trúc request {#request-anatomy}

Hướng dẫn này dùng route Chat Completions tương thích OpenAI:

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### Header bắt buộc {#required-headers}

| Header | Giá trị | Mô tả |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | SandBase API key của bạn |
| `Content-Type` | `application/json` | Định dạng body của request |

### Body của request {#request-body}

```json
{
  "model": "deepseek/deepseek-v4-flash",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"}
  ],
  "temperature": 0.7,
  "max_tokens": 256
}
```

### Tham số trong body {#body-parameters}

| Tham số | Kiểu | Bắt buộc | Mô tả |
|-----------|------|----------|-------------|
| `model` | string | Có | Model ID đang bật được trả về bởi `GET /v1/models` (ví dụ `deepseek/deepseek-v4-flash`) |
| `messages` | array | Có | Lịch sử hội thoại dưới dạng mảng các đối tượng message |
| `temperature` | number | Không | Nhiệt độ lấy mẫu (0–2). Khả năng hỗ trợ và giá trị mặc định có thể khác nhau tùy model. |
| `max_tokens` | integer | Không | Số token tối đa được sinh trong response |
| `top_p` | number | Không | Tham số nucleus sampling (0–1) |
| `stream` | boolean | Không | Có stream response hay không. Mặc định: `false` |
| `stop` | string or array | Không | Chuỗi dừng: quá trình sinh dừng lại khi gặp các chuỗi này |
| `frequency_penalty` | number | Không | Hình phạt lặp lại tương thích với nhà cung cấp, khi được hỗ trợ |
| `presence_penalty` | number | Không | Hình phạt xuất hiện tương thích với nhà cung cấp, khi được hỗ trợ |

### Vai trò của message {#message-roles}

| Vai trò | Mục đích |
|------|---------|
| `system` | Thiết lập hành vi và tính cách của assistant |
| `user` | Input của người dùng |
| `assistant` | Các response trước đó của assistant (cho hội thoại nhiều lượt) |
| `developer`, `tool` | Các vai trò bổ sung tương thích OpenAI khi model và route được chọn hỗ trợ |

## Ví dụ request đầy đủ {#full-request-example}

::: code-group

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

response = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ],
    temperature=0.7,
    max_tokens=256
)

print(response.choices[0].message.content)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
  temperature: 0.7,
  max_tokens: 256,
});

console.log(response.choices[0].message.content);
```

:::

## Cấu trúc response {#response-structure}

### Response không streaming điển hình {#typical-non-streaming-response}

```json
{
  "id": "chatcmpl-abc123def456",
  "object": "chat.completion",
  "created": 1719000000,
  "model": "deepseek/deepseek-v4-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 8,
    "total_tokens": 32
  }
}
```

### Giải thích các trường của response {#response-fields-explained}

| Trường | Mô tả |
|-------|-------------|
| `id` | Định danh duy nhất của completion này |
| `object` | Đối tượng response tương thích OpenAI, thường là `"chat.completion"` trên route này |
| `created` | Unix timestamp của thời điểm sinh response |
| `model` | Model đã sinh response |
| `choices` | Mảng các lựa chọn completion (thường chỉ có một) |
| `choices[].index` | Chỉ số của lựa chọn này trong mảng |
| `choices[].message.role` | Vai trò trả về cho message được sinh, thường là `"assistant"` |
| `choices[].message.content` | Văn bản được sinh |
| `choices[].finish_reason` | Lý do quá trình sinh dừng lại (xem bên dưới) |
| `usage.prompt_tokens` | Số token trong input của bạn |
| `usage.completion_tokens` | Số token trong output được sinh |
| `usage.total_tokens` | Tổng số token prompt + completion |

### Lý do kết thúc {#finish-reasons}

Lý do kết thúc phụ thuộc vào nhà cung cấp. Các giá trị tương thích OpenAI phổ biến gồm:

| Giá trị | Ý nghĩa thường gặp |
|-------|---------|
| `stop` | Response kết thúc tự nhiên hoặc gặp chuỗi dừng |
| `length` | Chạm giới hạn `max_tokens`, response đã bị cắt ngắn |

Hãy coi các giá trị chưa biết là output hợp lệ của nhà cung cấp thay vì từ chối response.

## Response dạng streaming {#streaming-responses}

Để có output theo thời gian thực (như chatbot đang gõ), hãy dùng streaming. Response được gửi về dưới dạng Server-Sent Events (SSE):

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Write a haiku about coding."}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()  # newline at the end
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Write a haiku about coding.' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}
console.log();
```

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -N \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Write a haiku about coding."}],
    "stream": true
  }'
```

:::

### Định dạng SSE khi streaming {#streaming-sse-format}

Một stream tương thích thường phát ra các Server-Sent Events như sau:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

Điểm chính:

- xử lý các chunk theo đúng thứ tự và nối các mảnh `delta.content`
- chấp nhận các chunk chỉ chứa metadata, delta rỗng và các trường tương thích nhà cung cấp mà bạn không nhận ra
- dừng khi stream đóng hoặc nhận được dấu kết thúc; Chat Completions thường dùng `data: [DONE]`
- không giả định mọi model đều phát chunk đầu tiên hoặc cuối cùng có cùng cấu trúc

## Dùng Anthropic SDK {#using-the-anthropic-sdk}

SandBase cũng cung cấp endpoint tương thích Anthropic tại `POST /v1/messages`. Dùng Anthropic SDK bằng cách thay đổi `base_url`:

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

message = client.messages.create(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)
print(message.content[0].text)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai',
});

const message = await client.messages.create({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'What is the capital of France?' }],
});
console.log(message.content[0].text);
```

:::

### Cấu trúc response của Anthropic {#anthropic-response-structure}

Endpoint tương thích Anthropic trả về response theo kiểu Anthropic. Một response văn bản điển hình trông như sau:

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The capital of France is Paris."
    }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 14,
    "output_tokens": 8
  }
}
```

| Trường | Mô tả |
|-------|-------------|
| `id` | ID của message (có tiền tố `msg_`) |
| `type` | Kiểu đối tượng message, thường là `"message"` |
| `role` | Vai trò của message được sinh, thường là `"assistant"` |
| `content` | Mảng các content block có kiểu; đừng giả định mọi block đều là văn bản |
| `model` | Model đã sinh response |
| `stop_reason` | `"end_turn"` (dừng tự nhiên), `"max_tokens"` (chạm giới hạn) hoặc `"stop_sequence"` |
| `usage.input_tokens` | Số token trong input của bạn |
| `usage.output_tokens` | Số token trong output được sinh |

### Streaming với Anthropic {#anthropic-streaming}

Streaming với Anthropic SDK hoạt động tương tự, chỉ cần truyền `stream=True`:

```python
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about coding."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()
```

## Chọn model {#choosing-a-model}

Khi chọn model, hãy xem model card trực tiếp của nó để biết tình trạng khả dụng, giá, độ dài ngữ cảnh, loại input được hỗ trợ và các khả năng. Các giá trị này thay đổi độc lập với nhau, vì vậy đừng dựa vào bảng so sánh model được sao chép lại.

- Duyệt [catalog Models](https://www.sandbase.ai/models) hiện tại.
- Mở trang của model trong catalog để xem các trường request riêng của model đó.
- Gọi `GET /v1/models` khi tích hợp cần lấy metadata model hiện tại bằng code.

Với các model dùng chung giao diện tương thích, việc chuyển đổi thường bắt đầu bằng tham số `model`. Hãy kiểm tra lại khả năng và schema của model được chọn trước khi giữ lại các trường tùy chọn, công cụ, input media hoặc thiết lập structured output.

## Bước tiếp theo {#next-steps}

Trước khi lên production, hãy đặt timeout cho request, chỉ thử lại các lỗi tạm thời với exponential backoff có giới hạn, ghi log request ID khi có và theo dõi mức sử dụng mà không ghi log prompt hay API key.

- [**Tài liệu tham chiếu API**](/api-reference/): endpoint suy luận và hợp đồng Platform API
- [**Hướng dẫn streaming**](/guides/streaming): các mẫu streaming nâng cao và xử lý lỗi
- [**Models**](https://www.sandbase.ai/models): khám phá model, khả năng và giá hiện tại
- [**Lỗi**](/guides/error-handling): xử lý lỗi và thử lại
