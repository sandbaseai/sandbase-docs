---
i18nSource: 8ddefa727d909bc8
title: Google Gemini Interactions
description: Crie, transmita e consulte Interactions de modelos pelo protocolo nativo do Google.
aside: false
outline: false
apiReference:
  title: Google Gemini Interactions
  operation: Gemini
  method: POST
  path: /v1beta/interactions
  description: Cria uma Interaction nativa do Google. Verifique status mesmo com HTTP 200; uma resposta in_progress precisa ser consultada por polling.
  groups:
    - title: Corpo da requisição
      fields:
        - name: model
          type: string
          required: true
          description: Nome lógico do modelo no SandBase.
        - name: input
          type: string | object | array
          required: true
          description: Entrada nativa da Interaction do Google.
        - name: stream
          type: boolean
          required: false
          description: Retorna eventos SSE do Google Interactions quando o modelo suporta.
        - name: background
          type: boolean
          required: false
          description: Envia de forma durável e retorna uma Interaction que pode ser consultada imediatamente. Não pode ser combinado com stream.
        - name: previous_interaction_id
          type: string
          required: false
          description: Continua a partir de uma Interaction upstream, preservando a afinidade de provedor.
        - name: store
          type: boolean
          required: false
          description: Repassa a preferência de armazenamento upstream sem alterações.
        - name: system_instruction
          type: string
          required: false
          description: Instrução de sistema nativa.
        - name: tools
          type: array
          required: false
          description: Definições de ferramentas nativas do Google.
        - name: generation_config
          type: object
          required: false
          description: Configuração de geração nativa.
        - name: response_format
          type: object | array
          required: false
          description: Formato de resposta solicitado.
        - name: response_modalities
          type: array
          required: false
          description: Modalidades de saída solicitadas.
  examples:
    - label: Background request
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1beta/interactions \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "google/gemini-omni-flash-preview",
            "input": "A red ball rolls across a table, 3 seconds.",
            "background": true,
            "response_format": {"type": "video"}
          }'
  response:
    status: 200 OK
    code: |-
      {
        "id": "job_75b74acd12534b01baba820b",
        "object": "interaction",
        "model": "google/gemini-omni-flash-preview",
        "status": "in_progress"
      }
---

<ApiReferencePage />

## Autenticação {#authentication}

Use `x-goog-api-key`, `Authorization: Bearer …` ou o parâmetro de query `key`, nessa ordem de prioridade. Prefira um header, porque credenciais na query string podem ser registradas em logs.

## Modelos suportados {#supported-models}

O endpoint Interactions não é uma rota genérica para todo modelo cujo nome no catálogo começa com `google/`. O modelo
precisa ter um mapeamento de provedor compatível com Interactions. Atualmente, o SandBase documenta estes modelos compatíveis:

- Gemini Omni Flash Preview: `google/gemini-omni-flash-preview`
- Gemini Omni 1.1 Flash Preview: `google/gemini-omni-1.1-flash-preview`

Outros modelos do Google usam outros endpoints. Por exemplo, Nano Banana Pro e Nano Banana 2 usam
[`/v1beta/models/{model}:generateContent`](/api-reference/gemini-generate-content), e não `/v1beta/interactions`. Um modelo não suportado falha em vez de ser roteado
por outro protocolo do Google.

## Sucesso e polling {#success-and-polling}

Envios bem-sucedidos retornam HTTP `200`, inclusive para trabalhos em segundo plano e requisições síncronas cujo tempo de espera limitado expira. Sempre verifique `status`:

- `completed`, `failed`, `cancelled` e `incomplete` são terminais.
- `in_progress` ainda está em execução. Consulte `GET /v1beta/interactions/{id}`; a resposta também pode incluir esse caminho no header `Location`.
- `requires_action` é um status do protocolo, mas o SandBase ainda não expõe o endpoint de confirmação de ferramentas necessário para avançá-lo.

O ID de polling é o `id` da Interaction upstream retornado pelo `POST`, e não um ID de predição do SandBase. A mesma chave de API do SandBase que criou a Interaction deve recuperá-la.

```bash
curl https://api.sandbase.ai/v1beta/interactions/job_75b74acd12534b01baba820b \
  -H "x-goog-api-key: $SANDBASE_API_KEY"
```

Respostas GET não terminais omitem a saída parcial e o uso. Respostas terminais podem incluir dados de imagem, áudio ou vídeo inline e ter vários megabytes. Baixe e armazene a mídia necessária sem demora: depois que a retenção upstream expira, o SandBase só consegue retornar um fallback terminal com perdas, com estrutura e metadados, e não os bytes originais da mídia.

## Streaming {#streaming}

Defina `stream: true` no corpo da requisição. A resposta é `text/event-stream`; `?alt=sse` não é usado por este protocolo. Os tipos de evento e de delta são abertos e repassados sem uma allowlist fixa, então os clientes devem tolerar valores desconhecidos. Depois que os headers de streaming forem escritos, as falhas chegam como um evento `error`, e não como um status HTTP diferente.

O streaming depende do modelo. Um provedor upstream pode rejeitar `stream: true` mesmo que o protocolo o suporte.

## Limites atuais {#current-limits}

Atualmente, o SandBase expõe apenas create e get:

- Agent Interactions são rejeitadas; use `model`.
- `background: true` e `stream: true` não podem ser combinados.
- Listar, excluir e cancelar Interactions não estão disponíveis.
- Entrega por URI e reconexão de stream via GET não estão disponíveis.
- `previous_interaction_id` exige um mapeamento ativo de afinidade de provedor e suporte upstream. O SandBase falha em vez de trocar de provedor silenciosamente quando a afinidade não está disponível.

Os erros usam o envelope do Google `{ "error": { "code", "message", "status" } }`. Trate o status HTTP como estável; o texto upstream sanitizado em `message` pode mudar.
