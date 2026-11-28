---
i18nSource: faccf5122e785ea0
title: Session アーティファクトのダウンロード
description: ID を指定して、取得済みの Session アーティファクトをダウンロードします。ファイル全体のダウンロード上限、サポートされるレスポンスタイプ、Range の動作について説明します。
aside: false
outline: false
apiReference:
  title: Session アーティファクトのダウンロード
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: List Session Artifacts で取得した ID を使って、変更不可のアーティファクト全体をダウンロードします。最大 200 MiB のファイルに対応しています。クエリパラメーターは受け付けず、Range リクエストはアクセス検証の後に 416 を返します。
  groups:
    - title: パスパラメーター
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ プレフィックス）。
        - name: artifact_id
          type: string
          required: true
          description: この Session のアーティファクト一覧が返した、不透明な art_ ID そのもの。添付 ID やワークスペースのパスは受け付けません。
    - title: レスポンスヘッダー
      fields:
        - name: Content-Type
          type: string
          required: true
          description: ファイル拡張子から推定されたメディアタイプ、または application/octet-stream。
        - name: Content-Disposition
          type: string
          required: true
          description: アーティファクトのファイル名付きの attachment。
        - name: Content-Length
          type: integer
          required: true
          description: ファイル全体のサイズ（バイト）。
        - name: Cache-Control
          type: string
          required: true
          description: no-store。
  examples:
    - label: cURL
      language: bash
      code: |-
        # Set SESSION_ID and ARTIFACT_ID from your Session and artifact list.
        curl --fail-with-body "https://api.sandbase.ai/v1/agents/sessions/${SESSION_ID}/artifacts/${ARTIFACT_ID}/content" \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          --output report.md
    - label: Python
      language: python
      code: |-
        import os
        from pathlib import Path
        import requests

        # Use IDs returned by your own Session and artifact list.
        session_id = os.environ["SESSION_ID"]
        artifact_id = os.environ["ARTIFACT_ID"]
        response = requests.get(
            f"https://api.sandbase.ai/v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content",
            headers={"Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}"},
        )
        response.raise_for_status()
        Path("report.md").write_bytes(response.content)
    - label: TypeScript
      language: typescript
      code: |-
        import { writeFile } from 'node:fs/promises';

        const { SESSION_ID, ARTIFACT_ID, SANDBASE_API_KEY } = process.env;
        if (!SESSION_ID || !ARTIFACT_ID || !SANDBASE_API_KEY) throw new Error('Missing configuration');
        const response = await fetch(
          `https://api.sandbase.ai/v1/agents/sessions/${encodeURIComponent(SESSION_ID)}/artifacts/${encodeURIComponent(ARTIFACT_ID)}/content`,
          { headers: { Authorization: `Bearer ${SANDBASE_API_KEY}` } },
        );
        if (!response.ok) throw new Error(await response.text());
        await writeFile('report.md', new Uint8Array(await response.arrayBuffer()));
---

<ApiReferencePage />

成功時のレスポンスは JSON ではなく、ファイルのバイト列です。ファイル全体をダウンロードしてください。部分転送や、Range による再開可能なダウンロードはサポートされていません。アーティファクトが利用できない場合は `404` を返し、アーティファクトサービスが利用できない場合は `executor_unavailable` を返します。
