---
title: องค์ประกอบของกราฟ
description: ประเภทของโหนดและขอบที่ประกอบกันเป็นกราฟเชิงวิภาษ (dialectical graph)
---

องค์ประกอบของกราฟคือหน่วยย่อยพื้นฐานของ [กราฟเชิงวิภาษ](./dialectical-graph): ประเภทของโหนดที่แทนวัตถุเชิงญาณวิทยา (epistemic objects) และประเภทของขอบที่แทนความสัมพันธ์ระหว่างโหนดเหล่านั้น

**ประเภทของโหนด** (ดู [โหนดของกราฟเชิงวิภาษ](./dialectical-graph-nodes)):

- [ข้ออ้าง (Claim)](./claim) — ข้อความเชิงเสนอที่ตรวจสอบได้
- [ช่วงหลักฐาน (Evidence Span)](./evidence-span) — ข้อความที่อ้างอิงแบบคำต่อคำจากแหล่งข้อมูล
- [ขอบเขต (Scope)](./scope) — เงื่อนไขของการใช้บังคับ
- [สมมติฐาน (Assumption)](./assumption) — บทตั้งต้นโดยนัย (implicit premises)
- [วิธีการ (Method)](./method) — กระบวนการสำหรับสร้างหลักฐาน
- [แหล่งที่มา (Source)](./source) — จุดยึดของที่มา (provenance anchors)
- [ข้อโต้แย้งเชิงตัวอย่าง (Counterexample)](./counterexample) — กรณีที่ทำให้ข้ออ้างใช้ไม่ได้
- [โหนดประเด็น (Issue Node)](./issue-node) — กลุ่มของข้ออ้างที่ชนกัน

**ประเภทของขอบ** (ดู [ขอบของกราฟเชิงวิภาษ](./dialectical-graph-edges)):

- [การโจมตี (Attack)](./attack) — การท้าทายความจริงโดยตรง
- [การตัดทอนฐานเหตุ (Undercut)](./undercut) — การท้าทายฐานรองรับ/เหตุผล
- `supports`, `refines`, `generalizes`, `specializes`
- `cites`, `defines`, `measures`, `replicates`, `fails_to_replicate`
- [การขัดแย้ง (Contention)](./contention) — เครื่องหมายกำกับความขัดแย้งแบบมีโครงสร้าง