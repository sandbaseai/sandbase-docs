---
i18nSource: 91ce9f65766e9662
title: Session बनाएँ
description: POST /v1/agents/sessions से saved या inline Agent के लिए Session बनाएँ, और चाहें तो पहला turn stream करें।
aside: false
outline: false
apiReference:
  title: Session बनाएँ
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: किसी saved Agent version के लिए, या request में परिभाषित inline Agent के लिए Session बनाएँ। Agent configuration, Skill versions और MCP connections Session के पूरे जीवनकाल के लिए frozen रहते हैं। Sessions हमेशा SandBase के hosted cloud में चलते हैं, इसलिए कोई execution environment चुनना नहीं पड़ता। stream=true और initial input के साथ, response JSON Session के बजाय पहले turn का 201 Server-Sent Events stream होता है। Execution admission (balance और organization status) यहीं जाँचा जाता है। OpenAI SDK को environment argument चाहिए; OpenAI compatibility (/agents/openai-compatibility) देखें।
  groups:
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: वैकल्पिक। न भेजने पर सर्विस खुद एक key बनाती है, इसलिए दोबारा भेजा गया request डुप्लिकेट बना सकता है। retry के लिए अपनी स्थिर key भेजें।
    - title: Request body
      description: Strict JSON object।
      fields:
        - name: agent_id
          type: string
          required: false
          description: Saved Agent ID (agt_ prefix)। Agent active होना चाहिए और उसका projection_status ready होना चाहिए। agent_id, agent, या दोनों भेजें।
        - name: agent
          type: object
          required: false
          description: Agent configuration। स्वीकार किए जाने वाले fields हैं model, instructions, runtime_profile (codex, claude, या mcode; default codex), service_tier, tools, text, reasoning और multi_agent, जिन्हें Create Agent की तरह validate किया जाता है। agent_id के बिना यह inline Agent परिभाषित करता है और model आवश्यक है; inline Agents में कोई Skills या MCP connections नहीं होते। agent_id के साथ, आपके भेजे गए हर field से saved version का वह field केवल इसी Session के लिए बदल जाता है। अज्ञात fields 400 लौटाते हैं।
        - name: version
          type: integer
          required: false
          description: Agent version। Default रूप से current version। inline Agent के साथ अनुमति नहीं है।
        - name: title
          type: string
          required: false
          description: Session title।
        - name: input
          type: string | array
          required: false
          description: 'वैकल्पिक पहला input: एक string, या ठीक एक message वाला array, जैसे [{"role":"user","content":[{"type":"input_text","text":"…"}]}]। अकेला object 400 लौटाता है।'
        - name: model
          type: string
          required: false
          description: Model override। agent.model OpenAI SDK वाला रूप है; दोनों भेजने पर उनका मेल खाना ज़रूरी है।
        - name: metadata
          type: object
          required: false
          description: अधिकतम 16 string pairs।
        - name: stream
          type: boolean
          required: false
          description: "true होने पर non-empty input आवश्यक है और text/event-stream body के साथ 201 लौटता है। Events, Stream events format (event: <type>, data: <json>) का उपयोग करते हैं; पहला event, agent.session.created, Session snapshot लाता है, जिसके बाद turn के item और output events आते हैं। Stream शुरू होने से पहले की validation, admission और अन्य errors सामान्य JSON error लौटाती हैं। Default false।"
        - name: environment
          type: object
          required: false
          description: केवल OpenAI SDK compatibility के लिए। सीधे HTTP calls में इसे न भेजें; {"type":"openai_hosted"} स्वीकार किया जाता है और कोई अन्य type 400 लौटाता है।
        - name: model_provider
          type: object
          required: false
          description: Model credential। अपनी calling API key इस्तेमाल करने के लिए इसे न भेजें। {"type":"custom","base_url":"https://…","api_key":"…"} आपके अपने OpenAI-compatible endpoint को call करता है। Write-only।
        - name: github_workspace
          type: object
          required: false
          description: 'इस Session के लिए /workspace में clone की जाने वाली GitHub repository: {"repository_id":"1195090324","ref":"main","connection_id":"plc_…"}। केवल repository_id आवश्यक है; ref default रूप से default branch है। न भेजने या null होने पर Agent की workspace repository (यदि हो) इस्तेमाल होती है, अन्यथा कुछ भी clone नहीं होता। Repository Agent के GitHub connection scope में होनी चाहिए। GitHub repository workspace (/agents/github-workspace) देखें।'
    - title: Session object
      description: create, get, update, rename, archive और unarchive द्वारा लौटाया जाता है।
      fields:
        - name: id
          type: string
          required: true
          description: ses_ prefix वाला Session ID।
        - name: status
          type: string
          required: true
          description: "Execution status: idle, in_progress या failed। requires_action अभी समर्थित नहीं है और 502 executor_contract_error के रूप में सामने आता है।"
        - name: lifecycle_status
          type: string
          required: true
          description: active या archived। Archived Sessions input अस्वीकार करते हैं।
        - name: failure
          type: object · null
          required: true
          description: code, message, action और वैकल्पिक retryable के साथ public failure।
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: Frozen Agent version और effective model।
        - name: agent · usage
          type: object · object | null
          required: true
          description: effective Agent configuration का OpenAI-shaped snapshot, और token usage (जब तक कोई turn usage रिपोर्ट नहीं करता, तब तक null)।
        - name: source · source_id
          type: string · null
          required: false
          description: Session का स्रोत। POST /v1/agents/sessions से बने Sessions direct और null source_id रिपोर्ट करते हैं।
        - name: row_version
          type: integer
          required: true
          description: rename, archive और unarchive के लिए compare-and-set token।
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/sessions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: market-scan-2026-10-06" \
          -H "Content-Type: application/json" \
          -d '{
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "title": "Market scan"
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        session = client.beta.agents.sessions.create(
            agent_id="agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            environment={"type": "openai_hosted"},  # Required by the OpenAI SDK; SandBase always runs in its hosted cloud.
        )
        print(session.id, session.status)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "market-scan-2026-10-06",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/sessions",
            headers=headers,
            json={
                "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
                "title": "Market scan",
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/sessions', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'market-scan-2026-10-06',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            "title": "Market scan"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
      {
        "id": "ses_5b0e7c3a-91d2-5f4e-8a6b-2c9d4e1f7a83",
        "object": "agent.session",
        "agent": {
          "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
          "name": "Research assistant",
          "model": "deepseek/deepseek-v4-flash",
          "instructions": "Answer with cited sources.",
          "multi_agent": {"enabled": false, "max_concurrent_subagents": null},
          "reasoning": {"effort": null, "summary": null},
          "service_tier": "auto",
          "text": {"format": {"type": "text"}, "verbosity": "medium"},
          "tools": []
        },
        "agent_id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "agent_version": 1,
        "title": "Market scan",
        "model": "deepseek/deepseek-v4-flash",
        "environment": {
          "id": "env_…",
          "type": "openai_hosted",
          "capability_directories": [],
          "files": [],
          "network": {"access": "enabled", "allowed_domains": []},
          "packages": {"npm": [], "python": [], "system": []},
          "plugins": [],
          "skills": []
        },
        "metadata": {},
        "status": "idle",
        "lifecycle_status": "active",
        "sync_status": "ready",
        "execution_status": "idle",
        "failure": null,
        "row_version": 1,
        "required_actions": [],
        "vault_ids": [],
        "usage": null,
        "created_at": 1791273600,
        "last_active_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null,
        "source": "direct",
        "source_id": null
      }
---

<ApiReferencePage />
