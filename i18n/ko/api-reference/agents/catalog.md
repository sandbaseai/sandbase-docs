---
i18nSource: 1b5099685e9df6ce
title: Agent 카탈로그
description: 공개 Agent를 둘러보고 조직으로 복제합니다.
---

# Agent 카탈로그 {#agent-catalog}

카탈로그에는 SandBase가 재사용할 수 있도록 공개한 Agent가 나열됩니다. 카탈로그 항목은 읽기 전용입니다. 항목을 복제하면 조직 안에서 편집, 실행, 배포할 수 있는 비공개 Agent를 얻을 수 있습니다.

| 메서드 | 경로 | 용도 |
|---|---|---|
| `GET` | `/v1/agents/catalog` | 공개 Agent 목록 조회 |
| `GET` | `/v1/agents/catalog/{agent_id}` | 공개 Agent 하나 조회. `?version=`으로 버전 지정 가능 |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | 조직으로 복사 |

## 카탈로그 Agent 목록 조회 {#list-catalog-agents}

`limit`(1-100), `after`, `order`를 사용한 커서 페이지네이션입니다.

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

각 항목에는 `id`, `object: "agent"`, `visibility: "public"`, `version`, `name`, `description`, `model`, `created_at`, `updated_at`이 포함됩니다.

## 카탈로그 Agent 조회 {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version`은 선택 사항이며 양의 정수여야 합니다. 상세 응답에는 읽기 전용 `configuration` 객체(이름, 설명, 모델, 지침, 런타임 프로필, 메타데이터, 도구, 텍스트, 추론, Skills)가 추가됩니다.

## 카탈로그 Agent 복제 {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

본문에는 선택 사항인 `version`(양의 정수, 기본값은 현재 공개 버전)과 `name`(최대 128자)을 넣을 수 있습니다. 응답은 `201 Created`이며, 조직 안에서 새 `agt_` ID를 받은 전체 [Agent 객체](./create)를 반환합니다. `Idempotency-Key`는 선택 사항입니다. 재시도 시 사본이 하나 더 생기지 않도록 고정된 키를 보내세요.

복제한 뒤 [Session을 생성](/api-reference/sessions/create)하여 테스트합니다.
