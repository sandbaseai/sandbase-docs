---
i18nSource: 0d7d66842e233794
title: เริ่มต้นใช้งาน Sandbox ด้วย E2B SDK
description: เชื่อมต่อ E2B SDK อย่างเป็นทางการสำหรับ JavaScript และ Python เข้ากับ SandBase รันคำสั่ง อ่านและเขียนไฟล์ และจัดการ sandbox อย่างปลอดภัย
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# เริ่มต้นใช้งาน Sandbox ด้วย E2B SDK {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

ใช้ E2B SDK อย่างเป็นทางการกับ SandBase API key ของคุณเพื่อสร้าง sandbox ที่แยกออกจากกัน รันคำสั่ง และอ่านและเขียนไฟล์ คู่มือนี้ใช้กับ **E2B JavaScript และ Python SDK 2.51.0**

หากต้องการสร้างและติดตามผ่านเบราว์เซอร์ ให้ลงชื่อเข้าใช้ [Sandbox Console](https://www.sandbase.ai/console/sandboxes) เพื่อสร้างอินสแตนซ์และดูสถานะ ล็อก และเมตริก หากต้องการผสานรวมกับแอปพลิเคชัน ให้ทำตามขั้นตอน SDK ด้านล่างต่อ หรืออ่าน[ภาพรวมผลิตภัณฑ์ Sandbox](https://www.sandbase.ai/sandbox)

## 1. กำหนดค่า SDK อย่างเป็นทางการ {#_1-configure-the-official-sdk}

[สร้าง SandBase API key ใน Console](https://www.sandbase.ai/console/keys) จากนั้นกำหนดค่าตัวแปรสภาพแวดล้อมมาตรฐานของ E2B ซึ่ง SDK อย่างเป็นทางการจะอ่านค่าเหล่านี้โดยอัตโนมัติทั้งใน JavaScript และ Python

| ตัวแปรสภาพแวดล้อม | ค่า |
|---|---|
| `E2B_API_KEY` | SandBase API key ของคุณจาก [Developer → API Keys](https://www.sandbase.ai/console/keys) |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | ไม่ต้องตั้งค่า เพื่อให้ SDK ใช้ที่อยู่ data plane ของแต่ละ sandbox |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

หากคุณเก็บคีย์ไว้ใน `SANDBASE_API_KEY` อยู่แล้ว ให้นำมาใช้ซ้ำได้:

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

คุณต้องใช้เพียง SandBase API key เท่านั้น ให้ใช้คีย์ SandBase ทั่วไปที่มีสิทธิ์เข้าถึง Sandbox คีย์ที่จำกัดไว้สำหรับความสามารถอื่นอาจถูกปฏิเสธ ดู [API key](/getting-started/api-keys)

### โค้ด E2B ที่มีอยู่ไม่ต้องแก้ไขได้หรือไม่ {#can-existing-e2b-code-stay-unchanged}

ได้ สำหรับการดำเนินการที่รองรับ เมื่อแอปพลิเคชันของคุณอ่านการตั้งค่าการเชื่อมต่อ SDK จากสภาพแวดล้อมอยู่แล้ว และมี template นั้นบน SandBase ให้ใช้ SDK อย่างเป็นทางการและการเรียกที่มีอยู่เดิมต่อไป โดยเปลี่ยนเพียงคีย์ API URL และโดเมนตามด้านบน ตัวเลือกการเชื่อมต่อที่ระบุชัดเจนในโค้ดแอปพลิเคชันจะมีลำดับความสำคัญสูงกว่าตัวแปรสภาพแวดล้อม ดังนั้นให้ลบหรืออัปเดต endpoint โดเมน หรือคีย์ผู้ให้บริการของ E2B ที่ hardcode ไว้

ตั้งค่า**ทั้ง** `E2B_API_URL` และ `E2B_DOMAIN` หากตั้งเพียงโดเมน SDK 2.51.0 จะสร้างโฮสต์ API ที่มี prefix `api.` เพิ่มเข้ามา `E2B_SANDBOX_URL` จะแทนที่ที่อยู่สำหรับคำสั่ง/ไฟล์ของแต่ละอินสแตนซ์ อย่าตั้งค่านี้เป็น origin ของ control API โหมดดีบักจะเปลี่ยนการเลือกที่อยู่ของ SDK สำหรับการพัฒนาในเครื่อง ดังนั้นให้ปิดไว้สำหรับบริการ HTTPS นี้

control API ใช้สร้างและจัดการอินสแตนซ์ ส่วนคำสั่ง ไฟล์ และพอร์ตของแอปพลิเคชันใช้ subdomain ของแต่ละอินสแตนซ์ภายใต้ `sandbox.sandbase.ai` อย่าเติม prefix `/v1` ของ model API คำขอ control API ที่สำเร็จเพียงอย่างเดียวไม่ได้ยืนยันว่าเข้าถึงคำสั่ง/ไฟล์หรือฟีเจอร์ทั้งหมดของผู้ให้บริการได้

ตัวอย่างจะอ่านตัวแปรสภาพแวดล้อมของโปรเซส ไฟล์ `.env` จะใช้ได้ก็ต่อเมื่อแอปพลิเคชันหรือตัวเรียกใช้งานโหลดไฟล์นั้นก่อนใช้ SDK

### เลือก template {#choose-a-template}

ใช้คีย์ SandBase ของคุณเพื่อแสดงรายการ template ที่องค์กรของคุณมองเห็นได้:

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

เลือก template ที่มี `buildStatus: "ready"` และคัดลอก `templateID` ชื่อที่แสดงอยู่ใน `names` หรือ `aliases` หากทั้งสองว่างให้ใช้ ID ฟิลด์ `public` ใช้แยก template สาธารณะออกจาก template ส่วนตัวที่องค์กรของคุณมองเห็นได้

response เป็นอาร์เรย์ หากเฮดเดอร์ของ response มี `X-Next-Token` ให้ส่งค่านั้นเป็นพารามิเตอร์ query `nextToken` เพื่อดึงหน้าถัดไป

ตั้งค่า ID ของ template ที่เลือก:

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` เป็นตัวแปรที่ตัวอย่างด้านล่างใช้ ไม่ใช่การตั้งค่าในตัวของ E2B SDK ตัวอย่างจะส่งค่านี้ไปยัง `Sandbox.create` อย่างชัดเจน โค้ดที่มีอยู่สามารถคงอาร์กิวเมนต์ template ไว้ได้หาก ID หรือชื่อนั้นมีอยู่บน SandBase อย่าคาดว่า ID ของ template ต้นทางของ E2B หรือ `base` ซึ่งเป็นค่าเริ่มต้นของ SDK จะใช้ได้ หากรายการว่างเปล่า ให้ขอสิทธิ์เข้าถึง template สำหรับองค์กรของคุณ

## 2. สร้าง รัน และล้างทรัพยากร {#_2-create-execute-and-clean-up}

ตัวอย่างเหล่านี้สร้างทรัพยากรจริง โดยกำหนดอายุการใช้งานสองนาที และลบอินสแตนซ์อย่างชัดเจนใน `finally` ให้รันตัวอย่างหนึ่งก่อน และยืนยันว่าล้างทรัพยากรแล้วก่อนรันอีกครั้ง

### JavaScript {#javascript}

ใช้ Node.js 22 ขึ้นไปในไดเรกทอรีของแอปพลิเคชัน:

```bash
npm install --save-exact e2b@2.51.0
```

บันทึกเป็น `sandbox-example.mjs`:

```js
import { randomUUID } from 'node:crypto';
import { Sandbox } from 'e2b';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const options = {
  requestTimeoutMs: 30_000,
  retries: 0,
};
const template = required('SANDBASE_TEMPLATE_ID');
const runId = randomUUID();
let sandbox;

// Keep this identifier if creation times out before returning an instance ID.
console.log('Run ID:', runId);
try {
  sandbox = await Sandbox.create(template, {
    ...options,
    timeoutMs: 120_000,
    metadata: { quickstartRunId: runId },
  });
  console.log('Sandbox ID:', sandbox.sandboxId);

  const result = await sandbox.commands.run('printf hello-sandbase', {
    timeoutMs: 15_000,
  });
  if (result.exitCode !== 0 || result.stdout !== 'hello-sandbase') {
    throw new Error('Command verification failed');
  }

  const path = '/tmp/sandbase-hello.txt';
  await sandbox.files.write(path, 'hello from SandBase');
  if (await sandbox.files.read(path) !== 'hello from SandBase') {
    throw new Error('File verification failed');
  }
  console.log('Command and file checks passed');
} catch {
  console.error('Sandbox example failed; retain the run ID for troubleshooting');
  process.exitCode = 1;
} finally {
  if (sandbox) {
    try {
      await Sandbox.kill(sandbox.sandboxId, options);
      console.log('Sandbox cleanup completed');
    } catch {
      console.error('Cleanup failed; delete the recorded Sandbox ID');
      process.exitCode = 1;
    }
  }
}
```

รันโดยกำหนดค่าตัวแปรสภาพแวดล้อมของ SDK และ template ที่เลือกไว้แล้ว:

```bash
node sandbox-example.mjs
```

### Python {#python}

ติดตั้ง SDK เวอร์ชันที่ระบุในสภาพแวดล้อม Python ของคุณ:

```bash
python -m pip install 'e2b==2.51.0'
```

บันทึกเป็น `sandbox_example.py`:

```python
import os
import sys
import uuid
from e2b import Sandbox

options = {
    "request_timeout": 30,
}
template = os.environ["SANDBASE_TEMPLATE_ID"]
run_id = str(uuid.uuid4())
sandbox = None
failed = False

print("Run ID:", run_id)
try:
    sandbox = Sandbox.create(
        template, timeout=120,
        metadata={"quickstartRunId": run_id}, **options,
    )
    print("Sandbox ID:", sandbox.sandbox_id)

    result = sandbox.commands.run("printf hello-sandbase", timeout=15)
    if result.exit_code != 0 or result.stdout != "hello-sandbase":
        raise RuntimeError("Command verification failed")

    path = "/tmp/sandbase-hello.txt"
    sandbox.files.write(path, "hello from SandBase")
    if sandbox.files.read(path) != "hello from SandBase":
        raise RuntimeError("File verification failed")
    print("Command and file checks passed")
except Exception:
    print("Sandbox example failed; retain the run ID for troubleshooting")
    failed = True
finally:
    if sandbox is not None:
        try:
            Sandbox.kill(sandbox.sandbox_id, **options)
            print("Sandbox cleanup completed")
        except Exception:
            print("Cleanup failed; delete the recorded Sandbox ID")
            failed = True

sys.exit(1 if failed else 0)
```

```bash
python sandbox_example.py
```

ความสำเร็จหมายความว่าทั้งการตรวจสอบคำสั่ง/ไฟล์และการล้างทรัพยากรเสร็จสมบูรณ์ ให้เก็บ ID ของการรันและ sandbox ไว้ภายในองค์กรของคุณ อย่าบันทึกออบเจ็กต์ SDK ลงในล็อก เพราะอาจมี access token อยู่

หากการสร้างหมดเวลาโดยไม่ได้ ID ทรัพยากรนั้นอาจยังคงมีอยู่ ให้ขอให้ผู้ดูแลระบบค้นหาโดยใช้ metadata `quickstartRunId` ก่อนสร้างรายการใหม่ การหมดเวลาหรือโปรเซสที่ถูกขัดจังหวะไม่ได้ยืนยันว่าลบแล้ว และ `finally` จะไม่ทำงานหลังจากโปรเซสถูกบังคับหยุด

## 3. ขยายอายุการใช้งาน หรือหยุดชั่วคราวแล้วเชื่อมต่อใหม่ {#_3-extend-the-lifetime-or-pause-and-reconnect}

แทรกโค้ดเหล่านี้ไว้ในบล็อก `try` ของตัวอย่างที่ตรงกัน หลังการตรวจสอบไฟล์และก่อนการล้างทรัพยากร template และผู้ให้บริการที่เลือกต้องรองรับการหยุดชั่วคราว/ทำต่อ

JavaScript ใช้หน่วย**มิลลิวินาที**สำหรับ timeout ของ SDK เหล่านี้:

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

Python ใช้หน่วย**วินาที**:

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

การเชื่อมต่อใหม่จะส่งคืนออบเจ็กต์ SDK ใหม่และข้อมูลรับรองของ session ใหม่ ให้ใช้ออบเจ็กต์นั้นสำหรับคำสั่งและไฟล์ในขั้นต่อไป การลบ sandbox จะสิ้นสุดวงจรชีวิตของ sandbox นั้น คู่มือนี้ไม่ได้รับประกันว่าพื้นที่จัดเก็บจะคงอยู่หลังการลบ อายุการใช้งานของ sandbox และ timeout ของคำสั่งหรือคำขอ HTTP แต่ละรายการเป็นการตั้งค่าที่แตกต่างกัน

## 4. เข้าถึงพอร์ตของแอปพลิเคชัน {#_4-access-application-ports}

หลังจากแอปพลิเคชันของคุณรอรับการเชื่อมต่ออยู่ภายใน sandbox ให้ใช้ `sandbox.getHost(port)` ใน JavaScript หรือ `sandbox.get_host(port)` ใน Python เพื่อรับโฮสต์ ทราฟฟิกของแอปพลิเคชันต้องมีเฮดเดอร์ `e2b-traffic-access-token` โดยใช้ `sandbox.trafficAccessToken` หรือ `sandbox.traffic_access_token` จากการเชื่อมต่อปัจจุบัน

โฮสต์เพียงอย่างเดียวไม่ได้ให้สิทธิ์เข้าถึง ไคลเอนต์ HTTP หรือ WebSocket ของคุณต้องส่งเฮดเดอร์นี้ การเปิด URL ในแท็บเบราว์เซอร์จะไม่เพิ่มเฮดเดอร์ให้ ให้ถือว่า traffic token และ URL ไฟล์แบบลงนามเป็นข้อมูลรับรอง และอย่าให้ปรากฏในล็อกหรือลิงก์ที่แชร์ สภาพแวดล้อม sandbox ที่เลือกต้องรองรับการเข้าถึงพอร์ต

## การแก้ไขปัญหา {#troubleshooting}

| อาการ | สิ่งที่ควรตรวจสอบ |
|---|---|
| ข้อผิดพลาดด้านการยืนยันตัวตนหรือขอบเขต | ความถูกต้องของคีย์ SandBase สิทธิ์เข้าถึงขององค์กร และขอบเขตของคีย์ |
| ไม่พบ template | ID/ชื่อของ template ที่เปิดใช้งานแบบตรงตัว และการมองเห็นสำหรับองค์กรของคุณ |
| สร้างสำเร็จแต่คำสั่ง/ไฟล์ล้มเหลว | การเชื่อมต่อเครือข่ายและข้อมูลรับรองของ session ปัจจุบัน ให้เชื่อมต่อใหม่และติดต่อฝ่ายสนับสนุนหากปัญหายังคงอยู่ |
| คำขอไปยังบริการผิด | `E2B_API_URL`, `E2B_DOMAIN` และตัวเลือก SDK ที่ hardcode ไว้ซึ่งแทนที่ค่าเหล่านี้ |
| เข้าถึงไม่ได้หลังหยุดชั่วคราว | เชื่อมต่อใหม่และใช้ออบเจ็กต์ SDK ที่ได้รับใหม่ |
| พอร์ตของแอปพลิเคชันปฏิเสธคำขอ | ความพร้อมของแอปพลิเคชันและเฮดเดอร์ traffic token ปัจจุบัน |
| `unsupported_operation` | ผู้ให้บริการที่เลือกไม่รองรับการดำเนินการนั้น ให้ตรวจสอบความพร้อมใช้งานก่อนนำไปใช้ |
| ไม่ทราบ response ของการสร้าง | ตรวจสอบ ID ของการรันที่บันทึกไว้ก่อนสร้างอินสแตนซ์ใหม่ |
| การล้างทรัพยากรล้มเหลว | ลองลบอินสแตนซ์ตาม ID ที่บันทึกไว้อีกครั้ง อย่ารันขั้นตอนการสร้างทั้งหมดใหม่ |

ตัวอย่างครอบคลุมขั้นตอนการทำงานพื้นฐานของคำสั่ง/ไฟล์ การ build template, snapshot, เหตุการณ์, webhook และเครือข่ายขั้นสูงต้องตรวจสอบความสามารถแยกต่างหาก การติดตั้ง E2B SDK เพียงอย่างเดียวไม่ได้พิสูจน์ว่าเข้ากันได้อย่างสมบูรณ์กับผู้ให้บริการทุกราย

## เอกสารอ้างอิง SDK {#sdk-references}

- [เอกสาร E2B](https://e2b.dev/docs)
- [E2B JavaScript SDK 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [E2B Python SDK 2.51.0](https://pypi.org/project/e2b/2.51.0/)
