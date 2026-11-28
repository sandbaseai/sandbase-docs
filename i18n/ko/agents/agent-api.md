---
i18nSource: 2ba7f0f41847d04f
title: Agent 정의하기
description: Agents API로 버전 관리되는 Agent를 생성하고 업데이트하는 방법을 필드, 제한 사항, 버전, 보관과 함께 설명합니다.
---

# Agent 정의하기 {#define-an-agent}

`POST /v1/agents`로 Agent를 생성합니다. 이 API는 OpenAI Agents 프로토콜을 따르므로 일반 HTTP를 사용하거나 `base_url="https://api.sandbase.ai/v1"`을 지정한 OpenAI SDK의 `client.beta.agents`를 사용할 수 있습니다. `OpenAI-Beta` 헤더는 선택 사항이며, 보내는 경우 값은 반드시 `agents=v1`이어야 합니다. SDK가 지원하는 기능은 [OpenAI 호환성](/agents/openai-compatibility)을 참고하세요.

## Agent 생성하기 {#create-an-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question, compare at least two sources, and cite them.",
    "metadata": {"team": "research"}
  }'
```

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Research the question, compare at least two sources, and cite them.",
    metadata={"team": "research"},
)
print(agent.id, agent.version)  # agt_..., 1
```

응답은 `201 Created`이며 Agent를 반환합니다. 여기에는 `agt_` ID, `version: 1`, `row_version`, `status: "active"`, `projection_status`가 포함됩니다. 새 버전은 백그라운드에서 실행 준비가 진행되며, `projection_status`가 `ready`가 되면 Session을 시작할 수 있습니다.

`Idempotency-Key`는 선택 사항입니다. 생략하면 서비스가 키를 생성하므로, 요청을 재시도하면 두 번째 Agent가 생성될 수 있습니다. 재시도할 때는 고정된 키를 직접 보내세요.

## 필드 {#fields}

본문은 엄격한 JSON(최대 1 MiB)이어야 합니다. 알 수 없는 필드가 있으면 400을 반환합니다.

| 필드 | 필수 | 제한 및 값 |
|---|---|---|
| `model` | 예 | 모델 ID, 최대 200자 |
| `name` | 아니요 | 최대 128자 |
| `instructions` | 아니요 | 최대 256 KiB |
| `description` | 아니요 | 최대 4096자 |
| `runtime_profile` | 아니요 | `codex`(기본값), `claude`, `mcode` 중 하나 |
| `skills` | 아니요 | 최대 32개 참조. `version: null`인 새 바인딩은 저장 시점의 현재 기본 버전으로 고정되며, 기존 바인딩은 고정된 버전을 유지합니다. 업그레이드하려면 버전을 명시하세요. [Skills](/agents/mcp-tools#skills)를 참고하세요 |
| `mcp_connections` | 아니요 | 최대 32개 참조. [MCP 연결](/agents/mcp-tools#mcp-connections)을 참고하세요 |
| `tools` | 아니요 | 최대 64개의 `function` 도구와 최대 1개의 `web_search` 도구 |
| `text` | 아니요 | `format.type`은 `text` 또는 `json_schema`(객체 스키마), `verbosity`는 `low`, `medium`, `high` 중 하나 |
| `reasoning` | 아니요 | `effort`는 `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, `max` 중 하나, `summary`는 `concise`, `detailed`, `auto` 중 하나 |
| `service_tier` | 아니요 | `auto`(기본값), `default`, `flex`, `priority`, `fast` 중 하나 |
| `metadata` | 아니요 | 최대 16개의 문자열 쌍. 키는 최대 64자, 값은 최대 512자 |
| `note` | 아니요 | 버전에 저장되는 변경 메모 |

## 현재 제한 사항 {#current-limits}

- Session을 시작하려면 `web_search`에 `"mode": "disabled"`를 사용해야 합니다.
- `function` 도구는 저장할 수 있지만, 클라이언트가 도구 결과를 반환해야 하는 Run(`requires_action`)은 아직 지원되지 않습니다. 이 상태가 된 Session은 `502 executor_contract_error`를 반환합니다. 대신 [MCP 연결](/agents/mcp-tools#mcp-connections)을 통해 Agent에 외부 기능을 제공하세요.
- `multi_agent`는 생략하거나 `null`이어야 합니다.

## Agent 업데이트하기 {#update-an-agent}

업데이트 방식은 두 가지이며, 둘 다 새 버전을 생성합니다.

- `POST /v1/agents/{agent_id}`는 OpenAI SDK 방식의 업데이트입니다. 변경할 필드만 보내면 됩니다. `row_version`이 필요 없으므로 마지막에 쓴 요청이 적용됩니다. 이 방식에서는 `description`과 `note`를 사용할 수 없습니다.
- `PATCH /v1/agents/{agent_id}`는 compare-and-set 방식의 업데이트입니다. 마지막으로 읽은 `row_version`이 필요하며, 그 사이에 Agent가 변경되었다면 409를 반환합니다. 명시적인 `null` 값은 거부됩니다.

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## 버전, 보관, 복원 {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions`는 변경 불가능한 스냅샷 목록을 반환하고, `GET /v1/agents/{agent_id}/versions/{version}`은 특정 스냅샷 하나를 조회합니다.
- `{"source_version": 1, "row_version": 3}`과 함께 `POST /v1/agents/{agent_id}/restore`를 호출하면 이전 구성을 새 현재 버전으로 복사합니다.
- `POST /v1/agents/{agent_id}/archive`와 `/unarchive`는 `{"row_version": …}`을 받습니다. 보관된 Agent는 새 Session을 시작할 수 없습니다.
- `DELETE /v1/agents/{agent_id}`는 Agent를 보관합니다. Agent는 영구 삭제되지 않습니다.

## 다음 단계 {#next-steps}

- [Skills와 MCP 도구](/agents/mcp-tools)
- [Session에서 Agent 실행하기](/agents/sessions)
- [Agents API 레퍼런스](/api-reference/agents/)
