---
i18nSource: ff1347dede49419a
agentDoc: ai-city-remix-agent-en
title: Participer à AI City Remix
description: Récupérez les crédits AI City Remix, choisissez une ville et un Skill, créez une vidéo avec votre agent local et téléversez-la pour validation.
---

# Participer à AI City Remix {#enter-ai-city-remix}

Choisissez un Skill et une ville sur la page de l'événement, puis transmettez les instructions complètes à votre agent local. Une fois la création terminée, l'agent téléverse la vidéo, la couverture et les informations de participation, puis les soumet pour validation.


## Prérequis {#prerequisites}

- Un compte SandBase.
- Un agent local capable d'exécuter des commandes et d'accéder aux fichiers.
- Un dossier de travail pour la vidéo, la couverture et les fichiers du projet.

Pour votre première configuration locale, suivez [Utiliser un Skill en local](/guides/skills/local-use).

## 1. Ouvrir l'événement et récupérer les crédits {#_1-open-the-event-and-claim-credits}

1. Ouvrez [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en) et lisez le [règlement de l'événement](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en) en vigueur.
2. Cliquez sur « Claim $5 free & create » et connectez-vous lorsque cela vous est demandé.
3. Le système récupère les crédits de l'événement et tente de les utiliser automatiquement. Vérifiez le solde et l'état de l'utilisation des crédits ; utilisez l'action d'utilisation si une nouvelle tentative est nécessaire.
4. Une fois les crédits récupérés, cliquez sur « Create now » pour ouvrir la boîte de dialogue de création.

Les dates de récupération, la disponibilité et les conditions d'éligibilité sont indiquées sur la page de l'événement. Les appels aux modèles consomment des crédits selon l'utilisation réelle ; consultez-les dans [Billing](https://www.sandbase.ai/console/billing).

## 2. Configurer une clé API de modèle {#_2-configure-a-model-api-key}

Si votre compte n'a aucune clé API utilisable, le parcours affiche une boîte de dialogue « Create an API key ».

1. Vérifiez le plafond de dépenses et la date d'expiration affichés, puis cliquez sur « Create API key ».
2. Cliquez sur « Create with this key ». La nouvelle clé est incluse dans les instructions complètes transmises à l'agent.
3. Envoyez les instructions complètes à un agent de confiance et conservez-les dans un espace de travail privé.

Pour une clé existante, configurez `SANDBASE_API_KEY` via les paramètres sécurisés ou l'environnement d'exécution de votre agent local. Gérez vos clés dans [API Keys](https://www.sandbase.ai/console/keys).

## 3. Choisir un Skill et un brief {#_3-choose-a-skill-and-brief}

La boîte de dialogue s'ouvre avec un Skill officiel, une ville, une histoire et une direction créative déjà sélectionnés.

- Dépliez « Official Skill » pour lire le résumé et les détails, puis choisissez une approche visuelle.
- Dépliez « Creative brief » pour rechercher une ville ou sélectionner un lieu sur la carte.
- Mélangez les suggestions ou modifiez directement l'histoire et la direction créative.
- Confirmez le lieu sur la carte, la langue prise en charge et le style de sortie.

Utilisez des sources vérifiables pour l'histoire, les personnes et les événements. Consultez les détails du Skill sélectionné pour connaître les langues et durées prises en charge.

## 4. Copier les instructions et lancer la création {#_4-copy-the-instructions-and-create}

1. Cliquez sur « Copy all » dans la zone du prompt.
2. Ouvrez le dossier du projet dans votre agent local, démarrez une tâche et collez les instructions complètes.
3. Envoyez-les, fournissez les éléments demandés, configurez les dépendances et lancez la création.

Les instructions contiennent le Skill sélectionné, le brief créatif, le format des métadonnées de participation et l'autorisation de téléversement. Transmettez-les en entier pour que l'agent puisse créer et soumettre l'œuvre.

« Preparing » signifie que l'accès au téléversement est en cours de préparation. Utilisez « Retry » pour relancer la préparation, ou « Complete brief » pour compléter les informations manquantes.

## 5. Suivre la progression de la création {#_5-follow-creation-progress}

La création peut prendre de quelques dizaines de minutes à plusieurs heures, selon le Skill, les modèles et la durée de la vidéo, et consomme des crédits de modèles. Laissez l'agent tourner et empêchez l'ordinateur de se mettre en veille.

Ajoutez des instructions de budget et de suivi dans la même tâche :

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

Utilisez MiniMax M3.1 Flash via SandBase, comme l'exige le règlement actuel de l'événement. Respectez les exigences de la page de l'événement et de la page de téléversement concernant la durée, la résolution, les sous-titres et la taille des fichiers.

## 6. Soumettre et suivre la validation {#_6-submit-and-check-review-status}

L'agent suit les instructions complètes pour utiliser le client de téléversement officiel, téléverser la vidéo, la couverture et les métadonnées, puis soumettre pour validation.

Ouvrez [My entries](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en) pour suivre l'avancement :

| Statut | Étape suivante |
|---|---|
| Draft | Terminez le film, téléversez les fichiers et soumettez-les pour validation. |
| Pending review | Suivez l'état de la validation. |
| Approved | Ouvrez la page publique de la participation et partagez-la. |
| Changes requested | Apportez les modifications indiquées dans la note de validation et soumettez de nouveau. |

Pour un film existant, sélectionnez « Upload existing video » sur la page de l'événement, renseignez les informations, téléversez la vidéo et la couverture, puis soumettez pour validation.

## 7. Reprendre un téléversement {#_7-resume-an-upload}

Si l'autorisation expire ou qu'un téléversement est interrompu, poursuivez avec les fichiers d'origine :

1. Conservez la vidéo, la couverture, `entry.json` et le dossier de travail.
2. Retrouvez le même brouillon dans My entries et cliquez sur « Resume upload ».
3. Copiez les nouvelles instructions de reprise dans la tâche d'origine de l'agent.
4. Demandez à l'agent de téléverser et de soumettre les fichiers existants, puis vérifiez le statut dans My entries.

## 8. Partager votre participation {#_8-share-your-entry}

Sur la page d'une participation approuvée, cliquez sur « Share on X » pour ouvrir un éditeur prérempli. Il inclut le lien de la participation, `#AICityRemix`, `@SandbaseAI` et la publication officielle de l'événement.

Pour publier un post vidéo, cliquez d'abord sur « Download video », ajoutez le fichier dans l'éditeur de X, relisez le texte et publiez.

## Documentation associée {#related-documentation}

- [Utiliser un Skill en local](/guides/skills/local-use)
- [Connecter votre agent](/setup/)
- [Configurer les clés API](/getting-started/api-keys)
