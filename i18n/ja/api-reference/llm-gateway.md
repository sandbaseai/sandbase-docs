---
i18nSource: 9ee3d6d77d12e944
title: Chat Completions API
description: SandBase の言語モデルとビジョンモデルで、OpenAI 互換のチャット補完を作成します。
aside: false
outline: false
apiReference:
  title: チャット補完の作成
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: 対応している任意の SandBase チャットモデルで、OpenAI 互換のチャット補完を作成します。選択したルートが対応していれば、プロバイダー互換のフィールドは保持されます。
  signature: client.chat.completions.create(params)
  groups:
    - title: リクエストボディ
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Models API のモデル識別子。
        - name: messages
          type: object[]
          required: true
          description: 選択したプロバイダーが対応するロールを使った会話メッセージ。一般的には system、developer、user、assistant、tool です。
        - name: temperature
          type: number
          required: false
          default: "1"
          description: サンプリング温度（0〜2）。
        - name: top_p
          type: number
          required: false
          default: "1"
          description: Nucleus サンプリングのしきい値。
        - name: max_tokens
          type: integer
          required: false
          description: 出力トークンの最大数。
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: 増分の Server-Sent Events を返します。
        - name: stop
          type: string | string[]
          required: false
          description: 生成を停止するシーケンス（1 つまたは複数）。
        - name: tools
          type: object[]
          required: false
          description: モデルが利用できる関数定義。
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: ツールを選択するかどうか、およびどのツールを選択するかを制御します。
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: 対応モデルが 1 回のターンで複数のツール呼び出しを出力できるようにします。
        - name: user
          type: string
          required: false
          description: プロバイダー互換のエンドユーザー識別子。
        - name: response_format
          type: object
          required: false
          description: JSON オブジェクトまたは JSON Schema の出力設定。
        - name: reasoning_effort
          type: string
          required: false
          description: プロバイダー互換の推論 effort 設定。
        - name: reasoning
          type: object
          required: false
          description: 推論の設定（effort や max_tokens など）。
        - name: thinking
          type: object
          required: false
          description: 思考の設定（type や budget_tokens など）。
        - name: extra_body
          type: object
          required: false
          description: プロトコル変換が必要なルート向けのプロバイダー固有パラメータ。
        - name: n
          type: integer
          required: false
          default: "1"
          description: 生成する補完候補の数。
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: Presence penalty（-2〜2）。
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: Frequency penalty（-2〜2）。
        - name: stream_options
          type: object
          required: false
          description: ストリーミングのオプション（include_usage など）。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/chat/completions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"deepseek/deepseek-v4-flash","messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(response.choices[0].message.content)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.chat.completions.create({
          model: "deepseek/deepseek-v4-flash",
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(response.choices[0].message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "chatcmpl_01...",
        "object": "chat.completion",
        "model": "deepseek/deepseek-v4-flash",
        "choices": [{
          "index": 0,
          "message": { "role": "assistant", "content": "Hello! How can I help?" },
          "finish_reason": "stop"
        }],
        "usage": { "prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15 }
      }
  notes:
    - title: ストリーミングとツール
      description: "SSE を使うには stream を true に設定します。ストリームは data: [DONE] で終了します。最後に usage チャンクを受け取るには stream_options.include_usage を追加します。ツール呼び出しとマルチモーダルコンテンツは OpenAI 互換のスキーマに従います。"
    - title: プロバイダー互換性
      description: SandBase は、同一プロトコルのルートでは追加の互換フィールドを保持します。プロトコルをまたぐ場合やプロバイダー固有のフィールドへの対応状況は異なるため、該当する場合は extra_body を使用してください。
  errors:
    - status: "400"
      description: 無効なリクエストボディ、または未対応のパラメータ。
    - status: "401"
      description: API キーがないか無効です。
    - status: "402"
      description: 組織の利用上限に達しました。
    - status: "404"
      description: モデルが見つからないか、利用できません。
    - status: "429"
      description: レート制限を超えました。
    - status: "500"
      description: リクエストの永続化または組織の検索に失敗しました。
    - status: "502"
      description: 選択したプロバイダーが無効なレスポンスを返しました。
    - status: "503"
      description: 成功したプロバイダールートがありません。
---

<ApiReferencePage />
