---
i18nSource: 1b680f7f0804feb7
title: Memperbarui Agent
description: Perbarui sebagian Agent dengan pembaruan POST ala OpenAI SDK.
aside: false
outline: false
apiReference:
  title: Memperbarui Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: Pembaruan parsial ala SDK. Field yang diberikan menggantikan nilai tersimpan dan membuat versi baru; field yang dihilangkan mempertahankan nilainya. row_version tidak diperlukan. description dan note tidak diterima di sini; gunakan Replace (PATCH) untuk keduanya. Agent yang diarsipkan mengembalikan 404.
  groups:
    - title: Parameter path
      fields:
        - name: agent_id
          type: string
          required: true
          description: ID Agent (prefiks agt_).
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opsional. Jika dihilangkan, layanan akan membuatkannya, sehingga permintaan yang diulang dapat membuat duplikat. Kirim kunci stabil Anda sendiri untuk percobaan ulang.
    - title: Body permintaan
      description: Subset apa pun dari field berikut. Field lain menghasilkan 400.
      fields:
        - name: model
          type: string
          required: false
          description: ID model dari Models API, maksimal 200 karakter.
        - name: name
          type: string
          required: false
          description: Nama tampilan, maksimal 128 karakter.
        - name: instructions
          type: string
          required: false
          description: Instruksi sistem, maksimal 256 KiB.
        - name: runtime_profile
          type: string
          required: false
          description: "Runtime eksekusi: codex (default), claude, atau mcode."
        - name: skills
          type: array
          required: false
          description: 'Referensi Skill: {"skill_id": "skl_…", "version": null | "<version>"}. Maksimal 32. Pada binding baru, null menyematkan versi default saat ini ketika Agent disimpan. Untuk binding yang sudah ada, null mempertahankan versi yang disematkan; berikan versi eksplisit untuk meningkatkan versi.'
        - name: mcp_connections
          type: array
          required: false
          description: "Referensi MCP: {connection_id, server_label, allowed_tools, required}. Maksimal 32; server_label harus unik dalam Agent."
        - name: tools
          type: array
          required: false
          description: Maksimal 64 tool function ditambah paling banyak satu tool web_search. Saat ini Session memerlukan mode web_search disabled, dan hasil function sisi klien belum didukung.
        - name: text
          type: object
          required: false
          description: format.type text atau json_schema (dengan skema objek); verbosity low, medium, atau high.
        - name: reasoning
          type: object
          required: false
          description: effort none, minimal, low, medium, high, xhigh, atau max; summary concise, detailed, atau auto.
        - name: service_tier
          type: string
          required: false
          description: auto (default), default, flex, priority, atau fast.
        - name: metadata
          type: object
          required: false
          description: Maksimal 16 pasangan string; kunci maksimal 64 dan nilai maksimal 512 karakter.
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
