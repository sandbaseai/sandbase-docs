---
i18nSource: c922bd433deabf32
title: คู่มือ
description: คู่มือเชิงปฏิบัติสำหรับการใช้ SandBase Models, APIs, Agents, การตั้งค่า การเรียกเก็บเงิน การสตรีม และความเสถียรในโปรดักชัน
---

# คู่มือ {#guides}

คู่มือเหล่านี้ครอบคลุมรูปแบบที่ใช้บ่อยในการใช้งาน SandBase ในโปรดักชัน

## เรียกใช้โมเดล {#call-models}
| คู่มือ | คำอธิบาย |
|-------|-------------|
| [Chat Completions](./chat-completions) | เรียก SandBase ผ่านโปรโตคอลแชตที่เข้ากันได้กับ OpenAI |
| [OpenAI Responses](./openai-responses) | เรียกโมเดล GPT ผ่านโปรโตคอล Responses ที่เข้ากันได้กับ OpenAI |
| [Anthropic Messages](./anthropic-messages) | เรียก SandBase ผ่านโปรโตคอล messages ที่เข้ากันได้กับ Anthropic |
| [Google Gemini](../api-reference/gemini-generate-content) | เรียก SandBase ผ่านโปรโตคอล GenerateContent ที่เข้ากันได้กับ Google Gemini |
| [รูปภาพและวิดีโอ](./image-video) | สร้างรูปภาพและวิดีโอผ่าน Run API แบบอะซิงโครนัสที่ใช้ร่วมกัน |
| [การสตรีม](./streaming) | สตรีมเอาต์พุตของโมเดลที่เข้ากันได้ไปยังแอปพลิเคชันของคุณ |
| [แค็ตตาล็อก API](https://www.sandbase.ai/apis) | เรียกดูความสามารถของ API และ endpoint ที่ระบุผู้ให้บริการ |

## รันในโปรดักชัน {#run-in-production}
| คู่มือ | คำอธิบาย |
|-------|-------------|
| [ข้อผิดพลาดและการลองใหม่](./error-handling) | จำแนกความล้มเหลวและลองใหม่เฉพาะเมื่อการดำเนินการทำซ้ำได้อย่างปลอดภัย |
| [ขีดจำกัดอัตรา](./rate-limiting) | จัดการการตอบกลับ 429 และทำให้คำขอที่เข้ามาเป็นช่วงๆ สม่ำเสมอ |
| [ขีดจำกัดการทำงานพร้อมกัน](./concurrency-limits) | จำนวนงานที่องค์กรของคุณรันพร้อมกันได้ |
| [ราคาและการใช้งาน](./billing) | ทำความเข้าใจเครดิต การใช้งาน และการควบคุมค่าใช้จ่าย |

## เคล็ดลับ {#quick-tips}

- ใช้ [การตั้งค่า](/setup/) เมื่อผู้ใช้ต้องการเครื่องมือใน Codex, Claude, Cursor หรือ Kiro
- ใช้ [Models](https://www.sandbase.ai/models) หรือ [APIs](https://www.sandbase.ai/apis) เมื่อแอปของคุณต้องการความสามารถเพียงอย่างเดียว
- ใช้ [Build Agent](/agents/) เมื่องานมีหลายขั้นตอนหรือควรนำกลับมาใช้ซ้ำ
- ใช้ [Activities](https://www.sandbase.ai/console/activities) ใน Console เพื่อตรวจสอบคำขอและการใช้งานพร้อมกัน
