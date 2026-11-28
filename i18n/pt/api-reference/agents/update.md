---
i18nSource: 1b680f7f0804feb7
title: Atualizar Agent
description: Atualize parcialmente um Agent com a atualização POST no estilo do SDK da OpenAI.
aside: false
outline: false
apiReference:
  title: Atualizar Agent
  operation: Agents
  method: POST
  path: /v1/agents/{agent_id}
  description: Atualização parcial no estilo do SDK. Os campos informados substituem os valores salvos e criam uma nova versão; campos omitidos mantêm seus valores. Não é necessário row_version. description e note não são aceitos aqui; use Replace (PATCH) para eles. Agents arquivados retornam 404.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: agent_id
          type: string
          required: true
          description: ID do Agent (prefixo agt_).
    - title: Cabeçalhos
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcional. Quando omitido, o serviço gera um, então uma requisição repetida pode criar uma duplicata. Envie sua própria chave estável para novas tentativas.
    - title: Corpo da requisição
      description: Qualquer subconjunto destes campos. Outros campos retornam 400.
      fields:
        - name: model
          type: string
          required: false
          description: ID do modelo da API de Models, até 200 caracteres.
        - name: name
          type: string
          required: false
          description: Nome de exibição, até 128 caracteres.
        - name: instructions
          type: string
          required: false
          description: Instruções de sistema, até 256 KiB.
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
          description: Até 64 ferramentas function e no máximo uma ferramenta web_search. Atualmente, Sessions exigem web_search com mode disabled, e resultados de function do lado do cliente ainda não são suportados.
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
