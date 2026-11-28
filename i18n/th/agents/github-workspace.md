---
i18nSource: e4dcecbecc736e53
title: เวิร์กสเปซจากรีโพสิทอรี GitHub
description: Clone รีโพสิทอรี GitHub ลงใน /workspace ของ Session, push ไปยังแบรนช์ของ Session และเปิด pull request
---

# เวิร์กสเปซจากรีโพสิทอรี GitHub {#github-repository-workspace}

Session สามารถเริ่มต้นโดยมีรีโพสิทอรี GitHub ถูก clone ไว้ใน `/workspace` แล้ว Agent จะทำงานกับโค้ดด้วยคำสั่ง `git` ตามปกติ push คอมมิตไปยังแบรนช์ที่สงวนไว้สำหรับ Session และเปิด pull request ให้คนตรวจสอบได้

การเข้าถึงรีโพสิทอรีจะผ่าน git proxy ของ SandBase ไม่มี GitHub token ใดเข้าไปอยู่ใน Session

## ก่อนเริ่มต้น {#before-you-start}

ผู้ดูแลระบบขององค์กรตั้งค่านี้เพียงครั้งเดียวใน Console:

1. เชื่อมต่อ GitHub ที่ **Console → Integrations** และเลือกรีโพสิทอรีที่การเชื่อมต่อนี้ใช้ได้
2. กำหนดการเชื่อมต่อให้กับ Agent ในส่วน **Integrations** ของ Agent เครื่องมือของ Agent สำหรับการเชื่อมต่อนี้ต้องมี **Read code** จึงจะ clone ได้ และหากต้องการ push ต้องมี **Commit to a task branch** ด้วย
3. ไม่บังคับ: เลือก **Workspace repository** และแบรนช์ในการกำหนดนั้น จากนั้น Session จะ clone รีโพสิทอรีนี้โดยค่าเริ่มต้น

`repository_id` คือ ID ตัวเลขของรีโพสิทอรีใน GitHub คุณอ่านค่านี้ได้จาก `GET https://api.github.com/repos/{owner}/{repo}` (ฟิลด์ `id`) หรือจากเครื่องมือ `github_list_repositories`

## เลือกรีโพสิทอรีสำหรับแต่ละ Session {#choose-the-repository-per-session}

ส่ง `github_workspace` เมื่อสร้าง Session:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: fix-login-2026-11-18" \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    "github_workspace": {"repository_id": "1195090324", "ref": "main"},
    "input": "Fix the failing login test, push your change and open a pull request."
  }'
```

| ฟิลด์ | จำเป็น | ความหมาย |
|---|---|---|
| `repository_id` | ใช่ | สตริงเลขฐานสิบ รีโพสิทอรีต้องอยู่ในขอบเขตรีโพสิทอรีของ Agent สำหรับการเชื่อมต่อนั้น |
| `ref` | ไม่ | แบรนช์ที่จะ checkout ค่าเริ่มต้นคือแบรนช์หลักของรีโพสิทอรี |
| `connection_id` | ไม่ | การเชื่อมต่อ GitHub ที่จะใช้ ค่าเริ่มต้นคือการกำหนดที่มี workspace repository หรือการเชื่อมต่อ GitHub เพียงรายการเดียวของ Agent |

`github_workspace` เป็นค่าที่ไม่บังคับ:

- ไม่ระบุหรือเป็น `null`: Session จะ clone workspace repository ของ Agent หากมีการตั้งค่าไว้ หากไม่มี จะไม่มีการ clone และ Session จะเริ่มตามปกติ
- ระบุ: ค่านี้จะแทนที่ค่าเริ่มต้นของ Agent สำหรับ Session นี้เท่านั้น

แต่ละ Session มี workspace repository ได้สูงสุดหนึ่งรายการ และตัวเลือกนี้จะถูกกำหนดตายตัวเมื่อสร้าง Session

## สิ่งที่ Session ได้รับ {#what-the-session-gets}

- checkout ของ `ref` ใน `/workspace` โดย `origin` ชี้ไปที่ git proxy คำสั่ง `git fetch`, `git pull` และ `git push` ทำงานได้ตามปกติ
- คอมมิตที่มีผู้เขียนเป็น `sandbase-agents[bot]`
- `SANDBASE_GIT_BRANCH_PREFIX` เช่น `agents/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/`
- `SANDBASE_WORKSPACE_REPOSITORY` ซึ่งเป็น `owner/name` ของรีโพสิทอรี

## กฎการ push {#push-rules}

Agent จะ push ได้เฉพาะแบรนช์ที่อยู่ภายใต้ prefix ของตนเองเท่านั้น:

```bash
git push origin HEAD:${SANDBASE_GIT_BRANCH_PREFIX}fix-login
```

- สามารถ push ไปยังแบรนช์เดิมซ้ำได้ รวมถึงแบรนช์ที่มี pull request เปิดอยู่แล้ว
- การ push ไปยังแบรนช์หลัก แบรนช์อื่น prefix ของ Session อื่น และแท็ก จะถูกปฏิเสธก่อนถึง GitHub โดย Git จะแสดง `sandbase: only agents/<session>/* branches can be pushed`
- proxy ไม่สามารถแก้ไขไฟล์เวิร์กโฟลว์ของ GitHub Actions ได้

เฉพาะแบรนช์ที่ Session push เท่านั้นที่ถือเป็นแบรนช์ของ Session เครื่องมือ `github_open_pull_request` ยอมรับแบรนช์นี้ รวมถึงการเชื่อมต่อที่จำกัดขอบเขตการ merge ไว้เฉพาะแบรนช์ที่มีการจัดการ

## สิทธิ์เป็นไปตามการเชื่อมต่อ {#permissions-follow-the-connection}

คำขอ git ทุกรายการจะถูกตรวจสอบกับการกำหนดปัจจุบันของ Agent และนโยบายปัจจุบันของการเชื่อมต่อ

- หากผู้ดูแลระบบจำกัดขอบเขตรีโพสิทอรีให้แคบลง การ fetch หรือ push ครั้งถัดไปจะถูกปฏิเสธ
- หากผู้ดูแลระบบนำ **Commit to a task branch** ออก การ push ครั้งถัดไปจะถูกปฏิเสธ
- หากผู้ดูแลระบบเพิกถอนการเชื่อมต่อ การ fetch หรือ push ครั้งถัดไปจะถูกปฏิเสธ

แต่ละ Session ส่งคำขอ git ได้สูงสุด 120 ครั้งต่อนาที

## ข้อผิดพลาด {#errors}

| การตอบกลับ | สาเหตุ |
|---|---|
| `400 invalid_request` (`param: github_workspace`) | `repository_id` ไม่ใช่สตริงเลขฐานสิบ, `ref` ไม่ใช่ชื่อแบรนช์ธรรมดา, Agent ไม่มีการเชื่อมต่อ GitHub หรือไม่รองรับชื่อแบรนช์หลักของรีโพสิทอรี (ให้ระบุ `ref` อย่างชัดเจน) |
| `400 invalid_request` | Agent มีการเชื่อมต่อ GitHub หลายรายการและไม่มีรายการใดมี workspace repository ให้ส่ง `connection_id` |
| `403 insufficient_scope` | รีโพสิทอรีหรือการเชื่อมต่ออยู่นอกขอบเขตของ Agent หรือเครื่องมือของ Agent ไม่มี **Read code** |

## ขั้นตอนถัดไป {#next-steps}

- [เรียกใช้ Session](/agents/sessions)
- [เอกสารอ้างอิง API สำหรับสร้าง Session](/api-reference/sessions/create)
