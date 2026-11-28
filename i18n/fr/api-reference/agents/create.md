---
i18nSource: f3150233afd08b90
title: Créer un Agent
description: Créez un Agent enregistré et versionné avec POST /v1/agents.
aside: false
outline: false
apiReference:
  title: Créer un Agent
  operation: Agents
  method: POST
  path: /v1/agents
  description: "Crée un Agent enregistré en version 1. Le corps est du JSON strict : les champs inconnus renvoient 400. multi_agent doit être omis ou null."
  groups:
    - title: En-têtes
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Facultatif. S'il est omis, le service en génère un, si bien qu'une requête réessayée peut créer un doublon. Envoyez votre propre clé stable pour les nouvelles tentatives.
    - title: Corps de la requête
      description: Objet JSON.
      fields:
        - name: model
          type: string
          required: true
          description: ID de modèle obligatoire issu de l'API Models, 200 caractères maximum. Il n'y a pas de valeur par défaut ; omettre model renvoie 400. Les exemples utilisent deepseek/deepseek-v4-flash.
        - name: name
          type: string
          required: false
          description: Nom d'affichage, 128 caractères maximum.
        - name: instructions
          type: string
          required: false
          description: Instructions système, 256 Kio maximum.
        - name: runtime_profile
          type: string
          required: false
          description: "Runtime d'exécution : codex (par défaut), claude ou mcode."
        - name: skills
          type: array
          required: false
          description: "Références de Skills : {\"skill_id\": \"skl_…\", \"version\": null | \"<version>\"}. 32 maximum. Pour une nouvelle liaison, null épingle la version par défaut actuelle au moment de l'enregistrement de l'Agent. Pour une liaison existante, null conserve la version épinglée ; indiquez une version explicite pour mettre à niveau."
        - name: mcp_connections
          type: array
          required: false
          description: "Références MCP : {connection_id, server_label, allowed_tools, required}. 32 maximum ; server_label doit être unique dans l'Agent. Omettez ce champ pour obtenir les outils SandBase intégrés ({\"connection_id\": \"builtin:sandbase\", \"server_label\": \"sandbase_builtin\"}) ; une liste envoyée remplace cette valeur par défaut, et [] crée un Agent sans outils. Voir Outils SandBase intégrés (/agents/mcp-tools#built-in-sandbase-tools)."
        - name: tools
          type: array
          required: false
          description: Jusqu'à 64 outils function plus au plus un outil web_search. Les Sessions exigent actuellement que le mode web_search soit désactivé, et les résultats de fonctions côté client ne sont pas encore pris en charge.
        - name: text
          type: object
          required: false
          description: format.type text ou json_schema (avec un schéma d'objet) ; verbosity low, medium ou high.
        - name: reasoning
          type: object
          required: false
          description: effort none, minimal, low, medium, high, xhigh ou max ; summary concise, detailed ou auto.
        - name: service_tier
          type: string
          required: false
          description: auto (par défaut), default, flex, priority ou fast.
        - name: metadata
          type: object
          required: false
          description: Jusqu'à 16 paires de chaînes ; clés de 64 caractères maximum et valeurs de 512 caractères maximum.
        - name: description
          type: string
          required: false
          description: Description longue, 4096 caractères maximum.
        - name: note
          type: string
          required: false
          description: Note de modification enregistrée sur la version 1.
    - title: Objet Agent
      description: Renvoyé par create, get, update, archive, unarchive, restore et clone.
      fields:
        - name: id
          type: string
          required: true
          description: ID de l'Agent avec le préfixe agt_.
        - name: object
          type: string
          required: true
          description: Toujours agent.
        - name: version
          type: integer
          required: true
          description: Version actuelle. Chaque écriture effective crée une nouvelle version.
        - name: row_version
          type: integer
          required: true
          description: Jeton compare-and-set pour PATCH, archive, unarchive et restore.
        - name: status
          type: string
          required: true
          description: active ou archived.
        - name: projection_status
          type: string
          required: true
          description: État de préparation à l'exécution de la version actuelle. Les Sessions exigent ready ; un nouvel Agent peut brièvement indiquer pending.
        - name: runtime_profile
          type: string
          required: true
          description: codex, claude ou mcode.
        - name: visibility
          type: string
          required: true
          description: private pour vos Agents ; public pour les entrées du catalogue.
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Secondes Unix. archived_at vaut null tant que l'Agent est actif.
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
