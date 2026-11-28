---
i18nSource: 57d5d4e3e9e72fe6
title: Envoyer une entrée de Session
description: Envoyez un événement d'entrée ou d'annulation à une Session.
aside: false
outline: false
apiReference:
  title: Envoyer une entrée de Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/events
  description: "Envoyez exactement un événement par requête : agent.session.input.message ou agent.session.input.cancel. Renvoie 202 sans corps ; suivez la progression sur le flux d'événements. La forme d'extension SandBase {\"input\": \"…\", \"file_ids\": [...]} envoie du texte avec jusqu'à 10 pièces jointes prêtes et ne peut pas être combinée avec events. Un 409 session_input_pending signifie qu'une entrée précédente est encore en cours de livraison : patientez, et ne la renvoyez pas avec une nouvelle clé."
  groups:
    - title: Paramètres de chemin
      fields:
        - name: session_id
          type: string
          required: true
          description: ID de la Session (préfixe ses_).
    - title: En-têtes
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Facultatif mais recommandé. Réutilisez la même clé lorsque vous renvoyez la même entrée.
    - title: Corps de la requête
      description: Soit events, soit input/file_ids.
      fields:
        - name: events
          type: array
          required: false
          description: Exactement un événement. input.message transporte input sous forme de texte ou d'un message utilisateur input_text ; input.cancel ne transporte pas d'input.
        - name: input
          type: string
          required: false
          description: Extension SandBase. Texte non vide, jusqu'à 256 Kio.
        - name: file_ids
          type: array
          required: false
          description: Extension SandBase. Jusqu'à 10 ID de pièces jointes distincts avec le statut ready.
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
