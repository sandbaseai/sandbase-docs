---
i18nSource: 1b680f7f0804feb7
title: Mettre à jour un Agent
description: Mettre à jour partiellement un Agent avec la mise à jour POST au style du SDK OpenAI.
aside: false
outline: false
apiReference:
  title: Mettre à jour un Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: Mise à jour partielle au style SDK. Les champs fournis remplacent les valeurs enregistrées et créent une nouvelle version ; les champs omis conservent leurs valeurs. Aucun row_version n'est nécessaire. description et note ne sont pas acceptés ici ; utilisez Replace (PATCH) pour ces champs. Les Agents archivés renvoient 404.
  groups:
    - title: Paramètres de chemin
      fields:
        - name: agent_id
          type: string
          required: true
          description: ID de l'Agent (préfixe agt_).
    - title: En-têtes
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Facultatif. S'il est omis, le service en génère un ; une requête réessayée peut alors créer un doublon. Envoyez votre propre clé stable pour les nouvelles tentatives.
    - title: Corps de la requête
      description: N'importe quel sous-ensemble de ces champs. Les autres champs renvoient 400.
      fields:
        - name: model
          type: string
          required: false
          description: ID de modèle issu de la Models API, 200 caractères au maximum.
        - name: name
          type: string
          required: false
          description: Nom d'affichage, 128 caractères au maximum.
        - name: instructions
          type: string
          required: false
          description: Instructions système, 256 KiB au maximum.
        - name: runtime_profile
          type: string
          required: false
          description: "Runtime d'exécution : codex (par défaut), claude ou mcode."
        - name: skills
          type: array
          required: false
          description: "Références de Skills : {\"skill_id\": \"skl_…\", \"version\": null | \"<version>\"}. 32 au maximum. Pour une nouvelle liaison, null fige la version par défaut actuelle au moment de l'enregistrement de l'Agent. Pour une liaison existante, null conserve sa version figée ; indiquez une version explicite pour mettre à niveau."
        - name: mcp_connections
          type: array
          required: false
          description: "Références MCP : {connection_id, server_label, allowed_tools, required}. 32 au maximum ; server_label doit être unique dans l'Agent."
        - name: tools
          type: array
          required: false
          description: Jusqu'à 64 outils de fonction et au plus un outil web_search. Les Sessions exigent actuellement que le mode web_search soit désactivé, et les résultats de fonctions côté client ne sont pas encore pris en charge.
        - name: text
          type: object
          required: false
          description: format.type text ou json_schema (avec un schéma de type object) ; verbosity low, medium ou high.
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
          description: Jusqu'à 16 paires de chaînes ; clés de 64 caractères et valeurs de 512 caractères au maximum.
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
