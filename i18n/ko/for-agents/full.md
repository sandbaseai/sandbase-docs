---
i18nSource: e566962f42a5f6b0
title: SandBase AI API 가이드
description: AI 에이전트를 위한 확장 SandBase API 가이드로, 핵심 워크플로, 요청 예시, 공식 OpenAPI 사양 링크를 제공합니다.
---

# AI API 가이드 {#ai-api-guide}

::: info Session 계약
Session(`ses_*`)은 저장된 Agent 버전 하나를 실행하며 `POST /v1/agents/sessions`로 직접 생성합니다. 내부 Runtime Session ID는 노출되지 않습니다.
:::

> 가장 일반적인 API 워크플로를 한 페이지에 정리한 가이드입니다. 기계가 읽을 수 있는 전체 계약은 [OpenAPI 사양](https://www.sandbase.ai/docs/openapi.yaml)을 사용하세요. 일반 텍스트 버전: [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt).

## 인증 {#authentication}

모든 요청에는 다음이 필요합니다.

```
Authorization: Bearer sk-YOUR_KEY
```

Base URL: `https://api.sandbase.ai/v1`

---

## 용어 {#terminology}

| 용어 | 의미 |
|------|---------|
| **Task** | 모델 추론 같은 작업에 대한 과금 실행 기록입니다. 모든 API 작업이 Task를 생성하지는 않습니다. |
| **Run** | `POST /v1/run`을 통한 미디어 생성 요청입니다. 동기 또는 비동기일 수 있습니다. `GET /v1/run/{id}`로 폴링합니다. |
| **Session** | `POST /v1/agents/sessions`를 통한 Agent 실행으로, 대화, 도구 활동, 출력을 담습니다. `GET /v1/agents/sessions/{session_id}`로 조회합니다. |
> **run과 session 비교**: 모델 "run"(`/v1/run`)은 모델 생성 작업입니다. "Session"(`/v1/agents/sessions`)은 Agent 실행입니다. 모든 ID는 불투명하며 파싱하면 안 됩니다.
>
> **task와 run 비교**: "run"이나 "session"은 사용자가 보내는 요청이고, "task"는 과금 실행 기록입니다. 작업이 task ID를 반환하면
> `GET /v1/tasks/{task_id}/cost`를 사용하세요. 모든 API 작업이 task를 생성하지는 않습니다.

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

OpenAI 호환입니다. 스트리밍, 도구, 비전, 추론, 구조화된 출력 지원 여부는 선택한 모델과 해당 모델이 선언한 스키마에 따라 다릅니다.

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing in one paragraph."}
    ],
    "temperature": 0.7,
    "max_tokens": 500,
    "stream": false
  }'
```

**응답:**

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "openai/gpt-5.6-luna",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Quantum computing leverages quantum mechanical phenomena..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113
  }
}
```

> 일부 과금 작업은 `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc`를 반환할 수 있습니다. 이 값이 있으면
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost`로 조회하세요.

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

Anthropic 호환 Messages API입니다. 캐싱 및 기타 선택 기능은 선택한 모델과 요청 스키마에 따라 다릅니다.

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-5",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "What is SandBase?"}]
  }'
```

**응답:**

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    { "type": "text", "text": "SandBase is an AI agent infrastructure platform..." }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 12, "output_tokens": 64 }
}
```

---

## 이미지 생성 {#image-generation}

### POST /v1/run {#post-v1-run}

`/v1/run` 엔드포인트는 **통합 생성 엔드포인트**입니다. `model` 필드에 따라 출력 유형(이미지, 비디오, 오디오)이 결정됩니다.

> **응답 처리 방법:** `status` 필드를 확인하세요.
> - `"completed"` → 결과가 `outputs`에 있으며 완료된 상태입니다.
> - `"pending"` 또는 `"running"` → 최종 상태(`completed`, `failed`, `timeout`)가 될 때까지 2–5초마다 `GET /v1/run/{id}`를 폴링합니다.

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bfl/flux-2/flash",
    "prompt": "A futuristic city at sunset, cyberpunk style",
    "aspect_ratio": "1:1"
  }'
```

**응답(동기):**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "model": "bfl/flux-2/flash",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/f3d2e8a1-7c4b-4a12-9d2e-123456789abc.png",
    "content_type": "image/png",
    "width": 1024,
    "height": 1024
  }]
}
```

---

## 비디오 생성 {#video-generation}

### POST /v1/run {#post-v1-run-1}

선택한 모델의 `execution_mode`를 확인하세요. 제출 결과가 `pending` 또는 `running`이면 최종 상태가 될 때까지 `GET /v1/run/{id}`를 폴링합니다.

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kwaivgi/kling-video/v3/standard/text-to-video",
    "prompt": "A drone flying over mountains at golden hour",
    "duration": 5
  }'
```

**응답(비동기, 최초):**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**상태 폴링: `GET /v1/run/{id}`**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "completed",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/6a7b9c10-2d3e-4f50-8a61-23456789abcd.mp4",
    "content_type": "video/mp4",
    "duration": 5
  }]
}
```

---

## 오디오(텍스트 음성 변환) {#audio-text-to-speech}

### POST /v1/run {#post-v1-run-2}

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seed-speech/tts/2.0",
    "text": "Hello world, this is a test of text to speech."
  }'
```

**응답:**

```json
{
  "id": "7b8c0d21-3e4f-5061-9b72-3456789abcde",
  "status": "completed",
  "model": "bytedance/seed-speech/tts/2.0",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/7b8c0d21-3e4f-5061-9b72-3456789abcde.mp3",
    "content_type": "audio/mpeg",
    "duration_seconds": 3.2
  }]
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- DISCOVERY APIs                                           -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## 모델 목록 조회 {#list-models}

### GET /v1/models {#get-v1-models}

활성화된 논리 모델을 OpenAI 호환 모델 목록 형식으로 반환합니다. 이 엔드포인트는 페이지네이션을 지원하지 않으며
기본값은 `type=llm`입니다. 세부 기능과 가격은 의도적으로 생략됩니다.

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

응답에는 `object: "list"`와 `data` 배열이 포함됩니다. 각 항목에는 `id`, `object`, `created`,
`owned_by`가 있으며, `id`를 논리 모델 이름으로 사용합니다. 기능과 가격 메타데이터는 해당 모델을 조회해 확인하세요.

---

## 모델 조회 {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

상세 응답에는 `unified_schema`, `supported_modes`, `model_card`가 추가됩니다. 세부 가격은
`model_card` 안에 있으며, 최상위 `pricing` 객체는 없습니다.

---

## Task 비용 조회 {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

API 작업이 반환한 task ID로 task의 기록된 비용을 확인합니다.

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**응답:**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "settled": true,
  "currency": "USD",
  "cost": "0.000325",
  "estimated_cost": "0.000325",
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113,
    "cached_tokens": 0,
    "cache_creation_tokens": 0,
    "reasoning_tokens": 0
  }
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- PLATFORM APIs                                            -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Agents 플랫폼 규칙 {#agents-platform-conventions}

- Base URL은 `https://api.sandbase.ai/v1`입니다. `Authorization: Bearer sk-YOUR_KEY` 또는 `X-API-Key: sk-YOUR_KEY`를 보냅니다(둘 다 보내면 같은 값이어야 함). `OpenAI-Beta`는 선택 사항이며, 보내는 경우 `agents=v1`이어야 합니다. 공식 OpenAI SDK(`client.beta.agents`, `client.skills`)는 `base_url="https://api.sandbase.ai/v1"`과 함께 동작하며, 차이점은 [OpenAI 호환성](/agents/openai-compatibility)에 정리되어 있습니다.

- 본문은 최대 1 MiB의 엄격한 JSON이며, 알 수 없는 필드는 400을 반환합니다.

- 오류: `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`. `code`로 분기하세요. [오류 가이드](./errors#agents-platform-errors)를 참고하세요.

- `row_version`은 PATCH, archive, restore, rotate에 사용하는 compare-and-set 토큰입니다. 409가 반환되면 다시 조회하세요.

- 커서 목록(Agent, Session, items, turns, Skill): `limit` 1-100, `after`, `order`. 응답은 `{object:"list", data, has_more, first_id, last_id}`입니다.

- 오프셋 목록(Agent 버전, 첨부 파일, MCP 연결, Secret): `limit`, `offset`. 응답은 `{data, total, limit, offset}`입니다.

- ID: Agent `agt_`, Session `ses_`, Skill `skl_`, MCP 연결 `mcp_`, Secret `sec_`, 첨부 파일 `fil_`. 불투명한 값으로 취급하세요.

---

## Agent {#agents}

### POST /v1/agents — Agent 생성 {#post-v1-agents-—-create-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question and cite sources."
  }'
```

필수: `model`. 선택: `name`, `instructions`, `description`, `runtime_profile`(기본값 `codex`, `claude`, `mcode`), `skills`(`[{"skill_id","version"}]`), `mcp_connections`(`[{"connection_id","server_label","allowed_tools","required"}]`), `tools`, `text`, `reasoning`, `service_tier`, `metadata`, `note`. `201`과 함께 `id`(`agt_`), `version`, `row_version`, `status`, `projection_status`를 반환합니다. `projection_status`가 `ready`가 되면 Session을 시작하세요. `web_search` 도구는 `mode: "disabled"`를 사용해야 하며, 클라이언트 측 함수 결과(`requires_action`)는 지원되지 않습니다.

### GET /v1/agents — Agent 목록 조회 {#get-v1-agents-—-list-agents}

`status`(기본값 `active`, `archived`, `all`)와 커서 페이지네이션으로 조회합니다.

### GET /v1/agents/{agent_id} — Agent 조회 {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — Agent 업데이트(SDK 방식) {#post-v1-agents-agent-id-—-update-agent-sdk-style}

`name`, `instructions`, `model`, `metadata`, `service_tier`, `tools`, `text`, `reasoning`, `runtime_profile`, `mcp_connections`, `skills`를 부분 업데이트합니다. `row_version`은 필요 없으며 새 버전이 생성됩니다.

### PATCH /v1/agents/{agent_id} — Agent 업데이트(compare-and-set) {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

같은 필드에 `description`과 `note`가 추가되며, `row_version`이 필수입니다. 명시적인 `null`은 400을 반환합니다.

### 버전, 보관, 복원, 카탈로그 {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions`와 `GET /v1/agents/{agent_id}/versions/{version}`은 변경 불가능한 스냅샷을 조회합니다.

- `POST /v1/agents/{agent_id}/archive`, `POST /v1/agents/{agent_id}/unarchive`는 `{"row_version"}`을 받습니다. `DELETE /v1/agents/{agent_id}`도 보관 처리합니다.

- `POST /v1/agents/{agent_id}/restore`는 `{"source_version","row_version"}`을 받습니다.

- `GET /v1/agents/catalog`는 공개 Agent 목록을 조회하고, `POST /v1/agents/catalog/{agent_id}/clone`은 그중 하나를 조직에 복사합니다(`201`, 새 `agt_`).

---

## Session {#sessions}

Session은 저장된 Agent 버전 하나를 실행합니다. 경로는 `/v1/agents/sessions` 아래에 있습니다. Agent 버전, Skill 버전, MCP 연결은 생성 시점에 고정됩니다.

### POST /v1/agents/sessions — Session 생성 {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

`agent_id`(저장된 Agent), `agent`(인라인 Agent 또는 `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning`, `multi_agent`의 Session별 재정의), 또는 둘 다 보냅니다. 선택: `version`(저장된 Agent만 해당), `title`, `input`(문자열, 또는 `input_text` 파트 하나를 담은 user 메시지 정확히 하나로 이루어진 배열), `model` 또는 `agent.model`, `metadata`, `model_provider`(`{"type":"custom","base_url":"https://...","api_key":"..."}`. 생략하면 호출에 사용한 키를 사용). 비어 있지 않은 `input`과 함께 `stream: true`를 보내면 첫 턴의 Server-Sent Events 스트림으로 `201`을 반환하며, `agent.session.created`로 시작합니다. Session은 항상 SandBase의 호스팅 클라우드에서 실행되므로 선택할 환경이 없지만, OpenAI SDK에서는 여전히 `environment={"type": "openai_hosted"}`가 필요합니다. `201`과 함께 `status`(`idle`, `in_progress`, `failed`), `lifecycle_status`(`active`, `archived`), `failure`, `source`(`direct`, `service`, `schedule`), `row_version`을 반환합니다.

### GET /v1/agents/sessions/{session_id}/events — 이벤트 스트리밍(SSE) {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

실시간 전용입니다. 입력을 보내기 전에 여세요. `Last-Event-ID` 또는 `after`는 400을 반환하며, 이벤트는 다시 전송되지 않습니다. 이벤트 `type` 값은 `agent.session.`으로 시작합니다.

### POST /v1/agents/sessions/{session_id}/events — 입력 전송 {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

요청당 정확히 하나의 이벤트(`agent.session.input.message` 또는 `agent.session.input.cancel`)를 보냅니다. 본문 없이 `202`를 반환합니다. 확장 형식: `{"input": "...", "file_ids": ["fil_..."]}`(ready 상태인 첨부 파일 최대 10개). `409 session_input_pending`은 이전 입력이 아직 전달 중이라는 뜻이므로, 기다리고 새 키로 다시 보내지 마세요.

### 기록 및 기타 Session 작업 {#history-and-other-session-operations}

- `GET /v1/agents/sessions`(쿼리 `lifecycle_status`, `agent_id`), `GET /v1/agents/sessions/{session_id}`.

- `GET /v1/agents/sessions/{session_id}/items`, `GET /v1/agents/sessions/{session_id}/turns`, `GET /v1/agents/sessions/{session_id}/turns/{turn_id}`는 기록을 조회합니다.

- `POST /v1/agents/sessions/{session_id}`는 `metadata`를 대체하고, `PATCH /v1/agents/sessions/{session_id}`는 `{"title","row_version"}`으로 이름을 변경합니다.

- `POST /v1/agents/sessions/{session_id}/cancel`(`Idempotency-Key` 필요)은 실행 중인 턴을 취소합니다.

- `DELETE /v1/agents/sessions/{session_id}`는 보관하고, `POST /v1/agents/sessions/{session_id}/unarchive`는 복원합니다.

- `POST /v1/agents/sessions/{session_id}/files`는 첨부 파일 하나를 업로드합니다(multipart `file`, 5 MiB, `Idempotency-Key` 필요).

- `POST /v1/agents/sessions/{session_id}/reconnect`는 `GET /v1/agents/sessions/{session_id}/events/stream`용 `stream_url`을 반환합니다. 이 스트림은 `session.snapshot`을 보낸 다음 실시간 이벤트를 보냅니다.

---

### 워크스페이스 파일과 출력 아티팩트 {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files`는 `path`(기본값 `/workspace`) 아래의 현재 파일 메타데이터를 조회합니다. 쿼리는 `limit`(1-100, 기본값 20), `order`(기본값 `asc` 또는 `desc`), `page`(이전 응답의 `next` 커서)입니다. `{object:"page", data:[{path,size_bytes}], next, has_more}`를 반환합니다. 커서가 유효하지 않으면 첫 페이지부터 다시 시작해야 합니다.
- `GET /v1/agents/sessions/{session_id}/artifacts`는 `/workspace/outputs/` 아래에서 수집된 변경 불가능한 출력 목록을 조회합니다. 쿼리는 `limit`(기본값 20), `order`(기본값 `desc`), `after`(`has_more`가 true이면 `last_id` 사용)입니다.
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content`는 반환된 불투명한 `art_` ID로 아티팩트 전체를 다운로드합니다. 다운로드 한도는 200 MiB이며 `Range`는 지원되지 않습니다(`416`). 워크스페이스 메타데이터, 업로드된 첨부 파일, 수집된 아티팩트는 서로 별개의 리소스입니다.

---

## Skill, MCP 연결, Secret {#skills-mcp-connections-and-secrets}

### POST /v1/skills — Skill 생성 {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

ZIP 파트 `files` 하나(5 MiB)를 보냅니다. ZIP에는 `SKILL.md`(`name`과 `description` 프런트매터)를 담은 최상위 폴더가 하나 있어야 합니다. 예: `zip -r release-notes.zip release-notes/`. ZIP 루트에 `SKILL.md`가 있으면 `400 invalid_request`를 반환합니다. 어떤 Agent 버전(보관된 Agent 포함)에서든 참조되는 Skill은 삭제할 수 없으므로(`409`), 대신 `POST /v1/skills/{skill_id}`와 `{"status": "disabled"}`로 비활성화하세요. `201`과 함께 `id`(`skl_`)와 `default_version`을 반환합니다. 버전은 `POST /v1/skills/{skill_id}/versions`로 추가하고, 목록은 `GET /v1/skills`로 조회합니다. Agent에서는 `{"skill_id": "skl_...", "version": null}` 형식으로 참조합니다.

### POST /v1/mcp-connections — MCP 서버 등록 {#post-v1-mcp-connections-—-register-an-mcp-server}

본문은 `{"name", "server_url" (HTTPS), "secret_id"?}`이며 `Idempotency-Key`가 필요합니다. Agent의 `mcp_connections`에서 참조합니다. 비활성화하면 새 Session과 이후 입력이 차단됩니다.

### POST /v1/secrets — MCP Bearer 토큰 저장 {#post-v1-secrets-—-store-an-mcp-bearer-token}

본문은 `{"name", "kind": "mcp_bearer", "server_url", "token"}`이며 `Idempotency-Key`가 필요합니다. 토큰은 쓰기 전용이며 정확히 해당 URL에 바인딩됩니다. Secret은 환경 변수가 아닙니다. `POST /v1/secrets/{secret_id}/rotate`로 교체하고, `DELETE /v1/secrets/{secret_id}`(204)로 폐기합니다.

---

## 결제 및 비용 {#billing-cost}

### 비용 계산 방식 {#how-costs-are-calculated}

- 선택한 모델의 `model_card`에서 현재 가격 공식과 단위를 확인합니다.
- 토큰 단위로 가격이 책정되는 모델은 선언된 경우 입력, 출력, 캐시, 추론 항목을 포함할 수 있습니다.
- 미디어 및 기타 모델은 요청당, 길이, 해상도 또는 기타 모델별 단위를 사용할 수 있습니다.
- 데이터 API(검색, 소셜, 스크래핑, 전자상거래, 금융)는 조직당 UTC 기준 하루 100회 무료 호출을 제공하며, 대상 데이터 API 전체가 공유하고 00:00 UTC에 초기화됩니다. 이후 호출은 호출당 과금되며 거부되지 않습니다. 잔액이 0인 조직도 무료 호출을 사용할 수 있습니다.
- 대상 제외: LLM, 미디어 모델, 가격이 높거나 공식으로 가격이 책정되는 데이터 API(예: 일부 배치 엔드포인트, crawl, Xiaohongshu PGY, Douyin Xingtu `kol-*` 경로)는 첫 호출부터 과금됩니다. `sandbase_inspect`의 `pricing.free_quota`로 확인하세요.
- MCP: `sandbase_inspect`는 대상 도구에 `pricing.free_quota`를 표시하고, `sandbase_account`는 `free_api_quota`(`daily_limit`, `used_today`, `remaining`, `resets_at`)를 반환합니다. 정산된 `sandbase_run` 및 `sandbase_run_get` 결과에는 `free_quota_status`(`free`, `overage`, `degraded`)가 포함됩니다.
- 과금 작업이 task ID를 반환하면(`x-task-id` 응답 헤더 포함) `GET /v1/tasks/{task_id}/cost`로 정산과 사용량을 확인합니다.
- 비동기 `POST /v1/run` 응답의 경우 `GET /v1/run/{id}`로 생성 결과를 조회합니다. run ID는 task ID가 아니므로 비용 엔드포인트에 보내면 안 됩니다.

### 예산 관리 {#budget-control}

- [Developer → API Keys](https://www.sandbase.ai/console/keys)에서 표준 키를 만들거나 편집할 때 선택적으로 지출 한도를 설정합니다.
- **Developer → Activities → Usage**에서 요청과 비용을 모니터링합니다.
- [Developer → Billing](https://www.sandbase.ai/console/billing)에서 잔액과 크레딧 거래 내역을 확인합니다.

---

## 함께 보기 {#see-also}

- [모델 및 가격](./models): 실시간 모델 탐색, 기능, 가격 안내
- [오류 가이드](./errors): 문서화된 응답 형태, HTTP 처리, 재시도 안전성
- [OpenAPI 사양](https://www.sandbase.ai/docs/openapi.yaml): 기계가 읽을 수 있는 스키마


## Agent Skill 버전 바인딩 {#agent-skill-version-bindings}

Agent를 저장하면 새로운 Skill 참조마다 명시적인 버전이 고정됩니다. 새 바인딩에서 `version: null`은 저장 시점의 현재 기본 버전을 선택합니다. 기존 바인딩에서 `version: null`은 고정된 버전을 유지합니다. Skill 기본 버전을 바꿔도 저장된 Agent나 기존 Session은 업그레이드되지 않습니다. 이후 Session을 업그레이드하려면 Agent에 명시적인 버전을 저장하세요.
