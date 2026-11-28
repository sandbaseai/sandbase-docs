---
i18nSource: ee126767f58b111b
title: MCP Connections API
description: Agent가 호출할 수 있는 원격 HTTPS MCP 서버를 등록합니다.
---

# MCP Connections API {#mcp-connections-api}

MCP 연결은 HTTPS로 접근할 수 있는 원격 MCP 서버를 등록합니다. Agent는 `mcp_connections`에서 연결을 참조하며, 각 Session은 시작할 때 연결 설정을 고정합니다. 연결 ID는 `mcp_` 접두사를 사용합니다. Bearer 토큰으로 서버에 인증하려면 먼저 같은 URL에 대한 [Secret](/agents/api-credentials#with-the-api)을 생성하세요.

| 메서드 | 경로 | 용도 |
|---|---|---|
| `POST` | `/v1/mcp-connections` | [연결 생성](#create-a-connection) |
| `GET` | `/v1/mcp-connections` | [연결 목록 조회](#list-connections) |
| `GET` | `/v1/mcp-connections/{connection_id}` | [연결 조회](#get-a-connection) |
| `PUT` | `/v1/mcp-connections/{connection_id}` | [연결 교체](#replace-a-connection) |
| `POST` | `/v1/mcp-connections/{connection_id}/enable` | [연결 활성화](#enable-a-connection) |
| `DELETE` | `/v1/mcp-connections/{connection_id}` | [연결 비활성화](#disable-a-connection) |

모든 쓰기 요청에는 `Idempotency-Key`(1~128바이트, 앞뒤 공백 없음)가 필요합니다. 연결 객체에는 `id`, `name`, `server_url`, `secret_id`(설정된 경우), `status`(`active` 또는 `disabled`), `row_version`, `created_at`, `updated_at`이 있습니다.

## 연결 생성 {#create-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
```

- `name`은 필수이며 비어 있지 않아야 하고 최대 128바이트입니다.
- `server_url`은 사용자 정보, 쿼리, 프래그먼트가 없는 HTTPS여야 합니다(최대 2048바이트).
- `secret_id`는 선택 사항입니다. 익명 서버라면 생략하세요. 설정하면 Secret은 `active` 상태여야 하고 그 `server_url`이 이 `server_url`과 정확히 같아야 하며, 그렇지 않으면 요청이 실패합니다(비활성 Secret은 409, URL 불일치는 400).

`201 Created`를 반환합니다.

## 연결 목록 조회 {#list-connections}

```bash
curl "https://api.sandbase.ai/v1/mcp-connections?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`data`, `total`, `limit`, `offset`을 사용하는 오프셋 페이지네이션입니다. `limit`의 기본값은 20이며 최대 200입니다. 값이 없거나 유효하지 않거나 양수가 아니면 20을 사용합니다. `offset`의 기본값은 0이며, 유효하지 않거나 양수가 아닌 값이면 0을 사용합니다. `offset + data.length >= total`이 될 때까지 반환된 `limit`만큼 진행하세요. 비활성화된 리소스도 목록에 계속 표시됩니다.

## 연결 조회 {#get-a-connection}

```bash
curl https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

## 연결 교체 {#replace-a-connection}

```bash
curl -X PUT https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-v2" \
  -H "Content-Type: application/json" \
  -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "row_version": 1}'
```

`PUT`은 `name`, `server_url`, `secret_id`를 함께 교체합니다. `secret_id`를 생략하면 연결이 익명이 됩니다. `row_version`은 필수이며 Get Connection이 반환한 현재 값과 일치해야 합니다. 업데이트된 연결과 함께 `200 OK`를 반환합니다. 비활성화된 연결은 교체 후에도 활성화하기 전까지 비활성 상태로 유지됩니다.

## 연결 활성화 {#enable-a-connection}

```bash
curl -X POST https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13/enable \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-enable" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 3}'
```

`row_version`은 필수이며 현재 리소스와 일치하는 양의 정수여야 합니다. 연결과 함께 `200 OK`를 반환합니다. 활성화해도 연결 ID는 그대로 유지됩니다. 폐기된 Secret은 복원되지 않으므로, 먼저 새 활성 Secret으로 연결을 교체하세요.

## 연결 비활성화 {#disable-a-connection}

```bash
curl -X DELETE https://api.sandbase.ai/v1/mcp-connections/mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-disable"
```

`204 No Content`를 반환하고 `status`를 `disabled`로 설정합니다. 새 Session은 이 연결을 사용할 수 없고, 이 연결을 고정한 기존 Session은 이후 입력을 거부합니다. 이미 실행 중인 도구 호출은 중단되지 않습니다.

## 변경 사항과 실행 중인 Session {#changes-and-running-sessions}

Session은 시작할 때 연결 설정을 고정합니다. 연결을 교체하거나 Secret을 교체(rotate)하면 새 Session은 새 설정을 사용하고 기존 Session은 스냅샷을 유지합니다. 연결을 비활성화하거나 Secret을 폐기하면 새 Session과 기존 Session에 대한 이후 입력이 모두 차단됩니다.

## 오류와 재시도 {#errors-and-retries}

오류는 [Agents 오류 엔벨로프](/api-reference/errors#agents-platform-errors)를 사용합니다. 유효하지 않은 필드나 쓰기 요청의 멱등성 키 누락은 `400 invalid_request`를 반환하고, 알 수 없거나 접근할 수 없는 리소스는 `404 not_found`를 반환합니다. 오래된 `row_version`, 호환되지 않는 수명 주기 상태, 또는 생성/업데이트 키를 다른 입력으로 재사용하면 `409 conflict`를 반환합니다. 새 업데이트를 보내기 전에 리소스를 다시 읽고, 새 쓰기 작업마다 새 키를 사용하세요.

`created_at`과 `updated_at`은 RFC 3339 타임스탬프 문자열입니다.
