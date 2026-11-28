---
i18nSource: f3150233afd08b90
title: สร้าง Agent
description: สร้าง Agent ที่บันทึกไว้และมีการกำหนดเวอร์ชันด้วย POST /v1/agents
aside: false
outline: false
apiReference:
  title: สร้าง Agent
  operation: Agents
  method: POST
  path: /v1/agents
  description: สร้าง Agent ที่บันทึกไว้เป็นเวอร์ชัน 1 โดย body ต้องเป็น JSON แบบเข้มงวด ฟิลด์ที่ไม่รู้จักจะได้ 400 และต้องละ multi_agent ไว้หรือกำหนดเป็น null
  groups:
    - title: เฮดเดอร์
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: ไม่บังคับ หากไม่ระบุ บริการจะสร้างให้เอง ซึ่งทำให้คำขอที่ลองใหม่อาจสร้างรายการซ้ำได้ ให้ส่งคีย์ที่คงที่ของคุณเองเมื่อลองใหม่
    - title: Request body
      description: ออบเจ็กต์ JSON
      fields:
        - name: model
          type: string
          required: true
          description: ID โมเดลจาก Models API (บังคับ) ยาวได้สูงสุด 200 อักขระ ไม่มีค่าเริ่มต้น หากไม่ระบุ model จะได้ 400 ตัวอย่างใช้ deepseek/deepseek-v4-flash
        - name: name
          type: string
          required: false
          description: ชื่อที่แสดง ยาวได้สูงสุด 128 อักขระ
        - name: instructions
          type: string
          required: false
          description: คำสั่งระบบ ขนาดสูงสุด 256 KiB
        - name: runtime_profile
          type: string
          required: false
          description: "รันไทม์สำหรับการทำงาน: codex (ค่าเริ่มต้น), claude หรือ mcode"
        - name: skills
          type: array
          required: false
          description: 'การอ้างอิง Skill: {"skill_id": "skl_…", "version": null | "<version>"} สูงสุด 32 รายการ สำหรับการผูกใหม่ null จะตรึงเวอร์ชันเริ่มต้นปัจจุบัน ณ ตอนที่บันทึก Agent สำหรับการผูกที่มีอยู่แล้ว null จะคงเวอร์ชันที่ตรึงไว้ หากต้องการอัปเกรดให้ระบุเวอร์ชันอย่างชัดเจน'
        - name: mcp_connections
          type: array
          required: false
          description: 'การอ้างอิง MCP: {connection_id, server_label, allowed_tools, required} สูงสุด 32 รายการ และ server_label ต้องไม่ซ้ำกันภายใน Agent หากไม่ระบุจะได้เครื่องมือ SandBase ในตัว ({"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin"}) รายการที่คุณส่งจะแทนที่ค่าเริ่มต้นนี้ และ [] จะสร้าง Agent ที่ไม่มีเครื่องมือ ดูเครื่องมือ SandBase ในตัว (/agents/mcp-tools#built-in-sandbase-tools)'
        - name: tools
          type: array
          required: false
          description: function tool ได้สูงสุด 64 รายการ และ web_search tool ได้ไม่เกินหนึ่งรายการ ปัจจุบัน Session กำหนดให้ปิดโหมด web_search และยังไม่รองรับผลลัพธ์ function ฝั่งไคลเอนต์
        - name: text
          type: object
          required: false
          description: format.type เป็น text หรือ json_schema (พร้อม schema แบบออบเจ็กต์) ส่วน verbosity เป็น low, medium หรือ high
        - name: reasoning
          type: object
          required: false
          description: effort เป็น none, minimal, low, medium, high, xhigh หรือ max ส่วน summary เป็น concise, detailed หรือ auto
        - name: service_tier
          type: string
          required: false
          description: auto (ค่าเริ่มต้น), default, flex, priority หรือ fast
        - name: metadata
          type: object
          required: false
          description: คู่สตริงสูงสุด 16 คู่ คีย์ยาวได้ไม่เกิน 64 อักขระ และค่ายาวได้ไม่เกิน 512 อักขระ
        - name: description
          type: string
          required: false
          description: คำอธิบายแบบยาว สูงสุด 4096 อักขระ
        - name: note
          type: string
          required: false
          description: บันทึกการเปลี่ยนแปลงที่บันทึกไว้ในเวอร์ชัน 1
    - title: ออบเจ็กต์ Agent
      description: ส่งคืนจาก create, get, update, archive, unarchive, restore และ clone
      fields:
        - name: id
          type: string
          required: true
          description: ID ของ Agent ที่ขึ้นต้นด้วย agt_
        - name: object
          type: string
          required: true
          description: เป็น agent เสมอ
        - name: version
          type: integer
          required: true
          description: เวอร์ชันปัจจุบัน การเขียนที่มีผลทุกครั้งจะสร้างเวอร์ชันใหม่
        - name: row_version
          type: integer
          required: true
          description: โทเค็น compare-and-set สำหรับ PATCH, archive, unarchive และ restore
        - name: status
          type: string
          required: true
          description: active หรือ archived
        - name: projection_status
          type: string
          required: true
          description: ความพร้อมในการทำงานของเวอร์ชันปัจจุบัน Session ต้องการสถานะ ready ส่วน Agent ใหม่อาจแสดง pending ในช่วงสั้น ๆ
        - name: runtime_profile
          type: string
          required: true
          description: codex, claude หรือ mcode
        - name: visibility
          type: string
          required: true
          description: private สำหรับ Agent ของคุณ และ public สำหรับรายการในแค็ตตาล็อก
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Unix seconds โดย archived_at เป็น null ขณะที่ยัง active
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: create-research-agent-1" \
          -H "Content-Type: application/json" \
          -d '{
            "name": "Research assistant",
            "model": "deepseek/deepseek-v4-flash",
            "instructions": "Answer with cited sources.",
            "metadata": {
              "team": "research"
            }
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.create(
            model="deepseek/deepseek-v4-flash",
            name="Research assistant",
            instructions="Answer with cited sources.",
            metadata={"team": "research"},
        )
        print(agent.id, agent.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "create-research-agent-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents",
            headers=headers,
            json={
                "name": "Research assistant",
                "model": "deepseek/deepseek-v4-flash",
                "instructions": "Answer with cited sources.",
                "metadata": {
                    "team": "research"
                }
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'create-research-agent-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "name": "Research assistant",
            "model": "deepseek/deepseek-v4-flash",
            "instructions": "Answer with cited sources.",
            "metadata": {
              "team": "research"
            }
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
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
        "version": 1,
        "row_version": 1,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "",
        "metadata": {
          "team": "research"
        },
        "mcp_connections": [
          {"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin", "allowed_tools": null, "required": true}
        ],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
