---
i18nSource: 417ea5dc930a8786
title: Skills와 MCP 도구
description: SandBase Agent에 재사용 가능한 Skills와 원격 MCP 도구를 제공하고, 각 Session이 사용할 버전과 도구를 제어합니다.
---

# Skills와 MCP 도구 {#skills-and-mcp-tools}

Agent는 두 가지 방식으로 기능을 얻습니다.

- **Skills**는 Agent에게 작업 방법을 알려 줍니다. Skill은 지침과 리소스를 담은 버전 관리되는 ZIP 번들입니다.
- **MCP 연결**을 사용하면 Agent가 HTTPS를 통해 원격 MCP 서버의 도구를 호출할 수 있으며, 필요하면 [Secret](/agents/api-credentials)으로 인증할 수 있습니다.

유용한 Agent는 대부분 두 가지를 함께 사용합니다. MCP 서버가 데이터를 가져오거나 작업을 수행하고, Skill이 그 결과를 사용하는 방법을 설명합니다.

## Skills {#skills}

1. `name`과 `description` 프런트매터가 있는 `SKILL.md`를 포함한 폴더를 만들고, 폴더 자체를 압축합니다(`zip -r release-notes.zip release-notes/`, 최대 5 MiB). ZIP의 최상위에는 해당 폴더가 있어야 하며, ZIP 루트에 `SKILL.md`가 있으면 `400 invalid_request`를 반환합니다.
2. `POST /v1/skills`로 업로드하며, multipart 필드 이름은 `files`입니다. 응답에는 `skl_` ID와 `default_version: "1"`이 포함됩니다.
3. Agent의 `skills` 배열에서 해당 Skill을 참조합니다.

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- 처음 연결할 때 `"version": null`은 Agent를 저장하는 시점에 Skill의 현재 `default_version`으로 결정됩니다. `"2"`와 같은 문자열을 지정하면 해당 버전을 명시적으로 선택합니다.
- 저장된 Agent는 버전을 고정합니다. Skill의 기본 버전을 바꿔도 기존 Agent나 그 Agent의 새 Session은 업그레이드되지 않습니다. 업그레이드하려면 버전을 명시해 Agent를 업데이트하세요. 기존 바인딩에 `null`을 보내면 고정된 버전이 유지됩니다.
- `POST /v1/skills/{skill_id}/versions`로 새 버전을 업로드하고, `default=true` 또는 `POST /v1/skills/{skill_id}`로 기본 버전을 전환합니다.
- Skill이 비활성화되면 이를 참조하는 Agent의 새 Session은 `400 skill_not_found`로 실패합니다.

[Skills 카탈로그](/api-reference/skills/catalog)에서 공개 Skill을 둘러볼 수도 있습니다. 전체 과정은 [Skills API](/api-reference/skills/)를 참고하세요.

## 기본 제공 SandBase 도구 {#built-in-sandbase-tools}

모든 새 Agent는 별도 설정 없이 SandBase 자체 도구를 사용할 수 있습니다. Agent는 `sandbase_discover`, `sandbase_inspect`, `sandbase_run`을 사용해 카탈로그에서 모델이나 API를 찾고, 스키마와 가격을 확인한 다음, 사용자의 키로 호출합니다. 생성 시 `mcp_connections`를 생략하면 Agent에는 다음 기본값이 적용됩니다.

```json
{
  "mcp_connections": [
    {
      "connection_id": "builtin:sandbase",
      "server_label": "sandbase_builtin",
      "allowed_tools": null,
      "required": true
    }
  ]
}
```

- **보낸 목록이 기본값을 대체합니다.** 직접 만든 MCP 서버를 추가하면서 SandBase 도구도 유지하려면 목록에 기본 제공 항목을 포함하세요.
- **`builtin:sandbase`에는 `server_label: "sandbase_builtin"`이 필요합니다.** 다른 레이블을 사용하거나 이 레이블을 다른 연결에 사용하면 `400`을 반환합니다.
- **도구 없이 Agent를 생성하려면** `"mcp_connections": []`를 보내세요.
- **기본 제공 도구는 무료입니다.** Agent가 이 도구를 통해 호출하는 모델과 API에 대해서만 비용을 지불합니다.

## MCP 연결 {#mcp-connections}

1. MCP 서버에 Bearer 토큰이 필요하면 해당 서버의 정확한 URL에 대해 [Secret을 생성](/agents/api-credentials)합니다.
2. `POST /v1/mcp-connections`로 서버를 등록합니다.

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. Agent의 `mcp_connections` 배열에서 연결을 참조합니다.

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| 필드 | 의미 |
|---|---|
| `connection_id` | 조직 내 `mcp_` 연결 ID, 또는 기본 제공 SandBase 서버를 뜻하는 `builtin:sandbase` |
| `server_label` | 문자로 시작하며 문자, 숫자, `_`, `-`만 사용 가능, 최대 64자, Agent 내에서 고유해야 함 |
| `allowed_tools` | 생략하거나 `null`이면 서버가 제공하는 모든 도구를 허용하고, `[]`이면 아무 도구도 허용하지 않으며, 목록을 지정하면 해당 이름만 허용(최대 256개, 각 이름은 비어 있지 않고 최대 128바이트) |
| `required` | Session이 이 서버를 반드시 로드해야 하는지 여부 |

Agent는 최대 32개의 연결을 참조할 수 있습니다. Session이 시작될 때 조직의 연결은 `active` 상태여야 합니다.

### 기본 제공 SandBase 도구 {#built-in-sandbase-tools-1}

`mcp_connections` 없이 Agent를 생성하면 기본 제공 SandBase 서버가 선택됩니다. 직접 만든 서버와 함께 명시적으로 유지하려면 배열에 다음 항목을 포함하세요.

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

명시적인 배열은 전체 선택을 대체하므로, 위의 사용자 서버 전용 예시에서는 기본 제공 서버가 제외됩니다. 모든 MCP 도구를 비활성화하려면 `[]`를 보내세요. Agent 업데이트 시 이 필드를 생략하면 기존 선택이 유지되며, `null`은 `400`을 반환합니다. 기본 제공 항목은 MCP 연결이나 Secret을 생성할 필요가 없습니다. 지원이 종료된 `use_sandbase_mcp` 필드는 보내지 마세요.

::: info OpenAI와의 차이점
OpenAI의 Agents API는 MCP 서버를 `tools: [{"type": "mcp", ...}]` 형태로 인라인 선언합니다. SandBase는 이 형식에 대해 `400`을 반환합니다. 서버를 연결 리소스로 등록하고 `mcp_connections`에서 참조하세요. OpenAI SDK에는 `/v1/mcp-connections`나 `/v1/secrets`용 메서드가 없으므로 `client.post(...)`로 호출하고, `mcp_connections`는 `extra_body`(Python) 또는 요청 본문(Node.js)으로 전달하세요. [OpenAI 호환성](/agents/openai-compatibility#mcp-connections-with-the-sdk)을 참고하세요.
:::

## 변경 사항과 실행 중인 Session {#changes-and-running-sessions}

각 Session은 시작 시점의 Agent 버전, Skill 버전, MCP 연결 구성을 고정합니다.

- 연결을 교체하거나 Secret을 교체하면 새 Session은 새 구성을 사용하고, 기존 Session은 스냅샷을 유지합니다.
- 연결을 비활성화하거나 Secret을 폐기하면 새 Session이 차단되고, 이를 사용하는 기존 Session의 추가 입력도 거부됩니다. 이미 실행 중인 도구 호출은 중단되지 않습니다.

## 프롬프트에 토큰을 넣지 마세요 {#keep-tokens-out-of-prompts}

토큰은 Secret으로 저장하세요. 지침, Session 입력, 메타데이터, Skill 번들에는 토큰을 넣지 마세요. 이러한 항목은 Agent나 Session에 접근할 수 있는 누구나 읽을 수 있습니다.

## 다음 단계 {#next-steps}

- [MCP 도구용 자격 증명](/agents/api-credentials)
- [MCP Connections API](/api-reference/mcp-connections/)
- [Skills API](/api-reference/skills/)
- [Agent 정의하기](/agents/agent-api)
