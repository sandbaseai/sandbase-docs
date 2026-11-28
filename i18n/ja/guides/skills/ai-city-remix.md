---
i18nSource: ff1347dede49419a
agentDoc: ai-city-remix-agent-en
title: AI City Remix に参加する
description: AI City Remix のクレジットを受け取り、都市と Skill を選び、ローカルのエージェントで動画を作成して、審査用にアップロードします。
---

# AI City Remix に参加する {#enter-ai-city-remix}

イベントページで Skill と都市を選び、完全な指示をローカルのエージェントに渡します。作成が終わると、エージェントが動画、カバー画像、応募情報をアップロードし、審査に提出します。


## 前提条件 {#prerequisites}

- SandBase アカウント。
- コマンドの実行とファイルへのアクセスができるローカルのエージェント。
- 動画、カバー画像、プロジェクトファイル用の作業フォルダー。

ローカル環境を初めてセットアップする場合は、[Skill をローカルで使う](/guides/skills/local-use)の手順に従ってください。

## 1. イベントを開いてクレジットを受け取る {#_1-open-the-event-and-claim-credits}

1. [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en) を開き、最新の[イベント規約](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en)を読みます。
2. 「Claim $5 free & create」をクリックし、求められたらサインインします。
3. システムがイベントクレジットを受け取り、自動的に引き換えを試みます。残高と引き換えのステータスを確認し、再試行が必要な場合は引き換えの操作を使います。
4. 受け取りが終わったら、「Create now」をクリックして作成ダイアログを開きます。

受け取り期間、提供状況、参加資格はイベントページに表示されます。モデルの呼び出しでは実際の使用量に応じてクレジットが消費されます。[Billing](https://www.sandbase.ai/console/billing) で確認してください。

## 2. モデルの API キーを設定する {#_2-configure-a-model-api-key}

アカウントに使用可能な API キーがない場合は、「Create an API key」ダイアログが表示されます。

1. 表示された支出上限と有効期限を確認し、「Create API key」をクリックします。
2. 「Create with this key」をクリックします。新しいキーは、エージェントに渡す完全な指示に含まれます。
3. 完全な指示は信頼できるエージェントに送信し、プライベートなワークスペースに保管してください。

既存のキーを使う場合は、ローカルのエージェントの安全な設定または実行環境で `SANDBASE_API_KEY` を設定します。キーは [API Keys](https://www.sandbase.ai/console/keys) で管理します。

## 3. Skill と概要を選ぶ {#_3-choose-a-skill-and-brief}

ダイアログでは、公式の Skill、都市、ストーリー、クリエイティブの方向性があらかじめ選択されています。

- 「Official Skill」を展開して概要と詳細を読み、映像のアプローチを選びます。
- 「Creative brief」を展開して、都市を検索するか、地図上で場所を選びます。
- 提案をシャッフルするか、ストーリーとクリエイティブの方向性を直接編集します。
- 地図上の場所、対応言語、出力スタイルを確認します。

歴史、人物、出来事については、検証可能な情報源を使ってください。言語と長さの対応状況は、選択した Skill の詳細で確認してください。

## 4. 指示をコピーして作成する {#_4-copy-the-instructions-and-create}

1. プロンプト欄の「Copy all」をクリックします。
2. ローカルのエージェントでプロジェクトフォルダーを開き、タスクを開始して、完全な指示を貼り付けます。
3. 送信し、求められた入力を提供し、依存関係を設定して、作成を開始します。

指示には、選択した Skill、クリエイティブの概要、応募メタデータの形式、アップロードの認可が含まれます。エージェントが作品を作成して提出できるよう、引き渡す内容はすべてそのまま残してください。

「Preparing」は、アップロードのアクセス権を準備中であることを示します。再度準備するには「Retry」を、不足している情報を入力するには「Complete brief」を使います。

## 5. 作成の進行状況を確認する {#_5-follow-creation-progress}

作成には、Skill、モデル、動画の長さに応じて数十分から数時間かかり、モデルのクレジットを消費します。エージェントを実行したままにし、コンピューターがスリープしないようにしてください。

予算と進行状況に関する指示を同じタスクに追加します。

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

現在のイベント規約で求められているとおり、SandBase 経由で MiniMax M3.1 Flash を使ってください。長さ、解像度、字幕、ファイルサイズについては、イベントページとアップロードページの要件に従ってください。

## 6. 提出して審査のステータスを確認する {#_6-submit-and-check-review-status}

エージェントは完全な指示に従って公式のアップロードクライアントを使い、動画、カバー画像、メタデータをアップロードして審査に提出します。

進行状況は [My entries](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en) で確認できます。

| ステータス | 次のステップ |
|---|---|
| 下書き | 作品を完成させ、ファイルをアップロードして審査に提出します。 |
| 審査待ち | 審査のステータスを確認します。 |
| 承認済み | 公開された応募ページを開いて共有します。 |
| 修正依頼 | 審査コメントに従って修正し、再提出します。 |

既存の作品を応募する場合は、イベントページで「Upload existing video」を選び、詳細を入力して動画とカバー画像をアップロードし、審査に提出します。

## 7. アップロードを再開する {#_7-resume-an-upload}

認可の期限が切れた場合やアップロードが中断された場合は、元のファイルで続行します。

1. 動画、カバー画像、`entry.json`、作業フォルダーを残しておきます。
2. My entries で同じ下書きを見つけ、「Resume upload」をクリックします。
3. 新しい再開用の指示を、元のエージェントのタスクにコピーします。
4. 既存のファイルをアップロードして提出するようエージェントに依頼し、My entries でステータスを確認します。

## 8. 応募作品を共有する {#_8-share-your-entry}

承認された応募ページで「Share on X」をクリックすると、内容が入力済みの投稿画面が開きます。応募作品のリンク、`#AICityRemix`、`@SandbaseAI`、公式のイベント投稿が含まれます。

動画付きで投稿するには、先に「Download video」をクリックし、X の投稿画面でファイルを追加して、テキストを確認してから投稿します。

## 関連ドキュメント {#related-documentation}

- [Skill をローカルで使う](/guides/skills/local-use)
- [エージェントを接続する](/setup/)
- [API キーを設定する](/getting-started/api-keys)
