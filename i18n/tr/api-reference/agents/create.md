---
i18nSource: f3150233afd08b90
title: Agent Oluşturma
description: POST /v1/agents ile kayıtlı, sürümlü bir Agent oluşturun.
aside: false
outline: false
apiReference:
  title: Agent Oluşturma
  operation: Agents
  method: POST
  path: /v1/agents
  description: "Sürüm 1 olarak kayıtlı bir Agent oluşturur. Gövde katı JSON'dur: bilinmeyen alanlar 400 döndürür. multi_agent atlanmalı veya null olmalıdır."
  groups:
    - title: Başlıklar
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: İsteğe bağlı. Atlandığında hizmet bir anahtar üretir; bu nedenle yeniden denenen bir istek kopya oluşturabilir. Yeniden denemeler için kendi sabit anahtarınızı gönderin.
    - title: İstek gövdesi
      description: JSON nesnesi.
      fields:
        - name: model
          type: string
          required: true
          description: Models API'den alınan zorunlu model kimliği, en fazla 200 karakter. Varsayılan değer yoktur; model atlanırsa 400 döner. Örneklerde deepseek/deepseek-v4-flash kullanılır.
        - name: name
          type: string
          required: false
          description: Görünen ad, en fazla 128 karakter.
        - name: instructions
          type: string
          required: false
          description: Sistem talimatları, en fazla 256 KiB.
        - name: runtime_profile
          type: string
          required: false
          description: "Yürütme çalışma zamanı: codex (varsayılan), claude veya mcode."
        - name: skills
          type: array
          required: false
          description: 'Skill referansları: {"skill_id": "skl_…", "version": null | "<version>"}. En fazla 32. Yeni bir bağlamada null, Agent kaydedildiği andaki geçerli varsayılan sürümü sabitler. Mevcut bir bağlamada null, sabitlenmiş sürümü korur; yükseltmek için açık bir sürüm belirtin.'
        - name: mcp_connections
          type: array
          required: false
          description: 'MCP referansları: {connection_id, server_label, allowed_tools, required}. En fazla 32; server_label Agent içinde benzersiz olmalıdır. Yerleşik SandBase araçlarını almak için atlayın ({"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin"}); gönderdiğiniz liste bu varsayılanın yerini alır, [] ise araçsız bir Agent oluşturur. Bkz. Yerleşik SandBase araçları (/agents/mcp-tools#built-in-sandbase-tools).'
        - name: tools
          type: array
          required: false
          description: En fazla 64 function aracı ve en fazla bir web_search aracı. Sessions şu anda web_search modunun devre dışı olmasını gerektirir ve istemci tarafı function sonuçları henüz desteklenmez.
        - name: text
          type: object
          required: false
          description: format.type text veya json_schema (object şemasıyla); verbosity low, medium veya high.
        - name: reasoning
          type: object
          required: false
          description: effort none, minimal, low, medium, high, xhigh veya max; summary concise, detailed veya auto.
        - name: service_tier
          type: string
          required: false
          description: auto (varsayılan), default, flex, priority veya fast.
        - name: metadata
          type: object
          required: false
          description: En fazla 16 dize çifti; anahtarlar en fazla 64, değerler en fazla 512 karakter.
        - name: description
          type: string
          required: false
          description: Uzun açıklama, en fazla 4096 karakter.
        - name: note
          type: string
          required: false
          description: Sürüm 1'e kaydedilen değişiklik notu.
    - title: Agent nesnesi
      description: create, get, update, archive, unarchive, restore ve clone tarafından döndürülür.
      fields:
        - name: id
          type: string
          required: true
          description: agt_ önekli Agent kimliği.
        - name: object
          type: string
          required: true
          description: Her zaman agent.
        - name: version
          type: integer
          required: true
          description: Geçerli sürüm. Her etkili yazma işlemi yeni bir sürüm oluşturur.
        - name: row_version
          type: integer
          required: true
          description: PATCH, archive, unarchive ve restore için compare-and-set belirteci.
        - name: status
          type: string
          required: true
          description: active veya archived.
        - name: projection_status
          type: string
          required: true
          description: Geçerli sürümün yürütmeye hazır olma durumu. Sessions için ready gerekir; yeni bir Agent kısa bir süre pending bildirebilir.
        - name: runtime_profile
          type: string
          required: true
          description: codex, claude veya mcode.
        - name: visibility
          type: string
          required: true
          description: Kendi Agents'larınız için private; katalog girdileri için public.
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Unix saniyesi. Etkinken archived_at null olur.
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
