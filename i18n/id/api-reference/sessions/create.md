---
i18nSource: 91ce9f65766e9662
title: Membuat Session
description: Buat Session untuk Agent tersimpan atau inline dengan POST /v1/agents/sessions, opsional dengan streaming giliran pertama.
aside: false
outline: false
apiReference:
  title: Membuat Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: Buat Session untuk versi Agent tersimpan, atau untuk Agent inline yang didefinisikan dalam permintaan. Konfigurasi Agent, versi Skill, dan koneksi MCP dibekukan selama masa hidup Session. Session selalu berjalan di cloud terkelola SandBase, sehingga tidak ada lingkungan eksekusi yang perlu dipilih. Dengan stream=true dan input awal, responsnya berupa stream Server-Sent Events 201 dari giliran pertama, bukan Session JSON. Penerimaan eksekusi (saldo dan status organisasi) diperiksa di sini. OpenAI SDK memerlukan argumen environment; lihat Kompatibilitas OpenAI (/agents/openai-compatibility).
  groups:
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opsional. Jika dihilangkan, layanan akan membuatkannya, sehingga permintaan yang diulang dapat membuat duplikat. Kirim kunci stabil Anda sendiri untuk percobaan ulang.
    - title: Body permintaan
      description: Objek JSON ketat.
      fields:
        - name: agent_id
          type: string
          required: false
          description: ID Agent tersimpan (prefiks agt_). Agent harus aktif dengan projection_status ready. Kirim agent_id, agent, atau keduanya.
        - name: agent
          type: object
          required: false
          description: Konfigurasi Agent. Field yang diterima adalah model, instructions, runtime_profile (codex, claude, atau mcode; default codex), service_tier, tools, text, reasoning, dan multi_agent, yang divalidasi seperti pada Create Agent. Tanpa agent_id, objek ini mendefinisikan Agent inline dan model wajib diisi; Agent inline tidak membawa Skills atau koneksi MCP. Dengan agent_id, setiap field yang Anda kirim menggantikan field tersebut pada versi tersimpan khusus untuk Session ini. Field yang tidak dikenal menghasilkan 400.
        - name: version
          type: integer
          required: false
          description: Versi Agent. Default-nya versi saat ini. Tidak diperbolehkan dengan Agent inline.
        - name: title
          type: string
          required: false
          description: Judul Session.
        - name: input
          type: string | array
          required: false
          description: 'Input pertama opsional: string, atau array dengan tepat satu pesan, misalnya [{"role":"user","content":[{"type":"input_text","text":"…"}]}]. Objek tunggal menghasilkan 400.'
        - name: model
          type: string
          required: false
          description: Override model. agent.model adalah bentuk OpenAI SDK; jika keduanya dikirim, nilainya harus sama.
        - name: metadata
          type: object
          required: false
          description: Maksimal 16 pasangan string.
        - name: stream
          type: boolean
          required: false
          description: "Jika true, memerlukan input yang tidak kosong dan mengembalikan 201 dengan body text/event-stream. Event menggunakan format Stream events (event: <type>, data: <json>); event pertama, agent.session.created, membawa snapshot Session, diikuti event item dan output dari giliran tersebut. Error validasi, penerimaan, dan error lain sebelum stream dimulai mengembalikan error JSON biasa. Default false."
        - name: environment
          type: object
          required: false
          description: Hanya untuk kompatibilitas OpenAI SDK. Hilangkan dalam panggilan HTTP langsung; {"type":"openai_hosted"} diterima dan tipe lain menghasilkan 400.
        - name: model_provider
          type: object
          required: false
          description: Kredensial model. Hilangkan untuk menggunakan API key pemanggil Anda. {"type":"custom","base_url":"https://…","api_key":"…"} memanggil endpoint Anda sendiri yang kompatibel dengan OpenAI. Hanya-tulis.
        - name: github_workspace
          type: object
          required: false
          description: 'Repositori GitHub yang di-clone ke /workspace untuk Session ini: {"repository_id":"1195090324","ref":"main","connection_id":"plc_…"}. Hanya repository_id yang wajib; ref default-nya branch default. Jika dihilangkan atau null, repositori workspace Agent digunakan jika ada, dan jika tidak ada, tidak ada yang di-clone. Repositori harus berada dalam cakupan koneksi GitHub milik Agent. Lihat Workspace repositori GitHub (/agents/github-workspace).'
    - title: Objek Session
      description: Dikembalikan oleh create, get, update, rename, archive, dan unarchive.
      fields:
        - name: id
          type: string
          required: true
          description: ID Session dengan prefiks ses_.
        - name: status
          type: string
          required: true
          description: "Status eksekusi: idle, in_progress, atau failed. requires_action belum didukung dan muncul sebagai 502 executor_contract_error."
        - name: lifecycle_status
          type: string
          required: true
          description: active atau archived. Session yang diarsipkan menolak input.
        - name: failure
          type: object · null
          required: true
          description: Kegagalan publik dengan code, message, action, dan retryable opsional.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: Versi Agent yang dibekukan dan model efektif.
        - name: agent · usage
          type: object · object | null
          required: true
          description: Snapshot berbentuk OpenAI dari konfigurasi Agent efektif, serta penggunaan token (null hingga sebuah giliran melaporkan penggunaan).
        - name: source · source_id
          type: string · null
          required: false
          description: Asal Session. Session yang dibuat dengan POST /v1/agents/sessions melaporkan direct dan source_id null.
        - name: row_version
          type: integer
          required: true
          description: Token compare-and-set untuk rename, archive, dan unarchive.
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
