---
i18nSource: 4e711691737c9671
title: แทนที่ Agent (CAS)
description: อัปเดต Agent ด้วย compare-and-set บน row_version
aside: false
outline: false
apiReference:
  title: แทนที่ Agent (CAS)
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: อัปเดตด้วย compare-and-set โดยต้องระบุ row_version และต้องตรงกับค่าปัจจุบัน มิฉะนั้นจะได้ 409 ฟิลด์ที่ส่งมาจะแทนที่ค่าที่บันทึกไว้ และค่า null ที่ระบุชัดเจนจะได้ 400 ใช้รูปแบบนี้เมื่อมีผู้แก้ไขหลายคนที่อาจเปลี่ยน Agent เดียวกัน
  groups:
    - title: พารามิเตอร์พาธ
      fields:
        - name: agent_id
          type: string
          required: true
          description: ID ของ Agent (ขึ้นต้นด้วย agt_)
    - title: เฮดเดอร์
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: ไม่บังคับ หากไม่ระบุ บริการจะสร้างให้เอง ซึ่งทำให้คำขอที่ลองใหม่อาจสร้างรายการซ้ำได้ ให้ส่งคีย์ที่คงที่ของคุณเองเมื่อลองใหม่
    - title: Request body
      description: row_version พร้อมฟิลด์ของ Agent บางส่วนหรือทั้งหมด
      fields:
        - name: row_version
          type: integer
          required: true
          description: row_version ที่คุณอ่านล่าสุด หากเป็นค่าที่ล้าสมัยจะได้ 409
        - name: model
          type: string
          required: false
          description: ID ของโมเดลจาก Models API ไม่เกิน 200 อักขระ
        - name: name
          type: string
          required: false
          description: ชื่อที่แสดง ไม่เกิน 128 อักขระ
        - name: instructions
          type: string
          required: false
          description: คำสั่งระบบ ไม่เกิน 256 KiB
        - name: runtime_profile
          type: string
          required: false
          description: "รันไทม์สำหรับการรัน: codex (ค่าเริ่มต้น), claude หรือ mcode"
        - name: skills
          type: array
          required: false
          description: 'การอ้างอิง Skill: {"skill_id": "skl_…", "version": null | "<version>"} สูงสุด 32 รายการ สำหรับการผูกใหม่ null จะตรึงเวอร์ชันเริ่มต้นปัจจุบันเมื่อบันทึก Agent สำหรับการผูกที่มีอยู่แล้ว null จะคงเวอร์ชันที่ตรึงไว้ ให้ระบุเวอร์ชันอย่างชัดเจนเพื่ออัปเกรด'
        - name: mcp_connections
          type: array
          required: false
          description: "การอ้างอิง MCP: {connection_id, server_label, allowed_tools, required} สูงสุด 32 รายการ และ server_label ต้องไม่ซ้ำกันภายใน Agent"
        - name: tools
          type: array
          required: false
          description: เครื่องมือฟังก์ชันสูงสุด 64 รายการ และเครื่องมือ web_search ได้ไม่เกินหนึ่งรายการ ปัจจุบัน Session กำหนดให้ปิดโหมด web_search และยังไม่รองรับผลลัพธ์ฟังก์ชันจากฝั่งไคลเอนต์
        - name: text
          type: object
          required: false
          description: format.type เป็น text หรือ json_schema (พร้อม schema แบบ object) และ verbosity เป็น low, medium หรือ high
        - name: reasoning
          type: object
          required: false
          description: effort เป็น none, minimal, low, medium, high, xhigh หรือ max และ summary เป็น concise, detailed หรือ auto
        - name: service_tier
          type: string
          required: false
          description: auto (ค่าเริ่มต้น), default, flex, priority หรือ fast
        - name: metadata
          type: object
          required: false
          description: คู่สตริงสูงสุด 16 คู่ คีย์ไม่เกิน 64 อักขระและค่าไม่เกิน 512 อักขระ
        - name: description
          type: string
          required: false
          description: ไม่เกิน 4096 อักขระ
        - name: note
          type: string
          required: false
          description: บันทึกการเปลี่ยนแปลงที่จะเก็บไว้ในเวอร์ชันใหม่
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
          }'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "PATCH",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "row_version": 2,
                "description": "Research Agent used by the weekly brief.",
                "note": "Add description"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "object": "agent",
        "name": "Research assistant",
        "model": "deepseek/deepseek-v4-flash",
        "instructions": "Answer with cited sources.",
        "tools": [],
        "text": {
          "format": {
            "type": "text"
          },
          "verbosity": "medium"
        },
        "reasoning": {
          "effort": null,
          "summary": null
        },
        "service_tier": "auto",
        "multi_agent": {
          "enabled": false,
          "max_concurrent_subagents": null
        },
        "visibility": "private",
        "status": "active",
        "version": 3,
        "row_version": 3,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "Research Agent used by the weekly brief.",
        "metadata": {
          "team": "research"
        },
        "mcp_connections": [],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
