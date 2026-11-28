---
i18nSource: 8cb9626a2127cb8d
title: クイックスタート
description: プラットフォーム上、API、または Agent から、SandBase の使い方を選びます。Skill と Tool を見つけて手順に従い、SDK や CLI のリポジトリから始めましょう。
pageClass: quickstart-page
---

# クイックスタート {#quick-start}

## SandBase の使い方を選ぶ {#connect}

以下は**始め方の 3 つの選択肢**であり、すべて完了する必要がある 3 つのステップではありません。どの方法でも同じ SandBase アカウントとワークスペースを使用します。

<QuickstartPaths />

すぐに使えるタスクを探している場合は、[Tools を見る](#use-tools) か [Skill を選んでください](#use-skills)。公開カタログとドキュメントはサインイン前でも閲覧できます。

### オープンソースのリポジトリから始める {#start-from-the-open-source-repositories}

- **[SandBase — SDK とサンプル](https://github.com/sandbaseai/sandbase)**：Python、TypeScript、Go のクライアント、API のサンプル、ホスト型 Agent のワークフロー。独自のアプリケーションを構築する場合に使用します。
- **[SandBase CLI & MCP](https://github.com/sandbaseai/cli)**：AI ツールをインストールして接続したり、ターミナルから機能を検索・実行したりできます。既存の Agent と組み合わせて使用します。

## 始める前に：サインインする {#create-account}

Playground の使用、ホスト型 Skill の実行、API キーの作成の前にサインインしてください。アカウントなしで使える無料ツールは、そのまま利用できます。**すでにサインイン済みの場合は、この手順をスキップ**し、アカウントメニューに使用したいワークスペースが表示されていることを確認してください。

SandBase は GitHub または Google でサインインします。メールアドレスとパスワードによる個別の登録はありません。

1. [アカウント作成 / サインイン](https://www.sandbase.ai/login){target="_blank"} を開きます。
2. セキュリティチェックを完了し、**Sign in with GitHub** または **Sign in with Google** を選択します。
3. プロバイダーのウィンドウでアクセスを承認します。
4. 使用していたページに戻るか、[Console](https://www.sandbase.ai/console){target="_blank"} を開きます。

初回ログイン時に、アカウントと**個人ワークスペース**が作成されます。SandBase を試す前に組織を作成する必要はありません。

ウェルカムクレジットが表示された場合は、支払い方法を追加せずに始められます。現在の残高は、Console ダッシュボードの **Balance** カードと [請求](https://www.sandbase.ai/console/billing){target="_blank"} で確認できます。

## プラットフォーム上で使う {#use-on-website}

クライアントのインストールもコードも不要で、まずブラウザーでモデル、API、Agent を試したい場合はこの方法を選びます。

1. サインインして、カタログを開きます。
   - [言語モデル](https://www.sandbase.ai/models){target="_blank"}
   - [画像・動画モデル](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [API](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. モデルまたは API の詳細ページを開き、利用可能な場合は **Playground** を選択します。
3. プロンプト、画像、検索クエリ、URL など、必要な入力を入力します。実行する前に表示された料金を確認してください。
4. リクエストを実行し、返されたテキスト、データ、画像、動画、またはタスクのステータスを確認します。

ウェブサイトの Playground では、別途 API キーを作成する必要はありません。Playground がない機能では、**API** タブを使用し、以下の API の手順に従ってください。

## API から使う {#call-api}

アプリに 1 つの機能を追加する場合はこの方法を選びます。

1. 使用するワークスペースの有効なキーを再利用するか、[Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} で **New key** を選択して [API キー](/getting-started/api-keys) を作成します。キーは一度しか表示されないため、すぐにコピーしてください。
2. カタログを絞り込み、詳細ページを開きます。
   - [言語モデル](https://www.sandbase.ai/models){target="_blank"} — プロバイダー、機能、コンテキスト、料金で絞り込み
   - [画像・動画モデル](https://www.sandbase.ai/models/image-video){target="_blank"} — text-to-image、image-to-image、text-to-video、image-to-video などのマルチモーダルモデルで絞り込み
   - [API](https://www.sandbase.ai/apis){target="_blank"} — プラットフォームとデータソースで API リソースを絞り込み
3. **API** タブを開き、サンプルリクエストをコピーして、そのエンドポイントの必須フィールドを入力します。
4. SandBase のキーをサーバーの環境変数に保存し、リクエストを実行します。ブラウザーのコードや公開リポジトリにキーを含めないでください。
5. レスポンスを確認します。非同期タスクの場合は、完了するまでエンドポイントのステータスポーリングの例に従ってください。

**Bash / zsh**（macOS、Linux、または WSL を使用した Windows）での言語モデル呼び出しの例です。プレースホルダーのキーはローカルで置き換えてください。その他の環境では、以下のリポジトリにある Python、TypeScript、Go のサンプルを使用してください。シェルコマンドは PowerShell とは互換性がありません。

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

コードから始める：[GitHub の SandBase SDK とサンプル](https://github.com/sandbaseai/sandbase)。

詳しくは：[最初の API 呼び出し](/getting-started/first-call)。

## Agent から使う {#use-in-ai-tool}

Claude Code、Codex、Cursor、Kiro、またはその他の対応クライアントを使用していて、そのアプリ内で SandBase のモデルと API を使いたい場合はこの方法を選びます。

**ローカルで自動セットアップする場合：** クライアントがコマンドを実行できる必要があり、そのマシンに Node.js 20 以上と npm が必要です。チャット専用のクライアントを使用している場合は、代わりに [クライアント別の接続手順](/setup/) に従ってください。

1. Console で [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"} を開きます。
2. AI アシスタントのチャットに次の行を貼り付け、作りたいものを伝えます。これはシェルコマンドではなく、チャットでの指示です。

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. エージェントが開くブラウザーのサインインを承認します。API キーを貼り付ける必要はありません。
4. SandBase のツールが読み込まれるように、新しいセッションを開始するか、アプリを再起動します。
5. 関連するツールを検索して詳細を確認するようエージェントに依頼し、権限と予算の範囲内で、範囲を限定したリクエストを 1 回実行させます。開発の場合は、レスポンスをプロジェクトに組み込ませ、実行コマンドと実際のテスト結果を提示させてください。検索しただけでは、ビジネス API の呼び出しを検証したことにはなりません。

ターミナルを使いたい場合は、`npx -y @sandbaseai/cli@latest connect` を実行してください。検出された対応クライアントが設定されます。1 つだけ設定するには `npx -y @sandbaseai/cli@latest connect --client codex` を使用します（`codex` は使用している対応クライアントに置き換えてください）。その後、そのクライアントを再起動します。有料の実行の前に、選択されているワークスペースを確認してください。

たとえば、次のように依頼できます。

> AI エージェントに関する公開 X 投稿を検索できる SandBase API を探してください。まず必須の入力と料金を確認し、実行する前に 1 回のリクエストのコストを教えてください。結果には元のソースリンクを残してください。

ソースとインストール手順：[GitHub の SandBase CLI & MCP](https://github.com/sandbaseai/cli)。

詳しくは：[AI ツールを接続する](/setup/)。

### AI アシスタントに構築を手伝ってもらう {#start-with-your-agent}

[セットアップ Skill](https://www.sandbase.ai/SKILL.md) は、アカウント未作成、既存の API キーあり、ツール接続済み、既存のプロジェクトあり、新機能の追加など、現在の状況に応じてエージェントをガイドします。エンドポイントの入力と料金を確認し、統合の実装を支援し、セットアップの完了、検証済みの呼び出し、動作する機能を区別します。目的と利用上限を伝えてください。キーはチャットに貼り付けないでください。

すでにキーやプロジェクトがある場合は、そう伝えれば最初からやり直す必要はありません。例：「SandBase のキーを持っています。このプロジェクトに Similarweb のトラフィック検索を追加してください。まず API を確認し、実際のテストにかかるコストを見せてください。」コマンドを実行できない、またはツールを読み込めないアシスタントの場合は、[クライアント別のセットアップ手順](/setup/) が必要です。

[エージェントに Markdown 版クイックスタートを渡す](https://www.sandbase.ai/quickstart.md) か、以下の手順に従ってください。セットアップ Skill をインストールしただけでは、ホスト型 Agent は作成されません。

### 任意：SandBase でホスト型 Agent を実行する {#build-agent}

作業が複数のステップからなる場合や、再利用したい場合はこの方法を選びます。

1. [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"} を開き、**Create** を選択します。
2. **Overview** と **Instructions** を入力します。
3. **Model** を選択します。
4. **Capabilities** で Skill と MCP ツールを追加し、**Runtime** を設定します。
5. **Create & Chat** を選択して、Session でテストします。
6. Agent の **API** タブから、テスト済みのバージョンをアプリで呼び出します。

詳しくは：[Build Agent](/agents/)。公式の OpenAI SDK を使ってコードから同じことを行うには、[OpenAI 互換性](/agents/openai-compatibility) を参照してください。

## Skills、Tools、その他の構築方法 {#skills-and-tools}

タスクに合ったリソースを選んでください。API を使うために Skill をインストールしたり、ホスト型 Agent を作成したりする必要はありません。

- **[Tools](https://www.sandbase.ai/tools)：** テキストの整形や公開データの検索など、特定のタスクをすぐに使えるインターフェースで完了します。
- **[Skills](https://www.sandbase.ai/skills)：** 指示、スクリプト、サンプルを含む再利用可能なワークフローをエージェントに提供します。
- **モデルと API：** Playground、自分のコード、または接続したエージェントから機能を呼び出します。[言語モデル](https://www.sandbase.ai/models)、[画像・動画](https://www.sandbase.ai/models/image-video)、[データ API](https://www.sandbase.ai/apis) をご覧ください。
- **[ホスト型 Agent](/agents/)：** 再利用可能なエージェントを SandBase 上で設定・実行します。
- **[Sandbox](/sandbox/)：** コードの実行やファイル操作のための分離された環境を提供します。

### Tool を使う {#use-tools}

1. [Tools](https://www.sandbase.ai/tools) を開き、完了したいタスクを選びます。
2. ツールの入力要件と、料金またはクォータの表示を確認します。無料のユーティリティはアカウントなしで使える場合があります。データツールの実行には SandBase へのサインインが必要で、モデルのテストには自分のキーが必要な場合があります。
3. 求められたテキスト、URL、ファイル、その他の入力を入力し、ツールの実行操作を行います。
4. 出力を確認し、用意されている場合はコピーまたはダウンロードの操作を使用します。データツールで同じタスクを自動化したい場合は、リンクされた API とリクエスト例を使用してください。

**無料の 1 日あたりのクォータはワークスペースで共有されます**。ツールごとに個別の枠があるわけではありません。実行前に対象かどうかと表示された料金を確認してください。無料のユーティリティを使っても、モデルや API の呼び出しが無料になるわけではありません。

### Skill を使う {#use-skills}

1. [Skills](https://www.sandbase.ai/skills) を開いてワークフローを選び、サンプル、必須の入力、依存関係を確認します。
2. その Skill の詳細ページで利用できるオプションから 1 つを選びます。
   - **オンラインで実行：** 提供されている場合は、サインインしてホスト型のサンプルを実行します。進行状況を確認し、生成された出力やファイルを開きます。表示された利用枠を確認してください。利用可否と制限は Skill によって異なります。
   - **インストール / ダウンロード：** 提供されている場合は、サインインしてパッケージをダウンロードします。パッケージ全体を作業フォルダーに展開し、そのインストール手順に従うか、ローカルのエージェントに `SKILL.md` を読むよう依頼します。
3. ローカルで使用する場合は、タスク、入力、期待する出力、利用上限を伝えます。SandBase への接続には [Agent の手順](#use-in-ai-tool) を使用してください。Skill のスクリプトでキーが必要な場合は、チャットに貼り付けるのではなく、実行環境で設定してください。
4. 実際の結果を確認します。Skill をダウンロードしたりエージェントを接続したりしただけでは、ワークフローが正常に実行されたことにはなりません。

SandBase の**セットアップ Skill** はクライアントを接続するためのもので、カタログの Skill は個々のワークフローを記述したものです。インストールする前に、各 Skill の依存関係と対応クライアントを確認してください。ローカルのワークフローが使用するモデルや API の呼び出しには、使用料が発生する場合があります。

入力フォルダーや成果物の保存を含む詳しい手順は、[Skill をローカルで使う](/guides/skills/local-use) を参照してください。

## 任意：チームワークスペースを共有する {#create-organization}

API キー、使用量、請求は組織に属します。1 人で評価する場合は、個人ワークスペースのままで構いません。複数人でキーや支出を共有する場合は、チームを作成してください。

| ワークスペース | 使用する場面 |
|---|---|
| **個人** | 初回ログイン時に自動作成されます。ユーザーごとに 1 つです。 |
| **チーム** | メンバー、キー、残高を共有します。会社やプロジェクト用に作成します。 |

### チームを作成する {#create-team}

1. [チームを作成](https://www.sandbase.ai/console/members?create=1){target="_blank"} を開くか、Console 右上のアカウントメニューで **Create Team** を選択します。
2. **Team name** を入力し、**Create team** を選択します。
3. アカウントメニューに、そのチームがアクティブなワークスペースとして表示されていることを確認します。
4. **Developer → Team** で **Add member** を選択し、既存の SandBase アカウントの **Account email** を入力して、**Workspace role**（Member または Admin）を選択します。

招待する人は、すでに SandBase アカウントを持っている必要があります。持っていない場合は、[このページ](/getting-started/quickstart) を送って先にサインインしてもらい、その後で追加してください。

複数の組織に所属している場合は、アカウントメニューで切り替えます。キーと請求は**アクティブな**組織に従います。ロールについては [組織](/admin/organizations) を参照してください。

## 動作を確認する {#confirm-it-works}

次のすべてを満たしていれば準備完了です。

- Console のアカウントメニューに、使用したい組織が表示されている。
- API 呼び出し、ウェブサイトでの実行、AI ツールの接続、Agent のいずれかの手順を完了した。
- 1 件のリクエストが成功した。

リクエストが失敗した場合は、アクティブな組織、キー、[エラー](/guides/error-handling) を確認してください。ワークスペースの残高がない場合は、[請求](https://www.sandbase.ai/console/billing){target="_blank"} でチャージしてください。

### 困ったときは {#if-you-get-stuck}

| 表示される内容 | 確認すること |
| --- | --- |
| サインインが必要 | サインインして元のページに戻り、アクティブなワークスペースを確認します。 |
| キーが無効、またはアクセスが拒否された | キーが目的のワークスペースに属し、そのエンドポイントへのアクセス権があることを確認します。クレジットを追加しても権限の問題は解決しません。 |
| 残高不足、またはクォータを使い切った | レスポンスを読み、残高の問題であれば請求を、クォータの上限であれば表示されたリセット時刻を確認します。 |
| Agent にツールが表示されない | クライアントで新しいセッションを開始し、[AI ツールを接続する](/setup/) の診断手順に従います。 |
| タスクがまだ実行中 | 返されたタスクのステータスか、ページの進行状況表示を確認します。同じ有料リクエストを繰り返し送信しないでください。 |

## 請求と使用量 {#billing-and-usage}

サインイン後、アクティブな組織の支出を確認します。

<QuickstartResources group="ops" />

## 次にやること {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools) — ブラウザーでタスクを完了する
- [Skills](https://www.sandbase.ai/skills) — 再利用可能なエージェントワークフローを探す
- [API キー](/getting-started/api-keys) — 組織のキーを作成・ローテーションする
- [モデルと API のカタログ](https://www.sandbase.ai/models) — ウェブサイトでモデル、API、Agent を試す
- [AI ツールを接続する](/setup/) — AI ツールに SandBase のカタログを提供する
- [Build Agent](/agents/) — 再利用可能な Agent を作成する
- [API リファレンス](/api-reference/) — コードで統合する
