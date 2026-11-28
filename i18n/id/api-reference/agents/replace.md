---
i18nSource: 4e711691737c9671
title: Mengganti Agent (CAS)
description: Perbarui Agent dengan compare-and-set pada row_version.
aside: false
outline: false
apiReference:
  title: Mengganti Agent (CAS)
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: Pembaruan produk dengan compare-and-set. row_version wajib diisi dan harus sama dengan nilai saat ini; jika tidak, 409. Field yang diberikan menggantikan nilai tersimpan; nilai null eksplisit mengembalikan 400. Gunakan bentuk ini jika beberapa editor dapat mengubah Agent yang sama.
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
          description: Opsional. Jika tidak diberikan, layanan membuatnya sendiri, sehingga permintaan yang dicoba ulang dapat menghasilkan duplikat. Kirim kunci stabil Anda sendiri untuk percobaan ulang.
    - title: Body permintaan
      description: row_version ditambah subset apa pun dari field Agent.
      fields:
        - name: row_version
          type: integer
          required: true
          description: row_version yang terakhir Anda baca. Nilai yang usang mengembalikan 409.
        - name: model
          type: string
          required: false
          description: ID model dari Models API, hingga 200 karakter.
        - name: name
          type: string
          required: false
          description: Nama tampilan, hingga 128 karakter.
        - name: instructions
          type: string
          required: false
          description: Instruksi sistem, hingga 256 KiB.
        - name: runtime_profile
          type: string
          required: false
          description: "Runtime eksekusi: codex (default), claude, atau mcode."
        - name: skills
          type: array
          required: false
          description: 'Referensi Skill: {"skill_id": "skl_…", "version": null | "<version>"}. Hingga 32. Pada binding baru, null mengunci versi default saat ini ketika Agent disimpan. Untuk binding yang sudah ada, null mempertahankan versi yang dikunci; berikan versi eksplisit untuk melakukan upgrade.'
        - name: mcp_connections
          type: array
          required: false
          description: "Referensi MCP: {connection_id, server_label, allowed_tools, required}. Hingga 32; server_label harus unik dalam Agent."
        - name: tools
          type: array
          required: false
          description: Hingga 64 function tool ditambah paling banyak satu tool web_search. Saat ini Session mewajibkan mode web_search dinonaktifkan, dan hasil function dari sisi klien belum didukung.
        - name: text
          type: object
          required: false
          description: format.type text atau json_schema (dengan schema objek); verbosity low, medium, atau high.
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
          description: Hingga 16 pasangan string; kunci hingga 64 dan nilai hingga 512 karakter.
        - name: description
          type: string
          required: false
          description: Hingga 4096 karakter.
        - name: note
          type: string
          required: false
          description: Catatan perubahan yang dicatat pada versi baru.
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
