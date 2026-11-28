---
i18nSource: 335b45fb98c53890
title: स्ट्रीमिंग प्रतिक्रियाएँ
description: OpenAI या Anthropic compatible SDKs से SandBase model output stream करें और partial results को सुरक्षित रूप से संभालें।
---

# स्ट्रीमिंग प्रतिक्रियाएँ {#streaming-responses}

Streaming model output को उपलब्ध होते ही लौटाती है। SandBase आपके द्वारा call किए गए compatible API का event format
बनाए रखता है: OpenAI Chat Completions केवल data वाले Server-Sent Events (SSE) इस्तेमाल करता है, जबकि Anthropic Messages named SSE events इस्तेमाल करता है।

जहाँ संभव हो, आधिकारिक compatible SDK इस्तेमाल करें। यह event framing, incremental tool-call arguments और protocol
termination को raw response text को खुद विभाजित करने की तुलना में ज़्यादा सुरक्षित तरीके से संभालता है।

## OpenAI Chat Completions {#openai-chat-completions}

`POST /v1/chat/completions` पर `stream: true` सेट करें।

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

OpenAI-compatible chunks incremental text को `choices[0].delta.content` में रखते हैं। Tool-call arguments, जब चुने गए
model द्वारा समर्थित हों, `delta.tool_calls` में string fragments के रूप में आते हैं; पूरे JSON को parse करने से पहले fragments को choice और tool-call
index के अनुसार जोड़ें। Stream सामान्यतः `data: [DONE]` के साथ समाप्त होता है।

यह न मानें कि हर provider stream में token usage लौटाता है। अगर आपका चुना गया model OpenAI के
`stream_options.include_usage` का समर्थन करता है, तो usage अंत के पास दिख सकता है; अन्यथा non-streaming response या
लागू task-cost flow इस्तेमाल करें।

## Anthropic Messages {#anthropic-messages}

`POST /v1/messages` के साथ Anthropic SDK इस्तेमाल करें। SDK का stream helper named events और content blocks को जोड़ता है।

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

Raw Anthropic streams `message_start`, `content_block_start`, `content_block_delta`,
`content_block_stop`, `message_delta` और `message_stop` जैसे event names इस्तेमाल करते हैं। Text `text_delta` blocks में आता है। Tool input
incremental JSON blocks इस्तेमाल करता है और parse करने से पहले उसे जोड़ना ज़रूरी है।

## रुकावट और cancellation संभालें {#handle-interruption-and-cancellation}

Streaming शुरू होने से पहले लौटाया गया HTTP error endpoint की सामान्य error body इस्तेमाल करता है। Response शुरू होने के बाद,
network failure final event के बिना partial text छोड़ सकता है। Output को केवल protocol के
सामान्य termination signal के बाद ही पूरा मानें।

- Partial output को committed application state से अलग रखें।
- Workload के अनुसार अपने client या proxy में connection और inactivity timeouts सीमित करें।
- जब user generation रोकता है, तो SDK का cancellation mechanism या JavaScript में `AbortController` इस्तेमाल करें।
- Retry किए गए stream को partial output में अपने-आप न जोड़ें; retry एक नया generation है।
- अपने नियंत्रण वाले reverse proxies में SSE को buffer करने से बचें।

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

Raw SSE पढ़ते समय, blank lines से अलग किए गए पूरे event frames को parse करें। Network chunks SSE events से एक-से-एक
मेल नहीं खाते, और एक UTF-8 character कई chunks में बँट सकता है। Streaming text decoder इस्तेमाल करें और अधूरे frame को
तब तक रखें जब तक और bytes न आ जाएँ।

## संबंधित मार्गदर्शन {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [Error handling](/guides/error-handling)
- [Rate limits](/guides/rate-limiting)
