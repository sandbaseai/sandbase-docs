---
i18nSource: d326fdb78ea64bdf
title: Limites de taxa
description: Trate os limites de taxa da API do SandBase com segurança usando novas tentativas limitadas, jitter, filas e tratamento de requisições com idempotência.
---

# Limites de taxa {#rate-limits}

O SandBase pode atribuir à sua organização um limite de requisições por minuto. Ele é compartilhado por todas as API keys da organização
e contado em uma janela deslizante de um minuto. Os provedores de modelos upstream também podem retornar suas próprias
respostas `429 Too Many Requests`. Não fixe uma cota no código, a menos que o SandBase tenha atribuído uma à sua carga de trabalho.

## O limite da sua organização {#your-organization-s-limit}
O SandBase não publica um número fixo de requisições por minuto, porque o limite é atribuído por organização. Todas as
API keys da organização contam para o mesmo limite, então criar mais chaves não o aumenta. Atualmente, o limite não
aparece na API pública nem no Console.

Se sua carga de trabalho precisar de um limite garantido ou maior, entre em contato com o suporte do SandBase informando a organização, a aplicação,
a taxa contínua esperada e a taxa de pico esperada. Não projete um cliente de produção com base em um padrão numérico não documentado.

## Tratar uma resposta 429 {#handle-a-429-response}

As respostas de limite de taxa geradas pela plataforma em `/v1/*` usam um corpo de erro plano:

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

O limite da organização se aplica a `POST /v1/run`, `POST /v1/chat/completions`, `POST /v1/responses`, `POST /v1/messages`, `POST /v1/upload` e aos endpoints `generateContent`, `streamGenerateContent` e `POST /v1beta/interactions` do Gemini. Endpoints de polling como
`GET /v1/run/{id}` não são contados. Endpoints compatíveis com outros protocolos retornam o mesmo `429` em seu próprio envelope de erro,
como o formato de erro da Anthropic ou do Google. Uma resposta originada no provedor pode usar o formato de erro do endpoint
compatível e incluir headers de limite de taxa do provedor.

Os headers `Retry-After` e de cota restante não são garantidos. Se `Retry-After` estiver presente, respeite-o. Caso contrário, use
backoff exponencial com jitter e um número máximo de tentativas.

```python
import os
import random
import time

from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def create_with_backoff(**request):
    for attempt in range(5):
        try:
            return client.chat.completions.create(**request)
        except RateLimitError:
            if attempt == 4:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

O SDK da OpenAI também oferece novas tentativas integradas por meio de `max_retries`. Escolha deliberadamente entre as novas tentativas do SDK e um loop
de novas tentativas na aplicação, para que as tentativas não se multipliquem entre as camadas.

## Repita apenas operações seguras {#retry-only-safe-operations}

Repetir uma requisição de inferência pode criar uma segunda geração e gerar custo adicional. Repita-a apenas quando sua
aplicação aceitar uma nova geração. Não repita automaticamente uma requisição que altera estado, a menos que a operação documente
idempotência ou sua aplicação consiga comprovar que a primeira tentativa não teve sucesso.

Em requisições com streaming, um `429` normalmente chega antes de o stream começar. Depois que os bytes começarem a chegar, trate uma desconexão
como uma geração interrompida, em vez de presumir um erro de limite de taxa. Preserve ou descarte a saída parcial conforme os
requisitos do seu produto; recomeçar cria uma nova geração.

## Controlar a vazão {#control-throughput}

- Limite a concorrência em vez de disparar um lote ilimitado de uma só vez.
- Coloque trabalhos com picos em fila e suavize a taxa de envio.
- Evite requisições duplicadas e faça cache de resultados reutilizáveis quando os requisitos de privacidade e atualização permitirem.
- Use chaves separadas para propriedade, controles de gastos e revogação, e não para contornar os limites da plataforma.
- Registre o endpoint, o modelo, o status HTTP e o corpo de erro sanitizado para diagnóstico.
- Entre em contato com o suporte do SandBase quando uma carga de trabalho precisar de um limite de capacidade atribuído ou maior.

```python
import asyncio

semaphore = asyncio.Semaphore(8)

async def run_one(client, prompt):
    async with semaphore:
        return await client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
```

Concorrência não é o mesmo que requisições por minuto. Ajuste ambas com base na latência observada e na capacidade atribuída à
sua aplicação.

::: info Chamadas de API gratuitas diárias
As 100 chamadas gratuitas de APIs de dados por dia UTC da organização são uma franquia de cobrança, não um limite de taxa. As chamadas além dela são
cobradas por chamada, em vez de rejeitadas. Consulte [Chamadas de API gratuitas diárias](/guides/billing#daily-free-api-calls).
:::

::: tip Tarefas de vídeo
Os envios de vídeo também são limitados pela quantidade de tarefas que sua organização pode executar ao mesmo tempo, com base no nível da conta.
Esse `429` diz `organization concurrency limit exceeded` e é liberado quando uma tarefa em execução termina, não após um tempo fixo. Consulte
[Limites de concorrência](/guides/concurrency-limits).
:::

## Orientações relacionadas {#related-guidance}

- [Tratamento de erros](/guides/error-handling)
- [Streaming](/guides/streaming)
- [Referência de erros da API](/api-reference/errors)
- [API keys](/getting-started/api-keys)

