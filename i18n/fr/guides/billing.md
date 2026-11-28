---
i18nSource: 91c5a0d1b6de6434
title: Tarifs et utilisation
description: Consultez les tarifs actuels des modèles, examinez le coût des tâches et gérez la facturation SandBase en toute sécurité.
---

# Tarifs et utilisation {#pricing-and-usage}

SandBase utilise une facturation à l'usage. La disponibilité des modèles, les formules de prix, les multiplicateurs de cache et les frais propres à chaque
fonctionnalité peuvent évoluer indépendamment ; les intégrations doivent donc lire les métadonnées en direct plutôt que de s'appuyer sur des tableaux de prix
recopiés.

## Appels d'API gratuits quotidiens {#daily-free-api-calls}

Chaque organisation dispose de 100 appels gratuits aux API de données (recherche, réseaux sociaux, scraping, e-commerce, finance) par jour UTC. Ce
quota est partagé par toutes les API de données éligibles et toutes les clés de l'organisation, et se réinitialise à 00:00 UTC. Les LLM et
les modèles de médias ne sont pas éligibles. Certaines API de données ne le sont pas non plus : les plus chères ou celles dont le prix suit une formule, comme certains
endpoints batch, les endpoints de crawl, Xiaohongshu PGY et les routes Douyin Xingtu `kol-*`, sont facturées dès le premier appel.
Pour vérifier un outil, exécutez `sandbase_inspect` : les outils éligibles comportent `pricing.free_quota`, et ceux qui n'en ont pas sont toujours
facturés.

- Les appels compris dans le quota ne sont pas facturés, et une organisation dont le solde est nul peut quand même les utiliser.
- Après le 100e appel, les appels éligibles continuent de fonctionner et sont facturés à l'appel, au prix affiché par l'outil. Ils ne sont ni
  refusés ni limités en débit parce que le quota est épuisé.
- Les appels non utilisés ne sont pas reportés au lendemain.

Dans les [outils MCP SandBase](/setup/), `sandbase_inspect` signale les outils éligibles avec `pricing.free_quota`
(`daily_limit`, `scope`, `resets`). `sandbase_account` renvoie le quota du jour sous `free_api_quota` avec
`daily_limit`, `used_today`, `remaining` et `resets_at` ; `used_today` et `remaining` sont omis lorsque le décompte est
temporairement indisponible. Une fois une exécution réglée, `sandbase_run` et `sandbase_run_get` indiquent `free_quota_status` :
`free` (couvert par le quota), `overage` (facturé après épuisement du quota) ou `degraded` (non facturé
car le décompte du quota était indisponible).

## Gérer la facturation dans la Console {#manage-billing-in-the-console}

Utilisez **Developer → Billing** pour consulter votre solde, acheter des crédits, configurer la recharge automatique, utiliser des coupons et gérer les paramètres de facturation disponibles pour votre
organisation. Ouvrez **Developer → Activities → Usage** pour obtenir des synthèses des requêtes, des tokens et des coûts au niveau de l'organisation.

::: info Limites de l'API publique
Les endpoints de solde, de recharge, d'export de facturation et d'utilisation à l'échelle de l'organisation ne font actuellement pas partie de l'API
publique prise en charge. N'automatisez pas les requêtes réseau de la Console et ne dépendez pas de ses routes internes.
:::

## Lire les tarifs actuels d'un modèle {#read-current-model-pricing}

Commencez par découvrir un modèle activé :

```bash
curl 'https://api.sandbase.ai/v1/models?q=gpt' \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

Demandez ensuite sa fiche de modèle complète :

```bash
curl https://api.sandbase.ai/v1/models/deepseek/deepseek-v4-flash \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

L'endpoint de liste est optimisé pour la découverte et omet volontairement le détail des prix des tokens, du cache et du raisonnement.
Lisez la tarification détaillée du modèle sélectionné dans `model_card` de la réponse de détail. Il n'existe pas de formule universelle
applicable à tous les LLM, modèles de médias, modèles d'embedding ou fonctionnalités d'API.

## Vérifier le coût enregistré d'une tâche {#check-one-task-s-recorded-cost}

Lorsqu'une opération renvoie un ID de tâche, interrogez son enregistrement de règlement :

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer $SANDBASE_API_KEY"
```

La réponse distingue le `cost` actuel de l'`estimated_cost` et indique si le règlement est définitif. N'utilisez
pas `cost` pour le rapprochement de facturation tant que `settled` ne vaut pas `true`. Les enregistrements de tâche sont des données de consultation opérationnelle
et non un registre comptable. Utilisez les enregistrements de facturation et les exports CSV disponibles sous **Developer → Activities → Usage**
pour le rapprochement et la conservation à long terme.

## Bonnes pratiques de maîtrise des coûts {#cost-control-practices}

- Récupérez la fiche de modèle actuelle avant de lancer une nouvelle charge de travail.
- Vérifiez `capability_tags`, `supported_modes` et `unified_schema` ; une alternative moins chère n'est utile que si elle
  prend en charge le comportement d'entrée et de sortie requis.
- Limitez le contexte de prompt superflu et définissez une limite de tokens de sortie adaptée lorsque le modèle sélectionné le permet.
- Considérez la mise en cache comme propre à chaque modèle. Vérifiez la fiche du modèle et les champs d'utilisation renvoyés au lieu de supposer une remise
  valable pour tout le fournisseur.
- N'enregistrez les ID de tâche que pour la consultation du coût des tâches ; pour le travail asynchrone `/v1/run`, enregistrez l'ID d'exécution opaque renvoyé et interrogez `GET /v1/run/{id}` uniquement tant que le statut vaut `pending` ou `running`.
- Utilisez les contrôles de dépenses proposés dans la Console pour votre organisation.

## Erreurs de paiement {#payment-errors}

Une opération d'API peut renvoyer HTTP `402` lorsque l'organisation ne peut pas financer la requête. Les enveloppes d'erreur varient selon la
surface de compatibilité de l'API ; traitez donc le statut HTTP et l'objet d'erreur documenté plutôt que de comparer une chaîne
de message. Après avoir réglé la facturation dans la Console, réessayez en respectant les règles d'idempotence et de récupération de l'opération.

Les soumissions vidéo sont également vérifiées par rapport à leur coût estimé avant leur démarrage. Une recharge unique de 10 $ ou plus
relève le niveau de votre compte, ce qui permet d'exécuter davantage de tâches vidéo simultanément. Consultez
[Limites de concurrence](/guides/concurrency-limits).

Consultez [Modèles et tarifs](/for-agents/models), [Coût des tâches](/api-reference/tasks/cost) et
[Erreurs](/api-reference/errors) pour les contrats publics actuels.
