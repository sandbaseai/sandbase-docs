---
i18nSource: 417ea5dc930a8786
title: Skills และเครื่องมือ MCP
description: มอบ Skills ที่นำกลับมาใช้ซ้ำได้และเครื่องมือ MCP ระยะไกลให้กับ Agent ของ SandBase และควบคุมว่าแต่ละ Session จะใช้เวอร์ชันและเครื่องมือใด
---

# Skills และเครื่องมือ MCP {#skills-and-mcp-tools}

Agent ได้รับความสามารถได้สองทาง:

- **Skills** สอน Agent ว่าจะทำงานหนึ่ง ๆ อย่างไร Skill คือชุดไฟล์ ZIP ที่มีเวอร์ชัน ซึ่งประกอบด้วยคำสั่งและทรัพยากร
- **การเชื่อมต่อ MCP** ช่วยให้ Agent เรียกเครื่องมือบนเซิร์ฟเวอร์ MCP ระยะไกลผ่าน HTTPS ได้ โดยเลือกยืนยันตัวตนด้วย [Secret](/agents/api-credentials) ได้

Agent ที่มีประโยชน์ส่วนใหญ่ใช้ทั้งสองอย่างร่วมกัน: เซิร์ฟเวอร์ MCP ดึงข้อมูลหรือดำเนินการ และ Skill อธิบายวิธีใช้ผลลัพธ์

## Skills {#skills}

1. เตรียมโฟลเดอร์ที่มี `SKILL.md` พร้อม frontmatter `name` และ `description` แล้ว zip ตัวโฟลเดอร์นั้น (`zip -r release-notes.zip release-notes/` ขนาดไม่เกิน 5 MiB) ไฟล์ ZIP ต้องมีโฟลเดอร์นั้นอยู่ที่ระดับบนสุด หากมี `SKILL.md` อยู่ที่รากของ ZIP จะส่งคืน `400 invalid_request`
2. อัปโหลดด้วย `POST /v1/skills` ในฟิลด์ multipart ชื่อ `files` การตอบกลับจะมี ID แบบ `skl_` และ `default_version: "1"`
3. อ้างอิง Skill ในอาร์เรย์ `skills` ของ Agent

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- เมื่อแนบครั้งแรก `"version": null` จะระบุเป็น `default_version` ปัจจุบันของ Skill ณ ตอนที่บันทึก Agent ส่วนสตริงอย่าง `"2"` จะเลือกเวอร์ชันนั้นอย่างชัดเจน
- Agent ที่บันทึกไว้จะตรึงเวอร์ชัน การเปลี่ยนเวอร์ชันเริ่มต้นของ Skill จะไม่อัปเกรด Agents ที่มีอยู่หรือ Sessions ใหม่ของ Agents เหล่านั้น ให้อัปเดต Agent ด้วยเวอร์ชันที่ระบุชัดเจนเพื่ออัปเกรด การส่ง `null` สำหรับการผูกที่มีอยู่แล้วจะคงเวอร์ชันที่ตรึงไว้
- อัปโหลดเวอร์ชันใหม่ด้วย `POST /v1/skills/{skill_id}/versions` และเปลี่ยนเวอร์ชันเริ่มต้นด้วย `default=true` หรือ `POST /v1/skills/{skill_id}`
- Skill ที่ถูกปิดใช้งานจะทำให้ Sessions ใหม่ของ Agents ที่อ้างอิง Skill นั้นล้มเหลวด้วย `400 skill_not_found`

คุณยังเรียกดู Skills สาธารณะได้ใน[แคตตาล็อก Skills](/api-reference/skills/catalog) ดูขั้นตอนทั้งหมดได้ที่ [Skills API](/api-reference/skills/)

## เครื่องมือในตัวของ SandBase {#built-in-sandbase-tools}

Agent ใหม่ทุกตัวใช้เครื่องมือของ SandBase เองได้โดยไม่ต้องตั้งค่า ด้วย `sandbase_discover`, `sandbase_inspect` และ `sandbase_run` Agent จะค้นหาโมเดลหรือ API ในแคตตาล็อก อ่านสคีมาและราคา แล้วเรียกใช้ด้วยคีย์ของคุณ เมื่อคุณไม่ระบุ `mcp_connections` ตอนสร้าง Agent จะได้รับค่าเริ่มต้นนี้:

```json
{
  "mcp_connections": [
    {
      "connection_id": "builtin:sandbase",
      "server_label": "sandbase_builtin",
      "allowed_tools": null,
      "required": true
    }
  ]
}
```

- **รายการที่คุณส่งจะแทนที่ค่าเริ่มต้น** หากต้องการเพิ่มเซิร์ฟเวอร์ MCP ของคุณเองและคงเครื่องมือ SandBase ไว้ ให้ใส่รายการในตัวไว้ในรายการของคุณด้วย
- **`builtin:sandbase` ต้องใช้ `server_label: "sandbase_builtin"`** ป้ายกำกับอื่น หรือการใช้ป้ายกำกับนั้นกับการเชื่อมต่ออื่น จะส่งคืน `400`
- **หากต้องการสร้าง Agent ที่ไม่มีเครื่องมือ** ให้ส่ง `"mcp_connections": []`
- **เครื่องมือในตัวใช้ได้ฟรี** คุณจ่ายเฉพาะโมเดลและ API ที่ Agent เรียกผ่านเครื่องมือเหล่านั้น

## การเชื่อมต่อ MCP {#mcp-connections}

1. หากเซิร์ฟเวอร์ MCP ต้องใช้ Bearer token ให้[สร้าง Secret](/agents/api-credentials) สำหรับ URL ที่ตรงกันทุกประการของเซิร์ฟเวอร์นั้น
2. ลงทะเบียนเซิร์ฟเวอร์ด้วย `POST /v1/mcp-connections`:

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. อ้างอิงการเชื่อมต่อในอาร์เรย์ `mcp_connections` ของ Agent:

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| ฟิลด์ | ความหมาย |
|---|---|
| `connection_id` | ID การเชื่อมต่อแบบ `mcp_` ในองค์กรของคุณ หรือ `builtin:sandbase` สำหรับเซิร์ฟเวอร์ SandBase ในตัว |
| `server_label` | ขึ้นต้นด้วยตัวอักษร ใช้ได้เฉพาะตัวอักษร ตัวเลข `_` และ `-` ยาวได้สูงสุด 64 อักขระ และต้องไม่ซ้ำกันภายใน Agent |
| `allowed_tools` | หากไม่ระบุหรือเป็น `null` จะอนุญาตทุกเครื่องมือที่เซิร์ฟเวอร์มี `[]` ไม่อนุญาตเครื่องมือใดเลย ส่วนรายการจะอนุญาตเฉพาะชื่อเหล่านั้น (สูงสุด 256 ชื่อ แต่ละชื่อต้องไม่ว่างและยาวไม่เกิน 128 ไบต์) |
| `required` | Session ต้องโหลดเซิร์ฟเวอร์นี้หรือไม่ |

Agent หนึ่งตัวอ้างอิงการเชื่อมต่อได้สูงสุด 32 รายการ การเชื่อมต่อขององค์กรต้องอยู่ในสถานะ `active` เมื่อ Session เริ่มต้น

### เครื่องมือในตัวของ SandBase {#built-in-sandbase-tools-1}

การสร้าง Agent โดยไม่มี `mcp_connections` จะเลือกเซิร์ฟเวอร์ SandBase ในตัว หากต้องการคงไว้อย่างชัดเจนควบคู่กับเซิร์ฟเวอร์ของคุณเอง ให้ใส่รายการนี้ในอาร์เรย์:

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

อาร์เรย์ที่ระบุอย่างชัดเจนจะแทนที่ตัวเลือกทั้งหมด ตัวอย่างที่ใช้เฉพาะเซิร์ฟเวอร์ที่กำหนดเองข้างต้นจึงไม่รวมเซิร์ฟเวอร์ในตัว ส่ง `[]` เพื่อปิดเครื่องมือ MCP ทั้งหมด การไม่ระบุฟิลด์นี้ในการอัปเดต Agent จะคงตัวเลือกเดิมไว้ ส่วน `null` จะส่งคืน `400` รายการในตัวไม่จำเป็นต้องสร้างการเชื่อมต่อ MCP หรือ Secret อย่าส่งฟิลด์ `use_sandbase_mcp` ที่เลิกใช้แล้ว

::: info แตกต่างจาก OpenAI
Agents API ของ OpenAI ประกาศเซิร์ฟเวอร์ MCP แบบ inline เป็น `tools: [{"type": "mcp", ...}]` แต่ SandBase จะส่งคืน `400` สำหรับรูปแบบนั้น ให้ลงทะเบียนเซิร์ฟเวอร์เป็นทรัพยากรการเชื่อมต่อแล้วอ้างอิงใน `mcp_connections` OpenAI SDK ไม่มีเมธอดสำหรับ `/v1/mcp-connections` หรือ `/v1/secrets` จึงต้องเรียกด้วย `client.post(...)` และส่ง `mcp_connections` ผ่าน `extra_body` (Python) หรือเนื้อหาคำขอ (Node.js) ดู[ความเข้ากันได้กับ OpenAI](/agents/openai-compatibility#mcp-connections-with-the-sdk)
:::

## การเปลี่ยนแปลงและ Sessions ที่กำลังทำงาน {#changes-and-running-sessions}

แต่ละ Session จะตรึงเวอร์ชันของ Agent, เวอร์ชันของ Skill และการกำหนดค่าการเชื่อมต่อ MCP ไว้เมื่อเริ่มต้น

- หลังจากคุณแทนที่การเชื่อมต่อหรือหมุนเวียน Secret ของการเชื่อมต่อ Sessions ใหม่จะใช้การกำหนดค่าใหม่ ส่วน Sessions ที่มีอยู่จะคงสแนปช็อตเดิม
- การปิดใช้งานการเชื่อมต่อหรือเพิกถอน Secret จะบล็อก Sessions ใหม่ และปฏิเสธ input เพิ่มเติมของ Sessions ที่มีอยู่ซึ่งใช้การเชื่อมต่อนั้น การเรียกเครื่องมือที่กำลังทำงานอยู่จะไม่ถูกขัดจังหวะ

## อย่าใส่โทเค็นไว้ใน prompt {#keep-tokens-out-of-prompts}

จัดเก็บโทเค็นเป็น Secrets อย่าใส่ไว้ใน instructions, input ของ Session, metadata หรือชุดไฟล์ Skill เพราะทุกคนที่เข้าถึง Agent หรือ Session ได้จะอ่านข้อมูลเหล่านั้นได้

## ขั้นตอนถัดไป {#next-steps}

- [ข้อมูลรับรองสำหรับเครื่องมือ MCP](/agents/api-credentials)
- [MCP Connections API](/api-reference/mcp-connections/)
- [Skills API](/api-reference/skills/)
- [กำหนด Agent](/agents/agent-api)
