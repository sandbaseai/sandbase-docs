---
i18nSource: 91ce9f65766e9662
title: Créer une Session
description: Créer une Session pour un Agent enregistré ou inline avec POST /v1/agents/sessions, avec streaming facultatif du premier tour.
aside: false
outline: false
apiReference:
  title: Créer une Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: "Crée une Session pour une version d'Agent enregistrée, ou pour un Agent inline défini dans la requête. La configuration de l'Agent, les versions des Skills et les connexions MCP sont figées pendant toute la durée de vie de la Session. Les Sessions s'exécutent toujours dans le cloud hébergé de SandBase : il n'y a donc pas d'environnement d'exécution à choisir. Avec stream=true et une entrée initiale, la réponse est un flux Server-Sent Events 201 du premier tour au lieu d'une Session JSON. L'admission à l'exécution (solde et statut de l'organisation) est vérifiée ici. Le SDK OpenAI exige un argument environment ; consultez Compatibilité OpenAI (/agents/openai-compatibility)."
  groups:
    - title: En-têtes
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Facultatif. S'il est omis, le service en génère un ; une requête réessayée peut alors créer un doublon. Envoyez votre propre clé stable pour les nouvelles tentatives.
    - title: Corps de la requête
      description: Objet JSON strict.
      fields:
        - name: agent_id
          type: string
          required: false
          description: ID de l'Agent enregistré (préfixe agt_). L'Agent doit être actif avec projection_status ready. Envoyez agent_id, agent ou les deux.
        - name: agent
          type: object
          required: false
          description: Configuration de l'Agent. Les champs acceptés sont model, instructions, runtime_profile (codex, claude ou mcode ; codex par défaut), service_tier, tools, text, reasoning et multi_agent, validés comme dans Create Agent. Sans agent_id, il définit un Agent inline et model est obligatoire ; les Agents inline n'ont ni Skills ni connexions MCP. Avec agent_id, chaque champ envoyé remplace le champ correspondant de la version enregistrée, pour cette Session uniquement. Les champs inconnus renvoient 400.
        - name: version
          type: integer
          required: false
          description: Version de l'Agent. Par défaut, la version actuelle. Non autorisé avec un Agent inline.
        - name: title
          type: string
          required: false
          description: Titre de la Session.
        - name: input
          type: string | array
          required: false
          description: 'Première entrée facultative : une chaîne, ou un tableau contenant exactement un message, par ex. [{"role":"user","content":[{"type":"input_text","text":"…"}]}]. Un objet seul renvoie 400.'
        - name: model
          type: string
          required: false
          description: Remplacement du modèle. agent.model est la forme du SDK OpenAI ; si les deux sont envoyés, ils doivent correspondre.
        - name: metadata
          type: object
          required: false
          description: Jusqu'à 16 paires de chaînes.
        - name: stream
          type: boolean
          required: false
          description: "Lorsque la valeur est true, une entrée non vide est requise et la réponse est un 201 avec un corps text/event-stream. Les événements utilisent le format Stream events (event: <type>, data: <json>) ; le premier, agent.session.created, contient l'instantané de la Session, suivi des événements d'éléments et de sortie du tour. Les erreurs de validation, d'admission et les autres erreurs survenant avant le début du flux renvoient l'erreur JSON habituelle. false par défaut."
        - name: environment
          type: object
          required: false
          description: Uniquement pour la compatibilité avec le SDK OpenAI. Omettez-le dans les appels HTTP directs ; {"type":"openai_hosted"} est accepté et tout autre type renvoie 400.
        - name: model_provider
          type: object
          required: false
          description: Identifiant du modèle. Omettez-le pour utiliser votre clé API d'appel. {"type":"custom","base_url":"https://…","api_key":"…"} appelle votre propre endpoint compatible OpenAI. En écriture seule.
        - name: github_workspace
          type: object
          required: false
          description: "Dépôt GitHub à cloner dans /workspace pour cette Session : {\"repository_id\":\"1195090324\",\"ref\":\"main\",\"connection_id\":\"plc_…\"}. Seul repository_id est obligatoire ; ref correspond par défaut à la branche par défaut. Si la valeur est omise ou null, le dépôt de workspace de l'Agent est utilisé s'il existe ; sinon, rien n'est cloné. Le dépôt doit faire partie du périmètre de la connexion GitHub de l'Agent. Consultez Workspace de dépôt GitHub (/agents/github-workspace)."
    - title: Objet Session
      description: Renvoyé par create, get, update, rename, archive et unarchive.
      fields:
        - name: id
          type: string
          required: true
          description: ID de la Session avec le préfixe ses_.
        - name: status
          type: string
          required: true
          description: "Statut d'exécution : idle, in_progress ou failed. requires_action n'est pas encore pris en charge et apparaît sous la forme 502 executor_contract_error."
        - name: lifecycle_status
          type: string
          required: true
          description: active ou archived. Les Sessions archivées refusent les entrées.
        - name: failure
          type: object · null
          required: true
          description: Échec public avec code, message, action et retryable facultatif.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: Version d'Agent figée et modèle effectif.
        - name: agent · usage
          type: object · object | null
          required: true
          description: Instantané au format OpenAI de la configuration effective de l'Agent, et utilisation des tokens (null tant qu'aucun tour ne rapporte d'utilisation).
        - name: source · source_id
          type: string · null
          required: false
          description: Origine de la Session. Les Sessions créées avec POST /v1/agents/sessions indiquent direct et un source_id null.
        - name: row_version
          type: integer
          required: true
          description: Jeton de compare-and-set pour rename, archive et unarchive.
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
