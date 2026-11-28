---
i18nSource: 04f3657850b71e58
title: Criar mensagem Anthropic
description: Crie uma mensagem compatível com a Anthropic usando um modelo do SandBase.
aside: false
outline: false
apiReference:
  title: Criar mensagem Anthropic
  operation: Inference
  method: POST
  path: /v1/messages
  description: Cria uma mensagem pelo endpoint Messages compatível com a Anthropic do SandBase. O SandBase mapeia o modelo para o provedor selecionado e preserva os campos compatíveis da requisição e da resposta.
  signature: client.messages.create(params)
  groups:
    - title: Headers da requisição
      fields:
        - name: x-api-key
          type: string
          required: false
          description: "Chave de API do SandBase. Authorization: Bearer também é aceito; x-api-key tem precedência quando ambos estão presentes."
        - name: anthropic-version
          type: string
          required: false
          default: 2023-06-01
          description: Versão da API da Anthropic repassada ao upstream. O SandBase usa 2023-06-01 quando omitido.
        - name: anthropic-beta
          type: string
          required: false
          description: Identificadores de recursos beta separados por vírgula, sujeitos à compatibilidade do provedor.
    - title: Corpo da requisição
      schema: MessageCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identificador de modelo compatível com a Anthropic.
        - name: messages
          type: object[]
          required: true
          description: Mensagens de usuário e de assistente com texto ou blocos de conteúdo tipados.
        - name: max_tokens
          type: integer
          required: true
          description: Número máximo de tokens de saída.
        - name: system
          type: string | object[]
          required: false
          description: Instrução de sistema de nível superior.
        - name: temperature
          type: number
          required: false
          default: "1"
          description: Temperatura de amostragem, de 0 a 1.
        - name: top_p
          type: number
          required: false
          description: Limite de amostragem nucleus.
        - name: top_k
          type: integer
          required: false
          description: Limita a amostragem aos K tokens mais prováveis.
        - name: stop_sequences
          type: string[]
          required: false
          description: Sequências personalizadas que interrompem a geração.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Retorna Server-Sent Events no estilo da Anthropic.
        - name: metadata
          type: object
          required: false
          description: Metadados da requisição, incluindo um user_id opcional.
        - name: tools
          type: object[]
          required: false
          description: Definições de ferramentas disponíveis para o modelo.
        - name: tool_choice
          type: object
          required: false
          description: Controla o comportamento de seleção de ferramentas.
        - name: thinking
          type: object
          required: false
          description: Configuração de extended thinking para os modelos compatíveis.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/messages \
          -H "x-api-key: $SANDBASE_API_KEY" \
          -H "anthropic-version: 2023-06-01" \
          -H "Content-Type: application/json" \
          -d '{"model":"anthropic/claude-sonnet-4","max_tokens":256,"messages":[{"role":"user","content":"Hello"}]}'
    - label: Python
      language: python
      code: |-
        from anthropic import Anthropic

        client = Anthropic(api_key="sk-sb-...", base_url="https://api.sandbase.ai")
        message = client.messages.create(
            model="anthropic/claude-sonnet-4",
            max_tokens=256,
            messages=[{"role": "user", "content": "Hello"}],
        )
        print(message.content[0].text)
    - label: TypeScript
      language: typescript
      code: |-
        import Anthropic from "@anthropic-ai/sdk";

        const client = new Anthropic({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai" });
        const message = await client.messages.create({
          model: "anthropic/claude-sonnet-4",
          max_tokens: 256,
          messages: [{ role: "user", content: "Hello" }],
        });
        console.log(message.content);
  response:
    status: 200 OK
    code: |-
      {
        "id": "msg_01...",
        "type": "message",
        "role": "assistant",
        "model": "anthropic/claude-sonnet-4",
        "content": [{ "type": "text", "text": "Hello! How can I help?" }],
        "stop_reason": "end_turn",
        "usage": { "input_tokens": 8, "output_tokens": 7 }
      }
  notes:
    - title: Autenticação
      description: "Use x-api-key ou Authorization: Bearer. Quando ambos são enviados, x-api-key tem precedência."
    - title: Protocolo transparente
      description: Exceto pelo mapeamento de modelos e pelas regras de compatibilidade de provedor configuradas, o SandBase repassa os campos de requisição compatíveis, as respostas sem streaming e os eventos SSE sem tradução de protocolo.
    - title: Recursos beta
      description: anthropic-beta é repassado quando presente. As regras de compatibilidade de um candidato podem remover campos beta não suportados ou pular esse candidato.
  errors:
    - status: "400"
      description: Corpo da requisição inválido ou recurso não suportado.
    - status: "401"
      description: Chave de API ausente ou inválida.
    - status: "402"
      description: Limite de gastos da organização atingido.
    - status: "403"
      description: Limite de gastos da chave de API ou falha de permissão da organização.
    - status: "404"
      description: Modelo não encontrado ou indisponível.
    - status: "413"
      description: O provedor rejeitou a requisição por ser grande demais.
    - status: "429"
      description: Limite de taxa do provedor excedido.
    - status: "500"
      description: Erro no ciclo de vida da predição ou do provedor.
    - status: "502"
      description: O stream do upstream terminou antes de haver conteúdo utilizável.
    - status: "503"
      description: O roteamento falhou ou todos os provedores candidatos estavam indisponíveis.
---

<ApiReferencePage />
