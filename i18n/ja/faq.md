---
i18nSource: a86346e2696c732c
title: FAQ
description: AI ツールの接続、SandBase のカタログ、モデル、API、Agent、Session、料金に関するよくある質問です。
---

# よくある質問 {#frequently-asked-questions}

## SandBase とは何ですか？ {#what-is-sandbase}

SandBase は、Agent を現実世界とつなぐためのサービスです。

用意されたモデルや API をそのまま使うことも、AI tools で接続して AI ツールから使うことも、再利用可能な Agent を構築して Session で実行することもできます。

## SandBase は誰向けですか？ {#who-is-sandbase-for}

SandBase の主な対象は次の 3 つのグループです。

- Codex、Claude、Cursor、Kiro の中で便利な機能を使いたい **AI ツールのユーザー**
- モデルや API を直接呼び出したい **開発者**
- 顧客向けや社内ワークフロー向けに再利用可能な Agent を構築する **FDE やチーム**

## 機能はどこで閲覧できますか？ {#where-do-i-browse-capabilities}
SandBase のウェブサイトに機能のカタログが掲載されています。

- [モデル](https://www.sandbase.ai/models) と [画像・動画モデル](https://www.sandbase.ai/models/image-video)
- [API](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
機能の種類に応じて、詳細の確認、テスト、インストール、呼び出し、複製ができます。

## AI tools とは何ですか？ {#what-is-ai-tools}

Console の **Build → AI tools** では、Claude Code、Codex、Cursor、Kiro など、すでに使っている AI ツールに SandBase を接続できます。エージェントに `set up https://www.sandbase.ai/SKILL.md` を貼り付けるか、`npx -y @sandbaseai/cli@latest connect` を実行してください。接続したツールは SandBase のモデルと API のカタログを検索・実行でき、料金はワークスペースに請求されます。[AI ツールを接続する](/setup/) を参照してください。

## Build Agent とは何ですか？ {#what-is-build-agent}

Build Agent は、Agent を定義してテストする場所です。

Agent は、指示、モデル、Skill、MCP ツールを 1 つの再利用可能でバージョン管理されたワークフローにまとめたものです。

## Agent は API とは違うものですか？ {#is-an-agent-different-from-an-api}
はい。Agent は編集・テストできるバージョン管理された設定で、Session を作成して実行します。Agent の編集を続けながら、アプリから [Sessions API](/api-reference/sessions/) で Session を作成できます。

## Session とは何ですか？ {#what-are-sessions}
Session は、会話、ツールのアクティビティ、出力を伴う 1 回の Agent 実行です。

## Agent に外部 API へのアクセスを許可するには？ {#how-do-i-give-an-agent-access-to-external-apis}

外部システムを MCP サーバーとして接続し、Agent の MCP 接続に追加します。サーバーで Bearer トークンが必要な場合は、[Secrets API](/agents/api-credentials#with-the-api) を使って、そのサーバー URL に紐づく書き込み専用の Secret として保存します。トークンはそのサーバーにのみ送信され、プロンプトや Agent のランタイムに表示されることはありません。[MCP ツールの認証情報](/agents/api-credentials) を参照してください。

## モデルはどこにありますか？ {#where-do-models-live}

モデルは重要な構成要素であるため、専用の [カタログ](https://www.sandbase.ai/models) があります。

モデルは直接呼び出すことも、接続した AI ツールから使うことも、Agent の中で使うこともできます。

## コードを書く必要はありますか？ {#do-i-need-to-write-code}

必ずしも必要ではありません。

コードを書かずに AI ツールの中で機能を使いたい場合は、[AI ツールを接続](/setup/) してください。

アプリケーションから SandBase を呼び出したい場合は、API リファレンスを使用してください。

再利用可能な複数ステップの作業が必要な場合は、Build Agent を使用してください。

## API キーはどうやって取得しますか？ {#how-do-i-get-an-api-key}

Console を開き、**Developer → API Keys** に移動して **New key** を選択します。

キーは次のように使用します。

```http
Authorization: Bearer sk-YOUR_KEY
```

## 料金体系はどうなっていますか？ {#how-does-billing-work}

SandBase はクレジットと従量課金を採用しています。

モデル、API、Agent、ランタイムの処理には、それぞれ異なるコストがかかる場合があります。現在の使用量と料金は Console で確認してください。

## 次のステップ {#next-steps}

- [はじめに](/getting-started/)
- [モデルと API のカタログ](https://www.sandbase.ai/models)
- [AI ツールを接続する](/setup/)
- [Build Agent](/agents/)
- [API リファレンス](/api-reference/)
