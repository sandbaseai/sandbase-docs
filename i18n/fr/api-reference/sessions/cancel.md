---
i18nSource: d4a2ec314b751b1b
title: Annuler un Turn de Session
description: Annulez le Turn en cours d'une Session.
aside: false
outline: false
apiReference:
  title: Annuler un Turn de Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/cancel
  description: Extension SandBase. Demande l'annulation du Turn en cours. Le corps peut être vide ou {}. Idempotency-Key est obligatoire. Si la Session est inactive (idle), l'appel renvoie quand même 202 avec accepted à true et ne modifie rien. L'alternative standard consiste à envoyer un événement agent.session.input.cancel.
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
          required: true
          description: 1 à 128 caractères, sans espace au début ni à la fin. Réutilisez la même clé et le même corps lors d'une nouvelle tentative ; la même clé avec un corps différent renvoie 409.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/cancel \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-cancel-1" \
          -H "Content-Type: application/json" \
          -d '{}'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-cancel-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/cancel",
            headers=headers,
            json={},
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/cancel', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-cancel-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 202 Accepted
    code: |-
      {
        "session_id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
        "accepted": true
      }
---

<ApiReferencePage />
