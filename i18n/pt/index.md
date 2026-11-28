---
i18nSource: c063864501452a7b
title: Documentação do SandBase
description: Crie diretamente com Models e APIs ou defina Agents reutilizáveis que rodam em infraestrutura gerenciada.
---

# Documentação do SandBase {#sandbase-docs}

Crie diretamente com Models e APIs ou defina Agents reutilizáveis que rodam em infraestrutura gerenciada.

O SandBase oferece duas formas complementares de criar aplicações de IA. Comece pela superfície mais simples que atenda ao trabalho; você pode combiná-las à medida que a aplicação cresce.

## Escolha como criar {#choose-how-to-build}

| | Models e APIs | Agents gerenciados |
|---|---|---|
| **O que é** | Acesso direto a APIs de linguagem, imagem, vídeo, áudio e de terceiros | Configurações de Agent reutilizáveis e versionadas, executadas pelo SandBase |
| **Ideal para** | Loops de aplicação personalizados e controle refinado das requisições | Trabalho com várias etapas, assíncrono ou repetível |
| **Você gerencia** | Prompts, orquestração, novas tentativas e estado da aplicação | Definição do Agent, capacidades habilitadas, inputs e comportamento de entrega |
| **Comece aqui** | [Models e APIs](https://www.sandbase.ai/models) | [Build Agent](/agents/) |

::: tip Uma única API key do SandBase
A mesma API key pode chamar Models, APIs e Agents. Mantenha as chaves no servidor e nunca as exponha em código de navegador.
:::

## Conceitos principais {#core-concepts}

### Models e APIs {#models-and-apis}

Use Models para cargas de trabalho de linguagem, imagem, vídeo e áudio. Use APIs quando a aplicação precisar de dados ou ações externas. O catálogo no site do SandBase mostra as capacidades disponíveis, preços, schemas de input e exemplos funcionais.

- [Explorar Models](https://www.sandbase.ai/models)
- [Explorar APIs](https://www.sandbase.ai/apis)
- [Faça sua primeira chamada de API](/getting-started/first-call)
- [Abrir a referência da API](/api-reference/)

### Agents {#agents}

Um Agent é uma configuração reutilizável e versionada que contém um Model, instruções, Skills e conexões MCP. Defina-o uma vez e execute-o em Sessions.

- [Entenda os Agents](/agents/)
- [Defina um Agent](/agents/agent-api)
- [Adicione Skills e ferramentas MCP](/agents/mcp-tools)

### Sessions {#sessions}
Uma Session executa uma versão de um Agent. Crie-a com `POST /v1/agents/sessions`, envie input, faça streaming dos eventos e leia a conversa completa depois.

- [Guia de Sessions](/agents/sessions)
- [Sessions API](/api-reference/sessions/)

## Primeiros passos {#first-steps}

1. Crie uma organização e uma [API key](/getting-started/api-keys).
2. Escolha um Model, uma API ou um Agent no [catálogo](https://www.sandbase.ai/models).
3. Faça uma requisição direta ou defina e teste um Agent.
4. Execute o Agent testado em Sessions a partir da sua aplicação.
5. Revise Sessions, erros, latência e custo no Console.

## Orientações operacionais {#operational-guidance}

- [Respostas em streaming](/guides/streaming)
- [Tratamento de erros e novas tentativas](/guides/error-handling)
- [Limites de taxa](/guides/rate-limiting)
- [Cobrança e preços](/guides/billing)
- [Administração do workspace](/admin/)

## Próximos passos {#next-steps}

- Criando com Skills locais: [tutoriais de Skills](/guides/skills/)

- Novo no SandBase: [Primeiros passos](/getting-started/)
- Chamando um Model ou uma API: [catálogo de Models](https://www.sandbase.ai/models) e [catálogo de APIs](https://www.sandbase.ai/apis)
- APIs de inferência e de Agents: [Referência da API](/api-reference/)
- Criando trabalho reutilizável: [Build Agent](/agents/)
- Conectando uma ferramenta de IA: [Setup](/setup/)

