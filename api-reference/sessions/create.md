---
title: Create Session
description: Create a Session for a saved or inline Agent with POST /v1/agents/sessions, optionally streaming the first turn.
aside: false
outline: false
apiReference:
  title: Create Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: "Create a Session for a saved Agent version, or for an inline Agent defined in the request. The Agent configuration, Skill versions, and MCP connections are frozen for the life of the Session. Sessions always run in SandBase's hosted cloud, so there is no execution environment to choose. With stream=true and an initial input, the response is a 201 Server-Sent Events stream of the first turn instead of a JSON Session. Execution admission (balance and organization status) is checked here. The OpenAI SDK requires an environment argument; see OpenAI compatibility (/agents/openai-compatibility)."
  groups:
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Optional. When omitted the service generates one, so a retried request can create a duplicate. Send your own stable key for retries.
    - title: Request body
      description: Strict JSON object.
      fields:
        - name: agent_id
          type: string
          required: false
          description: Saved Agent ID (agt_ prefix). The Agent must be active with projection_status ready. Send agent_id, agent, or both.
        - name: agent
          type: object
          required: false
          description: "Agent configuration. Accepted fields are model, instructions, runtime_profile (codex, claude, or mcode; default codex), service_tier, tools, text, reasoning, and multi_agent, validated as in Create Agent. Without agent_id it defines an inline Agent and model is required; inline Agents carry no Skills or MCP connections. With agent_id, each field you send replaces that field of the saved version for this Session only. Unknown fields return 400."
        - name: version
          type: integer
          required: false
          description: Agent version. Defaults to the current version. Not allowed with an inline Agent.
        - name: title
          type: string
          required: false
          description: Session title.
        - name: input
          type: string | array
          required: false
          description: 'Optional first input: a string, or an array with exactly one message, e.g. [{"role":"user","content":[{"type":"input_text","text":"…"}]}]. A bare object returns 400.'
        - name: model
          type: string
          required: false
          description: Model override. agent.model is the OpenAI SDK form; when both are sent they must match.
        - name: metadata
          type: object
          required: false
          description: Up to 16 string pairs.
        - name: stream
          type: boolean
          required: false
          description: "When true, requires a non-empty input and returns 201 with a text/event-stream body. Events use the Stream events format (event: <type>, data: <json>); the first, agent.session.created, carries the Session snapshot, followed by the turn's item and output events. Validation, admission, and other errors before the stream starts return the normal JSON error. Default false."
        - name: environment
          type: object
          required: false
          description: 'OpenAI SDK compatibility only. Omit it in direct HTTP calls; {"type":"openai_hosted"} is accepted and any other type returns 400.'
        - name: model_provider
          type: object
          required: false
          description: Model credential. Omit to use your calling API key. {"type":"custom","base_url":"https://…","api_key":"…"} calls your own OpenAI-compatible endpoint. Write-only.
    - title: Session object
      description: Returned by create, get, update, rename, archive, and unarchive.
      fields:
        - name: id
          type: string
          required: true
          description: Session ID with the ses_ prefix.
        - name: status
          type: string
          required: true
          description: "Execution status: idle, in_progress, or failed. requires_action is not supported yet and surfaces as 502 executor_contract_error."
        - name: lifecycle_status
          type: string
          required: true
          description: active or archived. Archived Sessions reject input.
        - name: failure
          type: object · null
          required: true
          description: Public failure with code, message, action, and optional retryable.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: Frozen Agent version and effective model.
        - name: agent · usage
          type: object · object | null
          required: true
          description: OpenAI-shaped snapshot of the effective Agent configuration, and token usage (null until a turn reports usage).
        - name: source · source_id
          type: string · null
          required: false
          description: direct, service, or schedule, plus the Service or Schedule ID.
        - name: row_version
          type: integer
          required: true
          description: Compare-and-set token for rename, archive, and unarchive.
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
