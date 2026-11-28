---
i18nSource: 06a65ded83bf9438
title: แสดงรายการไฟล์ในเวิร์กสเปซ
description: แสดงรายการไฟล์ปัจจุบันในเวิร์กสเปซของ Session พร้อมพาธ ขนาด และการแบ่งหน้า endpoint แบบอ่านอย่างเดียวนี้ส่งคืน metadata ของไฟล์
aside: false
outline: false
apiReference:
  title: แสดงรายการไฟล์ในเวิร์กสเปซ
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: แสดงรายการพาธและขนาดของไฟล์ปัจจุบันในไดเรกทอรีหนึ่งของเวิร์กสเปซ Session รายการนี้มีเฉพาะ metadata ไม่ใช่ประวัติไฟล์แนบหรือเนื้อหาของ artifact พารามิเตอร์ query ที่ไม่รู้จักหรือซ้ำกันจะได้ 400
  groups:
    - title: พารามิเตอร์ของพาธ
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID (ขึ้นต้นด้วย ses_)
    - title: พารามิเตอร์ของ query
      fields:
        - name: path
          type: string
          required: false
          description: ไดเรกทอรีแบบ absolute /workspace หรือไดเรกทอรีที่ normalize แล้วซึ่งอยู่ภายใต้ /workspace ยาวสูงสุด 4096 ไบต์ ห้ามมีการท่องพาธ (traversal) เครื่องหมาย backslash หรือเครื่องหมายทับต่อท้าย
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: ขนาดหน้าตั้งแต่ 1 ถึง 100
          default: "20"
        - name: order
          type: string
          required: false
          description: "ลำดับการเรียงพาธ: asc หรือ desc"
          default: asc
        - name: page
          type: string
          required: false
          description: ค่า next แบบทึบจากการตอบกลับก่อนหน้า ไม่ต้องระบุในหน้าแรก และห้ามส่งสตริงว่าง ให้คง path, order และ limit ไว้เหมือนเดิม
    - title: ฟิลด์ของการตอบกลับ
      fields:
        - name: object
          type: string
          required: true
          description: เป็น page เสมอ
        - name: data
          type: array
          required: true
          description: ไฟล์ในไดเรกทอรีปัจจุบัน แต่ละรายการมี path และ size_bytes รายการนี้ไม่ได้แสดงแบบ recursive
        - name: next
          type: string | null
          required: true
          description: ส่งค่านี้เป็น page เพื่อดูหน้าถัดไป เป็น null เมื่อถึงหน้าสุดท้าย
        - name: has_more
          type: boolean
          required: true
          description: มีหน้าถัดไปหรือไม่
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "page",
        "data": [
          {
            "path": "/workspace/notes.md",
            "size_bytes": 1024
          }
        ],
        "next": null,
        "has_more": false
      }
---

<ApiReferencePage />

การอ่านเวิร์กสเปซอาจส่งคืน `workspace_provisioning`, `workspace_environment_missing`, `workspace_cursor_invalid` หรือ `workspace_unavailable` หาก cursor ไม่ถูกต้อง ให้เริ่มใหม่จากหน้าแรก ใช้ [Artifacts](./list-artifacts) เพื่อค้นหาเอาต์พุตที่สร้างขึ้นซึ่งดาวน์โหลดได้
