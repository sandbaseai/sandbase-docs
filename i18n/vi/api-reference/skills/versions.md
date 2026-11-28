---
i18nSource: 096e3c57e599c5ca
title: Tải lên phiên bản Skill
description: Tải lên một phiên bản Skill mới.
aside: false
outline: false
apiReference:
  title: Tải lên phiên bản Skill
  operation: Skills
  method: POST
  path: /v1/skills/{skill_id}/versions
  description: Tải lên gói ZIP mới làm phiên bản tiếp theo (200 OK). Cấu trúc ZIP giống như Create Skill (một thư mục cấp cao nhất chứa SKILL.md). Gửi default=true để đặt nó làm phiên bản mặc định. Liệt kê phiên bản bằng GET /v1/skills/{skill_id}/versions, đọc một phiên bản bằng GET /v1/skills/{skill_id}/versions/{version} và tải xuống bằng GET /v1/skills/{skill_id}/versions/{version}/content. Định danh phiên bản là chuỗi.
  groups:
    - title: Tham số đường dẫn
      fields:
        - name: skill_id
          type: string
          required: true
          description: ID của Skill (tiền tố skl_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Tùy chọn, 1-128 byte, không có khoảng trắng ở đầu hoặc cuối. Nếu bỏ qua, dịch vụ sẽ tự tạo một key, nên request thử lại có thể tạo bản trùng lặp. Hãy gửi key ổn định của riêng bạn khi thử lại.
    - title: Body của request
      description: multipart/form-data.
      fields:
        - name: files
          type: file
          required: true
          description: File nén ZIP, tối đa 5 MiB.
        - name: default
          type: string
          required: false
          description: true đặt phiên bản này làm mặc định cho các lần gắn sau; false hoặc bỏ qua thì giữ nguyên mặc định hiện tại. Các liên kết Agent hiện có không thay đổi.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: release-notes-v2" \
          -F "files=@release-notes-v2.zip;type=application/zip" \
          -F "default=true"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        with open("release-notes-v2.zip", "rb") as bundle:
            version = client.skills.versions.create(
                "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
                files=[("release-notes-v2.zip", bundle.read(), "application/zip")],
                default=True,
            )
        print(version.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "release-notes-v2",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions",
            headers=headers,
            files={"files": open("release-notes-v2.zip", "rb")},
            data={"default": "true"},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        import { readFile } from 'node:fs/promises';

        const form = new FormData();
        form.append('files', new Blob([await readFile('release-notes-v2.zip')], { type: 'application/zip' }), 'release-notes-v2.zip');
        form.append('default', 'true');

        const response = await fetch('https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'release-notes-v2',
          },
          body: form,
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "object": "skill.version",
        "id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57:2",
        "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57",
        "version": "2",
        "name": "release-notes",
        "description": "Draft release notes from merged changes.",
        "created_at": 1791360000
      }
---

<ApiReferencePage />

## Liệt kê và tải xuống phiên bản {#list-and-download-versions}

`GET /v1/skills/{skill_id}/versions` nhận `limit` (0-100, mặc định 20), `order` (`asc` hoặc `desc`, mặc định `desc`) và `after`. Response chứa `object: "list"`, `data`, `has_more`, `first_id` và `last_id`. Truyền nguyên `last_id` làm `after` tiếp theo; đây là ID phiên bản có tiền tố Skill, không phải số phiên bản đơn thuần.

`GET /v1/skills/{skill_id}/versions/{version}` trả về một đối tượng phiên bản. Endpoint `/content` tương ứng trả về dữ liệu byte của file ZIP; xem [ví dụ tải xuống](./#download-a-bundle).
