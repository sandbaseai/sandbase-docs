---
i18nSource: 31b3bd202f3dc24e
agentDoc: local-use-agent-en
title: Usar uma Skill localmente
description: Escolha uma Skill do SandBase Lab, baixe o pacote, configure o acesso aos modelos e crie e salve um projeto com um agente local.
---

# Usar uma Skill localmente {#use-a-skill-locally}

Baixe uma Skill do SandBase e conclua um projeto com um agente no seu computador. Uma Skill contém instruções, scripts e exemplos. O agente segue o fluxo de trabalho descrito no `SKILL.md` dela.


## 1. Escolha uma Skill {#_1-choose-a-skill}

1. Abra o [SandBase Lab](https://www.sandbase.ai/lab/).
2. Navegue por exemplos como vídeos, animações e mapas. Abra uma Skill que combine com seu projeto.
3. Revise o exemplo, os inputs necessários, o formato de saída e os idiomas suportados.
4. Use a ação de download da Skill para salvar o pacote ZIP.

Para um filme de mapa sobre a história de uma cidade, comece pelos exemplos e instruções de [City Through Time](https://www.sandbase.ai/lab/skills/city-through-time).

## 2. Prepare uma pasta de trabalho local {#_2-prepare-a-local-working-folder}

1. Crie uma pasta de projeto, como `my-city-film`.
2. Extraia o ZIP completo da Skill nela, mantendo as instruções, os scripts e os assets.
3. Abra o projeto no seu agente local e conceda acesso aos arquivos dele e aos comandos exigidos pelo fluxo de trabalho.
4. Siga as instruções de instalação da página da Skill ou peça ao agente para ler diretamente o `SKILL.md` extraído.

Um projeto pode usar esta estrutura:

```text
my-city-film/
  skill/          # Complete extracted Skill package
  inputs/         # Images, text, and other inputs
  outputs/        # Previews and deliverables
```

Use os nomes de arquivo e os locais de saída específicos exigidos pela Skill.

## 3. Conecte o SandBase {#_3-connect-sandbase}

Cole `set up https://www.sandbase.ai/SKILL.md` no seu agente e aprove o login no navegador que ele abrir, ou execute `npx -y @sandbaseai/cli@latest connect` em um terminal. Depois, inicie uma nova sessão do agente para que as ferramentas do SandBase sejam carregadas. As mesmas opções estão em [Build → AI tools](https://www.sandbase.ai/console/setup) no Console.

Consulte [Conectar ferramentas de IA](/setup/) para ver o fluxo de conexão completo.

Se os scripts da Skill exigirem `SANDBASE_API_KEY`:

1. Abra [API Keys](https://www.sandbase.ai/console/keys) e crie ou selecione uma chave para o projeto.
2. Configure-a pelas configurações seguras do seu agente local ou pelo ambiente de execução dos scripts.
3. Peça ao agente para verificar se o acesso está configurado e continuar o fluxo de trabalho da Skill.

Mantenha a chave em uma configuração local segura. Inclua apenas informações do projeto nas entregas, nos arquivos de código-fonte e em capturas de tela públicas. Veja o uso de modelos e seu saldo em [Billing](https://www.sandbase.ai/console/billing).

## 4. Forneça um briefing {#_4-provide-a-brief}

Diga ao agente qual Skill usar, o que criar, os requisitos de saída e seu orçamento. Adapte este exemplo ao seu projeto:

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

O agente lê as instruções, verifica as dependências, processa os inputs e gera ou renderiza o projeto. Adicione ao mesmo projeto os assets solicitados e continue a tarefa.

## 5. Acompanhe o progresso e revise o resultado {#_5-follow-progress-and-review-the-result}

A duração depende da Skill, dos modelos, dos assets e da duração da saída. Projetos de vídeo podem levar de dezenas de minutos a várias horas. Mantenha o agente em execução e o computador ativo.

Peça atualizações de progresso na mesma conversa:

```text
Report the current step, files already saved, and the next step, then continue the task.
```

Abra os caminhos dos arquivos entregues, revise o visual, o áudio, as legendas e o conteúdo e salve os arquivos finais.

## 6. Revise o projeto {#_6-revise-the-project}

Solicite alterações específicas na tarefa original e reutilize os assets existentes:

```text
Keep the structure and other shots. Shorten the opening and correct the caption at 00:18.
Reuse existing assets and save the revised result as a new version.
```

Se a execução for interrompida, mantenha a pasta de trabalho e peça ao agente para continuar a partir da etapa atual.

## Próximos passos {#next-steps}

- [Participe do AI City Remix](/guides/skills/ai-city-remix)
- [Conecte seu agente](/setup/)
- [Configure API keys](/getting-started/api-keys)

