---
i18nSource: f63049c1cf01130e
title: Erros e novas tentativas
description: Classifique falhas da API da SandBase, decida quando uma nova tentativa é segura e preserve diagnósticos úteis sem expor segredos.
---

# Erros e novas tentativas {#errors-and-retries}

Trate erros pelo status HTTP, pela família do endpoint e pela semântica da operação. A SandBase expõe vários protocolos compatíveis,
então não há um único formato JSON de erro compartilhado por todos os endpoints.

## Leia o formato de erro do endpoint {#read-the-endpoint-s-error-shape}

- Operações compatíveis com OpenAI normalmente retornam um objeto `error` com uma mensagem e um tipo.
- O Anthropic Messages retorna envelopes de erro compatíveis com Anthropic.
- Operações principais da plataforma podem retornar um corpo simples `{ "error": "..." }` ou um erro documentado específico do recurso.
- Operações do Google e nativas de provedores preservam o formato do protocolo compatível, quando documentado.

Use o status HTTP e o corpo documentado da resposta. Não exija campos opcionais como `code`, `param` ou
`request_id`, a menos que o endpoint selecionado os garanta. Veja a [referência de erros da API](/api-reference/errors) para
exemplos e a [especificação OpenAPI](/openapi.yaml) para respostas específicas de cada operação.

## Decida o que fazer pelo status {#decide-what-to-do-by-status}

| Status | Causa típica | Ação recomendada |
|---|---|---|
| `400` / `422` | Corpo, parâmetro inválido ou recurso de modelo não suportado | Corrija a requisição antes de tentar novamente. |
| `401` | Credencial ausente, inválida, expirada ou revogada | Substitua a credencial. |
| `402` | O estado de cobrança não permite a requisição | Resolva o saldo da conta ou o controle de gastos. |
| `403` | Escopo da credencial ou acesso ao recurso insuficiente | Use uma chave ou um recurso autorizado. |
| `404` | Modelo, tarefa ou recurso da plataforma não encontrado | Verifique o identificador e a organização. |
| `409` | Conflito de estado do recurso ou de operação concorrente | Leia o estado atual e depois decida se deve tentar novamente. |
| `429` | A SandBase ou um provedor upstream limitou a requisição | Respeite `Retry-After` quando presente; caso contrário, use backoff com jitter. |
| `500` / `502` / `503` / `504` | Falha interna, upstream ou de disponibilidade temporária | Tente novamente apenas se repetir a operação for seguro. |

Esta tabela é um guia de tratamento, e não uma promessa de que todo endpoint emite todos os status.

## Use uma política de novas tentativas limitada {#use-a-bounded-retry-policy}

Para uma requisição que pode ser repetida com segurança, use backoff exponencial com jitter, limite o atraso e imponha um orçamento total de requisições.
Desative as novas tentativas do SDK se uma camada externa da aplicação já fizer novas tentativas, ou considere as duas camadas ao definir o orçamento.

```python
import os
import random
import time

from openai import APIStatusError, OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def chat_with_backoff(messages, attempts=4):
    for attempt in range(attempts):
        try:
            return client.chat.completions.create(
                model="deepseek/deepseek-v4-flash",
                messages=messages,
            )
        except APIStatusError as error:
            retryable = error.status_code in {429, 500, 502, 503, 504}
            if not retryable or attempt == attempts - 1:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

Quando uma resposta incluir `Retry-After`, interprete e respeite esse valor em vez de usar o atraso padrão. Mantenha a política
configurável; o número certo de tentativas e o prazo dependem da latência e do orçamento de custo de quem chama.

## Proteja-se contra efeitos colaterais duplicados {#protect-against-duplicate-side-effects}

Repetir uma requisição de inferência cria uma nova geração e pode gerar custo adicional. Isso só é aceitável quando a
aplicação precisa de qualquer resposta válida e tolera a regeneração.

Seja mais conservador com operações que criam, atualizam, excluem, publicam, agendam ou invocam trabalho:

- use o suporte a idempotência documentado quando o endpoint o oferecer;
- caso contrário, leia o estado atual antes de repetir uma requisição ambígua;
- nunca repita uma chamada de ferramenta só porque o stream do modelo ao redor foi desconectado;
- mantenha um ID de operação do cliente no seu próprio sistema quando precisar conciliar novas tentativas.

## Trate timeouts e streams separadamente {#handle-timeouts-and-streams-separately}

Um timeout não prova que o servidor parou de processar a requisição. Antes de repetir uma operação assíncrona ou que altera
estado, consulte o recurso documentado ou o status da tarefa, quando possível.

Para respostas em streaming, diferencie um erro HTTP antes do início do stream de uma desconexão após saída parcial.
Apenas o sinal normal de término do protocolo comprova um stream completo. Veja [Respostas em streaming](/guides/streaming).

## Registre diagnósticos úteis e seguros {#log-useful-safe-diagnostics}

Registre:

- endpoint e identificador do modelo;
- status HTTP e tipo de erro compatível, quando presente;
- identificador do provedor ou da requisição, quando retornado;
- número de tentativas, tempo decorrido e se algum byte da resposta chegou.

Não registre chaves de API, valores de credenciais, prompts sensíveis completos nem respostas de provedores sem redação. Mostre aos usuários uma mensagem concisa
e acionável, mantendo diagnósticos sanitizados para os operadores.

## Orientações relacionadas {#related-guidance}

- [Referência de erros da API](/api-reference/errors)
- [Limites de taxa](/guides/rate-limiting)
- [Respostas em streaming](/guides/streaming)
- [Autenticação](/api-reference/authentication)
