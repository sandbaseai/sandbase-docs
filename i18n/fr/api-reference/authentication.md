---
i18nSource: 5b94f91222d138de
title: Authentification de l'API
description: Authentifiez-vous auprès des API SandBase avec des jetons Bearer et les en-têtes de clé API compatibles avec les protocoles pris en charge.
---

# Authentification {#authentication}

SandBase utilise des clés API pour authentifier les requêtes de l'API publique. Cette page présente les méthodes d'intégration prises en charge et
les bonnes pratiques de gestion des clés. L'authentification de la Console et ses API internes ne font pas partie du contrat de l'API publique.

## Méthodes d'authentification {#authentication-methods}

Les endpoints SandBase standard `/v1/*` exigent un jeton Bearer. Les opérations Anthropic Messages et celles compatibles Google Gemini acceptent également les emplacements de clé API natifs de leurs SDK.

### Jeton Bearer {#bearer-token}

Incluez la clé dans l'en-tête `Authorization` :

```http
Authorization: Bearer sk-your-api-key
```

C'est la méthode standard utilisée par les SDK compatibles OpenAI.

### Anthropic Messages : en-tête x-api-key {#anthropic-messages-x-api-key-header}

Incluez la clé dans l'en-tête `x-api-key` :

```http
x-api-key: sk-your-api-key
```

Cet en-tête n'est pris en charge que par `POST /v1/messages`. Les autres endpoints publics ne le lisent pas ; utilisez l'authentification
Bearer pour Chat Completions, `/v1/run` et les API de ressources.

### Priorité {#priority}

Pour `POST /v1/messages` uniquement, `x-api-key` est prioritaire lorsque les deux en-têtes sont présents.

### Clés API compatibles Google Gemini {#google-gemini-compatible-api-keys}

Les opérations Gemini GenerateContent et Interactions acceptent `x-goog-api-key`, `Authorization: Bearer …` ou le paramètre de requête `key`, dans cet ordre de priorité. Préférez un en-tête, car les identifiants placés dans la query string peuvent apparaître dans les journaux et l'historique du navigateur. Consultez [Google Gemini](/api-reference/gemini-generate-content) et [Gemini Interactions](/api-reference/gemini-interactions) pour les chemins pris en charge.

### Logique d'extraction {#extraction-logic}

Les endpoints standard lisent uniquement `Authorization: Bearer <key>`. Le middleware Anthropic Messages lit d'abord `x-api-key`,
puis se rabat sur l'en-tête Bearer. Les ressources de la plateforme Agents acceptent `Authorization: Bearer` ou
`X-API-Key` (voir ci-dessous). L'[API Events des webhooks](/api-reference/webhooks) (`/events/webhooks*`) accepte aussi l'un ou l'autre
en-tête et utilise l'en-tête Bearer lorsque les deux sont présents. L'absence d'identifiant pris en charge renvoie `401 Unauthorized`.

### Ressources de la plateforme Agents {#agents-platform-resources}

`/v1/agents*` (y compris `/v1/agents/sessions*`), `/v1/mcp-connections*`, `/v1/secrets*`
et `/v1/skills*` acceptent la clé dans l'un ou l'autre en-tête :

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- Si `Authorization: Bearer` et `X-API-Key` sont tous deux envoyés, ils doivent contenir la même clé ; des valeurs différentes renvoient `401 unauthorized`. Répéter l'un de ces en-têtes renvoie également 401.
- `OpenAI-Beta` est facultatif. S'il est présent, il doit valoir `agents=v1`.
- Les requêtes de lecture exigent la permission `agents.read` et les écritures `agents.write`. Les clés standard créées dans la Console disposent des deux. Les clés à périmètre restreint émises par SandBase, comme les clés CLI Login, renvoient `403 insufficient_scope`.
- `402 spending_limit_exceeded` signifie que la limite de dépenses de la clé ou le solde de l'organisation est épuisé.
- Les échecs utilisent l'[enveloppe d'erreur des Agents](/api-reference/errors#agents-platform-errors), et non la forme plate `{"error": "…"}` présentée plus bas.

## Format des clés API {#api-key-format}

Les nouvelles clés API créées dans la Console ont ce format :

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Composant | Description |
|-----------|-------------|
| `sk-` | Préfixe standard de « clé secrète » |
| `xxxx...` | 64 caractères hexadécimaux générés à partir de 32 octets aléatoires |

Les anciennes clés `sk-sb-...` restent utilisables jusqu'à leur expiration ou leur révocation. Les clients doivent traiter les clés comme des chaînes opaques
plutôt que de rejeter un identifiant en fonction de son préfixe ou de sa longueur.

::: warning
N'exposez jamais votre clé API dans du code côté client, des dépôts publics ou des journaux. Traitez-la comme un mot de passe.
:::

## Créer des clés API {#create-api-keys}

### Depuis la Console {#via-console}

1. Connectez-vous à la [Console SandBase](https://www.sandbase.ai/console)
2. Ouvrez **Developer → API Keys**
3. Cliquez sur **New key**
4. Donnez à la clé un nom descriptif (par exemple « Production Backend », « Development »)
5. Copiez la clé immédiatement : elle ne sera plus affichée

### Propriétés d'une clé {#key-properties}

| Propriété | Description |
|----------|-------------|
| Name | Libellé lisible permettant de l'identifier |
| Organization | L'organisation à laquelle appartient la clé |
| Enabled | Indique si la clé est active |
| Spending Limit | Plafond de dépenses facultatif par clé |
| Expires At | Date d'expiration facultative |
| Created At | Date de création de la clé |

Les clés standard créées dans la Console disposent d'un accès au niveau de l'organisation à l'API publique documentée. Les identifiants émis par SandBase, comme les clés CLI Login, peuvent avoir un périmètre restreint. La Console ne propose pas de choisir des périmètres pour les clés standard.

## Cycle de vie des clés {#key-lifecycle}

### Renouvellement {#rotation}

Pour renouveler une clé :

1. Créez une nouvelle clé dans la Console
2. Mettez à jour votre application pour utiliser la nouvelle clé
3. Vérifiez que la nouvelle clé fonctionne en production
4. Révoquez l'ancienne clé

::: tip
Créez toujours la nouvelle clé avant de révoquer l'ancienne pour éviter toute interruption de service.
:::

### Révocation {#revocation}

Les clés révoquées ne peuvent plus authentifier de nouvelles requêtes. L'API renvoie `401 Unauthorized` avec le message :

```json
{"error":"API key has been revoked"}
```

### Expiration {#expiration}

Les clés peuvent avoir une date d'expiration facultative. Les clés expirées renvoient `401 Unauthorized` avec le message :

```json
{"error":"API key has expired"}
```

## Exigences d'authentification par endpoint {#endpoint-authentication-requirements}

| Endpoint | Méthode d'authentification | Description |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | Clé API (Bearer) | Chat Completions |
| `POST /v1/responses` | Clé API (Bearer) | API Responses compatible OpenAI |
| `POST /v1/messages` | Clé API (Bearer ou x-api-key) | Anthropic Messages |
| `/v1beta/models/*` | Clé API (x-goog-api-key, Bearer ou paramètre key) | Gemini GenerateContent |
| `/v1beta/interactions*` | Clé API (x-goog-api-key, Bearer ou paramètre key) | Gemini Interactions |
| `/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*` | Clé API (Bearer ou X-API-Key) | Ressources de la plateforme Agents |

La Console SandBase utilise un flux d'authentification navigateur distinct. Ses requêtes internes ne sont pas des endpoints publics
pris en charge et ne doivent pas être utilisées par les intégrations.

## Isolation par organisation {#organization-isolation}

Les clés API sont rattachées à une organisation. Lorsque vous vous authentifiez avec une clé :

- Vous ne pouvez accéder qu'aux ressources de votre organisation
- L'utilisation et la facturation sont suivies par organisation

## Réponses d'erreur {#error-responses}

| Statut HTTP | Message | Cause |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | Aucune clé fournie |
| 401 | `invalid API key` | Clé introuvable dans la base de données |
| 401 | `API key has been revoked` | La clé a été désactivée |
| 401 | `API key has expired` | La clé a dépassé sa date d'expiration |
| 402 ou 403 propre au protocole | `API key spending limit exceeded` | Limite de dépenses de la clé atteinte ; consultez le contrat d'erreur documenté de l'endpoint |
| 403 | `API key is not authorized for this endpoint` | Clé à périmètre restreint utilisée sur un endpoint hors de son périmètre |

Ces messages arrivent dans le corps plat `{"error":"<message>"}`, sauf les erreurs de périmètre `403`. Sur les endpoints de modèles et de
compte, celles-ci utilisent `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}` ;
sur les ressources de la plateforme Agents, elles utilisent l'[enveloppe d'erreur des Agents](/api-reference/errors#agents-platform-errors) avec
le `code` `insufficient_scope`.

## Bonnes pratiques de sécurité {#security-best-practices}

### À faire {#do}

- **Stockez les clés dans des variables d'environnement** : ne codez jamais de clés en dur dans le code source
- **Utilisez des clés distinctes par environnement** : des clés différentes pour le développement, la préproduction et la production
- **Définissez des dates d'expiration** : choisissez un intervalle de renouvellement adapté à votre politique de sécurité
- **Surveillez l'utilisation** : vérifiez dans la Console toute activité inattendue
- **Réservez les clés standard aux charges de travail qui ont besoin de l'API publique** : laissez les identifiants CLI Login à périmètre restreint dans leur flux géré

### À éviter {#don-t}

- **Ne commitez pas de clés dans le contrôle de version** : ajoutez `.env` à `.gitignore`
- **Ne partagez pas une même clé entre des applications sans rapport** : des clés distinctes rendent le renouvellement et la réponse aux incidents plus sûrs
- **N'exposez pas de clés dans du code côté client** : passez toujours par votre backend
- **Ne journalisez pas les clés API** : masquez-les dans les journaux de l'application

### Exemple de variable d'environnement {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## Limitation de débit par clé {#rate-limiting-by-key}

Les limites de requêtes sont attribuées par organisation et partagées par toutes ses clés API : créer davantage de clés n'augmente donc pas
la limite. L'API ne publie pas de valeur numérique par défaut universelle
ni d'en-têtes de quota restant.

Consultez [Limitation de débit](/guides/rate-limiting) pour en savoir plus sur les limites et la gestion des réponses 429.
