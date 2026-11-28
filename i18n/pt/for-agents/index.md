---
i18nSource: 0314b37a870481ae
title: Documentação legível por IA
description: Tudo o que um agente de IA precisa para descobrir e usar a API da SandBase — resumo em uma página.
---

# Visão geral da API para IA {#ai-friendly-api-overview}

::: info Contrato de Session
Uma Session (`ses_*`) executa uma versão salva de um Agent; crie-a diretamente com `POST /v1/agents/sessions`. As instâncias de runtime permanecem internas e nunca são retornadas.
:::

> Uma referência concisa para humanos e agentes de IA. Para versões em texto puro otimizadas para ingestão por LLMs, veja [`llms.txt`](https://www.sandbase.ai/docs/llms.txt).

## O que é a SandBase? {#what-is-sandbase}

A SandBase é uma plataforma de infraestrutura para agentes de IA. Uma única chave de API dá acesso aos Models e APIs habilitados de linguagem, imagem, vídeo, áudio, busca e dados, além de fluxos de trabalho de Agents. Descubra o catálogo atual em vez de depender de uma contagem fixa.

## URL base da API {#api-base-url}

```
https://api.sandbase.ai/v1
```

## Autenticação {#authentication}

Todas as requisições exigem um token Bearer:

```
Authorization: Bearer sk-YOUR_KEY
```

Obtenha sua chave em [Developer → API Keys](https://www.sandbase.ai/console/keys).

## Exemplo rápido {#quick-example}

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [{"role": "user", "content": "Hello!"}]
  }'
```

## APIs principais {#core-apis}

| Método | Rota | Descrição |
|--------|----------|-------------|
| `POST` | `/v1/chat/completions` | Chat compatível com OpenAI; recursos opcionais dependem do modelo selecionado |
| `POST` | `/v1/messages` | API de mensagens compatível com Anthropic |
| `POST` | `/v1/run` | Envia uma geração de modelo usando o schema específico do modelo |
| `GET` | `/v1/run/{id}` | Consulta o status de uma geração assíncrona e obtém os resultados |
| `GET` | `/v1/models` | Lista os modelos lógicos habilitados; o padrão é o tipo LLM |
| `GET` | `/v1/models/{id_or_name}` | Obtém detalhes, schema, recursos e preços do modelo |
| `GET` | `/v1/tasks/{task_id}/cost` | Obtém o custo e o uso da tarefa |

## Grupos de API adicionais {#additional-api-groups}

Além das APIs principais de geração, a SandBase oferece APIs para gerenciar o ciclo de vida de agentes. Veja o [Guia da API para IA](./full) para fluxos comuns e a [especificação OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) para o contrato completo.

| Grupo | Rotas principais | Finalidade |
|-------|---------------|---------|
| **Agents** | `POST /v1/agents`, `GET /v1/agents`, `POST /v1/agents/{agent_id}` | Criar e versionar definições salvas de Agents |
| **Sessions** | `POST /v1/agents/sessions`, `POST /v1/agents/sessions/{session_id}/events`, `GET /v1/agents/sessions/{session_id}/events` | Executar um Agent, enviar entradas e fazer streaming de eventos ao vivo |
| **Skills** | `POST /v1/skills`, `GET /v1/skills` | Pacotes versionados de instruções que os Agents montam |
| **MCP Connections e Secrets** | `POST /v1/mcp-connections`, `POST /v1/secrets` | Ferramentas MCP remotas via HTTPS e seus tokens Bearer somente escrita |

Os recursos da plataforma de Agents aceitam `Authorization: Bearer` ou `X-API-Key` e retornam `{"error":{"type","code","param","message"}}` em caso de falha.

## Modelo de preços {#pricing-model}

Pague pelo uso. Os preços são específicos de cada modelo e podem mudar independentemente desta página:

- **Preço do modelo**: leia a fórmula e as unidades atuais do modelo selecionado em `model_card`
- **Preço por token**: pode incluir componentes de entrada, saída, cache ou raciocínio, quando declarados pelo modelo
- **Mídia e outras operações**: podem usar unidades por requisição, duração, resolução ou outras específicas do modelo
- **APIs de dados** (busca, redes sociais, scraping, e-commerce, finanças): cada organização recebe 100 chamadas gratuitas por dia UTC, compartilhadas entre as APIs de dados elegíveis; depois disso, as chamadas são cobradas por chamada, e não bloqueadas. No MCP, as ferramentas elegíveis mostram `pricing.free_quota` em `sandbase_inspect`, e `sandbase_account` retorna `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`). Veja [Chamadas de API gratuitas diárias](/guides/billing#daily-free-api-calls).

Descubra o ID atual do modelo com `GET /v1/models` e, em seguida, inspecione `GET /v1/models/{id_or_name}` antes de enviar uma requisição. Não presuma que preços ou descontos de cache são compartilhados entre provedores.

Quando uma operação retornar um ID de tarefa, consulte o custo registrado:

```bash
curl https://api.sandbase.ai/v1/tasks/{task_id}/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

## Limites de taxa {#rate-limits}

Não há um padrão numérico universal publicado. As requisições estão sujeitas a um limite opcional de requisições por minuto
atribuído à sua organização e compartilhado por todas as suas chaves de API. Uma resposta `429` não inclui cabeçalhos de cota nem `Retry-After`; use
backoff exponencial limitado com jitter. Veja o [Guia de erros](./errors).

---

## Leitura adicional {#further-reading}

- [Guia da API para IA](./full) — fluxos principais, formatos de requisição/resposta e exemplos com curl
- [Models e preços](./models) — descoberta de modelos ao vivo, preços e orientações sobre recursos
- [Guia de erros](./errors) — formatos de resposta documentados, tratamento de HTTP e segurança de novas tentativas
- [Especificação OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) — OpenAPI 3.1 legível por máquina

## Versões em texto puro (para agentes de IA) {#plain-text-versions-for-ai-agents}

| Arquivo | URL | Conteúdo |
|------|-----|---------|
| `llms.txt` | [/docs/llms.txt](https://www.sandbase.ai/docs/llms.txt) | Resumo compacto (~60 linhas) |
| `llms-full.txt` | [/docs/llms-full.txt](https://www.sandbase.ai/docs/llms-full.txt) | Guia da API expandido e voltado para IA |
| `openapi.yaml` | [/docs/openapi.yaml](https://www.sandbase.ai/docs/openapi.yaml) | Especificação OpenAPI 3.1 legível por máquina |
