---
i18nSource: 91ce9f65766e9662
title: สร้าง Session
description: สร้าง Session สำหรับ Agent ที่บันทึกไว้หรือ Agent แบบ inline ด้วย POST /v1/agents/sessions และเลือกสตรีมเทิร์นแรกได้
aside: false
outline: false
apiReference:
  title: สร้าง Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: สร้าง Session สำหรับเวอร์ชันของ Agent ที่บันทึกไว้ หรือสำหรับ Agent แบบ inline ที่กำหนดในคำขอ การกำหนดค่า Agent, เวอร์ชันของ Skill และการเชื่อมต่อ MCP จะถูกตรึงไว้ตลอดอายุของ Session Sessions ทำงานบนคลาวด์ที่ SandBase โฮสต์เสมอ จึงไม่มีสภาพแวดล้อมการทำงานให้เลือก เมื่อใช้ stream=true พร้อม input เริ่มต้น การตอบกลับจะเป็นสตรีม Server-Sent Events สถานะ 201 ของเทิร์นแรกแทน Session แบบ JSON การตรวจสิทธิ์การทำงาน (ยอดเงินและสถานะขององค์กร) จะตรวจที่ขั้นตอนนี้ OpenAI SDK ต้องการอาร์กิวเมนต์ environment โปรดดู ความเข้ากันได้กับ OpenAI (/agents/openai-compatibility)
  groups:
    - title: เฮดเดอร์
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: ไม่บังคับ หากไม่ระบุ บริการจะสร้างให้เอง ซึ่งทำให้คำขอที่ส่งซ้ำอาจสร้างรายการซ้ำได้ ควรส่งคีย์ที่คงที่ของคุณเองเมื่อส่งคำขอซ้ำ
    - title: เนื้อหาคำขอ
      description: ออบเจ็กต์ JSON แบบเข้มงวด
      fields:
        - name: agent_id
          type: string
          required: false
          description: ID ของ Agent ที่บันทึกไว้ (ขึ้นต้นด้วย agt_) Agent ต้องอยู่ในสถานะ active และมี projection_status เป็น ready ส่ง agent_id, agent หรือทั้งสองอย่าง
        - name: agent
          type: object
          required: false
          description: การกำหนดค่า Agent ฟิลด์ที่รับได้คือ model, instructions, runtime_profile (codex, claude หรือ mcode ค่าเริ่มต้นคือ codex), service_tier, tools, text, reasoning และ multi_agent ซึ่งตรวจสอบแบบเดียวกับ Create Agent หากไม่มี agent_id จะเป็นการกำหนด Agent แบบ inline และต้องระบุ model ทั้งนี้ Agent แบบ inline ไม่มี Skills หรือการเชื่อมต่อ MCP หากมี agent_id แต่ละฟิลด์ที่คุณส่งจะแทนที่ฟิลด์นั้นของเวอร์ชันที่บันทึกไว้สำหรับ Session นี้เท่านั้น ฟิลด์ที่ไม่รู้จักจะส่งคืน 400
        - name: version
          type: integer
          required: false
          description: เวอร์ชันของ Agent ค่าเริ่มต้นคือเวอร์ชันปัจจุบัน ใช้กับ Agent แบบ inline ไม่ได้
        - name: title
          type: string
          required: false
          description: ชื่อของ Session
        - name: input
          type: string | array
          required: false
          description: 'input แรก (ไม่บังคับ): สตริง หรืออาร์เรย์ที่มีข้อความเพียงหนึ่งรายการ เช่น [{"role":"user","content":[{"type":"input_text","text":"…"}]}] ออบเจ็กต์เดี่ยวจะส่งคืน 400'
        - name: model
          type: string
          required: false
          description: การแทนที่โมเดล agent.model เป็นรูปแบบของ OpenAI SDK หากส่งทั้งสองค่า ค่าต้องตรงกัน
        - name: metadata
          type: object
          required: false
          description: คู่สตริงสูงสุด 16 คู่
        - name: stream
          type: boolean
          required: false
          description: "เมื่อเป็น true ต้องมี input ที่ไม่ว่าง และจะส่งคืน 201 พร้อมเนื้อหาแบบ text/event-stream อีเวนต์ใช้รูปแบบ Stream events (event: <type>, data: <json>) อีเวนต์แรกคือ agent.session.created ซึ่งมีสแนปช็อตของ Session ตามด้วยอีเวนต์ item และ output ของเทิร์น ข้อผิดพลาดด้านการตรวจสอบ การตรวจสิทธิ์ และข้อผิดพลาดอื่นก่อนเริ่มสตรีมจะส่งคืนเป็นข้อผิดพลาด JSON ตามปกติ ค่าเริ่มต้นคือ false"
        - name: environment
          type: object
          required: false
          description: ใช้เพื่อความเข้ากันได้กับ OpenAI SDK เท่านั้น ไม่ต้องระบุในการเรียก HTTP โดยตรง ระบบรับ {"type":"openai_hosted"} และ type อื่นจะส่งคืน 400
        - name: model_provider
          type: object
          required: false
          description: ข้อมูลรับรองของโมเดล ไม่ต้องระบุหากต้องการใช้ API key ที่เรียกอยู่ {"type":"custom","base_url":"https://…","api_key":"…"} จะเรียกเอนด์พอยต์ที่เข้ากันได้กับ OpenAI ของคุณเอง เขียนได้อย่างเดียว
        - name: github_workspace
          type: object
          required: false
          description: 'รีโพสิทอรี GitHub ที่จะโคลนลงใน /workspace สำหรับ Session นี้: {"repository_id":"1195090324","ref":"main","connection_id":"plc_…"} ต้องระบุเพียง repository_id และ ref มีค่าเริ่มต้นเป็นสาขาเริ่มต้น หากไม่ระบุหรือเป็น null จะใช้รีโพสิทอรี workspace ของ Agent (ถ้ามี) มิฉะนั้นจะไม่โคลนอะไรเลย รีโพสิทอรีต้องอยู่ในขอบเขตการเชื่อมต่อ GitHub ของ Agent โปรดดู workspace จากรีโพสิทอรี GitHub (/agents/github-workspace)'
    - title: ออบเจ็กต์ Session
      description: ส่งคืนโดย create, get, update, rename, archive และ unarchive
      fields:
        - name: id
          type: string
          required: true
          description: ID ของ Session ที่ขึ้นต้นด้วย ses_
        - name: status
          type: string
          required: true
          description: "สถานะการทำงาน: idle, in_progress หรือ failed ยังไม่รองรับ requires_action และจะปรากฏเป็น 502 executor_contract_error"
        - name: lifecycle_status
          type: string
          required: true
          description: active หรือ archived Session ที่ถูกเก็บถาวรจะไม่รับ input
        - name: failure
          type: object · null
          required: true
          description: ข้อผิดพลาดสาธารณะพร้อม code, message, action และ retryable (ถ้ามี)
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: เวอร์ชันของ Agent ที่ถูกตรึงไว้และโมเดลที่ใช้งานจริง
        - name: agent · usage
          type: object · object | null
          required: true
          description: สแนปช็อตในรูปแบบ OpenAI ของการกำหนดค่า Agent ที่ใช้งานจริง และการใช้โทเค็น (เป็น null จนกว่าเทิร์นจะรายงานการใช้งาน)
        - name: source · source_id
          type: string · null
          required: false
          description: ที่มาของ Session ซึ่ง Session ที่สร้างด้วย POST /v1/agents/sessions จะรายงานเป็น direct และ source_id เป็น null
        - name: row_version
          type: integer
          required: true
          description: โทเค็น compare-and-set สำหรับ rename, archive และ unarchive
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-2026-10-06" \
          -H "Content-Type: application/json" \
          -d '{
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "title": "Market scan"
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        session = client.beta.agents.sessions.create(
            agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
        )
        print(session.id, session.status)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-2026-10-06",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions",
            headers=headers,
            json={
                "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
                "title": "Market scan",
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-2026-10-06',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "title": "Market scan"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
      {
        "id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
        "object": "agent.session",
        "agent": {
          "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
          "name": "Research assistant",
          "model": "deepseek/deepseek-v4-flash",
          "instructions": "Answer with cited sources.",
          "multi_agent": {"enabled": false, "max_concurrent_subagents": null},
          "reasoning": {"effort": null, "summary": null},
          "service_tier": "auto",
          "text": {"format": {"type": "text"}, "verbosity": "medium"},
          "tools": []
        },
        "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "agent_version": 1,
        "title": "Market scan",
        "model": "deepseek/deepseek-v4-flash",
        "environment": {
          "id": "env_…",
          "type": "openai_hosted",
          "capability_directories": [],
          "files": [],
          "network": {"access": "enabled", "allowed_domains": []},
          "packages": {"npm": [], "python": [], "system": []},
          "plugins": [],
          "skills": []
        },
        "metadata": {},
        "status": "idle",
        "lifecycle_status": "active",
        "sync_status": "ready",
        "execution_status": "idle",
        "failure": null,
        "row_version": 1,
        "required_actions": [],
        "vault_ids": [],
        "usage": null,
        "created_at": 1791273600,
        "last_active_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null,
        "source": "direct",
        "source_id": null
      }
---

<ApiReferencePage />
