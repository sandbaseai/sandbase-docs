---
i18nSource: efa205ed7505643c
title: Executar um modelo ou capacidade de API
description: Envie um modelo ou capacidade de API da SandBase pelo endpoint unificado de execução.
aside: false
outline: false
apiReference:
  title: Executar um modelo ou capacidade de API
  operation: Models
  method: POST
  path: /v1/run
  description: Executa um modelo ou capacidade de API habilitado da SandBase. Os campos da requisição são específicos de cada capacidade; consulte a página de referência do modelo ou da API no site da SandBase para ver o schema da capacidade selecionada.
  groups:
    - title: Corpo da requisição
      fields:
        - name: model
          type: string
          required: true
          description: Identificador do modelo lógico ou da capacidade de API habilitada.
        - name: mode
          type: auto | sync | async | stream
          required: false
          description: Indicação do modo de execução. `auto` usa o padrão configurado da capacidade selecionada; outros valores exigem suporte da capacidade.
        - name: stream
          type: boolean
          required: false
          description: "Solicita saída em streaming quando a capacidade selecionada oferece suporte. Equivale a `mode: stream`."
        - name: webhook_url
          type: string
          required: false
          description: Callback HTTPS opcional para tarefas assíncronas de imagem
          video: null
          or audio tasks. See the Webhooks reference for validation and delivery behavior.: null
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/v1/run \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"openai/gpt-image-2","prompt":"A studio product photo on a clean white background"}'
  response:
    status: 200 OK or 202 Accepted
    code: |-
      {
        "id": "opaque-run-id",
        "model": "openai/gpt-image-2",
        "status": "pending"
      }
---

<ApiReferencePage />

## Execução e resultados {#execution-and-results}

Capacidades síncronas retornam uma resposta concluída na própria requisição original. Capacidades assíncronas retornam `202 Accepted` com um `id` opaco; consulte [Obter uma execução assíncrona](./run-get) periodicamente até que o status seja final.

Os campos de requisição e os formatos de saída específicos de cada capacidade são definidos na página do modelo ou da operação de API selecionada. Envie esses campos no nível superior do corpo JSON; não os coloque dentro de um objeto `input`. Não presuma que todas as capacidades aceitam os mesmos parâmetros.

## Callbacks de webhook {#webhook-callbacks}

Defina `webhook_url` apenas para tarefas assíncronas de imagem, vídeo ou áudio com suporte. A SandBase envia o evento final da execução para o endpoint HTTPS após a conclusão ou falha; o callback é um aviso de entrega e não substitui `GET /v1/run/{id}`. Continue sempre consultando o endpoint da execução para obter o status oficial e faça novas tentativas com segurança quando um callback atrasar ou chegar duplicado. Respostas síncronas de modelos e endpoints nativos de provedores não usam esse campo de callback.

