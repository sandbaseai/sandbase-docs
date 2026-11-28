---
i18nSource: 16bfb8a74a9b9f27
title: 重新连接 Session
description: 断开连接后获取当前 Session 及产品流 URL。
aside: false
outline: false
apiReference:
  title: 重新连接 Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/reconnect
  description: 面向浏览器类客户端的 SandBase 扩展。返回当前 Session 以及 stream_url。打开 stream_url（GET /v1/agents/sessions/{session_id}/events/stream）后，会先发送包含 Session、近期 items 和 turns 的 session.snapshot，随后推送实时事件和心跳。如果上游中断，流会发出 resend_input 为 false 的 stream.interrupted：此时应重新连接，而不是重新发送输入。此调用仅需 agents.read 权限范围。
  groups:
    - title: 路径参数
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ 前缀）。
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/reconnect \
          -H "Authorization: Bearer $SANDBASE_API_KEY"
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
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/reconnect",
            headers=headers,
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/reconnect', {
          method: 'POST',
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
        "session": {
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
        },
        "stream_url": "/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events/stream",
        "recovery": "snapshot_then_live",
        "requires_authorization_header": true
      }
---

<ApiReferencePage />
