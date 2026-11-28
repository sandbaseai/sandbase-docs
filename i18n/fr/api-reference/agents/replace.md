---
i18nSource: 4e711691737c9671
title: Remplacer un Agent (CAS)
description: Mettre à jour un Agent par compare-and-set sur row_version.
aside: false
outline: false
apiReference:
  title: Remplacer un Agent (CAS)
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: Mise à jour produit par compare-and-set. row_version est obligatoire et doit être égal à la valeur actuelle, sinon 409. Les champs fournis remplacent les valeurs enregistrées ; des valeurs null explicites renvoient 400. Utilisez cette forme lorsque plusieurs éditeurs peuvent modifier le même Agent.
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
          description: Facultatif. S'il est omis, le service en génère un ; une requête renvoyée peut alors créer un doublon. Envoyez votre propre clé stable pour les nouvelles tentatives.
    - title: Corps de la requête
      description: row_version plus n'importe quel sous-ensemble des champs de l'Agent.
      fields:
        - name: row_version
          type: integer
          required: true
          description: La dernière row_version que vous avez lue. Une valeur obsolète renvoie 409.
        - name: model
          type: string
          required: false
          description: ID de modèle issu de la Models API, jusqu'à 200 caractères.
        - name: name
          type: string
          required: false
          description: Nom d'affichage, jusqu'à 128 caractères.
        - name: instructions
          type: string
          required: false
          description: Instructions système, jusqu'à 256 Kio.
        - name: runtime_profile
          type: string
          required: false
          description: "Runtime d'exécution : codex (par défaut), claude ou mcode."
        - name: skills
          type: array
          required: false
          description: "Références de Skills : {\"skill_id\": \"skl_…\", \"version\": null | \"<version>\"}. Jusqu'à 32. Pour une nouvelle liaison, null fige la version par défaut actuelle à l'enregistrement de l'Agent. Pour une liaison existante, null conserve la version figée ; indiquez une version explicite pour la mettre à niveau."
        - name: mcp_connections
          type: array
          required: false
          description: "Références MCP : {connection_id, server_label, allowed_tools, required}. Jusqu'à 32 ; server_label doit être unique dans l'Agent."
        - name: tools
          type: array
          required: false
          description: Jusqu'à 64 outils de fonction plus au plus un outil web_search. Les Sessions exigent actuellement que le mode web_search soit désactivé, et les résultats de fonctions côté client ne sont pas encore pris en charge.
        - name: text
          type: object
          required: false
          description: format.type text ou json_schema (avec un schéma de type objet) ; verbosity low, medium ou high.
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
          description: Jusqu'à 16 paires de chaînes ; clés jusqu'à 64 caractères et valeurs jusqu'à 512 caractères.
        - name: description
          type: string
          required: false
          description: Jusqu'à 4096 caractères.
        - name: note
          type: string
          required: false
          description: Note de modification enregistrée sur la nouvelle version.
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
