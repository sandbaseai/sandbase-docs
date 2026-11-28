---
i18nSource: dab112fdbbc56799
title: MCP 도구용 자격 증명
description: 쓰기 전용 Bearer 토큰을 Secret으로 저장해 Agent가 인증이 필요한 MCP 서버를 호출할 수 있게 합니다.
---

# MCP 도구용 자격 증명 {#credentials-for-mcp-tools}

MCP 서버에 인증이 필요하면 Bearer 토큰을 **Secret**으로 저장하고, 그 Secret을 [MCP 연결](/agents/mcp-tools#mcp-connections)에 연결합니다. 실행 환경은 토큰을 해당 서버에만 보냅니다.

## Secret의 동작 방식 {#how-secrets-work}

- `kind`는 항상 `mcp_bearer`이며, MCP 서버 하나에 대한 Bearer 토큰을 뜻합니다.
- 각 Secret은 정확히 하나의 `server_url`에 바인딩됩니다. 연결의 `server_url`이 일치할 때만 해당 Secret을 사용할 수 있습니다. 다른 URL을 사용하려면 Secret을 새로 만드세요.
- 토큰은 쓰기 전용입니다. API는 Secret의 이름, URL, 상태, `row_version`을 반환하며 토큰은 절대 반환하지 않습니다.
- Secret은 환경 변수가 아닙니다. Agent 런타임에 주입되지 않으며 Agent가 읽을 수도 없습니다.

이전 버전의 SandBase는 워크스페이스 또는 Agent 범위의 자격 증명을 저장하고 `GITHUB_TOKEN` 같은 환경 변수로 주입했습니다. 이 방식은 폐지되었으며 기존 레코드는 마이그레이션되지 않습니다. 여전히 필요한 값은 MCP 연결의 Secret으로 다시 만드세요.

## API로 관리하기 {#with-the-api}
API로 Secret을 생성, 교체, 폐기합니다. 이 가이드가 API 계약이며, Agent 편집기에서 여는 Console의 Credentials 페이지는 Secret 동작의 기준 문서가 아닙니다. 이 엔드포인트는 SandBase API 키와 평문 토큰을 받으므로 브라우저 코드가 아닌 신뢰할 수 있는 백엔드에서 호출하세요.

| 메서드 | 경로 | 용도 |
|---|---|---|
| `POST` | `/v1/secrets` | [Secret 생성](#create-a-secret) |
| `GET` | `/v1/secrets` | [Secret 목록 조회](#list-secrets) |
| `GET` | `/v1/secrets/{secret_id}` | [Secret 조회](#get-a-secret) |
| `POST` | `/v1/secrets/{secret_id}/rotate` | [토큰 교체](#rotate-a-secret) |
| `DELETE` | `/v1/secrets/{secret_id}` | [Secret 폐기](#revoke-a-secret) |

모든 쓰기 요청에는 `Idempotency-Key`(앞뒤 공백 없이 1~128바이트)가 필요합니다. Secret 객체에는 `id`(`sec_` 접두사), `name`, `kind`, `server_url`, `status`, `row_version`, `created_at`, `updated_at`이 있습니다. `status`는 토큰을 저장하는 동안 `pending`, 사용할 수 있으면 `active`, 폐기 후에는 `disabled`입니다. `created_at`과 `updated_at`은 RFC 3339 타임스탬프 문자열입니다.

### Secret 생성 {#create-a-secret}

```bash
python3 -c 'import json, os; print(json.dumps({"name": "GitHub MCP token", "kind": "mcp_bearer", "server_url": "https://mcp.example.com/github", "token": os.environ["GITHUB_MCP_TOKEN"]}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

- `kind`는 `mcp_bearer`여야 합니다.
- `server_url`은 사용자 정보, 쿼리, 프래그먼트가 없는 HTTPS URL이어야 합니다. Secret은 정확히 이 URL에서만 동작합니다.
- `name`과 `token`은 필수이며 비어 있으면 안 됩니다. `name`은 최대 128바이트, `token`은 최대 16384바이트, `server_url`은 최대 2048바이트입니다.

응답은 토큰 없이 `201 Created`로 반환됩니다. [MCP 연결을 생성](/api-reference/mcp-connections/#create-a-connection)할 때 `sec_` ID를 `secret_id`로 사용하세요.

### Secret 목록 조회 {#list-secrets}

```bash
curl "https://api.sandbase.ai/v1/secrets?limit=20&offset=0" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`data`, `total`, `limit`, `offset`을 사용하는 오프셋 페이지네이션입니다. `limit`의 기본값은 20이고 최대 200입니다. 값이 없거나 유효하지 않거나 양수가 아니면 20이 사용됩니다. `offset`의 기본값은 0이며, 유효하지 않거나 양수가 아니면 0이 사용됩니다. `offset + data.length >= total`이 될 때까지 반환된 `limit`만큼 진행하세요. 비활성화된 Secret도 목록에 남아 있습니다.

### Secret 조회 {#get-a-secret}

```bash
curl https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

### Secret 교체 {#rotate-a-secret}

`SECRET_ROW_VERSION`을 Secret 조회에서 얻은 최신 `row_version`으로 설정합니다.

```bash
python3 -c 'import json, os; print(json.dumps({"token": os.environ["GITHUB_MCP_TOKEN"], "row_version": int(os.environ["SECRET_ROW_VERSION"])}))' | \
  curl -X POST https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61/rotate \
    -H "Authorization: Bearer $SANDBASE_API_KEY" \
    -H "Idempotency-Key: github-mcp-token-rotate-1" \
    -H "Content-Type: application/json" \
    --data-binary @-
```

교체하면 토큰이 바뀌고 Secret과 `server_url`은 그대로 유지됩니다. `token`과 양의 정수 `row_version`이 필수이고, Secret은 `active` 상태여야 하며, `row_version`은 최신 값과 일치해야 합니다. `201 Created`를 반환합니다. 새 Session은 새 토큰을 사용하고, 이미 시작된 Session은 고정해 둔 자격 증명을 계속 사용합니다.

### Secret 폐기 {#revoke-a-secret}

```bash
curl -X DELETE https://api.sandbase.ai/v1/secrets/sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: github-mcp-token-revoke"
```

`204 No Content`를 반환하고 `status`를 `disabled`로 설정합니다. 이 Secret을 사용하는 연결은 새 Session과 기존 Session에 대한 이후 입력에서 동작하지 않습니다. 폐기는 되돌릴 수 없으므로, 새 Secret을 만들고 연결을 교체하세요.

### 오류 및 재시도 {#errors-and-retries}

오류는 [Agents 오류 형식](/api-reference/errors#agents-platform-errors)을 따릅니다. 필드가 유효하지 않거나 쓰기 요청의 멱등성 키가 없으면 `400 invalid_request`를 반환하고, 알 수 없거나 접근할 수 없는 Secret은 `404 not_found`를 반환합니다. 오래된 `row_version`, 호환되지 않는 수명 주기 상태, 다른 입력으로 생성 키를 재사용하는 경우에는 `409 conflict`를 반환합니다. 재시도하기 전에 Secret을 다시 조회하고, 새로운 쓰기마다 새 키를 사용하세요.

## 보안 {#security}

- Secret 생성과 교체는 브라우저 코드가 아닌 신뢰할 수 있는 백엔드에서 수행합니다.
- 토큰은 스크립트에 붙여 넣지 말고, 위의 `$GITHUB_MCP_TOKEN`처럼 자체 시크릿 저장소나 환경에서 읽어 옵니다.
- 토큰을 지시, Session 입력, 메타데이터, Skill 번들에 넣지 않습니다.
- 토큰이 유출되었을 가능성이 있으면 즉시 Secret을 폐기한 뒤, 새 Secret을 만들고 연결을 교체합니다.

## 다음 단계 {#next-steps}

- [Skill과 MCP 도구](/agents/mcp-tools)
- [MCP Connections API](/api-reference/mcp-connections/)
