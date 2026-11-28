---
i18nSource: b95a8cd6f82c3a9a
title: Models e preços legíveis por IA
description: Descubra os modelos, recursos, schemas e preços atuais da SandBase pela API de Models.
---

# Models e preços {#models-pricing}

Todos os modelos podem ser acessados com uma única chave de API da SandBase. Disponibilidade, schemas, recursos, limites de contexto
e preços dos modelos podem mudar de forma independente.

::: info Use metadados de modelos ao vivo
Sempre use `GET /v1/models` e `GET /v1/models/{id_or_name}` para obter dados atuais e oficiais. Não presuma que todo
LLM suporta streaming, visão, ferramentas, saída estruturada ou cache, e não copie os campos de entrada ou os
preços de um modelo para outro.
:::

## Respostas de catálogo e de detalhes {#catalog-and-detail-responses}

`GET /v1/models` retorna registros de identidade compatíveis com OpenAI contendo `id`, `object`, `created` e `owned_by`.
Ele omite intencionalmente os metadados de recursos, schema e preços da SandBase.

`GET /v1/models/{id_or_name}` adiciona `unified_schema`, `supported_modes` e `model_card`. Leia os preços detalhados em
`model_card`; não há um objeto `pricing` de nível superior. Trate `capability_tags`, `supported_modes` e
`unified_schema` como específicos de cada modelo.

## Descobrir modelos {#discover-models}

```bash
curl 'https://api.sandbase.ai/v1/models?type=llm' \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

O endpoint de listagem suporta `q`, `vendor`, `type` e `order`; ele não é paginado e usa `type=llm` por padrão.
Ele retorna itens compatíveis com OpenAI com `id`, `object`, `created` e `owned_by`. Use o `id` retornado como
nome do modelo ao solicitar detalhes ou invocar o modelo.

Para qualquer resposta assíncrona `202`, consulte `GET /v1/run/{id}` com o ID retornado. Trate o ID como opaco; não
deduza seu formato nem construa um caminho de polling diferente a partir de um prefixo de ID ou de um cabeçalho de compatibilidade.

## Inspecionar um modelo {#inspect-one-model}

Os nomes de modelos são qualificados pelo fornecedor e podem conter `/`:

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Antes da execução, inspecione:

- `enabled` e `execution_mode`
- `capability_tags` e `supported_modes`
- `unified_schema` para os campos de requisição aceitos
- `model_card` para a fórmula de preço atual e os multiplicadores de token ou cache

## Verificar o custo real da tarefa {#check-actual-task-cost}

Para uma tarefa concluída ou em andamento, consulte o custo registrado em vez de recalculá-lo a partir de uma tabela desatualizada:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

Veja a [referência da API de Models](/api-reference/models/) para os contratos de resposta e o
[Guia de erros](/for-agents/errors) para orientações sobre formato de resposta e novas tentativas.
