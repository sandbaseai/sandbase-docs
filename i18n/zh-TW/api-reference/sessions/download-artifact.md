---
i18nSource: faccf5122e785ea0
title: 下載 Session 成品
description: 依 ID 下載已擷取的 Session 成品。了解完整檔案下載的大小上限、支援的回應類型與 Range 行為。
aside: false
outline: false
apiReference:
  title: 下載 Session 成品
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: 使用 List Session Artifacts 傳回的 ID 下載完整且不可變的成品。支援最大 200 MiB 的檔案。不接受任何查詢參數；Range 請求會在存取驗證後傳回 416。
  groups:
    - title: 路徑參數
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前綴）。
        - name: artifact_id
          type: string
          required: true
          description: 此 Session 成品清單所傳回的確切不透明 art_ ID。不接受附件 ID 與工作區路徑。
    - title: 回應標頭
      fields:
        - name: Content-Type
          type: string
          required: true
          description: 依副檔名推斷的媒體類型，或 application/octet-stream。
        - name: Content-Disposition
          type: string
          required: true
          description: attachment，並帶有成品的檔名。
        - name: Content-Length
          type: integer
          required: true
          description: 完整檔案大小（位元組）。
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

成功的回應是檔案的位元組內容，而不是 JSON。請下載完整檔案；不支援部分傳輸與可續傳的 Range 下載。無法取得的成品會傳回 `404`；成品服務無法使用時會傳回 `executor_unavailable`。
