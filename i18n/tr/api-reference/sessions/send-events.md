---
i18nSource: 57d5d4e3e9e72fe6
title: Session Girdisi Gönder
description: Bir Session'a tek bir girdi veya iptal olayı gönderin.
aside: false
outline: false
apiReference:
  title: Session Girdisi Gönder
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/events
  description: 'Her istekte tam olarak bir olay gönderin: agent.session.input.message veya agent.session.input.cancel. Gövdesiz 202 döndürür; ilerlemeyi olay akışından izleyin. SandBase uzantı biçimi {"input": "…", "file_ids": [...]}, metni en fazla 10 hazır ekle birlikte gönderir ve events ile birlikte kullanılamaz. 409 session_input_pending, önceki girdinin hâlâ iletilmekte olduğu anlamına gelir: bekleyin ve yeni bir anahtarla yeniden göndermeyin.'
  groups:
    - title: Yol parametreleri
      fields:
        - name: session_id
          type: string
          required: true
          description: Session kimliği (ses_ önekli).
    - title: Başlıklar
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: İsteğe bağlı ancak önerilir. Aynı girdiyi yeniden denerken aynı anahtarı kullanın.
    - title: İstek gövdesi
      description: events veya input/file_ids.
      fields:
        - name: events
          type: array
          required: false
          description: Tam olarak bir olay. input.message, input değerini metin olarak ya da tek bir user input_text mesajı olarak taşır; input.cancel input taşımaz.
        - name: input
          type: string
          required: false
          description: SandBase uzantısı. En fazla 256 KiB, boş olmayan metin.
        - name: file_ids
          type: array
          required: false
          description: SandBase uzantısı. Durumu ready olan en fazla 10 farklı ek kimliği.
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
