---
i18nSource: 5b94f91222d138de
title: การยืนยันตัวตนของ API
description: ยืนยันตัวตนกับ SandBase API ด้วย Bearer token และส่วนหัว API key ที่เข้ากันได้กับโปรโตคอลที่รองรับ
---

# การยืนยันตัวตน {#authentication}

SandBase ใช้ API key เพื่อยืนยันตัวตนของคำขอ API สาธารณะ หน้านี้อธิบายวิธีการเชื่อมต่อที่รองรับและ
แนวทางการจัดการคีย์ การยืนยันตัวตนของ Console และ API ภายในของ Console ไม่ได้เป็นส่วนหนึ่งของข้อกำหนด API สาธารณะ

## วิธีการยืนยันตัวตน {#authentication-methods}

endpoint มาตรฐาน `/v1/*` ของ SandBase ต้องใช้ Bearer token ส่วนการดำเนินการ Anthropic Messages และที่เข้ากันได้กับ Google Gemini ยังรับ API key ในตำแหน่งที่เข้ากันได้กับ SDK ดั้งเดิมของแต่ละรายด้วย

### Bearer token {#bearer-token}

ใส่คีย์ในส่วนหัว `Authorization`:

```http
Authorization: Bearer sk-your-api-key
```

นี่คือวิธีมาตรฐานที่ SDK ที่เข้ากันได้กับ OpenAI ใช้

### Anthropic Messages: ส่วนหัว x-api-key {#anthropic-messages-x-api-key-header}

ใส่คีย์ในส่วนหัว `x-api-key`:

```http
x-api-key: sk-your-api-key
```

ส่วนหัวนี้รองรับเฉพาะ `POST /v1/messages` เท่านั้น endpoint สาธารณะอื่นจะไม่อ่านส่วนหัวนี้ ให้ใช้การยืนยันตัวตนแบบ Bearer
สำหรับ Chat Completions, `/v1/run` และ API ของทรัพยากร

### ลำดับความสำคัญ {#priority}

สำหรับ `POST /v1/messages` เท่านั้น หากมีทั้งสองส่วนหัว `x-api-key` จะมีลำดับความสำคัญสูงกว่า

### API key ที่เข้ากันได้กับ Google Gemini {#google-gemini-compatible-api-keys}

การดำเนินการ Gemini GenerateContent และ Interactions รับ `x-goog-api-key`, `Authorization: Bearer …` หรือพารามิเตอร์ query `key` ตามลำดับความสำคัญนี้ แนะนำให้ใช้ส่วนหัว เพราะข้อมูลรับรองใน query string อาจปรากฏในล็อกและประวัติของเบราว์เซอร์ ดูพาธที่รองรับได้ที่ [Google Gemini](/api-reference/gemini-generate-content) และ [Gemini Interactions](/api-reference/gemini-interactions)

### ตรรกะการอ่านคีย์ {#extraction-logic}

endpoint มาตรฐานอ่านเฉพาะ `Authorization: Bearer <key>` เท่านั้น middleware ของ Anthropic Messages จะอ่าน `x-api-key`
ก่อน แล้วจึงใช้ส่วนหัว Bearer แทนหากไม่มี ทรัพยากรของแพลตฟอร์ม Agents รับ `Authorization: Bearer` หรือ
`X-API-Key` (ดูด้านล่าง) [webhook Events API](/api-reference/webhooks) (`/events/webhooks*`) ก็รับได้ทั้งสอง
ส่วนหัวเช่นกัน และจะใช้ส่วนหัว Bearer เมื่อมีทั้งคู่ หากไม่มีข้อมูลรับรองที่รองรับ จะได้ `401 Unauthorized`

### ทรัพยากรของแพลตฟอร์ม Agents {#agents-platform-resources}

`/v1/agents*` (รวมถึง `/v1/agents/sessions*`), `/v1/mcp-connections*`, `/v1/secrets*`
และ `/v1/skills*` รับคีย์ได้ในส่วนหัวใดส่วนหัวหนึ่ง:

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- หากส่งทั้ง `Authorization: Bearer` และ `X-API-Key` ทั้งสองต้องเป็นคีย์เดียวกัน ค่าที่ต่างกันจะได้ `401 unauthorized` การส่งส่วนหัวใดซ้ำก็จะได้ 401 เช่นกัน
- `OpenAI-Beta` ไม่บังคับ หากระบุ ต้องเป็น `agents=v1`
- คำขออ่านต้องมีสิทธิ์ `agents.read` และการเขียนต้องมี `agents.write` คีย์มาตรฐานที่สร้างจาก Console มีทั้งสองสิทธิ์ ส่วนคีย์ที่มีขอบเขตจำกัดซึ่ง SandBase ออกให้ เช่น คีย์ CLI Login จะได้ `403 insufficient_scope`
- `402 spending_limit_exceeded` หมายความว่าขีดจำกัดการใช้จ่ายของคีย์หรือยอดคงเหลือขององค์กรหมดแล้ว
- ข้อผิดพลาดใช้ [รูปแบบข้อผิดพลาดของ Agents](/api-reference/errors#agents-platform-errors) ไม่ใช่รูปแบบแบน `{"error": "…"}` ที่แสดงด้านล่าง

## รูปแบบของ API key {#api-key-format}

API key ใหม่ที่สร้างจาก Console มีรูปแบบดังนี้:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| ส่วนประกอบ | คำอธิบาย |
|-----------|-------------|
| `sk-` | prefix มาตรฐานของ "secret key" |
| `xxxx...` | อักขระเลขฐานสิบหก 64 ตัวที่สร้างจากไบต์สุ่ม 32 ไบต์ |

คีย์แบบเดิม `sk-sb-...` ยังใช้งานได้จนกว่าจะหมดอายุหรือถูกเพิกถอน ไคลเอนต์ควรถือว่าคีย์เป็นสตริงทึบ
แทนที่จะปฏิเสธข้อมูลรับรองโดยดูจาก prefix หรือความยาว

::: warning
ห้ามเปิดเผย API key ในโค้ดฝั่งไคลเอนต์ รีโพสิทอรีสาธารณะ หรือล็อก ให้ดูแลคีย์เหมือนรหัสผ่าน
:::

## สร้าง API key {#create-api-keys}

### ผ่าน Console {#via-console}

1. เข้าสู่ระบบ [SandBase Console](https://www.sandbase.ai/console)
2. เปิด **Developer → API Keys**
3. คลิก **New key**
4. ตั้งชื่อคีย์ที่สื่อความหมาย (เช่น "Production Backend", "Development")
5. คัดลอกคีย์ทันที เพราะคีย์จะไม่แสดงอีก

### คุณสมบัติของคีย์ {#key-properties}

| คุณสมบัติ | คำอธิบาย |
|----------|-------------|
| Name | ป้ายชื่อที่อ่านเข้าใจได้สำหรับระบุคีย์ |
| Organization | องค์กรที่คีย์นี้เป็นสมาชิก |
| Enabled | คีย์เปิดใช้งานอยู่หรือไม่ |
| Spending Limit | วงเงินการใช้จ่ายต่อคีย์ (ไม่บังคับ) |
| Expires At | วันหมดอายุ (ไม่บังคับ) |
| Created At | เวลาที่สร้างคีย์ |

คีย์มาตรฐานที่สร้างจาก Console ใช้สิทธิ์เข้าถึงระดับองค์กรกับ API สาธารณะที่มีเอกสาร ข้อมูลรับรองที่ SandBase ออกให้ เช่น คีย์ CLI Login อาจมีขอบเขตจำกัด Console ไม่มีตัวเลือกให้ผู้ใช้กำหนดขอบเขตสำหรับคีย์มาตรฐาน

## วงจรชีวิตของคีย์ {#key-lifecycle}

### การหมุนเวียน {#rotation}

วิธีหมุนเวียนคีย์:

1. สร้างคีย์ใหม่ใน Console
2. อัปเดตแอปพลิเคชันให้ใช้คีย์ใหม่
3. ตรวจสอบว่าคีย์ใหม่ทำงานได้ใน production
4. เพิกถอนคีย์เดิม

::: tip
สร้างคีย์ใหม่ก่อนเพิกถอนคีย์เดิมเสมอ เพื่อหลีกเลี่ยงการหยุดให้บริการ
:::

### การเพิกถอน {#revocation}

คีย์ที่ถูกเพิกถอนจะยืนยันตัวตนสำหรับคำขอใหม่ไม่ได้ API จะส่งคืน `401 Unauthorized` พร้อมข้อความ:

```json
{"error":"API key has been revoked"}
```

### การหมดอายุ {#expiration}

คีย์สามารถกำหนดวันหมดอายุได้ (ไม่บังคับ) คีย์ที่หมดอายุจะได้ `401 Unauthorized` พร้อมข้อความ:

```json
{"error":"API key has expired"}
```

## ข้อกำหนดการยืนยันตัวตนของแต่ละ endpoint {#endpoint-authentication-requirements}

| Endpoint | วิธียืนยันตัวตน | คำอธิบาย |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | API Key (Bearer) | Chat Completions |
| `POST /v1/responses` | API Key (Bearer) | Responses API ที่เข้ากันได้กับ OpenAI |
| `POST /v1/messages` | API Key (Bearer หรือ x-api-key) | Anthropic Messages |
| `/v1beta/models/*` | API Key (x-goog-api-key, Bearer หรือ query key) | Gemini GenerateContent |
| `/v1beta/interactions*` | API Key (x-goog-api-key, Bearer หรือ query key) | Gemini Interactions |
| `/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*` | API Key (Bearer หรือ X-API-Key) | ทรัพยากรของแพลตฟอร์ม Agents |

SandBase Console ใช้ขั้นตอนการยืนยันตัวตนผ่านเบราว์เซอร์แยกต่างหาก คำขอภายในของ Console ไม่ใช่ endpoint สาธารณะ
ที่รองรับ และห้ามนำไปใช้ในการเชื่อมต่อ

## การแยกข้อมูลระหว่างองค์กร {#organization-isolation}

API key มีขอบเขตอยู่ในองค์กรเดียว เมื่อคุณยืนยันตัวตนด้วยคีย์:

- คุณเข้าถึงได้เฉพาะทรัพยากรที่เป็นขององค์กรของคุณ
- การใช้งานและการเรียกเก็บเงินจะติดตามแยกตามองค์กร

## การตอบกลับข้อผิดพลาด {#error-responses}

| HTTP Status | ข้อความ | สาเหตุ |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | ไม่ได้ระบุคีย์ |
| 401 | `invalid API key` | ไม่พบคีย์ในฐานข้อมูล |
| 401 | `API key has been revoked` | คีย์ถูกปิดใช้งาน |
| 401 | `API key has expired` | คีย์เลยวันหมดอายุแล้ว |
| 402 หรือ 403 ตามโปรโตคอล | `API key spending limit exceeded` | ถึงขีดจำกัดการใช้จ่ายระดับคีย์แล้ว ให้ดูข้อกำหนดข้อผิดพลาดในเอกสารของ endpoint นั้น |
| 403 | `API key is not authorized for this endpoint` | ใช้คีย์ที่มีขอบเขตจำกัดกับ endpoint นอกขอบเขต |

ข้อความเหล่านี้ส่งมาในเนื้อหาแบบแบน `{"error":"<message>"}` ยกเว้นข้อผิดพลาดขอบเขต `403` ซึ่งบน endpoint ของโมเดลและบัญชี
จะใช้ `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`
ส่วนบนทรัพยากรของแพลตฟอร์ม Agents จะใช้ [รูปแบบข้อผิดพลาดของ Agents](/api-reference/errors#agents-platform-errors) โดยมี
`code` เป็น `insufficient_scope`

## แนวทางปฏิบัติด้านความปลอดภัย {#security-best-practices}

### ควรทำ {#do}

- **เก็บคีย์ในตัวแปรสภาพแวดล้อม**: ห้าม hardcode คีย์ในซอร์สโค้ด
- **ใช้คีย์แยกตามสภาพแวดล้อม**: ใช้คีย์ต่างกันสำหรับ dev, staging และ production
- **กำหนดวันหมดอายุ**: เลือกรอบการหมุนเวียนที่เหมาะกับนโยบายความปลอดภัยของคุณ
- **ติดตามการใช้งาน**: ตรวจสอบกิจกรรมที่ผิดปกติใน Console
- **ใช้คีย์มาตรฐานเฉพาะกับงานที่ต้องเข้าถึง API สาธารณะ**: เก็บข้อมูลรับรอง CLI Login ที่มีขอบเขตจำกัดไว้ในขั้นตอนที่มีการจัดการของมัน

### ไม่ควรทำ {#don-t}

- **อย่า commit คีย์ลงในระบบควบคุมเวอร์ชัน**: เพิ่ม `.env` ลงใน `.gitignore`
- **อย่าใช้คีย์เดียวร่วมกันในหลายแอปพลิเคชันที่ไม่เกี่ยวข้องกัน**: การแยกคีย์ทำให้การหมุนเวียนและการรับมือเหตุการณ์ปลอดภัยกว่า
- **อย่าเปิดเผยคีย์ในโค้ดฝั่งไคลเอนต์**: ส่งผ่านแบ็กเอนด์ของคุณเสมอ
- **อย่าบันทึก API key ลงในล็อก**: ปิดบังคีย์ในล็อกของแอปพลิเคชัน

### ตัวอย่างตัวแปรสภาพแวดล้อม {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## การจำกัดอัตราตามคีย์ {#rate-limiting-by-key}

ขีดจำกัดคำขอกำหนดต่อองค์กรและใช้ร่วมกันโดย API key ทั้งหมดขององค์กร การสร้างคีย์เพิ่มจึงไม่ได้เพิ่ม
ขีดจำกัด API ไม่ได้เผยแพร่ค่าเริ่มต้นที่เป็นตัวเลข
แบบเดียวสำหรับทุกกรณี หรือส่วนหัวแสดงโควตาคงเหลือ

ดูรายละเอียดเกี่ยวกับขีดจำกัดและการจัดการการตอบกลับ 429 ได้ที่ [การจำกัดอัตรา](/guides/rate-limiting)
