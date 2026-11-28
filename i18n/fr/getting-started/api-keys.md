---
i18nSource: 3dc57d405dbf561d
title: Clés API
description: Comment créer, gérer et protéger vos clés API SandBase pour authentifier vos requêtes.
---

# Clés API {#api-keys}

Les clés API authentifient vos requêtes auprès de SandBase. Ce guide explique comment créer des clés, les utiliser dans vos requêtes et les protéger.

## Créer une clé API {#create-an-api-key}

1. Connectez-vous à la [SandBase Console](https://www.sandbase.ai/console)
2. Ouvrez **Developer → API Keys** (ou accédez directement à [API Keys](https://www.sandbase.ai/console/keys))
3. Cliquez sur **New key**
4. Saisissez un **Name** explicite (par exemple « Production Server », « Local Development »)
5. Définissez éventuellement une **Spending limit** (vide signifie illimité) et une date **Expires** (vide signifie sans expiration)
6. Cliquez sur **Create key**
7. Copiez immédiatement la clé depuis le bandeau **API key created** : elle ne sera affichée qu'une seule fois

::: danger Important
Votre clé API n'est affichée qu'une seule fois, lors de sa création. Si vous la perdez, vous devrez en créer une nouvelle. Stockez-la en lieu sûr avant de fermer la boîte de dialogue.
:::

## Format des clés {#key-format}

Les nouvelles clés API créées dans la Console utilisent le préfixe `sk-` suivi de 64 caractères hexadécimaux :

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Les clés `sk-sb-...` existantes restent valides jusqu'à leur expiration ou leur révocation. N'utilisez pas le préfixe seul pour valider un
identifiant ; traitez toujours la valeur complète comme un secret opaque.

## Méthodes d'authentification {#authentication-methods}

SandBase propose deux façons de transmettre votre clé API dans les requêtes :

### En-tête Authorization (recommandé) {#authorization-header-recommended}

Utilisez l'en-tête standard `Authorization: Bearer`. Il est compatible avec les SDK d'OpenAI et d'Anthropic :

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages : en-tête x-api-key {#anthropic-messages-x-api-key-header}

`POST /v1/messages` accepte également l'en-tête natif d'Anthropic `x-api-key` :

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
Parmi les passerelles de modèles, seul `POST /v1/messages` lit `x-api-key`, et cet en-tête est prioritaire lorsque les deux en-têtes pris en charge
sont présents. Les [ressources de la plateforme Agents](/api-reference/authentication#agents-platform-resources) acceptent aussi
`X-API-Key`. Utilisez l'en-tête Bearer pour tous les autres endpoints publics.
:::

## Autorisations des clés {#key-permissions}

Les clés API SandBase sont limitées au **niveau de l'organisation** :

- Une clé standard créée dans la Console peut appeler les ressources d'API publiques disponibles pour l'organisation
- L'utilisation est facturée à l'organisation propriétaire de la clé
- Une clé peut avoir une date d'expiration et une limite de dépenses facultatives
- Les identifiants émis par SandBase, comme les clés CLI Login, peuvent avoir une portée restreinte et renvoient `403` en dehors de celle-ci

La Console ne permet pas actuellement de choisir des portées pour une clé standard. Les clés CLI Login sont créées lorsque vous connectez un outil d'IA. La page API Keys les regroupe dans une ligne dépliable **CLI Login**, et elles ne peuvent pas être modifiées comme les clés standard. Les clés que SandBase crée pour vous portent un badge **Auto-created** ; elles n'ont pas de limite au niveau de la clé et sont bornées par le solde du compte.

La liste des clés affiche **Name**, **Key Prefix**, **Spent**, **Limit**, **Expires** et **Status** pour chaque clé. Utilisez **Edit** pour modifier le nom, la limite de dépenses ou l'expiration d'une clé standard.

Considérez chaque clé comme un identifiant d'application plutôt que comme un mot de passe personnel. Utilisez l'appartenance à l'organisation pour l'accès humain et les clés API pour les charges de travail.

## Stratégie par environnement {#environment-strategy}

Créez une clé différente pour chaque application et chaque environnement :

| Clé | Exemple de nom | Pourquoi |
|---|---|---|
| Développement local | `research-app-dev` | Renouveler sans interrompre la production |
| Préproduction | `research-app-staging` | Isoler l'utilisation de test et les incidents |
| Production | `research-app-production` | Donner à la production un propriétaire clair et une exposition limitée |
| Automatisation temporaire | `release-check-2026-08` | Définir une expiration et révoquer indépendamment |

Notez le propriétaire et le déploiement qui utilisent chaque clé. Lors d'un renouvellement, déployez la nouvelle clé, vérifiez que les requêtes réussissent, et seulement ensuite révoquez l'ancienne.

## Expiration et révocation des clés {#key-expiration-and-revocation}

### Expiration {#expiration}

Lors de la création d'une clé, vous pouvez définir une date d'expiration. Une fois expirée, la clé cesse de fonctionner et les requêtes renvoient une erreur `401 Unauthorized`.

Les clés sans date d'expiration restent valides jusqu'à leur révocation manuelle.

### Révoquer une clé {#revoking-a-key}

Pour révoquer (désactiver) une clé :

1. Accédez à [Developer → API Keys](https://www.sandbase.ai/console/keys)
2. Trouvez la clé à révoquer
3. Cliquez sur **Revoke**
4. Confirmez l'action

Les clés révoquées ne peuvent plus authentifier de nouvelles requêtes. La révocation est irréversible : créez une nouvelle clé si vous en révoquez une par erreur.

## Bonnes pratiques de sécurité {#security-best-practices}

### Ne versionnez jamais vos clés {#never-commit-keys-to-version-control}

Utilisez plutôt des variables d'environnement ou un gestionnaire de secrets :

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### Utilisez des clés distinctes selon les environnements {#use-separate-keys-for-different-environments}

Créez des clés distinctes pour le développement, la préproduction et la production. Vous pourrez ainsi révoquer une clé de développement compromise sans affecter la production.

### Renouvelez régulièrement vos clés {#rotate-keys-regularly}

Créez périodiquement de nouvelles clés et retirez les anciennes. Cela limite la période d'exposition en cas de fuite d'une clé.

### Surveillez l'activité {#monitor-activity}

Consultez régulièrement **Developer → Activities** pour repérer des pics inattendus de requêtes ou d'utilisation, qui pourraient signaler une clé compromise. **Request History** permet de filtrer par clé API.

Si une clé est exposée, révoquez-la immédiatement, créez-en une de remplacement, mettez à jour l'application qui l'utilise et examinez Activities et la facturation pour détecter toute utilisation inattendue. N'attendez pas le prochain renouvellement planifié.

### Définissez des dates d'expiration {#set-expiration-dates}

Pour un accès temporaire (pipelines CI/CD, accès de prestataires, démos), définissez une date d'expiration afin que la clé cesse automatiquement de fonctionner.

## Dépannage {#troubleshooting}

| Erreur | Cause | Solution |
|-------|-------|-----|
| `401 - missing API key` | Aucune clé fournie dans la requête | Ajoutez un en-tête `Authorization: Bearer <key>` |
| `401 - invalid API key` | La clé n'existe pas | Vérifiez les fautes de frappe et assurez-vous d'inclure la clé complète |
| `401 - API key has been revoked` | La clé a été définitivement révoquée dans la Console | Créez une clé de remplacement |
| `401 - API key has expired` | La clé a dépassé sa date d'expiration | Créez une nouvelle clé ou prolongez l'expiration |
| `402 - API key spending limit exceeded` | La clé a atteint sa limite de dépenses configurée | Relevez la limite ou utilisez une autre clé autorisée |
| `403 - insufficient_scope` | Un identifiant à portée restreinte ne peut pas appeler cet endpoint | Utilisez une clé autorisée pour cet endpoint |

## Étapes suivantes {#next-steps}

- [**Premier appel d'API**](/getting-started/first-call) : effectuez un appel d'API détaillé avec une présentation complète de la requête et de la réponse
- [**Authentification**](/api-reference/authentication) : en-têtes pris en charge, cycle de vie et erreurs propres à chaque protocole
- [**Référence de l'API**](/api-reference/) : documentation complète des endpoints
