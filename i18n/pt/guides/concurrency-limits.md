---
i18nSource: fc051d55a0cfa8bd
title: Limites de concorrência
description: Quantas tarefas a sua organização pode executar ao mesmo tempo, como o limite aumenta com o nível da conta e como tratar 429 e 402 em envios de vídeo.
---

# Limites de concorrência {#concurrency-limits}

Os limites de concorrência controlam quantas tarefas a sua organização pode ter em andamento ao mesmo tempo. Toda organização tem um nível de conta, e o nível define o limite de concorrência. Quando você atinge o limite, novos envios nos endpoints verificados abaixo são rejeitados com `429` até que uma das suas tarefas em execução termine. Eles não entram em fila.

O limite vale para a organização inteira, considerando todas as chaves de API. Quais envios são verificados depende do endpoint:

- `POST /v1/run` e as chamadas à Platform API por `/v1/api/{vendor}/...` são verificados para todos os tipos de modelo, incluindo imagem, áudio, LLM e operações de APIs de dados.
- Outros endpoints, como Chat Completions, Responses, Messages, OpenAI Images e os endpoints compatíveis com os protocolos do Gemini e da Volcengine, verificam apenas envios de vídeo.

## Como funciona {#how-it-works}

Quando você envia uma tarefa verificada, a SandBase conta as tarefas que a sua organização tem em andamento no momento, ou seja, as tarefas no estado `pending` ou `running`. Se essa contagem já estiver no seu limite, o envio é rejeitado imediatamente com `429`. Nenhuma tarefa é criada e nada é cobrado.

A contagem inclui todas as requisições em andamento da sua organização, não apenas as de vídeo. Uma chat completion em streaming que ainda esteja aberta quando você envia uma tarefa verificada ocupa uma vaga. Se a mesma organização executa chats longos em streaming e jobs de vídeo, considere todos eles ao planejar a capacidade.

Uma vaga é liberada assim que a tarefa chega a um estado final (`completed`, `failed` ou `timeout`). Não há nada a liberar do seu lado. Como as vagas são liberadas quando as tarefas terminam, e não por tempo, esse `429` é diferente de um [limite de taxa](/guides/rate-limiting) por minuto. Esperar um intervalo fixo não garante uma vaga. Em vez disso, espere uma das suas próprias tarefas terminar.

## Limites padrão {#default-limits}

Toda organização nova começa no nível **Bronze**, com limite de 2 tarefas simultâneas. O nível aumenta automaticamente com base no valor de uma única recarga bem-sucedida.

| Nível | Recarga única | Tarefas simultâneas |
|-------|---------------|------------------|
| Bronze | Padrão | 2 |
| Silver | US$ 10 ou mais | 10 |
| Gold | US$ 100 ou mais | 100 |
| Platinum | US$ 500 ou mais | 500 |
| Diamond | Fale com vendas | Ilimitado |

- **Recarga única, não o total acumulado.** Duas recargas de US$ 60 mantêm você no Silver. Uma recarga de US$ 100 leva você ao Gold.
- **Apenas upgrades.** Uma recarga posterior menor nunca reduz o seu nível.
- **Apenas recargas pagas.** Créditos promocionais, créditos de cadastro e cupons não alteram o seu nível.
- **Efeito imediato.** O novo limite vale para o seu próximo envio de vídeo assim que o pagamento for concluído.

## Aumentar o seu limite {#increasing-your-limit}

A forma mais direta de aumentar o limite é fazer uma única recarga que atinja o próximo patamar da tabela acima.

Para mais de 500 tarefas simultâneas, ou para uma linha de crédito mensal, entre em contato com [contact@sandbase.ai](mailto:contact@sandbase.ai) sobre o nível **Diamond**. O Diamond não tem limite de concorrência. Ele é configurado pela equipe da SandBase e nunca é alterado por recargas.

## Verificação de crédito em envios de vídeo {#credit-check-on-video-submissions}

Além da verificação de concorrência, a SandBase estima o custo de cada tarefa de vídeo antes de aceitá-la. Se a estimativa for maior que o seu crédito disponível (saldo mais qualquer linha de crédito), o envio é rejeitado com `402`. Nenhuma tarefa é criada e nada é cobrado.

- Cada envio é verificado em relação ao seu saldo atual. As tarefas ainda em execução não foram cobradas, então deixe uma margem ao enviar vários vídeos de uma vez.
- Se o preço de um modelo depende de uma saída que só existe após a execução, o custo não pode ser estimado antecipadamente. O envio é aceito e cobrado normalmente quando a tarefa termina.

## Tratamento de erros de concorrência {#handling-concurrency-errors}

### 429: limite de concorrência atingido {#_429-concurrency-limit-reached}

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

Nenhum cabeçalho `Retry-After` é enviado. Como o limite é conhecido de antemão, a abordagem mais confiável é nunca ultrapassá-lo. Limite no cliente o número de tarefas de vídeo em andamento e só envie a próxima depois que uma anterior terminar:

::: code-group

```python [Python]
import asyncio

MAX_CONCURRENT_VIDEOS = 2  # set to your level's limit
slots = asyncio.Semaphore(MAX_CONCURRENT_VIDEOS)

async def generate_video(submit, wait_for_result, payload):
    # Hold a slot for the whole lifetime of the task, not just the submit call.
    async with slots:
        task = await submit(payload)
        return await wait_for_result(task)

async def main(submit, wait_for_result, payloads):
    return await asyncio.gather(
        *(generate_video(submit, wait_for_result, p) for p in payloads)
    )
```

```javascript [JavaScript]
const MAX_CONCURRENT_VIDEOS = 2; // set to your level's limit

async function runAll(payloads, submit, waitForResult) {
  const results = [];
  const queue = [...payloads.entries()];

  async function worker() {
    for (let next = queue.shift(); next; next = queue.shift()) {
      const [index, payload] = next;
      // Each worker holds one slot until its task finishes.
      const task = await submit(payload);
      results[index] = await waitForResult(task);
    }
  }

  await Promise.all(
    Array.from({ length: MAX_CONCURRENT_VIDEOS }, worker)
  );
  return results;
}
```

:::

Se você ainda receber um `429`, por exemplo porque outro serviço da mesma organização também está enviando tarefas, aguarde e tente novamente. Use backoff exponencial com jitter e desista após um número limitado de tentativas, em vez de repetir em um loop apertado.

### 402: crédito insuficiente para este vídeo {#_402-not-enough-credit-for-this-video}

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

Não tente novamente. Faça uma recarga ou escolha uma duração menor ou uma resolução mais baixa, que custem menos.

### APIs compatíveis {#compatible-apis}

Os endpoints compatíveis com protocolos retornam esses erros no próprio formato nativo. Por exemplo, o endpoint compatível com Volcengine `/api/v3/contents/generations/tasks` retorna `RateLimitExceeded` para `429` e `AccountOverdueError` para `402`.

## Relacionados {#related}

- [Limites de taxa](/guides/rate-limiting): limites de requisições por minuto
- [Preços](/guides/billing): créditos e recargas
- [Erros](/api-reference/errors): todos os códigos de erro

