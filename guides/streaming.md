---
title: Streaming responses
description: Stream SandBase model output with the OpenAI or Anthropic compatible SDKs and handle partial results safely.
---

# Streaming responses

Streaming returns model output as it becomes available. SandBase preserves the event format of the compatible API you
call: OpenAI Chat Completions uses data-only Server-Sent Events (SSE), while Anthropic Messages uses named SSE events.

Use an official compatible SDK when possible. It handles event framing, incremental tool-call arguments, and protocol
termination more safely than splitting raw response text yourself.

## OpenAI Chat Completions

Set `stream: true` on `POST /v1/chat/completions`.

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

OpenAI-compatible chunks place incremental text in `choices[0].delta.content`. Tool-call arguments, when supported by
the selected model, arrive as string fragments in `delta.tool_calls`; concatenate fragments by choice and tool-call
index before parsing the completed JSON. The stream normally ends with `data: [DONE]`.

Do not assume every provider returns token usage in a stream. If your selected model supports OpenAI's
`stream_options.include_usage`, usage can appear near the end; otherwise use the non-streaming response or the
applicable task-cost flow.

## Anthropic Messages

Use the Anthropic SDK with `POST /v1/messages`. The SDK's stream helper assembles named events and content blocks.

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

Raw Anthropic streams use event names such as `message_start`, `content_block_start`, `content_block_delta`,
`content_block_stop`, `message_delta`, and `message_stop`. Text is carried by `text_delta` blocks. Tool input uses
incremental JSON blocks and must be assembled before parsing.

## Handle interruption and cancellation

An HTTP error returned before streaming begins uses the endpoint's normal error body. After the response has started,
a network failure can leave partial text without a final event. Treat output as complete only after the protocol's
normal termination signal.

- Keep partial output separate from committed application state.
- Bound connection and inactivity timeouts in your own client or proxy according to the workload.
- Use the SDK's cancellation mechanism or an `AbortController` in JavaScript when the user stops generation.
- Do not automatically append a retried stream to partial output; a retry is a new generation.
- Avoid buffering SSE in reverse proxies you control.

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

When reading raw SSE, parse complete event frames separated by blank lines. Network chunks do not correspond one-to-one
with SSE events, and a UTF-8 character can span chunks. Use a streaming text decoder and retain any incomplete frame
until more bytes arrive.

## Related guidance

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [Error handling](/guides/error-handling)
- [Rate limits](/guides/rate-limiting)
