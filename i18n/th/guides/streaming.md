---
i18nSource: 335b45fb98c53890
title: การตอบกลับแบบสตรีม
description: สตรีมเอาต์พุตของโมเดล SandBase ด้วย SDK ที่เข้ากันได้กับ OpenAI หรือ Anthropic และจัดการผลลัพธ์บางส่วนอย่างปลอดภัย
---

# การตอบกลับแบบสตรีม {#streaming-responses}

การสตรีมจะส่งคืนเอาต์พุตของโมเดลทันทีที่พร้อม SandBase คงรูปแบบอีเวนต์ของ API ที่เข้ากันได้ซึ่งคุณ
เรียกใช้ไว้: OpenAI Chat Completions ใช้ Server-Sent Events (SSE) แบบมีเฉพาะ data ส่วน Anthropic Messages ใช้อีเวนต์ SSE แบบมีชื่อ

ใช้ SDK อย่างเป็นทางการที่เข้ากันได้เมื่อทำได้ SDK จะจัดการการแบ่งเฟรมอีเวนต์ อาร์กิวเมนต์ของ tool call ที่ทยอยมา และการสิ้นสุด
ตามโปรโตคอลได้ปลอดภัยกว่าการแยกข้อความการตอบกลับดิบด้วยตนเอง

## OpenAI Chat Completions {#openai-chat-completions}

ตั้งค่า `stream: true` บน `POST /v1/chat/completions`

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

chunk ที่เข้ากันได้กับ OpenAI จะใส่ข้อความที่ทยอยมาไว้ใน `choices[0].delta.content` ส่วนอาร์กิวเมนต์ของ tool call เมื่อ
โมเดลที่เลือกรองรับ จะมาเป็นส่วนของสตริงใน `delta.tool_calls` ให้ต่อส่วนเหล่านี้ตาม index ของ choice และ tool call
ก่อนแยกวิเคราะห์ JSON ที่สมบูรณ์ โดยปกติสตรีมจะจบด้วย `data: [DONE]`

อย่าคาดหวังว่าผู้ให้บริการทุกรายจะส่งคืนข้อมูลการใช้โทเค็นในสตรีม หากโมเดลที่เลือกรองรับ
`stream_options.include_usage` ของ OpenAI ข้อมูลการใช้งานอาจปรากฏใกล้ช่วงท้าย มิฉะนั้นให้ใช้การตอบกลับแบบไม่สตรีมหรือ
ขั้นตอนดูค่าใช้จ่ายของ task ที่เกี่ยวข้อง

## Anthropic Messages {#anthropic-messages}

ใช้ Anthropic SDK กับ `POST /v1/messages` ตัวช่วยสตรีมของ SDK จะประกอบอีเวนต์แบบมีชื่อและบล็อกเนื้อหาให้

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

สตรีมดิบของ Anthropic ใช้ชื่ออีเวนต์ เช่น `message_start`, `content_block_start`, `content_block_delta`,
`content_block_stop`, `message_delta` และ `message_stop` ข้อความจะอยู่ในบล็อก `text_delta` ส่วนอินพุตของเครื่องมือใช้
บล็อก JSON ที่ทยอยมาและต้องประกอบให้ครบก่อนแยกวิเคราะห์

## จัดการการขัดจังหวะและการยกเลิก {#handle-interruption-and-cancellation}

ข้อผิดพลาด HTTP ที่ส่งคืนก่อนเริ่มสตรีมจะใช้เนื้อหาข้อผิดพลาดตามปกติของ endpoint หลังจากการตอบกลับเริ่มขึ้นแล้ว
ความล้มเหลวของเครือข่ายอาจทำให้ได้ข้อความเพียงบางส่วนโดยไม่มีอีเวนต์สุดท้าย ให้ถือว่าเอาต์พุตสมบูรณ์ก็ต่อเมื่อได้รับ
สัญญาณสิ้นสุดตามปกติของโปรโตคอลแล้วเท่านั้น

- แยกเอาต์พุตบางส่วนออกจากสถานะของแอปพลิเคชันที่บันทึกแล้ว
- กำหนดขอบเขต timeout ของการเชื่อมต่อและการไม่มีความเคลื่อนไหวในไคลเอนต์หรือ proxy ของคุณเองให้เหมาะกับงาน
- ใช้กลไกการยกเลิกของ SDK หรือ `AbortController` ใน JavaScript เมื่อผู้ใช้หยุดการสร้าง
- อย่าต่อสตรีมที่ลองใหม่เข้ากับเอาต์พุตบางส่วนโดยอัตโนมัติ เพราะการลองใหม่คือการสร้างใหม่
- หลีกเลี่ยงการบัฟเฟอร์ SSE ใน reverse proxy ที่คุณควบคุม

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

เมื่ออ่าน SSE ดิบ ให้แยกวิเคราะห์เฟรมอีเวนต์ที่สมบูรณ์ซึ่งคั่นด้วยบรรทัดว่าง chunk ของเครือข่ายไม่ได้ตรงกันแบบหนึ่งต่อหนึ่ง
กับอีเวนต์ SSE และอักขระ UTF-8 หนึ่งตัวอาจคร่อมหลาย chunk ให้ใช้ตัวถอดรหัสข้อความแบบสตรีม และเก็บเฟรมที่ยังไม่สมบูรณ์ไว้
จนกว่าจะได้รับไบต์เพิ่มเติม

## แนวทางที่เกี่ยวข้อง {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [การจัดการข้อผิดพลาด](/guides/error-handling)
- [ขีดจำกัดอัตรา](/guides/rate-limiting)
