---
i18nSource: 0ca53876f04eb96d
title: पहला API call
description: अपना पहला SandBase API call करने, request की संरचना, response की संरचना और streaming को समझने का विस्तृत walkthrough।
---

# पहला API call {#first-api-call}

यह guide SandBase API request और response की संरचना को विस्तार से समझाती है। अंत तक, आप request body के हर field को, response पढ़ने के तरीके को, और streaming इस्तेमाल करने के तरीके को समझ जाएँगे।

## शुरू करने से पहले {#before-you-start}

आपको एक active SandBase organization, एक [API key](/getting-started/api-keys), और [Models catalog](https://www.sandbase.ai/models) से एक model ID चाहिए। Key को export करें ताकि उदाहरणों में secrets source code में न आएँ:

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

Non-streaming request से शुरू करें। Authentication और response handling के काम करने के बाद, streaming और production retry व्यवहार जोड़ें।

## Request की संरचना {#request-anatomy}

यह walkthrough OpenAI-compatible Chat Completions route इस्तेमाल करता है:

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### ज़रूरी headers {#required-headers}

| Header | मान | विवरण |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | आपकी SandBase API key |
| `Content-Type` | `application/json` | Request body का format |

### अनुरोध बॉडी {#request-body}

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

### बॉडी पैरामीटर {#body-parameters}

| Parameter | Type | ज़रूरी | विवरण |
|-----------|------|----------|-------------|
| `model` | string | हाँ | `GET /v1/models` द्वारा लौटाया गया एक enabled model ID (उदाहरण के लिए, `deepseek/deepseek-v4-flash`) |
| `messages` | array | हाँ | message objects के array के रूप में बातचीत का इतिहास |
| `temperature` | number | नहीं | Sampling temperature (0–2)। समर्थन और default मान model के अनुसार बदल सकते हैं। |
| `max_tokens` | integer | नहीं | Response में generate होने वाले अधिकतम tokens |
| `top_p` | number | नहीं | Nucleus sampling parameter (0–1) |
| `stream` | boolean | नहीं | Response को stream करना है या नहीं। Default: `false` |
| `stop` | string या array | नहीं | Stop sequences — इनके मिलने पर generation रुक जाता है |
| `frequency_penalty` | number | नहीं | समर्थित होने पर provider-compatible repetition penalty |
| `presence_penalty` | number | नहीं | समर्थित होने पर provider-compatible presence penalty |

### मैसेज भूमिकाएँ {#message-roles}

| Role | उद्देश्य |
|------|---------|
| `system` | Assistant का व्यवहार और व्यक्तित्व तय करता है |
| `user` | इंसान का input |
| `assistant` | पिछले assistant responses (multi-turn बातचीत के लिए) |
| `developer`, `tool` | चुने गए model और route द्वारा समर्थित होने पर अतिरिक्त OpenAI-compatible roles |

## पूरा request उदाहरण {#full-request-example}

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

## Response की संरचना {#response-structure}

### सामान्य non-streaming response {#typical-non-streaming-response}

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

### Response fields की व्याख्या {#response-fields-explained}

| Field | विवरण |
|-------|-------------|
| `id` | इस completion का unique identifier |
| `object` | OpenAI-compatible response object, इस route पर सामान्यतः `"chat.completion"` |
| `created` | Response generate होने का Unix timestamp |
| `model` | Response generate करने वाला model |
| `choices` | Completion choices का array (आमतौर पर एक) |
| `choices[].index` | Array में इस choice का index |
| `choices[].message.role` | Generated message के लिए लौटाया गया role, सामान्यतः `"assistant"` |
| `choices[].message.content` | Generated text |
| `choices[].finish_reason` | Generation क्यों रुका (नीचे देखें) |
| `usage.prompt_tokens` | आपके input में tokens |
| `usage.completion_tokens` | Generated output में tokens |
| `usage.total_tokens` | prompt + completion tokens का योग |

### समाप्ति कारण {#finish-reasons}

Finish reasons provider पर निर्भर करते हैं। सामान्य OpenAI-compatible मानों में शामिल हैं:

| मान | सामान्य अर्थ |
|-------|---------|
| `stop` | Response का स्वाभाविक अंत या stop sequence मिल गया |
| `length` | `max_tokens` limit पूरी हो गई — response काट दिया गया |

अज्ञात मानों को response अस्वीकार करने के बजाय valid provider output मानें।

## स्ट्रीमिंग प्रतिक्रियाएँ {#streaming-responses}

Real-time output के लिए (जैसे chatbot का typing), streaming इस्तेमाल करें। Response Server-Sent Events (SSE) के रूप में आता है:

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

### स्ट्रीमिंग SSE फ़ॉर्मेट {#streaming-sse-format}

एक compatible stream आमतौर पर इस तरह के Server-Sent Events भेजता है:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

मुख्य बातें:

- chunks को क्रम से पढ़ें और हर `delta.content` fragment को जोड़ते जाएँ
- केवल metadata वाले chunks, खाली deltas, और ऐसे provider-compatible fields को सहन करें जिन्हें आप नहीं पहचानते
- Stream बंद होने या उसका terminal marker आने पर रुकें; Chat Completions आमतौर पर `data: [DONE]` इस्तेमाल करता है
- यह न मानें कि हर model बिल्कुल एक जैसा पहला या आख़िरी chunk shape भेजता है

## Anthropic SDK इस्तेमाल करना {#using-the-anthropic-sdk}

SandBase `POST /v1/messages` पर एक Anthropic-compatible endpoint भी देता है। `base_url` बदलकर Anthropic SDK इस्तेमाल करें:

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

### Anthropic response की संरचना {#anthropic-response-structure}

Anthropic-compatible endpoint Anthropic-style response लौटाता है। एक सामान्य text response ऐसा दिखता है:

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

| Field | विवरण |
|-------|-------------|
| `id` | Message ID (`msg_` prefix के साथ) |
| `type` | Message object type, सामान्यतः `"message"` |
| `role` | Generated message का role, सामान्यतः `"assistant"` |
| `content` | Typed content blocks का array; यह न मानें कि हर block text है |
| `model` | Response generate करने वाला model |
| `stop_reason` | `"end_turn"` (स्वाभाविक रुकना), `"max_tokens"` (limit पूरी हुई), या `"stop_sequence"` |
| `usage.input_tokens` | आपके input में tokens |
| `usage.output_tokens` | Generated output में tokens |

### Anthropic स्ट्रीमिंग {#anthropic-streaming}

Anthropic SDK के साथ streaming भी इसी तरह काम करती है — बस `stream=True` भेजें:

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

## Model चुनना {#choosing-a-model}

Model चुनते समय, उपलब्धता, pricing, context length, समर्थित inputs और क्षमताओं के लिए उसका live model card देखें। ये मान स्वतंत्र रूप से बदलते हैं, इसलिए कॉपी की गई model तुलना पर निर्भर न रहें।

- मौजूदा [Models catalog](https://www.sandbase.ai/models) देखें।
- Model-specific request fields के लिए catalog में model का पेज खोलें।
- जब किसी integration को programmatically मौजूदा model metadata चाहिए, तो `GET /v1/models` query करें।

एक ही compatible interface साझा करने वाले models के लिए, बदलाव आमतौर पर `model` parameter से शुरू होता है। Optional fields, tools, media inputs या structured-output settings को आगे ले जाने से पहले चुने गए model की क्षमताएँ और schema फिर से जाँचें।

## अगले कदम {#next-steps}

Production से पहले, request timeouts सेट करें, केवल transient failures को bounded exponential backoff के साथ retry करें, उपलब्ध होने पर request IDs log करें, और prompts या API keys log किए बिना usage पर नज़र रखें।

- [**API Reference**](/api-reference/) — Inference endpoints और Platform API contracts
- [**Streaming Guide**](/guides/streaming) — उन्नत streaming patterns और error handling
- [**Models**](https://www.sandbase.ai/models) — Model खोज, क्षमताएँ और मौजूदा pricing
- [**Errors**](/guides/error-handling) — Failures और retries संभालें
