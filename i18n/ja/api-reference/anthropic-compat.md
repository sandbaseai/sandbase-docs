---
i18nSource: 04f3657850b71e58
title: Anthropic Message の作成
description: SandBase のモデルで Anthropic 互換のメッセージを作成します。
aside: false
outline: false
apiReference:
  title: Anthropic Message の作成
  operation: Inference
  method: POST
  path: /v1/messages
  description: SandBase の Anthropic 互換 Messages エンドポイントでメッセージを作成します。SandBase は選択したプロバイダー向けにモデルをマッピングし、互換性のあるリクエストとレスポンスのフィールドを保持します。
  signature: client.messages.create(params)
  groups:
    - title: リクエストヘッダー
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "SandBase API キー。Authorization: Bearer も使用できます。両方がある場合は x-api-key が優先されます。"
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: 上流に転送される Anthropic API バージョン。省略した場合は SandBase が 2023-06-01 を指定します。
        - name: anthropic-beta
          type: string
          required: false
          description: カンマ区切りのベータ機能 ID。プロバイダーの互換性に依存します。
    - title: リクエストボディ
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Anthropic 互換のモデル ID。
        - name: messages
          type: object[]
          required: true
          description: テキストまたは型付きコンテンツブロックを含む user と assistant のメッセージ。
        - name: max_tokens
          type: integer
          required: true
          description: 出力トークンの最大数。
        - name: system
          type: string | object[]
          required: false
          description: トップレベルのシステム指示。
        - name: temperature
          type: number
          required: false
          default: "1"
          description: 0～1 のサンプリング温度。
        - name: top_p
          type: number
          required: false
          description: Nucleus サンプリングのしきい値。
        - name: top_k
          type: integer
          required: false
          description: サンプリングを上位 K 個のトークンに制限します。
        - name: stop_sequences
          type: string[]
          required: false
          description: 生成を停止するカスタムシーケンス。
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Anthropic 形式の Server-Sent Events を返します。
        - name: metadata
          type: object
          required: false
          description: リクエストのメタデータ。任意の user_id を含みます。
        - name: tools
          type: object[]
          required: false
          description: モデルが利用できるツール定義。
        - name: tool_choice
          type: object
          required: false
          description: ツール選択の動作を制御します。
        - name: thinking
          type: object
          required: false
          description: 対応モデル向けの拡張思考の設定。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/messages \
          -H "x-api-key: $SANDBASE_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "Content-Type: application/json" \
          -d '{"model":"anthropic/claude-sonnet-4","max_tokens":256,"messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from anthropic import Anthropic

        client = Anthropic(api_key="sk-sb-...", base_url="https://api.sandbase.ai")
        message = client.messages.create(
            model="anthropic/claude-sonnet-4",
            max_tokens=256,
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(message.content[0].text)
    - label: TypeScript
      language: typescript
      code: |-
        import Anthropic from "@anthropic-ai/sdk";

        const client = new Anthropic({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai" });
        const message = await client.messages.create({
          model: "anthropic/claude-sonnet-4",
          max_tokens: 256,
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "msg_01...",
        "type": "message",
        "role": "assistant",
        "model": "anthropic/claude-sonnet-4",
        "content": [{ "type": "text", "text": "Hello! How can I help?" }],
        "stop_reason": "end_turn",
        "usage": { "input_tokens": 8, "output_tokens": 7 }
      }
  notes:
    - title: 認証
      description: "x-api-key または Authorization: Bearer を使います。両方を指定した場合は x-api-key が優先されます。"
    - title: 透過的なプロトコル
      description: モデルのマッピングと設定済みのプロバイダー互換性ルールを除き、SandBase は互換性のあるリクエストフィールド、非ストリーミングのレスポンス、SSE イベントをプロトコル変換せずに転送します。
    - title: ベータ機能
      description: anthropic-beta は、指定されていれば転送されます。候補の互換性ルールにより、サポートされていないベータフィールドが削除されたり、その候補がスキップされたりすることがあります。
  errors:
    - status: "400"
      description: リクエストボディが無効か、サポートされていない機能です。
    - status: "401"
      description: API キーがないか無効です。
    - status: "402"
      description: 組織の支出上限に達しました。
    - status: "403"
      description: API Key の支出上限、または組織の権限エラーです。
    - status: "404"
      description: モデルが見つからないか、利用できません。
    - status: "413"
      description: リクエストが大きすぎるため、プロバイダーが拒否しました。
    - status: "429"
      description: プロバイダーのレート制限を超えました。
    - status: "500"
      description: 予測ライフサイクルまたはプロバイダーのエラーです。
    - status: "502"
      description: 使用可能なコンテンツが届く前に上流のストリームが終了しました。
    - status: "503"
      description: ルーティングに失敗したか、すべてのプロバイダー候補が利用できませんでした。
---

<ApiReferencePage />
