---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: Utiliser un Skill en local
description: Choisissez un Skill SandBase Lab, téléchargez son package, configurez l'accès aux modèles, puis créez et enregistrez un projet avec un agent local.
---

# Utiliser un Skill en local {#use-a-skill-locally}

Téléchargez un Skill SandBase et menez à bien un projet avec un agent sur votre ordinateur. Un Skill contient des instructions, des scripts et des exemples. L'agent suit le workflow décrit dans son `SKILL.md`.


## 1. Choisir un Skill {#_1-choose-a-skill}

1. Ouvrez [SandBase Lab](https://www.sandbase.ai/lab/).
2. Parcourez des exemples comme des vidéos, des animations et des cartes. Ouvrez un Skill qui correspond à votre projet.
3. Examinez l'exemple, les entrées requises, le format de sortie et les langues prises en charge.
4. Utilisez l'action de téléchargement du Skill pour enregistrer le package ZIP.

Pour un film cartographique sur l'histoire d'une ville, commencez par les exemples et les instructions de [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time).

## 2. Préparer un dossier de travail local {#_2-prepare-a-local-working-folder}

1. Créez un dossier de projet, par exemple `my-city-film`.
2. Extrayez-y l'intégralité du ZIP du Skill, en conservant les instructions, les scripts et les assets.
3. Ouvrez le projet dans votre agent local et accordez-lui l'accès à ses fichiers et aux commandes requises par le workflow.
4. Suivez les instructions d'installation de la page du Skill, ou demandez à l'agent de lire directement le `SKILL.md` extrait.

Un projet peut utiliser cette structure :

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

Utilisez les noms de fichiers et les emplacements de sortie précis exigés par le Skill.

## 3. Connecter SandBase {#_3-connect-sandbase}

Collez `set up https://www.sandbase.ai/SKILL.md` dans votre agent et approuvez la connexion dans le navigateur qu'il ouvre, ou exécutez `npx -y @sandbaseai/cli@latest connect` dans un terminal. Démarrez ensuite une nouvelle session d'agent pour que les outils SandBase se chargent. Les mêmes options se trouvent dans [Build → AI tools](https://www.sandbase.ai/console/setup) dans la Console.

Consultez [Connecter des outils d'IA](/setup/) pour le workflow de connexion complet.

Si les scripts du Skill nécessitent `SANDBASE_API_KEY` :

1. Ouvrez [API Keys](https://www.sandbase.ai/console/keys) et créez ou sélectionnez une clé pour le projet.
2. Configurez-la via les paramètres sécurisés de votre agent local ou l'environnement d'exécution des scripts.
3. Demandez à l'agent de vérifier que l'accès est configuré et de poursuivre le workflow du Skill.

Conservez la clé dans une configuration locale sécurisée. N'incluez que des informations sur le projet dans les livrables, les fichiers sources et les captures d'écran publiques. Consultez l'utilisation des modèles et votre solde dans [Billing](https://www.sandbase.ai/console/billing).

## 4. Fournir un brief {#_4-provide-a-brief}

Indiquez à l'agent le Skill à utiliser, ce qu'il doit créer, les exigences de sortie et votre budget. Adaptez cet exemple à votre projet :

```text
Read SKILL.md in the project's skill folder and follow its workflow.

Topic: the story of Shanghai's development.
Deliverables: a playable video, a cover image, and usage notes.
Language and duration: use the Skill's supported options and state the plan before starting.
Models: use suitable models through SandBase.
Budget: model calls may use up to [AMOUNT] USD; ask me before exceeding it.

Check inputs and dependencies, then execute the workflow. Save previews and final files
in outputs. When finished, provide file paths, a summary, and the models actually used.
```

L'agent lit les instructions, vérifie les dépendances, traite les entrées et génère ou effectue le rendu du projet. Ajoutez les assets demandés au même projet et poursuivez la tâche.

## 5. Suivre la progression et examiner le résultat {#_5-follow-progress-and-review-the-result}

La durée dépend du Skill, des modèles, des assets et de la longueur de la sortie. Les projets vidéo peuvent prendre de quelques dizaines de minutes à plusieurs heures. Laissez l'agent tourner et empêchez l'ordinateur de se mettre en veille.

Demandez où en est la progression dans la même conversation :

```text
Report the current step, files already saved, and the next step, then continue the task.
```

Ouvrez les chemins des fichiers livrés, vérifiez les visuels, l'audio, les sous-titres et le contenu, puis enregistrez les fichiers finaux.

## 6. Réviser le projet {#_6-revise-the-project}

Demandez des modifications précises dans la tâche d'origine et réutilisez les assets existants :

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

Si l'exécution est interrompue, conservez le dossier de travail et demandez à l'agent de reprendre à l'étape en cours.

## Étapes suivantes {#next-steps}

- [Participer à AI City Remix](/guides/skills/ai-city-remix)
- [Connecter votre agent](/setup/)
- [Configurer les clés API](/getting-started/api-keys)
