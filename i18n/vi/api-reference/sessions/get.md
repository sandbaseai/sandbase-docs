---
i18nSource: be0b17847a19a11c
title: Lấy Session
description: Đọc một Session.
aside: false
outline: false
apiReference:
  title: Lấy Session
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}
  description: Đọc một Session. Trạng thái thực thi được đọc trực tiếp theo thời gian thực, vì vậy hãy poll endpoint này hoặc dùng luồng sự kiện để theo dõi tiến độ.
  groups:
    - title: Tham số đường dẫn
      fields:
        - name: session_id
          type: string
          required: true
          description: ID của Session (tiền tố ses_).
    - title: Đối tượng Session
      description: Được trả về bởi create, get, update, rename, archive và unarchive.
      fields:
        - name: id
          type: string
          required: true
          description: ID của Session với tiền tố ses_.
        - name: status
          type: string
          required: true
          description: "Trạng thái thực thi: idle, in_progress hoặc failed. requires_action chưa được hỗ trợ và sẽ xuất hiện dưới dạng 502 executor_contract_error."
        - name: lifecycle_status
          type: string
          required: true
          description: active hoặc archived. Session đã lưu trữ sẽ từ chối input.
        - name: failure
          type: object · null
          required: true
          description: Lỗi công khai với code, message, action và retryable tùy chọn.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: Phiên bản Agent đã cố định và model có hiệu lực.
        - name: agent · usage
          type: object · object | null
          required: true
          description: Bản chụp theo định dạng OpenAI của cấu hình Agent có hiệu lực, cùng mức sử dụng token (null cho đến khi một turn báo cáo mức sử dụng).
        - name: source · source_id
          type: string · null
          required: false
          description: Nguồn gốc của Session. Session được tạo bằng POST /v1/agents/sessions báo cáo direct và source_id là null.
        - name: row_version
          type: integer
          required: true
          description: Token compare-and-set cho rename, archive và unarchive.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83 \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        session = client.beta.agents.sessions.retrieve("ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83")
        print(session.status, session.failure)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "GET",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
          },
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
        "object": "agent.session",
        "agent": {
          "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
          "name": "Research assistant",
          "model": "deepseek/deepseek-v4-flash",
          "instructions": "Answer with cited sources.",
          "multi_agent": {"enabled": false, "max_concurrent_subagents": null},
          "reasoning": {"effort": null, "summary": null},
          "service_tier": "auto",
          "text": {"format": {"type": "text"}, "verbosity": "medium"},
          "tools": []
        },
        "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "agent_version": 1,
        "title": "Market scan",
        "model": "deepseek/deepseek-v4-flash",
        "environment": {
          "id": "env_…",
          "type": "openai_hosted",
          "capability_directories": [],
          "files": [],
          "network": {"access": "enabled", "allowed_domains": []},
          "packages": {"npm": [], "python": [], "system": []},
          "plugins": [],
          "skills": []
        },
        "metadata": {},
        "status": "in_progress",
        "lifecycle_status": "active",
        "sync_status": "ready",
        "execution_status": "in_progress",
        "failure": null,
        "row_version": 1,
        "required_actions": [],
        "vault_ids": [],
        "usage": null,
        "created_at": 1791273600,
        "last_active_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null,
        "source": "direct",
        "source_id": null
      }
---

<ApiReferencePage />
