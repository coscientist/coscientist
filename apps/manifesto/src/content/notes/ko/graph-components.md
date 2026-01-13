---
title: 그래프 구성 요소
description: 변증법적 그래프를 구성하는 노드 및 에지 유형
---

그래프 구성 요소는 [변증법적 그래프](./dialectical-graph)의 기본 단위입니다. 즉, 인식론적 객체(epistemic objects)를 나타내는 노드 유형과, 그들 사이의 관계를 나타내는 에지 유형입니다.

**노드 유형**([변증법적 그래프 노드](./dialectical-graph-nodes) 참고):

- [주장](./claim) — 검증 가능한 명제
- [증거 구간](./evidence-span) — 출처에서 정확히 인용한 텍스트
- [범위](./scope) — 적용 조건
- [가정](./assumption) — 암묵적 전제
- [방법](./method) — 증거를 생성하기 위한 절차
- [출처](./source) — 출처/기원(provenance) 앵커
- [반례](./counterexample) — 주장을 깨뜨리는 사례
- [이슈 노드](./issue-node) — 충돌하는 주장들의 묶음

**에지 유형**([변증법적 그래프 에지](./dialectical-graph-edges) 참고):

- [공격](./attack) — 진실성에 대한 직접적 도전
- [언더컷](./undercut) — 근거에 대한 도전
- `supports`, `refines`, `generalizes`, `specializes`
- `cites`, `defines`, `measures`, `replicates`, `fails_to_replicate`
- [쟁점](./contention) — 구조화된 갈등 마커