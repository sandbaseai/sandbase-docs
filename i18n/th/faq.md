---
i18nSource: a86346e2696c732c
title: คำถามที่พบบ่อย
description: คำถามที่พบบ่อยเกี่ยวกับการเชื่อมต่อ AI tools แคตตาล็อกของ SandBase, Models, APIs, Agents, Sessions และการเรียกเก็บเงิน
---

# คำถามที่พบบ่อย {#frequently-asked-questions}

## SandBase คืออะไร {#what-is-sandbase}

SandBase ช่วยให้ Agents เชื่อมต่อกับโลกจริงได้

คุณใช้ Models และ APIs สำเร็จรูปได้ ใช้งานจากเครื่องมือ AI ของคุณหลังเชื่อมต่อใน AI tools หรือสร้าง Agents ที่นำกลับมาใช้ซ้ำได้และรันใน Sessions

## SandBase เหมาะกับใคร {#who-is-sandbase-for}

SandBase เหมาะกับสามกลุ่มหลัก:

- **ผู้ใช้เครื่องมือ AI** ที่ต้องการความสามารถที่มีประโยชน์ภายใน Codex, Claude, Cursor หรือ Kiro
- **นักพัฒนา** ที่ต้องการเรียก Models และ APIs โดยตรง
- **FDE และทีม** ที่สร้าง Agents ที่นำกลับมาใช้ซ้ำได้สำหรับลูกค้าหรือเวิร์กโฟลว์ภายใน

## เรียกดูความสามารถได้ที่ไหน {#where-do-i-browse-capabilities}
เว็บไซต์ SandBase แสดงแคตตาล็อกความสามารถ:

- [Models](https://www.sandbase.ai/models) และ[โมเดลภาพและวิดีโอ](https://www.sandbase.ai/models/image-video)
- [APIs](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
คุณตรวจสอบ ทดสอบ ติดตั้ง เรียกใช้ หรือโคลนได้ ขึ้นอยู่กับประเภทของความสามารถ

## AI tools คืออะไร {#what-is-ai-tools}

**Build → AI tools** ใน Console จะเชื่อมต่อ SandBase เข้ากับเครื่องมือ AI ที่คุณใช้อยู่แล้ว เช่น Claude Code, Codex, Cursor หรือ Kiro วาง `set up https://www.sandbase.ai/SKILL.md` ลงใน agent ของคุณ หรือรัน `npx -y @sandbaseai/cli@latest connect` เครื่องมือที่เชื่อมต่อแล้วจะค้นหาและรัน Models และ APIs ในแคตตาล็อกของ SandBase ได้ โดยเรียกเก็บเงินจาก workspace ของคุณ ดู[เชื่อมต่อ AI tools](/setup/)

## Build Agent คืออะไร {#what-is-build-agent}

Build Agent คือที่ที่คุณกำหนดและทดสอบ Agent

Agent รวมคำสั่ง Model, Skills และเครื่องมือ MCP ไว้เป็นเวิร์กโฟลว์เดียวที่นำกลับมาใช้ซ้ำได้และมีเวอร์ชัน

## Agent ต่างจาก API หรือไม่ {#is-an-agent-different-from-an-api}
ใช่ Agent คือการกำหนดค่าที่มีเวอร์ชันซึ่งคุณแก้ไขและทดสอบได้ และรันได้ด้วยการสร้าง Session แอปของคุณสร้าง Sessions ได้ด้วย [Sessions API](/api-reference/sessions/) ขณะที่คุณยังแก้ไข Agent ต่อไปได้

## Sessions คืออะไร {#what-are-sessions}
Session คือการทำงานของ Agent หนึ่งครั้ง พร้อมบทสนทนา กิจกรรมของเครื่องมือ และเอาต์พุต

## จะให้ Agent เข้าถึง API ภายนอกได้อย่างไร {#how-do-i-give-an-agent-access-to-external-apis}

เชื่อมต่อระบบภายนอกเป็นเซิร์ฟเวอร์ MCP แล้วเพิ่มลงในการเชื่อมต่อ MCP ของ Agent หากเซิร์ฟเวอร์ต้องใช้ Bearer token ให้จัดเก็บด้วย [Secrets API](/agents/api-credentials#with-the-api) เป็น Secret แบบเขียนได้อย่างเดียวที่ผูกกับ URL ของเซิร์ฟเวอร์นั้น โทเค็นจะถูกส่งไปยังเซิร์ฟเวอร์นั้นเท่านั้น และจะไม่ปรากฏใน prompt หรือรันไทม์ของ Agent ดู[ข้อมูลรับรองสำหรับเครื่องมือ MCP](/agents/api-credentials)

## Models อยู่ที่ไหน {#where-do-models-live}

Models มี[แคตตาล็อก](https://www.sandbase.ai/models)ของตนเอง เพราะเป็นองค์ประกอบพื้นฐานที่สำคัญ

คุณเรียก Model ได้โดยตรง ใช้จากเครื่องมือ AI ที่เชื่อมต่อ หรือใช้ภายใน Agent

## ต้องเขียนโค้ดหรือไม่ {#do-i-need-to-write-code}

ไม่เสมอไป

[เชื่อมต่อเครื่องมือ AI ของคุณ](/setup/) หากต้องการใช้ความสามารถภายในเครื่องมือนั้นโดยไม่ต้องเขียนโค้ด

ใช้ API Reference หากต้องการเรียก SandBase จากแอปพลิเคชันของคุณ

ใช้ Build Agent หากต้องการงานหลายขั้นตอนที่นำกลับมาใช้ซ้ำได้

## จะรับ API key ได้อย่างไร {#how-do-i-get-an-api-key}

เปิด Console ไปที่ **Developer → API Keys** แล้วเลือก **New key**

ใช้คีย์ดังนี้:

```http
Authorization: Bearer sk-YOUR_KEY
```

## การเรียกเก็บเงินทำงานอย่างไร {#how-does-billing-work}

SandBase ใช้เครดิตและการเรียกเก็บเงินตามการใช้งาน

Models, APIs, Agents และงานรันไทม์อาจมีค่าใช้จ่ายต่างกัน ตรวจสอบการใช้งานและราคาปัจจุบันได้ใน Console

## ขั้นตอนถัดไป {#next-steps}

- [เริ่มต้นใช้งาน](/getting-started/)
- [แคตตาล็อก Models และ APIs](https://www.sandbase.ai/models)
- [เชื่อมต่อ AI tools](/setup/)
- [Build Agent](/agents/)
- [API Reference](/api-reference/)
