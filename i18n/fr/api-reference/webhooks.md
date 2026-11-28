---
i18nSource: efd4d5f7b8980661
title: Webhooks
description: Enregistrez et gérez des webhooks SandBase pour les événements de modèles asynchrones.
---

# Webhooks {#webhooks}

SandBase prend en charge deux modes de callback sortant :

- Les **webhooks enregistrés** sont liés à votre organisation, s'abonnent aux événements Model asynchrones et incluent une signature HMAC `X-Signature`.
- Les **callbacks de modèle par tâche** utilisent `webhook_url` sur une requête asynchrone d'image, de vidéo ou d'audio. Ils ne nécessitent pas d'enregistrement et n'incluent pas `X-Signature`.

Les deux modes utilisent une livraison at-least-once (au moins une fois). Rendez vos handlers idempotents grâce à l'ID de l'événement.

## Enregistrer un webhook {#register-a-webhook}

L'API Events est l'interface publique accessible par clé API :

```text
POST https://api.sandbase.ai/events/webhooks
```

Vous pouvez aussi créer et gérer des webhooks depuis la [page Webhooks de la Console](https://www.sandbase.ai/console/webhooks).

```bash
curl -X POST https://api.sandbase.ai/events/webhooks \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Model generation monitor",
    "url": "https://example.com/hooks/sandbase",
    "resourceType": "model",
    "events": ["model.generation.completed", "model.generation.failed"]
  }'
```

| Champ | Type | Obligatoire | Description |
|---|---|---:|---|
| `name` | string | Oui | Un nom lisible. |
| `url` | string | Oui | Un endpoint HTTP(S) valide. Utilisez HTTPS en production. |
| `resourceType` | `model` | Oui | Sélectionne les événements Model asynchrones ci-dessous. `model` est la seule valeur prise en charge. |
| `events` | string[] | Non | Vide ou omis signifie tous les événements actuels et futurs du type de ressource sélectionné. |
| `enabled` | boolean | Non | `true` par défaut. |
| `signatureSecret` | string | Non | Omettez ce champ pour laisser SandBase générer un secret à forte entropie. Les clients existants peuvent continuer à fournir leur propre valeur non vide. |

Les types de ressource `session`, `sandbox` et `template` sont retirés : créer un webhook avec l'un d'eux renvoie HTTP 400. Les enregistrements existants de ces types restent listés pour pouvoir être nettoyés : un `PATCH` sur ceux-ci renvoie HTTP 400, sauf si la même requête change `resourceType` en `model` (et que l'abonnement obtenu est valide) ; supprimez-les donc ou convertissez-les en `model`. Les abonnements `model` ne sont disponibles que pour les événements terminaux asynchrones d'image, de vidéo et d'audio listés ci-dessous. L'API refuse les événements d'autres types de ressource et les noms d'événements inconnus.

### Réponse en cas de succès {#successful-response}

L'API Events renvoie directement le webhook enregistré. Le `signatureSecret` final n'est inclus que dans cette réponse de création. Stockez-le dès maintenant en lieu sûr : les réponses de liste et de modification ne le renvoient jamais, et il ne peut pas être récupéré ultérieurement.

```json
{
  "id": "wh_01...",
  "name": "Model generation monitor",
  "url": "https://example.com/hooks/sandbase",
  "resourceType": "model",
  "events": ["model.generation.completed", "model.generation.failed"],
  "enabled": true,
  "createdAt": "2026-07-15T12:00:00Z",
  "signatureSecret": "whsec_<one-time-value>"
}
```

La [page Webhooks de la Console](https://www.sandbase.ai/console/webhooks) affiche le secret généré une seule fois après l'enregistrement et vous demande de l'enregistrer avant de fermer la boîte de dialogue.

### Lister, modifier et supprimer {#list-edit-and-delete}

```text
GET    https://api.sandbase.ai/events/webhooks
PATCH  https://api.sandbase.ai/events/webhooks/{webhookID}
DELETE https://api.sandbase.ai/events/webhooks/{webhookID}
```

Utilisez la même authentification par clé API. Un `PATCH` peut inclure un ou plusieurs des champs `name`, `url`, `resourceType`, `events` et `enabled` ; les champs omis restent inchangés. L'abonnement `resourceType` et `events` complet obtenu doit être valide. Un tableau `events` vide signifie toujours tous les événements de ce type de ressource.

```bash
curl -X PATCH https://api.sandbase.ai/events/webhooks/wh_01... \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "events": ["model.generation.completed", "model.generation.timeout"],
    "enabled": true
  }'
```

`signatureSecret` ne peut être ni consulté ni modifié via `PATCH` ; une requête qui le contient est refusée. Si le secret est perdu, supprimez puis recréez le webhook. Vous pouvez aussi consulter, modifier, activer ou désactiver et supprimer des enregistrements depuis la [page Webhooks de la Console](https://www.sandbase.ai/console/webhooks).

`GET` renvoie un tableau JSON de webhooks (sans `signatureSecret`), `PATCH` renvoie le webhook mis à jour et `DELETE`
renvoie `204 No Content`.

### Authentification et erreurs {#authentication-and-errors}

L'API Events accepte la clé API sous la forme `Authorization: Bearer $SANDBASE_API_KEY` ou `X-API-Key: $SANDBASE_API_KEY`. Lorsque
les deux sont envoyés, l'en-tête Bearer est utilisé.

Les erreurs ont leur propre corps, avec le statut HTTP répété dans `code` :

```json
{"code": 400, "message": "resourceType must be \"model\""}
```

Basez votre logique sur le statut HTTP. `401` signifie que la clé est manquante, invalide ou révoquée ; `400` signifie que le corps de la requête ou
l'abonnement est invalide ; `404` (`webhook not found`) signifie que le webhook n'existe pas dans votre organisation.

## Callback de modèle par tâche {#per-task-model-callback}

Pour une tâche asynchrone d'image, de vidéo ou d'audio, ajoutez `webhook_url` à `POST /v1/run` au lieu d'enregistrer un nouveau webhook :

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "example/async-image-model",
    "mode": "async",
    "prompt": "A lighthouse at night",
    "webhook_url": "https://hooks.example.com/sandbase/task?token=opaque-token"
  }'
```

Le champ n'est analysé et validé que lorsque le modèle sélectionné est un modèle d'image, de vidéo ou d'audio et que la requête aboutit à une exécution asynchrone. Dans ce cas, il doit s'agir d'une chaîne non vide contenant une URL HTTPS publique valide et sûre ; sinon, la requête renvoie HTTP 400. Pour les requêtes synchrones, en streaming, LLM ou autres requêtes non prises en charge, SandBase ignore `webhook_url` quelle que soit sa valeur JSON : aucun callback n'est planifié, aucune URL de callback n'est stockée et le champ n'est pas transmis au fournisseur du modèle. Omettre le champ conserve le flux de polling existant.

La cible doit être une URL HTTPS publique. SandBase envoie la même enveloppe terminale Model que celle documentée ci-dessous, avec `Content-Type: application/json` et `X-Event-ID`, pour completed, failed, timeout ou cancelled. Il peut réessayer une livraison échouée : dédupliquez donc par `id` ou `X-Event-ID` et renvoyez rapidement un 2xx.

Un callback par tâche n'a pas de secret SandBase partagé et n'inclut donc **pas** `X-Signature`. Si votre endpoint exige une vérification HMAC, omettez `webhook_url` et enregistrez plutôt un Model Webhook d'organisation. Vous pouvez placer dans la query de l'URL HTTPS un jeton de capacité opaque généré par votre propre système et le valider sur votre endpoint. Traitez cette URL comme une donnée sensible.

Pour chaque tâche de modèle asynchrone, la sélection de la cible est exclusive. Si la requête inclut un `webhook_url` valide, SandBase envoie l'événement terminal de cette Prediction uniquement à l'URL de la tâche et ignore tous les Model Webhooks d'organisation enregistrés pour cet événement. Si la requête omet `webhook_url`, les Model Webhooks d'organisation enregistrés continuent de recevoir normalement les événements correspondants. Un échec de livraison par tâche entraîne de nouvelles tentatives vers la même URL de tâche et ne se rabat jamais sur un webhook enregistré. Cette priorité ne crée, ne remplace, ne désactive ni ne modifie aucun enregistrement, et n'affecte pas les autres événements Model.

## Types d'événements {#event-types}

### Génération de modèle {#model-generation}

Les webhooks Model ne sont disponibles que pour la génération asynchrone d'images, de vidéos et d'audio. Ils ne sont pas émis pour les requêtes synchrones d'image, de vidéo ou d'audio, ni pour les requêtes LLM synchrones : ces résultats sont renvoyés dans la réponse HTTP d'origine.

| Événement | Description |
|---|---|
| `model.generation.completed` | Une génération asynchrone d'image, de vidéo ou d'audio est terminée. |
| `model.generation.failed` | Une génération asynchrone d'image, de vidéo ou d'audio a échoué. |
| `model.generation.timeout` | Une génération asynchrone d'image, de vidéo ou d'audio a expiré. |
| `model.generation.cancelled` | Une génération asynchrone d'image, de vidéo ou d'audio a été annulée. |

## Payload de livraison {#delivery-payload}

SandBase envoie `Content-Type: application/json` et l'enveloppe JSON suivante. `data` dépend de l'événement et peut s'enrichir de nouveaux champs au fil du temps.

### Exemple de fin de génération de modèle {#model-completion-example}

```json
{
  "id": "model_pred_01_completed",
  "resourceType": "model",
  "resourceID": "pred_01...",
  "type": "model.generation.completed",
  "data": {
    "predictionID": "pred_01...",
    "model": "example-image-model",
    "generationType": "image",
    "status": "completed",
    "completedAt": "2026-07-14T09:30:38Z",
    "outputs": ["https://.../generated-image.png"]
  },
  "createdAt": "2026-07-14T09:30:38Z"
}
```

Les événements d'échec et d'expiration omettent les sorties et ne contiennent que la catégorie d'erreur nettoyée.

| Champ | Description |
|---|---|
| `id` | ID unique de l'événement. Utilisez-le, ou `X-Event-ID`, comme clé d'idempotence. |
| `resourceType` | `model`. |
| `resourceID` | L'ID de la Prediction concernée. |
| `type` | Type d'événement issu du tableau ci-dessus. |
| `data` | Données propres à l'événement. |
| `createdAt` | Date de création de l'événement au format RFC 3339 UTC. |

## Vérifier la signature d'un webhook enregistré {#verify-a-registered-webhook-signature}

Chaque livraison d'un webhook enregistré inclut ces en-têtes :

| En-tête | Valeur |
|---|---|
| `X-Event-ID` | L'`id` du payload. |
| `X-Signature` | HMAC-SHA256 du corps brut de la requête, en hexadécimal minuscule, avec `signatureSecret` comme clé. |

Vérifiez la signature sur les octets bruts de la requête avant d'analyser le JSON. Les callbacks `webhook_url` par tâche n'incluent pas cet en-tête et ne peuvent pas utiliser ce flux de vérification. Les handlers suivants concernent les webhooks enregistrés : ils vérifient d'abord, analysent ensuite, utilisent `id` comme clé d'idempotence et confient le travail à une fonction asynchrone. Remplacez l'appel de file d'attente fictif par votre propre file d'attente ou worker durable.

::: code-group

```javascript [Node.js + Express]
import crypto from 'node:crypto'
import express from 'express'

const app = express()
const webhookSecret = process.env.SANDBASE_WEBHOOK_SECRET
if (!webhookSecret) throw new Error('SANDBASE_WEBHOOK_SECRET is required')
const acceptedEventIDs = new Set() // Use a DB unique key in production.

function enqueueSandBaseEvent(event) {
  setImmediate(() => {
    console.log(`processing ${event.type} (${event.id})`)
    // Perform slow business work here or publish to your durable queue.
  })
}

// This route must be registered before express.json() for the webhook path.
app.post('/hooks/sandbase', express.raw({ type: 'application/json' }), (req, res) => {
  const rawBody = req.body
  const signature = req.get('X-Signature') || ''

  const expected = crypto
    .createHmac('sha256', webhookSecret)
    .update(rawBody)
    .digest('hex')

  const received = Buffer.from(signature, 'utf8')
  const expectedBuffer = Buffer.from(expected, 'utf8')
  if (received.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(expectedBuffer, received)) {
    return res.status(401).json({ error: 'invalid signature' })
  }

  const event = JSON.parse(rawBody.toString('utf8'))
  if (acceptedEventIDs.has(event.id)) return res.sendStatus(204)
  acceptedEventIDs.add(event.id)
  enqueueSandBaseEvent(event)
  return res.sendStatus(204)
})

app.listen(3000)
```

```python [Python + Flask]
import hashlib
import hmac
import json
import os
import threading

from flask import Flask, abort, request

app = Flask(__name__)
webhook_secret = os.environ["SANDBASE_WEBHOOK_SECRET"].encode()
accepted_event_ids = set()  # Use a DB unique key in production.
accepted_event_ids_lock = threading.Lock()

def process_sandbase_event(event):
    print(f"processing {event['type']} ({event['id']})")
    # Perform slow business work here or publish to your durable queue.

@app.post("/hooks/sandbase")
def sandbase_webhook():
    raw_body = request.get_data(cache=True)
    received = request.headers.get("X-Signature", "")
    expected = hmac.new(webhook_secret, raw_body, hashlib.sha256).hexdigest()

    if not hmac.compare_digest(expected, received):
        abort(401, "invalid signature")

    event = json.loads(raw_body)
    with accepted_event_ids_lock:
        if event["id"] in accepted_event_ids:
            return "", 204
        accepted_event_ids.add(event["id"])
    threading.Thread(target=process_sandbase_event, args=(event,), daemon=True).start()
    return "", 204
```

:::

L'entrée du HMAC est le corps brut exact. N'appelez pas de parseur JSON et ne resérialisez pas le payload avant de le calculer.

```text
X-Signature = hex(HMAC-SHA256(signatureSecret, rawRequestBody))
```

## Comportement de livraison {#delivery-behavior}

- Une réponse dans la plage `2xx` reçue dans les 10 secondes est considérée comme un succès.
- Les erreurs réseau, les timeouts et les réponses non 2xx sont des échecs. Le dispatcher d'événements existant peut réessayer une livraison échouée ; les récepteurs doivent tolérer les livraisons en double.
- Renvoyez une réponse 2xx après une prise en charge durable, puis effectuez le travail lent de manière asynchrone. Les exemples utilisent une déduplication en mémoire uniquement pour rester exécutables ; en production, les récepteurs doivent la remplacer par une clé unique en base de données ou une file d'attente durable. Ne supposez ni une livraison exactly-once ni un ordre des événements.
