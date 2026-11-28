---
i18nSource: 071e97a48f9c4f4c
title: Referência da API
description: Chame modelos da SandBase e gerencie Agents, Sessions, Skills, conexões MCP, Secrets e recursos da conta.
---

# Referência da API {#api-reference}

Use a API para chamar modelos diretamente ou para definir Agents reutilizáveis, executá-los em Sessions e conectá-los a Skills e ferramentas MCP.

::: tip Procurando inferência de modelos?
Os contratos de inferência (Chat Completions, Responses, Anthropic Messages, Gemini, Images e vídeo Seedance) estão na seção **Model inference** desta referência. Os campos e preços de cada modelo estão na página dele no [Catálogo de modelos](https://www.sandbase.ai/models).
:::

## Escolha um ponto de partida {#choose-a-starting-point}

| Objetivo | Comece por | O que acontece em seguida |
|---|---|---|
| Definir um comportamento reutilizável | [Agents](/api-reference/agents/) | Crie e versione uma configuração de Agent |
| Executar um Agent diretamente | [Sessions](/api-reference/sessions/) | Envie entradas, receba eventos em stream e leia o histórico |
| Reutilizar pacotes de instruções | [Skills](/api-reference/skills/) | Envie pacotes ZIP versionados e vincule-os a Agents |
| Chamar ferramentas externas | [Conexões MCP](/api-reference/mcp-connections/) | Registre servidores MCP HTTPS remotos para Agents |
| Autenticar ferramentas externas | [Secrets](/agents/api-credentials#with-the-api) | Armazene tokens Bearer somente gravação para conexões MCP |

## Ciclo de vida dos recursos {#resource-lifecycle}

```text
Agent + version ─── direct ──→ Session ─→ events, items, turns
Agent ─ skills[] → Skill version      Agent ─ mcp_connections[] → MCP connection ─ secret_id → Secret
```

- Um **Agent** (`agt_`) é uma configuração salva e versionada; criá-lo não o executa.
- Uma **Session** (`ses_`) executa uma versão de um Agent e congela as Skills e conexões MCP dele. Os caminhos de Session ficam em `/v1/agents/sessions`.
- Uma **Skill** (`skl_`) é um pacote de instruções versionado. Uma **conexão MCP** (`mcp_`) registra um servidor de ferramentas remoto, e um **Secret** (`sec_`) armazena o token Bearer dele.

## Convenções dos recursos da plataforma de Agents {#conventions-for-agents-platform-resources}

Agents, Sessions, Skills, conexões MCP e Secrets são servidos em `https://api.sandbase.ai/v1` e compartilham estas regras:

- Autentique com `Authorization: Bearer` ou `X-API-Key`. Consulte [Autenticação](/api-reference/authentication#agents-platform-resources).
- Os corpos das requisições são JSON estrito de até 1 MiB; campos desconhecidos retornam 400.
- Gravações que criam conexões MCP ou Secrets exigem um `Idempotency-Key`. As demais gravações aceitam um.
- A concorrência otimista usa `row_version`: envie o valor que você leu por último e trate o 409 lendo novamente.
- Agents, Sessions, itens, turnos e Skills usam paginação por cursor (`limit`, `after`, `order`; as respostas têm `has_more` e `last_id`). Versões de Agents, anexos, conexões MCP e Secrets usam paginação por offset (`limit`, `offset`; as respostas têm `total`).
- Os erros usam `{"error": {"type", "code", "param", "message"}}`. Consulte [Erros da plataforma de Agents](/api-reference/errors#agents-platform-errors).

## Autenticação {#authentication}

Envie uma chave de API da SandBase como token Bearer:

```http
Authorization: Bearer sk-YOUR_KEY
```

Trate a chave como um segredo opaco, mantenha-a no servidor e nunca a inclua em código de navegador ou em logs. Consulte [Autenticação](/api-reference/authentication) para detalhes de compatibilidade e [Erros](/api-reference/errors) para os envelopes de erro públicos.

## Organização e uso {#organization-and-usage}

Os recursos da plataforma pertencem à organização associada à chave de API. Use a [Account API](/api-reference/account/) para consultar o saldo e as visualizações recentes do histórico de execução suportadas. A administração da organização e o gerenciamento de faturamento continuam sendo fluxos do Console, a menos que um endpoint público esteja documentado aqui.

## Formatos de referência {#reference-formats}

- Navegue pelas operações na barra lateral para ver exemplos e detalhes das respostas.
- Baixe a [especificação OpenAPI](/openapi.yaml) legível por máquina.
- Abra a página de um modelo no [Catálogo de modelos](https://www.sandbase.ai/models) ou a página de uma API no [Catálogo de APIs](https://www.sandbase.ai/apis) para ver os campos exatos da requisição.

## Próximos passos {#next-steps}

- Novo em Agents gerenciados: [Criar Agent](/agents/)
- Chamar um modelo diretamente: [Chat Completions](/api-reference/llm-gateway) ou o [Catálogo de modelos](https://www.sandbase.ai/models)

