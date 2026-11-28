---
i18nSource: 06feb27e20f1b7f5
title: アカウント履歴の一覧取得
description: API キーの組織における最近の実行記録を一覧表示します。
aside: false
outline: false
apiReference:
  title: アカウント履歴の一覧取得
  operation: Account
  method: GET
  path: /v1/account/history
  description: 組織単位の最近の実行記録を新しい順に一覧表示します。エラーメッセージはサニタイズされ、デコードできない保存済み JSON スナップショットは省略されます。
  groups:
    - title: クエリパラメータ
      fields:
        - name: model
          type: string
          required: false
          description: 完全一致の論理モデル名。
        - name: api_key_id
          type: string
          required: false
          description: 完全一致の API Key リソース ID。
        - name: type
          type: multimodal | llm | api
          required: false
          description: 実行カテゴリ。multimodal には image、video、audio が含まれます。
        - name: status
          type: completed | failure | in_progress
          required: false
          description: グループ化された実行ステータス。
        - name: error_type
          type: string
          required: false
          description: 完全一致のエラータイプ。エラータイプのない記録には unknown を指定します。
        - name: range
          type: 1h | 24h | 7d | 30d
          required: false
          description: 作成日時の相対期間。デフォルトは 7d です。
        - name: page
          type: integer
          required: false
          description: ページ番号（1 から開始）。
        - name: page_size
          type: integer
          required: false
          description: 1 ページあたりの件数（1〜100）。デフォルトは 20 です。
        - name: request_id
          type: string
          required: false
          description: 組織単位の完全一致の実行 ID。指定すると他のフィルターは無視され、1 件の結果が要求されます。
        - name: time_basis
          type: created_at | settled_at
          required: false
          description: 明示的な期間に使うタイムスタンプの基準。
        - name: billing_scope
          type: any | positive | token
          required: false
          description: 精算フィルター。positive と token には time_basis=settled_at が必要です。
        - name: start_at
          type: RFC 3339 timestamp
          required: false
          description: 期間の開始（この値を含む）。end_at と組み合わせて指定します。
        - name: end_at
          type: RFC 3339 timestamp
          required: false
          description: 期間の終了（この値を含まない）。期間は 32 日を超えられません。
        - name: latency_sample
          type: positive | terminal_positive
          required: false
          description: レイテンシのサンプルを正の値に限定します。
        - name: min_latency_ms
          type: integer
          required: false
          description: 最小レイテンシ（ミリ秒）。
        - name: timezone
          type: IANA time-zone name
          required: false
          description: 互換性のための検証のみに使われます。タイムスタンプは UTC のままで、request_id による完全一致の検索ではこのパラメータは無視されます。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl "https://api.sandbase.ai/v1/account/history?range=24h&page_size=20" \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
  response:
    status: 200 OK
    code: |-
      {
        "items": [
          {
            "id": "opaque-task-id",
            "model": "openai/gpt-5.4",
            "type": "llm",
            "execution_mode": "sync",
            "status": "completed",
            "latency_ms": 842,
            "user_cost": "0.001250",
            "prompt_tokens": 120,
            "completion_tokens": 48,
            "total_tokens": 168,
            "cached_tokens": 0,
            "cache_creation_tokens": 0,
            "created_at": "2026-08-24T00:00:00Z",
            "completed_at": "2026-08-24T00:00:01Z",
            "api_key_prefix": "sk-1234567"
          }
        ],
        "total": 1,
        "page": 1,
        "page_size": 20
      }
---

<ApiReferencePage />
