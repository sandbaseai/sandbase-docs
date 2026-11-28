---
i18nSource: 06a65ded83bf9438
title: ワークスペースファイルの一覧
description: Session ワークスペースの現在のファイルを、パス、サイズ、ページネーション付きで一覧表示します。この読み取り専用エンドポイントはファイルのメタデータを返します。
aside: false
outline: false
apiReference:
  title: ワークスペースファイルの一覧
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/workspace-files
  description: 1 つの Session ワークスペースディレクトリにある現在のファイルパスとサイズを一覧表示します。これはメタデータのみの一覧であり、添付ファイルの履歴や成果物の内容ではありません。不明なクエリパラメーターや重複したクエリパラメーターは 400 を返します。
  groups:
    - title: パスパラメーター
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ プレフィックス）。
    - title: クエリパラメーター
      fields:
        - name: path
          type: string
          required: false
          description: 絶対ディレクトリ /workspace、またはその配下の正規化されたディレクトリ。最大 4096 バイト。ディレクトリトラバーサル、バックスラッシュ、末尾のスラッシュは使用できません。
          default: /workspace
        - name: limit
          type: integer
          required: false
          description: ページサイズ（1～100）。
          default: "20"
        - name: order
          type: string
          required: false
          description: "パスの並び順: asc または desc。"
          default: asc
        - name: page
          type: string
          required: false
          description: 前のレスポンスで返された不透明な next の値。最初のページでは省略し、空文字列は送信しないでください。path、order、limit は変更しないでください。
    - title: レスポンスフィールド
      fields:
        - name: object
          type: string
          required: true
          description: 常に page。
        - name: data
          type: array
          required: true
          description: 現在のディレクトリのファイル。それぞれ path と size_bytes を持ちます。再帰的な一覧ではありません。
        - name: next
          type: string | null
          required: true
          description: 続きを取得するには、この値を page として渡します。最後のページでは null です。
        - name: has_more
          type: boolean
          required: true
          description: 次のページがあるかどうか。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl --fail-with-body 'https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files' \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python
      language: python
      code: |-
        import os
        import requests

        response = requests.get(
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/workspace-files', {
          headers: { Authorization: `Bearer ${process.env.SANDBASE_API_KEY}` },
        });
        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "page",
        "data": [
          {
            "path": "/workspace/notes.md",
            "size_bytes": 1024
          }
        ],
        "next": null,
        "has_more": false
      }
---

<ApiReferencePage />

ワークスペースの読み取りでは、`workspace_provisioning`、`workspace_environment_missing`、`workspace_cursor_invalid`、`workspace_unavailable` が返されることがあります。カーソルが無効な場合は、最初のページからやり直してください。ダウンロード可能な生成物を探すには [Artifacts](./list-artifacts) を使ってください。
