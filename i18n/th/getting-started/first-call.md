---
i18nSource: 0ca53876f04eb96d
title: การเรียก API ครั้งแรก
description: คำแนะนำโดยละเอียดสำหรับการเรียก SandBase API ครั้งแรก ทำความเข้าใจโครงสร้างคำขอ โครงสร้างการตอบกลับ และการสตรีม
---

# การเรียก API ครั้งแรก {#first-api-call}

คู่มือนี้อธิบายโครงสร้างของคำขอและการตอบกลับของ SandBase API อย่างละเอียด เมื่ออ่านจบ คุณจะเข้าใจทุกฟิลด์ในเนื้อหาคำขอ วิธีอ่านการตอบกลับ และวิธีใช้การสตรีม

## ก่อนเริ่มต้น {#before-you-start}

คุณต้องมีองค์กร SandBase ที่ใช้งานอยู่ [API key](/getting-started/api-keys) และ model ID จาก [แคตตาล็อกโมเดล](https://www.sandbase.ai/models) ให้ export คีย์ไว้ เพื่อไม่ให้ตัวอย่างต้องใส่ความลับไว้ในซอร์สโค้ด:

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

เริ่มจากคำขอแบบไม่สตรีม เมื่อการยืนยันตัวตนและการจัดการการตอบกลับทำงานได้แล้ว จึงเพิ่มการสตรีมและการลองใหม่สำหรับ production

## โครงสร้างของคำขอ {#request-anatomy}

ตัวอย่างนี้ใช้เส้นทาง Chat Completions ที่เข้ากันได้กับ OpenAI:

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### ส่วนหัวที่จำเป็น {#required-headers}

| ส่วนหัว | ค่า | คำอธิบาย |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | SandBase API key ของคุณ |
| `Content-Type` | `application/json` | รูปแบบของเนื้อหาคำขอ |

### เนื้อหาคำขอ {#request-body}

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

### พารามิเตอร์ในเนื้อหาคำขอ {#body-parameters}

| พารามิเตอร์ | ชนิด | จำเป็น | คำอธิบาย |
|-----------|------|----------|-------------|
| `model` | string | ใช่ | model ID ที่เปิดใช้งานซึ่งได้จาก `GET /v1/models` (เช่น `deepseek/deepseek-v4-flash`) |
| `messages` | array | ใช่ | ประวัติบทสนทนาเป็นอาร์เรย์ของออบเจ็กต์ข้อความ |
| `temperature` | number | ไม่ | อุณหภูมิการสุ่ม (0–2) การรองรับและค่าเริ่มต้นอาจต่างกันตามโมเดล |
| `max_tokens` | integer | ไม่ | จำนวนโทเค็นสูงสุดที่จะสร้างในการตอบกลับ |
| `top_p` | number | ไม่ | พารามิเตอร์ nucleus sampling (0–1) |
| `stream` | boolean | ไม่ | จะสตรีมการตอบกลับหรือไม่ ค่าเริ่มต้น: `false` |
| `stop` | string หรือ array | ไม่ | ลำดับหยุด การสร้างจะหยุดเมื่อพบลำดับเหล่านี้ |
| `frequency_penalty` | number | ไม่ | บทลงโทษการซ้ำที่เข้ากันได้กับผู้ให้บริการ เมื่อรองรับ |
| `presence_penalty` | number | ไม่ | บทลงโทษ presence ที่เข้ากันได้กับผู้ให้บริการ เมื่อรองรับ |

### บทบาทของข้อความ {#message-roles}

| บทบาท | วัตถุประสงค์ |
|------|---------|
| `system` | กำหนดพฤติกรรมและบุคลิกของผู้ช่วย |
| `user` | อินพุตจากผู้ใช้ |
| `assistant` | การตอบกลับก่อนหน้าของผู้ช่วย (สำหรับบทสนทนาหลาย turn) |
| `developer`, `tool` | บทบาทเพิ่มเติมที่เข้ากันได้กับ OpenAI เมื่อโมเดลและเส้นทางที่เลือกรองรับ |

## ตัวอย่างคำขอฉบับเต็ม {#full-request-example}

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

## โครงสร้างของการตอบกลับ {#response-structure}

### การตอบกลับแบบไม่สตรีมโดยทั่วไป {#typical-non-streaming-response}

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

### คำอธิบายฟิลด์ของการตอบกลับ {#response-fields-explained}

| ฟิลด์ | คำอธิบาย |
|-------|-------------|
| `id` | ตัวระบุเฉพาะของ completion นี้ |
| `object` | ออบเจ็กต์การตอบกลับที่เข้ากันได้กับ OpenAI โดยปกติเป็น `"chat.completion"` บนเส้นทางนี้ |
| `created` | Unix timestamp ของเวลาที่สร้างการตอบกลับ |
| `model` | โมเดลที่สร้างการตอบกลับ |
| `choices` | อาร์เรย์ของตัวเลือก completion (โดยปกติมีหนึ่งรายการ) |
| `choices[].index` | ลำดับของตัวเลือกนี้ในอาร์เรย์ |
| `choices[].message.role` | บทบาทของข้อความที่สร้างขึ้น โดยปกติเป็น `"assistant"` |
| `choices[].message.content` | ข้อความที่สร้างขึ้น |
| `choices[].finish_reason` | เหตุผลที่การสร้างหยุด (ดูด้านล่าง) |
| `usage.prompt_tokens` | จำนวนโทเค็นในอินพุตของคุณ |
| `usage.completion_tokens` | จำนวนโทเค็นในเอาต์พุตที่สร้างขึ้น |
| `usage.total_tokens` | ผลรวมของโทเค็น prompt + completion |

### เหตุผลที่หยุด {#finish-reasons}

เหตุผลที่หยุดขึ้นอยู่กับผู้ให้บริการ ค่าที่พบบ่อยซึ่งเข้ากันได้กับ OpenAI ได้แก่:

| ค่า | ความหมายโดยทั่วไป |
|-------|---------|
| `stop` | การตอบกลับจบตามธรรมชาติหรือพบลำดับหยุด |
| `length` | ถึงขีดจำกัด `max_tokens` การตอบกลับถูกตัด |

ให้ถือว่าค่าที่ไม่รู้จักเป็นเอาต์พุตที่ถูกต้องจากผู้ให้บริการ แทนการปฏิเสธการตอบกลับ

## การตอบกลับแบบสตรีม {#streaming-responses}

สำหรับเอาต์พุตแบบเรียลไทม์ (เหมือนแชตบอตที่กำลังพิมพ์) ให้ใช้การสตรีม การตอบกลับจะมาเป็น Server-Sent Events (SSE):

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

### รูปแบบ SSE ของการสตรีม {#streaming-sse-format}

สตรีมที่เข้ากันได้โดยทั่วไปจะส่ง Server-Sent Events ลักษณะนี้:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

ประเด็นสำคัญ:

- อ่าน chunk ตามลำดับและต่อท้ายส่วน `delta.content` ทั้งหมด
- รองรับ chunk ที่มีเฉพาะ metadata, delta ที่ว่าง และฟิลด์ที่เข้ากันได้กับผู้ให้บริการที่คุณไม่รู้จัก
- หยุดเมื่อสตรีมปิดหรือได้รับเครื่องหมายสิ้นสุด โดย Chat Completions มักใช้ `data: [DONE]`
- อย่าคาดหวังว่าทุกโมเดลจะส่ง chunk แรกหรือ chunk สุดท้ายที่มีรูปแบบเหมือนกันทุกประการ

## การใช้ Anthropic SDK {#using-the-anthropic-sdk}

SandBase ยังมี endpoint ที่เข้ากันได้กับ Anthropic ที่ `POST /v1/messages` ใช้ Anthropic SDK ได้โดยเปลี่ยน `base_url`:

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

### โครงสร้างการตอบกลับของ Anthropic {#anthropic-response-structure}

endpoint ที่เข้ากันได้กับ Anthropic ส่งคืนการตอบกลับแบบ Anthropic การตอบกลับแบบข้อความโดยทั่วไปมีลักษณะดังนี้:

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

| ฟิลด์ | คำอธิบาย |
|-------|-------------|
| `id` | Message ID (ขึ้นต้นด้วย `msg_`) |
| `type` | ชนิดของออบเจ็กต์ข้อความ โดยปกติเป็น `"message"` |
| `role` | บทบาทของข้อความที่สร้างขึ้น โดยปกติเป็น `"assistant"` |
| `content` | อาร์เรย์ของบล็อกเนื้อหาแบบมีชนิด อย่าคาดหวังว่าทุกบล็อกจะเป็นข้อความ |
| `model` | โมเดลที่สร้างการตอบกลับ |
| `stop_reason` | `"end_turn"` (หยุดตามธรรมชาติ), `"max_tokens"` (ถึงขีดจำกัด) หรือ `"stop_sequence"` |
| `usage.input_tokens` | จำนวนโทเค็นในอินพุตของคุณ |
| `usage.output_tokens` | จำนวนโทเค็นในเอาต์พุตที่สร้างขึ้น |

### การสตรีมด้วย Anthropic {#anthropic-streaming}

การสตรีมด้วย Anthropic SDK ทำงานแบบเดียวกัน เพียงส่ง `stream=True`:

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

## การเลือกโมเดล {#choosing-a-model}

เมื่อเลือกโมเดล ให้ตรวจสอบ model card ล่าสุดเพื่อดูความพร้อมใช้งาน ราคา ความยาว context อินพุตที่รองรับ และความสามารถ ค่าเหล่านี้เปลี่ยนแปลงแยกกัน จึงไม่ควรพึ่งพาตารางเปรียบเทียบโมเดลที่คัดลอกมา

- ดู [แคตตาล็อกโมเดล](https://www.sandbase.ai/models) ปัจจุบัน
- เปิดหน้าของโมเดลในแคตตาล็อกเพื่อดูฟิลด์คำขอเฉพาะของโมเดลนั้น
- เรียก `GET /v1/models` เมื่อการเชื่อมต่อต้องการ metadata ล่าสุดของโมเดลผ่านโปรแกรม

สำหรับโมเดลที่ใช้อินเทอร์เฟซที่เข้ากันได้เหมือนกัน การสลับโมเดลมักเริ่มจากพารามิเตอร์ `model` ให้ตรวจสอบความสามารถและ schema ของโมเดลที่เลือกอีกครั้งก่อนนำฟิลด์เสริม เครื่องมือ อินพุตสื่อ หรือการตั้งค่าเอาต์พุตแบบมีโครงสร้างไปใช้ต่อ

## ขั้นตอนถัดไป {#next-steps}

ก่อนใช้งาน production ให้ตั้ง timeout ของคำขอ ลองใหม่เฉพาะข้อผิดพลาดชั่วคราวด้วย exponential backoff ที่มีขอบเขต บันทึก request ID เมื่อมี และติดตามการใช้งานโดยไม่บันทึก prompt หรือ API key

- [**เอกสารอ้างอิง API**](/api-reference/): endpoint สำหรับการอนุมานและข้อกำหนดของ Platform API
- [**คู่มือการสตรีม**](/guides/streaming): รูปแบบการสตรีมขั้นสูงและการจัดการข้อผิดพลาด
- [**โมเดล**](https://www.sandbase.ai/models): การค้นหาโมเดล ความสามารถ และราคาปัจจุบัน
- [**ข้อผิดพลาด**](/guides/error-handling): การจัดการข้อผิดพลาดและการลองใหม่
