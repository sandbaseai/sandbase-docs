---
i18nSource: d4dc2aeab688ab05
title: Google Gemini GenerateContent
description: Appelez SandBase avec le protocole natif Google Gemini GenerateContent.
aside: false
outline: false
apiReference:
  title: Google Gemini GenerateContent
  operation: Gemini
  method: POST
  path: /v1beta/models/{model}:generateContent
  description: Envoyez une requête Gemini native et recevez une réponse compatible Gemini. Utilisez streamGenerateContent pour le streaming.
  groups:
    - title: Paramètres de chemin
      fields:
        - name: model
          type: string
          required: true
          description: Nom de modèle Google nu, par exemple gemini-3.5-flash. SandBase le résout en google/{model}.
    - title: Corps de la requête
      fields:
        - name: contents
          type: array
          required: false
          description: Contenus de conversation Gemini composés de role et de parts.
        - name: systemInstruction
          type: object
          required: false
          description: Instruction système textuelle au format Content de Gemini.
        - name: generationConfig
          type: object
          required: false
          description: Paramètres d'échantillonnage, de longueur de sortie, de sortie structurée et de réflexion.
        - name: tools
          type: array
          required: false
          description: Déclarations de fonctions ou configuration des outils intégrés Gemini pris en charge.
        - name: toolConfig
          type: object
          required: false
          description: Politique d'appel de fonctions de Gemini.
        - name: safetySettings
          type: array
          required: false
          description: Catégories et seuils de sécurité de Gemini.
        - name: cachedContent
          type: string
          required: false
          description: Ressource de contenu en cache Gemini, transmise lorsqu'elle est prise en charge.
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

## Authentification {#authentication}

Les requêtes compatibles Google peuvent transmettre la clé API SandBase dans `x-goog-api-key`, `Authorization: Bearer …` ou le paramètre de requête `key`, dans cet ordre de priorité. Préférez un en-tête : les identifiants placés dans la query string peuvent apparaître dans les journaux de proxy et l'historique du navigateur.

## Streaming {#streaming}

Remplacez le suffixe de méthode par `:streamGenerateContent`. Sans paramètre de requête, SandBase renvoie des objets de réponse compatibles Google sous forme de tableau JSON streamé. Ajoutez `?alt=sse` pour obtenir des Server-Sent Events :

```bash
curl -N -X POST \
  "https://api.sandbase.ai/v1beta/models/gemini-3.5-flash:streamGenerateContent?alt=sse" \
  -H "x-goog-api-key: $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"contents":[{"role":"user","parts":[{"text":"Write a short greeting."}]}]}'
```

## Génération d'images native {#native-image-generation}

Ces modèles d'image disposent de mappages GenerateContent natifs dédiés :

- [Gemini 3 Pro Image (Nano Banana Pro)](https://www.sandbase.ai/models/google/gemini-3-pro-image/docs) : `gemini-3-pro-image`
- [Gemini 3.1 Flash Image (Nano Banana 2)](https://www.sandbase.ai/models/google/gemini-3.1-flash-image/docs) : `gemini-3.1-flash-image`
- [Gemini Nano Banana 2.1 (Nano Banana 2.1)](https://www.sandbase.ai/models/google/gemini-nano-banana-2.1/docs) : `gemini-nano-banana-2.1`

La page de chaque modèle indique ses prix par token et son coût par image.

Pour ces mappages, SandBase transmet les charges utiles de requête et de réponse sans les convertir via Chat
Completions. Les parties image, les modalités de réponse et les champs définis par le fournisseur sont ainsi conservés. Utilisez le nom de modèle nu dans
l'URL ; par exemple, `google/gemini-3.1-flash-image` devient `gemini-3.1-flash-image` dans le chemin.
### Modifier une image {#edit-an-image}

Ajoutez l'image source sous forme de partie `inlineData` à côté de l'instruction textuelle. Utilisez le type MIME des octets que vous envoyez :

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

### Utiliser le SDK Google Gen AI {#use-the-google-gen-ai-sdk}

Configurez le SDK officiel pour qu'il pointe vers SandBase et utilisez votre clé API SandBase :

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

Pour le streaming, appelez `:streamGenerateContent?alt=sse` (SDK : `generate_content_stream`) avec le même corps.

### Traitement de la réponse {#response-handling}
Lisez les médias générés dans les parties du candidat renvoyé. Comme ces modèles utilisent un passthrough natif, la casse des champs définis par le fournisseur
et les métadonnées MIME sont renvoyées telles que reçues. Décodez la charge utile base64 et vérifiez les octets réels du média
avant de choisir une extension de fichier.

## Limites du routage et de la traduction {#routing-and-translation-boundaries}

SandBase ne sélectionne que les fournisseurs qui prennent en charge le protocole Gemini natif demandé. Si le modèle sélectionné n'a pas de
mappage natif compatible, la requête échoue au lieu de basculer vers un fournisseur utilisant un autre protocole.

Les modèles qui passent par le chemin GenerateContent traduit prennent en charge le texte, les appels de fonction et leurs réponses, les données `image/*` inline
et les références d'images HTTP(S) publiques. Ce chemin traduit rejette les types MIME inline non pris en charge, les références privées Google Files ou
`gs://`, les candidats multiples et les modalités de réponse non prises en charge avec une réponse `400 INVALID_ARGUMENT` au format Google.
Les mappages de génération d'images listés ci-dessus utilisent un passthrough brut et ne sont pas soumis à ces limites propres à la traduction ;
validez les champs média renvoyés selon la réponse du fournisseur sélectionné.
