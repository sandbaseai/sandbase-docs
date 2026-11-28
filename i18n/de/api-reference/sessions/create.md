---
i18nSource: 91ce9f65766e9662
title: Session erstellen
description: Mit POST /v1/agents/sessions eine Session für einen gespeicherten oder Inline-Agent erstellen und optional den ersten Turn streamen.
aside: false
outline: false
apiReference:
  title: Session erstellen
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: Erstellt eine Session für eine gespeicherte Agent-Version oder für einen Inline-Agent, der in der Anfrage definiert wird. Agent-Konfiguration, Skill-Versionen und MCP-Verbindungen werden für die gesamte Lebensdauer der Session eingefroren. Sessions laufen immer in der gehosteten Cloud von SandBase, daher gibt es keine Ausführungsumgebung zur Auswahl. Mit stream=true und einer initialen Eingabe ist die Antwort ein 201-Server-Sent-Events-Stream des ersten Turns statt einer JSON-Session. Die Ausführungszulassung (Guthaben und Organisationsstatus) wird hier geprüft. Das OpenAI SDK verlangt ein environment-Argument; siehe OpenAI-Kompatibilität (/agents/openai-compatibility).
  groups:
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Optional. Fehlt er, erzeugt der Dienst einen eigenen, sodass eine wiederholte Anfrage ein Duplikat anlegen kann. Sende für Wiederholungen deinen eigenen stabilen Schlüssel.
    - title: Request-Body
      description: Striktes JSON-Objekt.
      fields:
        - name: agent_id
          type: string
          required: false
          description: ID eines gespeicherten Agents (Präfix agt_). Der Agent muss aktiv sein und projection_status ready haben. Sende agent_id, agent oder beides.
        - name: agent
          type: object
          required: false
          description: Agent-Konfiguration. Zulässige Felder sind model, instructions, runtime_profile (codex, claude oder mcode; Standard codex), service_tier, tools, text, reasoning und multi_agent, validiert wie bei Agent erstellen. Ohne agent_id definiert sie einen Inline-Agent, und model ist erforderlich; Inline-Agents haben keine Skills oder MCP-Verbindungen. Mit agent_id ersetzt jedes gesendete Feld das entsprechende Feld der gespeicherten Version, nur für diese Session. Unbekannte Felder liefern 400.
        - name: version
          type: integer
          required: false
          description: Agent-Version. Standard ist die aktuelle Version. Bei einem Inline-Agent nicht erlaubt.
        - name: title
          type: string
          required: false
          description: Titel der Session.
        - name: input
          type: string | array
          required: false
          description: 'Optionale erste Eingabe: ein String oder ein Array mit genau einer Nachricht, z. B. [{"role":"user","content":[{"type":"input_text","text":"…"}]}]. Ein einzelnes Objekt liefert 400.'
        - name: model
          type: string
          required: false
          description: Modell-Override. agent.model ist die Form des OpenAI SDK; werden beide gesendet, müssen sie übereinstimmen.
        - name: metadata
          type: object
          required: false
          description: Bis zu 16 String-Paare.
        - name: stream
          type: boolean
          required: false
          description: "Bei true ist eine nicht leere input erforderlich, und die Antwort ist 201 mit einem text/event-stream-Body. Events verwenden das Stream-Event-Format (event: <type>, data: <json>); das erste, agent.session.created, enthält den Session-Snapshot, danach folgen die Item- und Output-Events des Turns. Validierungs-, Zulassungs- und andere Fehler vor Beginn des Streams liefern den normalen JSON-Fehler. Standard false."
        - name: environment
          type: object
          required: false
          description: Nur für die Kompatibilität mit dem OpenAI SDK. Lass es bei direkten HTTP-Aufrufen weg; {"type":"openai_hosted"} wird akzeptiert, jeder andere type liefert 400.
        - name: model_provider
          type: object
          required: false
          description: Modell-Credential. Lass es weg, um deinen aufrufenden API-Schlüssel zu verwenden. {"type":"custom","base_url":"https://…","api_key":"…"} ruft deinen eigenen OpenAI-kompatiblen Endpunkt auf. Nur schreibbar.
        - name: github_workspace
          type: object
          required: false
          description: 'GitHub-Repository, das für diese Session nach /workspace geklont wird: {"repository_id":"1195090324","ref":"main","connection_id":"plc_…"}. Nur repository_id ist erforderlich; ref ist standardmäßig der Default-Branch. Fehlt der Wert oder ist er null, wird das Workspace-Repository des Agents verwendet, falls vorhanden, sonst wird nichts geklont. Das Repository muss im Geltungsbereich der GitHub-Verbindung des Agents liegen. Siehe GitHub-Repository-Workspace (/agents/github-workspace).'
    - title: Session-Objekt
      description: Wird von create, get, update, rename, archive und unarchive zurückgegeben.
      fields:
        - name: id
          type: string
          required: true
          description: Session-ID mit dem Präfix ses_.
        - name: status
          type: string
          required: true
          description: "Ausführungsstatus: idle, in_progress oder failed. requires_action wird noch nicht unterstützt und erscheint als 502 executor_contract_error."
        - name: lifecycle_status
          type: string
          required: true
          description: active oder archived. Archivierte Sessions lehnen Eingaben ab.
        - name: failure
          type: object · null
          required: true
          description: Öffentlicher Fehler mit code, message, action und optional retryable.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: Eingefrorene Agent-Version und effektives Modell.
        - name: agent · usage
          type: object · object | null
          required: true
          description: Snapshot der effektiven Agent-Konfiguration im OpenAI-Format sowie Token-Verbrauch (null, bis ein Turn einen Verbrauch meldet).
        - name: source · source_id
          type: string · null
          required: false
          description: Herkunft der Session. Mit POST /v1/agents/sessions erstellte Sessions melden direct und eine source_id von null.
        - name: row_version
          type: integer
          required: true
          description: Compare-and-Set-Token für rename, archive und unarchive.
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
