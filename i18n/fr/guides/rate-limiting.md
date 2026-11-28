---
i18nSource: d326fdb78ea64bdf
title: Limites de débit
description: Gérez en toute sécurité les limites de débit de l'API SandBase avec des nouvelles tentatives bornées, du jitter, des files d'attente et un traitement des requêtes tenant compte de l'idempotence.
---

# Limites de débit {#rate-limits}

SandBase peut attribuer à votre organisation une limite de requêtes par minute. Elle est partagée par toutes les clés API de l'organisation
et comptabilisée sur une fenêtre glissante d'une minute. Les fournisseurs de modèles en amont peuvent aussi renvoyer leurs propres
réponses `429 Too Many Requests`. Ne codez pas de quota en dur, sauf si SandBase en a attribué un à votre charge de travail.

## La limite de votre organisation {#your-organization-s-limit}
SandBase ne publie pas de nombre fixe de requêtes par minute, car la limite est attribuée par organisation. Toutes les
clés API de l'organisation comptent dans la même limite ; créer davantage de clés ne l'augmente donc pas. La limite n'est
actuellement affichée ni dans l'API publique ni dans la Console.

Si votre charge de travail nécessite une limite garantie ou plus élevée, contactez le support SandBase en indiquant l'organisation, l'application,
le débit régulier attendu et le débit de pointe attendu. Ne concevez pas un client de production autour d'une valeur numérique par défaut non documentée.

## Gérer une réponse 429 {#handle-a-429-response}

Les réponses de limitation de débit générées par la plateforme sur `/v1/*` utilisent un corps d'erreur à plat :

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{"error":"organization rate limit exceeded"}
```

La limite de l'organisation s'applique à `POST /v1/run`, `POST /v1/chat/completions`, `POST /v1/responses`, `POST /v1/messages`, `POST /v1/upload`, ainsi qu'aux endpoints Gemini `generateContent`, `streamGenerateContent` et `POST /v1beta/interactions`. Les endpoints d'interrogation comme
`GET /v1/run/{id}` ne sont pas comptabilisés. Les endpoints compatibles avec un protocole renvoient le même `429` dans leur propre enveloppe d'erreur,
comme la forme d'erreur d'Anthropic ou de Google. Une réponse émise par le fournisseur peut utiliser la forme d'erreur de l'endpoint compatible
et inclure des en-têtes de limitation de débit du fournisseur.

Les en-têtes `Retry-After` et de quota restant ne sont pas garantis. Si `Retry-After` est présent, respectez-le. Sinon, utilisez
un backoff exponentiel avec du jitter et un nombre maximal de tentatives.

```python
import os
import random
import time

from openai import OpenAI, RateLimitError

client = OpenAI(
    base_url="https://api.sandbase.ai/v1",
    api_key=os.environ["SANDBASE_API_KEY"],
    max_retries=0,
)

def create_with_backoff(**request):
    for attempt in range(5):
        try:
            return client.chat.completions.create(**request)
        except RateLimitError:
            if attempt == 4:
                raise
            delay = min(2 ** attempt, 30) + random.random()
            time.sleep(delay)
```

Le SDK OpenAI prend aussi en charge des nouvelles tentatives intégrées via `max_retries`. Choisissez délibérément entre les nouvelles tentatives du SDK et une boucle
de nouvelles tentatives applicative, afin qu'elles ne se multiplient pas d'une couche à l'autre.

## Ne réessayer que les opérations sûres {#retry-only-safe-operations}

Une requête d'inférence répétée peut créer une seconde génération et entraîner un coût supplémentaire. Ne la réessayez que si votre
application accepte une nouvelle génération. Ne réessayez pas automatiquement une requête qui modifie un état, sauf si l'opération documente
son idempotence ou si votre application peut prouver que la première tentative n'a pas abouti.

Pour les requêtes en streaming, un `429` arrive normalement avant le début du flux. Une fois que des octets sont arrivés, traitez une déconnexion
comme une génération interrompue plutôt que de supposer une erreur de limitation de débit. Conservez ou supprimez la sortie partielle selon
les exigences de votre produit ; recommencer crée une nouvelle génération.

## Maîtriser le débit {#control-throughput}

- Bornez la concurrence au lieu de lancer d'un coup un lot non borné.
- Mettez en file d'attente le travail par rafales et lissez le rythme d'envoi.
- Évitez les requêtes en double et mettez en cache les résultats réutilisables lorsque les exigences de confidentialité et de fraîcheur le permettent.
- Utilisez des clés distinctes pour la propriété, le contrôle des dépenses et la révocation, et non pour contourner les limites de la plateforme.
- Enregistrez l'endpoint, le modèle, le statut HTTP et le corps d'erreur nettoyé pour le dépannage.
- Contactez le support SandBase lorsqu'une charge de travail nécessite une limite de capacité attribuée ou plus élevée.

```python
import asyncio

semaphore = asyncio.Semaphore(8)

async def run_one(client, prompt):
    async with semaphore:
        return await client.chat.completions.create(
            model="deepseek/deepseek-v4-flash",
            messages=[{"role": "user", "content": prompt}],
        )
```

La concurrence n'est pas la même chose que le nombre de requêtes par minute. Ajustez les deux en fonction de la latence observée et de la capacité attribuée à
votre application.

::: info Appels d'API gratuits quotidiens
Les 100 appels gratuits aux API de données par jour UTC de l'organisation sont un quota de facturation, et non une limite de débit. Les appels au-delà sont
facturés à l'appel plutôt que refusés. Consultez [Appels d'API gratuits quotidiens](/guides/billing#daily-free-api-calls).
:::

::: tip Tâches vidéo
Les soumissions vidéo sont aussi limitées par le nombre de tâches que votre organisation peut exécuter simultanément, selon son niveau de compte.
Ce `429` indique `organization concurrency limit exceeded` et se lève lorsqu'une tâche en cours se termine, et non après un délai. Consultez
[Limites de concurrence](/guides/concurrency-limits).
:::

## Ressources associées {#related-guidance}

- [Gestion des erreurs](/guides/error-handling)
- [Streaming](/guides/streaming)
- [Référence des erreurs de l'API](/api-reference/errors)
- [Clés API](/getting-started/api-keys)
