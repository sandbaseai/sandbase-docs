---
i18nSource: e904f2b8bbd0ccc4
title: Session
description: Session에서 Agent를 실행하고, 이벤트를 스트리밍하고, 기록을 읽고, 파일을 첨부하고, 실패를 처리합니다.
---

# Session {#sessions}

**Session**은 저장된 Agent 버전 하나를 SandBase 호스팅 클라우드에서 실행합니다. 실행 환경은 직접 선택하지 않습니다. Session ID는 `ses_`로 시작하며, 모든 Session 경로는 `/v1/agents/sessions` 아래에 있습니다. Session은 시작 시점의 Agent 버전, Skill 버전, MCP 연결 설정을 고정합니다.

## Session 시작 방식 {#how-sessions-start}

`POST /v1/agents/sessions`로 Session을 생성합니다. 이 Session은 `source: "direct"`를 보고합니다.

## Session 실행 {#run-a-session}

네이티브 이벤트 스트림은 **실시간 전용**입니다. 연결이 끊긴 뒤에는 이벤트가 재전송되지 않습니다. 입력을 보내기 전에 스트림을 열고, 기록은 items 또는 turns에서 읽으세요.

```bash
# 1. Create the Session
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-2026-10-06" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60"}'

# 2. In another terminal, follow live events (server-sent events)
curl -N https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY"

# 3. Send input (202 Accepted, no body)
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "List three notable launches this week."}]}'

# 4. Read the history afterwards
curl "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/items?order=asc" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

다음은 공식 OpenAI Python SDK를 사용한 같은 흐름입니다. 먼저 스트림을 열고, 다른 스레드에서 입력을 보낸 뒤, 종료 turn 이벤트에서 멈춥니다. Node.js 버전과 SDK 차이점은 [OpenAI 호환성](/agents/openai-compatibility)을 참고하세요.

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
import threading
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
session = client.beta.agents.sessions.create(
    agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
    environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
)

def send_input():
    client.beta.agents.sessions.events.create(
        session.id,
        events=[{
            "type": "agent.session.input.message",
            "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
        }],
        idempotency_key="market-scan-input-1",
    )

with client.beta.agents.sessions.events.stream(session.id) as stream:
    threading.Thread(target=send_input).start()
    for event in stream:
        print(event.type)
        if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
            break
```

전송할 때마다 정확히 하나의 이벤트를 보냅니다. `input`은 텍스트 문자열이거나, `input_text` 파트를 정확히 하나 가진 user 메시지 하나로 구성된 배열입니다: `[{"role": "user", "content": [{"type": "input_text", "text": "…"}]}]`. 그 외 형태는 `400 invalid_request`를 반환합니다. 실행 중인 turn을 멈추려면 `{"type": "agent.session.input.cancel"}`을 보내거나 `Idempotency-Key`와 함께 `POST /v1/agents/sessions/{session_id}/cancel`을 호출하세요. 유휴 상태의 Session을 취소해도 `202 {"accepted": true}`를 반환하며 아무것도 변경되지 않습니다. Session을 생성할 때 첫 `input`을 함께 전달할 수도 있습니다. 생성 시 `stream: true`는 지원되지 않습니다.

## 상태와 실패 {#status-and-failures}

| 필드 | 값 | 의미 |
|---|---|---|
| `status` | `idle`, `in_progress`, `failed` | Session의 실행 상태 |
| `lifecycle_status` | `active`, `archived` | Session이 입력을 받는지 여부 |
| `failure` | `null` 또는 `{code, message, action, retryable?}` | 실패의 공개 사유와 권장 다음 단계 |

`failure.action`은 다음에 할 일을 알려 줍니다: `retry_later`, `inspect_history`, `create_new_session`, `check_model_account`, `create_session_with_updated_model_provider`. [실패 코드 표](/api-reference/sessions/#status-fields)를 참고하세요.

클라이언트에 결과를 요청하는 function 도구(`requires_action`)는 아직 지원되지 않습니다. 이런 Session을 읽으면 `502 executor_contract_error`를 반환합니다.

전송 시 `409 session_input_pending`이 반환되면 이전 입력이 아직 전달 중입니다. 기다린 뒤 Session을 읽으세요. 새 `Idempotency-Key`로 다시 보내면 입력이 두 번 실행될 수 있습니다.

## 보관 {#archive}

`DELETE /v1/agents/sessions/{session_id}`는 Session을 보관합니다. Session은 영구 삭제되지 않습니다. `POST /v1/agents/sessions/{session_id}/archive`와 `/unarchive`는 `{"row_version": …}`를 받습니다. 보관된 Session은 기록을 유지하지만 입력, 메타데이터 업데이트, 스트림을 거부합니다.

## 첨부 파일 {#attachments}

`POST /v1/agents/sessions/{session_id}/files`로 Session 워크스페이스에 파일을 업로드합니다(multipart 필드 `file`, 최대 5 MiB, `Idempotency-Key` 필수). 지원 유형은 `.txt`, `.md`, `.csv`, `.log`, `.json`, `.pdf`, `.png`, `.jpg`, `.jpeg`, `.webp`입니다. 파일의 `status`가 `ready`가 되면 최대 9개의 다른 파일과 함께 보낼 수 있습니다:

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: market-scan-input-2" \
  -H "Content-Type: application/json" \
  -d '{"input": "Summarize the attached report.", "file_ids": ["fil_6d8f0a2c-4e6b-5d8f-a1c3-5e7a9c1e3b72"]}'
```

## 클라이언트 재연결 {#reconnecting-clients}

연결이 끊긴 뒤 일관된 화면이 필요한 브라우저형 클라이언트는 `POST /v1/agents/sessions/{session_id}/reconnect`를 호출할 수 있습니다. 이 호출은 Session과 `GET /v1/agents/sessions/{session_id}/events/stream`용 `stream_url`을 반환합니다. 이 스트림은 먼저 `session.snapshot`을 보낸 뒤 실시간 이벤트와 `heartbeat`를 보냅니다. 스트림이 `stream.interrupted`를 보내면 입력을 다시 보내지 말고 다시 재연결하세요.

## GitHub 저장소 {#github-repository}

생성 시 `github_workspace`를 보내면 GitHub 저장소를 `/workspace`에 클론하고 Agent가 자체 Session 브랜치에 push할 수 있습니다. [GitHub 저장소 워크스페이스](/agents/github-workspace)를 참고하세요.

## 모델 자격 증명 {#model-credentials}

`model_provider`를 보내지 않으면 Session은 자신을 생성한 API 키로 모델을 호출합니다. 자체 OpenAI 호환 HTTPS 엔드포인트로 실행하려면 `{"type": "custom", "base_url": "https://…", "api_key": "…"}`를 사용하세요. `model_provider`는 쓰기 전용입니다.

## ID {#ids}

| 접두사 | 리소스 |
|---|---|
| `agt_` | Agent |
| `ses_` | Session |
| `skl_` | Skill |
| `mcp_` | MCP 연결 |
| `sec_` | Secret |
| `fil_` | Session 첨부 파일 |

ID는 불투명한 문자열로 취급하세요.

## 다음 단계 {#next-steps}

- [Sessions API 레퍼런스](/api-reference/sessions/)
- [OpenAI 호환성](/agents/openai-compatibility)

## 워크스페이스 파일과 생성된 아티팩트 {#workspace-files-and-generated-artifacts}

다음 세 리소스는 용도가 서로 다릅니다:

| 리소스 | 용도 | 페이지네이션 |
|---|---|---|
| [첨부 파일](/api-reference/sessions/list-files) | 업로드한 파일로, 입력에서 `file_id`로 참조할 수 있습니다 | `limit` / `offset` |
| [워크스페이스 파일](/api-reference/sessions/list-workspace-files) | 워크스페이스 디렉터리의 현재 파일 경로와 크기 | `page` / `next` |
| [아티팩트](/api-reference/sessions/list-artifacts) | 다운로드할 수 있는 변경 불가능한 생성 결과물 | `after` / `last_id` |

아티팩트 목록을 조회해 `art_` ID를 얻은 뒤, 그 ID를 그대로 [Download Artifact](/api-reference/sessions/download-artifact)에 전달하세요. 워크스페이스 경로나 첨부 파일 `file_id`로 대신할 수 없습니다. 워크스페이스 목록 조회는 메타데이터만 반환하며 임의 경로 다운로드 API가 아닙니다. 아티팩트는 최대 200 MiB까지 전체 파일로 다운로드할 수 있으며, 부분 `Range` 다운로드는 지원되지 않습니다.
