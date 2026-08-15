---
title: JavaScript / TypeScript SDK
description: Using SandBase with the JavaScript OpenAI and Anthropic SDKs — installation, configuration, and examples.
---

# JavaScript / TypeScript SDK

SandBase doesn't require a custom SDK. Use the official `openai` and `@anthropic-ai/sdk` npm packages you already know — just point them at SandBase.

```typescript
// That's it. Change the baseURL, use your SandBase API key.
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
});
```

This gives you access to SandBase model APIs through one account and one key. Use the same key later for ready-made APIs and published Agents when your app needs to do more than generate text.

## How It Works

SandBase implements the OpenAI and Anthropic APIs. Any code that works with those SDKs works with SandBase — you only change two things:

| Setting | OpenAI Direct | SandBase |
|---------|--------------|----------|
| `baseURL` | `https://api.openai.com/v1` (default) | `https://api.sandbase.ai/v1` |
| `apiKey` | `sk-...` (OpenAI key) | `sk-sb-...` (SandBase key) |

The same applies to the Anthropic SDK:

| Setting | Anthropic Direct | SandBase |
|---------|-----------------|----------|
| `baseURL` | `https://api.anthropic.com` (default) | `https://api.sandbase.ai` |
| `apiKey` | `sk-ant-...` (Anthropic key) | `sk-sb-...` (SandBase key) |

## Installation

::: code-group

```bash [npm]
npm install openai
# or for Anthropic
npm install @anthropic-ai/sdk
```

```bash [yarn]
yarn add openai
# or for Anthropic
yarn add @anthropic-ai/sdk
```

```bash [pnpm]
pnpm add openai
# or for Anthropic
pnpm add @anthropic-ai/sdk
```

:::

## Configuration

### OpenAI SDK

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
});
```

### Anthropic SDK

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: 'sk-sb-your-key',
});
```

### Environment Variables

The cleanest approach — no credentials in code:

```bash
# .env or shell environment
OPENAI_BASE_URL=https://api.sandbase.ai/v1
OPENAI_API_KEY=sk-sb-your-key
```

```typescript
import OpenAI from 'openai';

// Reads OPENAI_BASE_URL and OPENAI_API_KEY automatically
const client = new OpenAI();
```

For the Anthropic SDK:

```bash
ANTHROPIC_BASE_URL=https://api.sandbase.ai
ANTHROPIC_API_KEY=sk-sb-your-key
```

```typescript
import Anthropic from '@anthropic-ai/sdk';

// Reads ANTHROPIC_BASE_URL and ANTHROPIC_API_KEY automatically
const client = new Anthropic();
```

::: tip
Use a `.env` file with [dotenv](https://www.npmjs.com/package/dotenv) for local development. Never commit API keys to version control.
:::

## Chat Completions

### Basic Request

::: code-group

```typescript [OpenAI SDK]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
});

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
});

console.log(response.choices[0].message.content);
// "The capital of France is Paris."
```

```typescript [Anthropic SDK]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: 'sk-sb-your-key',
});

const response = await client.messages.create({
  model: 'claude-sonnet-4',
  max_tokens: 1024,
  system: 'You are a helpful assistant.',
  messages: [
    { role: 'user', content: 'What is the capital of France?' },
  ],
});

console.log(response.content[0].text);
// "The capital of France is Paris."
```

:::

### Multi-Turn Conversation

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
});

const messages: OpenAI.ChatCompletionMessageParam[] = [
  { role: 'system', content: 'You are a math tutor.' },
  { role: 'user', content: 'What is 2 + 2?' },
];

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages,
});

messages.push(response.choices[0].message);
messages.push({ role: 'user', content: 'Now multiply that by 3' });

const followUp = await client.chat.completions.create({
  model: 'gpt-4o',
  messages,
});

console.log(followUp.choices[0].message.content);
// "4 × 3 = 12"
```

### Switching Models

One of SandBase's strengths — switch between any provider's models without changing your code:

```typescript
// Use OpenAI
const response1 = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Hello' }],
});

// Use Google
const response2 = await client.chat.completions.create({
  model: 'gemini-2.5-pro',
  messages: [{ role: 'user', content: 'Hello' }],
});

// Use Meta
const response3 = await client.chat.completions.create({
  model: 'llama-4-maverick',
  messages: [{ role: 'user', content: 'Hello' }],
});
```

## Streaming

### OpenAI SDK Streaming

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
});

const stream = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: 'Write a haiku about coding' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) {
    process.stdout.write(content);
  }
}
console.log(); // Newline at end
```

### Anthropic SDK Streaming

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: 'sk-sb-your-key',
});

const stream = client.messages.stream({
  model: 'claude-sonnet-4',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Write a haiku about coding' }],
});

stream.on('text', (text) => {
  process.stdout.write(text);
});

const finalMessage = await stream.finalMessage();
console.log('\nTotal tokens:', finalMessage.usage.input_tokens + finalMessage.usage.output_tokens);
```

### Streaming in Web Applications

```typescript
// Next.js API route example
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: process.env.SANDBASE_API_KEY,
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  const stream = await client.chat.completions.create({
    model: 'gpt-4o',
    messages,
    stream: true,
  });

  // Convert to ReadableStream for the browser
  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          controller.enqueue(encoder.encode(content));
        }
      }
      controller.close();
    },
  });

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
```

## Function Calling (Tools)

### OpenAI SDK Tools

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
});

const tools: OpenAI.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'get_weather',
      description: 'Get the current weather for a location',
      parameters: {
        type: 'object',
        properties: {
          location: { type: 'string', description: "City name, e.g. 'Tokyo'" },
          unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
        },
        required: ['location'],
      },
    },
  },
];

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [{ role: 'user', content: "What's the weather in Tokyo?" }],
  tools,
});

const message = response.choices[0].message;

if (message.tool_calls) {
  const toolCall = message.tool_calls[0];
  const args = JSON.parse(toolCall.function.arguments);
  console.log(`Function: ${toolCall.function.name}`);
  console.log(`Arguments:`, args);
  // { location: "Tokyo", unit: "celsius" }

  // Execute the function and send result back
  const finalResponse = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      { role: 'user', content: "What's the weather in Tokyo?" },
      message,
      {
        role: 'tool',
        tool_call_id: toolCall.id,
        content: JSON.stringify({ temperature: 22, condition: 'sunny' }),
      },
    ],
    tools,
  });

  console.log(finalResponse.choices[0].message.content);
}
```

### Anthropic SDK Tools

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: 'sk-sb-your-key',
});

const response = await client.messages.create({
  model: 'claude-sonnet-4',
  max_tokens: 1024,
  tools: [
    {
      name: 'get_weather',
      description: 'Get the current weather for a location',
      input_schema: {
        type: 'object',
        properties: {
          location: { type: 'string', description: "City name, e.g. 'Tokyo'" },
          unit: { type: 'string', enum: ['celsius', 'fahrenheit'] },
        },
        required: ['location'],
      },
    },
  ],
  messages: [{ role: 'user', content: "What's the weather in Tokyo?" }],
});

// Process tool use
for (const block of response.content) {
  if (block.type === 'tool_use') {
    console.log(`Tool: ${block.name}`);
    console.log(`Input:`, block.input);
    // { location: "Tokyo", unit: "celsius" }
  }
}
```

## Vision (Image Input)

### URL Image

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
});

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: "What's in this image?" },
        {
          type: 'image_url',
          image_url: { url: 'https://example.com/photo.jpg' },
        },
      ],
    },
  ],
});

console.log(response.choices[0].message.content);
```

### Base64 Image

```typescript
import { readFileSync } from 'fs';
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
});

const imageBuffer = readFileSync('image.png');
const base64Image = imageBuffer.toString('base64');

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'Describe this image' },
        {
          type: 'image_url',
          image_url: { url: `data:image/png;base64,${base64Image}` },
        },
      ],
    },
  ],
});
```

### Anthropic SDK Vision

```typescript
import { readFileSync } from 'fs';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: 'sk-sb-your-key',
});

const imageBuffer = readFileSync('image.png');
const base64Image = imageBuffer.toString('base64');

const response = await client.messages.create({
  model: 'claude-sonnet-4',
  max_tokens: 1024,
  messages: [
    {
      role: 'user',
      content: [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: 'image/png',
            data: base64Image,
          },
        },
        { type: 'text', text: 'Describe this image' },
      ],
    },
  ],
});

console.log(response.content[0].text);
```

## Structured Output (JSON Mode)

### JSON Schema

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
});

const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'Extract structured data from the text.' },
    { role: 'user', content: 'John is 30 years old and lives in New York.' },
  ],
  response_format: {
    type: 'json_schema',
    json_schema: {
      name: 'person_info',
      schema: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          age: { type: 'integer' },
          city: { type: 'string' },
        },
        required: ['name', 'age', 'city'],
      },
    },
  },
});

const data = JSON.parse(response.choices[0].message.content!);
console.log(data);
// { name: "John", age: 30, city: "New York" }
```

### Zod with Structured Outputs

```typescript
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import { z } from 'zod';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
});

const PersonInfo = z.object({
  name: z.string(),
  age: z.number().int(),
  city: z.string(),
});

const response = await client.beta.chat.completions.parse({
  model: 'gpt-4o',
  messages: [
    { role: 'system', content: 'Extract structured data from the text.' },
    { role: 'user', content: 'John is 30 years old and lives in New York.' },
  ],
  response_format: zodResponseFormat(PersonInfo, 'person_info'),
});

const person = response.choices[0].message.parsed;
console.log(`${person?.name}, ${person?.age}, ${person?.city}`);
// "John, 30, New York"
```

## Error Handling

### OpenAI SDK Errors

```typescript
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
  maxRetries: 3, // Automatic retry with exponential backoff
  timeout: 30000, // Request timeout in milliseconds
});

try {
  const response = await client.chat.completions.create({
    model: 'gpt-4o',
    messages: [{ role: 'user', content: 'Hello' }],
  });
  console.log(response.choices[0].message.content);
} catch (error) {
  if (error instanceof OpenAI.APIConnectionError) {
    console.error('Failed to connect to SandBase. Check your network.');
  } else if (error instanceof OpenAI.RateLimitError) {
    console.error('Rate limited. The SDK will retry automatically.');
  } else if (error instanceof OpenAI.APIError) {
    console.error(`API error ${error.status}: ${error.message}`);
  } else {
    throw error;
  }
}
```

### Anthropic SDK Errors

```typescript
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: 'sk-sb-your-key',
  maxRetries: 3,
  timeout: 30000,
});

try {
  const response = await client.messages.create({
    model: 'claude-sonnet-4',
    max_tokens: 1024,
    messages: [{ role: 'user', content: 'Hello' }],
  });
  console.log(response.content[0].text);
} catch (error) {
  if (error instanceof Anthropic.APIConnectionError) {
    console.error('Failed to connect to SandBase. Check your network.');
  } else if (error instanceof Anthropic.RateLimitError) {
    console.error('Rate limited. The SDK will retry automatically.');
  } else if (error instanceof Anthropic.APIError) {
    console.error(`API error ${error.status}: ${error.message}`);
  } else {
    throw error;
  }
}
```

### Common Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Invalid request (bad params) | Fix the request body |
| 401 | Invalid API key | Check your `apiKey` value |
| 403 | Insufficient permissions | Verify key permissions in dashboard |
| 404 | Model not found | Check model name in [supported models](/models/supported) |
| 429 | Rate limit exceeded | SDK retries automatically; reduce concurrency |
| 500 | Server error | Retry; SandBase auto-routes to fallback providers |
| 503 | Provider unavailable | Retry; SandBase auto-routes to fallback providers |

## TypeScript Types

The OpenAI SDK provides full TypeScript types:

```typescript
import OpenAI from 'openai';

type Message = OpenAI.ChatCompletionMessageParam;
type Response = OpenAI.ChatCompletion;
type StreamChunk = OpenAI.ChatCompletionChunk;

const messages: Message[] = [
  { role: 'system', content: 'You are helpful.' },
  { role: 'user', content: 'Hello!' },
];

const response: Response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages,
});
```

## Framework Integration

### Vercel AI SDK

```typescript
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, streamText } from 'ai';

const sandbase = createOpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: 'sk-sb-your-key',
});

// Non-streaming
const { text } = await generateText({
  model: sandbase('gpt-4o'),
  prompt: 'What is the capital of France?',
});

// Streaming
const result = streamText({
  model: sandbase('gpt-4o'),
  prompt: 'Write a story about a robot.',
});

for await (const chunk of result.textStream) {
  process.stdout.write(chunk);
}
```

### LangChain.js

```typescript
import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({
  modelName: 'gpt-4o',
  configuration: {
    baseURL: 'https://api.sandbase.ai/v1',
    apiKey: 'sk-sb-your-key',
  },
});

const response = await model.invoke('What is the capital of France?');
console.log(response.content);
```

## Sandbox Operations

Use `fetch` for sandbox API calls (not covered by OpenAI/Anthropic SDKs):

```typescript
const BASE_URL = 'https://api.sandbase.ai';
const API_KEY = 'sk-sb-your-key';

const headers = {
  Authorization: `Bearer ${API_KEY}`,
  'Content-Type': 'application/json',
};

// Create a sandbox
const createRes = await fetch(`${BASE_URL}/sandboxes`, {
  method: 'POST',
  headers,
  body: JSON.stringify({ templateID: 'code_interpreter', timeout: 300 }),
});
const sandbox = await createRes.json();
const sandboxId = sandbox.sandboxID;
console.log(`Created sandbox: ${sandboxId}`);

// Execute code
const execRes = await fetch(`${BASE_URL}/sandboxes/${sandboxId}/processes`, {
  method: 'POST',
  headers,
  body: JSON.stringify({
    cmd: 'python3',
    args: ['-c', 'import numpy as np; print(np.random.rand(3))'],
  }),
});
const result = await execRes.json();
console.log(`Output: ${result.stdout}`);

// Shutdown when done
await fetch(`${BASE_URL}/sandboxes/${sandboxId}/shutdown`, {
  method: 'POST',
  headers,
});
```

## Next Steps

- [Python SDK](/sdks/python) — Same pattern, different language
- [Supported Models](/models/supported) — Browse available model APIs
- [Model Routing](/guides/model-routing) — Smart routing strategies
- [Streaming Guide](/guides/streaming) — Deep dive into SSE streaming
- [API Reference](/api-reference/llm-gateway) — Full endpoint documentation
