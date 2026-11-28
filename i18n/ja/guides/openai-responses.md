---
i18nSource: 958922076a1031cc
title: OpenAI Responses
description: SandBase を通じて、GPT モデルで OpenAI 互換の Responses API を使用します。
---

# OpenAI Responses {#openai-responses}

GPT モデルは、`POST /v1/responses` で OpenAI 互換の Responses API をサポートしています。
プロンプトや構造化コンテンツには `input` を使用し、生成された項目は
`output` から読み取ります。

```bash
curl https://api.sandbase.ai/v1/responses \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/<gpt-model>",
    "input": "Explain immutable infrastructure in one sentence."
  }'
```

## Chat Completions との互換性 {#chat-completions-compatibility}

同じ GPT モデルは `POST /v1/chat/completions` もサポートしています。このプロトコルでは
リクエストに `messages`、レスポンスに `choices` を使用しますが、Responses では
`input` と `output` を使用します。パラメーターの構造に互換性はないため、
使用する SDK に合ったエンドポイントを選んでください。

互換性のあるリクエスト形式については [Chat Completions](./chat-completions) を、
モデル固有のフィールドと制限については [GPT モデルのリファレンス](https://www.sandbase.ai/models) を
参照してください。

## 次のステップ {#next-steps}

- [Responses API リファレンス](/api-reference/responses)
- [Chat Completions API リファレンス](/api-reference/llm-gateway)
- [Models カタログ](https://www.sandbase.ai/models)
