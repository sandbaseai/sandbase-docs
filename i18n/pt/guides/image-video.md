---
i18nSource: 8c960d117a998817
title: Modelos de imagem e vídeo
description: Use a Run API compartilhada da SandBase para gerar imagens e vídeos de forma assíncrona.
---

# Modelos de imagem e vídeo {#image-and-video-models}

Modelos de imagem e vídeo usam a Run API assíncrona compartilhada da SandBase. Envie uma tarefa
com `POST /v1/run` e consulte `GET /v1/run/{id}` até que a run atinja um
status terminal.

## Enviar uma tarefa {#submit-a-task}

Use o ID exato do modelo em [Modelos de imagem e vídeo](https://www.sandbase.ai/models/image-video). Os demais
campos da requisição são específicos do modelo; abra a referência da API do modelo para ver suas
entradas obrigatórias e limites.

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "<model-id>",
    "prompt": "A cinematic product shot at sunrise."
  }'
```

A resposta inclui um `id` opaco e um `status` como `pending` ou
`running`.

## Consultar o resultado {#poll-for-the-result}

```bash
curl https://api.sandbase.ai/v1/run/<run-id> \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Continue consultando até que `status` seja `completed`, `failed` ou `timeout`. Runs
concluídas contêm saídas específicas do recurso, como a URL de uma imagem ou de um vídeo. Guarde
o ID da run e trate a resposta da run como o status oficial.

## Callbacks de webhook {#webhook-callbacks}

Tarefas assíncronas suportadas também podem definir `webhook_url` na requisição de envio.
O callback é um aviso de entrega, e não um substituto do polling; continue
usando `GET /v1/run/{id}` e trate callbacks duplicados ou atrasados com segurança. Veja
[Executar um recurso](/api-reference/models/run#webhook-callbacks) para o
contrato comum de callback.

## Recursos de API usam um caminho derivado da URL {#api-capabilities-use-a-url-derived-path}

A Run API compartilhada é para geração com modelos. Os recursos de API do
[catálogo de APIs](https://www.sandbase.ai/apis) usam uma
rota diferente, derivada da URL: `GET` ou `POST /v1/api/{vendor}/{upstream_path}`.
O nome do recurso qualificado pelo fornecedor vem da API de Models ou do catálogo de APIs, então o
campo `model` pode ser omitido do corpo de um POST:

```bash
curl -X POST https://api.sandbase.ai/v1/api/firecrawl/scrape \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

Esta rota é para recursos de API, e não um substituto de `/v1/run` ao
chamar modelos de imagem ou vídeo. Se o recurso de API selecionado for assíncrono,
consulte o ID da run retornado com `GET /v1/run/{id}`.

## Próximos passos {#next-steps}

- [Modelos de imagem e vídeo](https://www.sandbase.ai/models/image-video)
- [Executar um recurso](/api-reference/models/run)
- [Obter o resultado de uma run](/api-reference/models/run-get)
- [API Passthrough](/api-reference/models/api-passthrough)
