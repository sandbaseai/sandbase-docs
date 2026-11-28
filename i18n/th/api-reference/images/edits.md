---
i18nSource: a4db28360a2974cd
title: แก้ไขภาพ
description: แก้ไขภาพที่อัปโหลดด้วย API แบบซิงโครนัสที่เข้ากันได้กับ OpenAI Images
aside: false
outline: false
apiReference:
  title: แก้ไขภาพ
  operation: Images
  method: POST
  path: /v1/images/edits
  description: แก้ไขภาพที่อัปโหลดหนึ่งภาพหรือมากกว่าผ่านเอนด์พอยต์ multipart แบบซิงโครนัสของ SandBase ที่เข้ากันได้กับ OpenAI Images
  signature: client.images.edit(params)
  groups:
    - title: เนื้อหาคำขอ
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: หนึ่งในโมเดล gpt-image-2, gpt-image-2.5-flare หรือ gpt-image-2.5-sunburst
        - name: prompt
          type: string
          required: true
          description: คำอธิบายการแก้ไขที่ต้องการเป็นข้อความ
        - name: image
          type: file | file[]
          required: true
          description: ไฟล์ภาพต้นฉบับหนึ่งไฟล์หรือมากกว่า ส่งฟิลด์ multipart ซ้ำสำหรับหลายภาพ
        - name: mask
          type: file
          required: false
          description: ภาพมาสก์สำหรับ inpainting (ไม่บังคับ)
        - name: n
          type: integer
          required: false
          description: จำนวนภาพที่แก้ไขแล้วที่จะส่งคืน (เมื่อรองรับ)
        - name: size
          type: string
          required: false
          description: ขนาดเอาต์พุตที่โมเดลรองรับ
        - name: quality
          type: string
          required: false
          description: คุณภาพเอาต์พุตที่โมเดลรองรับ
        - name: background
          type: string
          required: false
          description: การตั้งค่าพื้นหลังของเอาต์พุต
        - name: input_fidelity
          type: string
          required: false
          description: ระดับที่โมเดลที่รองรับควรคงรายละเอียดของภาพต้นฉบับไว้
        - name: output_format
          type: string
          required: false
          description: รูปแบบการเข้ารหัสเอาต์พุต เช่น png, webp หรือ jpeg
        - name: output_compression
          type: integer
          required: false
          description: ระดับการบีบอัดเอาต์พุตตั้งแต่ 0 ถึง 100
        - name: user
          type: string
          required: false
          description: ตัวระบุผู้ใช้ปลายทางที่เข้ากันได้กับผู้ให้บริการ
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/edits \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -F model=gpt-image-2 \
          -F 'prompt=Turn the daytime sky into a starry night' \
          -F image=@landscape.png
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        with open("landscape.png", "rb") as image:
            result = client.images.edit(
                model="gpt-image-2",
                image=image,
                prompt="Turn the daytime sky into a starry night",
            )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 1024,
          "output_tokens": 4096,
          "total_tokens": 5120,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 1012}
        }
      }
  notes:
    - title: การอัปโหลดแบบ multipart
      description: ส่ง model, prompt และ image เป็น multipart/form-data การส่งฟิลด์ image ซ้ำจะเก็บไฟล์ต้นฉบับไว้ได้หลายไฟล์
    - title: ซิงโครนัสเท่านั้น
      description: ระบบจะปฏิเสธ stream=true, mode=stream และ mode=async
  errors:
    - status: "400"
      description: เนื้อหา multipart ไม่ถูกต้อง โมเดลไม่รองรับ เป็นโหมดสตรีม หรือคำขอไปยังผู้ให้บริการไม่ถูกต้อง
    - status: "401"
      description: ไม่มี API key หรือ API key ไม่ถูกต้อง
    - status: "402"
      description: ถึงขีดจำกัดการใช้จ่ายขององค์กรหรือ API Key แล้ว
    - status: "403"
      description: ขอบเขตของ API key ไม่อนุญาตให้ใช้เอนด์พอยต์นี้
    - status: "404"
      description: โมเดลแก้ไขภาพที่ถูกกำหนดเส้นทางไว้ไม่พร้อมใช้งาน
    - status: "429"
      description: เกินขีดจำกัดอัตราการเรียกใช้
    - status: "500"
      description: การจัดเก็บคำขอหรือการประมวลผลการตอบกลับล้มเหลว
    - status: "502"
      description: ผู้ให้บริการส่งคืนการตอบกลับแบบเนทีฟที่ไม่ถูกต้อง
    - status: "503"
      description: ไม่มีเส้นทางของผู้ให้บริการใดสำเร็จ
---

<ApiReferencePage />

## โมเดลที่รองรับ {#supported-models}
โมเดลภาพของ OpenAI เหล่านี้ใช้ Images API แบบเนทีฟบนเอนด์พอยต์นี้และบน [`/v1/images/generations`](/api-reference/images/generations) ให้ส่งชื่อโมเดลสาธารณะใน `model`:

| `model` | เหมาะสำหรับ |
| --- | --- |
| `gpt-image-2.5-flare` | การสร้างและแก้ไขภาพคุณภาพสูงที่รวดเร็วสำหรับงานสร้างสรรค์ทั่วไป |
| `gpt-image-2.5-sunburst` | งานที่ความเที่ยงตรงและความแม่นยำของภาพสำคัญที่สุด |
| `gpt-image-2` | GPT Image รุ่นก่อนหน้า |

คำขอทำงานแบบซิงโครนัสและส่งคืนข้อมูลภาพใน `data` เป็น `b64_json` หรือ URL เอนด์พอยต์นี้แยกจากเอนด์พอยต์โมเดลแบบอะซิงโครนัสทั่วไป `/v1/run` โดยหน้าของแต่ละโมเดลใน[แคตตาล็อกโมเดล](https://www.sandbase.ai/models/image-video)จะอธิบายสัญญาการใช้งานนั้นและราคา

ระบุ `model`, `prompt` และไฟล์ `image` อย่างน้อยหนึ่งไฟล์ ส่งฟิลด์ `image` ซ้ำเพื่อผสานหรือแก้ไขภาพต้นฉบับหลายภาพ:

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
