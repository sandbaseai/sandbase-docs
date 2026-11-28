---
i18nSource: f3150233afd08b90
title: Tạo Agent
description: Tạo một Agent được lưu và quản lý phiên bản bằng POST /v1/agents.
aside: false
outline: false
apiReference:
  title: Tạo Agent
  operation: Agents
  method: POST
  path: /v1/agents
  description: "Tạo một Agent được lưu ở phiên bản 1. Body là JSON nghiêm ngặt: trường không xác định trả về 400. multi_agent phải được bỏ qua hoặc là null."
  groups:
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Tùy chọn. Nếu bỏ qua, dịch vụ sẽ tự tạo một key, nên request thử lại có thể tạo bản trùng lặp. Hãy gửi key ổn định của riêng bạn khi thử lại.
    - title: Body của request
      description: Đối tượng JSON.
      fields:
        - name: model
          type: string
          required: true
          description: Bắt buộc. ID model lấy từ Models API, tối đa 200 ký tự. Không có giá trị mặc định; bỏ qua model sẽ trả về 400. Các ví dụ dùng deepseek/deepseek-v4-flash.
        - name: name
          type: string
          required: false
          description: Tên hiển thị, tối đa 128 ký tự.
        - name: instructions
          type: string
          required: false
          description: System instructions, tối đa 256 KiB.
        - name: runtime_profile
          type: string
          required: false
          description: "Runtime thực thi: codex (mặc định), claude hoặc mcode."
        - name: skills
          type: array
          required: false
          description: 'Tham chiếu Skill: {"skill_id": "skl_…", "version": null | "<version>"}. Tối đa 32. Với liên kết mới, null sẽ ghim phiên bản mặc định hiện tại khi Agent được lưu. Với liên kết đã có, null giữ nguyên phiên bản đã ghim; hãy truyền phiên bản cụ thể để nâng cấp.'
        - name: mcp_connections
          type: array
          required: false
          description: 'Tham chiếu MCP: {connection_id, server_label, allowed_tools, required}. Tối đa 32; server_label phải là duy nhất trong Agent. Bỏ qua để dùng các công cụ SandBase tích hợp sẵn ({"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin"}); danh sách bạn gửi sẽ thay thế mặc định đó, và [] tạo Agent không có công cụ. Xem Công cụ SandBase tích hợp sẵn (/agents/mcp-tools#built-in-sandbase-tools).'
        - name: tools
          type: array
          required: false
          description: Tối đa 64 function tool cộng với tối đa một công cụ web_search. Session hiện yêu cầu tắt chế độ web_search, và chưa hỗ trợ kết quả function từ phía client.
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
          description: Tối đa 16 cặp chuỗi; key tối đa 64 ký tự và value tối đa 512 ký tự.
        - name: description
          type: string
          required: false
          description: Mô tả dài hơn, tối đa 4096 ký tự.
        - name: note
          type: string
          required: false
          description: Ghi chú thay đổi được lưu ở phiên bản 1.
    - title: Đối tượng Agent
      description: Được trả về bởi create, get, update, archive, unarchive, restore và clone.
      fields:
        - name: id
          type: string
          required: true
          description: ID của Agent với tiền tố agt_.
        - name: object
          type: string
          required: true
          description: Luôn là agent.
        - name: version
          type: integer
          required: true
          description: Phiên bản hiện tại. Mỗi lần ghi có hiệu lực sẽ tạo một phiên bản mới.
        - name: row_version
          type: integer
          required: true
          description: Token compare-and-set cho PATCH, archive, unarchive và restore.
        - name: status
          type: string
          required: true
          description: active hoặc archived.
        - name: projection_status
          type: string
          required: true
          description: Trạng thái sẵn sàng thực thi của phiên bản hiện tại. Session cần ready; Agent mới có thể báo pending trong thời gian ngắn.
        - name: runtime_profile
          type: string
          required: true
          description: codex, claude hoặc mcode.
        - name: visibility
          type: string
          required: true
          description: private với Agent của bạn; public với các mục trong danh mục.
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Giây Unix. archived_at là null khi đang active.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: create-research-agent-1" \
          -H "Content-Type: application/json" \
          -d '{
            "name": "Research assistant",
            "model": "deepseek/deepseek-v4-flash",
            "instructions": "Answer with cited sources.",
            "metadata": {
              "team": "research"
            }
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.create(
            model="deepseek/deepseek-v4-flash",
            name="Research assistant",
            instructions="Answer with cited sources.",
            metadata={"team": "research"},
        )
        print(agent.id, agent.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "create-research-agent-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents",
            headers=headers,
            json={
                "name": "Research assistant",
                "model": "deepseek/deepseek-v4-flash",
                "instructions": "Answer with cited sources.",
                "metadata": {
                    "team": "research"
                }
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'create-research-agent-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "name": "Research assistant",
            "model": "deepseek/deepseek-v4-flash",
            "instructions": "Answer with cited sources.",
            "metadata": {
              "team": "research"
            }
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
      {
        "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "object": "agent",
        "name": "Research assistant",
        "model": "deepseek/deepseek-v4-flash",
        "instructions": "Answer with cited sources.",
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
        "version": 1,
        "row_version": 1,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "",
        "metadata": {
          "team": "research"
        },
        "mcp_connections": [
          {"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin", "allowed_tools": null, "required": true}
        ],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
