---
i18nSource: 1b680f7f0804feb7
title: Cập nhật Agent
description: Cập nhật một phần Agent bằng lệnh cập nhật POST theo kiểu OpenAI SDK.
aside: false
outline: false
apiReference:
  title: Cập nhật Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: Cập nhật một phần theo kiểu SDK. Các trường được cung cấp sẽ thay thế giá trị đã lưu và tạo phiên bản mới; các trường bị bỏ qua giữ nguyên giá trị. Không cần row_version. Ở đây không chấp nhận description và note; hãy dùng Replace (PATCH) cho chúng. Agent đã lưu trữ trả về 404.
  groups:
    - title: Tham số đường dẫn
      fields:
        - name: agent_id
          type: string
          required: true
          description: ID của Agent (tiền tố agt_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Tùy chọn. Nếu bỏ qua, dịch vụ sẽ tự tạo một key, nên request thử lại có thể tạo bản trùng lặp. Hãy gửi key ổn định của riêng bạn khi thử lại.
    - title: Body của request
      description: Bất kỳ tập con nào của các trường này. Trường khác trả về 400.
      fields:
        - name: model
          type: string
          required: false
          description: Model ID từ Models API, tối đa 200 ký tự.
        - name: name
          type: string
          required: false
          description: Tên hiển thị, tối đa 128 ký tự.
        - name: instructions
          type: string
          required: false
          description: Chỉ dẫn hệ thống, tối đa 256 KiB.
        - name: runtime_profile
          type: string
          required: false
          description: "Runtime thực thi: codex (mặc định), claude hoặc mcode."
        - name: skills
          type: array
          required: false
          description: 'Tham chiếu Skill: {"skill_id": "skl_…", "version": null | "<version>"}. Tối đa 32. Với liên kết mới, null ghim phiên bản mặc định hiện tại khi Agent được lưu. Với liên kết hiện có, null giữ nguyên phiên bản đã ghim; hãy cung cấp phiên bản cụ thể để nâng cấp.'
        - name: mcp_connections
          type: array
          required: false
          description: "Tham chiếu MCP: {connection_id, server_label, allowed_tools, required}. Tối đa 32; server_label phải là duy nhất trong Agent."
        - name: tools
          type: array
          required: false
          description: Tối đa 64 công cụ function cùng nhiều nhất một công cụ web_search. Hiện tại Session yêu cầu chế độ web_search là disabled, và kết quả function phía client chưa được hỗ trợ.
        - name: text
          type: object
          required: false
          description: format.type là text hoặc json_schema (với schema dạng object); verbosity là low, medium hoặc high.
        - name: reasoning
          type: object
          required: false
          description: effort là none, minimal, low, medium, high, xhigh hoặc max; summary là concise, detailed hoặc auto.
        - name: service_tier
          type: string
          required: false
          description: auto (mặc định), default, flex, priority hoặc fast.
        - name: metadata
          type: object
          required: false
          description: Tối đa 16 cặp chuỗi; khóa tối đa 64 và giá trị tối đa 512 ký tự.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "instructions": "Answer in five bullet points with cited sources."
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.update(
            "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            instructions="Answer in five bullet points with cited sources.",
        )
        print(agent.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "instructions": "Answer in five bullet points with cited sources."
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "instructions": "Answer in five bullet points with cited sources."
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
    code: |-
      {
        "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "object": "agent",
        "name": "Research assistant",
        "model": "deepseek/deepseek-v4-flash",
        "instructions": "Answer in five bullet points with cited sources.",
        "tools": [],
        "text": {
          "format": {
            "type": "text"
          },
          "verbosity": "medium"
        },
        "reasoning": {
          "effort": null,
          "summary": null
        },
        "service_tier": "auto",
        "multi_agent": {
          "enabled": false,
          "max_concurrent_subagents": null
        },
        "visibility": "private",
        "status": "active",
        "version": 2,
        "row_version": 2,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "",
        "metadata": {
          "team": "research"
        },
        "mcp_connections": [],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
