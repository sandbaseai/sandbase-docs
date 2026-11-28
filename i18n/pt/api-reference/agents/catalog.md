---
i18nSource: 1b5099685e9df6ce
title: Catálogo de Agents
description: Navegue pelos Agents públicos e clone um para a sua organização.
---

# Catálogo de Agents {#agent-catalog}

O catálogo lista os Agents que a SandBase publica para reutilização. As entradas do catálogo são somente leitura. Clone uma para obter um Agent privado na sua organização, que você pode editar, executar e implantar.

| Método | Caminho | Finalidade |
|---|---|---|
| `GET` | `/v1/agents/catalog` | Listar Agents públicos |
| `GET` | `/v1/agents/catalog/{agent_id}` | Obter um Agent público, opcionalmente em `?version=` |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | Copiá-lo para a sua organização |

## Listar Agents do catálogo {#list-catalog-agents}

Paginação por cursor com `limit` (1-100), `after` e `order`.

```bash
curl "https://api.sandbase.ai/v1/agents/catalog?limit=20" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Cada entrada tem `id`, `object: "agent"`, `visibility: "public"`, `version`, `name`, `description`, `model`, `created_at` e `updated_at`.

## Obter um Agent do catálogo {#get-a-catalog-agent}

```bash
curl "https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60?version=2" \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

`version` é opcional e deve ser um inteiro positivo. A resposta de detalhes inclui um objeto `configuration` somente leitura (nome, descrição, modelo, instruções, perfil de runtime, metadados, ferramentas, texto, raciocínio e Skills).

## Clonar um Agent do catálogo {#clone-a-catalog-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/catalog/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60/clone \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Idempotency-Key: clone-research-agent" \
  -H "Content-Type: application/json" \
  -d '{"name": "My research assistant"}'
```

O corpo aceita os campos opcionais `version` (inteiro positivo; o padrão é a versão pública atual) e `name` (até 128 caracteres). A resposta é `201 Created` com um [objeto Agent](./create) completo, que tem um novo ID `agt_` na sua organização. `Idempotency-Key` é opcional; envie uma chave estável para que uma nova tentativa não crie uma segunda cópia.

Depois de clonar, [crie uma Session](/api-reference/sessions/create) para testá-lo.

