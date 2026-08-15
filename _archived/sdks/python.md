---
title: Python SDK
description: Using SandBase with the Python OpenAI and Anthropic SDKs — installation, configuration, and examples.
---

# Python SDK

SandBase doesn't require a custom SDK. Use the official `openai` and `anthropic` Python packages you already know — just point them at SandBase.

```python
# That's it. Change the base_url, use your SandBase API key.
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)
```

This gives you access to SandBase model APIs through one account and one key. Use the same key later for ready-made APIs and published Agents when your app needs to do more than generate text.

## How It Works

SandBase implements the OpenAI and Anthropic APIs. Any code that works with those SDKs works with SandBase — you only change two things:

| Setting | OpenAI Direct | SandBase |
|---------|--------------|----------|
| `base_url` | `https://api.openai.com/v1` (default) | `https://api.sandbase.ai/v1` |
| `api_key` | `sk-...` (OpenAI key) | `sk-sb-...` (SandBase key) |

The same applies to the Anthropic SDK:

| Setting | Anthropic Direct | SandBase |
|---------|-----------------|----------|
| `base_url` | `https://api.anthropic.com` (default) | `https://api.sandbase.ai` |
| `api_key` | `sk-ant-...` (Anthropic key) | `sk-sb-...` (SandBase key) |

## Installation

::: code-group

```bash [OpenAI SDK]
pip install openai
```

```bash [Anthropic SDK]
pip install anthropic
```

```bash [Both]
pip install openai anthropic
```

:::

## Configuration

### OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)
```

### Anthropic SDK

```python
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key="sk-sb-your-key"
)
```

### Environment Variables

The cleanest approach — no credentials in code:

```bash
# .env or shell environment
export OPENAI_BASE_URL="https://api.sandbase.ai/v1"
export OPENAI_API_KEY="sk-sb-your-key"
```

```python
from openai import OpenAI

# Reads OPENAI_BASE_URL and OPENAI_API_KEY automatically
client = OpenAI()
```

For the Anthropic SDK:

```bash
export ANTHROPIC_BASE_URL="https://api.sandbase.ai"
export ANTHROPIC_API_KEY="sk-sb-your-key"
```

```python
import anthropic

# Reads ANTHROPIC_BASE_URL and ANTHROPIC_API_KEY automatically
client = anthropic.Anthropic()
```

::: tip
Use a `.env` file with [python-dotenv](https://pypi.org/project/python-dotenv/) for local development. Never commit API keys to version control.
:::

## Chat Completions

### Basic Request

::: code-group

```python [OpenAI SDK]
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ]
)

print(response.choices[0].message.content)
# "The capital of France is Paris."
```

```python [Anthropic SDK]
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key="sk-sb-your-key"
)

response = client.messages.create(
    model="claude-sonnet-4",
    max_tokens=1024,
    system="You are a helpful assistant.",
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)

print(response.content[0].text)
# "The capital of France is Paris."
```

:::

### Multi-Turn Conversation

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)

messages = [
    {"role": "system", "content": "You are a math tutor."},
    {"role": "user", "content": "What is 2 + 2?"},
]

response = client.chat.completions.create(model="gpt-4o", messages=messages)
assistant_msg = response.choices[0].message
messages.append({"role": "assistant", "content": assistant_msg.content})

# Continue the conversation
messages.append({"role": "user", "content": "Now multiply that by 3"})
response = client.chat.completions.create(model="gpt-4o", messages=messages)
print(response.choices[0].message.content)
# "4 × 3 = 12"
```

### Switching Models

One of SandBase's strengths — switch between any provider's models without changing your code:

```python
# Use OpenAI
response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Hello"}]
)

# Use Google
response = client.chat.completions.create(
    model="gemini-2.5-pro",
    messages=[{"role": "user", "content": "Hello"}]
)

# Use Meta
response = client.chat.completions.create(
    model="llama-4-maverick",
    messages=[{"role": "user", "content": "Hello"}]
)
```

## Streaming

### OpenAI SDK Streaming

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)

stream = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "Write a haiku about coding"}],
    stream=True
)

for chunk in stream:
    content = chunk.choices[0].delta.content
    if content:
        print(content, end="", flush=True)
print()  # Newline at end
```

### Anthropic SDK Streaming

```python
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key="sk-sb-your-key"
)

with client.messages.stream(
    model="claude-sonnet-4",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about coding"}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()
```

### Async Streaming

```python
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)

async def stream_response():
    stream = await client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Tell me a story"}],
        stream=True
    )
    async for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            print(content, end="", flush=True)

asyncio.run(stream_response())
```

## Function Calling (Tools)

### OpenAI SDK Tools

```python
import json
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)

tools = [
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get the current weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name, e.g. 'Tokyo'"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "Temperature unit"
                    }
                },
                "required": ["location"]
            }
        }
    }
]

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}],
    tools=tools
)

# Check if the model wants to call a tool
message = response.choices[0].message
if message.tool_calls:
    tool_call = message.tool_calls[0]
    args = json.loads(tool_call.function.arguments)
    print(f"Function: {tool_call.function.name}")
    print(f"Arguments: {args}")
    # {"location": "Tokyo", "unit": "celsius"}

    # Execute the function and send the result back
    messages = [
        {"role": "user", "content": "What's the weather in Tokyo?"},
        message,  # Assistant's tool call
        {
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps({"temperature": 22, "condition": "sunny"})
        }
    ]

    final_response = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        tools=tools
    )
    print(final_response.choices[0].message.content)
```

### Anthropic SDK Tools

```python
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key="sk-sb-your-key"
)

response = client.messages.create(
    model="claude-sonnet-4",
    max_tokens=1024,
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather for a location",
            "input_schema": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name, e.g. 'Tokyo'"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"]
                    }
                },
                "required": ["location"]
            }
        }
    ],
    messages=[{"role": "user", "content": "What's the weather in Tokyo?"}]
)

# Process tool use
for block in response.content:
    if block.type == "tool_use":
        print(f"Tool: {block.name}")
        print(f"Input: {block.input}")
        # {"location": "Tokyo", "unit": "celsius"}
```

## Vision (Image Input)

### URL Image

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "What's in this image?"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": "https://example.com/photo.jpg"
                    }
                }
            ]
        }
    ]
)

print(response.choices[0].message.content)
```

### Base64 Image

```python
import base64
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)

with open("image.png", "rb") as f:
    image_data = base64.b64encode(f.read()).decode("utf-8")

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe this image"},
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/png;base64,{image_data}"
                    }
                }
            ]
        }
    ]
)
```

### Anthropic SDK Vision

```python
import anthropic
import base64

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key="sk-sb-your-key"
)

with open("image.png", "rb") as f:
    image_data = base64.b64encode(f.read()).decode("utf-8")

response = client.messages.create(
    model="claude-sonnet-4",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "image",
                    "source": {
                        "type": "base64",
                        "media_type": "image/png",
                        "data": image_data
                    }
                },
                {"type": "text", "text": "Describe this image"}
            ]
        }
    ]
)

print(response.content[0].text)
```

## Structured Output (JSON Mode)

### JSON Schema

```python
import json
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)

response = client.chat.completions.create(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "Extract structured data from the text."},
        {"role": "user", "content": "John is 30 years old and lives in New York."}
    ],
    response_format={
        "type": "json_schema",
        "json_schema": {
            "name": "person_info",
            "schema": {
                "type": "object",
                "properties": {
                    "name": {"type": "string"},
                    "age": {"type": "integer"},
                    "city": {"type": "string"}
                },
                "required": ["name", "age", "city"]
            }
        }
    }
)

data = json.loads(response.choices[0].message.content)
print(data)
# {"name": "John", "age": 30, "city": "New York"}
```

### Pydantic with Structured Outputs

```python
from pydantic import BaseModel
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)

class PersonInfo(BaseModel):
    name: str
    age: int
    city: str

response = client.beta.chat.completions.parse(
    model="gpt-4o",
    messages=[
        {"role": "system", "content": "Extract structured data from the text."},
        {"role": "user", "content": "John is 30 years old and lives in New York."}
    ],
    response_format=PersonInfo
)

person = response.choices[0].message.parsed
print(f"{person.name}, {person.age}, {person.city}")
# "John, 30, New York"
```

## Error Handling

### OpenAI SDK Errors

```python
from openai import (
    OpenAI,
    APIConnectionError,
    RateLimitError,
    APIStatusError,
)

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key",
    max_retries=3,  # Automatic retry with exponential backoff
    timeout=30.0,   # Request timeout in seconds
)

try:
    response = client.chat.completions.create(
        model="gpt-4o",
        messages=[{"role": "user", "content": "Hello"}]
    )
except APIConnectionError:
    print("Failed to connect to SandBase. Check your network.")
except RateLimitError:
    print("Rate limited. The SDK will retry automatically.")
except APIStatusError as e:
    print(f"API error {e.status_code}: {e.message}")
```

### Anthropic SDK Errors

```python
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key="sk-sb-your-key",
    max_retries=3,
    timeout=30.0,
)

try:
    response = client.messages.create(
        model="claude-sonnet-4",
        max_tokens=1024,
        messages=[{"role": "user", "content": "Hello"}]
    )
except anthropic.APIConnectionError:
    print("Failed to connect to SandBase. Check your network.")
except anthropic.RateLimitError:
    print("Rate limited. The SDK will retry automatically.")
except anthropic.APIStatusError as e:
    print(f"API error {e.status_code}: {e.message}")
```

### Common Error Codes

| Code | Meaning | Action |
|------|---------|--------|
| 400 | Invalid request (bad params) | Fix the request body |
| 401 | Invalid API key | Check your `api_key` value |
| 403 | Insufficient permissions | Verify key permissions in dashboard |
| 404 | Model not found | Check model name in [supported models](/models/supported) |
| 429 | Rate limit exceeded | SDK retries automatically; reduce concurrency |
| 500 | Server error | Retry; SandBase auto-routes to fallback providers |
| 503 | Provider unavailable | Retry; SandBase auto-routes to fallback providers |

## Async Client

For high-concurrency applications, use the async clients:

### OpenAI Async

```python
import asyncio
from openai import AsyncOpenAI

client = AsyncOpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key"
)

async def process_batch(prompts: list[str]):
    """Process multiple prompts concurrently."""
    tasks = [
        client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}]
        )
        for prompt in prompts
    ]
    responses = await asyncio.gather(*tasks)
    return [r.choices[0].message.content for r in responses]

results = asyncio.run(process_batch([
    "What is 2+2?",
    "What is the capital of Japan?",
    "Name a primary color",
]))
```

### Anthropic Async

```python
import asyncio
import anthropic

client = anthropic.AsyncAnthropic(
    base_url="https://api.sandbase.ai",
    api_key="sk-sb-your-key"
)

async def ask(question: str) -> str:
    response = await client.messages.create(
        model="claude-sonnet-4",
        max_tokens=1024,
        messages=[{"role": "user", "content": question}]
    )
    return response.content[0].text

result = asyncio.run(ask("What is the meaning of life?"))
print(result)
```

## Framework Integration

### LangChain

```python
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(
    model="gpt-4o",
    base_url="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key",
)

response = llm.invoke("What is the capital of France?")
print(response.content)
```

### LlamaIndex

```python
from llama_index.llms.openai import OpenAI

llm = OpenAI(
    model="gpt-4o",
    api_base="https://api.sandbase.ai/v1",
    api_key="sk-sb-your-key",
)

response = llm.complete("What is the capital of France?")
print(response.text)
```

## Sandbox Operations

Use the `requests` library for sandbox API calls (not covered by OpenAI/Anthropic SDKs):

```python
import requests

BASE_URL = "https://api.sandbase.ai"
HEADERS = {"Authorization": "Bearer sk-sb-your-key"}

# Create a sandbox
response = requests.post(
    f"{BASE_URL}/sandboxes",
    headers=HEADERS,
    json={"templateID": "code_interpreter", "timeout": 300}
)
sandbox = response.json()
sandbox_id = sandbox["sandboxID"]
print(f"Created sandbox: {sandbox_id}")

# Execute code
exec_response = requests.post(
    f"{BASE_URL}/sandboxes/{sandbox_id}/processes",
    headers=HEADERS,
    json={
        "cmd": "python3",
        "args": ["-c", "import numpy as np; print(np.random.rand(3))"]
    }
)
result = exec_response.json()
print(f"Output: {result['stdout']}")

# Shutdown when done
requests.post(f"{BASE_URL}/sandboxes/{sandbox_id}/shutdown", headers=HEADERS)
```

## Next Steps

- [JavaScript / TypeScript SDK](/sdks/javascript) — Same pattern, different language
- [Supported Models](/models/supported) — Browse available model APIs
- [Model Routing](/guides/model-routing) — Smart routing strategies
- [Streaming Guide](/guides/streaming) — Deep dive into SSE streaming
- [API Reference](/api-reference/llm-gateway) — Full endpoint documentation
