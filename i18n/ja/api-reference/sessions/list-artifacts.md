---
i18nSource: 270917aea416aa76
title: Session アーティファクトの一覧表示
description: 取得済みの Session 出力アーティファクトを、カーソルページネーション、不透明な ID、ファイルサイズ、ダウンロードリンクとともに一覧表示します。
aside: false
outline: false
apiReference:
  title: Session アーティファクトの一覧表示
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts
  description: この Session で生成された変更不可の出力を一覧表示します。アーティファクト ID は Session スコープの不透明なハンドルです。返された ID をそのままダウンロードエンドポイントに渡してください。不明なクエリパラメーターや重複したクエリパラメーターは 400 を返します。
  groups:
    - title: パスパラメーター
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ プレフィックス）。
    - title: クエリパラメーター
      fields:
        - name: limit
          type: integer
          required: false
          description: ページサイズ（1〜100）。無効な値は 400 を返します。
          default: "20"
        - name: order
          type: string
          required: false
          description: asc または desc。
          default: desc
        - name: after
          type: string
          required: false
          description: 前のページで last_id として返されたアーティファクト ID。続きを取得するときは同じ order を維持してください。
    - title: Artifact オブジェクト
      fields:
        - name: object
          type: string
          required: true
          description: 常に agent.session.artifact。
        - name: id
          type: string
          required: true
          description: 不透明な art_ ハンドル。組み立てたりデコードしたりしないでください。
        - name: session_id
          type: string
          required: true
          description: 所有する Session の ID。
        - name: path
          type: string
          required: true
          description: /workspace/outputs/ 配下の生成された出力のパス。
        - name: size_bytes
          type: integer
          required: true
          description: アーティファクトのサイズ（バイト）。
        - name: created_at
          type: integer
          required: true
          description: 作成日時（Unix 秒）。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/artifacts', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "list",
        "data": [
          {
            "object": "agent.session.artifact",
            "id": "art_example_handle",
            "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            "path": "/workspace/outputs/report.md",
            "size_bytes": 1024,
            "created_at": 1791273600
          }
        ],
        "has_more": false,
        "first_id": "art_example_handle",
        "last_id": "art_example_handle"
      }
---

<ApiReferencePage />

例のハンドルは説明用です。[アーティファクトのダウンロード](./download-artifact) には、自分のリクエストで返された `id` を使用してください。`has_more` が true の場合は、`after=last_id` を送信して次のページを取得します。リストが空の場合、`first_id` と `last_id` は null です。アーティファクトのメタデータを取得する個別の GET エンドポイントは公開されていません。
