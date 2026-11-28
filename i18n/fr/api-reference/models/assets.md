---
i18nSource: 43d08f60800d37f5
title: API Media Assets
description: Enregistrez des Assets média réutilisables et récupérez leurs métadonnées et URL de téléchargement actuelles.
---

# API Media Assets {#media-assets-api}

Utilisez le protocole Asset compatible avec l'API officielle, exposé sur `/v1/assets`, pour enregistrer des URL de médias et obtenir un `asset_url` pour
les requêtes natives de génération vidéo.

Pour un exemple complet qui enregistre un média et utilise la référence `asset://` renvoyée avec Seedance, consultez
[Utiliser des Assets média enregistrés](/api-reference/volcengine-contents-generations#use-registered-media-assets) dans la référence Seedance.

## Vue d'ensemble {#overview}

| Méthode | Chemin | Description |
|--------|------|-------------|
| `POST` | `/v1/assets` | Enregistrer un Asset |
| `GET` | `/v1/assets/{id}` | Obtenir les métadonnées d'un Asset et une URL de téléchargement actuelle |

## POST /v1/assets {#post-v1-assets}

Enregistre l'URL d'un fichier accessible publiquement dans la bibliothèque d'assets et renvoie un `asset_url` utilisable dans les requêtes de génération vidéo.

### Requête {#request}

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

| Champ | Type | Obligatoire | Description |
|-------|------|----------|--------------|
| `url` | string | Oui | URL du fichier accessible publiquement |
| `asset_type` | string | Oui | Type d'Asset : `Image` / `Video` / `Audio` (sensible à la casse) |
| `name` | string | Non | Nom facultatif de l'Asset |

### Réponse {#response}

```json
{
  "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "asset_url": "asset://asset-20260710150403-hx4hf",
  "asset_type": "Video",
  "name": "Tea ad reference video",
  "created_at": "2026-07-10T15:04:03Z"
}
```

| Champ | Description |
|-------|--------------|
| `id` | ID de l'enregistrement interne |
| `asset_url` | Adresse de référence utilisée dans les requêtes de génération vidéo |
| `asset_type` | Type d'Asset |
| `name` | Nom de l'Asset |
| `created_at` | Horodatage de création |

### Utiliser asset_url {#using-asset-url}

Une fois l'Asset enregistré, passez `asset_url` à un champ d'entrée qui accepte une référence d'Asset dans le schéma actuel du modèle sélectionné. Les noms de champs varient selon le modèle ; par exemple :

```json
{
  "type": "video_url",
  "video_url": {"url": "asset://asset-20260710150403-hx4hf"},
  "role": "reference_video"
}
```

### Erreurs {#errors}

| Statut HTTP | Description |
|-------------|--------------|
| 400 | Champ obligatoire manquant ou `asset_type` invalide |
| 502 | Échec de l'enregistrement de l'Asset en amont |
| 500 | Aucun identifiant disponible ou erreur interne |

---

## GET /v1/assets/{id}

Récupère une URL de téléchargement signée pour un Asset enregistré à partir de son ID externe. Sert à prévisualiser ou télécharger le fichier sous-jacent.

### Requête {#request-1}

```http
GET /v1/assets/asset-20260710150403-hx4hf
Authorization: Bearer $SANDBASE_API_KEY
```

| Paramètre | Emplacement | Description |
|-----------|----------|--------------|
| `id` | path | L'ID externe (la partie qui suit `asset://` dans `asset_url`) |

### Réponse {#response-1}

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

| Champ | Description |
|-------|--------------|
| `asset_url` | Adresse de référence pour la génération vidéo (permanente) |
| `status` | Statut du cycle de vie de l'Asset indiqué par le fournisseur. Traitez-le comme une chaîne ouverte. |
| `download_url` | URL de téléchargement renvoyée par le fournisseur ; elle peut être vide tant que l'Asset n'est pas prêt |

### Erreurs {#errors-1}

| Statut HTTP | Description |
|-------------|--------------|
| 404 | Asset introuvable ou n'appartenant pas à votre organisation |
| 502 | Échec de la requête en amont |

---

## Remarques {#notes}

::: tip Important
- `asset_url` a le format `asset://{external_id}` et constitue la référence réutilisable à passer aux entrées des modèles compatibles
- Considérez `download_url` comme géré par le fournisseur. S'il est vide ou ne fonctionne plus, interrogez de nouveau cet endpoint pour obtenir la valeur actuelle
- `asset_type` est sensible à la casse : `Image` / `Video` / `Audio`
- L'URL soumise doit être accessible publiquement (la plateforme doit pouvoir la récupérer)
:::
