---
i18nSource: 4e711691737c9671
title: Agent replace करें (CAS)
description: row_version पर compare-and-set के साथ Agent update करें।
aside: false
outline: false
apiReference:
  title: Agent replace करें (CAS)
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: Compare-and-set के साथ product update। row_version आवश्यक है और वर्तमान मान के बराबर होना चाहिए, अन्यथा 409। दिए गए fields सहेजे गए मानों को बदल देते हैं; स्पष्ट null मान 400 लौटाते हैं। जब कई editors एक ही Agent बदल सकते हों, तब यह रूप उपयोग करें।
  groups:
    - title: Path parameters
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent ID (agt_ prefix)।
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: वैकल्पिक। न भेजने पर सर्विस खुद एक key बनाती है, इसलिए दोबारा भेजा गया request डुप्लिकेट बना सकता है। retry के लिए अपनी स्थिर key भेजें।
    - title: Request body
      description: row_version और Agent fields का कोई भी subset।
      fields:
        - name: row_version
          type: integer
          required: true
          description: आपके द्वारा पिछली बार पढ़ा गया row_version। पुराना मान 409 लौटाता है।
        - name: model
          type: string
          required: false
          description: Models API से model ID, अधिकतम 200 characters।
        - name: name
          type: string
          required: false
          description: Display name, अधिकतम 128 characters।
        - name: instructions
          type: string
          required: false
          description: System instructions, अधिकतम 256 KiB।
        - name: runtime_profile
          type: string
          required: false
          description: "Execution runtime: codex (default), claude, या mcode।"
        - name: skills
          type: array
          required: false
          description: 'Skill references: {"skill_id": "skl_…", "version": null | "<version>"}। अधिकतम 32। नई binding पर null, Agent सहेजे जाने के समय के current default को pin करता है। मौजूदा binding के लिए null उसके pinned version को बनाए रखता है; upgrade करने के लिए स्पष्ट version दें।'
        - name: mcp_connections
          type: array
          required: false
          description: "MCP references: {connection_id, server_label, allowed_tools, required}। अधिकतम 32; Agent में server_label अद्वितीय होना चाहिए।"
        - name: tools
          type: array
          required: false
          description: अधिकतम 64 function tools और अधिकतम एक web_search tool। Sessions के लिए फ़िलहाल web_search mode disabled होना आवश्यक है, और client-side function results अभी समर्थित नहीं हैं।
        - name: text
          type: object
          required: false
          description: format.type text या json_schema (object schema के साथ); verbosity low, medium, या high।
        - name: reasoning
          type: object
          required: false
          description: effort none, minimal, low, medium, high, xhigh, या max; summary concise, detailed, या auto।
        - name: service_tier
          type: string
          required: false
          description: auto (default), default, flex, priority, या fast।
        - name: metadata
          type: object
          required: false
          description: अधिकतम 16 string pairs; keys अधिकतम 64 और values अधिकतम 512 characters।
        - name: description
          type: string
          required: false
          description: अधिकतम 4096 characters।
        - name: note
          type: string
          required: false
          description: नए version पर दर्ज किया जाने वाला change note।
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
          }'
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "PATCH",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "row_version": 2,
                "description": "Research Agent used by the weekly brief.",
                "note": "Add description"
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "row_version": 2,
            "description": "Research Agent used by the weekly brief.",
            "note": "Add description"
          }),
        });

        if (!response.ok) throw new Error(await response.text());
        console.log(await response.json());
  response:
    status: 200 OK
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
        "version": 3,
        "row_version": 3,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "Research Agent used by the weekly brief.",
        "metadata": {
          "team": "research"
        },
        "mcp_connections": [],
        "skills": [],
        "created_at": 1791273600,
        "updated_at": 1791273600,
        "archived_at": null
      }
---

<ApiReferencePage />
