---
i18nSource: 4bd032d88bac0470
title: Vídeo Seedance (protocolo Volcengine Ark)
description: Gere vídeos com o Seedance 2.0 e 2.5 pelo protocolo de tarefas Contents Generations da Volcengine Ark, incluindo inputs, polling, cobrança e Assets de mídia.
aside: false
outline: false
apiReference:
  title: Vídeo Seedance
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Envie uma tarefa de vídeo do Seedance. Um envio bem-sucedido retorna HTTP 200 e um id de tarefa do SandBase.
  groups:
    - title: Corpo da requisição
      fields:
        - name: model
          type: string
          required: true
          description: "Identificador de modelo suportado: bytedance/seedance/2.0-official ou bytedance/seedance/2.5-official."
        - name: content
          type: array
          required: true
          description: Inputs tipados de texto e de mídia opcionais. Os formatos dos itens são validados pelo modelo.
        - name: duration
          type: integer
          required: false
          description: Repassado ao modelo sem alteração. A validação do modelo se aplica.
        - name: resolution
          type: string
          required: false
          description: Repassado ao modelo sem alteração. A validação do modelo se aplica.
        - name: ratio
          type: string
          required: false
          description: Repassado ao modelo sem alteração. A validação do modelo se aplica.
        - name: generate_audio
          type: boolean
          required: false
          description: Repassado ao modelo sem alteração. Solicite áudio gerado quando houver suporte.
  examples:
    - label: Text to video
      language: bash
      code: |-
        curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{
            "model": "bytedance/seedance/2.0-official",
            "content": [{"type": "text", "text": "A paper boat crossing a rain puddle"}],
            "duration": 5,
            "resolution": "720p"
          }'
  response:
    status: 200 OK
    code: '{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }'
---

<ApiReferencePage />

## Guia do Seedance {#seedance-guide}

O Seedance gera vídeo a partir de texto, frames de abertura e de encerramento e referências multimodais como imagens, vídeo e
áudio. Use-o para qualquer coisa, desde um clipe simples de texto para vídeo até uma tomada dirigida que segue um assunto visual, um movimento
de câmera e uma trilha sonora.

A geração é assíncrona. Envie uma tarefa e consulte-a até que ela chegue a um status terminal.

## Escolhendo um modelo {#choosing-a-model}

| `model` | Ideal para | Resoluções de saída |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | Entrega em 1080p e a maior resolução de saída disponível | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | Geração de menor custo quando 480p ou 720p é suficiente | 480p, 720p |

Os dois modelos aceitam o mesmo input multimodal e suportam fluxos de texto para vídeo, imagem para vídeo e referência multimodal
em um único formato de requisição. Escolha `2.0-official` quando 480p ou 720p atender às suas necessidades e você quiser a opção
mais barata. Escolha `2.5-official` quando precisar de 1080p.

## Referência da API {#api-reference}

| Método | Caminho |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

Listar tarefas e cancelar ou excluir uma tarefa não são operações suportadas. Guarde o `id` da tarefa retornado para obter o resultado.

Autentique cada requisição com a mesma API key usada para criar a tarefa:

```
Authorization: Bearer $SANDBASE_API_KEY
```

O valor de `model` deve corresponder a um dos nomes em [Escolhendo um modelo](#choosing-a-model). A consulta periódica (polling) é a forma suportada de
receber resultados; não dependa de `callback_url` neste endpoint.

## Início rápido {#quickstart}

Envie uma tarefa:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "A slow cinematic push across an alpine lake at sunrise"}
    ],
    "ratio": "16:9",
    "resolution": "720p",
    "duration": 5,
    "generate_audio": true
  }'
```

```json
{ "id": "158d2649-e01d-45b9-b88a-ef3c450c601c" }
```

Consulte a tarefa com esse id a cada 5 a 10 segundos até que `status` seja `succeeded`, `failed`, `expired` ou `cancelled`:

```bash
curl https://api.sandbase.ai/api/v3/contents/generations/tasks/158d2649-e01d-45b9-b88a-ef3c450c601c \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "158d2649-e01d-45b9-b88a-ef3c450c601c",
  "model": "bytedance/seedance/2.5-official",
  "status": "succeeded",
  "created_at": 1787059000,
  "updated_at": 1787059150,
  "content": { "video_url": "https://media.sandbase.ai/files/158d2649.../0.mp4" },
  "usage": { "completion_tokens": 108900, "total_tokens": 108900 }
}
```

O vídeo gerado fica disponível em `content.video_url`.

## Escolha um fluxo de input {#choose-an-input-workflow}

A API suporta sete fluxos de input comuns. Cada item em `content` tem um `type`; a combinação de tipos de item e
roles seleciona o fluxo:

| Objetivo | Combinação de `content` | Use quando |
| --- | --- | --- |
| Texto para vídeo | Texto | A cena pode ser descrita inteiramente no prompt |
| Animar um frame de abertura | Texto (opcional) + imagem com `first_frame` | O primeiro frame deve corresponder a uma imagem fornecida |
| Transição entre dois frames | Texto (opcional) + `first_frame` + `last_frame` | A tomada precisa de um início e um fim controlados |
| Seguir uma referência visual | Texto (opcional) + imagem com `reference_image` | Um assunto, produto, figurino ou estilo visual deve continuar reconhecível |
| Seguir movimento ou linguagem de câmera | Texto (opcional) + vídeo com `reference_video` | Movimento, timing, ritmo de edição ou movimento de câmera vêm de um clipe de referência |
| Adicionar uma referência de áudio | Texto/imagem/vídeo + áudio com `reference_audio` | Diálogo, música, voz ou design de som devem orientar o resultado |
| Direção multimodal completa | Referências de texto + imagem + vídeo + áudio | Assets diferentes controlam aparência, movimento e som em uma única tomada |

O áudio não pode ser usado sozinho. Toda requisição que inclui um item de áudio também precisa incluir pelo menos um item de texto, imagem ou
vídeo.

### Formatos dos itens de content {#content-item-shapes}

```json
{ "type": "text", "text": "A puppy running across a sunlit lawn" }
```

```json
{ "type": "image_url", "image_url": { "url": "https://example.com/ref.jpg" }, "role": "reference_image" }
```

```json
{ "type": "video_url", "video_url": { "url": "https://example.com/ref.mp4" }, "role": "reference_video" }
```

```json
{ "type": "audio_url", "audio_url": { "url": "https://example.com/bgm.mp3" }, "role": "reference_audio" }
```

`role` indica como o modelo deve usar o asset:

| Asset | `role` | Efeito |
| --- | --- | --- |
| Imagem | `first_frame` | Usa a imagem como frame de abertura |
| Imagem | `last_frame` | Usa a imagem como frame de encerramento; inclua um `first_frame` na mesma requisição |
| Imagem | `reference_image` | Referencia o assunto, a composição, o produto, o figurino ou o estilo visual |
| Vídeo | `reference_video` | Referencia movimento, trabalho de câmera, timing ou ritmo de edição |
| Áudio | `reference_audio` | Referencia voz, diálogo, música ou design de som |

Itens de imagem aceitam uma URL pública ou um valor inline `data:image/...;base64,...`. Referências de vídeo e áudio devem
usar URLs públicas que o modelo consiga baixar.

Incluir qualquer item `video_url` coloca a requisição no modo vídeo para vídeo, o que altera a tarifa por token. Consulte
[Cobrança](#billing).

## Receitas comuns {#common-recipes}

Os exemplos abaixo mostram corpos de requisição. Envie qualquer um deles para o endpoint de criação de tarefa mostrado no [Início rápido](#quickstart).

### Animar um primeiro frame {#animate-a-first-frame}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "The woman slowly looks up and smiles as the camera gently pushes in"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 5,
  "generate_audio": true
}
```

### Criar uma transição do primeiro ao último frame {#create-a-first-to-last-frame-transition}

```json
{
  "model": "bytedance/seedance/2.5-official",
  "content": [
    {"type": "text", "text": "A smooth transition from a bright afternoon into a neon-lit night"},
    {"type": "image_url", "image_url": {"url": "https://example.com/first-frame.jpg"}, "role": "first_frame"},
    {"type": "image_url", "image_url": {"url": "https://example.com/last-frame.jpg"}, "role": "last_frame"}
  ],
  "ratio": "adaptive",
  "resolution": "720p",
  "duration": 6
}
```

### Dirigir uma tomada com referências de imagem, vídeo e áudio {#direct-a-shot-with-image-video-and-audio-references}

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {"type": "text", "text": "First-person fruit tea commercial, camera pushes in on the layered foam"},
      {"type": "image_url", "image_url": {"url": "https://example.com/ref.jpg"}, "role": "reference_image"},
      {"type": "video_url", "video_url": {"url": "https://example.com/ref.mp4"}, "role": "reference_video"},
      {"type": "audio_url", "audio_url": {"url": "https://example.com/bgm.mp3"}, "role": "reference_audio"}
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 11
  }'
```

Use o prompt para atribuir uma função clara a cada referência: por exemplo, “mantenha a aparência do produto da imagem, use
o movimento de câmera do vídeo e siga o ritmo do áudio.” Isso é mais confiável do que pedir que cada asset
controle o resultado inteiro.

## Escrevendo um prompt eficaz {#writing-an-effective-prompt}

Um prompt prático costuma seguir esta ordem:

1. **Assunto**: quem ou o que aparece na tomada.
2. **Ação**: o que muda ou se move.
3. **Cena**: local, horário, clima e detalhes do entorno.
4. **Estilo visual**: cinematográfico, documental, comercial de produto, animação e assim por diante.
5. **Câmera**: enquadramento, sensação de lente, movimento de câmera e cortes.
6. **Som**: diálogo, ambiência, música ou efeitos quando `generate_audio` estiver ativado.

Seja explícito sobre o que deve permanecer estável. Por exemplo: “O rótulo do produto continua legível, a câmera faz um único push-in
lento, sem cortes de cena, com som ambiente natural.” Quando houver várias referências, descreva qual qualidade visual ou de movimento
deve ser tirada de cada uma.

## Opções de saída {#output-options}

| Parâmetro | Tipo | Padrão | Valores |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`, `720p`, `1080p`. `2.0-official` não suporta `1080p` |
| `ratio` | string | `adaptive` | `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`, `adaptive`. `adaptive` escolhe uma proporção com base no input e no prompt |
| `duration` | integer | `5` | De 4 a 15 segundos, ou `-1` para deixar o modelo escolher dentro do intervalo suportado |
| `generate_audio` | boolean | `true` | Gera voz, efeitos sonoros e música de fundo sincronizados |
| `seed` | integer | `-1` | De `-1` a `2^32-1`. O mesmo prompt e seed produzem saídas semelhantes, não idênticas |
| `watermark` | boolean | `false` | Adiciona uma marca d'água de conteúdo gerado por IA no canto inferior direito |
| `tools` | array | `[]` | `[{"type": "web_search"}]` ativa a pesquisa na web durante o planejamento da tomada |

### Controle da tarefa {#task-control}

| Parâmetro | Tipo | Padrão | Observações |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | Timeout da tarefa em segundos, de 3600 a 259200. Uma tarefa que ultrapassa esse valor passa a `expired` |
| `service_tier` | string | `default` | Estes modelos não suportam `flex` |
| `safety_identifier` | string | — | Identificador opaco do usuário final, com no máximo 64 caracteres. Envie um hash, não dados pessoais brutos |

### Tamanho do frame {#frame-size}

`resolution` e `ratio` juntos determinam as dimensões em pixels:

| Resolução | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## Status da tarefa {#task-status}

| `status` | Significado | O que fazer |
| --- | --- | --- |
| `queued` | Aceita, aguardando início | Continue consultando a cada 5 a 10 segundos |
| `running` | Em geração | Continue consultando |
| `succeeded` | Concluída | Baixe `content.video_url` |
| `failed` | Rejeitada pela revisão de conteúdo ou o modelo apresentou erro | Leia `error.message`. Ajuste o prompt antes de tentar novamente |
| `expired` | Ultrapassou `execution_expires_after` | Envie novamente |
| `cancelled` | Encerrada antes de a geração começar | Envie novamente |

### Campos da tarefa {#task-fields}

| Campo | Tipo | Observações |
| --- | --- | --- |
| `id` | string | O id da tarefa retornado no envio |
| `model` | string | O valor de `model` que você enviou |
| `status` | string | Veja acima |
| `created_at` | integer | Segundos Unix |
| `updated_at` | integer | Segundos Unix. Igual a `created_at` até a tarefa terminar |
| `content` | object | Vazio até a tarefa ter sucesso. Contém o `video_url` gerado |
| `usage` | object | Contagens de tokens. Consulte [Cobrança](#billing) |
| `error` | object | Presente em `failed` e `expired`. Contém `code` e `message` |

### Fluxo completo em Python {#complete-python-flow}

```python
import os
import time

import requests

BASE_URL = "https://api.sandbase.ai/api/v3/contents/generations/tasks"
HEADERS = {
    "Authorization": f"Bearer {os.environ['SANDBASE_API_KEY']}",
    "Content-Type": "application/json",
}

task = requests.post(
    BASE_URL,
    headers=HEADERS,
    json={
        "model": "bytedance/seedance/2.5-official",
        "content": [
            {
                "type": "text",
                "text": "A quiet shoreline at sunrise, gentle waves, one slow camera push-in",
            }
        ],
        "ratio": "16:9",
        "resolution": "720p",
        "duration": 5,
        "generate_audio": True,
    },
)
task.raise_for_status()
task_id = task.json()["id"]

while True:
    time.sleep(8)
    result = requests.get(f"{BASE_URL}/{task_id}", headers=HEADERS)
    result.raise_for_status()
    data = result.json()
    print(data["status"])

    if data["status"] == "succeeded":
        print(data["content"]["video_url"])
        break
    if data["status"] in {"failed", "expired", "cancelled"}:
        raise RuntimeError(data.get("error", {"message": data["status"]}))
```

## Cobrança {#billing}

Estes modelos cobram com base em `usage.completion_tokens`, que a tarefa informa ao terminar. A tarifa por token depende de duas
dimensões:

- **Se o input inclui vídeo.** Requisições de vídeo para vídeo, ou seja, com qualquer item de `content` do tipo `video_url`, são cobradas
  a uma tarifa menor do que texto para vídeo.
- **Resolução de saída.** No `2.5-official`, 1080p custa mais do que 480p e 720p. A tarifa do `2.0-official` não varia
  conforme a resolução.

`usage` informa `completion_tokens` e `total_tokens`, que atualmente são iguais. Ele fica vazio enquanto a tarefa está em execução.
Consulte o [histórico da conta](/api-reference/account/history) para ver as cobranças reais e o
[guia de preços](/guides/billing) para as tarifas atuais.

## Erros {#errors}

Uma requisição inválida retorna um erro imediatamente. Um erro durante a geração aparece na tarefa ao consultá-la. Ambos usam um
objeto `error` com um `code` legível por máquina e uma `message` legível por pessoas:

```json
{ "error": { "code": "InvalidParameter", "message": "model is required", "type": "BadRequest" } }
```

| HTTP | `code` | `type` |
| --- | --- | --- |
| 400 | `InvalidParameter` | `BadRequest` |
| 401 | `AuthenticationError` | `Unauthorized` |
| 403 | `PermissionDenied` | `Forbidden` |
| 404 | `ResourceNotFound` | `NotFound` |
| 429 | `RateLimitExceeded` | `TooManyRequests` |
| 500 | `InternalServiceError` | `InternalServerError` |
| 503 | `InternalServiceError` | `ServiceUnavailable` |

Etapas comuns de recuperação:

| Resultado | O que tentar |
| --- | --- |
| `400 InvalidParameter` | Verifique o nome do modelo, o content obrigatório, as roles, a resolução, a duração e as URLs dos assets |
| Status da tarefa `failed` com erro de revisão de conteúdo | Reescreva o prompt ou substitua o asset de referência sinalizado antes de enviar novamente |
| Status da tarefa `expired` | Envie uma nova tarefa; considere um `execution_expires_after` maior para clipes longos ou de alta resolução |
| `429 RateLimitExceeded` | Tente novamente com backoff exponencial e reduza os envios simultâneos |
| `503 ServiceUnavailable` | Repita a mesma requisição após um curto intervalo |

## Usar Assets de mídia registrados {#use-registered-media-assets}

O SandBase expõe o protocolo de Asset compatível com o oficial em `/v1/assets`. A requisição de Asset e a referência `asset://`
retornada seguem o protocolo oficial, e a referência é repassada sem alteração na requisição nativa de Contents
Generations da ByteDance. Tanto
`bytedance/seedance/2.5-official` quanto `bytedance/seedance/2.0-official` aceitam essa referência
onde normalmente aceitam uma URL HTTP(S) pública.

O fluxo completo é:

1. Registre uma URL de mídia acessível com `POST /v1/assets`.
2. Consulte `GET /v1/assets/{external_id}` até que o provedor informe que o Asset pode ser usado.
3. Coloque o `asset_url` retornado em um item de `content` do Seedance e envie a tarefa de geração.

### Operações de Asset compatíveis com o oficial {#official-compatible-asset-operations}

| Método | Caminho | Finalidade |
| --- | --- | --- |
| `POST` | `/v1/assets` | Registra uma URL de mídia acessível e retorna uma referência `asset://` compatível com o oficial |
| `GET` | `/v1/assets/{external_id}` | Lê o status no provedor e obtém a URL atual de pré-visualização/download |

Atualmente, a API pública expõe registro e consulta. Grupos de Assets, listagem, renomeação, atualização e exclusão não
são operações públicas. Os Assets pertencem à organização associada à API key.

### Etapa 1: registrar o Asset {#step-1-register-the-asset}

Envie a URL acessível para `POST /v1/assets`. `asset_type` diferencia maiúsculas de minúsculas e deve ser `Image`, `Video` ou `Audio`:

```bash
curl -X POST https://api.sandbase.ai/v1/assets \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/product-reference.png",
    "asset_type": "Image",
    "name": "Product reference"
  }'
```

Guarde o `asset_url` da resposta:

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

O valor após `asset://` é o `external_id` usado pela operação de consulta compatível com o oficial.

### Etapa 2: verificar se está pronto {#step-2-check-readiness}

Consulte o Asset com o `external_id`, sem o prefixo `asset://`:

```bash
curl https://api.sandbase.ai/v1/assets/asset-20260710150403-hx4hf \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Image",
  "name": "Product reference",
  "download_url": "https://media.example.com/current-signed-url",
  "created_at": "2026-07-10T15:04:03Z"
}
```

Trate `status` como um valor aberto do provedor, e não como um enum exaustivo. Aguarde até que o provedor informe um estado
utilizável antes de enviar a tarefa de geração; um valor comum de pronto é `Active`. `download_url` é gerenciado pelo provedor e
pode estar vazio durante o processamento. Consulte o Asset novamente quando precisar de uma URL de pré-visualização atual. Continue usando o
`asset_url` persistente nas requisições do Seedance, em vez de copiar `download_url`.

### Etapa 3: gerar com o Asset {#step-3-generate-with-the-asset}

Coloque `asset_url` no campo de URL correspondente ao tipo de mídia. Este exemplo usa a imagem registrada como referência
visual:

```bash
curl -X POST https://api.sandbase.ai/api/v3/contents/generations/tasks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seedance/2.5-official",
    "content": [
      {
        "type": "text",
        "text": "Create a cinematic product shot. Keep the bottle shape and label from the reference image."
      },
      {
        "type": "image_url",
        "image_url": {"url": "asset://asset-20260710150403-hx4hf"},
        "role": "reference_image"
      }
    ],
    "ratio": "16:9",
    "resolution": "1080p",
    "duration": 5,
    "generate_audio": true
  }'
```

A resposta de criação retorna um `id` de tarefa. Consulte
`GET /api/v3/contents/generations/tasks/{task_id}` como descrito na página do modelo selecionado.

### Escolha o item de content e a role {#choose-the-content-item-and-role}

| Tipo de Asset | `content[].type` | Campo de URL | Role suportada | Use para |
| --- | --- | --- | --- | --- |
| Imagem | `image_url` | `image_url.url` | `first_frame` | Começar o vídeo exatamente neste frame |
| Imagem | `image_url` | `image_url.url` | `last_frame` | Terminar neste frame; inclua um `first_frame` na mesma requisição |
| Imagem | `image_url` | `image_url.url` | `reference_image` | Preservar um assunto, produto, composição, figurino ou estilo visual |
| Vídeo | `video_url` | `video_url.url` | `reference_video` | Seguir movimento, timing, trabalho de câmera ou ritmo de edição |
| Áudio | `audio_url` | `audio_url.url` | `reference_audio` | Seguir voz, diálogo, música ou design de som |

O áudio não pode ser o único input. Combine um Asset `reference_audio` com texto, uma imagem ou um vídeo. Qualquer requisição que
contenha um `video_url` usa a tarifa de cobrança de vídeo para vídeo.

#### Exemplo de Asset de vídeo {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### Exemplo de Asset de áudio {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### URL direta ou referência `asset://`? {#direct-url-or-asset-reference}

| Input | Ideal quando | Contrapartida |
| --- | --- | --- |
| URL HTTP(S) pública | A mídia já está hospedada e é usada uma única vez | Caminho mais rápido, mas a URL precisa continuar acessível durante o envio da tarefa e o download pelo provedor |
| Referência `asset://` | A mídia é reutilizada pelo protocolo oficial de Asset | Adiciona uma etapa de registro/verificação e depois oferece uma referência persistente para tarefas futuras do Seedance |

Para parâmetros de requisição, polling, status de tarefas e cobrança, consulte o [Guia do Seedance](#seedance-guide) acima.

## Recursos oficiais da ByteDance {#official-bytedance-resources}
- [Documentação de geração de vídeo do Seedance](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [API para criar tarefas de contents generation](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Guia de prompts do Seedance 2.0](https://www.volcengine.com/docs/82379/2222480?lang=en)

