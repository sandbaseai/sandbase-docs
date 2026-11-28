---
i18nSource: 335b45fb98c53890
title: Respostas com streaming
description: Transmita a saída dos modelos do SandBase com os SDKs compatíveis com a OpenAI ou a Anthropic e trate resultados parciais com segurança.
---

# Respostas com streaming {#streaming-responses}

O streaming retorna a saída do modelo à medida que ela fica disponível. O SandBase preserva o formato de eventos da API compatível que você
chama: o OpenAI Chat Completions usa Server-Sent Events (SSE) apenas com dados, enquanto o Anthropic Messages usa eventos SSE nomeados.

Sempre que possível, use um SDK oficial compatível. Ele trata o enquadramento dos eventos, os argumentos incrementais de chamadas de ferramenta e o
encerramento do protocolo com mais segurança do que dividir você mesmo o texto bruto da resposta.

## OpenAI Chat Completions {#openai-chat-completions}

Defina `stream: true` em `POST /v1/chat/completions`.

::: code-group

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
)

stream = client.chat.completions.create(
    model="deepseek/deepseek-v4-flash",
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
    stream=True,
)

for chunk in stream:
    text = chunk.choices[0].delta.content
    if text:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  baseURL: 'https://api.sandbase.ai/v1',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = await client.chat.completions.create({
  model: 'deepseek/deepseek-v4-flash',
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
  stream: true,
});

for await (const chunk of stream) {
  const text = chunk.choices[0]?.delta?.content;
  if (text) process.stdout.write(text);
}
```

```bash [cURL]
curl -N https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Explain quantum computing briefly."}],
    "stream": true
  }'
```

:::

Os chunks compatíveis com a OpenAI colocam o texto incremental em `choices[0].delta.content`. Os argumentos de chamadas de ferramenta, quando suportados pelo
modelo selecionado, chegam como fragmentos de string em `delta.tool_calls`; concatene os fragmentos por índice de choice e de chamada de ferramenta
antes de fazer o parse do JSON completo. O stream normalmente termina com `data: [DONE]`.

Não presuma que todo provedor retorna o uso de tokens em um stream. Se o modelo selecionado suportar o
`stream_options.include_usage` da OpenAI, o uso pode aparecer perto do fim; caso contrário, use a resposta sem streaming ou o
fluxo de custo de tarefa aplicável.

## Anthropic Messages {#anthropic-messages}

Use o SDK da Anthropic com `POST /v1/messages`. O helper de stream do SDK monta os eventos nomeados e os blocos de conteúdo.

::: code-group

```python [Python]
import os
import anthropic

client = anthropic.Anthropic(
    base_url="https://api.sandbase.ai",
    api_key=os.environ["SANDBASE_API_KEY"],
)

with client.messages.stream(
    model="anthropic/claude-sonnet-5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Explain quantum computing briefly."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="", flush=True)
```

```javascript [JavaScript]
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({
  baseURL: 'https://api.sandbase.ai',
  apiKey: process.env.SANDBASE_API_KEY,
});

const stream = client.messages.stream({
  model: 'anthropic/claude-sonnet-5',
  max_tokens: 1024,
  messages: [{ role: 'user', content: 'Explain quantum computing briefly.' }],
});

stream.on('text', (text) => process.stdout.write(text));
await stream.finalMessage();
```

:::

Streams brutos da Anthropic usam nomes de evento como `message_start`, `content_block_start`, `content_block_delta`,
`content_block_stop`, `message_delta` e `message_stop`. O texto vem em blocos `text_delta`. A entrada de ferramentas usa
blocos JSON incrementais, que precisam ser montados antes do parse.

## Trate interrupções e cancelamentos {#handle-interruption-and-cancellation}

Um erro HTTP retornado antes do início do streaming usa o corpo de erro normal do endpoint. Depois que a resposta começa,
uma falha de rede pode deixar um texto parcial sem evento final. Considere a saída completa somente após o sinal de
encerramento normal do protocolo.

- Mantenha a saída parcial separada do estado confirmado da aplicação.
- Limite os timeouts de conexão e de inatividade no seu próprio cliente ou proxy de acordo com a carga de trabalho.
- Use o mecanismo de cancelamento do SDK ou um `AbortController` em JavaScript quando o usuário interromper a geração.
- Não anexe automaticamente um stream repetido à saída parcial; uma nova tentativa é uma nova geração.
- Evite o buffering de SSE nos proxies reversos que você controla.

```javascript
const controller = new AbortController();

const response = await fetch('https://api.sandbase.ai/v1/chat/completions', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.SANDBASE_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    model: 'deepseek/deepseek-v4-flash',
    messages: [{ role: 'user', content: 'Write a short story.' }],
    stream: true,
  }),
  signal: controller.signal,
});

// Call controller.abort() when the user cancels.
```

Ao ler SSE bruto, faça o parse de frames de evento completos separados por linhas em branco. Os chunks de rede não correspondem um a um
aos eventos SSE, e um caractere UTF-8 pode ficar dividido entre chunks. Use um decodificador de texto em streaming e guarde qualquer frame incompleto
até que cheguem mais bytes.

## Orientações relacionadas {#related-guidance}

- [Chat Completions](/guides/chat-completions)
- [Anthropic Messages](/guides/anthropic-messages)
- [Tratamento de erros](/guides/error-handling)
- [Limites de taxa](/guides/rate-limiting)
