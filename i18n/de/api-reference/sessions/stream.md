---
i18nSource: 8c5a71725812bd56
title: Session-Events streamen
description: Live-Events einer Session über Server-Sent Events abonnieren.
aside: false
outline: false
apiReference:
  title: Session-Events streamen
  operation: Sessions
  method: GET
  path: /v1/agents/sessions/{session_id}/events
  description: 'Öffnet den nativen Live-Event-Stream (text/event-stream). Öffne ihn, bevor du Eingaben sendest. Der Stream ist rein live: Last-Event-ID oder eine after-Query ergeben 400, und Events, die während einer Unterbrechung ausgegeben wurden, werden nicht erneut gesendet; lies sie aus items oder turns. Der Server schreibt zuerst einen Kommentar ": connected". Event-Typen beginnen mit agent.session.'
  groups:
    - title: Pfadparameter
      fields:
        - name: session_id
          type: string
          required: true
          description: Session-ID (Präfix ses_).
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X GET https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Accept: text/event-stream"
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        with client.beta.agents.sessions.events.stream("ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83") as stream:
            for event in stream:
                print(event.type)
                # The stream is live-only and stays open; stop at a terminal turn event.
                if event.type in ("agent.session.turn.completed", "agent.session.turn.failed", "agent.session.turn.cancelled"):
                    break
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Accept": "text/event-stream",
        }

        response = requests.request(
            "GET",
            "https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events",
            headers=headers,
            stream=True,
        )
        response.raise_for_status()
        for line in response.iter_lines(decode_unicode=True):
            if line:
                print(line)
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions/ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83/events', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Accept': 'text/event-stream',
          },
        });

        if (!response.ok) throw new Error(await response.text());
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          process.stdout.write(decoder.decode(value));
        }
---

<ApiReferencePage />
