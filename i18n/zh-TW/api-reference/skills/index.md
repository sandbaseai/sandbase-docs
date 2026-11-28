---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: 上傳具版本的 Skill 套件，並將其附加到 Agent。
---

# Skills API {#skills-api}

Skill 是由指示與資源組成、具版本的 ZIP 套件，可供 Agent 掛載。Skill ID 使用 `skl_` 前綴，版本識別碼為字串，例如 `"1"`。

## Skill 操作 {#skill-operations}

| 方法 | 路徑 | 用途 |
|---|---|---|
| `POST` | `/v1/skills` | 從 ZIP 上傳[建立 Skill](./create) |
| `GET` | `/v1/skills` | [列出 Skills](./list) |
| `GET` | `/v1/skills/{skill_id}` | [取得 Skill](./get) |
| `POST` | `/v1/skills/{skill_id}` | [更新](./update)預設版本、狀態或中繼資料 |
| `DELETE` | `/v1/skills/{skill_id}` | [刪除 Skill](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | 下載預設版本的 ZIP |
| `GET` | `/v1/skills/{skill_id}/versions` | [列出版本](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [上傳版本](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [取得版本](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | 下載某個版本的 ZIP |
| `GET` | `/v1/skills/catalog` | [瀏覽公開 Skills](./catalog) |

## 五分鐘設定 {#five-minute-setup}

1. 建立一個資料夾，其中包含 `SKILL.md`，並在 frontmatter 中設定 `name` 與 `description`：

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. 將其壓縮（`zip -r release-notes.zip release-notes/`）。壓縮檔最大為 5 MiB。
3. 以單一 multipart 部分 `files` 上傳：

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. 使用[更新 Agent](/api-reference/agents/update) 從 Agent 參照它：

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

首次附加 Skill 時，`"version": null`（或省略 `version`）會在儲存 Agent 時解析為其目前的 `default_version`。已儲存的 Agent 會包含明確的版本。變更 Skill 的預設版本不會升級既有的 Agent。若要升級，請以明確的版本（例如 `"2"`）更新其 `skills` 陣列；對既有繫結傳送 `null` 會保留其已鎖定的版本。每個 Session 都會使用已儲存的 Agent 版本，並在 `environment.skills` 中回報解析後的 Skills。

一個 Agent 最多支援 32 個 Skills。在其選取的 Skills 中，Skill ID 與 Skill 名稱都必須唯一。

## 版本 {#versions}

- 上傳至 `POST /v1/skills/{skill_id}/versions` 會新增下一個版本。傳送表單欄位 `default=true` 可將其設為預設版本。
- 對 `POST /v1/skills/{skill_id}` 傳送 `default_version` 可在不上傳的情況下切換預設版本。
- `status` 為 `active` 或 `disabled`。參照已停用 Skill 的 Agent，其新的 Session 會以 `400 skill_not_found` 失敗；已凍結版本的 Session 則會保留該版本。
- 任何 Agent 版本所參照的 Skill 都無法刪除（409）。請改為停用。從最新的 Agent 版本移除它，並不會移除歷史版本中的參照。

## 分頁與錯誤 {#pagination-and-errors}

清單使用游標分頁，參數為 `limit`（0-100）、`after` 與 `order`。錯誤使用 [Agents 錯誤封裝格式](/api-reference/errors#agents-platform-errors)。

## 下載套件 {#download-a-bundle}

內容端點傳回的是 `application/zip`，而不是 JSON。請將回應儲存為檔案：

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

目前的預設版本請使用 `/v1/skills/{skill_id}/content`。公開目錄中的套件請使用 `/v1/skills/catalog/{skill_id}/versions/{version}/content`。

版本清單使用與 Skill 清單相同的游標參數。請將傳回的 `last_id`（例如 `skl_…:2`）作為 `after` 傳入；不要只傳入版本號碼。
