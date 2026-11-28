---
i18nSource: 91ce9f65766e9662
title: Utwórz Session
description: Utwórz Session dla zapisanego lub wbudowanego Agenta za pomocą POST /v1/agents/sessions, opcjonalnie strumieniując pierwszą turę.
aside: false
outline: false
apiReference:
  title: Utwórz Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: Tworzy Session dla zapisanej wersji Agenta lub dla wbudowanego Agenta zdefiniowanego w żądaniu. Konfiguracja Agenta, wersje Skills i połączenia MCP są zamrożone na cały czas życia Session. Sessions zawsze działają w hostowanej chmurze SandBase, więc nie wybiera się środowiska wykonawczego. Przy stream=true i początkowym input odpowiedzią jest strumień Server-Sent Events z kodem 201 zawierający pierwszą turę zamiast Session w formacie JSON. Dopuszczenie do wykonania (saldo i status organizacji) jest sprawdzane w tym miejscu. OpenAI SDK wymaga argumentu environment; zobacz Zgodność z OpenAI (/agents/openai-compatibility).
  groups:
    - title: Nagłówki
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcjonalny. Gdy go pominiesz, usługa wygeneruje klucz, więc ponowione żądanie może utworzyć duplikat. Przy ponawianiu wysyłaj własny, stały klucz.
    - title: Treść żądania
      description: Ścisły obiekt JSON.
      fields:
        - name: agent_id
          type: string
          required: false
          description: Identyfikator zapisanego Agenta (prefiks agt_). Agent musi być aktywny i mieć projection_status ready. Wyślij agent_id, agent lub oba.
        - name: agent
          type: object
          required: false
          description: Konfiguracja Agenta. Akceptowane pola to model, instructions, runtime_profile (codex, claude lub mcode; domyślnie codex), service_tier, tools, text, reasoning i multi_agent, walidowane tak jak w Create Agent. Bez agent_id definiuje wbudowanego Agenta i model jest wymagany; wbudowane Agents nie mają Skills ani połączeń MCP. Z agent_id każde wysłane pole zastępuje odpowiednie pole zapisanej wersji tylko dla tej Session. Nieznane pola zwracają 400.
        - name: version
          type: integer
          required: false
          description: Wersja Agenta. Domyślnie bieżąca wersja. Niedozwolone z wbudowanym Agentem.
        - name: title
          type: string
          required: false
          description: Tytuł Session.
        - name: input
          type: string | array
          required: false
          description: 'Opcjonalne pierwsze wejście: ciąg znaków lub tablica z dokładnie jedną wiadomością, np. [{"role":"user","content":[{"type":"input_text","text":"…"}]}]. Sam obiekt zwraca 400.'
        - name: model
          type: string
          required: false
          description: Nadpisanie modelu. agent.model to forma z OpenAI SDK; jeśli wysłano oba, muszą być zgodne.
        - name: metadata
          type: object
          required: false
          description: Do 16 par ciągów znaków.
        - name: stream
          type: boolean
          required: false
          description: "Gdy true, wymaga niepustego input i zwraca 201 z treścią text/event-stream. Zdarzenia mają format Stream events (event: <type>, data: <json>); pierwsze, agent.session.created, zawiera migawkę Session, a po nim następują zdarzenia elementów i wyników tury. Błędy walidacji, dopuszczenia i inne błędy przed rozpoczęciem strumienia zwracają zwykły błąd JSON. Domyślnie false."
        - name: environment
          type: object
          required: false
          description: Tylko dla zgodności z OpenAI SDK. Pomiń w bezpośrednich wywołaniach HTTP; {"type":"openai_hosted"} jest akceptowany, a każdy inny type zwraca 400.
        - name: model_provider
          type: object
          required: false
          description: Poświadczenie modelu. Pomiń, aby użyć klucza API, którym wywołujesz. {"type":"custom","base_url":"https://…","api_key":"…"} wywołuje Twój własny endpoint zgodny z OpenAI. Tylko do zapisu.
        - name: github_workspace
          type: object
          required: false
          description: 'Repozytorium GitHub klonowane do /workspace dla tej Session: {"repository_id":"1195090324","ref":"main","connection_id":"plc_…"}. Wymagane jest tylko repository_id; ref domyślnie wskazuje domyślną gałąź. Pominięcie lub null używa repozytorium obszaru roboczego Agenta, jeśli istnieje, a w przeciwnym razie nic nie jest klonowane. Repozytorium musi mieścić się w zakresie połączenia GitHub Agenta. Zobacz Obszar roboczy z repozytorium GitHub (/agents/github-workspace).'
    - title: Obiekt Session
      description: Zwracany przez create, get, update, rename, archive i unarchive.
      fields:
        - name: id
          type: string
          required: true
          description: Identyfikator Session z prefiksem ses_.
        - name: status
          type: string
          required: true
          description: "Status wykonania: idle, in_progress lub failed. requires_action nie jest jeszcze obsługiwany i pojawia się jako 502 executor_contract_error."
        - name: lifecycle_status
          type: string
          required: true
          description: active lub archived. Zarchiwizowane Sessions odrzucają wejście.
        - name: failure
          type: object · null
          required: true
          description: Publiczny błąd z code, message, action i opcjonalnym retryable.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: Zamrożona wersja Agenta i efektywny model.
        - name: agent · usage
          type: object · object | null
          required: true
          description: Migawka efektywnej konfiguracji Agenta w formacie OpenAI oraz użycie tokenów (null, dopóki tura nie zgłosi użycia).
        - name: source · source_id
          type: string · null
          required: false
          description: Pochodzenie Session. Sessions utworzone przez POST /v1/agents/sessions zgłaszają direct i source_id równe null.
        - name: row_version
          type: integer
          required: true
          description: Token compare-and-set dla rename, archive i unarchive.
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
