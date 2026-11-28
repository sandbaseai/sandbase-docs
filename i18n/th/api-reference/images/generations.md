---
i18nSource: 39ce638efc41350d
title: สร้างรูปภาพ
description: สร้างรูปภาพด้วย API แบบซิงโครนัสที่เข้ากันได้กับ OpenAI Images
aside: false
outline: false
apiReference:
  title: สร้างรูปภาพ
  operation: Images
  method: POST
  path: /v1/images/generations
  description: สร้างรูปภาพผ่าน endpoint แบบซิงโครนัสของ SandBase ที่เข้ากันได้กับ OpenAI Images โดย endpoint นี้แยกจาก API โมเดลทั่วไป /v1/run
  signature: client.images.generate(params)
  groups:
    - title: Request body
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: หนึ่งใน gpt-image-2, gpt-image-2.5-flare หรือ gpt-image-2.5-sunburst
        - name: prompt
          type: string
          required: true
          description: คำอธิบายเป็นข้อความของรูปภาพที่ต้องการสร้าง
        - name: n
          type: integer
          required: false
          description: จำนวนรูปภาพที่จะสร้าง เมื่อรองรับ
        - name: size
          type: string
          required: false
          description: ขนาดเอาต์พุตที่โมเดลรองรับ
        - name: quality
          type: string
          required: false
          description: คุณภาพเอาต์พุต เช่น low, medium, high หรือ auto
        - name: background
          type: string
          required: false
          description: การตั้งค่าพื้นหลัง เช่น transparent, opaque หรือ auto
        - name: output_format
          type: string
          required: false
          description: รูปแบบการเข้ารหัสเอาต์พุต เช่น png, webp หรือ jpeg
        - name: output_compression
          type: integer
          required: false
          description: ระดับการบีบอัดเอาต์พุตตั้งแต่ 0 ถึง 100
        - name: moderation
          type: string
          required: false
          description: การตั้งค่าการกลั่นกรองเนื้อหาที่เข้ากันได้กับผู้ให้บริการ
        - name: user
          type: string
          required: false
          description: ตัวระบุผู้ใช้ปลายทางที่เข้ากันได้กับผู้ให้บริการ
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/generations \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"gpt-image-2","prompt":"A paper-cut city floating above the clouds","size":"1024x1024"}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        result = client.images.generate(
            model="gpt-image-2",
            prompt="A paper-cut city floating above the clouds",
            size="1024x1024",
        )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 12,
          "output_tokens": 4096,
          "total_tokens": 4108,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 0}
        }
      }
  notes:
    - title: ซิงโครนัสเท่านั้น
      description: stream=true, mode=stream และ mode=async จะถูกปฏิเสธ ให้ใช้อาร์เรย์ data ที่ส่งคืนได้โดยตรง
    - title: ฟิลด์ที่เข้ากันได้
      description: ฟิลด์ JSON เพิ่มเติมจะถูกส่งต่อโดยไม่เปลี่ยนแปลง แต่การรองรับยังขึ้นอยู่กับโมเดลและผู้ให้บริการ
  errors:
    - status: "400"
      description: JSON ไม่ถูกต้อง โมเดลไม่รองรับ ใช้โหมดสตรีม หรือคำขอไปยังผู้ให้บริการไม่ถูกต้อง
    - status: "401"
      description: ไม่มี API key หรือ API key ไม่ถูกต้อง
    - status: "402"
      description: ถึงวงเงินการใช้จ่ายขององค์กรหรือ API Key แล้ว
    - status: "403"
      description: ขอบเขตของ API key ไม่อนุญาตให้ใช้ endpoint นี้
    - status: "404"
      description: โมเดลรูปภาพที่ถูกกำหนดเส้นทางไว้ไม่พร้อมใช้งาน
    - status: "429"
      description: เกินขีดจำกัดอัตราการเรียกใช้
    - status: "500"
      description: การบันทึกคำขอหรือการประมวลผลการตอบกลับล้มเหลว
    - status: "502"
      description: ผู้ให้บริการส่งคืนการตอบกลับแบบเนทีฟที่ไม่ถูกต้อง
    - status: "503"
      description: ไม่มีเส้นทางของผู้ให้บริการใดที่สำเร็จ
---

<ApiReferencePage />

## โมเดลที่รองรับ {#supported-models}
โมเดลรูปภาพของ OpenAI ต่อไปนี้ใช้ Images API แบบเนทีฟบน endpoint นี้ ให้ส่งชื่อโมเดลสาธารณะใน `model`:

| `model` | เหมาะสำหรับ |
| --- | --- |
| `gpt-image-2.5-flare` | การสร้างและแก้ไขภาพคุณภาพสูงที่รวดเร็วสำหรับงานสร้างสรรค์ทั่วไป |
| `gpt-image-2.5-sunburst` | งานที่ต้องการความสมจริงและความแม่นยำของภาพมากที่สุด |
| `gpt-image-2` | GPT Image รุ่นก่อนหน้า |

คำขอเป็นแบบซิงโครนัสและส่งคืนข้อมูลรูปภาพใน `data` เป็น `b64_json` หรือ URL endpoint นี้แยกจาก endpoint โมเดลแบบอะซิงโครนัสทั่วไป `/v1/run` โดยหน้าของแต่ละโมเดลใน[แค็ตตาล็อกโมเดล](https://www.sandbase.ai/models/image-video) จะอธิบายสัญญาการใช้งานและราคาของ endpoint ดังกล่าว

หากต้องการแก้ไขรูปภาพ ให้ส่ง `multipart/form-data` ไปยัง [`POST /v1/images/edits`](/api-reference/images/edits) โดยใช้ชื่อโมเดลเดียวกัน
