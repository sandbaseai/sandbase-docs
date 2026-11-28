---
i18nSource: 3ccdc1071b9be798
title: Models API
description: Descubra metadados, preços, status de suporte e capacidades dos modelos da SandBase.
---

# Models API {#models-api}

Use a Models API para descobrir modelos antes de escolher um endpoint de inferência. A operação de listagem é compatível com OpenAI e retorna registros de identificação compactos. Consulte um modelo específico para obter os metadados de capacidade, schema e preços da SandBase.

| Operação | Endpoint | Documentação |
|---|---|---|
| Listar modelos | `GET /v1/models` | [Listar modelos](./list) |
| Obter um modelo | `GET /v1/models/{id_or_name}` | [Obter modelo](./get) |
| Chamar uma capacidade de API por caminho | `GET/POST /v1/api/{vendor}/{upstream_path}` | [API Passthrough](./api-passthrough) |
| Executar um modelo ou capacidade de API | `POST /v1/run` | [Executar capacidade](./run) |
| Obter um resultado assíncrono | `GET /v1/run/{id}` | [Obter resultado da execução](./run-get) |
| Receber um callback assíncrono | `webhook_url` em `POST /v1/run` | [Callbacks de webhook](./run#webhook-callbacks) |
| Navegar pelos modelos suportados | — | [Catálogo de modelos](https://www.sandbase.ai/models) |

Para executar um modelo, abra a página de referência dele no [Catálogo de modelos](https://www.sandbase.ai/models); cada página mostra o identificador exato, os campos da requisição e os preços. Esta página documenta a descoberta, o executor unificado de capacidades, o API passthrough, os assets e a consulta de custo de tarefas.

`GET /v1/models` aceita `q`, `vendor`, `type` e `order`; não é paginado. Omitir `type` equivale a `llm`, enquanto um `type=` explicitamente vazio lista todos os tipos de modelo públicos. O filtro `vendor` é exato e diferencia maiúsculas de minúsculas; `q` é uma busca por substring que não diferencia maiúsculas de minúsculas. Cada item da lista contém `id`, `object`, `created` e `owned_by`, em que `id` é o nome lógico do modelo usado nas requisições.

Os nomes de modelo podem conter `/`. Passe essas barras como separadores de caminho ao chamar o endpoint de detalhes, por exemplo `/v1/models/openai/gpt-5.6-luna`; a rota do servidor consome o restante do caminho como um único identificador lógico. Descubra o ID atual por `GET /v1/models` em vez de copiar um identificador de um guia antigo.

Para uma resposta assíncrona `202` de uma API de inferência, consulte `GET /v1/run/{id}` periodicamente com o ID opaco retornado. Não deduza um prefixo de ID nem construa outro caminho de consulta a partir de cabeçalhos de compatibilidade.

