---
i18nSource: 1b680f7f0804feb7
title: อัปเดต Agent
description: อัปเดต Agent บางส่วนด้วย POST update แบบเดียวกับ OpenAI SDK
aside: false
outline: false
apiReference:
  title: อัปเดต Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: การอัปเดตบางส่วนแบบ SDK ฟิลด์ที่ส่งมาจะแทนที่ค่าที่บันทึกไว้และสร้างเวอร์ชันใหม่ ส่วนฟิลด์ที่ไม่ได้ส่งจะคงค่าเดิมไว้ ไม่ต้องใช้ row_version ที่นี่ไม่รับ description และ note ให้ใช้ Replace (PATCH) สำหรับฟิลด์เหล่านั้น Agent ที่ถูกเก็บถาวรจะส่งคืน 404
  groups:
    - title: พารามิเตอร์ของพาธ
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
          description: ไม่บังคับ หากไม่ระบุ บริการจะสร้างให้เอง ซึ่งทำให้คำขอที่ส่งซ้ำอาจสร้างรายการซ้ำได้ ควรส่งคีย์ที่คงที่ของคุณเองเมื่อส่งคำขอซ้ำ
    - title: เนื้อหาคำขอ
      description: ชุดย่อยใดก็ได้ของฟิลด์เหล่านี้ ฟิลด์อื่นจะส่งคืน 400
      fields:
        - name: model
          type: string
          required: false
          description: ID ของโมเดลจาก Models API ยาวได้สูงสุด 200 อักขระ
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
          description: 'การอ้างอิง Skill: {"skill_id": "skl_…", "version": null | "<version>"} สูงสุด 32 รายการ สำหรับการผูกใหม่ null จะตรึงเวอร์ชันเริ่มต้นปัจจุบัน ณ ตอนที่บันทึก Agent สำหรับการผูกที่มีอยู่แล้ว null จะคงเวอร์ชันที่ตรึงไว้ ให้ระบุเวอร์ชันอย่างชัดเจนเพื่ออัปเกรด'
        - name: mcp_connections
          type: array
          required: false
          description: "การอ้างอิง MCP: {connection_id, server_label, allowed_tools, required} สูงสุด 32 รายการ และ server_label ต้องไม่ซ้ำกันภายใน Agent"
        - name: tools
          type: array
          required: false
          description: เครื่องมือ function ได้สูงสุด 64 รายการ บวกเครื่องมือ web_search ได้ไม่เกินหนึ่งรายการ ปัจจุบัน Sessions กำหนดให้ปิดโหมด web_search และยังไม่รองรับผลลัพธ์ของ function ฝั่งไคลเอนต์
        - name: text
          type: object
          required: false
          description: format.type เป็น text หรือ json_schema (พร้อมสคีมาแบบ object) และ verbosity เป็น low, medium หรือ high
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
          description: คู่สตริงสูงสุด 16 คู่ คีย์ยาวได้สูงสุด 64 อักขระ และค่ายาวได้สูงสุด 512 อักขระ
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "instructions": "Answer in five bullet points with cited sources."
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.update(
            "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            instructions="Answer in five bullet points with cited sources.",
        )
        print(agent.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "instructions": "Answer in five bullet points with cited sources."
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "instructions": "Answer in five bullet points with cited sources."
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
        "instructions": "Answer in five bullet points with cited sources.",
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
        "version": 2,
        "row_version": 2,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "",
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
