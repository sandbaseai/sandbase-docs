---
i18nSource: 7b24f4b0b5cd2c33
title: Build Agent
description: Defina, teste e execute Agents reutilizáveis e versionados em Sessions do SandBase.
---

# Build Agent {#build-agent}

Em Build Agent você define e testa um Agent e, depois, decide como ele é executado.

Um Agent é uma configuração salva e versionada: um modelo, instruções, um perfil de runtime, Skills e conexões MCP com ferramentas externas. Salvar um Agent não o executa.

## O que é um Agent {#what-an-agent-is}

| Pergunta | Onde fica |
|---|---|
| O que ele deve fazer? | `instructions` |
| Qual modelo faz o trabalho? | `model`, um ID de modelo da [API de modelos](/api-reference/models/) |
| O que ele sabe fazer? | [Skills](/agents/mcp-tools#skills), pacotes de instruções versionados |
| Quais ferramentas externas ele pode chamar? | [Conexões MCP](/agents/mcp-tools#mcp-connections), com [credenciais](/agents/api-credentials) quando o servidor precisa de um token |
| Como ele é executado? | Em uma [Session](/agents/sessions) |

Toda alteração efetiva cria uma nova versão imutável. Você pode listar as versões e restaurar uma anterior a qualquer momento.

## Como um Agent é executado {#how-an-agent-runs}

Você executa um Agent em uma [Session](/agents/sessions). Uma Session é um recurso `ses_` para o qual você envia entradas e do qual recebe eventos por streaming, seja em uma conversa interativa, em uma execução de teste ou em uma chamada da sua aplicação. Cada Session congela a versão do Agent com que começou, então você pode continuar editando o Agent sem alterar as Sessions que já existem.

## Ciclo de vida do Agent: rascunho → teste em uma Session → execução pela sua aplicação → inspeção das Sessions {#agent-lifecycle-draft-→-test-in-a-session-→-run-from-your-app-→-inspect-sessions}

### 1. Rascunho {#_1-draft}

Crie um Agent no Console em **Build → Agents** ou com [`POST /v1/agents`](/agents/agent-api). Comece pelo menor fluxo de trabalho útil e adicione Skills e conexões MCP somente quando as instruções precisarem delas.

### 2. Teste em uma Session {#_2-test-in-a-session}

Crie uma Session para o Agent, envie entradas representativas e leia a saída, a atividade das ferramentas e os erros. Teste entradas ausentes, ferramentas indisponíveis, resultados vazios e requisitos de formato de saída, e não apenas o caminho feliz.

### 3. Execução pela sua aplicação {#_3-run-from-your-app}

Crie Sessions para o Agent testado a partir da sua aplicação com a [API de Sessions](/api-reference/sessions/).

### 4. Inspeção das Sessions {#_4-inspect-sessions}

Leia os itens e os turnos de cada Session com a API de Sessions para revisar a conversa completa, a atividade das ferramentas e os erros.

## Checklist de produção {#production-checklist}

- `model` usa um ID de modelo atual da API de modelos.
- As Skills ficam fixadas em uma versão quando o comportamento não pode mudar silenciosamente.
- As conexões MCP expõem apenas as ferramentas de que o Agent precisa, usando `allowed_tools`.
- Os tokens são armazenados como [Secrets](/agents/api-credentials), nunca escritos em instruções, entradas ou metadados.
- A criação de Sessions envia um `Idempotency-Key`, e as novas tentativas o reutilizam.
- O status e os erros das Sessions são verificados após o lançamento.

## Agents do catálogo {#catalog-agents}

O [catálogo de Agents](/api-reference/agents/catalog) público lista os Agents publicados pelo SandBase. Você pode ler um Agent do catálogo, mas, para alterá-lo, primeiro clone-o para a sua organização com `POST /v1/agents/catalog/{agent_id}/clone`. O clone é um novo Agent privado que pertence a você e que você pode executar.

::: tip Usando o SDK da OpenAI
Agents, Sessions e Skills seguem a API de Agents da OpenAI, então o SDK oficial da OpenAI funciona com `base_url="https://api.sandbase.ai/v1"`. Consulte [Compatibilidade com a OpenAI](/agents/openai-compatibility) para ver exemplos verificados e as diferenças.
:::

## Próximos passos {#next-steps}

- [Definir um Agent](/agents/agent-api)
- [Compatibilidade com a OpenAI](/agents/openai-compatibility)
- [Skills e ferramentas MCP](/agents/mcp-tools)
- [Sessions](/agents/sessions)
