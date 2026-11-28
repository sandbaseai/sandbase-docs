---
i18nSource: 94e0cdfdd0239d6b
title: API Skills
description: Envoyez des archives de Skills versionnées et associez-les à des Agents.
---

# API Skills {#skills-api}

Une Skill est une archive ZIP versionnée d'instructions et de ressources qu'un Agent peut monter. Les ID de Skill utilisent le préfixe `skl_`, et les identifiants de version sont des chaînes comme `"1"`.

## Opérations sur les Skills {#skill-operations}

| Méthode | Chemin | Objet |
|---|---|---|
| `POST` | `/v1/skills` | [Créer une Skill](./create) à partir d'un envoi ZIP |
| `GET` | `/v1/skills` | [Lister les Skills](./list) |
| `GET` | `/v1/skills/{skill_id}` | [Obtenir une Skill](./get) |
| `POST` | `/v1/skills/{skill_id}` | [Mettre à jour](./update) la version par défaut, le statut ou les métadonnées |
| `DELETE` | `/v1/skills/{skill_id}` | [Supprimer une Skill](./delete) |
| `GET` | `/v1/skills/{skill_id}/content` | Télécharger le ZIP de la version par défaut |
| `GET` | `/v1/skills/{skill_id}/versions` | [Lister les versions](./versions) |
| `POST` | `/v1/skills/{skill_id}/versions` | [Envoyer une version](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}` | [Obtenir une version](./versions) |
| `GET` | `/v1/skills/{skill_id}/versions/{version}/content` | Télécharger le ZIP d'une version |
| `GET` | `/v1/skills/catalog` | [Parcourir les Skills publiques](./catalog) |

## Configuration en cinq minutes {#five-minute-setup}

1. Créez un dossier contenant un `SKILL.md` dont le frontmatter définit `name` et `description` :

   ```markdown
   ---
   name: release-notes
   description: Draft release notes from merged changes.
   ---
   Group changes by feature, fix, and breaking change. Keep each entry to one line.
   ```

2. Compressez-le (`zip -r release-notes.zip release-notes/`). L'archive ne doit pas dépasser 5 Mio.
3. Envoyez-le comme partie multipart unique `files` :

   ```bash
   curl -X POST https://api.sandbase.ai/v1/skills \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -F "files=@release-notes.zip;type=application/zip"
   ```

4. Référencez-le depuis un Agent avec [Mettre à jour un Agent](/api-reference/agents/update) :

   ```bash
   curl -X POST https://api.sandbase.ai/v1/agents/agt_8c1f2b9e-3d4a-4f6b-9c2e-1a7d5e3b4c60 \
     -H "Authorization: Bearer $SANDBASE_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"skills": [{"skill_id": "skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57", "version": null}]}'
   ```

Lors du premier rattachement d'une Skill, `"version": null` (ou un `version` omis) se résout en sa `default_version` actuelle au moment de l'enregistrement de l'Agent. L'Agent enregistré contient une version explicite. Modifier la version par défaut de la Skill ne met pas à niveau un Agent existant. Pour le mettre à niveau, mettez à jour son tableau `skills` avec une version explicite comme `"2"` ; envoyer `null` pour une liaison existante conserve la version épinglée. Chaque Session utilise la version enregistrée de l'Agent et indique les Skills résolues dans `environment.skills`.

Un Agent prend en charge jusqu'à 32 Skills. Les ID et les noms de Skill doivent être uniques dans sa sélection.

## Versions {#versions}

- Un envoi vers `POST /v1/skills/{skill_id}/versions` ajoute la version suivante. Envoyez le champ de formulaire `default=true` pour en faire la version par défaut.
- `POST /v1/skills/{skill_id}` avec `default_version` change la version par défaut sans nouvel envoi.
- `status` vaut `active` ou `disabled`. Les nouvelles Sessions d'un Agent qui référence une Skill désactivée échouent avec `400 skill_not_found` ; les Sessions qui ont déjà figé une version la conservent.
- Une Skill référencée par une version d'Agent ne peut pas être supprimée (409). Désactivez-la à la place. La retirer de la dernière version de l'Agent ne supprime pas les références dans les versions historiques.

## Pagination et erreurs {#pagination-and-errors}

Les listes utilisent la pagination par curseur avec `limit` de 0 à 100, `after` et `order`. Les erreurs utilisent l'[enveloppe d'erreur Agents](/api-reference/errors#agents-platform-errors).

## Télécharger une archive {#download-a-bundle}

Les endpoints de contenu renvoient `application/zip`, pas du JSON. Enregistrez la réponse dans un fichier :

```bash
curl --fail https://api.sandbase.ai/v1/skills/skl_3c5e7a9b-1d4f-5a6c-8e2b-4d6f8a0c2e57/versions/2/content \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  --output release-notes-v2.zip
```

Utilisez `/v1/skills/{skill_id}/content` pour la version par défaut actuelle. Pour les archives du catalogue public, utilisez `/v1/skills/catalog/{skill_id}/versions/{version}/content`.

Les listes de versions utilisent les mêmes paramètres de curseur que les listes de Skills. Passez le `last_id` renvoyé (par exemple `skl_…:2`) comme `after` ; ne passez pas le numéro de version seul.
