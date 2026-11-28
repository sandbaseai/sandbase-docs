---
i18nSource: 43d08f60800d37f5
title: API de Media Assets
description: Registre Assets de mídia reutilizáveis e obtenha seus metadados atuais e URLs de download.
---

# API de Media Assets {#media-assets-api}

Use o protocolo de Asset compatível com o oficial, exposto em `/v1/assets`, para registrar URLs de mídia e obter um `asset_url` para
requisições nativas de geração de vídeo.

Para um exemplo completo que registra mídia e usa a referência `asset://` retornada com o Seedance, veja
[Usar Assets de mídia registrados](/api-reference/volcengine-contents-generations#use-registered-media-assets) na referência do Seedance.

## Visão geral {#overview}

| Método | Caminho | Descrição |
|--------|------|-------------|
| `POST` | `/v1/assets` | Registrar um Asset |
| `GET` | `/v1/assets/{id}` | Obter os metadados do Asset e uma URL de download atual |

## POST /v1/assets {#post-v1-assets}

Registra a URL de um arquivo publicamente acessível na biblioteca de assets e retorna um `asset_url` que pode ser referenciado em requisições de geração de vídeo.

### Requisição {#request}

```http
POST /v1/assets
Authorization: Bearer $SANDBASE_API_KEY
Content-Type: application/json
```

```json
{
  "url": "https://example.com/tea-ad.mp4",
  "asset_type": "Video",
  "name": "Tea ad reference video"
}
```

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|----------|--------------|
| `url` | string | Sim | URL do arquivo publicamente acessível |
| `asset_type` | string | Sim | Tipo do asset: `Image` / `Video` / `Audio` (diferencia maiúsculas de minúsculas) |
| `name` | string | Não | Nome opcional do asset |

### Resposta {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Campo | Descrição |
|-------|--------------|
| `id` | ID interno do registro |
| `asset_url` | Endereço de referência usado em requisições de geração de vídeo |
| `asset_type` | Tipo do asset |
| `name` | Nome do asset |
| `created_at` | Timestamp de criação |

### Usar asset_url {#using-asset-url}

Após o registro, passe o `asset_url` para um campo de entrada que aceite uma referência de Asset no schema ativo do modelo selecionado. Os nomes dos campos variam por modelo; por exemplo:

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### Erros {#errors}

| Status HTTP | Descrição |
|-------------|--------------|
| 400 | Campo obrigatório ausente ou `asset_type` inválido |
| 502 | Falha no registro do asset upstream |
| 500 | Nenhuma credencial disponível ou erro interno |

---

## GET /v1/assets/{id}

Obtém uma URL de download assinada para um asset registrado pelo seu ID externo. Usado para visualizar ou baixar o arquivo subjacente.

### Requisição {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| Parâmetro | Local | Descrição |
|-----------|----------|--------------|
| `id` | path | O ID externo (a parte após `asset://` em `asset_url`) |

### Resposta {#response-1}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "external_id": "asset-20260710150403-hx4hf",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "status": "Active",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "download_url": "https://cdn.example.com/...?X-Tos-Expires=43200",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Campo | Descrição |
|-------|--------------|
| `asset_url` | Endereço de referência para geração de vídeo (permanente) |
| `status` | Status do ciclo de vida do Asset informado pelo provedor. Trate-o como uma string aberta. |
| `download_url` | URL de download retornada pelo provedor; pode estar vazia enquanto o Asset não estiver pronto |

### Erros {#errors-1}

| Status HTTP | Descrição |
|-------------|--------------|
| 404 | Asset não encontrado ou não pertence à sua organização |
| 502 | Falha na consulta upstream |

---

## Observações {#notes}

::: tip Importante
- `asset_url` tem o formato `asset://{external_id}` e é a referência reutilizável a ser passada para entradas de modelos suportados
- Trate `download_url` como gerenciada pelo provedor. Se estiver vazia ou não funcionar mais, consulte este endpoint novamente para obter o valor atual
- `asset_type` diferencia maiúsculas de minúsculas: `Image` / `Video` / `Audio`
- A URL enviada deve ser publicamente acessível (a plataforma precisa conseguir buscá-la)
:::
