---
i18nSource: 57d5d4e3e9e72fe6
title: Enviar input à Session
description: Envie um evento de input ou de cancelamento para uma Session.
aside: false
outline: false
apiReference:
  title: Enviar input à Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/events
  description: 'Envie exatamente um evento por requisição: agent.session.input.message ou agent.session.input.cancel. Retorna 202 sem corpo; acompanhe o progresso pelo stream de eventos. O formato de extensão do SandBase {"input": "…", "file_ids": [...]} envia texto com até 10 anexos prontos e não pode ser combinado com events. Um 409 session_input_pending significa que um input anterior ainda está sendo entregue: aguarde e não reenvie com uma nova chave.'
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: session_id
          type: string
          required: true
          description: ID da Session (prefixo ses_).
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcional, mas recomendado. Reutilize a mesma chave ao tentar enviar o mesmo input novamente.
    - title: Corpo da requisição
      description: events ou input/file_ids.
      fields:
        - name: events
          type: array
          required: false
          description: Exatamente um evento. input.message carrega o input como texto ou como uma mensagem input_text de usuário; input.cancel não carrega input.
        - name: input
          type: string
          required: false
          description: Extensão do SandBase. Texto não vazio de até 256 KiB.
        - name: file_ids
          type: array
          required: false
          description: Extensão do SandBase. Até 10 IDs de anexo distintos com status ready.
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
