---
i18nSource: ff1347dede49419a
agentDoc: ai-city-remix-agent-en
title: Participe do AI City Remix
description: Resgate os créditos do AI City Remix, escolha uma cidade e uma Skill, crie um vídeo com seu agente local e envie-o para revisão.
---

# Participe do AI City Remix {#enter-ai-city-remix}

Escolha uma Skill e uma cidade na página do evento e, em seguida, entregue as instruções completas ao seu agente local. Depois da criação, o agente envia o vídeo, a capa e os detalhes da participação e os submete para revisão.


## Pré-requisitos {#prerequisites}

- Uma conta no SandBase.
- Um agente local com execução de comandos e acesso a arquivos.
- Uma pasta de trabalho para o vídeo, a capa e os arquivos do projeto.

Para a sua primeira configuração local, siga [Usar uma Skill localmente](/guides/skills/local-use).

## 1. Abra o evento e resgate os créditos {#_1-open-the-event-and-claim-credits}

1. Abra o [AI City Remix](https://www.sandbase.ai/lab/event/aicityremix?lang=en) e leia as [regras do evento](https://www.sandbase.ai/lab/event/aicityremix?tab=rules&lang=en) atuais.
2. Clique em “Claim $5 free & create” e faça login quando solicitado.
3. O sistema resgata os créditos do evento e tenta aplicá-los automaticamente. Verifique o saldo e o status do resgate; use a ação de resgate se for preciso tentar novamente.
4. Depois de resgatar, clique em “Create now” para abrir a caixa de diálogo de criação.

As datas de resgate, a disponibilidade e os critérios de elegibilidade aparecem na página do evento. As chamadas de modelos consomem créditos conforme o uso real; acompanhe-os em [Billing](https://www.sandbase.ai/console/billing).

## 2. Configure uma chave de API de modelos {#_2-configure-a-model-api-key}

Se a sua conta não tiver uma chave de API utilizável, o fluxo mostra a caixa de diálogo “Create an API key”.

1. Revise o limite de gastos e a validade exibidos e clique em “Create API key”.
2. Clique em “Create with this key”. A nova chave é incluída nas instruções completas entregues ao agente.
3. Envie as instruções completas a um agente de sua confiança e mantenha-as em um workspace privado.

Para uma chave existente, configure `SANDBASE_API_KEY` nas configurações seguras ou no ambiente de execução do seu agente local. Gerencie as chaves em [API Keys](https://www.sandbase.ai/console/keys).

## 3. Escolha uma Skill e um briefing {#_3-choose-a-skill-and-brief}

A caixa de diálogo começa com uma Skill oficial, uma cidade, uma história e uma direção criativa já selecionadas.

- Expanda “Official Skill” para ler o resumo e os detalhes e escolher uma abordagem visual.
- Expanda “Creative brief” para buscar uma cidade ou selecionar um local no mapa.
- Embaralhe as sugestões ou edite a história e a direção criativa diretamente.
- Confirme o local no mapa, o idioma suportado e o estilo de saída.

Use fontes verificáveis para história, pessoas e eventos. Consulte os detalhes da Skill selecionada para saber quais idiomas e durações ela suporta.

## 4. Copie as instruções e crie {#_4-copy-the-instructions-and-create}

1. Clique em “Copy all” na área do prompt.
2. Abra a pasta do projeto no seu agente local, inicie uma tarefa e cole as instruções completas.
3. Envie-as, forneça as entradas solicitadas, configure as dependências e comece a criação.

As instruções contêm a Skill selecionada, o briefing criativo, o formato dos metadados da participação e a autorização de upload. Mantenha a entrega completa para que o agente possa criar e submeter o trabalho.

“Preparing” significa que o acesso de upload está sendo preparado. Use “Retry” para prepará-lo novamente ou “Complete brief” para preencher os detalhes que faltam.

## 5. Acompanhe o progresso da criação {#_5-follow-creation-progress}

A criação pode levar de dezenas de minutos a algumas horas, dependendo da Skill, dos modelos e da duração do vídeo, e consome créditos de modelos. Mantenha o agente em execução e o computador ligado.

Adicione instruções de orçamento e de progresso na mesma tarefa:

```text
My model-call budget is [AMOUNT] USD. Ask before exceeding it.
Report the current step, saved files, and next step, then continue creation.
```

Use o MiniMax M3.1 Flash pelo SandBase, conforme exigido pelas regras atuais do evento. Siga os requisitos do evento e da página de upload para duração, resolução, legendas e tamanho dos arquivos.

## 6. Submeta e verifique o status da revisão {#_6-submit-and-check-review-status}

O agente segue as instruções completas para usar o cliente oficial de upload, enviar o vídeo, a capa e os metadados e submeter para revisão.

Abra [My entries](https://www.sandbase.ai/lab/event/aicityremix/mine?lang=en) para acompanhar o progresso:

| Status | Próximo passo |
|---|---|
| Draft | Termine o filme, envie os arquivos e submeta para revisão. |
| Pending review | Acompanhe o status da revisão. |
| Approved | Abra a página pública da participação e compartilhe. |
| Changes requested | Faça as revisões de acordo com a nota da revisão e submeta novamente. |

Para um filme já existente, selecione “Upload existing video” na página do evento, preencha os detalhes, envie o vídeo e a capa e submeta para revisão.

## 7. Retome um upload {#_7-resume-an-upload}

Se a autorização expirar ou um upload for interrompido, continue com os arquivos originais:

1. Mantenha o vídeo, a capa, o `entry.json` e a pasta de trabalho.
2. Encontre o mesmo rascunho em My entries e clique em “Resume upload”.
3. Copie as novas instruções de retomada para a tarefa original do agente.
4. Peça ao agente que envie e submeta os arquivos existentes e, depois, verifique o status em My entries.

## 8. Compartilhe sua participação {#_8-share-your-entry}

Na página de uma participação aprovada, clique em “Share on X” para abrir um editor de post já preenchido. Ele inclui o link da participação, `#AICityRemix`, `@SandbaseAI` e o post oficial do evento.

Para publicar um post com vídeo, clique primeiro em “Download video”, adicione o arquivo no editor do X, revise o texto e publique.

## Documentação relacionada {#related-documentation}

- [Usar uma Skill localmente](/guides/skills/local-use)
- [Conectar seu agente](/setup/)
- [Configurar chaves de API](/getting-started/api-keys)
