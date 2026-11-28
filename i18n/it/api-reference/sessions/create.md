---
i18nSource: 91ce9f65766e9662
title: Creare una Session
description: Crea una Session per un Agent salvato o inline con POST /v1/agents/sessions, con streaming facoltativo del primo turno.
aside: false
outline: false
apiReference:
  title: Creare una Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: Crea una Session per una versione salvata di un Agent, oppure per un Agent inline definito nella richiesta. La configurazione dell'Agent, le versioni delle Skills e le connessioni MCP restano congelate per tutta la durata della Session. Le Sessions vengono sempre eseguite nel cloud gestito di SandBase, quindi non c'è un ambiente di esecuzione da scegliere. Con stream=true e un input iniziale, la risposta è uno stream Server-Sent Events 201 del primo turno invece di una Session in JSON. Qui viene verificata l'ammissione all'esecuzione (saldo e stato dell'organizzazione). L'SDK OpenAI richiede un argomento environment; vedi Compatibilità con OpenAI (/agents/openai-compatibility).
  groups:
    - title: Header
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Facoltativo. Se omesso, il servizio ne genera uno, quindi una richiesta ritentata può creare un duplicato. Per i retry invia una tua chiave stabile.
    - title: Body della richiesta
      description: Oggetto JSON rigoroso.
      fields:
        - name: agent_id
          type: string
          required: false
          description: ID dell'Agent salvato (prefisso agt_). L'Agent deve essere active con projection_status ready. Invia agent_id, agent o entrambi.
        - name: agent
          type: object
          required: false
          description: Configurazione dell'Agent. I campi accettati sono model, instructions, runtime_profile (codex, claude o mcode; predefinito codex), service_tier, tools, text, reasoning e multi_agent, validati come in Create Agent. Senza agent_id definisce un Agent inline e model è obbligatorio; gli Agents inline non hanno Skills né connessioni MCP. Con agent_id, ogni campo inviato sostituisce quel campo della versione salvata solo per questa Session. I campi sconosciuti restituiscono 400.
        - name: version
          type: integer
          required: false
          description: Versione dell'Agent. Per impostazione predefinita è la versione corrente. Non consentito con un Agent inline.
        - name: title
          type: string
          required: false
          description: Titolo della Session.
        - name: input
          type: string | array
          required: false
          description: 'Primo input facoltativo: una stringa, oppure un array con esattamente un messaggio, ad esempio [{"role":"user","content":[{"type":"input_text","text":"…"}]}]. Un oggetto singolo restituisce 400.'
        - name: model
          type: string
          required: false
          description: Override del modello. agent.model è la forma dell'SDK OpenAI; se li invii entrambi devono coincidere.
        - name: metadata
          type: object
          required: false
          description: Fino a 16 coppie di stringhe.
        - name: stream
          type: boolean
          required: false
          description: "Se true, richiede un input non vuoto e restituisce 201 con un body text/event-stream. Gli eventi usano il formato Stream events (event: <type>, data: <json>); il primo, agent.session.created, contiene lo snapshot della Session, seguito dagli eventi item e output del turno. Gli errori di validazione, di ammissione e gli altri errori prima dell'avvio dello stream restituiscono il normale errore JSON. Predefinito false."
        - name: environment
          type: object
          required: false
          description: Solo per compatibilità con l'SDK OpenAI. Omettilo nelle chiamate HTTP dirette; {"type":"openai_hosted"} è accettato e qualsiasi altro type restituisce 400.
        - name: model_provider
          type: object
          required: false
          description: Credenziale del modello. Omettila per usare la API key con cui effettui la chiamata. {"type":"custom","base_url":"https://…","api_key":"…"} chiama un tuo endpoint compatibile con OpenAI. Solo scrittura.
        - name: github_workspace
          type: object
          required: false
          description: "Repository GitHub da clonare in /workspace per questa Session: {\"repository_id\":\"1195090324\",\"ref\":\"main\",\"connection_id\":\"plc_…\"}. È obbligatorio solo repository_id; ref usa per impostazione predefinita il branch di default. Se omesso o null usa il repository del workspace dell'Agent, se presente, altrimenti non clona nulla. Il repository deve rientrare nell'ambito della connessione GitHub dell'Agent. Vedi Workspace con repository GitHub (/agents/github-workspace)."
    - title: Oggetto Session
      description: Restituito da create, get, update, rename, archive e unarchive.
      fields:
        - name: id
          type: string
          required: true
          description: ID della Session con prefisso ses_.
        - name: status
          type: string
          required: true
          description: "Stato di esecuzione: idle, in_progress o failed. requires_action non è ancora supportato e si presenta come 502 executor_contract_error."
        - name: lifecycle_status
          type: string
          required: true
          description: active o archived. Le Sessions archiviate rifiutano gli input.
        - name: failure
          type: object · null
          required: true
          description: Errore pubblico con code, message, action e retryable facoltativo.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: Versione dell'Agent congelata e modello effettivo.
        - name: agent · usage
          type: object · object | null
          required: true
          description: Snapshot in formato OpenAI della configurazione effettiva dell'Agent e consumo di token (null finché un turno non riporta l'usage).
        - name: source · source_id
          type: string · null
          required: false
          description: Origine della Session. Le Sessions create con POST /v1/agents/sessions riportano direct e un source_id null.
        - name: row_version
          type: integer
          required: true
          description: Token compare-and-set per rename, archive e unarchive.
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
