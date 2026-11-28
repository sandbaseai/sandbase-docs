---
i18nSource: 1b5099685e9df6ce
title: Agent カタログ
description: 公開 Agent を閲覧し、組織にクローンします。
---

# Agent カタログ {#agent-catalog}

カタログには、SandBase が再利用のために公開している Agent が一覧表示されます。カタログのエントリは読み取り専用です。クローンすると、組織内で編集・実行・デプロイできるプライベートな Agent を取得できます。

| メソッド | パス | 用途 |
|---|---|---|
| `GET` | `/v1/agents/catalog` | 公開 Agent を一覧表示する |
| `GET` | `/v1/agents/catalog/{agent_id}` | 公開 Agent を 1 件取得する（`?version=` で指定も可能） |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | 組織にコピーする |

## カタログの Agent を一覧表示する {#list-catalog-agents}

`limit`（1-100）、`after`、`order` によるカーソルページネーションを使用します。

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

各エントリには `id`、`object: "agent"`、`visibility: "public"`、`version`、`name`、`description`、`model`、`created_at`、`updated_at` が含まれます。

## カタログの Agent を取得する {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` は任意で、正の整数である必要があります。詳細レスポンスには、読み取り専用の `configuration` オブジェクト（名前、説明、モデル、指示、ランタイムプロファイル、メタデータ、ツール、テキスト、推論、Skills）が追加されます。

## カタログの Agent をクローンする {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

ボディには任意で `version`（正の整数。デフォルトは現在の公開バージョン）と `name`（最大 128 文字）を指定できます。レスポンスは `201 Created` で、組織内の新しい `agt_` ID を持つ完全な [Agent オブジェクト](./create) が返されます。`Idempotency-Key` は任意です。再試行で 2 つ目のコピーが作成されないよう、安定したキーを送信してください。

クローン後は、[Session を作成](/api-reference/sessions/create) してテストします。
