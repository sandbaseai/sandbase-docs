---
i18nSource: 39ce638efc41350d
title: Gerar imagem
description: Gere uma imagem com a API síncrona compatível com a OpenAI Images.
aside: false
outline: false
apiReference:
  title: Gerar imagem
  operation: Images
  method: POST
  path: /v1/images/generations
  description: Gere imagens pelo endpoint síncrono do SandBase compatível com a OpenAI Images. Este endpoint é diferente da API geral de modelos /v1/run.
  signature: client.images.generate(params)
  groups:
    - title: Corpo da requisição
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: Um entre gpt-image-2, gpt-image-2.5-flare ou gpt-image-2.5-sunburst.
        - name: prompt
          type: string
          required: true
          description: Descrição em texto da imagem a ser gerada.
        - name: n
          type: integer
          required: false
          description: Número de imagens a gerar, quando suportado.
        - name: size
          type: string
          required: false
          description: Dimensões de saída suportadas pelo modelo.
        - name: quality
          type: string
          required: false
          description: Qualidade de saída, como low, medium, high ou auto.
        - name: background
          type: string
          required: false
          description: Configuração de fundo, como transparent, opaque ou auto.
        - name: output_format
          type: string
          required: false
          description: Codificação de saída, como png, webp ou jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Nível de compressão da saída, de 0 a 100.
        - name: moderation
          type: string
          required: false
          description: Configuração de moderação compatível com o provedor.
        - name: user
          type: string
          required: false
          description: Identificador do usuário final compatível com o provedor.
  examples:
    - label: cURL
      language: bash
      code: |-
        curl https://api.sandbase.ai/v1/images/generations \
          -H "Authorization: Bearer $SANDBASE_API_KEY" \
          -H "Content-Type: application/json" \
          -d '{"model":"gpt-image-2","prompt":"A paper-cut city floating above the clouds","size":"1024x1024"}'
    - label: Python
      language: python
      code: |-
        from openai import OpenAI

        client = OpenAI(api_key="sk-...", base_url="https://api.sandbase.ai/v1")
        result = client.images.generate(
            model="gpt-image-2",
            prompt="A paper-cut city floating above the clouds",
            size="1024x1024",
        )
        print(result.data[0].b64_json or result.data[0].url)
  response:
    status: 200 OK
    code: |-
      {
        "created": 1787529600,
        "data": [{"b64_json": "iVBORw0KGgo..."}],
        "usage": {
          "input_tokens": 12,
          "output_tokens": 4096,
          "total_tokens": 4108,
          "input_tokens_details": {"text_tokens": 12, "image_tokens": 0}
        }
      }
  notes:
    - title: Apenas síncrono
      description: stream=true, mode=stream e mode=async são rejeitados. Use diretamente o array data retornado.
    - title: Campos compatíveis
      description: Campos JSON adicionais são repassados sem alteração, mas o suporte continua dependendo do modelo e do provedor.
  errors:
    - status: "400"
      description: JSON inválido, modelo não suportado, modo de streaming ou requisição ao provedor.
    - status: "401"
      description: API key ausente ou inválida.
    - status: "402"
      description: Limite de gastos da organização ou da API Key atingido.
    - status: "403"
      description: O escopo da API key não autoriza este endpoint.
    - status: "404"
      description: O modelo de imagem roteado não está disponível.
    - status: "429"
      description: Limite de taxa excedido.
    - status: "500"
      description: Falha ao persistir a requisição ou processar a resposta.
    - status: "502"
      description: O provedor retornou uma resposta nativa inválida.
    - status: "503"
      description: Nenhuma rota de provedor teve sucesso.
---

<ApiReferencePage />

## Modelos suportados {#supported-models}
Estes modelos de imagem da OpenAI usam a Images API nativa neste endpoint. Envie o nome público do modelo em `model`:

| `model` | Ideal para |
| --- | --- |
| `gpt-image-2.5-flare` | Geração e edição rápidas e de alta qualidade para o trabalho criativo do dia a dia |
| `gpt-image-2.5-sunburst` | Trabalhos em que fidelidade visual e precisão são mais importantes |
| `gpt-image-2` | A geração anterior do GPT Image |

As requisições são síncronas e retornam os dados da imagem em `data` como `b64_json` ou uma URL. Este endpoint é separado do endpoint geral assíncrono de modelos `/v1/run`; a página de cada modelo no [catálogo de modelos](https://www.sandbase.ai/models/image-video) documenta esse contrato e os preços.

Para editar imagens, envie `multipart/form-data` para [`POST /v1/images/edits`](/api-reference/images/edits) com os mesmos nomes de modelo.

