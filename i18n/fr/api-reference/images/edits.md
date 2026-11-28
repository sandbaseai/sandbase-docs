---
i18nSource: a4db28360a2974cd
title: Éditer une image
description: Éditez des images téléversées avec l'API synchrone compatible OpenAI Images.
aside: false
outline: false
apiReference:
  title: Éditer une image
  operation: Images
  method: POST
  path: /v1/images/edits
  description: Éditez une ou plusieurs images téléversées via l'endpoint multipart synchrone de SandBase compatible OpenAI Images.
  signature: client.images.edit(params)
  groups:
    - title: Corps de la requête
      schema: ImageEditParams
      fields:
        - name: model
          type: string
          required: true
          description: "L'un des modèles suivants : gpt-image-2, gpt-image-2.5-flare ou gpt-image-2.5-sunburst."
        - name: prompt
          type: string
          required: true
          description: Description textuelle de l'édition demandée.
        - name: image
          type: file | file[]
          required: true
          description: Un ou plusieurs fichiers d'image source. Répétez le champ multipart pour envoyer plusieurs images.
        - name: mask
          type: file
          required: false
          description: Image de masque facultative pour l'inpainting.
        - name: n
          type: integer
          required: false
          description: Nombre d'images éditées à renvoyer, lorsque c'est pris en charge.
        - name: size
          type: string
          required: false
          description: Dimensions de sortie prises en charge par le modèle.
        - name: quality
          type: string
          required: false
          description: Qualité de sortie prise en charge par le modèle.
        - name: background
          type: string
          required: false
          description: Paramètre d'arrière-plan de la sortie.
        - name: input_fidelity
          type: string
          required: false
          description: Degré de préservation des détails de l'image source par les modèles compatibles.
        - name: output_format
          type: string
          required: false
          description: Encodage de sortie, par exemple png, webp ou jpeg.
        - name: output_compression
          type: integer
          required: false
          description: Niveau de compression de la sortie, de 0 à 100.
        - name: user
          type: string
          required: false
          description: Identifiant d'utilisateur final compatible avec le fournisseur.
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
    - title: Téléversements multipart
      description: Envoyez model, prompt et image en multipart/form-data. Répéter le champ image conserve plusieurs fichiers sources.
    - title: Synchrone uniquement
      description: stream=true, mode=stream et mode=async sont refusés.
  errors:
    - status: "400"
      description: Corps multipart invalide, modèle non pris en charge, mode streaming ou requête fournisseur invalide.
    - status: "401"
      description: Clé API manquante ou invalide.
    - status: "402"
      description: Limite de dépenses de l'organisation ou de la clé API atteinte.
    - status: "403"
      description: Le scope de la clé API n'autorise pas cet endpoint.
    - status: "404"
      description: Le modèle d'édition d'image routé est indisponible.
    - status: "429"
      description: Limite de débit dépassée.
    - status: "500"
      description: Échec de la persistance de la requête ou du traitement de la réponse.
    - status: "502"
      description: Le fournisseur a renvoyé une réponse native invalide.
    - status: "503"
      description: Aucune route fournisseur n'a abouti.
---

<ApiReferencePage />

## Modèles pris en charge {#supported-models}
Ces modèles d'image OpenAI utilisent l'API Images native sur cet endpoint et sur [`/v1/images/generations`](/api-reference/images/generations). Envoyez le nom public du modèle dans `model` :

| `model` | Idéal pour |
| --- | --- |
| `gpt-image-2.5-flare` | Génération et édition rapides et de haute qualité pour le travail créatif quotidien |
| `gpt-image-2.5-sunburst` | Les travaux où la fidélité visuelle et la précision priment |
| `gpt-image-2` | La génération précédente de GPT Image |

Les requêtes sont synchrones et renvoient les données d'image dans `data` sous forme de `b64_json` ou d'URL. Cet endpoint est distinct de l'endpoint de modèles asynchrone général `/v1/run` ; la page de chaque modèle dans le [catalogue de modèles](https://www.sandbase.ai/models/image-video) documente ce contrat et sa tarification.

Fournissez `model`, `prompt` et au moins un fichier `image`. Répétez le champ `image` pour composer ou éditer plusieurs images sources :

```bash
curl https://api.sandbase.ai/v1/images/edits \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -F "model=gpt-image-2.5-flare" \
  -F "prompt=Turn this product photo into a warm editorial scene" \
  -F "image=@product.png" \
  -F "quality=high"
```
