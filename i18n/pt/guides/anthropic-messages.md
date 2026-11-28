---
i18nSource: 1afa8f1905c6e53c
title: Anthropic Messages
description: Use mensagens, blocos de conteúdo, ferramentas, raciocínio estendido e streaming compatíveis com Anthropic na SandBase.
---

# Anthropic Messages {#anthropic-messages}

A SandBase oferece um endpoint compatível com Anthropic em `POST /v1/messages`. Aplicações que usam o SDK da Anthropic podem se conectar trocando a chave de API e a URL base.

```python
import os
from anthropic import Anthropic

client = Anthropic(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai",
)
```

## Autenticação e cabeçalhos de versão {#authentication-and-version-headers}

Use `x-api-key` ou `Authorization: Bearer …`. Quando ambos são enviados, `x-api-key` tem precedência. O cabeçalho opcional `anthropic-version` é repassado ao upstream e assume `2023-06-01` quando omitido. Valores opcionais de `anthropic-beta` também são repassados, sujeitos à compatibilidade do provedor.

## Mensagens e blocos de conteúdo {#messages-and-content-blocks}

As mensagens usam os papéis `user` e `assistant`. Coloque a instrução de sistema no campo `system` de nível superior. O conteúdo pode ser texto simples ou um array de blocos tipados, como `text`, `image`, `tool_use` e `tool_result`.

## Ferramentas e raciocínio estendido {#tools-and-extended-thinking}

Adicione definições de ferramentas em `tools` e controle a seleção com `tool_choice`. Quando o modelo selecionado oferecer suporte, configure o raciocínio estendido com `thinking`; preserve os blocos de raciocínio retornados ao continuar a conversa.

## Streaming {#streaming}

Defina `stream: true` para receber eventos SSE no estilo da Anthropic, incluindo `message_start`, eventos de bloco de conteúdo, `message_delta` e `message_stop`. A SandBase também repassa eventos de keepalive e eventos beta definidos pelo provedor. Os consumidores devem ignorar tipos de evento desconhecidos para manter a compatibilidade futura e tratar eventos `error` no nível do protocolo.

## Compatibilidade {#compatibility}

A SandBase mapeia o nome público do modelo para o provedor selecionado. Os demais campos de requisição compatíveis e os bytes da resposta são preservados, a menos que esse provedor tenha uma regra de compatibilidade explícita que remova um campo não suportado ou rejeite o candidato. Recursos beta específicos de provedores podem não estar disponíveis em todos os modelos. Para o schema completo de requisição e resposta, consulte [Criar Anthropic Message](/api-reference/anthropic-compat).

