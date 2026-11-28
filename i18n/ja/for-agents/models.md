---
i18nSource: b95a8cd6f82c3a9a
title: AI 向けモデルと料金
description: Models API で、現在の SandBase のモデル、機能、スキーマ、料金を確認します。
---

# モデルと料金 {#models-pricing}

すべてのモデルに 1 つの SandBase API キーでアクセスできます。モデルの提供状況、スキーマ、機能、コンテキスト上限、
料金は、それぞれ独立して変更される場合があります。

::: info ライブのモデルメタデータを使用する
最新の正確なデータには、常に `GET /v1/models` と `GET /v1/models/{id_or_name}` を使用してください。すべての
LLM がストリーミング、ビジョン、ツール、構造化出力、キャッシュに対応していると推測しないでください。また、あるモデルの入力フィールドや
料金を別のモデルに流用しないでください。
:::

## カタログと詳細のレスポンス {#catalog-and-detail-responses}

`GET /v1/models` は、`id`、`object`、`created`、`owned_by` を含む OpenAI 互換の識別レコードを返します。
SandBase の機能、スキーマ、料金のメタデータは意図的に省略されています。

`GET /v1/models/{id_or_name}` では、`unified_schema`、`supported_modes`、`model_card` が追加されます。詳細な料金は
`model_card` から読み取ってください。トップレベルの `pricing` オブジェクトはありません。`capability_tags`、`supported_modes`、
`unified_schema` はモデル固有のものとして扱ってください。

## モデルを検索する {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

一覧エンドポイントは `q`、`vendor`、`type`、`order` をサポートします。ページネーションはなく、デフォルトは `type=llm` です。
`id`、`object`、`created`、`owned_by` を含む OpenAI 互換の項目を返します。詳細の取得やモデルの呼び出しでは、返された `id` を
モデル名として使用してください。

非同期の `202` レスポンスでは、返された ID で `GET /v1/run/{id}` をポーリングします。ID は不透明な値として扱い、
ID のプレフィックスや互換性ヘッダーから形式を推測したり、別のポーリングパスを組み立てたりしないでください。

## モデルの詳細を確認する {#inspect-one-model}

モデル名はベンダー修飾されており、`/` を含む場合があります。

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

実行前に次の項目を確認してください。

- `enabled` と `execution_mode`
- `capability_tags` と `supported_modes`
- 受け付けるリクエストフィールドを示す `unified_schema`
- 現在の料金計算式とトークン・キャッシュの倍率を示す `model_card`

## 実際のタスクコストを確認する {#check-actual-task-cost}

完了済みまたは実行中のタスクについては、古い表から再計算するのではなく、記録されたコストを照会してください。

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

レスポンスの仕様は [Models API リファレンス](/api-reference/models/) を、
レスポンス形式とリトライのガイダンスは [エラーガイド](/for-agents/errors) を参照してください。
