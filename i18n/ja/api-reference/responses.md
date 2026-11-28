---
i18nSource: b5cf676d897d17a3
title: レスポンスの作成
description: ストリーミングやツールを使うリクエストを含め、OpenAI 互換のモデルレスポンスを作成します。
aside: false
outline: false
apiReference:
  title: レスポンスの作成
  operation: Inference
  method: POST
  path: /v1/responses
  description: OpenAI 互換のモデルレスポンスを作成します。SandBase はモデルのマッピング後もリクエストフィールドを維持し、レスポンスを公開されている OpenAI のフィールドにサニタイズします。
  signature: client.responses.create(params)
  groups:
    - title: リクエストボディ
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Models API のモデル識別子。
        - name: input
          type: string | object[]
          required: false
          description: テキスト、メッセージ項目、または選択したモデルとプロバイダーがサポートするその他の入力。
        - name: instructions
          type: string
          required: false
          description: レスポンスに対するシステムまたは開発者の指示。
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: OpenAI 互換の Server-Sent Events を返します。
        - name: background
          type: boolean
          required: false
          description: 選択したプロバイダーがサポートしている場合に、バックグラウンド実行を要求します。
        - name: include
          type: string[]
          required: false
          description: サポートされている場合に含める追加の公開レスポンスデータ。
        - name: max_output_tokens
          type: integer
          required: false
          description: 生成する最大トークン数。
        - name: max_tool_calls
          type: integer
          required: false
          description: サポートされている場合の組み込みツール呼び出しの最大回数。
        - name: metadata
          type: object
          required: false
          description: プロバイダーに転送されるリクエストのメタデータ。
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: サポートされているモデルにツールの並列呼び出しを許可します。
        - name: previous_response_id
          type: string
          required: false
          description: 選択したルートがサポートしている場合に続行する、前のレスポンス。
        - name: reasoning
          type: object
          required: false
          description: サポートされているモデル向けの推論設定。
        - name: store
          type: boolean
          required: false
          description: サポートされている場合に、プロバイダー側でのレスポンスの保存を要求します。
        - name: text
          type: object
          required: false
          description: テキスト出力と構造化形式の設定。
        - name: tool_choice
          type: string | object
          required: false
          description: ツールの選択を制御します。
        - name: tools
          type: object[]
          required: false
          description: モデルが利用できるツール。
        - name: truncation
          type: string
          required: false
          description: 入力の切り詰め動作。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/responses \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-5.2","input":"Explain immutable infrastructure in one sentence."}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.responses.create(
            model="openai/gpt-5.2",
            input="Explain immutable infrastructure in one sentence.",
        )
        print(response.output_text)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.responses.create({
          model: "openai/gpt-5.2",
          input: "Explain immutable infrastructure in one sentence.",
        });
        console.log(response.output_text);
  response:
    status: 200 OK
    code: |-
      {
        "id": "resp_01...",
        "object": "response",
        "status": "completed",
        "model": "openai/gpt-5.2",
        "output": [],
        "usage": {
          "input_tokens": 18,
          "output_tokens": 12,
          "total_tokens": 30,
          "input_tokens_details": {"cached_tokens": 0},
          "output_tokens_details": {"reasoning_tokens": 0}
        }
      }
  notes:
    - title: リクエストの互換性
      description: SandBase は model を選択された上流モデルに書き換え、その他のリクエストフィールドは維持します。サポート状況はプロバイダーによって異なります。
    - title: サニタイズされたレスポンス
      description: 公開されている OpenAI のレスポンスフィールドとトークン使用量のみが返されます。プロバイダーの請求、アカウント、ルーティング情報と、不明なトップレベルの拡張は削除されます。出力項目の内容は維持されます。
    - title: ストリーミング
      description: 公開されている response.* と error の SSE イベントはサニタイズされて転送されます。不明な非公開イベントは破棄されます。不正な形式のデータを受け取った場合は、安全でない内容を転送せずにストリームを閉じます。
  errors:
    - status: "400"
      description: JSON が無効、model がない、またはプロバイダーへのリクエストが無効です。
    - status: "401"
      description: API キーがない、または無効です。
    - status: "402"
      description: 組織または API キーの利用上限に達しました。
    - status: "403"
      description: API キーのスコープ、または上流の権限によって拒否されました。
    - status: "413"
      description: 上流のプロバイダーが、リクエストが大きすぎるとして拒否しました。
    - status: "500"
      description: 予測のライフサイクル処理、または組織の参照に失敗しました。
    - status: "502"
      description: 上流のレスポンスを安全に解析・サニタイズできませんでした。
    - status: "503"
      description: ルーティングに失敗したか、すべてのプロバイダー候補を使い切りました。
---

<ApiReferencePage />
