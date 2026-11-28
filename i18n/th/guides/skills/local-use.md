---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: ใช้ Skill บนเครื่องของคุณ
description: เลือก Skill จาก SandBase Lab ดาวน์โหลดแพ็กเกจ กำหนดค่าการเข้าถึงโมเดล แล้วสร้างและบันทึกโปรเจกต์ด้วย agent บนเครื่อง
---

# ใช้ Skill บนเครื่องของคุณ {#use-a-skill-locally}

ดาวน์โหลด SandBase Skill แล้วทำโปรเจกต์ให้เสร็จด้วย agent บนคอมพิวเตอร์ของคุณ Skill ประกอบด้วยคำสั่ง สคริปต์ และตัวอย่าง โดย agent จะทำตามเวิร์กโฟลว์ที่อธิบายไว้ใน `SKILL.md`


## 1. เลือก Skill {#_1-choose-a-skill}

1. เปิด [SandBase Lab](https://www.sandbase.ai/lab/)
2. เรียกดูตัวอย่าง เช่น วิดีโอ แอนิเมชัน และแผนที่ แล้วเปิด Skill ที่ตรงกับโปรเจกต์ของคุณ
3. ตรวจสอบตัวอย่าง อินพุตที่ต้องใช้ รูปแบบเอาต์พุต และภาษาที่รองรับ
4. ใช้ปุ่มดาวน์โหลด Skill เพื่อบันทึกแพ็กเกจ ZIP

สำหรับภาพยนตร์แผนที่ประวัติศาสตร์ของเมือง ให้เริ่มจากตัวอย่างและคำสั่งของ [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time)

## 2. เตรียมโฟลเดอร์ทำงานบนเครื่อง {#_2-prepare-a-local-working-folder}

1. สร้างโฟลเดอร์โปรเจกต์ เช่น `my-city-film`
2. แตกไฟล์ ZIP ของ Skill ทั้งหมดลงในโฟลเดอร์นั้น โดยเก็บคำสั่ง สคริปต์ และไฟล์ประกอบไว้ครบ
3. เปิดโปรเจกต์ใน agent บนเครื่องของคุณ และอนุญาตให้เข้าถึงไฟล์และคำสั่งที่เวิร์กโฟลว์ต้องใช้
4. ทำตามคำแนะนำการติดตั้งในหน้า Skill หรือขอให้ agent อ่าน `SKILL.md` ที่แตกไฟล์แล้วโดยตรง

โปรเจกต์สามารถใช้โครงสร้างนี้ได้:

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

ใช้ชื่อไฟล์และตำแหน่งเอาต์พุตตามที่ Skill กำหนด

## 3. เชื่อมต่อ SandBase {#_3-connect-sandbase}

วาง `set up https://www.sandbase.ai/SKILL.md` ลงใน agent ของคุณ แล้วอนุมัติการลงชื่อเข้าใช้ในเบราว์เซอร์ที่เปิดขึ้น หรือรัน `npx -y @sandbaseai/cli@latest connect` ในเทอร์มินัล จากนั้นเริ่ม agent session ใหม่เพื่อให้เครื่องมือของ SandBase โหลดขึ้นมา ตัวเลือกเดียวกันนี้อยู่ที่ [Build → AI tools](https://www.sandbase.ai/console/setup) ใน Console

ดูเวิร์กโฟลว์การเชื่อมต่อแบบเต็มได้ที่ [เชื่อมต่อเครื่องมือ AI](/setup/)

หากสคริปต์ของ Skill ต้องใช้ `SANDBASE_API_KEY`:

1. เปิด [API Keys](https://www.sandbase.ai/console/keys) แล้วสร้างหรือเลือกคีย์สำหรับโปรเจกต์
2. กำหนดค่าคีย์ผ่านการตั้งค่าที่ปลอดภัยของ agent บนเครื่องหรือสภาพแวดล้อมที่ใช้รันสคริปต์
3. ขอให้ agent ตรวจสอบว่ากำหนดค่าการเข้าถึงแล้ว และทำเวิร์กโฟลว์ของ Skill ต่อ

เก็บคีย์ไว้ในการกำหนดค่าบนเครื่องที่ปลอดภัย ใส่เฉพาะข้อมูลโปรเจกต์ในงานที่ส่งมอบ ไฟล์ซอร์ส และภาพหน้าจอสาธารณะ ดูการใช้งานโมเดลและยอดเงินคงเหลือได้ใน [Billing](https://www.sandbase.ai/console/billing)

## 4. ให้รายละเอียดงาน {#_4-provide-a-brief}

บอก agent ว่าจะใช้ Skill ใด ต้องการสร้างอะไร ข้อกำหนดของเอาต์พุต และงบประมาณของคุณ ปรับตัวอย่างนี้ให้เข้ากับโปรเจกต์ของคุณ:

```text
Read SKILL.md in the project's skill folder and follow its workflow.

Topic: the story of Shanghai's development.
Deliverables: a playable video, a cover image, and usage notes.
Language and duration: use the Skill's supported options and state the plan before starting.
Models: use suitable models through SandBase.
Budget: model calls may use up to [AMOUNT] USD; ask me before exceeding it.

Check inputs and dependencies, then execute the workflow. Save previews and final files
in outputs. When finished, provide file paths, a summary, and the models actually used.
```

agent จะอ่านคำสั่ง ตรวจสอบ dependency ประมวลผลอินพุต และสร้างหรือเรนเดอร์โปรเจกต์ หากมีการขอไฟล์เพิ่มเติม ให้ใส่ไว้ในโปรเจกต์เดียวกันแล้วทำงานต่อ

## 5. ติดตามความคืบหน้าและตรวจสอบผลลัพธ์ {#_5-follow-progress-and-review-the-result}

ระยะเวลาขึ้นอยู่กับ Skill, โมเดล, ไฟล์ประกอบ และความยาวของเอาต์พุต โปรเจกต์วิดีโออาจใช้เวลาหลายสิบนาทีจนถึงหลายชั่วโมง ให้ agent ทำงานต่อไปและอย่าให้คอมพิวเตอร์เข้าสู่โหมดพัก

สอบถามความคืบหน้าในบทสนทนาเดิม:

```text
Report the current step, files already saved, and the next step, then continue the task.
```

เปิดพาธไฟล์ที่ส่งมอบ ตรวจสอบภาพ เสียง คำบรรยาย และเนื้อหา แล้วบันทึกไฟล์สุดท้าย

## 6. แก้ไขโปรเจกต์ {#_6-revise-the-project}

ขอการเปลี่ยนแปลงที่เจาะจงในงานเดิม และนำไฟล์ประกอบที่มีอยู่กลับมาใช้:

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

หากการทำงานถูกขัดจังหวะ ให้เก็บโฟลเดอร์ทำงานไว้และขอให้ agent ทำต่อจากขั้นตอนปัจจุบัน

## ขั้นตอนถัดไป {#next-steps}

- [เข้าร่วม AI City Remix](/guides/skills/ai-city-remix)
- [เชื่อมต่อ agent ของคุณ](/setup/)
- [กำหนดค่า API key](/getting-started/api-keys)
