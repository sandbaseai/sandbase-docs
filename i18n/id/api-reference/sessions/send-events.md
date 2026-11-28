---
i18nSource: 57d5d4e3e9e72fe6
title: Mengirim Input Session
description: Kirim satu event input atau cancel ke Session.
aside: false
outline: false
apiReference:
  title: Mengirim Input Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/events
  description: 'Kirim tepat satu event per permintaan: agent.session.input.message atau agent.session.input.cancel. Mengembalikan 202 tanpa body; ikuti progresnya di stream event. Bentuk ekstensi SandBase {"input": "…", "file_ids": [...]} mengirim teks dengan hingga 10 lampiran yang siap dan tidak dapat digabungkan dengan events. 409 session_input_pending berarti input sebelumnya masih dalam proses pengiriman: tunggu, dan jangan kirim ulang dengan kunci baru.'
  groups:
    - title: Parameter path
      fields:
        - name: session_id
          type: string
          required: true
          description: ID Session (prefiks ses_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opsional tetapi disarankan. Gunakan kunci yang sama saat mencoba ulang input yang sama.
    - title: Body permintaan
      description: Salah satu dari events atau input/file_ids.
      fields:
        - name: events
          type: array
          required: false
          description: Tepat satu event. input.message membawa input sebagai teks atau satu pesan input_text pengguna; input.cancel tidak membawa input.
        - name: input
          type: string
          required: false
          description: Ekstensi SandBase. Teks tidak kosong hingga 256 KiB.
        - name: file_ids
          type: array
          required: false
          description: Ekstensi SandBase. Hingga 10 ID lampiran berbeda dengan status ready.
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
