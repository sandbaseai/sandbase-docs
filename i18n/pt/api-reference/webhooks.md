---
i18nSource: efd4d5f7b8980661
title: Webhooks
description: Registre e gerencie webhooks da SandBase para eventos assíncronos de modelo.
---

# Webhooks {#webhooks}

A SandBase suporta dois modos de callback de saída:

- **Webhooks registrados** têm escopo na sua organização, assinam eventos assíncronos de Model e incluem um `X-Signature` HMAC.
- **Callbacks de modelo por tarefa** usam `webhook_url` em uma única requisição assíncrona de imagem, vídeo ou áudio. Eles não exigem registro e não incluem `X-Signature`.

Ambos os modos usam entrega at-least-once. Torne os handlers idempotentes com o ID do evento.

## Registrar um webhook {#register-a-webhook}

A Events API é a interface pública com chave de API:

```text
POST https://api.sandbase.ai/events/webhooks
```

Você também pode criar e gerenciar webhooks na [página Webhooks do Console](https://www.sandbase.ai/console/webhooks).

```bash
curl -X POST https://api.sandbase.ai/events/webhooks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Model generation monitor",
    "url": "https://example.com/hooks/sandbase",
    "resourceType": "model",
    "events": ["model.generation.completed", "model.generation.failed"]
  }'
```

| Campo | Tipo | Obrigatório | Descrição |
|---|---|---:|---|
| `name` | string | Sim | Um nome legível. |
| `url` | string | Sim | Um endpoint HTTP(S) válido. Use HTTPS em produção. |
| `resourceType` | `model` | Sim | Seleciona os eventos assíncronos de Model abaixo. `model` é o único valor suportado. |
| `events` | string[] | Não | Vazio ou omitido significa todos os eventos atuais e futuros do tipo de recurso selecionado. |
| `enabled` | boolean | Não | O padrão é `true`. |
| `signatureSecret` | string | Não | Omita este campo para que a SandBase gere um secret de alta entropia. Clientes existentes podem continuar informando seu próprio valor não vazio. |

Os tipos de recurso `session`, `sandbox` e `template` foram descontinuados: criar um webhook com qualquer um deles retorna HTTP 400. Registros existentes desses tipos são listados para limpeza: um `PATCH` neles retorna HTTP 400, a menos que a mesma requisição altere `resourceType` para `model` (e a assinatura resultante seja válida), então exclua-os ou converta-os para `model`. Assinaturas `model` estão disponíveis apenas para os eventos terminais assíncronos de imagem, vídeo e áudio listados abaixo. A API rejeita eventos de outros tipos de recurso e nomes de evento desconhecidos.

### Resposta de sucesso {#successful-response}

A Events API retorna diretamente o webhook registrado. O `signatureSecret` final é incluído apenas nesta resposta de criação. Armazene-o com segurança agora: as respostas de listagem e edição nunca o retornam, e ele não pode ser recuperado depois.

```json
{
  "id": "wh_01...",
  "name": "Model generation monitor",
  "url": "https://example.com/hooks/sandbase",
  "resourceType": "model",
  "events": ["model.generation.completed", "model.generation.failed"],
  "enabled": true,
  "createdAt": "2026-07-15T12:00:00Z",
  "signatureSecret": "whsec_<one-time-value>"
}
```

A [página Webhooks do Console](https://www.sandbase.ai/console/webhooks) mostra o secret gerado uma única vez após o registro e exige que você o salve antes de fechar a caixa de diálogo.

### Listar, editar e excluir {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

Use a mesma autenticação por chave de API. Um `PATCH` pode incluir um ou mais de `name`, `url`, `resourceType`, `events` e `enabled`; campos omitidos permanecem inalterados. A assinatura resultante completa de `resourceType` e `events` deve ser válida. Um array `events` vazio ainda significa todos os eventos daquele tipo de recurso.

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

`signatureSecret` não pode ser visualizado nem alterado por `PATCH`; uma requisição que o contenha é rejeitada. Se o secret for perdido, exclua e recrie o webhook. Você também pode visualizar, editar, ativar ou desativar e excluir registros na [página Webhooks do Console](https://www.sandbase.ai/console/webhooks).

`GET` retorna um array JSON de webhooks (sem `signatureSecret`), `PATCH` retorna o webhook atualizado e `DELETE`
retorna `204 No Content`.

### Autenticação e erros {#authentication-and-errors}

A Events API aceita a chave de API como `Authorization: Bearer $SANDBASE_API_KEY` ou `X-API-Key: $SANDBASE_API_KEY`. Quando
ambos são enviados, o cabeçalho Bearer é usado.

Os erros usam um corpo próprio, com o status HTTP repetido em `code`:

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

Ramifique pelo status HTTP. `401` significa que a chave está ausente, é inválida ou foi revogada; `400` significa que o corpo da requisição ou
a assinatura é inválido; `404` (`webhook not found`) significa que o webhook não existe na sua organização.

## Callback de modelo por tarefa {#per-task-model-callback}

Para uma única tarefa assíncrona de imagem, vídeo ou áudio, adicione `webhook_url` a `POST /v1/run` em vez de registrar um novo webhook:

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "example/async-image-model",
    "mode": "async",
    "prompt": "A lighthouse at night",
    "webhook_url": "https://hooks.example.com/sandbase/task?token=opaque-token"
  }'
```

O campo só é interpretado e validado quando o modelo selecionado é de imagem, vídeo ou áudio e a requisição resulta em execução assíncrona. Nesse caso, ele deve ser uma string não vazia contendo uma URL HTTPS pública, válida e segura; caso contrário, a requisição retorna HTTP 400. Para requisições síncronas, de streaming, de LLM ou outras não suportadas, a SandBase ignora `webhook_url` independentemente do valor JSON: não agenda callback, não armazena URL de callback e não repassa o campo ao provedor do modelo. Omitir o campo preserva o fluxo de polling existente.

O destino deve ser uma URL HTTPS pública. A SandBase envia o mesmo envelope terminal de Model documentado abaixo, com `Content-Type: application/json` e `X-Event-ID`, para completed, failed, timeout ou cancelled. Ela pode repetir uma entrega com falha, então elimine duplicatas por `id` ou `X-Event-ID` e retorne 2xx rapidamente.

Um callback por tarefa não tem um secret compartilhado da SandBase e, portanto, **não** inclui `X-Signature`. Se o seu endpoint exigir verificação HMAC, omita `webhook_url` e registre um Model Webhook da organização. Você pode colocar na query da URL HTTPS um token de capacidade opaco gerado pelo seu próprio sistema e validá-lo no seu endpoint. Trate essa URL como sensível.

Para cada tarefa assíncrona de modelo, a seleção de destino é exclusiva. Se a requisição incluir um `webhook_url` válido, a SandBase envia o evento terminal dessa Prediction apenas para a URL da tarefa e ignora todos os Model Webhooks registrados da organização para esse evento. Se a requisição omitir `webhook_url`, os Model Webhooks registrados da organização continuam recebendo os eventos correspondentes normalmente. Uma falha de entrega por tarefa é repetida na mesma URL da tarefa e nunca recorre a um webhook registrado. Essa prioridade não cria, substitui, desativa nem modifica nenhum registro, e não afeta outros eventos de Model.

## Tipos de evento {#event-types}

### Geração de modelo {#model-generation}

Webhooks de Model estão disponíveis apenas para geração assíncrona de imagem, vídeo e áudio. Eles não são emitidos para requisições síncronas de imagem/vídeo/áudio nem para nenhuma requisição síncrona de LLM: esses resultados são retornados pela resposta HTTP original.

| Evento | Descrição |
|---|---|
| `model.generation.completed` | Uma geração assíncrona de imagem, vídeo ou áudio foi concluída. |
| `model.generation.failed` | Uma geração assíncrona de imagem, vídeo ou áudio falhou. |
| `model.generation.timeout` | Uma geração assíncrona de imagem, vídeo ou áudio excedeu o tempo limite. |
| `model.generation.cancelled` | Uma geração assíncrona de imagem, vídeo ou áudio foi cancelada. |

## Payload de entrega {#delivery-payload}

A SandBase envia `Content-Type: application/json` e o seguinte envelope JSON. `data` é específico do evento e pode ganhar campos com o tempo.

### Exemplo de conclusão de modelo {#model-completion-example}

```json
{
  "id": "model_pred_01_completed",
  "resourceType": "model",
  "resourceID": "pred_01...",
  "type": "model.generation.completed",
  "data": {
    "predictionID": "pred_01...",
    "model": "example-image-model",
    "generationType": "image",
    "status": "completed",
    "completedAt": "2026-07-14T09:30:38Z",
    "outputs": ["https://.../generated-image.png"]
  },
  "createdAt": "2026-07-14T09:30:38Z"
}
```

Eventos de falha e de timeout omitem as saídas e contêm apenas a categoria de erro sanitizada.

| Campo | Descrição |
|---|---|
| `id` | ID único do evento. Use-o, ou `X-Event-ID`, como sua chave de idempotência. |
| `resourceType` | `model`. |
| `resourceID` | O ID da Prediction afetada. |
| `type` | Tipo de evento da tabela acima. |
| `data` | Dados específicos do evento. |
| `createdAt` | Horário de criação do evento em RFC 3339 UTC. |

## Verificar a assinatura de um webhook registrado {#verify-a-registered-webhook-signature}

Toda entrega de webhook registrado inclui estes cabeçalhos:

| Cabeçalho | Valor |
|---|---|
| `X-Event-ID` | O `id` do payload. |
| `X-Signature` | HMAC-SHA256 em hexadecimal minúsculo do corpo bruto da requisição, com `signatureSecret` como chave. |

Verifique a assinatura com os bytes brutos da requisição antes de interpretar o JSON. Callbacks `webhook_url` por tarefa não incluem esse cabeçalho e não podem usar este fluxo de verificação. Os handlers a seguir são para webhooks registrados: eles verificam primeiro, interpretam depois, usam `id` como chave de idempotência e repassam o trabalho para uma função assíncrona. Substitua a chamada de fila de exemplo pela sua própria fila durável ou worker.

::: code-group

```javascript [Node.js + Express]
import crypto from 'node:crypto'
import express from 'express'

const app = express()
const webhookSecret = process.env.SANDBASE_WEBHOOK_SECRET
if (!webhookSecret) throw new Error('SANDBASE_WEBHOOK_SECRET is required')
const acceptedEventIDs = new Set() // Use a DB unique key in production.

function enqueueSandBaseEvent(event) {
  setImmediate(() => {
    console.log(`processing ${event.type} (${event.id})`)
    // Perform slow business work here or publish to your durable queue.
  })
}

// This route must be registered before express.json() for the webhook path.
app.post('/hooks/sandbase', express.raw({ type: 'application/json' }), (req, res) => {
  const rawBody = req.body
  const signature = req.get('X-Signature') || ''

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')

  const received = Buffer.from(signature, 'utf8')
  const expectedBuffer = Buffer.from(expected, 'utf8')
  if (received.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, received)) {
    return res.status(401).json({ error: 'invalid signature' })
  }

  const event = JSON.parse(rawBody.toString('utf8'))
  if (acceptedEventIDs.has(event.id)) return res.sendStatus(204)
  acceptedEventIDs.add(event.id)
  enqueueSandBaseEvent(event)
  return res.sendStatus(204)
})

app.listen(3000)
```

```python [Python + Flask]
import hashlib
import hmac
import json
import os
import threading

from flask import Flask, abort, request

app = Flask(__name__)
webhook_secret = os.environ["SANDBASE_WEBHOOK_SECRET"].encode()
accepted_event_ids = set()  # Use a DB unique key in production.
accepted_event_ids_lock = threading.Lock()

def process_sandbase_event(event):
    print(f"processing {event['type']} ({event['id']})")
    # Perform slow business work here or publish to your durable queue.

@app.post("/hooks/sandbase")
def sandbase_webhook():
    raw_body = request.get_data(cache=True)
    received = request.headers.get("X-Signature", "")
    expected = hmac.new(webhook_secret, raw_body, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, received):
        abort(401, "invalid signature")

    event = json.loads(raw_body)
    with accepted_event_ids_lock:
        if event["id"] in accepted_event_ids:
            return "", 204
        accepted_event_ids.add(event["id"])
    threading.Thread(target=process_sandbase_event, args=(event,), daemon=True).start()
    return "", 204
```

:::

A entrada do HMAC é exatamente o corpo bruto. Não chame um parser JSON nem serialize novamente o payload antes de calculá-lo.

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## Comportamento de entrega {#delivery-behavior}

- Uma resposta na faixa `2xx` em até 10 segundos é considerada bem-sucedida.
- Erros de rede, timeouts e respostas não 2xx são falhas. O dispatcher de eventos existente pode repetir entregas com falha; os receptores devem tolerar entregas duplicadas.
- Retorne uma resposta 2xx após a aceitação durável e, depois, execute o trabalho lento de forma assíncrona. Os exemplos usam deduplicação em memória apenas para continuarem executáveis; receptores em produção devem substituí-la por uma chave única de banco de dados ou uma fila durável. Não presuma entrega exactly-once nem ordenação de eventos.
