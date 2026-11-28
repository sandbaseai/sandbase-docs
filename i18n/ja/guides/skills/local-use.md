---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: Skill をローカルで使う
description: SandBase Lab の Skill を選んでパッケージをダウンロードし、モデルへのアクセスを設定して、ローカルエージェントでプロジェクトを作成・保存します。
---

# Skill をローカルで使う {#use-a-skill-locally}

SandBase の Skill をダウンロードし、自分のコンピューター上のエージェントでプロジェクトを完成させます。Skill には指示、スクリプト、サンプルが含まれています。エージェントは `SKILL.md` に記述されたワークフローに従います。


## 1. Skill を選ぶ {#_1-choose-a-skill}

1. [SandBase Lab](https://www.sandbase.ai/lab/) を開きます。
2. 動画、アニメーション、地図などのサンプルを見て、プロジェクトに合う Skill を開きます。
3. サンプル、必要な入力、出力形式、対応言語を確認します。
4. Skill のダウンロード操作で ZIP パッケージを保存します。

都市の歴史を描く地図映像を作る場合は、[City Through Time](https://www.sandbase.ai/lab/skills/city-through-time) のサンプルと指示から始めてください。

## 2. ローカルの作業フォルダーを準備する {#_2-prepare-a-local-working-folder}

1. `my-city-film` などのプロジェクトフォルダーを作成します。
2. Skill の ZIP 全体をそのフォルダーに展開し、指示、スクリプト、アセットをそのまま残します。
3. ローカルエージェントでプロジェクトを開き、ファイルとワークフローに必要なコマンドへのアクセスを許可します。
4. Skill ページのインストール手順に従うか、展開した `SKILL.md` を直接読むようにエージェントに依頼します。

プロジェクトは次のような構成にできます。

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

ファイル名と出力先は、Skill が指定するものを使用してください。

## 3. SandBase を接続する {#_3-connect-sandbase}

エージェントに `set up https://www.sandbase.ai/SKILL.md` を貼り付けて、開いたブラウザのサインインを承認するか、ターミナルで `npx -y @sandbaseai/cli@latest connect` を実行します。その後、SandBase のツールが読み込まれるように新しいエージェントセッションを開始します。同じオプションは Console の [Build → AI tools](https://www.sandbase.ai/console/setup) にもあります。

接続の手順全体については [AI ツールを接続する](/setup/) を参照してください。

Skill のスクリプトで `SANDBASE_API_KEY` が必要な場合：

1. [API Keys](https://www.sandbase.ai/console/keys) を開き、プロジェクト用のキーを作成または選択します。
2. ローカルエージェントの安全な設定、またはスクリプトの実行環境でキーを設定します。
3. アクセスが設定されていることを確認して Skill のワークフローを続けるよう、エージェントに依頼します。

キーは安全なローカル設定に保管してください。成果物、ソースファイル、公開するスクリーンショットにはプロジェクトの情報だけを含めてください。モデルの使用量と残高は [Billing](https://www.sandbase.ai/console/billing) で確認できます。

## 4. 指示を伝える {#_4-provide-a-brief}

使用する Skill、作成するもの、出力の要件、予算をエージェントに伝えます。次の例をプロジェクトに合わせて調整してください。

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

エージェントは指示を読み、依存関係を確認し、入力を処理して、プロジェクトを生成またはレンダリングします。求められたアセットを同じプロジェクトに追加し、タスクを続けてください。

## 5. 進行状況を追い、結果を確認する {#_5-follow-progress-and-review-the-result}

所要時間は Skill、モデル、アセット、出力の長さによって異なります。動画プロジェクトには数十分から数時間かかることがあります。エージェントを実行したままにし、コンピューターがスリープしないようにしてください。

同じ会話で進行状況を尋ねます。

```text
Report the current step, files already saved, and the next step, then continue the task.
```

納品されたファイルのパスを開き、映像、音声、字幕、内容を確認して、最終ファイルを保存します。

## 6. プロジェクトを修正する {#_6-revise-the-project}

元のタスクで具体的な変更を依頼し、既存のアセットを再利用します。

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

実行が中断された場合は、作業フォルダーを残したまま、現在のステップから続けるようエージェントに依頼してください。

## 次のステップ {#next-steps}

- [AI City Remix に参加する](/guides/skills/ai-city-remix)
- [エージェントを接続する](/setup/)
- [API キーを設定する](/getting-started/api-keys)
