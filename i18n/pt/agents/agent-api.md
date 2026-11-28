---
i18nSource: 2ba7f0f41847d04f
title: Definir um Agent
description: Crie e atualize um Agent versionado com a API de Agents, incluindo campos, limites, versões e arquivamento.
---

# Definir um Agent {#define-an-agent}

Crie um Agent com `POST /v1/agents`. A API segue o protocolo OpenAI Agents, então você pode usar HTTP puro ou o `client.beta.agents` do SDK da OpenAI com `base_url="https://api.sandbase.ai/v1"`. O cabeçalho `OpenAI-Beta` é opcional; se você enviá-lo, ele deve ser `agents=v1`. Veja [Compatibilidade com a OpenAI](/agents/openai-compatibility) para saber o que o SDK suporta.

## Criar um Agent {#create-an-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question, compare at least two sources, and cite them.",
    "metadata": {"team": "research"}
  }'
```

```python
# Verified with openai-python 3.13.0 and 3.24.0. See /agents/openai-compatibility.
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["SANDBASE_API_KEY"], base_url="https://api.sandbase.ai/v1")
agent = client.beta.agents.create(
    model="deepseek/deepseek-v4-flash",
    name="Research assistant",
    instructions="Research the question, compare at least two sources, and cite them.",
    metadata={"team": "research"},
)
print(agent.id, agent.version)  # agt_..., 1
```

A resposta é `201 Created` com o Agent: um ID `agt_`, `version: 1`, `row_version`, `status: "active"` e `projection_status`. Uma nova versão é preparada para execução em segundo plano; inicie Sessions quando `projection_status` for `ready`.

`Idempotency-Key` é opcional. Quando você o omite, o serviço gera um, então uma requisição repetida pode criar um segundo Agent. Envie sua própria chave estável ao repetir.

## Campos {#fields}

O corpo é JSON estrito (até 1 MiB). Campos desconhecidos retornam 400.

| Campo | Obrigatório | Limites e valores |
|---|---|---|
| `model` | Sim | ID do modelo, até 200 caracteres |
| `name` | Não | Até 128 caracteres |
| `instructions` | Não | Até 256 KiB |
| `description` | Não | Até 4096 caracteres |
| `runtime_profile` | Não | `codex` (padrão), `claude` ou `mcode` |
| `skills` | Não | Até 32 referências. Um novo vínculo com `version: null` fixa o padrão atual ao salvar; vínculos existentes mantêm a versão fixada. Informe uma versão explícita para atualizar; veja [Skills](/agents/mcp-tools#skills) |
| `mcp_connections` | Não | Até 32 referências; veja [Conexões MCP](/agents/mcp-tools#mcp-connections) |
| `tools` | Não | Até 64 ferramentas `function` e no máximo uma ferramenta `web_search` |
| `text` | Não | `format.type` `text` ou `json_schema` (schema de objeto); `verbosity` `low`, `medium` ou `high` |
| `reasoning` | Não | `effort` `none`, `minimal`, `low`, `medium`, `high`, `xhigh` ou `max`; `summary` `concise`, `detailed` ou `auto` |
| `service_tier` | Não | `auto` (padrão), `default`, `flex`, `priority` ou `fast` |
| `metadata` | Não | Até 16 pares de strings; chaves com até 64 e valores com até 512 caracteres |
| `note` | Não | Nota de alteração armazenada na versão |

## Limites atuais {#current-limits}

- `web_search` deve usar `"mode": "disabled"` para que as Sessions iniciem.
- Ferramentas `function` podem ser salvas, mas Runs que exigem que o cliente retorne um resultado de ferramenta (`requires_action`) ainda não são suportadas. Uma Session nesse estado retorna `502 executor_contract_error`. Em vez disso, dê ao Agent recursos externos por meio de [conexões MCP](/agents/mcp-tools#mcp-connections).
- `multi_agent` deve ser omitido ou `null`.

## Atualizar um Agent {#update-an-agent}

Há duas formas de atualização. Ambas criam uma nova versão.

- `POST /v1/agents/{agent_id}` é a atualização do SDK da OpenAI. Envie apenas os campos que deseja alterar. Não é necessário `row_version`, então prevalece a última escrita. `description` e `note` não são aceitos nessa forma.
- `PATCH /v1/agents/{agent_id}` é a atualização compare-and-set. Ela exige o `row_version` lido por último e retorna 409 se o Agent tiver mudado nesse meio-tempo. Valores `null` explícitos são rejeitados.

```bash
curl -X PATCH https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"row_version": 2, "instructions": "Answer in five bullet points with cited sources.", "note": "Shorter answers"}'
```

## Versões, arquivamento e restauração {#versions-archive-and-restore}

- `GET /v1/agents/{agent_id}/versions` lista snapshots imutáveis; `GET /v1/agents/{agent_id}/versions/{version}` lê um deles.
- `POST /v1/agents/{agent_id}/restore` com `{"source_version": 1, "row_version": 3}` copia uma configuração anterior para uma nova versão atual.
- `POST /v1/agents/{agent_id}/archive` e `/unarchive` recebem `{"row_version": …}`. Agents arquivados não podem iniciar novas Sessions.
- `DELETE /v1/agents/{agent_id}` arquiva o Agent. Agents nunca são excluídos definitivamente.

## Próximos passos {#next-steps}

- [Skills e ferramentas MCP](/agents/mcp-tools)
- [Executar o Agent em uma Session](/agents/sessions)
- [Referência da API de Agents](/api-reference/agents/)
