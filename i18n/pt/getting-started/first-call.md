---
i18nSource: 0ca53876f04eb96d
title: Primeira chamada de API
description: Passo a passo detalhado para fazer sua primeira chamada à API do SandBase, entender a anatomia da requisição, a estrutura da resposta e o streaming.
---

# Primeira chamada de API {#first-api-call}

Este guia mostra em detalhes a anatomia de uma requisição e de uma resposta da API do SandBase. Ao final, você vai entender cada campo do corpo da requisição, como ler a resposta e como usar streaming.

## Antes de começar {#before-you-start}

Você precisa de uma organização ativa no SandBase, uma [chave de API](/getting-started/api-keys) e um ID de modelo do [catálogo de modelos](https://www.sandbase.ai/models). Exporte a chave para que os exemplos não coloquem segredos no código-fonte:

```bash
export SANDBASE_API_KEY="sk-YOUR_API_KEY"
```

Comece com uma requisição sem streaming. Quando a autenticação e o tratamento da resposta estiverem funcionando, adicione streaming e o comportamento de novas tentativas para produção.

## Anatomia da requisição {#request-anatomy}

Este passo a passo usa a rota Chat Completions compatível com a OpenAI:

```bash
POST https://api.sandbase.ai/v1/chat/completions
```

### Headers obrigatórios {#required-headers}

| Header | Valor | Descrição |
|--------|-------|-------------|
| `Authorization` | `Bearer sk-YOUR_API_KEY` | Sua chave de API do SandBase |
| `Content-Type` | `application/json` | Formato do corpo da requisição |

### Corpo da requisição {#request-body}

```json
{
  "model": "deepseek/deepseek-v4-flash",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is the capital of France?"}
  ],
  "temperature": 0.7,
  "max_tokens": 256
}
```

### Parâmetros do corpo {#body-parameters}

| Parâmetro | Tipo | Obrigatório | Descrição |
|-----------|------|----------|-------------|
| `model` | string | Sim | Um ID de modelo habilitado retornado por `GET /v1/models` (por exemplo, `deepseek/deepseek-v4-flash`) |
| `messages` | array | Sim | Histórico da conversa como um array de objetos de mensagem |
| `temperature` | number | Não | Temperatura de amostragem (0–2). O suporte e os valores padrão podem variar por modelo. |
| `max_tokens` | integer | Não | Número máximo de tokens a gerar na resposta |
| `top_p` | number | Não | Parâmetro de amostragem nucleus (0–1) |
| `stream` | boolean | Não | Se a resposta deve ser transmitida em streaming. Padrão: `false` |
| `stop` | string ou array | Não | Sequências de parada — a geração para quando elas são encontradas |
| `frequency_penalty` | number | Não | Penalidade de repetição compatível com o provedor, quando suportada |
| `presence_penalty` | number | Não | Penalidade de presença compatível com o provedor, quando suportada |

### Papéis das mensagens {#message-roles}

| Papel | Finalidade |
|------|---------|
| `system` | Define o comportamento e a personalidade do assistente |
| `user` | A entrada da pessoa |
| `assistant` | Respostas anteriores do assistente (para conversas com vários turnos) |
| `developer`, `tool` | Papéis adicionais compatíveis com a OpenAI, quando suportados pelo modelo e pela rota selecionados |

## Exemplo completo de requisição {#full-request-example}

::: code-group

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "What is the capital of France?"}
    ],
    "temperature": 0.7,
    "max_tokens": 256
  }'
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

response = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[
        {"role": "system", "content": "You are a helpful assistant."},
        {"role": "user", "content": "What is the capital of France?"}
    ],
    temperature=0.7,
    max_tokens=256
)

print(response.choices[0].message.content)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const response = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [
    { role: 'system', content: 'You are a helpful assistant.' },
    { role: 'user', content: 'What is the capital of France?' },
  ],
  temperature: 0.7,
  max_tokens: 256,
});

console.log(response.choices[0].message.content);
```

:::

## Estrutura da resposta {#response-structure}

### Resposta típica sem streaming {#typical-non-streaming-response}

```json
{
  "id": "chatcmpl-abc123def456",
  "object": "chat.completion",
  "created": 1719000000,
  "model": "deepseek/deepseek-v4-flash",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "The capital of France is Paris."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 8,
    "total_tokens": 32
  }
}
```

### Campos da resposta {#response-fields-explained}

| Campo | Descrição |
|-------|-------------|
| `id` | Identificador único desta completion |
| `object` | Objeto de resposta compatível com a OpenAI, normalmente `"chat.completion"` nesta rota |
| `created` | Timestamp Unix de quando a resposta foi gerada |
| `model` | O modelo que gerou a resposta |
| `choices` | Array de opções de completion (normalmente uma) |
| `choices[].index` | Índice desta opção no array |
| `choices[].message.role` | Papel retornado para a mensagem gerada, normalmente `"assistant"` |
| `choices[].message.content` | O texto gerado |
| `choices[].finish_reason` | Por que a geração parou (veja abaixo) |
| `usage.prompt_tokens` | Tokens na sua entrada |
| `usage.completion_tokens` | Tokens na saída gerada |
| `usage.total_tokens` | Soma dos tokens de prompt + completion |

### Motivos de término {#finish-reasons}

Os motivos de término dependem do provedor. Valores comuns compatíveis com a OpenAI incluem:

| Valor | Significado típico |
|-------|---------|
| `stop` | Fim natural da resposta ou uma sequência de parada foi encontrada |
| `length` | O limite `max_tokens` foi atingido — a resposta foi truncada |

Trate valores desconhecidos como saída válida do provedor em vez de rejeitar a resposta.

## Respostas com streaming {#streaming-responses}

Para saída em tempo real (como um chatbot digitando), use streaming. A resposta chega como Server-Sent Events (SSE):

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Write a haiku about coding."}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
print()  # newline at the end
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Write a haiku about coding.' }],
  stream: true,
});

for await (const chunk of stream) {
  const content = chunk.choices[0]?.delta?.content;
  if (content) process.stdout.write(content);
}
console.log();
```

```bash [cURL]
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -N \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Write a haiku about coding."}],
    "stream": true
  }'
```

:::

### Formato SSE do streaming {#streaming-sse-format}

Um stream compatível normalmente emite Server-Sent Events como estes:

```
data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"role":"assistant"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":"The"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{"content":" capital"},"finish_reason":null}]}

data: {"id":"chatcmpl-abc123","object":"chat.completion.chunk","created":1719000000,"model":"deepseek/deepseek-v4-flash","choices":[{"index":0,"delta":{},"finish_reason":"stop"}]}

data: [DONE]
```

Pontos principais:

- consuma os chunks em ordem e concatene os fragmentos de `delta.content`
- tolere chunks só com metadados, deltas vazios e campos compatíveis com o provedor que você não reconhece
- pare quando o stream for fechado ou quando chegar o marcador final; Chat Completions normalmente usa `data: [DONE]`
- não presuma que todos os modelos emitem exatamente o mesmo formato no primeiro ou no último chunk

## Usando o SDK da Anthropic {#using-the-anthropic-sdk}

O SandBase também expõe um endpoint compatível com a Anthropic em `POST /v1/messages`. Use o SDK da Anthropic alterando o `base_url`:

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

message = client.messages.create(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "What is the capital of France?"}
    ]
)
print(message.content[0].text)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai',
});

const message = await client.messages.create({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'What is the capital of France?' }],
});
console.log(message.content[0].text);
```

:::

### Estrutura da resposta da Anthropic {#anthropic-response-structure}

O endpoint compatível com a Anthropic retorna uma resposta no estilo da Anthropic. Uma resposta de texto típica tem este formato:

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    {
      "type": "text",
      "text": "The capital of France is Paris."
    }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "stop_sequence": null,
  "usage": {
    "input_tokens": 14,
    "output_tokens": 8
  }
}
```

| Campo | Descrição |
|-------|-------------|
| `id` | ID da mensagem (com prefixo `msg_`) |
| `type` | Tipo do objeto de mensagem, normalmente `"message"` |
| `role` | Papel da mensagem gerada, normalmente `"assistant"` |
| `content` | Array de blocos de conteúdo tipados; não presuma que todo bloco é texto |
| `model` | O modelo que gerou a resposta |
| `stop_reason` | `"end_turn"` (parada natural), `"max_tokens"` (limite atingido) ou `"stop_sequence"` |
| `usage.input_tokens` | Tokens na sua entrada |
| `usage.output_tokens` | Tokens na saída gerada |

### Streaming com a Anthropic {#anthropic-streaming}

O streaming com o SDK da Anthropic funciona da mesma forma — basta passar `stream=True`:

```python
import os
import anthropic

client = anthropic.Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai"
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a haiku about coding."}]
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
print()
```

## Como escolher um modelo {#choosing-a-model}

Ao escolher um modelo, consulte o card dele em tempo real para ver disponibilidade, preços, tamanho de contexto, entradas suportadas e recursos. Esses valores mudam de forma independente, então não confie em uma comparação de modelos copiada.

- Navegue pelo [catálogo de modelos](https://www.sandbase.ai/models) atual.
- Abra a página de um modelo no catálogo para ver os campos de requisição específicos dele.
- Consulte `GET /v1/models` quando uma integração precisar dos metadados atuais dos modelos de forma programática.

Para modelos que compartilham a mesma interface compatível, a troca geralmente começa pelo parâmetro `model`. Verifique novamente os recursos e o schema do modelo selecionado antes de reaproveitar campos opcionais, ferramentas, entradas de mídia ou configurações de saída estruturada.

## Próximos passos {#next-steps}

Antes de ir para produção, defina timeouts para as requisições, repita apenas falhas transitórias com backoff exponencial limitado, registre os IDs de requisição quando disponíveis e monitore o uso sem registrar prompts ou chaves de API em logs.

- [**Referência da API**](/api-reference/) — Endpoints de inferência e contratos da API da plataforma
- [**Guia de streaming**](/guides/streaming) — Padrões avançados de streaming e tratamento de erros
- [**Modelos**](https://www.sandbase.ai/models) — Descoberta de modelos, recursos e preços atuais
- [**Erros**](/guides/error-handling) — Trate falhas e novas tentativas
