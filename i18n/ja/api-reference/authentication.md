---
i18nSource: 5b94f91222d138de
title: API 認証
description: Bearer トークンと、サポートされているプロトコル互換の API キーヘッダーで SandBase API を認証します。
---

# 認証 {#authentication}

SandBase は、公開 API リクエストの認証に API キーを使用します。このページでは、サポートされている連携方法とキー管理のプラクティスを説明します。Console の認証とその内部 API は、公開 API の仕様には含まれません。

## 認証方法 {#authentication-methods}

標準の SandBase `/v1/*` エンドポイントには Bearer トークンが必要です。Anthropic Messages と Google Gemini 互換の操作では、それぞれのネイティブ SDK と互換性のある API キーの指定位置も使用できます。

### Bearer トークン {#bearer-token}

`Authorization` ヘッダーにキーを含めます。

```http
Authorization: Bearer sk-your-api-key
```

これは OpenAI 互換 SDK で使われる標準の方法です。

### Anthropic Messages: x-api-key ヘッダー {#anthropic-messages-x-api-key-header}

`x-api-key` ヘッダーにキーを含めます。

```http
x-api-key: sk-your-api-key
```

このヘッダーは `POST /v1/messages` でのみサポートされます。他の公開エンドポイントはこのヘッダーを読み取りません。Chat Completions、`/v1/run`、リソース API では Bearer 認証を使ってください。

### 優先順位 {#priority}

`POST /v1/messages` に限り、両方のヘッダーがある場合は `x-api-key` が優先されます。

### Google Gemini 互換の API キー {#google-gemini-compatible-api-keys}

Gemini の GenerateContent と Interactions の操作では、`x-goog-api-key`、`Authorization: Bearer …`、`key` クエリパラメーターをこの優先順位で受け付けます。クエリ文字列の認証情報はログやブラウザーの履歴に残る可能性があるため、ヘッダーを使うことをおすすめします。サポートされているパスについては、[Google Gemini](/api-reference/gemini-generate-content) と [Gemini Interactions](/api-reference/gemini-interactions) を参照してください。

### 抽出ロジック {#extraction-logic}

標準のエンドポイントは `Authorization: Bearer <key>` のみを読み取ります。Anthropic Messages のミドルウェアは、まず `x-api-key` を読み取り、なければ Bearer ヘッダーを使います。Agents プラットフォームのリソースは `Authorization: Bearer` または `X-API-Key` を受け付けます（後述）。[webhook Events API](/api-reference/webhooks)（`/events/webhooks*`）もどちらのヘッダーも受け付け、両方ある場合は Bearer ヘッダーを使います。サポートされている認証情報がない場合は `401 Unauthorized` を返します。

### Agents プラットフォームのリソース {#agents-platform-resources}

`/v1/agents*`（`/v1/agents/sessions*` を含む）、`/v1/mcp-connections*`、`/v1/secrets*`、`/v1/skills*` は、どちらのヘッダーでもキーを受け付けます。

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- `Authorization: Bearer` と `X-API-Key` の両方を送信する場合は、同じキーである必要があります。値が異なると `401 unauthorized` を返します。どちらかのヘッダーを重複して送信した場合も 401 を返します。
- `OpenAI-Beta` は任意です。指定する場合は `agents=v1` である必要があります。
- 読み取りリクエストには `agents.read` 権限、書き込みには `agents.write` 権限が必要です。Console で作成した標準のキーは両方を持っています。CLI Login キーなど、スコープが制限された SandBase 発行のキーは `403 insufficient_scope` を返します。
- `402 spending_limit_exceeded` は、キーの支出上限または組織の残高を使い切ったことを意味します。
- エラーには、下に示すフラットな `{"error": "…"}` 形式ではなく、[Agents のエラーエンベロープ](/api-reference/errors#agents-platform-errors)が使われます。

## API キーの形式 {#api-key-format}

Console で新しく作成した API キーの形式は次のとおりです。

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| 構成要素 | 説明 |
|-----------|-------------|
| `sk-` | 標準の「シークレットキー」プレフィックス |
| `xxxx...` | 32 バイトの乱数から生成された 64 文字の 16 進数 |

従来の `sk-sb-...` キーは、有効期限が切れるか失効されるまで引き続き使用できます。クライアントは、プレフィックスや長さで認証情報を拒否せず、キーを不透明な文字列として扱ってください。

::: warning
API キーをクライアント側のコード、公開リポジトリ、ログに公開しないでください。パスワードと同じように扱ってください。
:::

## API キーの作成 {#create-api-keys}

### Console から作成する {#via-console}

1. [SandBase Console](https://www.sandbase.ai/console) にログインします
2. **Developer → API Keys** を開きます
3. **New key** をクリックします
4. キーにわかりやすい名前を付けます（例: 「Production Backend」「Development」）
5. キーをすぐにコピーします。キーは再表示されません

### キーのプロパティ {#key-properties}

| プロパティ | 説明 |
|----------|-------------|
| Name | 識別用のわかりやすいラベル |
| Organization | キーが属する組織 |
| Enabled | キーが有効かどうか |
| Spending Limit | キーごとの任意の支出上限 |
| Expires At | 任意の有効期限 |
| Created At | キーの作成日時 |

Console で作成した標準のキーは、ドキュメントに記載された公開 API に組織レベルでアクセスできます。CLI Login キーなど、SandBase が発行する認証情報には、制限されたスコープが付いている場合があります。Console では、標準のキーに対してユーザーがスコープを選択する機能は提供していません。

## キーのライフサイクル {#key-lifecycle}

### ローテーション {#rotation}

キーをローテーションするには、次の手順に従います。

1. Console で新しいキーを作成します
2. 新しいキーを使うようにアプリケーションを更新します
3. 本番環境で新しいキーが機能することを確認します
4. 古いキーを失効させます

::: tip
ダウンタイムを避けるため、必ず新しいキーを作成してから古いキーを失効させてください。
:::

### 失効 {#revocation}

失効したキーでは新しいリクエストを認証できません。API は次のメッセージとともに `401 Unauthorized` を返します。

```json
{"error":"API key has been revoked"}
```

### 有効期限 {#expiration}

キーには任意で有効期限を設定できます。期限切れのキーは、次のメッセージとともに `401 Unauthorized` を返します。

```json
{"error":"API key has expired"}
```

## エンドポイントの認証要件 {#endpoint-authentication-requirements}

| エンドポイント | 認証方法 | 説明 |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | API キー（Bearer） | Chat Completions |
| `POST /v1/responses` | API キー（Bearer） | OpenAI 互換の Responses API |
| `POST /v1/messages` | API キー（Bearer または x-api-key） | Anthropic Messages |
| `/v1beta/models/*` | API キー（x-goog-api-key、Bearer、またはクエリの key） | Gemini GenerateContent |
| `/v1beta/interactions*` | API キー（x-goog-api-key、Bearer、またはクエリの key） | Gemini Interactions |
| `/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*` | API キー（Bearer または X-API-Key） | Agents プラットフォームのリソース |

SandBase Console は、別のブラウザー認証フローを使います。その内部リクエストはサポート対象の公開エンドポイントではないため、連携に使用しないでください。

## 組織の分離 {#organization-isolation}

API キーのスコープは組織単位です。キーで認証すると、次のようになります。

- アクセスできるのは、自分の組織に属するリソースだけです
- 利用量と請求は組織ごとに記録されます

## エラーレスポンス {#error-responses}

| HTTP ステータス | メッセージ | 原因 |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | キーが指定されていない |
| 401 | `invalid API key` | キーがデータベースに見つからない |
| 401 | `API key has been revoked` | キーが無効化されている |
| 401 | `API key has expired` | キーの有効期限が過ぎている |
| 402 またはプロトコル固有の 403 | `API key spending limit exceeded` | キー単位の支出上限に達した。エンドポイントのドキュメントに記載されたエラー仕様を確認してください |
| 403 | `API key is not authorized for this endpoint` | スコープ付きのキーをスコープ外のエンドポイントで使用した |

これらのメッセージは、`403` のスコープエラーを除き、フラットな `{"error":"<message>"}` ボディで返されます。スコープエラーは、モデルとアカウントのエンドポイントでは `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}` を使い、Agents プラットフォームのリソースでは `code` が `insufficient_scope` の [Agents のエラーエンベロープ](/api-reference/errors#agents-platform-errors)を使います。

## セキュリティのベストプラクティス {#security-best-practices}

### 推奨事項 {#do}

- **キーは環境変数に保存する**: ソースコードにキーをハードコードしないでください
- **環境ごとに別のキーを使う**: 開発、ステージング、本番で異なるキーを使います
- **有効期限を設定する**: セキュリティポリシーに合ったローテーション間隔を選びます
- **利用状況を監視する**: Console で想定外のアクティビティがないか確認します
- **標準のキーは公開 API へのアクセスが必要なワークロードにのみ使う**: スコープ付きの CLI Login 認証情報は、その管理されたフロー内で使います

### 禁止事項 {#don-t}

- **キーをバージョン管理にコミットしない**: `.env` を `.gitignore` に追加します
- **関係のないアプリケーション間で 1 つのキーを共有しない**: キーを分けると、ローテーションやインシデント対応を安全に行えます
- **クライアント側のコードでキーを公開しない**: 必ずバックエンド経由でプロキシします
- **API キーをログに記録しない**: アプリケーションのログではキーをマスクします

### 環境変数の例 {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## キーごとのレート制限 {#rate-limiting-by-key}

リクエストの上限は組織ごとに割り当てられ、その組織のすべての API キーで共有されます。そのため、キーを増やしても上限は上がりません。API は、共通の数値によるデフォルト値や残りクォータのヘッダーを公開していません。

上限と 429 レスポンスの処理について詳しくは、[レート制限](/guides/rate-limiting)を参照してください。
