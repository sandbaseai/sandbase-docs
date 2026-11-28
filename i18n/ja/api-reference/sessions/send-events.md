---
i18nSource: 57d5d4e3e9e72fe6
title: Session 入力の送信
description: Session に入力イベントまたはキャンセルイベントを 1 件送信します。
aside: false
outline: false
apiReference:
  title: Session 入力の送信
  operation: Sessions
  method: POST
  path: /v1/agents/sessions/{session_id}/events
  description: '1 回のリクエストで送信できるイベントは 1 件だけです（agent.session.input.message または agent.session.input.cancel）。ボディなしで 202 を返すため、進行状況はイベントストリームで確認してください。SandBase 拡張形式の {"input": "…", "file_ids": [...]} は、テキストと最大 10 件の ready 状態の添付ファイルを送信し、events とは併用できません。409 session_input_pending は、以前の入力がまだ配信中であることを示します。新しいキーで再送せずに待ってください。'
  groups:
    - title: パスパラメータ
      fields:
        - name: session_id
          type: string
          required: true
          description: Session ID（ses_ プレフィックス）。
    - title: ヘッダー
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: 任意ですが推奨です。同じ入力をリトライするときは同じキーを再利用してください。
    - title: リクエストボディ
      description: events または input/file_ids のいずれか。
      fields:
        - name: events
          type: array
          required: false
          description: イベントはちょうど 1 件。input.message はテキスト、または user の input_text メッセージ 1 件として input を持ちます。input.cancel は input を持ちません。
        - name: input
          type: string
          required: false
          description: SandBase 拡張。空でないテキスト（最大 256 KiB）。
        - name: file_ids
          type: array
          required: false
          description: SandBase 拡張。ステータスが ready の、重複しない添付ファイル ID（最大 10 件）。
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
