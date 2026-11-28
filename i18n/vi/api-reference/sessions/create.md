---
i18nSource: 91ce9f65766e9662
title: Tạo Session
description: Tạo Session cho một Agent đã lưu hoặc Agent inline bằng POST /v1/agents/sessions, có thể stream turn đầu tiên.
aside: false
outline: false
apiReference:
  title: Tạo Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: Tạo Session cho một phiên bản Agent đã lưu, hoặc cho một Agent inline được định nghĩa trong request. Cấu hình Agent, phiên bản Skill và kết nối MCP được cố định trong suốt vòng đời của Session. Session luôn chạy trên cloud do SandBase lưu trữ, nên bạn không cần chọn môi trường thực thi. Với stream=true và có input ban đầu, phản hồi là một luồng Server-Sent Events 201 của turn đầu tiên thay vì Session dạng JSON. Điều kiện cho phép thực thi (số dư và trạng thái tổ chức) được kiểm tra tại đây. OpenAI SDK yêu cầu tham số environment; xem Tương thích OpenAI (/agents/openai-compatibility).
  groups:
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Tùy chọn. Nếu bỏ qua, dịch vụ sẽ tự tạo một key, nên request thử lại có thể tạo bản trùng lặp. Hãy gửi key ổn định của riêng bạn khi thử lại.
    - title: Body của request
      description: Đối tượng JSON nghiêm ngặt.
      fields:
        - name: agent_id
          type: string
          required: false
          description: ID của Agent đã lưu (tiền tố agt_). Agent phải ở trạng thái active với projection_status là ready. Gửi agent_id, agent hoặc cả hai.
        - name: agent
          type: object
          required: false
          description: Cấu hình Agent. Các trường được chấp nhận là model, instructions, runtime_profile (codex, claude hoặc mcode; mặc định codex), service_tier, tools, text, reasoning và multi_agent, được kiểm tra như trong Create Agent. Khi không có agent_id, nó định nghĩa một Agent inline và bắt buộc có model; Agent inline không mang Skill hay kết nối MCP. Khi có agent_id, mỗi trường bạn gửi sẽ thay thế trường đó của phiên bản đã lưu, chỉ cho Session này. Trường không xác định trả về 400.
        - name: version
          type: integer
          required: false
          description: Phiên bản Agent. Mặc định là phiên bản hiện tại. Không được dùng với Agent inline.
        - name: title
          type: string
          required: false
          description: Tiêu đề Session.
        - name: input
          type: string | array
          required: false
          description: 'Input đầu tiên tùy chọn: một chuỗi, hoặc một mảng có đúng một message, ví dụ [{"role":"user","content":[{"type":"input_text","text":"…"}]}]. Một object đơn lẻ trả về 400.'
        - name: model
          type: string
          required: false
          description: Ghi đè model. agent.model là dạng của OpenAI SDK; khi gửi cả hai, chúng phải khớp nhau.
        - name: metadata
          type: object
          required: false
          description: Tối đa 16 cặp chuỗi.
        - name: stream
          type: boolean
          required: false
          description: "Khi là true, yêu cầu input không rỗng và trả về 201 với body text/event-stream. Sự kiện dùng định dạng Stream events (event: <type>, data: <json>); sự kiện đầu tiên, agent.session.created, mang snapshot của Session, theo sau là các sự kiện item và output của turn. Lỗi kiểm tra, lỗi điều kiện thực thi và các lỗi khác trước khi luồng bắt đầu trả về lỗi JSON thông thường. Mặc định false."
        - name: environment
          type: object
          required: false
          description: Chỉ để tương thích OpenAI SDK. Hãy bỏ qua trong lệnh gọi HTTP trực tiếp; {"type":"openai_hosted"} được chấp nhận và mọi type khác trả về 400.
        - name: model_provider
          type: object
          required: false
          description: Thông tin xác thực model. Bỏ qua để dùng API key đang gọi. {"type":"custom","base_url":"https://…","api_key":"…"} gọi endpoint tương thích OpenAI của riêng bạn. Chỉ ghi.
        - name: github_workspace
          type: object
          required: false
          description: 'Repository GitHub cần clone vào /workspace cho Session này: {"repository_id":"1195090324","ref":"main","connection_id":"plc_…"}. Chỉ repository_id là bắt buộc; ref mặc định là nhánh mặc định. Bỏ qua hoặc null sẽ dùng repository workspace của Agent nếu có, nếu không thì không clone gì. Repository phải nằm trong phạm vi kết nối GitHub của Agent. Xem Workspace repository GitHub (/agents/github-workspace).'
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
        curl -X POST https://api.sandbase.ai/v1/agents/sessions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-2026-10-06" \
          -H "Content-Type: application/json" \
          -d '{
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "title": "Market scan"
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        session = client.beta.agents.sessions.create(
            agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
        )
        print(session.id, session.status)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-2026-10-06",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions",
            headers=headers,
            json={
                "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
                "title": "Market scan",
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-2026-10-06',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "title": "Market scan"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
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
        "status": "idle",
        "lifecycle_status": "active",
        "sync_status": "ready",
        "execution_status": "idle",
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
