---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: 저장된 Agent 구성을 생성하고, 버전을 관리하고, 보관하고, 복제합니다.
---

# Agents API {#agents-api}

Agent는 저장되고 버전이 관리되는 구성으로, 모델, 지침, 런타임 프로필, Skills, MCP 연결, 출력 설정으로 이루어집니다. Agent를 생성하거나 업데이트해도 실행되지는 않습니다. 실행은 [Session](/api-reference/sessions/)에서 합니다.

Agents API는 OpenAI Agents 프로토콜(OpenAI Python SDK의 `client.beta.agents`)을 따릅니다. `OpenAI-Beta` 헤더는 선택 사항이며, 보내는 경우 값은 `agents=v1`이어야 합니다. SandBase는 여기에 버전, compare-and-set 업데이트, 보관과 복원, 공개 카탈로그를 추가합니다.

## Agent 작업 {#agent-operations}

| 메서드 | 경로 | 용도 |
|---|---|---|
| `POST` | `/v1/agents` | 버전 1로 [Agent 생성](./create) |
| `GET` | `/v1/agents` | [Agent 목록 조회](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Agent 조회](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Agent 업데이트](./update)(SDK 방식 부분 업데이트) |
| `PATCH` | `/v1/agents/{agent_id}` | `row_version` 기반 [compare-and-set 교체](./replace) |
| `DELETE` | `/v1/agents/{agent_id}` | [삭제](./delete). Agent를 보관함 |
| `POST` | `/v1/agents/{agent_id}/archive` | [Agent 보관](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [Agent 보관 해제](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [이전 버전을 복원](./restore)하여 새 버전으로 저장 |
| `GET` | `/v1/agents/{agent_id}/versions` | [버전 목록 조회](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [특정 버전 조회](./get-version) |
| `GET` | `/v1/agents/catalog` | [공개 카탈로그 둘러보기](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | 조직으로 [카탈로그 Agent 복제](./catalog#clone-a-catalog-agent) |

Agent ID는 `agt_` 접두사를 사용합니다. 요청 본문은 최대 1 MiB의 엄격한 JSON이며, 알 수 없는 필드는 400을 반환합니다.

## 버전과 업데이트 {#versions-and-updates}

- 실제 변경이 있는 모든 쓰기(create, update, replace, restore)는 변경할 수 없는 버전을 생성합니다. `version`은 현재 버전 번호입니다.
- `POST /v1/agents/{agent_id}`는 OpenAI SDK의 업데이트입니다. `row_version`이 필요 없으므로 마지막에 쓴 요청이 적용됩니다.
- `PATCH /v1/agents/{agent_id}`에는 마지막으로 읽은 `row_version`이 필요하며, 다른 사용자가 먼저 Agent를 변경했으면 409를 반환합니다. 동시에 실행될 수 있는 편집기와 자동화에서 사용하세요.
- 각 Session은 시작 시점의 Agent 버전, Skill 버전, MCP 연결 구성을 고정합니다.

## 준비 상태 {#readiness}

새로 쓴 버전은 실행 준비 중에 `projection_status`를 보고합니다. Sessions에는 `projection_status`가 `ready`인 활성 Agent가 필요하며, 그렇지 않으면 409를 반환합니다. 보관된 Agent도 새 실행에 대해 409를 반환합니다.

## 현재 제한 사항 {#current-limits}

- `tools`는 `function` 도구와 최대 하나의 `web_search` 도구를 허용합니다. 현재 실행하려면 `web_search.mode`가 `disabled`여야 합니다.
- function 도구는 저장할 수 있지만, 클라이언트에 도구 결과 반환을 요청하는 Run(`requires_action`)은 아직 지원되지 않으며 `502 executor_contract_error`로 표시됩니다.
- `multi_agent`는 생략하거나 `null`이어야 합니다.

## 페이지네이션 {#pagination}

`GET /v1/agents`와 카탈로그는 커서 페이지네이션을 사용합니다. `limit`(1-100, 기본값 20), `after`, `order`(`asc` 또는 `desc`, 기본값 `desc`)를 지정합니다. 응답에는 `object: "list"`, `data`, `has_more`, `first_id`, `last_id`가 포함되며, 다음 페이지를 가져오려면 `last_id`를 `after`로 전달합니다.

`GET /v1/agents/{agent_id}/versions`는 오프셋 페이지네이션을 사용합니다. `limit`과 `offset`을 지정하며, 응답에는 `data`, `total`, `limit`, `offset`이 포함됩니다.

## 오류 {#errors}

오류는 Agents 엔벨로프 `{"error":{"type","code","param":null,"message"}}`를 사용합니다. 코드 목록은 [오류](/api-reference/errors#agents-platform-errors)를 참고하세요.
