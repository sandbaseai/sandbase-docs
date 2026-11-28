---
i18nSource: a4db28360a2974cd
title: Editar imagem
description: Edite imagens enviadas com a API síncrona compatível com OpenAI Images.
aside: false
outline: false
apiReference:
  title: Editar imagem
  operation: Images
  method: POST
  path: /v1/images/edits
  description: Edite uma ou mais imagens enviadas pelo endpoint multipart síncrono da SandBase compatível com OpenAI Images.
  signature: client.images.edit(params)
  groups:
    - title: Corpo da requisição
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: Um de gpt-image-2, gpt-image-2.5-flare ou gpt-image-2.5-sunburst.
        - name: prompt
          type: string
          required: true
          description: Descrição em texto da edição solicitada.
        - name: image
          type: file | file[]
          required: true
          description: Um ou mais arquivos de imagem de origem. Repita o campo multipart para várias imagens.
        - name: mask
          type: file
          required: false
          description: Imagem de máscara opcional para inpainting.
        - name: n
          type: integer
          required: false
          description: Número de imagens editadas a retornar, quando suportado.
        - name: size
          type: string
          required: false
          description: Dimensões de saída suportadas pelo modelo.
        - name: quality
          type: string
          required: false
          description: Qualidade de saída suportada pelo modelo.
        - name: background
          type: string
          required: false
          description: Configuração de fundo da saída.
        - name: input_fidelity
          type: string
          required: false
          description: Quanto os modelos suportados devem preservar os detalhes da imagem de origem.
        - name: output_format
          type: string
          required: false
          description: Codificação de saída, como png, webp ou jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Nível de compressão da saída, de 0 a 100.
        - name: user
          type: string
          required: false
          description: Identificador de usuário final compatível com o provedor.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/edits \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -F model=gpt-image-2 \
          -F 'prompt=Turn the daytime sky into a starry night' \
          -F image=@landscape.png
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        with open("landscape.png", "rb") as image:
            result = client.images.edit(
                model="gpt-image-2",
                image=image,
                prompt="Turn the daytime sky into a starry night",
            )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 1024,
          "output_tokens": 4096,
          "total_tokens": 5120,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 1012}
        }
      }
  notes:
    - title: Uploads multipart
      description: Envie model, prompt e image como multipart/form-data. Repetir o campo image preserva vários arquivos de origem.
    - title: Somente síncrono
      description: stream=true, mode=stream e mode=async são rejeitados.
  errors:
    - status: "400"
      description: Corpo multipart inválido, modelo não suportado, modo de streaming ou requisição ao provedor inválida.
    - status: "401"
      description: Chave de API ausente ou inválida.
    - status: "402"
      description: Limite de gastos da organização ou da API Key atingido.
    - status: "403"
      description: O escopo da chave de API não autoriza este endpoint.
    - status: "404"
      description: O modelo de edição de imagem roteado não está disponível.
    - status: "429"
      description: Limite de taxa excedido.
    - status: "500"
      description: Falha na persistência da requisição ou no processamento da resposta.
    - status: "502"
      description: O provedor retornou uma resposta nativa inválida.
    - status: "503"
      description: Nenhuma rota de provedor teve sucesso.
---

<ApiReferencePage />

## Modelos suportados {#supported-models}
Estes modelos de imagem da OpenAI usam a Images API nativa neste endpoint e em [`/v1/images/generations`](/api-reference/images/generations). Envie o nome público do modelo em `model`:

| `model` | Ideal para |
| --- | --- |
| `gpt-image-2.5-flare` | Geração e edição rápidas e de alta qualidade para o trabalho criativo do dia a dia |
| `gpt-image-2.5-sunburst` | Trabalhos em que fidelidade visual e precisão são mais importantes |
| `gpt-image-2` | A geração anterior do GPT Image |

As requisições são síncronas e retornam os dados da imagem em `data` como `b64_json` ou URL. Este endpoint é separado do endpoint assíncrono geral de modelos `/v1/run`; a página de cada modelo no [catálogo de modelos](https://www.sandbase.ai/models/image-video) documenta esse contrato e seus preços.

Informe `model`, `prompt` e pelo menos um arquivo `image`. Repita o campo `image` para compor ou editar várias imagens de origem:

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
