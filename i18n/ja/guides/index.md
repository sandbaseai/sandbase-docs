---
i18nSource: c922bd433deabf32
title: ガイド
description: SandBase のモデル、API、Agents、セットアップ、課金、ストリーミング、本番環境での信頼性に関する実践ガイドです。
---

# ガイド {#guides}

これらのガイドでは、SandBase を本番環境で使うための一般的なパターンを説明します。

## モデルを呼び出す {#call-models}
| ガイド | 説明 |
|-------|-------------|
| [Chat Completions](./chat-completions) | OpenAI 互換のチャットプロトコルで SandBase を呼び出します |
| [OpenAI Responses](./openai-responses) | OpenAI 互換の Responses プロトコルで GPT モデルを呼び出します |
| [Anthropic Messages](./anthropic-messages) | Anthropic 互換のメッセージプロトコルで SandBase を呼び出します |
| [Google Gemini](../api-reference/gemini-generate-content) | Google Gemini 互換の GenerateContent プロトコルで SandBase を呼び出します |
| [画像と動画](./image-video) | 共通の非同期 Run API で画像と動画を生成します |
| [ストリーミング](./streaming) | 互換モデルの出力をアプリケーションにストリーミングします |
| [API カタログ](https://www.sandbase.ai/apis) | API の機能と、ベンダー名付きのエンドポイントを確認します |

## 本番環境で運用する {#run-in-production}
| ガイド | 説明 |
|-------|-------------|
| [エラーとリトライ](./error-handling) | 失敗を分類し、繰り返しても安全な操作だけをリトライします |
| [レート制限](./rate-limiting) | 429 レスポンスを処理し、リクエストのバーストを平準化します |
| [同時実行数の制限](./concurrency-limits) | 組織が同時に実行できるタスクの数 |
| [料金と使用量](./billing) | クレジット、使用量、コスト管理について理解します |

## クイックヒント {#quick-tips}

- Codex、Claude、Cursor、Kiro の中でツールを使いたい場合は [セットアップ](/setup/) を使います。
- アプリに必要な機能が 1 つだけの場合は [モデル](https://www.sandbase.ai/models) または [API](https://www.sandbase.ai/apis) を使います。
- 作業が複数ステップにわたる場合や再利用したい場合は [Agent を構築する](/agents/) を使います。
- リクエストと使用量をまとめて確認するには、Console の [Activities](https://www.sandbase.ai/console/activities) を使います。
