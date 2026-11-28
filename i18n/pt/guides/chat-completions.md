---
i18nSource: 1fdcd80dbbac0247
title: Chat Completions
description: Use chat completions compatíveis com a OpenAI, streaming, ferramentas, entrada multimodal e saída estruturada com o SandBase.
---

# Chat Completions {#chat-completions}

O SandBase oferece um endpoint Chat Completions compatível com a OpenAI em `POST /v1/chat/completions`. Aplicações existentes que usam o SDK da OpenAI podem usar o SandBase alterando a chave de API e a URL base.

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)
```

## Mensagens e conteúdo multimodal {#messages-and-multimodal-content}

Envie as mensagens na ordem da conversa usando os papéis suportados pelo provedor selecionado, normalmente `system`, `developer`, `user`, `assistant` e `tool`. O texto pode ser uma string. Modelos com suporte a visão também aceitam partes de conteúdo como `text` e `image_url`.

## Streaming {#streaming}

Defina `stream: true` para receber Server-Sent Events. Leia cada evento `data:` em ordem e concatene `choices[0].delta.content`. O stream termina com `data: [DONE]`. Adicione `stream_options: {"include_usage": true}` quando o provedor selecionado informar o uso no streaming; caso contrário, o uso pode não vir.

## Ferramentas {#tools}

Defina funções chamáveis em `tools`. Quando o assistente retornar `tool_calls`, execute cada função na sua aplicação e, em seguida, adicione uma mensagem `tool` com o `tool_call_id` correspondente antes de continuar.

## Saída estruturada {#structured-output}

Use `response_format` para solicitar uma resposta em objeto JSON ou JSON Schema. O suporte varia por modelo, então verifique os recursos do modelo selecionado antes de depender da validação estrita do schema.

## Parâmetros específicos do provedor {#provider-specific-parameters}

O SandBase usa `model` e `stream` para o roteamento. Campos de requisição adicionais compatíveis com a OpenAI são preservados quando o provedor selecionado usa o mesmo protocolo. Quando o SandBase faz a tradução entre protocolos, use os campos documentados ou `extra_body`; o suporte varia por provedor.

## Erros e novas tentativas {#errors-and-retries}

Use backoff limitado para respostas `429` que permitem nova tentativa e para respostas transitórias do servidor somente quando gerar novamente for seguro. Não repita automaticamente requisições malformadas, falhas de autenticação ou requisições cujos efeitos colaterais de ferramentas possam já ter ocorrido. Consulte [Erros e novas tentativas](/guides/error-handling). Para o schema completo de campos e respostas, consulte a [API Chat Completions](/api-reference/llm-gateway).
