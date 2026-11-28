---
i18nSource: fc051d55a0cfa8bd
title: Limites de concurrence
description: Combien de tâches votre organisation peut exécuter simultanément, comment la limite évolue avec votre niveau de compte et comment gérer les erreurs 429 et 402 sur les soumissions vidéo.
---

# Limites de concurrence {#concurrency-limits}

Les limites de concurrence déterminent combien de tâches votre organisation peut avoir en cours simultanément. Chaque organisation a un niveau de compte, et ce niveau fixe sa limite de concurrence. Lorsque vous atteignez la limite, les nouvelles soumissions sur les endpoints vérifiés ci-dessous sont rejetées avec `429` jusqu'à ce que l'une de vos tâches en cours se termine. Elles ne sont pas mises en file d'attente.

La limite s'applique à toute l'organisation, toutes clés API confondues. Les soumissions vérifiées dépendent de l'endpoint :

- `POST /v1/run` et les appels Platform API via `/v1/api/{vendor}/...` sont vérifiés pour tous les types de modèles, y compris les opérations d'image, d'audio, de LLM et d'API de données.
- Les autres endpoints, comme Chat Completions, Responses, Messages, OpenAI Images et les endpoints compatibles avec les protocoles Gemini et Volcengine, ne vérifient que les soumissions vidéo.

## Fonctionnement {#how-it-works}

Lorsque vous soumettez une tâche vérifiée, SandBase compte les tâches que votre organisation a en cours, c'est-à-dire les tâches à l'état `pending` ou `running`. Si ce nombre atteint déjà votre limite, la soumission est immédiatement rejetée avec `429`. Aucune tâche n'est créée et rien n'est facturé.

Le décompte inclut toutes les requêtes en cours de votre organisation, pas seulement la vidéo. Une chat completion en streaming encore ouverte au moment où vous soumettez une tâche vérifiée occupe un emplacement. Si la même organisation exécute de longs chats en streaming et des tâches vidéo, tenez compte de l'ensemble lors de la planification de la capacité.

Un emplacement se libère dès qu'une tâche atteint un état final (`completed`, `failed` ou `timeout`). Vous n'avez rien à libérer de votre côté. Comme les emplacements se libèrent à la fin des tâches et non selon une minuterie, ce `429` diffère d'une [limite de débit](/guides/rate-limiting) par minute. Attendre un intervalle fixe ne garantit pas d'obtenir un emplacement. Attendez plutôt qu'une de vos propres tâches se termine.

## Limites par défaut {#default-limits}

Chaque nouvelle organisation commence au niveau **Bronze**, avec une limite de 2 tâches simultanées. Votre niveau augmente automatiquement en fonction du montant d'une seule recharge réussie.

| Niveau | Recharge unique | Tâches simultanées |
|-------|---------------|------------------|
| Bronze | Par défaut | 2 |
| Silver | 10 $ ou plus | 10 |
| Gold | 100 $ ou plus | 100 |
| Platinum | 500 $ ou plus | 500 |
| Diamond | Contacter l'équipe commerciale | Illimité |

- **Recharge unique, pas un cumul.** Deux recharges de 60 $ vous maintiennent au niveau Silver. Une recharge de 100 $ vous fait passer au niveau Gold.
- **Uniquement à la hausse.** Une recharge ultérieure plus faible ne réduit jamais votre niveau.
- **Uniquement les recharges payantes.** Les crédits promotionnels, les crédits d'inscription et les coupons ne modifient pas votre niveau.
- **Effet immédiat.** La nouvelle limite s'applique à votre prochaine soumission vidéo dès que le paiement réussit.

## Augmenter votre limite {#increasing-your-limit}

Le moyen le plus direct d'augmenter votre limite est une recharge unique qui atteint le seuil suivant du tableau ci-dessus.

Pour plus de 500 tâches simultanées, ou pour une ligne de crédit mensuelle, écrivez à [contact@sandbase.ai](mailto:contact@sandbase.ai) au sujet du niveau **Diamond**. Le niveau Diamond n'a pas de limite de concurrence. Il est configuré par l'équipe SandBase et n'est jamais modifié par les recharges.

## Vérification du crédit pour les soumissions vidéo {#credit-check-on-video-submissions}

En plus de la vérification de concurrence, SandBase estime le coût de chaque tâche vidéo avant de l'accepter. Si l'estimation dépasse votre crédit disponible (solde plus toute ligne de crédit), la soumission est rejetée avec `402`. Aucune tâche n'est créée et rien n'est facturé.

- Chaque soumission est comparée à votre solde actuel. Les tâches encore en cours n'ont pas encore été facturées : gardez donc une marge lorsque vous soumettez plusieurs vidéos à la fois.
- Si le prix d'un modèle dépend d'une sortie qui n'existe qu'après son exécution, le coût ne peut pas être estimé à l'avance. La soumission est acceptée et facturée normalement à la fin de la tâche.

## Gérer les erreurs de concurrence {#handling-concurrency-errors}

### 429 : limite de concurrence atteinte {#_429-concurrency-limit-reached}

```http
HTTP/1.1 429 Too Many Requests
Content-Type: application/json

{
  "error": "organization concurrency limit exceeded"
}
```

Aucun en-tête `Retry-After` n'est envoyé. La limite étant connue à l'avance, l'approche la plus fiable consiste à ne jamais la dépasser. Plafonnez côté client le nombre de tâches vidéo en cours, et ne soumettez la suivante qu'après la fin d'une tâche précédente :

::: code-group

```python [Python]
import asyncio

MAX_CONCURRENT_VIDEOS = 2  # set to your level's limit
slots = asyncio.Semaphore(MAX_CONCURRENT_VIDEOS)

async def generate_video(submit, wait_for_result, payload):
    # Hold a slot for the whole lifetime of the task, not just the submit call.
    async with slots:
        task = await submit(payload)
        return await wait_for_result(task)

async def main(submit, wait_for_result, payloads):
    return await asyncio.gather(
        *(generate_video(submit, wait_for_result, p) for p in payloads)
    )
```

```javascript [JavaScript]
const MAX_CONCURRENT_VIDEOS = 2; // set to your level's limit

async function runAll(payloads, submit, waitForResult) {
  const results = [];
  const queue = [...payloads.entries()];

  async function worker() {
    for (let next = queue.shift(); next; next = queue.shift()) {
      const [index, payload] = next;
      // Each worker holds one slot until its task finishes.
      const task = await submit(payload);
      results[index] = await waitForResult(task);
    }
  }

  await Promise.all(
    Array.from({ length: MAX_CONCURRENT_VIDEOS }, worker)
  );
  return results;
}
```

:::

Si vous recevez malgré tout un `429`, par exemple parce qu'un autre service de la même organisation soumet aussi des tâches, patientez puis réessayez. Utilisez un backoff exponentiel avec jitter et abandonnez après un nombre limité de tentatives plutôt que de réessayer en boucle serrée.

### 402 : crédit insuffisant pour cette vidéo {#_402-not-enough-credit-for-this-video}

```http
HTTP/1.1 402 Payment Required
Content-Type: application/json

{
  "error": "insufficient credit for estimated video cost"
}
```

Ne réessayez pas. Rechargez votre compte, ou choisissez une durée plus courte ou une résolution plus basse, moins coûteuse.

### API compatibles {#compatible-apis}

Les endpoints compatibles avec d'autres protocoles renvoient ces erreurs dans leur propre format natif. Par exemple, l'endpoint compatible Volcengine `/api/v3/contents/generations/tasks` renvoie `RateLimitExceeded` pour `429` et `AccountOverdueError` pour `402`.

## Voir aussi {#related}

- [Limites de débit](/guides/rate-limiting) : limites de requêtes par minute
- [Tarifs](/guides/billing) : crédits et recharges
- [Erreurs](/api-reference/errors) : tous les codes d'erreur
