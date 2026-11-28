---
i18nSource: c063864501452a7b
title: SandBase ドキュメント
description: モデルと API を直接使って構築するか、マネージドインフラストラクチャ上で動作する再利用可能な Agents を定義します。
---

# SandBase ドキュメント {#sandbase-docs}

モデルと API を直接使って構築するか、マネージドインフラストラクチャ上で動作する再利用可能な Agents を定義します。

SandBase には、AI アプリケーションを構築するための補完的な 2 つの方法があります。作業に合う最小限の範囲から始め、アプリケーションの成長に合わせて組み合わせることができます。

## 構築方法を選ぶ {#choose-how-to-build}

| | モデルと API | マネージド Agents |
|---|---|---|
| **概要** | 言語、画像、動画、音声、サードパーティ API への直接アクセス | SandBase が実行する、再利用可能でバージョン管理された Agent 設定 |
| **適した用途** | 独自のアプリケーションループと、きめ細かなリクエスト制御 | 複数ステップ、非同期、または繰り返し可能な作業 |
| **管理するもの** | プロンプト、オーケストレーション、リトライ、アプリケーションの状態 | Agent の定義、有効にする機能、入力、配信の動作 |
| **ここから開始** | [モデルと API](https://www.sandbase.ai/models) | [Agent を構築する](/agents/) |

::: tip 1 つの SandBase API キー
同じ API キーでモデル、API、Agents を呼び出せます。キーはサーバー側に保管し、ブラウザのコードで公開しないでください。
:::

## 主要な概念 {#core-concepts}

### モデルと API {#models-and-apis}

言語、画像、動画、音声のワークロードにはモデルを使います。アプリケーションに外部データやアクションが必要な場合は API を使います。SandBase Web サイトのカタログでは、利用可能な機能、料金、入力スキーマ、動作するサンプルを確認できます。

- [モデルを見る](https://www.sandbase.ai/models)
- [API を見る](https://www.sandbase.ai/apis)
- [最初の API 呼び出しを行う](/getting-started/first-call)
- [API リファレンスを開く](/api-reference/)

### Agents {#agents}

Agent は、モデル、指示、Skills、MCP 接続を含む、再利用可能でバージョン管理された設定です。一度定義すれば、Session で実行できます。

- [Agents について理解する](/agents/)
- [Agent を定義する](/agents/agent-api)
- [Skills と MCP ツールを追加する](/agents/mcp-tools)

### Sessions {#sessions}
Session は 1 つの Agent バージョンを実行します。`POST /v1/agents/sessions` で作成し、入力を送信してイベントをストリーミングし、後から会話全体を読み取ります。

- [Sessions ガイド](/agents/sessions)
- [Sessions API](/api-reference/sessions/)

## 最初のステップ {#first-steps}

1. 組織と [API キー](/getting-started/api-keys) を作成します。
2. [カタログ](https://www.sandbase.ai/models) からモデル、API、または Agent を選びます。
3. 直接リクエストを行うか、Agent を定義してテストします。
4. テスト済みの Agent を、アプリケーションから Session で実行します。
5. Console で Session、エラー、レイテンシ、コストを確認します。

## 運用ガイド {#operational-guidance}

- [ストリーミングレスポンス](/guides/streaming)
- [エラー処理とリトライ](/guides/error-handling)
- [レート制限](/guides/rate-limiting)
- [課金と料金](/guides/billing)
- [ワークスペースの管理](/admin/)

## 次のステップ {#next-steps}

- ローカルの Skills で作成する：[Skill チュートリアル](/guides/skills/)

- SandBase を初めて使う：[はじめに](/getting-started/)
- モデルや API を呼び出す：[モデルカタログ](https://www.sandbase.ai/models) と [API カタログ](https://www.sandbase.ai/apis)
- 推論 API と Agent API：[API リファレンス](/api-reference/)
- 再利用可能な作業を構築する：[Agent を構築する](/agents/)
- AI ツールを接続する：[セットアップ](/setup/)
