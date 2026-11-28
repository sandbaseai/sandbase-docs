---
i18nSource: 1b680f7f0804feb7
title: Agent güncelleme
description: OpenAI SDK tarzı POST güncellemesiyle bir Agent'ı kısmen güncelleyin.
aside: false
outline: false
apiReference:
  title: Agent güncelleme
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: SDK tarzı kısmi güncelleme. Gönderilen alanlar kayıtlı değerlerin yerini alır ve yeni bir sürüm oluşturur; atlanan alanlar değerlerini korur. row_version gerekmez. description ve note burada kabul edilmez; bunlar için Replace (PATCH) kullanın. Arşivlenmiş Agent'lar 404 döndürür.
  groups:
    - title: Yol parametreleri
      fields:
        - name: agent_id
          type: string
          required: true
          description: Agent kimliği (agt_ önekli).
    - title: Başlıklar
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: İsteğe bağlı. Atlanırsa hizmet bir anahtar üretir; bu durumda yeniden denenen bir istek kopya oluşturabilir. Yeniden denemeler için kendi sabit anahtarınızı gönderin.
    - title: İstek gövdesi
      description: Bu alanların herhangi bir alt kümesi. Diğer alanlar 400 döndürür.
      fields:
        - name: model
          type: string
          required: false
          description: Models API'den model kimliği, en fazla 200 karakter.
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
          description: 'Skill referansları: {"skill_id": "skl_…", "version": null | "<version>"}. En fazla 32. Yeni bir bağlamada null, Agent kaydedildiğinde geçerli varsayılanı sabitler. Mevcut bir bağlamada null sabitlenmiş sürümü korur; yükseltmek için açık bir sürüm belirtin.'
        - name: mcp_connections
          type: array
          required: false
          description: "MCP referansları: {connection_id, server_label, allowed_tools, required}. En fazla 32; server_label Agent içinde benzersiz olmalıdır."
        - name: tools
          type: array
          required: false
          description: En fazla 64 function aracı ve en fazla bir web_search aracı. Session'lar şu anda web_search modunun disabled olmasını gerektirir ve istemci tarafı function sonuçları henüz desteklenmez.
        - name: text
          type: object
          required: false
          description: format.type text veya json_schema (nesne şemasıyla); verbosity low, medium veya high.
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
          description: En fazla 16 metin çifti; anahtarlar en fazla 64, değerler en fazla 512 karakter.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "instructions": "Answer in five bullet points with cited sources."
          }'
    - label: Python (OpenAI SDK)
      language: python
      code: |-
        # Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
        import os
        from openai import OpenAI

        client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
        agent = client.beta.agents.update(
            "agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            instructions="Answer in five bullet points with cited sources.",
        )
        print(agent.version)
    - label: Python
      language: python
      code: |-
        import os
        import requests

        headers = {
            "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
        }

        response = requests.request(
            "POST",
            "https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60",
            headers=headers,
            json={
                "instructions": "Answer in five bullet points with cited sources."
            },
        )
        response.raise_for_status()
        print(response.json())
    - label: TypeScript
      language: typescript
      code: |-
        const response = await fetch('https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            "instructions": "Answer in five bullet points with cited sources."
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
        "instructions": "Answer in five bullet points with cited sources.",
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
        "version": 2,
        "row_version": 2,
        "projection_status": "ready",
        "runtime_profile": "codex",
        "description": "",
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
