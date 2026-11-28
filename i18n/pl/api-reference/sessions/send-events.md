---
i18nSource: 57d5d4e3e9e72fe6
title: Wyślij dane wejściowe sesji
description: Wysyła do sesji jedno zdarzenie wejścia lub anulowania.
aside: false
outline: false
apiReference:
  title: Wyślij dane wejściowe sesji
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/events
  description: 'W każdym żądaniu wysyłaj dokładnie jedno zdarzenie: agent.session.input.message lub agent.session.input.cancel. Zwraca 202 bez treści; postęp śledź w strumieniu zdarzeń. Forma rozszerzenia SandBase {"input": "…", "file_ids": [...]} wysyła tekst z maksymalnie 10 gotowymi załącznikami i nie można jej łączyć z events. Odpowiedź 409 session_input_pending oznacza, że wcześniejsze dane wejściowe są nadal dostarczane: poczekaj i nie wysyłaj ich ponownie z nowym kluczem.'
  groups:
    - title: Parametry ścieżki
      fields:
        - name: session_id
          type: string
          required: true
          description: Identyfikator sesji (prefiks ses_).
    - title: Nagłówki
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcjonalny, ale zalecany. Przy ponawianiu tych samych danych wejściowych używaj tego samego klucza.
    - title: Treść żądania
      description: Albo events, albo input/file_ids.
      fields:
        - name: events
          type: array
          required: false
          description: Dokładnie jedno zdarzenie. input.message przenosi input jako tekst lub jedną wiadomość użytkownika input_text; input.cancel nie przenosi input.
        - name: input
          type: string
          required: false
          description: Rozszerzenie SandBase. Niepusty tekst do 256 KiB.
        - name: file_ids
          type: array
          required: false
          description: Rozszerzenie SandBase. Do 10 różnych identyfikatorów załączników ze statusem ready.
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
