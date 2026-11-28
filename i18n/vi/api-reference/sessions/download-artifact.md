---
i18nSource: faccf5122e785ea0
title: Tải Session Artifact
description: Tải một artifact đã được ghi lại của Session theo ID. Tìm hiểu giới hạn tải toàn bộ file, các loại response được hỗ trợ và hành vi với Range.
aside: false
outline: false
apiReference:
  title: Tải Session Artifact
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content
  description: Tải toàn bộ một artifact bất biến bằng ID lấy từ List Session Artifacts. Hỗ trợ file tối đa 200 MiB. Không chấp nhận tham số query; request có Range trả về 416 sau khi kiểm tra quyền truy cập.
  groups:
    - title: Tham số đường dẫn
      fields:
        - name: session_id
          type: string
          required: true
          description: ID của Session (tiền tố ses_).
        - name: artifact_id
          type: string
          required: true
          description: ID art_ không cần diễn giải, chính xác như được trả về từ danh sách artifact của Session này. Không chấp nhận ID attachment và đường dẫn workspace.
    - title: Header của response
      fields:
        - name: Content-Type
          type: string
          required: true
          description: Media type suy ra từ phần mở rộng file, hoặc application/octet-stream.
        - name: Content-Disposition
          type: string
          required: true
          description: attachment kèm tên file của artifact.
        - name: Content-Length
          type: integer
          required: true
          description: Kích thước toàn bộ file tính bằng byte.
        - name: Cache-Control
          type: string
          required: true
          description: no-store.
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

Response thành công là các byte của file, không phải JSON. Hãy tải toàn bộ file; không hỗ trợ tải từng phần hay tải tiếp bằng Range. Artifact không khả dụng sẽ trả về `404`; dịch vụ artifact không khả dụng sẽ trả về `executor_unavailable`.
