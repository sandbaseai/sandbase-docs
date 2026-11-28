---
i18nSource: f3150233afd08b90
title: Agent बनाएं
description: POST /v1/agents से एक सेव किया गया, versioned Agent बनाएं।
aside: false
outline: false
apiReference:
  title: Agent बनाएं
  operation: Agents
  method: POST
  path: /v1/agents
  description: "Version 1 पर एक सेव किया गया Agent बनाएं। Body strict JSON है: अनजान fields पर 400 लौटता है। multi_agent को छोड़ दें या null रखें।"
  groups:
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: वैकल्पिक। न देने पर service खुद एक key बनाती है, इसलिए retry किया गया request duplicate बना सकता है। Retries के लिए अपनी स्थिर key भेजें।
    - title: Request body
      description: JSON object।
      fields:
        - name: model
          type: string
          required: true
          description: Models API से ज़रूरी model ID, अधिकतम 200 अक्षर। कोई डिफ़ॉल्ट नहीं है; model न देने पर 400 लौटता है। उदाहरणों में deepseek/deepseek-v4-flash इस्तेमाल हुआ है।
        - name: name
          type: string
          required: false
          description: Display name, अधिकतम 128 अक्षर।
        - name: instructions
          type: string
          required: false
          description: System instructions, अधिकतम 256 KiB।
        - name: runtime_profile
          type: string
          required: false
          description: "Execution runtime: codex (डिफ़ॉल्ट), claude या mcode।"
        - name: skills
          type: array
          required: false
          description: 'Skill references: {"skill_id": "skl_…", "version": null | "<version>"}। अधिकतम 32। नई binding पर null, Agent सेव होते समय के मौजूदा डिफ़ॉल्ट version को pin करता है। मौजूदा binding पर null उसका pinned version बनाए रखता है; upgrade करने के लिए स्पष्ट version दें।'
        - name: mcp_connections
          type: array
          required: false
          description: 'MCP references: {connection_id, server_label, allowed_tools, required}। अधिकतम 32; server_label Agent में unique होना चाहिए। छोड़ने पर built-in SandBase tools मिलते हैं ({"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin"}); आपकी भेजी गई सूची इस डिफ़ॉल्ट की जगह लेती है, और [] बिना tools वाला Agent बनाता है। Built-in SandBase tools (/agents/mcp-tools#built-in-sandbase-tools) देखें।'
        - name: tools
          type: array
          required: false
          description: अधिकतम 64 function tools और ज़्यादा से ज़्यादा एक web_search tool। फ़िलहाल Sessions में web_search mode disabled होना ज़रूरी है, और client-side function results अभी सपोर्टेड नहीं हैं।
        - name: text
          type: object
          required: false
          description: format.type text या json_schema (object schema के साथ); verbosity low, medium या high।
        - name: reasoning
          type: object
          required: false
          description: effort none, minimal, low, medium, high, xhigh या max; summary concise, detailed या auto।
        - name: service_tier
          type: string
          required: false
          description: auto (डिफ़ॉल्ट), default, flex, priority या fast।
        - name: metadata
          type: object
          required: false
          description: अधिकतम 16 string pairs; keys अधिकतम 64 और values अधिकतम 512 अक्षर।
        - name: description
          type: string
          required: false
          description: लंबा विवरण, अधिकतम 4096 अक्षर।
        - name: note
          type: string
          required: false
          description: Version 1 पर दर्ज होने वाला change note।
    - title: Agent object
      description: create, get, update, archive, unarchive, restore और clone से लौटता है।
      fields:
        - name: id
          type: string
          required: true
          description: agt_ prefix वाला Agent ID।
        - name: object
          type: string
          required: true
          description: हमेशा agent।
        - name: version
          type: integer
          required: true
          description: मौजूदा version। हर प्रभावी write एक नया version बनाता है।
        - name: row_version
          type: integer
          required: true
          description: PATCH, archive, unarchive और restore के लिए compare-and-set token।
        - name: status
          type: string
          required: true
          description: active या archived।
        - name: projection_status
          type: string
          required: true
          description: मौजूदा version की execution readiness। Sessions के लिए ready ज़रूरी है; नया Agent थोड़ी देर के लिए pending दिखा सकता है।
        - name: runtime_profile
          type: string
          required: true
          description: codex, claude या mcode।
        - name: visibility
          type: string
          required: true
          description: आपके Agents के लिए private; catalog entries के लिए public।
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Unix seconds। Active रहने तक archived_at null रहता है।
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Idempotency-Key: create-research-agent-1" \
          -H "Content-Type: application/json" \
          -d '{
            "name": "Research assistant",
            "model": "deepseek/deepseek-v4-flash",
            "instructions": "Answer with cited sources.",
            "metadata": {
              "team": "research"
            }
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.create(
            model="deepseek/deepseek-v4-flash",
            name="Research assistant",
            instructions="Answer with cited sources.",
            metadata={"team": "research"},
        )
        print(agent.id, agent.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
            "Idempotency-Key": "create-research-agent-1",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents",
            headers=headers,
            json={
                "name": "Research assistant",
                "model": "deepseek/deepseek-v4-flash",
                "instructions": "Answer with cited sources.",
                "metadata": {
                    "team": "research"
                }
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Idempotency-Key': 'create-research-agent-1',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "name": "Research assistant",
            "model": "deepseek/deepseek-v4-flash",
            "instructions": "Answer with cited sources.",
            "metadata": {
              "team": "research"
            }
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 201 Created
    code: |-
      {
        "id": "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
        "object": "agent",
        "name": "Research assistant",
        "model": "deepseek/deepseek-v4-flash",
        "instructions": "Answer with cited sources.",
        "tools": [],
        "text": {
          "format": {
            "type": "text"
          },
          "verbosity": "medium"
        },
        "reasoning": {
          "effort": null,
          "summary": null
        },
        "service_tier": "auto",
        "multi_agent": {
          "enabled": false,
          "max_concurrent_subagents": null
        },
        "visibility": "private",
        "status": "active",
        "version": 1,
        "row_version": 1,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "",
        "metadata": {
          "team": "research"
        },
        "mcp_connections": [
          {"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin", "allowed_tools": null, "required": true}
        ],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
