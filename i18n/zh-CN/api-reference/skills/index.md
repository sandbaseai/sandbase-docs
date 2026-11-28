---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: 上传带版本的 Skill 包并将其挂载到 Agents。
---

# Skills API {#skills-api}

Skill 是一个带版本的 ZIP 包，包含 Agent 可以挂载的指令和资源。Skill ID 使用 `skl_` 前缀，版本标识符为字符串，例如 `"1"`。

## Skill 操作 {#skill-operations}

| 方法 | 路径 | 用途 |
|---|---|---|
| `POST` | `/v1/skills` | 通过上传 ZIP [创建 Skill](./create) |
| `GET` | `/v1/skills` | [列出 Skills](./list) |
| `GET` | `/v1/skills/{skill_id}` | [获取 Skill](./get) |
| `POST` | `/v1/skills/{skill_id}` | [更新](./update)默认版本、状态或元数据 |
| `DELETE` | `/v1/skills/{skill_id}` | [删除 Skill](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | 下载默认版本的 ZIP |
| `GET` | `/v1/skills/{skill_id}/versions` | [列出版本](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [上传版本](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [获取版本](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | 下载指定版本的 ZIP |
| `GET` | `/v1/skills/catalog` | [浏览公开 Skills](./catalog) |

## 五分钟上手 {#five-minute-setup}

1. 创建一个文件夹，其中包含 `SKILL.md`，并在其 frontmatter 中设置 `name` 和 `description`：

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. 将其压缩为 ZIP（`zip -r release-notes.zip release-notes/`）。压缩包最大为 5 MiB。
3. 将其作为唯一的 multipart 部分 `files` 上传：

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. 使用[更新 Agent](/api-reference/agents/update) 在 Agent 中引用它：

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

首次挂载 Skill 时，`"version": null`（或省略 `version`）会在保存 Agent 时解析为该 Skill 当前的 `default_version`。保存后的 Agent 包含明确的版本。更改 Skill 的默认版本不会升级已有的 Agent。如需升级，请在 `skills` 数组中显式指定版本，例如 `"2"`；对已有绑定提交 `null` 会保留其已固定的版本。每个 Session 使用已保存的 Agent 版本，并在 `environment.skills` 中报告解析后的 Skills。

一个 Agent 最多支持 32 个 Skills。在同一 Agent 的选择中，Skill ID 和 Skill 名称都必须唯一。

## 版本 {#versions}

- 上传到 `POST /v1/skills/{skill_id}/versions` 会添加下一个版本。发送表单字段 `default=true` 可将其设为默认版本。
- 对 `POST /v1/skills/{skill_id}` 传入 `default_version` 可在不上传的情况下切换默认版本。
- `status` 为 `active` 或 `disabled`。引用了已禁用 Skill 的 Agent 在新建 Session 时会失败并返回 `400 skill_not_found`；已经冻结了版本的 Sessions 会继续使用该版本。
- 任何 Agent 版本引用的 Skill 都无法删除（409），请改为禁用。从最新的 Agent 版本中移除该 Skill，并不会移除历史版本中的引用。

## 分页与错误 {#pagination-and-errors}

列表使用游标分页，参数为 `limit`（0-100）、`after` 和 `order`。错误使用 [Agents 错误结构](/api-reference/errors#agents-platform-errors)。

## 下载 Skill 包 {#download-a-bundle}

内容端点返回 `application/zip`，而非 JSON。请将响应保存为文件：

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

使用 `/v1/skills/{skill_id}/content` 获取当前默认版本。对于公开目录中的包，请使用 `/v1/skills/catalog/{skill_id}/versions/{version}/content`。

版本列表使用与 Skill 列表相同的游标参数。请将返回的 `last_id`（例如 `skl_…:2`）作为 `after` 传入，不要只传版本号。
