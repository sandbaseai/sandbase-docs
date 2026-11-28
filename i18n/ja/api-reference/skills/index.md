---
i18nSource: 94e0cdfdd0239d6b
title: Skills API
description: バージョン管理された Skill バンドルをアップロードし、Agent に添付します。
---

# Skills API {#skills-api}

Skill は、Agent がマウントできる指示とリソースをまとめた、バージョン管理された ZIP バンドルです。Skill ID には `skl_` プレフィックスが付き、バージョン識別子は `"1"` のような文字列です。

## Skill の操作 {#skill-operations}

| メソッド | パス | 用途 |
|---|---|---|
| `POST` | `/v1/skills` | ZIP のアップロードから [Skill を作成](./create) |
| `GET` | `/v1/skills` | [Skill を一覧表示](./list) |
| `GET` | `/v1/skills/{skill_id}` | [Skill を取得](./get) |
| `POST` | `/v1/skills/{skill_id}` | デフォルトバージョン、ステータス、メタデータを [更新](./update) |
| `DELETE` | `/v1/skills/{skill_id}` | [Skill を削除](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | デフォルトバージョンの ZIP をダウンロード |
| `GET` | `/v1/skills/{skill_id}/versions` | [バージョンを一覧表示](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [バージョンをアップロード](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [バージョンを取得](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | バージョンの ZIP をダウンロード |
| `GET` | `/v1/skills/catalog` | [公開 Skill を閲覧](./catalog) |

## 5 分でできるセットアップ {#five-minute-setup}

1. フォルダーを作成し、フロントマターで `name` と `description` を設定した `SKILL.md` を置きます。

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. フォルダーを ZIP に圧縮します（`zip -r release-notes.zip release-notes/`）。アーカイブの上限は 5 MiB です。
3. 単一のマルチパートパート `files` としてアップロードします。

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. [Agent の更新](/api-reference/agents/update) で Agent から参照します。

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

Skill を初めて添付する場合、`"version": null`（または `version` の省略）は、Agent の保存時点の `default_version` に解決されます。保存された Agent には明示的なバージョンが含まれます。Skill のデフォルトを変更しても、既存の Agent はアップグレードされません。アップグレードするには、`"2"` などの明示的なバージョンを指定して `skills` 配列を更新してください。既存のバインディングに `null` を送信すると、固定済みのバージョンが維持されます。各 Session は保存された Agent バージョンを使用し、解決された Skills を `environment.skills` で報告します。

1 つの Agent には最大 32 個の Skill を設定できます。Skill ID と Skill 名は、その選択内で一意である必要があります。

## バージョン {#versions}

- `POST /v1/skills/{skill_id}/versions` にアップロードすると、次のバージョンが追加されます。デフォルトにするには、フォームフィールド `default=true` を送信します。
- `POST /v1/skills/{skill_id}` で `default_version` を指定すると、アップロードせずにデフォルトを切り替えられます。
- `status` は `active` または `disabled` です。無効化された Skill を参照する Agent の新しい Session は `400 skill_not_found` で失敗します。すでにバージョンを固定している Session はそのバージョンを使い続けます。
- いずれかの Agent バージョンが参照している Skill は削除できません（409）。代わりに無効化してください。最新の Agent バージョンから削除しても、過去のバージョンにある参照は削除されません。

## ページネーションとエラー {#pagination-and-errors}

一覧は、`limit`（0-100）、`after`、`order` によるカーソルページネーションを使用します。エラーは [Agents のエラーエンベロープ](/api-reference/errors#agents-platform-errors) を使用します。

## バンドルをダウンロードする {#download-a-bundle}

コンテンツのエンドポイントは JSON ではなく `application/zip` を返します。レスポンスをファイルに保存してください。

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

現在のデフォルトバージョンには `/v1/skills/{skill_id}/content` を使用します。公開カタログのバンドルには `/v1/skills/catalog/{skill_id}/versions/{version}/content` を使用します。

バージョンの一覧は、Skill の一覧と同じカーソルパラメーターを使用します。返された `last_id`（例: `skl_…:2`）を `after` に渡してください。バージョン番号だけを渡さないでください。
