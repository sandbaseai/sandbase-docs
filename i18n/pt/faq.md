---
i18nSource: a86346e2696c732c
title: Perguntas frequentes
description: Perguntas frequentes sobre como conectar ferramentas de IA, o catálogo da SandBase, Models, APIs, Agents, Sessions e cobrança.
---

# Perguntas frequentes {#frequently-asked-questions}

## O que é a SandBase? {#what-is-sandbase}

A SandBase ajuda Agents a se conectarem ao mundo real.

Você pode usar Models e APIs prontos, usá-los nas suas ferramentas de IA depois de conectá-las em AI tools, ou criar Agents reutilizáveis e executá-los em Sessions.

## Para quem é a SandBase? {#who-is-sandbase-for}

A SandBase atende principalmente três grupos:

- **usuários de ferramentas de IA** que querem recursos úteis dentro do Codex, Claude, Cursor ou Kiro
- **desenvolvedores** que querem chamar Models e APIs diretamente
- **FDEs e equipes** que criam Agents reutilizáveis para clientes ou fluxos de trabalho internos

## Onde posso navegar pelos recursos? {#where-do-i-browse-capabilities}
O site da SandBase lista o catálogo de recursos:

- [Models](https://www.sandbase.ai/models) e [modelos de imagem e vídeo](https://www.sandbase.ai/models/image-video)
- [APIs](https://www.sandbase.ai/apis)
- [Agents](https://www.sandbase.ai/agents)
- [Skills](https://www.sandbase.ai/skills)
Dependendo do tipo de recurso, você pode inspecionar, testar, instalar, chamar ou clonar.

## O que é AI tools? {#what-is-ai-tools}

**Build → AI tools** no Console conecta a SandBase à ferramenta de IA que você já usa, como Claude Code, Codex, Cursor ou Kiro. Cole `set up https://www.sandbase.ai/SKILL.md` no seu agente ou execute `npx -y @sandbaseai/cli@latest connect`. A ferramenta conectada pode pesquisar e executar o catálogo de Models e APIs da SandBase, com cobrança no seu workspace. Veja [Conectar ferramentas de IA](/setup/).

## O que é Build Agent? {#what-is-build-agent}

Build Agent é onde você define e testa um Agent.

Um Agent combina instruções, um Model, Skills e ferramentas MCP em um único fluxo de trabalho reutilizável e versionado.

## Um Agent é diferente de uma API? {#is-an-agent-different-from-an-api}
Sim. Um Agent é uma configuração versionada que você edita e testa, e você o executa criando uma Session. Seu app pode criar Sessions com a [API de Sessions](/api-reference/sessions/) enquanto você continua editando o Agent.

## O que são Sessions? {#what-are-sessions}
Uma Session é uma execução de um Agent, com sua conversa, atividade de ferramentas e saída.

## Como dou a um Agent acesso a APIs externas? {#how-do-i-give-an-agent-access-to-external-apis}

Conecte o sistema externo como um servidor MCP e adicione-o às conexões MCP do Agent. Se o servidor precisar de um token Bearer, armazene-o com a [API de Secrets](/agents/api-credentials#with-the-api) como um Secret somente escrita vinculado à URL desse servidor. Os tokens são enviados apenas a esse servidor e nunca aparecem nos prompts nem no runtime do Agent. Veja [Credenciais para ferramentas MCP](/agents/api-credentials).

## Onde ficam os Models? {#where-do-models-live}

Os Models têm seu próprio [catálogo](https://www.sandbase.ai/models) porque são blocos de construção importantes.

Você pode chamar um Model diretamente, usá-lo em uma ferramenta de IA conectada ou usá-lo dentro de um Agent.

## Preciso escrever código? {#do-i-need-to-write-code}

Nem sempre.

[Conecte sua ferramenta de IA](/setup/) se quiser recursos dentro dela sem escrever código.

Use a Referência da API se quiser chamar a SandBase a partir da sua aplicação.

Use o Build Agent se quiser trabalho reutilizável de várias etapas.

## Como obtenho uma chave de API? {#how-do-i-get-an-api-key}

Abra o Console, vá em **Developer → API Keys** e selecione **New key**.

Use a chave assim:

```http
Authorization: Bearer sk-YOUR_KEY
```

## Como funciona a cobrança? {#how-does-billing-work}

A SandBase usa créditos e cobrança baseada em uso.

Models, APIs, Agents e trabalho de runtime podem ter custos diferentes. Consulte o Console para ver o uso e os preços atuais.

## Próximos passos {#next-steps}

- [Primeiros passos](/getting-started/)
- [Catálogo de Models e APIs](https://www.sandbase.ai/models)
- [Conectar ferramentas de IA](/setup/)
- [Build Agent](/agents/)
- [Referência da API](/api-reference/)
