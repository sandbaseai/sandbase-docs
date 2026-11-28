---
i18nSource: 16bfb8a74a9b9f27
title: Połącz ponownie z Session
description: Po rozłączeniu pobierz bieżącą Session i adres URL strumienia produktu.
aside: false
outline: false
apiReference:
  title: Połącz ponownie z Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/reconnect
  description: "Rozszerzenie SandBase dla klientów w stylu przeglądarkowym. Zwraca bieżącą Session oraz stream_url. Otwarcie stream_url (GET /v1/agents/sessions/{session_id}/events/stream) wysyła session.snapshot z Session, ostatnimi elementami i turami, a następnie zdarzenia na żywo i heartbeat. Jeśli połączenie z usługą nadrzędną zostanie zerwane, strumień emituje stream.interrupted z resend_input równym false: połącz się ponownie zamiast ponownie wysyłać wejście. To wywołanie wymaga tylko zakresu agents.read."
  groups:
    - title: Parametry ścieżki
      fields:
        - name: session_id
          type: string
          required: true
          description: Identyfikator Session (prefiks ses_).
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
