---
i18nSource: 8524e8b4d6f5ab97
title: Agents API
description: Crie, versione, arquive e clone configurações de Agents salvas.
---

# Agents API {#agents-api}

Um Agent é uma configuração salva e versionada: um modelo, instruções, um perfil de runtime, Skills, conexões MCP e configurações de saída. Criar ou atualizar um Agent não o executa. Execute-o em uma [Session](/api-reference/sessions/).

A Agents API segue o protocolo OpenAI Agents (`client.beta.agents` no SDK Python da OpenAI). O cabeçalho `OpenAI-Beta` é opcional; quando enviado, deve ser `agents=v1`. A SandBase acrescenta versões, atualizações com compare-and-set, arquivamento e restauração, além de um catálogo público.

## Operações de Agent {#agent-operations}

| Método | Caminho | Finalidade |
|---|---|---|
| `POST` | `/v1/agents` | [Criar um Agent](./create) na versão 1 |
| `GET` | `/v1/agents` | [Listar Agents](./list) |
| `GET` | `/v1/agents/{agent_id}` | [Obter um Agent](./get) |
| `POST` | `/v1/agents/{agent_id}` | [Atualizar um Agent](./update) (atualização parcial no estilo do SDK) |
| `PATCH` | `/v1/agents/{agent_id}` | [Substituir com compare-and-set](./replace) em `row_version` |
| `DELETE` | `/v1/agents/{agent_id}` | [Excluir](./delete), o que arquiva o Agent |
| `POST` | `/v1/agents/{agent_id}/archive` | [Arquivar um Agent](./archive) |
| `POST` | `/v1/agents/{agent_id}/unarchive` | [Desarquivar um Agent](./unarchive) |
| `POST` | `/v1/agents/{agent_id}/restore` | [Restaurar uma versão anterior](./restore) como nova versão |
| `GET` | `/v1/agents/{agent_id}/versions` | [Listar versões](./versions) |
| `GET` | `/v1/agents/{agent_id}/versions/{version}` | [Obter uma versão](./get-version) |
| `GET` | `/v1/agents/catalog` | [Navegar pelo catálogo público](./catalog) |
| `POST` | `/v1/agents/catalog/{agent_id}/clone` | [Clonar um Agent do catálogo](./catalog#clone-a-catalog-agent) para a sua organização |

Os IDs de Agent usam o prefixo `agt_`. Os corpos das requisições são JSON estrito de até 1 MiB; campos desconhecidos retornam 400.

## Versões e atualizações {#versions-and-updates}

- Toda gravação efetiva (create, update, replace, restore) gera uma versão imutável. `version` é o número da versão atual.
- `POST /v1/agents/{agent_id}` é a atualização do SDK da OpenAI. Ela não exige `row_version`, então prevalece a última gravação.
- `PATCH /v1/agents/{agent_id}` exige o `row_version` que você leu por último e retorna 409 quando outra pessoa alterou o Agent antes. Use-o em editores e automações que podem rodar em paralelo.
- Cada Session congela a versão do Agent, as versões das Skills e a configuração das conexões MCP com que foi iniciada.

## Prontidão {#readiness}

Uma versão recém-gravada informa `projection_status` enquanto é preparada para execução. As Sessions exigem um Agent ativo cujo `projection_status` seja `ready`; caso contrário, retornam 409. Agents arquivados também retornam 409 para novas execuções.

## Limites atuais {#current-limits}

- `tools` aceita ferramentas `function` e no máximo uma ferramenta `web_search`. No momento, a execução exige que `web_search.mode` seja `disabled`.
- Ferramentas de função podem ser salvas, mas Runs que pedem ao cliente para retornar o resultado de uma ferramenta (`requires_action`) ainda não são suportados e aparecem como `502 executor_contract_error`.
- `multi_agent` deve ser omitido ou `null`.

## Paginação {#pagination}

`GET /v1/agents` e o catálogo usam paginação por cursor: `limit` (1-100, padrão 20), `after` e `order` (`asc` ou `desc`, padrão `desc`). As respostas contêm `object: "list"`, `data`, `has_more`, `first_id` e `last_id`; passe `last_id` como `after` para obter a próxima página.

`GET /v1/agents/{agent_id}/versions` usa paginação por offset: `limit` e `offset`, com `data`, `total`, `limit` e `offset` na resposta.

## Erros {#errors}

Os erros usam o envelope de Agents `{"error":{"type","code","param":null,"message"}}`. Consulte [Erros](/api-reference/errors#agents-platform-errors) para ver a lista de códigos.

