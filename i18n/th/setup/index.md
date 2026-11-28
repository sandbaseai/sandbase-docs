---
i18nSource: 28b1ef75a197824a
title: เชื่อมต่อเครื่องมือ AI
description: มอบแค็ตตาล็อก Models และ APIs ของ SandBase ให้กับ Claude Code, Codex, Cursor, Kiro และเครื่องมือ AI อื่น ๆ ด้วย prompt เดียวหรือคำสั่ง CLI เดียว
---

# เชื่อมต่อเครื่องมือ AI {#connect-ai-tools}

หน้า [AI tools](https://www.sandbase.ai/console/setup) ใน Console (**Build → AI tools**) ใช้เชื่อมต่อ SandBase เข้ากับ Agent หรือเครื่องมือ AI ที่คุณใช้อยู่แล้ว เครื่องมือที่เชื่อมต่อแล้วสามารถค้นหาแค็ตตาล็อก Models และ APIs ของ SandBase อ่าน input schema และราคาของแต่ละเครื่องมือ และรันเครื่องมือนั้นได้ การเรียกทุกครั้งจะเรียกเก็บเงินจาก workspace ที่ใช้งานอยู่

ไคลเอนต์ที่รองรับได้แก่ Claude Code, Codex, Cursor, Kiro IDE และ Kiro CLI, Windsurf, Gemini CLI, OpenCode, Qwen Code, Warp, Amp, Crush, OpenClaw, Hermes, Claude Desktop และ ChatGPT หน้า AI tools จะแสดงรายการปัจจุบัน

## เริ่มต้นอย่างรวดเร็ว: วาง prompt เดียว {#quick-start-paste-one-prompt}

วางบรรทัดนี้ลงใน Agent ของคุณ:

```text
set up https://www.sandbase.ai/SKILL.md
```

Agent จะอ่าน SandBase Skill ติดตั้ง CLI และขอให้คุณอนุมัติการลงชื่อเข้าใช้ผ่านเบราว์เซอร์หนึ่งครั้ง คุณไม่ต้องวาง API key เมื่อ Agent รายงานว่ากำหนดค่าไคลเอนต์แล้ว ให้เริ่ม session ใหม่หรือรีสตาร์ตแอปเพื่อให้เครื่องมือ `sandbase_*` โหลดขึ้นมา

Skill ต้องใช้ Node.js 20 ขึ้นไปบนเครื่องที่รัน Agent

## วิธีเชื่อมต่ออื่น {#other-ways-to-connect}

### CLI {#cli}

เชื่อมต่อจากเทอร์มินัล หากไม่ระบุ `--client` CLI จะกำหนดค่าไคลเอนต์ที่รองรับทั้งหมดที่พบ:

```sh
npx -y @sandbaseai/cli@latest connect
```

หากต้องการกำหนดค่าไคลเอนต์เดียว ให้ส่ง id ของไคลเอนต์นั้น เช่น `codex`, `claude-code`, `cursor` หรือ `kiro`:

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

สคริปต์ติดตั้งจะรันคำสั่งเดียวกัน:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

หากต้องการแสดงรายการไคลเอนต์ที่ตัวติดตั้งรู้จักโดยไม่เปลี่ยนการกำหนดค่าในเครื่อง:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` จะเปิดการให้สิทธิ์ผ่านเบราว์เซอร์ สร้างคีย์ **CLI Login** สำหรับ workspace ที่คุณอนุมัติ และเขียนเฉพาะการกำหนดค่าไคลเอนต์ที่เป็นของ SandBase เท่านั้น [SandBase CLI](https://github.com/sandbaseai/cli) แบบโอเพนซอร์สมีเอกสารของแต่ละไคลเอนต์

### ไคลเอนต์ MCP ที่กำหนดค่าด้วยตนเอง {#mcp-clients-you-configure-by-hand}

ผู้ใช้ที่ลงชื่อเข้าใช้แล้วจะเห็นที่อยู่ของเซิร์ฟเวอร์ MCP ใต้ **Other ways to connect** ในหน้า [AI tools](https://www.sandbase.ai/console/setup) ให้ยืนยันตัวตนด้วย [API key](/getting-started/api-keys) จาก **Developer → API Keys** และเก็บคีย์ไว้ในการกำหนดค่าความลับของไคลเอนต์

## ตรวจสอบการเชื่อมต่อ {#verify-the-connection}

การติดตั้งหรือการให้สิทธิ์เพียงอย่างเดียวไม่ได้พิสูจน์ว่าไคลเอนต์เชื่อมต่อแล้ว ให้ยืนยันว่า:

- เซิร์ฟเวอร์หรือ connector ของ SandBase ปรากฏในไคลเอนต์
- ค้นพบเครื่องมือ `sandbase_*` ได้ใน session ใหม่
- คำขอภาษาธรรมชาติที่ปลอดภัยหนึ่งรายการทำงานสำเร็จ

สำหรับไคลเอนต์ที่จัดการโดย CLI ให้รันการวินิจฉัยหลังจากเชื่อมต่อใหม่หรือเปลี่ยนการกำหนดค่า:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` จะตรวจสอบข้อมูลรับรองในเครื่อง รายการ MCP และ Skill จากนั้นจะส่งคำขอไปกลับยัง SandBase หนึ่งครั้ง ให้ทำการเรียกเครื่องมือขั้นสุดท้ายภายในไคลเอนต์เองเสมอ

การรันที่เครื่องมือที่เชื่อมต่อทำจะแสดงใน [Activities](https://www.sandbase.ai/console/activities) พร้อมค่าใช้จ่าย

## การแก้ไขปัญหา {#troubleshooting}

| ปัญหา | สิ่งที่ควรตรวจสอบ |
|---|---|
| เครื่องมือไม่ปรากฏ | เริ่ม session ใหม่ของไคลเอนต์หรือรีสตาร์ตแอป รัน `npx -y @sandbaseai/cli doctor --client <client>` แล้วลองใหม่ |
| ไม่มีการให้สิทธิ์ | รัน `connect` อีกครั้งและอนุมัติการลงชื่อเข้าใช้ผ่านเบราว์เซอร์สำหรับ workspace ที่ต้องการให้เรียกเก็บเงิน |
| การเรียกล้มเหลวด้วย HTTP 402 | เพิ่มเครดิตใน [Billing](https://www.sandbase.ai/console/billing) สำหรับ workspace ที่ใช้งานอยู่ |

## ลบการกำหนดค่าที่จัดการไว้ {#remove-the-managed-configuration}

ลบเฉพาะรายการที่เป็นของ SandBase สำหรับไคลเอนต์หนึ่งรายการ:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

คำสั่งนี้จะลบเฉพาะการกำหนดค่าที่ตรวจสอบได้ว่าเป็นของ SandBase และจะไม่เปลี่ยนแปลงรายการที่ไม่เกี่ยวข้องหรือที่ผู้ใช้จัดการเอง จากนั้นให้เพิกถอนคีย์ **CLI Login** ที่ตรงกันใต้ **Developer → API Keys** หากไม่ต้องการใช้แล้ว

## ซอร์สโค้ดและการสนับสนุน {#source-and-support}

- [ซอร์สโค้ด](https://github.com/sandbaseai/cli)
- [แพ็กเกจ npm](https://www.npmjs.com/package/@sandbaseai/cli)
- [คำถามและตัวอย่าง](https://github.com/sandbaseai/cli/discussions)
- [รายงานบั๊ก](https://github.com/sandbaseai/cli/issues/new/choose)

## ขั้นตอนถัดไป {#next-steps}

- [แค็ตตาล็อก Models และ APIs](https://www.sandbase.ai/models)
- [บทแนะนำ Skill](/guides/skills/)
- [สร้าง Agent](/agents/)
