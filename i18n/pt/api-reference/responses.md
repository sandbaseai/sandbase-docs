---
i18nSource: b5cf676d897d17a3
title: Criar resposta
description: Crie uma resposta de modelo compatível com OpenAI, incluindo requisições com streaming e com ferramentas.
aside: false
outline: false
apiReference:
  title: Criar resposta
  operation: Inference
  method: POST
  path: /v1/responses
  description: Cria uma resposta de modelo compatível com OpenAI. A SandBase preserva os campos da requisição após o mapeamento do modelo e, em seguida, sanitiza as respostas para conter apenas campos públicos da OpenAI.
  signature: client.responses.create(params)
  groups:
    - title: Corpo da requisição
      schema: ResponseCreateParams
      fields:
        - name: model
          type: string
          required: true
          description: Identificador do modelo da Models API.
        - name: input
          type: string | object[]
          required: false
          description: Texto, itens de mensagem ou outra entrada suportada pelo modelo e provedor selecionados.
        - name: instructions
          type: string
          required: false
          description: Instrução de sistema ou de desenvolvedor para a resposta.
        - name: stream
          type: boolean
          required: false
          default: "false"
          description: Retorna Server-Sent Events compatíveis com OpenAI.
        - name: background
          type: boolean
          required: false
          description: Solicita execução em segundo plano quando o provedor selecionado oferece suporte.
        - name: include
          type: string[]
          required: false
          description: Dados públicos adicionais da resposta a incluir, quando suportado.
        - name: max_output_tokens
          type: integer
          required: false
          description: Máximo de tokens gerados.
        - name: max_tool_calls
          type: integer
          required: false
          description: Máximo de chamadas de ferramentas integradas, quando suportado.
        - name: metadata
          type: object
          required: false
          description: Metadados da requisição repassados ao provedor.
        - name: parallel_tool_calls
          type: boolean
          required: false
          description: Permite que modelos compatíveis chamem ferramentas em paralelo.
        - name: previous_response_id
          type: string
          required: false
          description: Resposta anterior a continuar, quando a rota selecionada oferece suporte.
        - name: reasoning
          type: object
          required: false
          description: Configuração de raciocínio para modelos compatíveis.
        - name: store
          type: boolean
          required: false
          description: Solicita o armazenamento da resposta no provedor, quando suportado.
        - name: text
          type: object
          required: false
          description: Configuração de saída de texto e de formato estruturado.
        - name: tool_choice
          type: string | object
          required: false
          description: Controla a seleção de ferramentas.
        - name: tools
          type: object[]
          required: false
          description: Ferramentas disponíveis para o modelo.
        - name: truncation
          type: string
          required: false
          description: Comportamento de truncamento da entrada.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/responses \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-5.2","input":"Explain immutable infrastructure in one sentence."}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-sb-...", base_url="https://api.sandbase.ai/v1")
        response = client.responses.create(
            model="openai/gpt-5.2",
            input="Explain immutable infrastructure in one sentence.",
        )
        print(response.output_text)
    - label: TypeScript
      language: typescript
      code: |-
        import OpenAI from "openai";

        const client = new OpenAI({ apiKey: process.env.SANDBASE_API_KEY, baseURL: "https://api.sandbase.ai/v1" });
        const response = await client.responses.create({
          model: "openai/gpt-5.2",
          input: "Explain immutable infrastructure in one sentence.",
        });
        console.log(response.output_text);
  response:
    status: 200 OK
    code: |-
      {
        "id": "resp_01...",
        "object": "response",
        "status": "completed",
        "model": "openai/gpt-5.2",
        "output": [],
        "usage": {
          "input_tokens": 18,
          "output_tokens": 12,
          "total_tokens": 30,
          "input_tokens_details": {"cached_tokens": 0},
          "output_tokens_details": {"reasoning_tokens": 0}
        }
      }
  notes:
    - title: Compatibilidade da requisição
      description: A SandBase reescreve model para o modelo upstream selecionado e preserva os demais campos da requisição. O suporte ainda varia conforme o provedor.
    - title: Respostas sanitizadas
      description: Somente os campos públicos de resposta da OpenAI e o uso de tokens são retornados. Dados de faturamento, conta e roteamento do provedor, além de extensões desconhecidas de nível superior, são removidos; o conteúdo dos itens de saída é preservado.
    - title: Streaming
      description: Os eventos SSE públicos response.* e error são sanitizados e repassados. Eventos privados desconhecidos são descartados; dados malformados encerram o stream em vez de repassar conteúdo inseguro.
  errors:
    - status: "400"
      description: JSON inválido, model ausente ou requisição inválida para o provedor.
    - status: "401"
      description: Chave de API ausente ou inválida.
    - status: "402"
      description: Limite de gastos da organização ou da chave de API atingido.
    - status: "403"
      description: Escopo da chave de API ou permissão do upstream recusada.
    - status: "413"
      description: O provedor upstream rejeitou a requisição por ser grande demais.
    - status: "500"
      description: Falha no ciclo de vida da predição ou na consulta da organização.
    - status: "502"
      description: Não foi possível analisar e sanitizar a resposta do upstream com segurança.
    - status: "503"
      description: Falha no roteamento ou todos os provedores candidatos foram esgotados.
---

<ApiReferencePage />
