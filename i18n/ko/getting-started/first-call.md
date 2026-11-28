---
i18nSource: 0ca53876f04eb96d
title: 첫 API 호출
description: 첫 SandBase API 호출을 단계별로 안내하고, 요청 구성, 응답 구조, 스트리밍을 설명합니다.
---

# 첫 API 호출 {#first-api-call}

이 가이드에서는 SandBase API 요청과 응답의 구성을 자세히 살펴봅니다. 끝까지 읽으면 요청 본문의 모든 필드, 응답을 읽는 방법, 스트리밍 사용법을 이해할 수 있습니다.

## 시작하기 전에 {#before-you-start}

활성 SandBase 조직, [API 키](/getting-started/api-keys), [모델 카탈로그](https://www.sandbase.ai/models)의 모델 ID가 필요합니다. 예시 코드에 시크릿이 들어가지 않도록 키를 환경 변수로 내보내세요.

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

먼저 비스트리밍 요청부터 시작하세요. 인증과 응답 처리가 동작하면 스트리밍과 프로덕션용 재시도 동작을 추가합니다.

## 요청 구성 {#request-anatomy}

이 안내에서는 OpenAI 호환 Chat Completions 경로를 사용합니다.

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### 필수 헤더 {#required-headers}

| 헤더 | 값 | 설명 |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | SandBase API 키 |
| `Content-Type` | `application/json` | 요청 본문 형식 |

### 요청 본문 {#request-body}

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

### 본문 매개변수 {#body-parameters}

| 매개변수 | 타입 | 필수 | 설명 |
|-----------|------|----------|-------------|
| `model` | string | 예 | `GET /v1/models`가 반환하는 활성화된 모델 ID(예: `deepseek/deepseek-v4-flash`) |
| `messages` | array | 예 | 메시지 객체 배열로 표현한 대화 기록 |
| `temperature` | number | 아니요 | 샘플링 temperature(0–2). 지원 여부와 기본값은 모델마다 다를 수 있습니다. |
| `max_tokens` | integer | 아니요 | 응답에서 생성할 최대 토큰 수 |
| `top_p` | number | 아니요 | Nucleus 샘플링 매개변수(0–1) |
| `stream` | boolean | 아니요 | 응답 스트리밍 여부. 기본값: `false` |
| `stop` | string or array | 아니요 | 중지 시퀀스. 이 시퀀스가 나타나면 생성이 중지됩니다 |
| `frequency_penalty` | number | 아니요 | 지원되는 경우 공급자 호환 반복 페널티 |
| `presence_penalty` | number | 아니요 | 지원되는 경우 공급자 호환 presence 페널티 |

### 메시지 역할 {#message-roles}

| 역할 | 용도 |
|------|---------|
| `system` | 어시스턴트의 동작과 성격을 설정합니다 |
| `user` | 사용자의 입력 |
| `assistant` | 이전 어시스턴트 응답(멀티턴 대화용) |
| `developer`, `tool` | 선택한 모델과 경로가 지원하는 경우 사용할 수 있는 추가 OpenAI 호환 역할 |

## 전체 요청 예시 {#full-request-example}

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

## 응답 구조 {#response-structure}

### 일반적인 비스트리밍 응답 {#typical-non-streaming-response}

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

### 응답 필드 설명 {#response-fields-explained}

| 필드 | 설명 |
|-------|-------------|
| `id` | 이 completion의 고유 식별자 |
| `object` | OpenAI 호환 응답 객체. 이 경로에서는 일반적으로 `"chat.completion"` |
| `created` | 응답이 생성된 시각의 Unix 타임스탬프 |
| `model` | 응답을 생성한 모델 |
| `choices` | completion choice 배열(일반적으로 하나) |
| `choices[].index` | 배열에서 이 choice의 인덱스 |
| `choices[].message.role` | 생성된 메시지의 역할. 일반적으로 `"assistant"` |
| `choices[].message.content` | 생성된 텍스트 |
| `choices[].finish_reason` | 생성이 중지된 이유(아래 참고) |
| `usage.prompt_tokens` | 입력 토큰 수 |
| `usage.completion_tokens` | 생성된 출력 토큰 수 |
| `usage.total_tokens` | prompt + completion 토큰 합계 |

### 종료 이유 {#finish-reasons}

종료 이유는 공급자에 따라 다릅니다. 일반적인 OpenAI 호환 값은 다음과 같습니다.

| 값 | 일반적인 의미 |
|-------|---------|
| `stop` | 응답이 자연스럽게 끝났거나 중지 시퀀스에 도달함 |
| `length` | `max_tokens` 한도에 도달해 응답이 잘림 |

알 수 없는 값은 응답을 거부하지 말고 유효한 공급자 출력으로 취급하세요.

## 스트리밍 응답 {#streaming-responses}

챗봇이 타이핑하듯 실시간으로 출력하려면 스트리밍을 사용합니다. 응답은 Server-Sent Events(SSE)로 전달됩니다.

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

### 스트리밍 SSE 형식 {#streaming-sse-format}

호환 스트림은 일반적으로 다음과 같은 Server-Sent Events를 내보냅니다.

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

핵심 사항:

- 청크를 순서대로 처리하고 `delta.content` 조각을 이어 붙입니다
- 메타데이터만 있는 청크, 빈 delta, 알 수 없는 공급자 호환 필드를 허용합니다
- 스트림이 닫히거나 종료 표시가 도착하면 중지합니다. Chat Completions는 일반적으로 `data: [DONE]`을 사용합니다
- 모든 모델이 정확히 같은 형태의 첫 청크나 마지막 청크를 내보낸다고 가정하지 않습니다

## Anthropic SDK 사용 {#using-the-anthropic-sdk}

SandBase는 `POST /v1/messages`에서 Anthropic 호환 엔드포인트도 제공합니다. `base_url`만 바꾸면 Anthropic SDK를 사용할 수 있습니다.

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

### Anthropic 응답 구조 {#anthropic-response-structure}

Anthropic 호환 엔드포인트는 Anthropic 스타일 응답을 반환합니다. 일반적인 텍스트 응답은 다음과 같습니다.

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

| 필드 | 설명 |
|-------|-------------|
| `id` | 메시지 ID(`msg_` 접두사) |
| `type` | 메시지 객체 타입. 일반적으로 `"message"` |
| `role` | 생성된 메시지의 역할. 일반적으로 `"assistant"` |
| `content` | 타입이 지정된 콘텐츠 블록 배열. 모든 블록이 텍스트라고 가정하지 마세요 |
| `model` | 응답을 생성한 모델 |
| `stop_reason` | `"end_turn"`(자연스러운 종료), `"max_tokens"`(한도 도달) 또는 `"stop_sequence"` |
| `usage.input_tokens` | 입력 토큰 수 |
| `usage.output_tokens` | 생성된 출력 토큰 수 |

### Anthropic 스트리밍 {#anthropic-streaming}

Anthropic SDK의 스트리밍도 같은 방식으로 동작합니다. `stream=True`만 전달하면 됩니다.

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

## 모델 선택 {#choosing-a-model}

모델을 선택할 때는 실시간 모델 카드에서 가용성, 가격, 컨텍스트 길이, 지원 입력, 기능을 확인하세요. 이 값들은 각각 독립적으로 바뀌므로, 복사해 둔 모델 비교표에 의존하지 마세요.

- 최신 [모델 카탈로그](https://www.sandbase.ai/models)를 둘러봅니다.
- 카탈로그에서 모델 페이지를 열어 모델별 요청 필드를 확인합니다.
- 연동에서 최신 모델 메타데이터가 프로그래밍 방식으로 필요하면 `GET /v1/models`를 조회합니다.

같은 호환 인터페이스를 공유하는 모델 간에는 보통 `model` 매개변수만 바꾸면 전환할 수 있습니다. 선택적 필드, 도구, 미디어 입력, 구조화된 출력 설정을 그대로 가져가기 전에 선택한 모델의 기능과 스키마를 다시 확인하세요.

## 다음 단계 {#next-steps}

프로덕션 전에 요청 타임아웃을 설정하고, 일시적인 실패만 횟수가 제한된 지수 백오프로 재시도하고, 가능하면 요청 ID를 기록하고, 프롬프트나 API 키를 로그에 남기지 않고 사용량을 모니터링하세요.

- [**API 레퍼런스**](/api-reference/): 추론 엔드포인트와 Platform API 계약
- [**스트리밍 가이드**](/guides/streaming): 고급 스트리밍 패턴과 오류 처리
- [**모델**](https://www.sandbase.ai/models): 모델 탐색, 기능, 최신 가격
- [**오류**](/guides/error-handling): 실패 및 재시도 처리
