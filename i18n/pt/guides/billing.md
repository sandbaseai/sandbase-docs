---
i18nSource: 91c5a0d1b6de6434
title: Preços e uso
description: Encontre os preços atuais dos modelos, verifique o custo das tarefas e gerencie a cobrança do SandBase com segurança.
---

# Preços e uso {#pricing-and-usage}

O SandBase usa cobrança pré-paga por uso (pay-as-you-go). A disponibilidade de modelos, as fórmulas de preço, os multiplicadores de cache e as cobranças
específicas de cada capacidade podem mudar de forma independente, então as integrações devem ler os metadados em tempo real em vez de depender de tabelas
de preços copiadas.

## Chamadas de API gratuitas diárias {#daily-free-api-calls}

Cada organização recebe 100 chamadas gratuitas de APIs de dados (pesquisa, redes sociais, scraping, e-commerce, finanças) por dia UTC. A
franquia é compartilhada por todas as APIs de dados elegíveis e por todas as chaves da organização, e é renovada às 00:00 UTC. LLMs e
modelos de mídia não são elegíveis. Algumas APIs de dados também não são: as mais caras ou com preço por fórmula, como alguns
endpoints em lote, endpoints de crawl, Xiaohongshu PGY e as rotas `kol-*` do Douyin Xingtu, são cobradas desde a primeira chamada.
Para verificar uma ferramenta, execute `sandbase_inspect`: as ferramentas elegíveis trazem `pricing.free_quota`, e as que não o têm são sempre
cobradas.

- As chamadas dentro da franquia não são cobradas, e uma organização com saldo zero ainda pode usá-las.
- Após a 100ª chamada, as chamadas elegíveis continuam funcionando e são cobradas por chamada pelo preço que a ferramenta mostra. Elas não são
  rejeitadas nem limitadas por taxa porque a franquia acabou.
- Chamadas não usadas não se acumulam para o dia seguinte.

Nas [ferramentas MCP do SandBase](/setup/), `sandbase_inspect` marca as ferramentas elegíveis com `pricing.free_quota`
(`daily_limit`, `scope`, `resets`). `sandbase_account` retorna a franquia do dia como `free_api_quota`, com
`daily_limit`, `used_today`, `remaining` e `resets_at`; `used_today` e `remaining` são omitidos quando a contagem está
temporariamente indisponível. Depois que uma execução é liquidada, `sandbase_run` e `sandbase_run_get` informam `free_quota_status`:
`free` (coberta pela franquia), `overage` (cobrada depois que a franquia acabou) ou `degraded` (não cobrada
porque a contagem da franquia estava indisponível).

## Gerenciar a cobrança no Console {#manage-billing-in-the-console}

Use **Developer → Billing** para ver seu saldo, comprar créditos, configurar a recarga automática, resgatar cupons e gerenciar as configurações de cobrança disponíveis para sua
organização. Abra **Developer → Activities → Usage** para ver resumos de requisições, tokens e custos no nível da organização.

::: info Limite da API pública
Endpoints de saldo, recarga, exportação de cobrança e uso de toda a organização não fazem parte, atualmente, da
API pública suportada. Não automatize requisições de rede do Console nem dependa de rotas internas do Console.
:::

## Consultar os preços atuais dos modelos {#read-current-model-pricing}

Primeiro, descubra um modelo habilitado:

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Em seguida, solicite o model card completo dele:

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

O endpoint de listagem é otimizado para descoberta e omite intencionalmente os preços detalhados de tokens, cache e raciocínio.
Leia os preços detalhados do modelo selecionado em `model_card` na resposta de detalhes. Não existe uma fórmula universal
que se aplique a todo LLM, modelo de mídia, modelo de embedding ou capacidade de API.

## Verificar o custo registrado de uma tarefa {#check-one-task-s-recorded-cost}

Quando uma operação retornar um ID de tarefa, consulte o registro de liquidação dela:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

A resposta diferencia o `cost` atual do `estimated_cost` e informa se a liquidação é final. Não
use `cost` para conciliação de cobrança até que `settled` seja `true`. Os registros de tarefa são dados de consulta operacional, e não
um livro contábil. Use os registros de cobrança e as exportações CSV disponíveis em **Developer → Activities → Usage**
para conciliação e registros de longo prazo.

## Práticas de controle de custos {#cost-control-practices}

- Consulte o model card atual antes de iniciar uma nova carga de trabalho.
- Verifique `capability_tags`, `supported_modes` e `unified_schema`; alternativas mais baratas só são úteis quando
  suportam o comportamento de input e saída necessário.
- Limite o contexto desnecessário no prompt e defina um limite adequado de tokens de saída quando o modelo selecionado suportar.
- Trate o cache como específico de cada modelo. Verifique o model card e os campos de uso retornados em vez de presumir um desconto
  válido para todo o provedor.
- Registre IDs de tarefa apenas para a consulta de custo da tarefa; para trabalhos assíncronos em `/v1/run`, registre o ID opaco de execução retornado e consulte `GET /v1/run/{id}` apenas enquanto o status for `pending` ou `running`.
- Use os controles de gastos disponíveis no Console para sua organização.

## Erros de pagamento {#payment-errors}

Uma operação de API pode retornar HTTP `402` quando a organização não consegue pagar a requisição. Os envelopes de erro variam conforme a
superfície de compatibilidade da API, então trate o status HTTP e o objeto de erro documentado em vez de comparar uma string
de mensagem. Depois de resolver a cobrança no Console, tente novamente de acordo com as regras de idempotência e recuperação da operação.

Os envios de vídeo também são verificados com base no custo estimado antes de começarem. Uma única recarga de US$ 10 ou mais
eleva o nível da sua conta, o que permite executar mais tarefas de vídeo ao mesmo tempo. Consulte
[Limites de concorrência](/guides/concurrency-limits).

Consulte [Modelos e preços](/for-agents/models), [Custo da tarefa](/api-reference/tasks/cost) e
[Erros](/api-reference/errors) para os contratos públicos atuais.

