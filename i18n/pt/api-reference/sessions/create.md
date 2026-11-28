---
i18nSource: 91ce9f65766e9662
title: Criar Session
description: Crie uma Session para um Agent salvo ou inline com POST /v1/agents/sessions, opcionalmente fazendo streaming do primeiro turno.
aside: false
outline: false
apiReference:
  title: Criar Session
  operation: Sessions
  method: POST
  path: /v1/agents/sessions
  description: Crie uma Session para uma versão de Agent salva ou para um Agent inline definido na requisição. A configuração do Agent, as versões das Skills e as conexões MCP ficam congeladas durante toda a vida da Session. Sessions sempre rodam na nuvem hospedada da SandBase, então não há ambiente de execução a escolher. Com stream=true e uma entrada inicial, a resposta é um stream Server-Sent Events 201 do primeiro turno em vez de uma Session em JSON. A admissão de execução (saldo e status da organização) é verificada aqui. O SDK da OpenAI exige um argumento environment; veja Compatibilidade com a OpenAI (/agents/openai-compatibility).
  groups:
    - title: Cabeçalhos
      fields:
        - name: Idempotency-Key
          type: string
          required: false
          description: Opcional. Quando omitido, o serviço gera um, então uma requisição repetida pode criar uma duplicata. Envie sua própria chave estável para novas tentativas.
    - title: Corpo da requisição
      description: Objeto JSON estrito.
      fields:
        - name: agent_id
          type: string
          required: false
          description: ID do Agent salvo (prefixo agt_). O Agent deve estar active com projection_status ready. Envie agent_id, agent ou ambos.
        - name: agent
          type: object
          required: false
          description: Configuração do Agent. Os campos aceitos são model, instructions, runtime_profile (codex, claude ou mcode; padrão codex), service_tier, tools, text, reasoning e multi_agent, validados como em Criar Agent. Sem agent_id, define um Agent inline e model é obrigatório; Agents inline não têm Skills nem conexões MCP. Com agent_id, cada campo enviado substitui o campo correspondente da versão salva apenas para esta Session. Campos desconhecidos retornam 400.
        - name: version
          type: integer
          required: false
          description: Versão do Agent. O padrão é a versão atual. Não permitido com um Agent inline.
        - name: title
          type: string
          required: false
          description: Título da Session.
        - name: input
          type: string | array
          required: false
          description: 'Primeira entrada opcional: uma string ou um array com exatamente uma mensagem, por exemplo [{"role":"user","content":[{"type":"input_text","text":"…"}]}]. Um objeto solto retorna 400.'
        - name: model
          type: string
          required: false
          description: Substituição do modelo. agent.model é a forma do SDK da OpenAI; quando ambos são enviados, devem coincidir.
        - name: metadata
          type: object
          required: false
          description: Até 16 pares de strings.
        - name: stream
          type: boolean
          required: false
          description: "Quando true, exige uma entrada não vazia e retorna 201 com um corpo text/event-stream. Os eventos usam o formato de eventos de stream (event: <type>, data: <json>); o primeiro, agent.session.created, traz o snapshot da Session, seguido pelos eventos de item e de saída do turno. Erros de validação, admissão e outros erros antes do início do stream retornam o erro JSON normal. Padrão false."
        - name: environment
          type: object
          required: false
          description: Apenas para compatibilidade com o SDK da OpenAI. Omita em chamadas HTTP diretas; {"type":"openai_hosted"} é aceito e qualquer outro tipo retorna 400.
        - name: model_provider
          type: object
          required: false
          description: Credencial do modelo. Omita para usar a chave de API da chamada. {"type":"custom","base_url":"https://…","api_key":"…"} chama seu próprio endpoint compatível com OpenAI. Somente escrita.
        - name: github_workspace
          type: object
          required: false
          description: 'Repositório do GitHub a clonar em /workspace para esta Session: {"repository_id":"1195090324","ref":"main","connection_id":"plc_…"}. Apenas repository_id é obrigatório; ref usa a branch padrão por padrão. Omitido ou null usa o repositório de workspace do Agent, se houver; caso contrário, nada é clonado. O repositório deve estar dentro do escopo da conexão GitHub do Agent. Veja Workspace com repositório do GitHub (/agents/github-workspace).'
    - title: Objeto Session
      description: Retornado por create, get, update, rename, archive e unarchive.
      fields:
        - name: id
          type: string
          required: true
          description: ID da Session com o prefixo ses_.
        - name: status
          type: string
          required: true
          description: "Status de execução: idle, in_progress ou failed. requires_action ainda não é suportado e aparece como 502 executor_contract_error."
        - name: lifecycle_status
          type: string
          required: true
          description: active ou archived. Sessions arquivadas rejeitam entradas.
        - name: failure
          type: object · null
          required: true
          description: Falha pública com code, message, action e retryable opcional.
        - name: agent_id · agent_version · model
          type: string · integer · string
          required: true
          description: Versão congelada do Agent e modelo efetivo.
        - name: agent · usage
          type: object · object | null
          required: true
          description: Snapshot no formato da OpenAI da configuração efetiva do Agent e uso de tokens (null até que um turno informe o uso).
        - name: source · source_id
          type: string · null
          required: false
          description: Origem da Session. Sessions criadas com POST /v1/agents/sessions informam direct e um source_id null.
        - name: row_version
          type: integer
          required: true
          description: Token compare-and-set para rename, archive e unarchive.
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
