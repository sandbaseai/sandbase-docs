---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: ใช้ Responses API ที่เข้ากันได้กับ OpenAI กับโมเดล GPT ผ่าน SandBase
---

# OpenAI Responses {#openai-responses}

โมเดล GPT รองรับ Responses API ที่เข้ากันได้กับ OpenAI ที่ `POST /v1/responses`
ใช้ `input` สำหรับ prompt หรือเนื้อหาที่มีโครงสร้าง และอ่านรายการที่สร้างขึ้นจาก
`output`

```bash
curl https://api.sandbase.ai/v1/responses \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/<gpt-model>",
    "input": "Explain immutable infrastructure in one sentence."
  }'
```

## ความเข้ากันได้กับ Chat Completions {#chat-completions-compatibility}

โมเดล GPT เดียวกันยังรองรับ `POST /v1/chat/completions` ด้วย โปรโตคอลนั้น
ใช้ `messages` ในคำขอและ `choices` ใน response ส่วน Responses
ใช้ `input` และ `output` โครงสร้างพารามิเตอร์ของทั้งสองใช้แทนกันไม่ได้
ให้เลือก endpoint ที่ตรงกับ SDK ของคุณ

ดูรูปแบบคำขอที่เข้ากันได้ที่ [Chat Completions](./chat-completions)
และดูฟิลด์และข้อจำกัดเฉพาะของแต่ละโมเดลที่[เอกสารอ้างอิงโมเดล GPT](https://www.sandbase.ai/models)

## ขั้นตอนถัดไป {#next-steps}

- [เอกสารอ้างอิง Responses API](/api-reference/responses)
- [เอกสารอ้างอิง Chat Completions API](/api-reference/llm-gateway)
- [แค็ตตาล็อกโมเดล](https://www.sandbase.ai/models)
