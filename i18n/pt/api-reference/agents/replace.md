---
i18nSource: 4e711691737c9671
title: Substituir Agent (CAS)
description: Atualize um Agent com compare-and-set em row_version.
aside: false
outline: false
apiReference:
  title: Substituir Agent (CAS)
  operation: Agents
  method: PATCH
  path: /v1/agents/{agent_id}
  description: Atualização de produto com compare-and-set. row_version é obrigatório e deve ser igual ao valor atual; caso contrário, retorna 409. Os campos enviados substituem os valores salvos; valores null explícitos retornam 400. Use este formato quando vários editores puderem alterar o mesmo Agent.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: agent_id
          type: string
          required: true
          description: ID do Agent (prefixo agt_).
    - title: Headers
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcional. Quando omitido, o serviço gera um, então uma requisição repetida pode criar uma duplicata. Envie sua própria chave estável para novas tentativas.
    - title: Corpo da requisição
      description: row_version mais qualquer subconjunto dos campos do Agent.
      fields:
        - name: row_version
          type: integer
          required: true
          description: O row_version que você leu por último. Um valor desatualizado retorna 409.
        - name: model
          type: string
          required: false
          description: ID do modelo na Models API, com até 200 caracteres.
        - name: name
          type: string
          required: false
          description: Nome de exibição, com até 128 caracteres.
        - name: instructions
          type: string
          required: false
          description: Instruções de sistema, com até 256 KiB.
        - name: runtime_profile
          type: string
          required: false
          description: "Runtime de execução: codex (padrão), claude ou mcode."
        - name: skills
          type: array
          required: false
          description: 'Referências de Skill: {"skill_id": "skl_…", "version": null | "<version>"}. Até 32. Em um novo vínculo, null fixa o padrão atual quando o Agent é salvo. Em um vínculo existente, null preserva a versão fixada; informe uma versão explícita para atualizar.'
        - name: mcp_connections
          type: array
          required: false
          description: "Referências MCP: {connection_id, server_label, allowed_tools, required}. Até 32; server_label deve ser único no Agent."
        - name: tools
          type: array
          required: false
          description: Até 64 function tools mais no máximo uma ferramenta web_search. Atualmente as Sessions exigem o modo web_search desativado, e resultados de funções do lado do cliente ainda não são suportados.
        - name: text
          type: object
          required: false
          description: format.type text ou json_schema (com um schema de objeto); verbosity low, medium ou high.
        - name: reasoning
          type: object
          required: false
          description: effort none, minimal, low, medium, high, xhigh ou max; summary concise, detailed ou auto.
        - name: service_tier
          type: string
          required: false
          description: auto (padrão), default, flex, priority ou fast.
        - name: metadata
          type: object
          required: false
          description: Até 16 pares de strings; chaves com até 64 e valores com até 512 caracteres.
        - name: description
          type: string
          required: false
          description: Até 4096 caracteres.
        - name: note
          type: string
          required: false
          description: Nota de alteração registrada na nova versão.
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
