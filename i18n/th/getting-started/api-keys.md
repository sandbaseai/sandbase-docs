---
i18nSource: 3dc57d405dbf561d
title: API key
description: วิธีสร้าง จัดการ และรักษาความปลอดภัยของ SandBase API key สำหรับยืนยันตัวตนคำขอ API
---

# API key {#api-keys}

API key ใช้ยืนยันตัวตนคำขอของคุณที่ส่งไปยัง SandBase คู่มือนี้อธิบายวิธีสร้างคีย์ ใช้คีย์ในคำขอ และรักษาความปลอดภัยของคีย์

## สร้าง API key {#create-an-api-key}

1. ลงชื่อเข้าใช้ [SandBase Console](https://www.sandbase.ai/console)
2. เปิด **Developer → API Keys** (หรือไปที่ [API Keys](https://www.sandbase.ai/console/keys) โดยตรง)
3. คลิก **New key**
4. กรอก **Name** ที่สื่อความหมาย (เช่น "Production Server", "Local Development")
5. ตั้งค่า **Spending limit** (เว้นว่างหมายถึงไม่จำกัด) และวันที่ **Expires** (เว้นว่างหมายถึงไม่มีวันหมดอายุ) ได้ตามต้องการ
6. คลิก **Create key**
7. คัดลอกคีย์จากแบนเนอร์ **API key created** ทันที เพราะคีย์จะแสดงเพียงครั้งเดียว

::: danger สำคัญ
API key จะแสดงเพียงครั้งเดียวตอนสร้าง หากทำคีย์หาย คุณจะต้องสร้างคีย์ใหม่ ให้จัดเก็บคีย์อย่างปลอดภัยก่อนปิดกล่องโต้ตอบ
:::

## รูปแบบของคีย์ {#key-format}

API key ใหม่ที่สร้างใน Console จะขึ้นต้นด้วย `sk-` ตามด้วยอักขระฐานสิบหก 64 ตัว:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

คีย์ `sk-sb-...` ที่มีอยู่เดิมยังใช้งานได้จนกว่าจะหมดอายุหรือถูกเพิกถอน อย่าใช้เพียง prefix เพื่อตรวจสอบ
ข้อมูลรับรอง ให้ถือว่าค่าทั้งหมดเป็นความลับแบบทึบเสมอ

## วิธียืนยันตัวตน {#authentication-methods}

SandBase รองรับการส่ง API key ในคำขอได้สองวิธี:

### เฮดเดอร์ Authorization (แนะนำ) {#authorization-header-recommended}

ใช้เฮดเดอร์มาตรฐาน `Authorization: Bearer` ซึ่งเข้ากันได้กับ SDK ของ OpenAI และ Anthropic:

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages: เฮดเดอร์ x-api-key {#anthropic-messages-x-api-key-header}

`POST /v1/messages` รับเฮดเดอร์ `x-api-key` แบบ native ของ Anthropic ได้ด้วย:

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
ในบรรดา model gateway มีเพียง `POST /v1/messages` ที่อ่าน `x-api-key` และจะให้ความสำคัญกับเฮดเดอร์นี้ก่อนเมื่อมีเฮดเดอร์ที่รองรับทั้งสองรายการ
[รีซอร์สของแพลตฟอร์ม Agents](/api-reference/authentication#agents-platform-resources) ก็รับ
`X-API-Key` เช่นกัน สำหรับ endpoint สาธารณะอื่นทั้งหมดให้ใช้เฮดเดอร์ Bearer
:::

## สิทธิ์ของคีย์ {#key-permissions}

API key ของ SandBase มีขอบเขตอยู่ที่**ระดับองค์กร**:

- คีย์มาตรฐานที่สร้างจาก Console สามารถเรียกรีซอร์ส API สาธารณะที่องค์กรใช้ได้
- การใช้งานจะเรียกเก็บเงินจากองค์กรที่เป็นเจ้าของคีย์
- คีย์สามารถกำหนดวันหมดอายุและขีดจำกัดการใช้จ่ายได้ (ไม่บังคับ)
- ข้อมูลรับรองที่ SandBase ออกให้ เช่น คีย์ CLI Login อาจมีขอบเขตจำกัด และจะได้ `403` เมื่อใช้นอกขอบเขตนั้น

ปัจจุบัน Console ยังไม่มีตัวเลือกให้ผู้ใช้กำหนดขอบเขตของคีย์มาตรฐาน คีย์ CLI Login จะถูกสร้างขึ้นเมื่อคุณเชื่อมต่อเครื่องมือ AI หน้า API Keys จะจัดกลุ่มคีย์เหล่านี้ไว้ในแถว **CLI Login** ที่ขยายได้แถวเดียว และไม่สามารถแก้ไขได้เหมือนคีย์มาตรฐาน คีย์ที่ SandBase สร้างให้คุณจะมีป้าย **Auto-created** โดยไม่มีขีดจำกัดระดับคีย์และจำกัดด้วยยอดคงเหลือของบัญชี

รายการคีย์จะแสดง **Name**, **Key Prefix**, **Spent**, **Limit**, **Expires** และ **Status** ของแต่ละคีย์ ใช้ **Edit** เพื่อเปลี่ยนชื่อ ขีดจำกัดการใช้จ่าย หรือวันหมดอายุของคีย์มาตรฐาน

ให้ถือว่าแต่ละคีย์เป็นข้อมูลรับรองของแอปพลิเคชัน ไม่ใช่รหัสผ่านส่วนตัว ใช้การเป็นสมาชิกองค์กรสำหรับการเข้าถึงของบุคคล และใช้ API key สำหรับงานของระบบ

## กลยุทธ์ตามสภาพแวดล้อม {#environment-strategy}

สร้างคีย์แยกกันสำหรับแต่ละแอปพลิเคชันและสภาพแวดล้อม:

| คีย์ | ตัวอย่างชื่อ | เหตุผล |
|---|---|---|
| การพัฒนาในเครื่อง | `research-app-dev` | หมุนเวียนคีย์ได้โดยไม่รบกวน production |
| Staging | `research-app-staging` | แยกการใช้งานทดสอบและเหตุขัดข้องออกจากกัน |
| Production | `research-app-production` | กำหนดเจ้าของที่ชัดเจนให้ production และจำกัดความเสี่ยงจากการรั่วไหล |
| ระบบอัตโนมัติชั่วคราว | `release-check-2026-08` | ตั้งวันหมดอายุและเพิกถอนได้อย่างอิสระ |

บันทึกเจ้าของและการ deploy ที่ใช้แต่ละคีย์ ระหว่างการหมุนเวียนคีย์ ให้ deploy คีย์ใหม่ ตรวจสอบว่าคำขอสำเร็จ แล้วจึงเพิกถอนคีย์เดิม

## การหมดอายุและการเพิกถอนคีย์ {#key-expiration-and-revocation}

### การหมดอายุ {#expiration}

เมื่อสร้างคีย์ คุณสามารถตั้งวันหมดอายุได้ (ไม่บังคับ) เมื่อหมดอายุแล้ว คีย์จะหยุดทำงานและคำขอจะได้ข้อผิดพลาด `401 Unauthorized`

คีย์ที่ไม่มีวันหมดอายุจะใช้งานได้จนกว่าจะถูกเพิกถอนด้วยตนเอง

### การเพิกถอนคีย์ {#revoking-a-key}

หากต้องการเพิกถอน (ปิดใช้งาน) คีย์:

1. ไปที่ [Developer → API Keys](https://www.sandbase.ai/console/keys)
2. ค้นหาคีย์ที่ต้องการเพิกถอน
3. คลิก **Revoke**
4. ยืนยันการดำเนินการ

คีย์ที่ถูกเพิกถอนจะยืนยันตัวตนคำขอใหม่ไม่ได้ และการเพิกถอนไม่สามารถย้อนกลับได้ หากเพิกถอนคีย์ผิดพลาด ให้สร้างคีย์ใหม่

## แนวทางปฏิบัติด้านความปลอดภัย {#security-best-practices}

### ห้าม commit คีย์ลงใน version control {#never-commit-keys-to-version-control}

ให้ใช้ตัวแปรสภาพแวดล้อมหรือ secrets manager แทน:

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### ใช้คีย์แยกกันสำหรับแต่ละสภาพแวดล้อม {#use-separate-keys-for-different-environments}

สร้างคีย์แยกกันสำหรับ development, staging และ production วิธีนี้ช่วยให้คุณเพิกถอนคีย์ development ที่รั่วไหลได้โดยไม่กระทบ production

### หมุนเวียนคีย์อย่างสม่ำเสมอ {#rotate-keys-regularly}

สร้างคีย์ใหม่และเลิกใช้คีย์เก่าเป็นระยะ เพื่อจำกัดช่วงเวลาที่เสี่ยงหากคีย์รั่วไหล

### ติดตามกิจกรรม {#monitor-activity}

ตรวจสอบ **Developer → Activities** เป็นประจำเพื่อดูคำขอหรือการใช้งานที่พุ่งสูงผิดปกติ ซึ่งอาจบ่งชี้ว่าคีย์ถูกบุกรุก **Request History** สามารถกรองตาม API key ได้

หากคีย์รั่วไหล ให้เพิกถอนทันที สร้างคีย์ทดแทน อัปเดตแอปพลิเคชันที่ใช้คีย์ และตรวจสอบ Activities และการเรียกเก็บเงินเพื่อหาการใช้งานที่ผิดปกติ อย่ารอจนถึงรอบการหมุนเวียนตามกำหนด

### ตั้งวันหมดอายุ {#set-expiration-dates}

สำหรับการเข้าถึงชั่วคราว (ไปป์ไลน์ CI/CD การเข้าถึงของผู้รับจ้าง การสาธิต) ให้ตั้งวันหมดอายุเพื่อให้คีย์หยุดทำงานโดยอัตโนมัติ

## การแก้ไขปัญหา {#troubleshooting}

| ข้อผิดพลาด | สาเหตุ | วิธีแก้ไข |
|-------|-------|-----|
| `401 - missing API key` | ไม่มีคีย์ในคำขอ | เพิ่มเฮดเดอร์ `Authorization: Bearer <key>` |
| `401 - invalid API key` | ไม่มีคีย์นี้อยู่ | ตรวจสอบการพิมพ์ผิดและตรวจสอบว่าใส่คีย์ครบทั้งหมด |
| `401 - API key has been revoked` | คีย์ถูกเพิกถอนถาวรใน Console | สร้างคีย์ทดแทน |
| `401 - API key has expired` | คีย์เลยวันหมดอายุแล้ว | สร้างคีย์ใหม่หรือขยายวันหมดอายุ |
| `402 - API key spending limit exceeded` | คีย์ถึงขีดจำกัดการใช้จ่ายที่กำหนดไว้ | เพิ่มขีดจำกัดหรือใช้คีย์อื่นที่ได้รับอนุญาต |
| `403 - insufficient_scope` | ข้อมูลรับรองที่จำกัดขอบเขตเรียก endpoint นี้ไม่ได้ | ใช้คีย์ที่ได้รับอนุญาตสำหรับ endpoint นั้น |

## ขั้นตอนถัดไป {#next-steps}

- [**การเรียก API ครั้งแรก**](/getting-started/first-call) — เรียก API แบบละเอียดพร้อมคำอธิบายคำขอและ response ทั้งหมด
- [**การยืนยันตัวตน**](/api-reference/authentication) — เฮดเดอร์ที่รองรับ วงจรชีวิต และข้อผิดพลาดเฉพาะโปรโตคอล
- [**เอกสารอ้างอิง API**](/api-reference/) — เอกสาร endpoint ฉบับสมบูรณ์
