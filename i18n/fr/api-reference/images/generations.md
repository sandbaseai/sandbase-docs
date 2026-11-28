---
i18nSource: 39ce638efc41350d
title: Générer une image
description: Générez une image avec l'API synchrone compatible OpenAI Images.
aside: false
outline: false
apiReference:
  title: Générer une image
  operation: Images
  method: POST
  path: /v1/images/generations
  description: Générez des images via l'endpoint synchrone de SandBase compatible OpenAI Images. Cet endpoint est distinct de l'API de modèles générale /v1/run.
  signature: client.images.generate(params)
  groups:
    - title: Corps de la requête
      schema: ImageGenerateParams
      fields:
        - name: model
          type: string
          required: true
          description: L'un des modèles gpt-image-2, gpt-image-2.5-flare ou gpt-image-2.5-sunburst.
        - name: prompt
          type: string
          required: true
          description: Description textuelle de l'image à générer.
        - name: n
          type: integer
          required: false
          description: Nombre d'images à générer, si le modèle le permet.
        - name: size
          type: string
          required: false
          description: Dimensions de sortie prises en charge par le modèle.
        - name: quality
          type: string
          required: false
          description: Qualité de sortie, par exemple low, medium, high ou auto.
        - name: background
          type: string
          required: false
          description: Réglage de l'arrière-plan, par exemple transparent, opaque ou auto.
        - name: output_format
          type: string
          required: false
          description: Encodage de sortie, par exemple png, webp ou jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Niveau de compression de sortie, de 0 à 100.
        - name: moderation
          type: string
          required: false
          description: Réglage de modération compatible avec le fournisseur.
        - name: user
          type: string
          required: false
          description: Identifiant de l'utilisateur final compatible avec le fournisseur.
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
    - title: Synchrone uniquement
      description: stream=true, mode=stream et mode=async sont refusés. Utilisez directement le tableau data renvoyé.
    - title: Champs compatibles
      description: Les champs JSON supplémentaires sont transmis tels quels, mais leur prise en charge dépend du modèle et du fournisseur.
  errors:
    - status: "400"
      description: JSON invalide, modèle non pris en charge, mode streaming ou requête fournisseur invalide.
    - status: "401"
      description: Clé API manquante ou invalide.
    - status: "402"
      description: Limite de dépenses de l'organisation ou de l'API Key atteinte.
    - status: "403"
      description: La portée de la clé API n'autorise pas cet endpoint.
    - status: "404"
      description: Le modèle d'image routé est indisponible.
    - status: "429"
      description: Limite de débit dépassée.
    - status: "500"
      description: Échec de la persistance de la requête ou du traitement de la réponse.
    - status: "502"
      description: Le fournisseur a renvoyé une réponse native invalide.
    - status: "503"
      description: Aucune route de fournisseur n'a abouti.
---

<ApiReferencePage />

## Modèles pris en charge {#supported-models}
Ces modèles d'image OpenAI utilisent l'API Images native sur cet endpoint. Envoyez le nom public du modèle dans `model` :

| `model` | Idéal pour |
| --- | --- |
| `gpt-image-2.5-flare` | Génération et édition rapides et de haute qualité pour le travail créatif courant |
| `gpt-image-2.5-sunburst` | Les travaux où la fidélité visuelle et la précision comptent le plus |
| `gpt-image-2` | La génération précédente de GPT Image |

Les requêtes sont synchrones et renvoient les données d'image dans `data`, sous forme de `b64_json` ou d'URL. Cet endpoint est distinct de l'endpoint de modèles asynchrone général `/v1/run` ; la page de chaque modèle dans le [catalogue de modèles](https://www.sandbase.ai/models/image-video) documente ce contrat et sa tarification.

Pour éditer des images, envoyez une requête `multipart/form-data` à [`POST /v1/images/edits`](/api-reference/images/edits) avec les mêmes noms de modèles.
