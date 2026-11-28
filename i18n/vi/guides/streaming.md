---
i18nSource: 335b45fb98c53890
title: Response dạng streaming
description: Stream output của model SandBase bằng SDK tương thích OpenAI hoặc Anthropic và xử lý kết quả từng phần một cách an toàn.
---

# Response dạng streaming {#streaming-responses}

Streaming trả về output của model ngay khi có. SandBase giữ nguyên định dạng event của API tương thích mà bạn
gọi: OpenAI Chat Completions dùng Server-Sent Events (SSE) chỉ có trường data, còn Anthropic Messages dùng SSE event có tên.

Hãy dùng SDK tương thích chính thức khi có thể. SDK xử lý việc đóng khung event, đối số tool call tăng dần và tín hiệu kết thúc
giao thức an toàn hơn so với việc bạn tự tách văn bản response thô.

## OpenAI Chat Completions {#openai-chat-completions}

Đặt `stream: true` trên `POST /v1/chat/completions`.

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
    stream=True,
)

for chunk in stream:
    text = chunk.choices[0].delta.content
    if text:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
  stream: true,
});

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content;
  if (text) process.stdout.write(text);
}
```

```bash [cURL]
curl -N https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Explain quantum computing briefly."}],
    "stream": true
  }'
```

:::

Các chunk tương thích OpenAI đặt văn bản tăng dần trong `choices[0].delta.content`. Đối số tool call, khi model được chọn
hỗ trợ, được gửi dưới dạng các mảnh chuỗi trong `delta.tool_calls`; hãy nối các mảnh theo chỉ số choice và tool call
trước khi parse JSON hoàn chỉnh. Stream thường kết thúc bằng `data: [DONE]`.

Đừng giả định mọi nhà cung cấp đều trả về mức sử dụng token trong stream. Nếu model được chọn hỗ trợ
`stream_options.include_usage` của OpenAI, mức sử dụng có thể xuất hiện gần cuối; nếu không, hãy dùng response không streaming hoặc
luồng tính chi phí tác vụ phù hợp.

## Anthropic Messages {#anthropic-messages}

Dùng Anthropic SDK với `POST /v1/messages`. Hàm hỗ trợ stream của SDK sẽ ghép các event có tên và content block.

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key=os.environ["SANDBASE_API_KEY"],
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = client.messages.stream({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
});

stream.on('text', (text) => process.stdout.write(text));
await stream.finalMessage();
```

:::

Stream Anthropic thô dùng các tên event như `message_start`, `content_block_start`, `content_block_delta`,
`content_block_stop`, `message_delta` và `message_stop`. Văn bản được truyền trong các block `text_delta`. Input của công cụ dùng
các block JSON tăng dần và phải được ghép lại trước khi parse.

## Xử lý gián đoạn và hủy {#handle-interruption-and-cancellation}

Lỗi HTTP trả về trước khi streaming bắt đầu dùng body lỗi thông thường của endpoint. Sau khi response đã bắt đầu,
lỗi mạng có thể để lại văn bản dở dang mà không có event cuối cùng. Chỉ coi output là hoàn chỉnh sau khi nhận được
tín hiệu kết thúc bình thường của giao thức.

- Tách output dở dang khỏi trạng thái đã ghi nhận của ứng dụng.
- Giới hạn timeout kết nối và timeout không hoạt động trong client hoặc proxy của bạn tùy theo khối lượng công việc.
- Dùng cơ chế hủy của SDK hoặc `AbortController` trong JavaScript khi người dùng dừng quá trình sinh.
- Không tự động nối stream thử lại vào output dở dang; mỗi lần thử lại là một lần sinh mới.
- Tránh buffer SSE trong các reverse proxy mà bạn kiểm soát.

```javascript
const controller = new AbortController();

const response = await fetch('https://api.sandbase.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek/deepseek-v4-flash',
    messages: [{ role: 'user', content: 'Write a short story.' }],
    stream: true,
  }),
  signal: controller.signal,
});

// Call controller.abort() when the user cancels.
```

Khi đọc SSE thô, hãy parse các khung event hoàn chỉnh được phân tách bằng dòng trống. Chunk mạng không tương ứng một-một
với SSE event, và một ký tự UTF-8 có thể nằm vắt qua nhiều chunk. Hãy dùng bộ giải mã văn bản dạng stream và giữ lại khung chưa hoàn chỉnh
cho đến khi có thêm byte.

## Hướng dẫn liên quan {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [Xử lý lỗi](/guides/error-handling)
- [Giới hạn tốc độ](/guides/rate-limiting)
