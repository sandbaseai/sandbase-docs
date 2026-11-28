---
i18nSource: 99170a141af66587
title: Sessions API
description: 저장된 Agent 버전을 실행하고, 입력을 보내고, 이벤트를 스트리밍하고, Session 기록을 조회합니다.
---

# Sessions API {#sessions-api}

Session은 저장된 [Agent](/api-reference/agents/) 버전 하나를 SandBase의 호스팅 클라우드에서 실행하며, 실행 환경을 선택할 필요가 없습니다. Session ID에는 `ses_` 접두사가 붙습니다. Session은 Agents의 하위 리소스이므로 모든 경로는 `/v1/agents/sessions`로 시작합니다.

표준 작업은 OpenAI Agents 프로토콜(`client.beta.agents.sessions`)을 따릅니다. 공식 SDK로 할 수 있는 작업과 할 수 없는 작업은 [OpenAI 호환성](/agents/openai-compatibility)을 참고하세요. SandBase 확장 기능으로 이름 변경, 보관 상태, 취소, 첨부 파일, 워크스페이스 파일 메타데이터, 변경 불가능한 아티팩트, 재연결 가능한 제품 스트림이 추가됩니다.

::: info Session의 출처
`POST /v1/agents/sessions`로 Session을 직접 생성합니다. 이 Session은 `source: "direct"`와 `source_id: null`을 보고합니다.
:::

## 권장 흐름 {#recommended-flow}

1. 저장된 Agent의 [Session을 생성](./create)합니다. Session은 선택한 Agent 버전과 MCP 연결을 고정하고, 해당 Agent 버전에 이미 고정된 Skill 버전을 사용합니다.
2. `GET /v1/agents/sessions/{session_id}/events`로 [이벤트 스트림을 엽니다](./stream). 스트림은 실시간 전용이므로 입력을 보내기 전에 여세요.
3. `agent.session.input.message` 이벤트와 함께 `POST /v1/agents/sessions/{session_id}/events`로 [입력을 보냅니다](./send-events). 이 호출은 202를 반환합니다.
4. 스트림에서 결과를 읽거나, 이후에 [items](./items)와 [turns](./turns)에서 조회합니다.

## Session 작업 {#session-operations}

| 메서드 | 경로 | 용도 |
|---|---|---|
| `POST` | `/v1/agents/sessions` | [Session 생성](./create) |
| `GET` | `/v1/agents/sessions` | [Session 목록 조회](./list) |
| `GET` | `/v1/agents/sessions/{session_id}` | [Session 조회](./get) |
| `POST` | `/v1/agents/sessions/{session_id}` | [메타데이터 교체](./update) |
| `PATCH` | `/v1/agents/sessions/{session_id}` | `row_version`으로 [이름 변경](./rename) |
| `DELETE` | `/v1/agents/sessions/{session_id}` | Session을 보관하는 [삭제](./delete) |
| `POST` | `/v1/agents/sessions/{session_id}/events` | [입력 또는 취소 이벤트 하나 보내기](./send-events) |
| `GET` | `/v1/agents/sessions/{session_id}/events` | [실시간 이벤트 스트리밍](./stream)(SSE) |
| `GET` | `/v1/agents/sessions/{session_id}/items` | [항목 목록 조회](./items) |
| `GET` | `/v1/agents/sessions/{session_id}/turns` | [턴 목록 조회](./turns) |
| `GET` | `/v1/agents/sessions/{session_id}/turns/{turn_id}` | [턴 하나 조회](./get-turn) |
| `POST` | `/v1/agents/sessions/{session_id}/cancel` | [실행 중인 턴 취소](./cancel) |
| `POST` | `/v1/agents/sessions/{session_id}/archive` | [보관](./archive) |
| `POST` | `/v1/agents/sessions/{session_id}/unarchive` | [보관 해제](./unarchive) |
| `POST` | `/v1/agents/sessions/{session_id}/reconnect` | 스트림이 끊긴 뒤 [재연결](./reconnect) |
| `GET` | `/v1/agents/sessions/{session_id}/events/stream` | [스냅샷 후 실시간 스트림](./stream-snapshot)(SSE) |
| `POST` | `/v1/agents/sessions/{session_id}/files` | [첨부 파일 업로드](./upload-file) |
| `GET` | `/v1/agents/sessions/{session_id}/files` | [첨부 파일 목록 조회](./list-files) |
| `GET` | `/v1/agents/sessions/{session_id}/files/{file_id}/content` | [첨부 파일 다운로드](./download-file) |
| `DELETE` | `/v1/agents/sessions/{session_id}/files/{file_id}` | [첨부 파일 삭제](./delete-file) |
| `GET` | `/v1/agents/sessions/{session_id}/workspace-files` | [워크스페이스 파일 메타데이터 목록 조회](./list-workspace-files) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts` | [변경 불가능한 아티팩트 목록 조회](./list-artifacts) |
| `GET` | `/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` | [아티팩트 다운로드](./download-artifact) |

## 상태 필드 {#status-fields}

- `status`는 실행 상태로, `idle`, `in_progress`, `failed` 중 하나입니다. 클라이언트 결과가 필요한 function 도구(`requires_action`)는 아직 지원되지 않으며, 이러한 Session을 조회하면 `502 executor_contract_error`를 반환합니다.
- `lifecycle_status`는 `active` 또는 `archived`입니다. 보관된 Session은 입력, 메타데이터 업데이트, 스트림을 거부합니다. `DELETE`는 보관하고 `unarchive`는 복원합니다.
- `failure`는 `null`이거나 `code`, `message`, `action`, 경우에 따라 `retryable`을 포함한 객체입니다.

| `failure.code` | 의미 | 권장 `action` |
|---|---|---|
| `session_creation_rejected` | 실행 계층이 Session을 거부함 | `create_new_session` |
| `model_authentication_failed` | 모델 제공업체가 키를 거부함 | `create_session_with_updated_model_provider` |
| `model_rate_limited` | 모델 제공업체가 요청 속도를 제한 중(재시도 가능) | `retry_later` |
| `model_quota_exceeded` | 모델 계정의 할당량이 없음 | `check_model_account` |
| `context_limit_exceeded` | 대화가 모델 컨텍스트를 초과함 | `create_new_session` |
| `environment_connection_timeout` | 환경이 제시간에 연결되지 않음(재시도 가능) | `retry_later` |
| `runtime_unavailable` | 실행 환경을 사용할 수 없음(재시도 가능) | `retry_later` |
| `model_request_failed` | 모델 요청이 완료되지 않음 | `inspect_history` |
| `model_configuration_rejected` | 모델 또는 실행 계층이 구성을 거부함 | `create_session_with_updated_model_provider` |
| `execution_failed` | 더 구체적인 공개 원인이 없는 실패 | `inspect_history` |

Session을 실시간으로 읽을 수 없는 경우 목록 결과에 `session_not_ready`, `session_execution_unavailable`, `session_configuration_unavailable`, `session_snapshot_unavailable`이 포함된 자리 표시자 행이 나타날 수도 있습니다.

## 모델 자격 증명 {#model-credentials}

기본적으로 Session은 자신을 생성한 SandBase API 키로 모델을 호출합니다. 명시적으로 선택하려면 `model_provider`를 보내세요.

- `{"type": "sandbase"}`는 호출에 사용한 키를 사용합니다. `base_url`은 허용되지 않습니다.
- `{"type": "custom", "base_url": "https://…", "api_key": "…"}`는 자체 OpenAI 호환 HTTPS 엔드포인트를 호출합니다. URL에는 자격 증명, 쿼리, 프래그먼트를 포함할 수 없으며, SandBase는 SandBase 키로 대체 호출하지 않습니다.

`model_provider`는 쓰기 전용이며 응답에 나타나지 않습니다.

## 실행 허용과 오류 {#admission-and-errors}

Session 생성과 입력 전송 시 실행 허용 여부를 확인합니다. 키 한도나 조직 잔액이 소진되면 `402 spending_limit_exceeded`, 조직이 Agent를 실행할 수 없으면 `403 org_disabled`, 확인을 완료할 수 없으면 `503 admission_unavailable`을 반환합니다. 조회, 취소, 보관은 잔액 때문에 차단되지 않습니다.

입력 전송 시 `409 session_input_pending`(이전 입력이 아직 전달 중이므로 기다리고, 새 키로 다시 보내지 마세요), `409 session_input_expired`(다시 보내기 전에 기록을 확인하세요), `409 session_environment_unavailable`(기다리거나 새 Session을 생성하세요)을 반환할 수도 있습니다. [오류](/api-reference/errors#agents-platform-errors)를 참고하세요.

## 페이지네이션 {#pagination}

Session, 항목, 턴, 아티팩트는 커서 페이지네이션(`limit` 1-100, `after`, `order`)을 사용합니다. 첨부 파일은 오프셋 페이지네이션(`limit` 1-100, `offset`)을 사용합니다.

워크스페이스 파일은 대신 `page` / `next` 페이지네이션을 사용합니다. [워크스페이스 파일 목록 조회](./list-workspace-files)를 참고하세요.
