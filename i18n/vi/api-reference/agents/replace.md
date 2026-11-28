---
i18nSource: 4e711691737c9671
title: Thay thế Agent (CAS)
description: Cập nhật Agent bằng compare-and-set trên row_version.
aside: false
outline: false
apiReference:
  title: Thay thế Agent (CAS)
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: Cập nhật sản phẩm bằng compare-and-set. row_version là bắt buộc và phải bằng giá trị hiện tại, nếu không sẽ trả về 409. Các trường được cung cấp sẽ thay thế giá trị đã lưu; giá trị null tường minh trả về 400. Hãy dùng cách này khi nhiều người chỉnh sửa có thể thay đổi cùng một Agent.
  groups:
    - title: Tham số path
      fields:
        - name: agent_id
          type: string
          required: true
          description: ID Agent (tiền tố agt_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Tùy chọn. Nếu bỏ qua, dịch vụ sẽ tự tạo một key, vì vậy request được thử lại có thể tạo bản trùng lặp. Hãy gửi key ổn định của riêng bạn khi thử lại.
    - title: Body request
      description: row_version cùng với bất kỳ tập con nào của các trường Agent.
      fields:
        - name: row_version
          type: integer
          required: true
          description: row_version bạn đọc gần nhất. Giá trị cũ sẽ trả về 409.
        - name: model
          type: string
          required: false
          description: ID model từ Models API, tối đa 200 ký tự.
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
          description: 'Tham chiếu Skill: {"skill_id": "skl_…", "version": null | "<version>"}. Tối đa 32. Với liên kết mới, null ghim phiên bản mặc định hiện tại khi Agent được lưu. Với liên kết đã có, null giữ nguyên phiên bản đã ghim; hãy cung cấp phiên bản cụ thể để nâng cấp.'
        - name: mcp_connections
          type: array
          required: false
          description: "Tham chiếu MCP: {connection_id, server_label, allowed_tools, required}. Tối đa 32; server_label phải là duy nhất trong Agent."
        - name: tools
          type: array
          required: false
          description: Tối đa 64 function tool cộng với nhiều nhất một tool web_search. Session hiện yêu cầu tắt chế độ web_search, và kết quả function phía client chưa được hỗ trợ.
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
          description: Tối đa 16 cặp chuỗi; key tối đa 64 và value tối đa 512 ký tự.
        - name: description
          type: string
          required: false
          description: Tối đa 4096 ký tự.
        - name: note
          type: string
          required: false
          description: Ghi chú thay đổi được lưu trên phiên bản mới.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
          }'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "PATCH",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "row_version": 2,
                "description": "Research Agent used by the weekly brief.",
                "note": "Add description"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
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
        "version": 3,
        "row_version": 3,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "Research Agent used by the weekly brief.",
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
