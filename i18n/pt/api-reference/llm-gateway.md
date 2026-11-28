---
i18nSource: 9ee3d6d77d12e944
title: Chat Completions API
description: Crie chat completions compatíveis com a OpenAI com os modelos de linguagem e visão do SandBase.
aside: false
outline: false
apiReference:
  title: Criar chat completion
  operation: Inference
  method: POST
  path: /v1/chat/completions
  description: Crie um chat completion compatível com a OpenAI com qualquer modelo de chat suportado pelo SandBase. Campos compatíveis com o provedor são preservados quando a rota selecionada os suporta.
  signature: client.chat.completions.create(params)
  groups:
    - title: Corpo da requisição
      schema: ChatCompletionCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identificador do modelo na Models API.
        - name: messages
          type: object[]
          required: true
          description: Mensagens da conversa usando as roles suportadas pelo provedor selecionado, normalmente system, developer, user, assistant ou tool.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Temperatura de amostragem, de 0 a 2.
        - name: top_p
          type: number
          required: false
          default: "1"
          description: Limite de nucleus sampling.
        - name: max_tokens
          type: integer
          required: false
          description: Número máximo de tokens de saída.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Retorna Server-Sent Events incrementais.
        - name: stop
          type: string | string[]
          required: false
          description: Sequência ou sequências que interrompem a geração.
        - name: tools
          type: object[]
          required: false
          description: Definições de funções disponíveis para o modelo.
        - name: tool_choice
          type: string | object
          required: false
          default: auto
          description: Controla se uma ferramenta é selecionada e qual.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Permite que modelos suportados emitam várias chamadas de ferramenta em um turn.
        - name: user
          type: string
          required: false
          description: Identificador do usuário final compatível com o provedor.
        - name: response_format
          type: object
          required: false
          description: Configuração de saída em objeto JSON ou JSON Schema.
        - name: reasoning_effort
          type: string
          required: false
          description: Configuração de esforço de raciocínio compatível com o provedor.
        - name: reasoning
          type: object
          required: false
          description: Configuração de raciocínio, como effort ou max_tokens.
        - name: thinking
          type: object
          required: false
          description: Configuração de thinking, como type ou budget_tokens.
        - name: extra_body
          type: object
          required: false
          description: Parâmetros específicos do provedor para rotas que exigem tradução de protocolo.
        - name: n
          type: integer
          required: false
          default: "1"
          description: Número de opções de completion a gerar.
        - name: presence_penalty
          type: number
          required: false
          default: "0"
          description: Penalidade de presença, de -2 a 2.
        - name: frequency_penalty
          type: number
          required: false
          default: "0"
          description: Penalidade de frequência, de -2 a 2.
        - name: stream_options
          type: object
          required: false
          description: Opções de streaming, como include_usage.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/chat/completions \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"deepseek/deepseek-v4-flash","messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(response.choices[0].message.content)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.chat.completions.create({
          model: "deepseek/deepseek-v4-flash",
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(response.choices[0].message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "chatcmpl_01...",
        "object": "chat.completion",
        "model": "deepseek/deepseek-v4-flash",
        "choices": [{
          "index": 0,
          "message": { "role": "assistant", "content": "Hello! How can I help?" },
          "finish_reason": "stop"
        }],
        "usage": { "prompt_tokens": 8, "completion_tokens": 7, "total_tokens": 15 }
      }
  notes:
    - title: Streaming e ferramentas
      description: "Defina stream como true para SSE; o stream termina com data: [DONE]. Adicione stream_options.include_usage para receber o chunk final de uso. Chamadas de ferramenta e conteúdo multimodal seguem o schema compatível com a OpenAI."
    - title: Compatibilidade com provedores
      description: O SandBase preserva campos compatíveis adicionais em rotas do mesmo protocolo. O suporte a campos entre protocolos e específicos do provedor varia; use extra_body quando aplicável.
  errors:
    - status: "400"
      description: Corpo da requisição inválido ou parâmetro não suportado.
    - status: "401"
      description: API key ausente ou inválida.
    - status: "402"
      description: Limite de gastos da organização atingido.
    - status: "404"
      description: Modelo não encontrado ou indisponível.
    - status: "429"
      description: Limite de taxa excedido.
    - status: "500"
      description: Falha ao persistir a requisição ou ao consultar a organização.
    - status: "502"
      description: O provedor selecionado retornou uma resposta inválida.
    - status: "503"
      description: Nenhuma rota de provedor teve sucesso.
---

<ApiReferencePage />
