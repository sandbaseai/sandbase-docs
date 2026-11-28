---
i18nSource: 417ea5dc930a8786
title: Skills et outils MCP
description: Dotez un Agent SandBase de Skills réutilisables et d'outils MCP distants, et contrôlez les versions et les outils utilisés par chaque Session.
---

# Skills et outils MCP {#skills-and-mcp-tools}

Un Agent obtient des capacités de deux façons :

- Les **Skills** apprennent à l'Agent comment accomplir une tâche. Un Skill est un bundle ZIP versionné d'instructions et de ressources.
- Les **connexions MCP** permettent à l'Agent d'appeler des outils sur un serveur MCP distant via HTTPS, avec une authentification facultative par [Secret](/agents/api-credentials).

La plupart des Agents utiles combinent les deux : un serveur MCP récupère des données ou effectue des actions, et un Skill décrit comment exploiter les résultats.

## Skills {#skills}

1. Préparez un dossier contenant un `SKILL.md` avec un frontmatter `name` et `description`, puis compressez le dossier lui-même (`zip -r release-notes.zip release-notes/`, 5 MiB au maximum). Ce dossier doit se trouver au premier niveau du ZIP ; un `SKILL.md` à la racine du ZIP renvoie `400 invalid_request`.
2. Téléversez-le avec `POST /v1/skills` dans le champ multipart `files`. La réponse contient un ID `skl_` et `default_version: "1"`.
3. Référencez-le dans le tableau `skills` de l'Agent.

```json
{
  "skills": [
    { "skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null }
  ]
}
```

- Lors du premier rattachement, `"version": null` se résout en la `default_version` actuelle du Skill au moment de l'enregistrement de l'Agent. Une chaîne comme `"2"` sélectionne explicitement cette version.
- L'Agent enregistré fige la version. Changer la version par défaut du Skill ne met à niveau ni les Agents existants ni leurs nouvelles Sessions. Mettez à jour l'Agent avec une version explicite pour effectuer la mise à niveau ; envoyer `null` pour une liaison existante conserve sa version figée.
- Téléversez une nouvelle version avec `POST /v1/skills/{skill_id}/versions`, et changez la version par défaut avec `default=true` ou `POST /v1/skills/{skill_id}`.
- Un Skill désactivé fait échouer les nouvelles Sessions des Agents qui le référencent avec `400 skill_not_found`.

Vous pouvez aussi parcourir les Skills publics dans le [catalogue de Skills](/api-reference/skills/catalog). Consultez l'[API Skills](/api-reference/skills/) pour la procédure complète.

## Outils SandBase intégrés {#built-in-sandbase-tools}

Chaque nouvel Agent peut utiliser les outils propres à SandBase, sans aucune configuration. Avec `sandbase_discover`, `sandbase_inspect` et `sandbase_run`, l'Agent trouve un modèle ou une API dans le catalogue, lit son schéma et son prix, puis l'appelle avec votre clé. Si vous omettez `mcp_connections` à la création, l'Agent reçoit cette valeur par défaut :

```json
{
  "mcp_connections": [
    {
      "connection_id": "builtin:sandbase",
      "server_label": "sandbase_builtin",
      "allowed_tools": null,
      "required": true
    }
  ]
}
```

- **La liste que vous envoyez remplace la valeur par défaut.** Pour ajouter votre propre serveur MCP tout en conservant les outils SandBase, incluez l'entrée intégrée dans votre liste.
- **`builtin:sandbase` exige `server_label: "sandbase_builtin"`.** Tout autre label, ou ce label sur une autre connexion, renvoie `400`.
- **Pour créer un Agent sans outils,** envoyez `"mcp_connections": []`.
- **Les outils intégrés sont gratuits.** Vous ne payez que les modèles et les API que l'Agent appelle par leur intermédiaire.

## Connexions MCP {#mcp-connections}

1. Si le serveur MCP exige un jeton Bearer, [créez un Secret](/agents/api-credentials) pour son URL exacte.
2. Enregistrez le serveur avec `POST /v1/mcp-connections` :

   ```bash
   curl -X POST https://api.sandbase.ai/v1/mcp-connections \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Idempotency-Key: github-mcp" \
     -H "Content-Type: application/json" \
     -d '{"name": "GitHub", "server_url": "https://mcp.example.com/github", "secret_id": "sec_9b1d3f5a-7c9e-5b2d-8f4a-6c8e0a2d4f61"}'
   ```

3. Référencez la connexion dans le tableau `mcp_connections` de l'Agent :

   ```json
   {
     "mcp_connections": [
       {
         "connection_id": "mcp_1f3d5b7a-9c2e-5f4a-8b6d-0e2c4a6f8b13",
         "server_label": "github",
         "allowed_tools": ["search_issues", "get_issue"],
         "required": true
       }
     ]
   }
   ```

| Champ | Signification |
|---|---|
| `connection_id` | ID de connexion `mcp_` dans votre organisation, ou `builtin:sandbase` pour le serveur SandBase intégré |
| `server_label` | Commence par une lettre ; lettres, chiffres, `_` et `-` ; 64 caractères au maximum ; unique dans l'Agent |
| `allowed_tools` | Omis ou `null` autorise tous les outils proposés par le serveur ; `[]` n'en autorise aucun ; une liste n'autorise que ces noms (256 noms au maximum, chacun non vide et de 128 octets au plus) |
| `required` | Indique si la Session doit obligatoirement charger ce serveur |

Un Agent peut référencer jusqu'à 32 connexions. Les connexions de l'organisation doivent être `active` au démarrage d'une Session.

### Outils SandBase intégrés {#built-in-sandbase-tools-1}

Créer un Agent sans `mcp_connections` sélectionne le serveur SandBase intégré. Pour le conserver explicitement à côté de votre propre serveur, incluez cette entrée dans le tableau :

```json
{
  "connection_id": "builtin:sandbase",
  "server_label": "sandbase_builtin",
  "allowed_tools": null,
  "required": true
}
```

Un tableau explicite remplace toute la sélection ; l'exemple ci-dessus, limité à un serveur personnalisé, exclut le serveur intégré. Envoyez `[]` pour désactiver tous les outils MCP. Omettre le champ lors d'une mise à jour de l'Agent conserve la sélection existante ; `null` renvoie `400`. L'entrée intégrée ne nécessite pas de créer une connexion MCP ni un Secret. N'envoyez pas le champ obsolète `use_sandbase_mcp`.

::: info Différence avec OpenAI
L'API Agents d'OpenAI déclare les serveurs MCP inline sous la forme `tools: [{"type": "mcp", ...}]`. SandBase renvoie `400` pour cette forme : enregistrez le serveur comme ressource de connexion et référencez-le dans `mcp_connections`. Le SDK OpenAI n'a pas de méthodes pour `/v1/mcp-connections` ni `/v1/secrets` ; appelez-les donc avec `client.post(...)` et passez `mcp_connections` via `extra_body` (Python) ou le corps de la requête (Node.js). Consultez [Compatibilité OpenAI](/agents/openai-compatibility#mcp-connections-with-the-sdk).
:::

## Modifications et Sessions en cours {#changes-and-running-sessions}

Chaque Session fige, à son démarrage, sa version d'Agent, ses versions de Skills et la configuration de ses connexions MCP.

- Après le remplacement d'une connexion ou la rotation de son Secret, les nouvelles Sessions utilisent la nouvelle configuration ; les Sessions existantes conservent leur instantané.
- Désactiver une connexion ou révoquer son Secret bloque les nouvelles Sessions et refuse toute nouvelle entrée dans les Sessions existantes qui l'utilisent. Un appel d'outil déjà en cours n'est pas interrompu.

## Gardez les jetons hors des prompts {#keep-tokens-out-of-prompts}

Stockez les jetons sous forme de Secrets. Ne les placez pas dans les instructions, les entrées de Session, les métadonnées ou les bundles de Skills : toute personne ayant accès à l'Agent ou à la Session peut les lire.

## Étapes suivantes {#next-steps}

- [Identifiants pour les outils MCP](/agents/api-credentials)
- [API MCP Connections](/api-reference/mcp-connections/)
- [API Skills](/api-reference/skills/)
- [Définir un Agent](/agents/agent-api)
