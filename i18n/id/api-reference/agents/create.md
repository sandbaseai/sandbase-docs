---
i18nSource: f3150233afd08b90
title: Buat Agent
description: Buat Agent tersimpan dan berversi dengan POST /v1/agents.
aside: false
outline: false
apiReference:
  title: Buat Agent
  operation: Agents
  method: POST
  path: /v1/agents
  description: "Buat Agent tersimpan pada versi 1. Body berupa JSON ketat: field yang tidak dikenal mengembalikan 400. multi_agent harus dihilangkan atau bernilai null."
  groups:
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opsional. Jika dihilangkan, layanan akan membuatnya, sehingga permintaan yang dicoba ulang dapat membuat duplikat. Kirim key stabil Anda sendiri untuk percobaan ulang.
    - title: Body permintaan
      description: Objek JSON.
      fields:
        - name: model
          type: string
          required: true
          description: ID model wajib dari Models API, hingga 200 karakter. Tidak ada nilai default; menghilangkan model mengembalikan 400. Contoh menggunakan deepseek/deepseek-v4-flash.
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
          description: 'Referensi Skill: {"skill_id": "skl_…", "version": null | "<version>"}. Hingga 32. Pada binding baru, null menyematkan versi default saat ini ketika Agent disimpan. Untuk binding yang sudah ada, null mempertahankan versi yang disematkan; berikan versi eksplisit untuk meng-upgrade.'
        - name: mcp_connections
          type: array
          required: false
          description: 'Referensi MCP: {connection_id, server_label, allowed_tools, required}. Hingga 32; server_label harus unik dalam Agent. Hilangkan untuk mendapatkan tools SandBase bawaan ({"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin"}); daftar yang Anda kirim menggantikan default tersebut, dan [] membuat Agent tanpa tools. Lihat Tools SandBase bawaan (/agents/mcp-tools#built-in-sandbase-tools).'
        - name: tools
          type: array
          required: false
          description: Hingga 64 function tool ditambah paling banyak satu tool web_search. Sessions saat ini mengharuskan mode web_search dinonaktifkan, dan hasil function di sisi klien belum didukung.
        - name: text
          type: object
          required: false
          description: format.type text atau json_schema (dengan skema object); verbosity low, medium, atau high.
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
          description: Hingga 16 pasangan string; key hingga 64 dan nilai hingga 512 karakter.
        - name: description
          type: string
          required: false
          description: Deskripsi lebih panjang, hingga 4096 karakter.
        - name: note
          type: string
          required: false
          description: Catatan perubahan yang dicatat pada versi 1.
    - title: Objek Agent
      description: Dikembalikan oleh create, get, update, archive, unarchive, restore, dan clone.
      fields:
        - name: id
          type: string
          required: true
          description: ID Agent dengan prefiks agt_.
        - name: object
          type: string
          required: true
          description: Selalu agent.
        - name: version
          type: integer
          required: true
          description: Versi saat ini. Setiap penulisan yang efektif membuat versi baru.
        - name: row_version
          type: integer
          required: true
          description: Token compare-and-set untuk PATCH, archive, unarchive, dan restore.
        - name: status
          type: string
          required: true
          description: active atau archived.
        - name: projection_status
          type: string
          required: true
          description: Kesiapan eksekusi versi saat ini. Sessions memerlukan ready; Agent baru dapat sesaat melaporkan pending.
        - name: runtime_profile
          type: string
          required: true
          description: codex, claude, atau mcode.
        - name: visibility
          type: string
          required: true
          description: private untuk Agents Anda; public untuk entri katalog.
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Detik Unix. archived_at bernilai null selama active.
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
