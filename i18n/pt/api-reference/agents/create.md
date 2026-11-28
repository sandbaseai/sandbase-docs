---
i18nSource: f3150233afd08b90
title: Criar Agent
description: Crie um Agent salvo e versionado com POST /v1/agents.
aside: false
outline: false
apiReference:
  title: Criar Agent
  operation: Agents
  method: POST
  path: /v1/agents
  description: "Cria um Agent salvo na versão 1. O corpo é JSON estrito: campos desconhecidos retornam 400. multi_agent deve ser omitido ou null."
  groups:
    - title: Cabeçalhos
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcional. Quando omitido, o serviço gera um, então uma requisição repetida pode criar uma duplicata. Envie sua própria chave estável para novas tentativas.
    - title: Corpo da requisição
      description: Objeto JSON.
      fields:
        - name: model
          type: string
          required: true
          description: ID de modelo obrigatório da Models API, com até 200 caracteres. Não há valor padrão; omitir model retorna 400. Os exemplos usam deepseek/deepseek-v4-flash.
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
          description: 'Referências de Skills: {"skill_id": "skl_…", "version": null | "<version>"}. Até 32. Em um novo vínculo, null fixa o padrão atual no momento em que o Agent é salvo. Em um vínculo existente, null preserva a versão fixada; informe uma versão explícita para atualizar.'
        - name: mcp_connections
          type: array
          required: false
          description: 'Referências de MCP: {connection_id, server_label, allowed_tools, required}. Até 32; server_label deve ser único no Agent. Omita para obter as ferramentas integradas da SandBase ({"connection_id": "builtin:sandbase", "server_label": "sandbase_builtin"}); uma lista enviada substitui esse padrão, e [] cria um Agent sem ferramentas. Consulte Ferramentas integradas da SandBase (/agents/mcp-tools#built-in-sandbase-tools).'
        - name: tools
          type: array
          required: false
          description: Até 64 ferramentas de função, mais no máximo uma ferramenta web_search. No momento, as Sessions exigem o modo web_search desativado, e resultados de funções do lado do cliente ainda não são suportados.
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
          description: Descrição mais longa, com até 4096 caracteres.
        - name: note
          type: string
          required: false
          description: Nota de alteração registrada na versão 1.
    - title: Objeto Agent
      description: Retornado por create, get, update, archive, unarchive, restore e clone.
      fields:
        - name: id
          type: string
          required: true
          description: ID do Agent com o prefixo agt_.
        - name: object
          type: string
          required: true
          description: Sempre agent.
        - name: version
          type: integer
          required: true
          description: Versão atual. Cada gravação efetiva cria uma nova versão.
        - name: row_version
          type: integer
          required: true
          description: Token de compare-and-set para PATCH, archive, unarchive e restore.
        - name: status
          type: string
          required: true
          description: active ou archived.
        - name: projection_status
          type: string
          required: true
          description: Prontidão de execução da versão atual. As Sessions exigem ready; um Agent novo pode informar pending por um breve período.
        - name: runtime_profile
          type: string
          required: true
          description: codex, claude ou mcode.
        - name: visibility
          type: string
          required: true
          description: private para os seus Agents; public para entradas do catálogo.
        - name: created_at · updated_at · archived_at
          type: integer · null
          required: true
          description: Segundos Unix. archived_at é null enquanto o Agent está ativo.
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
