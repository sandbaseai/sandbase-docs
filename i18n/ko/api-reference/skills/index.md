---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: 버전이 있는 Skill 번들을 업로드하고 Agent에 연결합니다.
---

# Skills API {#skills-api}

Skill은 Agent가 마운트할 수 있는 지침과 리소스를 담은, 버전이 있는 ZIP 번들입니다. Skill ID는 `skl_` 접두사를 사용하며, 버전 식별자는 `"1"` 같은 문자열입니다.

## Skill 작업 {#skill-operations}

| 메서드 | 경로 | 용도 |
|---|---|---|
| `POST` | `/v1/skills` | ZIP 업로드로 [Skill 생성](./create) |
| `GET` | `/v1/skills` | [Skill 목록 조회](./list) |
| `GET` | `/v1/skills/{skill_id}` | [Skill 조회](./get) |
| `POST` | `/v1/skills/{skill_id}` | 기본 버전, 상태, 메타데이터 [업데이트](./update) |
| `DELETE` | `/v1/skills/{skill_id}` | [Skill 삭제](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | 기본 버전 ZIP 다운로드 |
| `GET` | `/v1/skills/{skill_id}/versions` | [버전 목록 조회](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [버전 업로드](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [버전 조회](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | 버전 ZIP 다운로드 |
| `GET` | `/v1/skills/catalog` | [공개 Skills 둘러보기](./catalog) |

## 5분 설정 {#five-minute-setup}

1. 프런트매터에 `name`과 `description`을 지정한 `SKILL.md`가 들어 있는 폴더를 만듭니다.

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. 폴더를 압축합니다(`zip -r release-notes.zip release-notes/`). 아카이브는 최대 5 MiB입니다.
3. 단일 multipart 파트 `files`로 업로드합니다.

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. [Agent 업데이트](/api-reference/agents/update)로 Agent에서 참조합니다.

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

Skill을 처음 연결할 때 `"version": null`(또는 `version` 생략)은 Agent 저장 시점의 현재 `default_version`으로 확정됩니다. 저장된 Agent에는 명시적인 버전이 들어갑니다. Skill의 기본 버전을 바꿔도 기존 Agent는 업그레이드되지 않습니다. 업그레이드하려면 `"2"`처럼 명시적인 버전으로 `skills` 배열을 업데이트하세요. 기존 바인딩에 `null`을 보내면 고정된 버전이 유지됩니다. 각 Session은 저장된 Agent 버전을 사용하며, 확정된 Skills를 `environment.skills`에 보고합니다.

Agent 하나에는 최대 32개의 Skill을 연결할 수 있습니다. 선택한 Skills 안에서 Skill ID와 Skill 이름은 고유해야 합니다.

## 버전 {#versions}

- `POST /v1/skills/{skill_id}/versions`에 업로드하면 다음 버전이 추가됩니다. 기본 버전으로 지정하려면 폼 필드 `default=true`를 보내세요.
- `POST /v1/skills/{skill_id}`에 `default_version`을 보내면 업로드 없이 기본 버전을 전환합니다.
- `status`는 `active` 또는 `disabled`입니다. 비활성화된 Skill을 참조하는 Agent의 새 Sessions는 `400 skill_not_found`로 실패하며, 이미 버전을 고정한 Sessions는 그 버전을 유지합니다.
- 어떤 Agent 버전이라도 참조하는 Skill은 삭제할 수 없습니다(409). 대신 비활성화하세요. 최신 Agent 버전에서 제거해도 이전 버전의 참조는 남아 있습니다.

## 페이지네이션과 오류 {#pagination-and-errors}

목록은 `limit` 0-100, `after`, `order`를 사용한 커서 페이지네이션을 사용합니다. 오류는 [Agents 오류 엔벨로프](/api-reference/errors#agents-platform-errors)를 사용합니다.

## 번들 다운로드 {#download-a-bundle}

콘텐츠 엔드포인트는 JSON이 아니라 `application/zip`을 반환합니다. 응답을 파일로 저장하세요.

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

현재 기본 버전은 `/v1/skills/{skill_id}/content`를 사용합니다. 공개 카탈로그 번들은 `/v1/skills/catalog/{skill_id}/versions/{version}/content`를 사용합니다.

버전 목록은 Skill 목록과 같은 커서 매개변수를 사용합니다. 반환된 `last_id`(예: `skl_…:2`)를 `after`로 전달하고, 버전 번호만 단독으로 전달하지 마세요.
