---
i18nSource: 57d5d4e3e9e72fe6
title: Session input भेजें
description: किसी Session को एक input या cancel event भेजें।
aside: false
outline: false
apiReference:
  title: Session input भेजें
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/events
  description: 'प्रति request ठीक एक event भेजें: agent.session.input.message या agent.session.input.cancel। बिना body के 202 लौटाता है; प्रगति event stream पर देखें। SandBase extension रूप {"input": "…", "file_ids": [...]} अधिकतम 10 ready attachments के साथ text भेजता है और इसे events के साथ नहीं मिलाया जा सकता। 409 session_input_pending का अर्थ है कि पिछला input अभी भी deliver हो रहा है: प्रतीक्षा करें, और नई key के साथ दोबारा न भेजें।'
  groups:
    - title: Path parameters
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID (ses_ prefix)।
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: वैकल्पिक, लेकिन अनुशंसित। वही input retry करते समय वही key दोबारा उपयोग करें।
    - title: Request body
      description: या तो events, या input/file_ids।
      fields:
        - name: events
          type: array
          required: false
          description: ठीक एक event। input.message, input को text या एक user input_text message के रूप में ले जाता है; input.cancel में कोई input नहीं होता।
        - name: input
          type: string
          required: false
          description: SandBase extension। खाली नहीं होने वाला text, अधिकतम 256 KiB।
        - name: file_ids
          type: array
          required: false
          description: SandBase extension। ready status वाले अधिकतम 10 अलग-अलग attachment IDs।
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
