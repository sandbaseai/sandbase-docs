---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: Chame o SandBase com o protocolo nativo GenerateContent do Google Gemini.
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: Envia uma requisição Gemini nativa e recebe uma resposta compatível com o Gemini. Use streamGenerateContent para streaming.
  groups:
    - title: Parâmetros de caminho
      fields:
        - name: model
          type: string
          required: true
          description: Nome do modelo do Google sem prefixo, como gemini-3.5-flash. O SandBase o resolve como google/{model}.
    - title: Corpo da requisição
      fields:
        - name: contents
          type: array
          required: false
          description: Conteúdo da conversa Gemini, composto por role e parts.
        - name: systemInstruction
          type: object
          required: false
          description: Instrução de sistema em texto no formato Content do Gemini.
        - name: generationConfig
          type: object
          required: false
          description: Configurações de amostragem, tamanho da saída, saída estruturada e thinking.
        - name: tools
          type: array
          required: false
          description: Declarações de função ou configuração das ferramentas integradas suportadas do Gemini.
        - name: toolConfig
          type: object
          required: false
          description: Política de chamada de funções do Gemini.
        - name: safetySettings
          type: array
          required: false
          description: Categorias e limites de segurança do Gemini.
        - name: cachedContent
          type: string
          required: false
          description: Recurso de conteúdo em cache do Gemini, repassado quando suportado.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl -X POST \
          "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:generateContent" \
          -H "x-goog-api-key: $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"contents":[{"role":"user","parts":[{"text":"Explain immutable infrastructure in one sentence."}]}]}'
  response:
    status: 200 OK
    code: |-
      {
        "candidates": [
          {
            "content": {
              "role": "model",
              "parts": [{"text": "Immutable infrastructure replaces servers from versioned images instead of modifying them in place."}]
            },
            "finishReason": "STOP",
            "index": 0
          }
        ],
        "usageMetadata": {
          "promptTokenCount": 8,
          "candidatesTokenCount": 15,
          "totalTokenCount": 23
        }
      }
---

<ApiReferencePage />

## Autenticação {#authentication}

Requisições compatíveis com o Google podem enviar a chave de API do SandBase em `x-goog-api-key`, `Authorization: Bearer …` ou no parâmetro de query `key`, nessa ordem de prioridade. Prefira um header: credenciais na query string podem aparecer em logs de proxy e no histórico do navegador.

## Streaming {#streaming}

Substitua o sufixo do método por `:streamGenerateContent`. Sem parâmetro de query, o SandBase retorna objetos de resposta compatíveis com o Google como um array JSON transmitido em streaming. Adicione `?alt=sse` para usar Server-Sent Events:

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## Geração nativa de imagens {#native-image-generation}

Estes modelos de imagem têm mapeamentos nativos dedicados de GenerateContent:

- [Gemini 3 Pro Image（Nano Banana Pro）](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs): `gemini-3-pro-image`
- [Gemini 3.1 Flash Image（Nano Banana 2）](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs): `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1（Nano Banana 2.1）](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs): `gemini-nano-banana-2.1`

A página de cada modelo lista os preços por token e o custo por imagem.

Nesses mapeamentos, o SandBase repassa os payloads de requisição e resposta sem convertê-los via Chat
Completions. Isso preserva as partes de imagem, as modalidades de resposta e os campos definidos pelo provedor. Use o nome do modelo sem prefixo
na URL; por exemplo, `google/gemini-3.1-flash-image` vira `gemini-3.1-flash-image` no caminho.
### Editar uma imagem {#edit-an-image}

Adicione a imagem de origem como uma parte `inlineData` ao lado da instrução de texto. Use o tipo MIME dos bytes que você envia:

```json
{
  "contents": [{
    "role": "user",
    "parts": [
      {"text": "Keep the subject unchanged and turn the background into a paper-cut landscape."},
      {"inlineData": {"mimeType": "image/png", "data": "<base64-input-image>"}}
    ]
  }],
  "generationConfig": {"responseModalities": ["IMAGE"], "imageConfig": {"imageSize": "1K"}}
}
```

### Usar o Google Gen AI SDK {#use-the-google-gen-ai-sdk}

Aponte o SDK oficial para o SandBase e use sua chave de API do SandBase:

```python
from google import genai
from google.genai import types

client = genai.Client(
    api_key="YOUR_SANDBASE_API_KEY",
    http_options=types.HttpOptions(base_url="https://api.sandbase.ai"),
)

response = client.models.generate_content(
    model="gemini-nano-banana-2.1",
    contents="Create a wide editorial illustration of a solar-powered city at sunrise.",
    config=types.GenerateContentConfig(
        response_modalities=["IMAGE"],
        image_config=types.ImageConfig(aspect_ratio="16:9", image_size="1K"),
    ),
)

for part in response.candidates[0].content.parts:
    if part.inline_data:
        with open("output.jpg", "wb") as f:
            f.write(part.inline_data.data)
```

Para streaming, chame `:streamGenerateContent?alt=sse` (no SDK: `generate_content_stream`) com o mesmo corpo.

### Tratamento da resposta {#response-handling}
Leia a mídia gerada nas partes do candidato retornado. Como esses modelos usam passthrough nativo, a capitalização dos campos
definida pelo provedor e os metadados MIME são retornados como recebidos. Decodifique o payload base64 e verifique os bytes reais da mídia
antes de escolher uma extensão de arquivo.

## Limites de roteamento e tradução {#routing-and-translation-boundaries}

O SandBase seleciona somente provedores que suportam o protocolo Gemini nativo solicitado. Se o modelo selecionado não tiver um
mapeamento nativo compatível, a requisição falha em vez de recorrer a um provedor com outro protocolo.

Os modelos que usam o caminho traduzido de GenerateContent suportam texto, chamadas e respostas de função, dados `image/*` inline
e referências públicas a imagens HTTP(S). Esse caminho traduzido rejeita tipos MIME inline não suportados, referências privadas ao Google Files ou
`gs://`, múltiplos candidatos e modalidades de resposta não suportadas com uma resposta `400 INVALID_ARGUMENT` no estilo do Google.
Os mapeamentos de geração de imagens listados acima usam passthrough bruto e não estão sujeitos a esses limites exclusivos da tradução;
valide os campos de mídia retornados de acordo com a resposta do provedor selecionado.
