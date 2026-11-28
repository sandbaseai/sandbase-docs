---
i18nSource: 335b45fb98c53890
title: 스트리밍 응답
description: OpenAI 또는 Anthropic 호환 SDK로 SandBase 모델 출력을 스트리밍하고 부분 결과를 안전하게 처리합니다.
---

# 스트리밍 응답 {#streaming-responses}

스트리밍은 모델 출력이 생성되는 대로 반환합니다. SandBase는 호출하는 호환 API의 이벤트 형식을
그대로 유지합니다. OpenAI Chat Completions는 data 전용 Server-Sent Events(SSE)를 사용하고, Anthropic Messages는 이름이 지정된 SSE 이벤트를 사용합니다.

가능하면 공식 호환 SDK를 사용하세요. SDK는 이벤트 프레이밍, 점진적인 도구 호출 인수, 프로토콜
종료를 원시 응답 텍스트를 직접 분할하는 것보다 안전하게 처리합니다.

## OpenAI Chat Completions {#openai-chat-completions}

`POST /v1/chat/completions`에 `stream: true`를 설정합니다.

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

OpenAI 호환 청크는 점진적인 텍스트를 `choices[0].delta.content`에 담습니다. 선택한 모델이 지원하는 경우 도구 호출 인수는
`delta.tool_calls`에 문자열 조각으로 전달됩니다. 완성된 JSON을 파싱하기 전에 choice와 도구 호출
인덱스별로 조각을 이어 붙이세요. 스트림은 일반적으로 `data: [DONE]`으로 끝납니다.

모든 공급자가 스트림에서 토큰 사용량을 반환한다고 가정하지 마세요. 선택한 모델이 OpenAI의
`stream_options.include_usage`를 지원하면 사용량이 끝부분에 나타날 수 있습니다. 그렇지 않으면 비스트리밍 응답이나
해당하는 작업 비용 흐름을 사용하세요.

## Anthropic Messages {#anthropic-messages}

`POST /v1/messages`에는 Anthropic SDK를 사용합니다. SDK의 스트림 헬퍼가 이름이 지정된 이벤트와 콘텐츠 블록을 조합합니다.

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

원시 Anthropic 스트림은 `message_start`, `content_block_start`, `content_block_delta`,
`content_block_stop`, `message_delta`, `message_stop` 같은 이벤트 이름을 사용합니다. 텍스트는 `text_delta` 블록에 담깁니다. 도구 입력은
점진적인 JSON 블록을 사용하므로 파싱하기 전에 조합해야 합니다.

## 중단 및 취소 처리 {#handle-interruption-and-cancellation}

스트리밍이 시작되기 전에 반환된 HTTP 오류는 엔드포인트의 일반 오류 본문을 사용합니다. 응답이 시작된 후에는
네트워크 장애로 최종 이벤트 없이 부분 텍스트만 남을 수 있습니다. 프로토콜의
정상 종료 신호를 받은 후에만 출력이 완료된 것으로 취급하세요.

- 부분 출력은 확정된 애플리케이션 상태와 분리해 보관합니다.
- 워크로드에 맞게 자체 클라이언트나 프록시에서 연결 및 비활성 타임아웃을 제한합니다.
- 사용자가 생성을 중지하면 SDK의 취소 메커니즘이나 JavaScript의 `AbortController`를 사용합니다.
- 재시도한 스트림을 부분 출력에 자동으로 덧붙이지 마세요. 재시도는 새로운 생성입니다.
- 직접 관리하는 리버스 프록시에서는 SSE 버퍼링을 피합니다.

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

원시 SSE를 읽을 때는 빈 줄로 구분된 완전한 이벤트 프레임을 파싱하세요. 네트워크 청크는 SSE 이벤트와
일대일로 대응하지 않으며, UTF-8 문자 하나가 여러 청크에 걸칠 수 있습니다. 스트리밍 텍스트 디코더를 사용하고, 더 많은 바이트가 도착할 때까지
불완전한 프레임을 보관하세요.

## 관련 가이드 {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [오류 처리](/guides/error-handling)
- [속도 제한](/guides/rate-limiting)
