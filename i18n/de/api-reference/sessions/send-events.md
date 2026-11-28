---
i18nSource: 57d5d4e3e9e72fe6
title: Session-Eingabe senden
description: Sendet ein Eingabe- oder Abbruch-Event an eine Session.
aside: false
outline: false
apiReference:
  title: Session-Eingabe senden
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/events
  description: 'Sende genau ein Event pro Anfrage: agent.session.input.message oder agent.session.input.cancel. Liefert 202 ohne Body; den Fortschritt verfolgst du im Event-Stream. Die SandBase-Erweiterung {"input": "…", "file_ids": [...]} sendet Text mit bis zu 10 bereiten Anhängen und lässt sich nicht mit events kombinieren. Ein 409 session_input_pending bedeutet, dass eine frühere Eingabe noch zugestellt wird: Warte und sende nicht mit einem neuen Schlüssel erneut.'
  groups:
    - title: Pfadparameter
      fields:
        - name: session_id
          type: string
          required: true
          description: Session-ID (Präfix ses_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Optional, aber empfohlen. Verwende denselben Schlüssel, wenn du dieselbe Eingabe erneut sendest.
    - title: Request-Body
      description: Entweder events oder input/file_ids.
      fields:
        - name: events
          type: array
          required: false
          description: Genau ein Event. input.message enthält die Eingabe als Text oder als eine user-Nachricht vom Typ input_text; input.cancel enthält keine Eingabe.
        - name: input
          type: string
          required: false
          description: SandBase-Erweiterung. Nicht leerer Text bis zu 256 KiB.
        - name: file_ids
          type: array
          required: false
          description: SandBase-Erweiterung. Bis zu 10 verschiedene Anhang-IDs mit dem Status ready.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-input-1" \
          -H "Content-Type: application/json" \
          -d '{
            "events": [
              {
                "type": "agent.session.input.message",
                "input": [
                  {
                    "role": "user",
                    "content": [
                      {
                        "type": "input_text",
                        "text": "List three notable launches this week."
                      }
                    ]
                  }
                ]
              }
            ]
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        client.beta.agents.sessions.events.create(
            "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
            events=[{
                "type": "agent.session.input.message",
                "input": [{"role": "user", "content": [{"type": "input_text", "text": "List three notable launches this week."}]}],
            }],
        )
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-input-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events",
            headers=headers,
            json={
                "events": [
                    {
                        "type": "agent.session.input.message",
                        "input": [
                            {
                                "role": "user",
                                "content": [
                                    {
                                        "type": "input_text",
                                        "text": "List three notable launches this week."
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
        )
        response.raise_for_status()
        print(response.status_code)  # 202 Accepted, no body
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-input-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "events": [
              {
                "type": "agent.session.input.message",
                "input": [
                  {
                    "role": "user",
                    "content": [
                      {
                        "type": "input_text",
                        "text": "List three notable launches this week."
                      }
                    ]
                  }
                ]
              }
            ]
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(response.status); // 202 Accepted, no body
---

<ApiReferencePage />
