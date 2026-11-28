---
i18nSource: 4e711691737c9671
title: Agent'ı Değiştir (CAS)
description: Bir Agent'ı row_version üzerinde compare-and-set ile güncelleyin.
aside: false
outline: false
apiReference:
  title: Agent'ı Değiştir (CAS)
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: Compare-and-set ile ürün güncellemesi. row_version zorunludur ve mevcut değere eşit olmalıdır, aksi halde 409 döner. Gönderilen alanlar kayıtlı değerlerin yerini alır; açıkça null verilen değerler 400 döndürür. Aynı Agent'ı birden fazla düzenleyici değiştirebiliyorsa bu biçimi kullanın.
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
          description: İsteğe bağlı. Gönderilmezse servis bir anahtar üretir; bu durumda yeniden denenen bir istek kopya oluşturabilir. Yeniden denemeler için kendi sabit anahtarınızı gönderin.
    - title: İstek gövdesi
      description: row_version ile birlikte Agent alanlarının herhangi bir alt kümesi.
      fields:
        - name: row_version
          type: integer
          required: true
          description: En son okuduğunuz row_version. Güncel olmayan bir değer 409 döndürür.
        - name: model
          type: string
          required: false
          description: Models API'den bir model kimliği, en fazla 200 karakter.
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
          description: 'Skill referansları: {"skill_id": "skl_…", "version": null | "<version>"}. En fazla 32. Yeni bir bağlamada null, Agent kaydedildiği anda geçerli olan varsayılan sürümü sabitler. Mevcut bir bağlamada null, sabitlenmiş sürümü korur; yükseltmek için açık bir sürüm verin.'
        - name: mcp_connections
          type: array
          required: false
          description: "MCP referansları: {connection_id, server_label, allowed_tools, required}. En fazla 32; server_label Agent içinde benzersiz olmalıdır."
        - name: tools
          type: array
          required: false
          description: En fazla 64 function aracı ve en fazla bir web_search aracı. Sessions şu anda web_search modunun devre dışı olmasını gerektirir; istemci tarafı function sonuçları henüz desteklenmez.
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
          description: En fazla 4096 karakter.
        - name: note
          type: string
          required: false
          description: Yeni sürüme kaydedilen değişiklik notu.
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
