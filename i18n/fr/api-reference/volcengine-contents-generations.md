---
i18nSource: 4bd032d88bac0470
title: Vidéo Seedance (protocole Volcengine Ark)
description: "Générez des vidéos Seedance 2.0 et 2.5 via le protocole de tâches Contents Generations de Volcengine Ark : entrées, interrogation, facturation et Assets média."
aside: false
outline: false
apiReference:
  title: Vidéo Seedance
  operation: Video
  method: POST
  path: /api/v3/contents/generations/tasks
  description: Soumet une tâche vidéo Seedance. Une soumission réussie renvoie HTTP 200 et un id de tâche SandBase.
  groups:
    - title: Corps de la requête
      fields:
        - name: model
          type: string
          required: true
          description: "Identifiant de modèle pris en charge : bytedance/seedance/2.0-official ou bytedance/seedance/2.5-official."
        - name: content
          type: array
          required: true
          description: "Entrées typées : texte et médias facultatifs. La forme des éléments est validée par le modèle."
        - name: duration
          type: integer
          required: false
          description: Transmis tel quel au modèle. La validation du modèle s'applique.
        - name: resolution
          type: string
          required: false
          description: Transmis tel quel au modèle. La validation du modèle s'applique.
        - name: ratio
          type: string
          required: false
          description: Transmis tel quel au modèle. La validation du modèle s'applique.
        - name: generate_audio
          type: boolean
          required: false
          description: Transmis tel quel au modèle. Demande la génération d'audio lorsqu'elle est prise en charge.
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

## Guide Seedance {#seedance-guide}

Seedance génère des vidéos à partir de texte, d'images d'ouverture et de clôture, et de références multimodales comme des images, des vidéos et de
l'audio. Utilisez-le pour tout type de rendu, du simple clip texte-vers-vidéo au plan dirigé qui suit un sujet visuel, un mouvement de
caméra et une bande sonore.

La génération est asynchrone. Soumettez une tâche, puis interrogez-la jusqu'à ce qu'elle atteigne un statut final.

## Choisir un modèle {#choosing-a-model}

| `model` | Idéal pour | Résolutions de sortie |
| --- | --- | --- |
| `bytedance/seedance/2.5-official` | Livraison en 1080p et résolution de sortie la plus élevée disponible | 480p, 720p, 1080p |
| `bytedance/seedance/2.0-official` | Génération moins coûteuse lorsque le 480p ou le 720p suffit | 480p, 720p |

Les deux modèles acceptent les mêmes entrées multimodales et prennent en charge les workflows texte-vers-vidéo, image-vers-vidéo et de référence
multimodale avec une seule forme de requête. Choisissez `2.0-official` lorsque le 480p ou le 720p répond à vos besoins et que vous voulez l'option
la moins chère. Choisissez `2.5-official` lorsque vous avez besoin du 1080p.

## Référence de l'API {#api-reference}

| Méthode | Chemin |
| --- | --- |
| `POST` | `/api/v3/contents/generations/tasks` |
| `GET` | `/api/v3/contents/generations/tasks/{task_id}` |

Le listage des tâches ainsi que l'annulation ou la suppression d'une tâche ne sont pas pris en charge. Conservez l'`id` de tâche renvoyé pour récupérer le résultat.

Authentifiez chaque requête avec la clé API qui a servi à créer la tâche :

```
Authorization: Bearer $SANDBASE_API_KEY
```

La valeur de `model` doit correspondre à l'un des noms de la section [Choisir un modèle](#choosing-a-model). L'interrogation régulière (polling) est le moyen pris en charge pour
recevoir les résultats ; ne comptez pas sur `callback_url` pour cet endpoint.

## Démarrage rapide {#quickstart}

Soumettez une tâche :

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

Interrogez la tâche avec cet id toutes les 5 à 10 secondes jusqu'à ce que `status` vaille `succeeded`, `failed`, `expired` ou `cancelled` :

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

La vidéo générée est disponible à l'adresse `content.video_url`.

## Choisir un workflow d'entrée {#choose-an-input-workflow}

L'API prend en charge sept workflows d'entrée courants. Chaque élément de `content` possède un `type` ; la combinaison des types d'éléments et
des rôles détermine le workflow :

| Objectif | Combinaison de `content` | À utiliser lorsque |
| --- | --- | --- |
| Texte vers vidéo | Texte | La scène peut être entièrement décrite dans le prompt |
| Animer une image d'ouverture | Texte (facultatif) + image avec `first_frame` | La première image doit correspondre à une image fournie |
| Transition entre deux images | Texte (facultatif) + `first_frame` + `last_frame` | Le plan nécessite un début et une fin maîtrisés |
| Suivre une référence visuelle | Texte (facultatif) + image avec `reference_image` | Un sujet, un produit, un costume ou un style visuel doit rester reconnaissable |
| Suivre un mouvement ou un langage de caméra | Texte (facultatif) + vidéo avec `reference_video` | Le mouvement, le timing, le rythme de montage ou le mouvement de caméra proviennent d'un clip de référence |
| Ajouter une référence audio | Texte/image/vidéo + audio avec `reference_audio` | Des dialogues, de la musique, une voix ou un sound design doivent guider le résultat |
| Direction multimodale complète | Texte + références image, vidéo et audio | Différents assets contrôlent l'apparence, le mouvement et le son dans un même plan |

L'audio ne peut pas être utilisé seul. Toute requête qui inclut un élément audio doit aussi inclure au moins un élément texte, image ou
vidéo.

### Forme des éléments de contenu {#content-item-shapes}

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

`role` indique comment le modèle doit utiliser l'asset :

| Asset | `role` | Effet |
| --- | --- | --- |
| Image | `first_frame` | Utilise l'image comme image d'ouverture |
| Image | `last_frame` | Utilise l'image comme image de clôture ; incluez un `first_frame` dans la même requête |
| Image | `reference_image` | Sert de référence pour le sujet, la composition, le produit, le costume ou le style visuel |
| Vidéo | `reference_video` | Sert de référence pour le mouvement, le travail de caméra, le timing ou le rythme de montage |
| Audio | `reference_audio` | Sert de référence pour la voix, les dialogues, la musique ou le sound design |

Les éléments image acceptent une URL publique ou une valeur en ligne `data:image/...;base64,...`. Les références vidéo et audio doivent
utiliser des URL publiques que le modèle peut télécharger.

L'inclusion d'un élément `video_url` fait passer la requête en mode vidéo-vers-vidéo, ce qui modifie le tarif par token. Consultez
[Facturation](#billing).

## Recettes courantes {#common-recipes}

Les exemples ci-dessous présentent des corps de requête. Envoyez-les à l'endpoint de création de tâche présenté dans le [Démarrage rapide](#quickstart).

### Animer une première image {#animate-a-first-frame}

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

### Créer une transition de la première à la dernière image {#create-a-first-to-last-frame-transition}

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

### Diriger un plan avec des références image, vidéo et audio {#direct-a-shot-with-image-video-and-audio-references}

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

Utilisez le prompt pour attribuer un rôle clair à chaque référence, par exemple : « conserve l'apparence du produit de l'image, utilise
le mouvement de caméra de la vidéo et suis le rythme de l'audio ». C'est plus fiable que de demander à chaque asset
de contrôler l'ensemble du résultat.

## Rédiger un prompt efficace {#writing-an-effective-prompt}

Un prompt pratique suit généralement cet ordre :

1. **Sujet** — qui ou quoi apparaît dans le plan.
2. **Action** — ce qui change ou bouge.
3. **Scène** — lieu, moment de la journée, météo et détails environnants.
4. **Style visuel** — cinématographique, documentaire, publicité produit, animation, etc.
5. **Caméra** — cadrage, rendu de l'objectif, mouvement de caméra et coupes.
6. **Son** — dialogues, ambiance, musique ou effets lorsque `generate_audio` est activé.

Indiquez explicitement ce qui doit rester stable. Par exemple : « L'étiquette du produit reste lisible, la caméra effectue un seul travelling
avant lent, aucune coupe, ambiance sonore naturelle de la pièce. » Lorsque plusieurs références sont présentes, décrivez la qualité visuelle ou de mouvement
à reprendre de chacune.

## Options de sortie {#output-options}

| Paramètre | Type | Défaut | Valeurs |
| --- | --- | --- | --- |
| `resolution` | string | `720p` | `480p`, `720p`, `1080p`. `2.0-official` ne prend pas en charge `1080p` |
| `ratio` | string | `adaptive` | `16:9`, `9:16`, `4:3`, `3:4`, `1:1`, `21:9`, `adaptive`. `adaptive` choisit un format à partir de l'entrée et du prompt |
| `duration` | integer | `5` | De 4 à 15 secondes, ou `-1` pour laisser le modèle choisir dans la plage prise en charge |
| `generate_audio` | boolean | `true` | Génère une voix, des effets sonores et une musique de fond synchronisés |
| `seed` | integer | `-1` | De `-1` à `2^32-1`. Le même prompt et la même seed produisent un résultat similaire, mais pas identique |
| `watermark` | boolean | `false` | Ajoute un filigrane « généré par IA » dans le coin inférieur droit |
| `tools` | array | `[]` | `[{"type": "web_search"}]` active la recherche web pendant la planification du plan |

### Contrôle de la tâche {#task-control}

| Paramètre | Type | Défaut | Remarques |
| --- | --- | --- | --- |
| `execution_expires_after` | integer | `172800` | Délai d'expiration de la tâche en secondes, de 3600 à 259200. Une tâche qui le dépasse passe à `expired` |
| `service_tier` | string | `default` | Ces modèles ne prennent pas en charge `flex` |
| `safety_identifier` | string | — | Identifiant opaque de l'utilisateur final, 64 caractères au maximum. Envoyez un hash, pas des données personnelles brutes |

### Taille de l'image {#frame-size}

`resolution` et `ratio` déterminent ensemble les dimensions en pixels :

| Résolution | 16:9 | 9:16 | 4:3 | 3:4 | 1:1 | 21:9 |
| --- | --- | --- | --- | --- | --- | --- |
| 480p | 864×496 | 496×864 | 752×560 | 560×752 | 640×640 | 992×432 |
| 720p | 1280×720 | 720×1280 | 1112×834 | 834×1112 | 960×960 | 1470×630 |
| 1080p | 1920×1080 | 1080×1920 | 1664×1248 | 1248×1664 | 1440×1440 | 2206×946 |

## Statut de la tâche {#task-status}

| `status` | Signification | Que faire |
| --- | --- | --- |
| `queued` | Acceptée, en attente de démarrage | Continuez à interroger toutes les 5 à 10 secondes |
| `running` | Génération en cours | Continuez à interroger |
| `succeeded` | Terminée | Téléchargez `content.video_url` |
| `failed` | Rejetée par la modération du contenu, ou erreur du modèle | Lisez `error.message`. Ajustez le prompt avant de réessayer |
| `expired` | A dépassé `execution_expires_after` | Soumettez-la à nouveau |
| `cancelled` | Terminée avant le début de la génération | Soumettez-la à nouveau |

### Champs de la tâche {#task-fields}

| Champ | Type | Remarques |
| --- | --- | --- |
| `id` | string | L'id de tâche renvoyé à la soumission |
| `model` | string | La valeur de `model` que vous avez envoyée |
| `status` | string | Voir ci-dessus |
| `created_at` | integer | Secondes Unix |
| `updated_at` | integer | Secondes Unix. Égal à `created_at` jusqu'à la fin de la tâche |
| `content` | object | Vide jusqu'à la réussite de la tâche. Contient la `video_url` générée |
| `usage` | object | Nombres de tokens. Consultez [Facturation](#billing) |
| `error` | object | Présent pour `failed` et `expired`. Contient `code` et `message` |

### Flux Python complet {#complete-python-flow}

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

## Facturation {#billing}

Ces modèles facturent sur la base de `usage.completion_tokens`, que la tâche indique lorsqu'elle se termine. Le tarif par token dépend de deux
dimensions :

- **La présence de vidéo dans l'entrée.** Les requêtes vidéo-vers-vidéo, c'est-à-dire celles qui contiennent un élément `content` de type `video_url`, sont facturées à
  un tarif inférieur à celui du texte-vers-vidéo.
- **La résolution de sortie.** Pour `2.5-official`, le 1080p est facturé plus cher que le 480p et le 720p. Le tarif de `2.0-official` ne varie pas
  selon la résolution.

`usage` indique `completion_tokens` et `total_tokens`, qui sont actuellement égaux. Il est vide pendant l'exécution de la tâche.
Consultez votre [historique de compte](/api-reference/account/history) pour les montants réellement facturés, et le
[guide des tarifs](/guides/billing) pour les tarifs actuels.

## Erreurs {#errors}

Une requête invalide renvoie immédiatement une erreur. Une erreur survenue pendant la génération apparaît dans la tâche lors de l'interrogation. Dans les deux cas, un
objet `error` contient un `code` lisible par une machine et un `message` lisible par un humain :

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

Étapes de récupération courantes :

| Résultat | Que tenter |
| --- | --- |
| `400 InvalidParameter` | Vérifiez le nom du modèle, le contenu requis, les rôles, la résolution, la durée et les URL des assets |
| Statut de tâche `failed` avec une erreur de modération du contenu | Réécrivez le prompt ou remplacez l'asset de référence signalé avant de soumettre à nouveau |
| Statut de tâche `expired` | Soumettez une nouvelle tâche ; envisagez un `execution_expires_after` plus long pour les clips en haute résolution ou longs |
| `429 RateLimitExceeded` | Réessayez avec un backoff exponentiel et réduisez le nombre de soumissions simultanées |
| `503 ServiceUnavailable` | Renvoyez la même requête après un court délai |

## Utiliser des Assets média enregistrés {#use-registered-media-assets}

SandBase expose le protocole Asset compatible avec l'API officielle à l'adresse `/v1/assets`. La requête Asset et la référence `asset://` renvoyée
suivent le protocole officiel, et la référence est transmise telle quelle dans la requête native ByteDance Contents
Generations. Les modèles
`bytedance/seedance/2.5-official` et `bytedance/seedance/2.0-official` acceptent tous deux cette référence
là où ils acceptent normalement une URL HTTP(S) publique.

Le workflow complet est le suivant :

1. Enregistrez une URL de média accessible avec `POST /v1/assets`.
2. Interrogez `GET /v1/assets/{external_id}` jusqu'à ce que le fournisseur indique que l'Asset est utilisable.
3. Placez l'`asset_url` renvoyée dans un élément `content` Seedance et soumettez la tâche de génération.

### Opérations Asset compatibles avec l'API officielle {#official-compatible-asset-operations}

| Méthode | Chemin | Rôle |
| --- | --- | --- |
| `POST` | `/v1/assets` | Enregistre une URL de média accessible et renvoie une référence `asset://` compatible avec l'API officielle |
| `GET` | `/v1/assets/{external_id}` | Lit le statut côté fournisseur et obtient l'URL actuelle d'aperçu/de téléchargement |

L'API publique expose actuellement l'enregistrement et la consultation. Les groupes d'Assets, le listage, le renommage, la mise à jour et la suppression ne sont
pas des opérations publiques. Les Assets appartiennent à l'organisation associée à la clé API.

### Étape 1 : enregistrer l'Asset {#step-1-register-the-asset}

Envoyez l'URL accessible à `POST /v1/assets`. `asset_type` est sensible à la casse et doit valoir `Image`, `Video` ou `Audio` :

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

Conservez l'`asset_url` de la réponse :

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Image",
  "name": "Product reference",
  "created_at": "2026-07-10T15:04:03Z"
}
```

La valeur qui suit `asset://` est l'`external_id` utilisé par l'opération de consultation compatible avec l'API officielle.

### Étape 2 : vérifier la disponibilité {#step-2-check-readiness}

Interrogez l'Asset avec l'`external_id`, sans le préfixe `asset://` :

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

Traitez `status` comme une valeur ouverte du fournisseur plutôt que comme une énumération exhaustive. Attendez que le fournisseur indique un état
utilisable avant de soumettre la tâche de génération ; une valeur courante indiquant la disponibilité est `Active`. `download_url` est géré par le fournisseur et
peut être vide pendant le traitement. Interrogez à nouveau l'Asset lorsque vous avez besoin d'une URL d'aperçu à jour. Continuez à utiliser l'`asset_url`
persistante dans les requêtes Seedance plutôt que de copier `download_url`.

### Étape 3 : générer avec l'Asset {#step-3-generate-with-the-asset}

Placez `asset_url` dans le champ d'URL correspondant au type de média. Cet exemple utilise l'image enregistrée comme
référence visuelle :

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

La réponse de création renvoie un `id` de tâche. Interrogez
`GET /api/v3/contents/generations/tasks/{task_id}` comme décrit sur la page du modèle sélectionné.

### Choisir l'élément de contenu et le rôle {#choose-the-content-item-and-role}

| Type d'Asset | `content[].type` | Champ d'URL | Rôle pris en charge | Usage |
| --- | --- | --- | --- | --- |
| Image | `image_url` | `image_url.url` | `first_frame` | Démarrer la vidéo exactement sur cette image |
| Image | `image_url` | `image_url.url` | `last_frame` | Terminer sur cette image ; incluez un `first_frame` dans la même requête |
| Image | `image_url` | `image_url.url` | `reference_image` | Préserver un sujet, un produit, une composition, un costume ou un style visuel |
| Vidéo | `video_url` | `video_url.url` | `reference_video` | Suivre le mouvement, le timing, le travail de caméra ou le rythme de montage |
| Audio | `audio_url` | `audio_url.url` | `reference_audio` | Suivre la voix, les dialogues, la musique ou le sound design |

L'audio ne peut pas être la seule entrée. Combinez un Asset `reference_audio` avec du texte, une image ou une vidéo. Toute requête qui
contient un `video_url` utilise le tarif de facturation vidéo-vers-vidéo.

#### Exemple d'Asset vidéo {#video-asset-example}

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-video1"},
  "role": "reference_video"
}
```

#### Exemple d'Asset audio {#audio-asset-example}

```json
{
  "type": "audio_url",
  "audio_url": {"url": "asset://asset-20260710150403-audio1"},
  "role": "reference_audio"
}
```

### URL directe ou référence `asset://` ? {#direct-url-or-asset-reference}

| Entrée | Idéal lorsque | Compromis |
| --- | --- | --- |
| URL HTTP(S) publique | Le média est déjà hébergé et utilisé une seule fois | Méthode la plus rapide, mais l'URL doit rester accessible jusqu'à la soumission de la tâche et la récupération par le fournisseur |
| Référence `asset://` | Le média est réutilisé via le protocole Asset officiel | Ajoute une étape d'enregistrement et de vérification de disponibilité, puis fournit une référence persistante pour les tâches Seedance ultérieures |

Pour les paramètres de requête, l'interrogation, les statuts de tâche et la facturation, consultez le [guide Seedance](#seedance-guide) ci-dessus.

## Ressources officielles ByteDance {#official-bytedance-resources}
- [Documentation de la génération vidéo Seedance](https://www.volcengine.com/docs/82379/1520758?lang=en)
- [API de création de tâche de génération de contenu](https://api.volcengine.com/api-explorer/?action=CreateContentsGenerationsTasks&groupName=%E8%A7%86%E9%A2%91%E7%94%9F%E6%88%90API&serviceCode=ark&version=2024-01-01)
- [Guide de rédaction de prompts Seedance 2.0](https://www.volcengine.com/docs/82379/2222480?lang=en)
