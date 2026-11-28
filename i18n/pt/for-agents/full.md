---
i18nSource: e566962f42a5f6b0
title: Guia da API do SandBase para IA
description: Guia ampliado da API do SandBase para agentes de IA, com os principais fluxos de trabalho, exemplos de requisição e links para a especificação OpenAPI oficial.
---

# Guia da API para IA {#ai-api-guide}

::: info Contrato de Session
Uma Session (`ses_*`) executa uma versão salva de um Agent e é criada diretamente com `POST /v1/agents/sessions`. Os IDs internos de Runtime Session não são expostos.
:::

> Um guia de página única com os fluxos de API mais comuns. Para o contrato completo legível por máquina, use a [especificação OpenAPI](https://www.sandbase.ai/docs/openapi.yaml). Versão em texto simples: [`llms-full.txt`](https://www.sandbase.ai/docs/llms-full.txt).

## Autenticação {#authentication}

Todas as requisições exigem:

```
Authorization: Bearer sk-YOUR_KEY
```

URL base: `https://api.sandbase.ai/v1`

---

## Terminologia {#terminology}

| Termo | Significado |
|------|---------|
| **Task** | Um registro de execução faturável para operações como inferência de modelos. Nem toda operação da API cria um. |
| **Run** | Uma requisição de geração de mídia via `POST /v1/run`. Pode ser síncrona ou assíncrona. Consulte com `GET /v1/run/{id}`. |
| **Session** | Uma execução de Agent via `POST /v1/agents/sessions`, que guarda a conversa, a atividade das ferramentas e a saída. Consulte com `GET /v1/agents/sessions/{session_id}`. |
> **run vs session**: um "run" de modelo (`/v1/run`) é uma tarefa de geração de modelo. Uma "Session" (`/v1/agents/sessions`) é uma execução de Agent. Todos os IDs são opacos e não devem ser interpretados.
>
> **task vs run**: um "run" ou uma "session" é a requisição que você faz; uma "task" é um registro de execução faturável. Use
> `GET /v1/tasks/{task_id}/cost` quando uma operação retornar um ID de task. Nem toda operação da API cria uma task.

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- GENERATION APIs                                          -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Chat Completions {#chat-completions}

### POST /v1/chat/completions {#post-v1-chat-completions}

Compatível com a OpenAI. O suporte a streaming, ferramentas, visão, raciocínio e saída estruturada depende do modelo selecionado e do schema que ele declara.

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-5.6-luna",
    "messages": [
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": "Explain quantum computing in one paragraph."}
    ],
    "temperature": 0.7,
    "max_tokens": 500,
    "stream": false
  }'
```

**Resposta:**

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "model": "openai/gpt-5.6-luna",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "Quantum computing leverages quantum mechanical phenomena..."
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113
  }
}
```

> Algumas operações faturáveis podem retornar `x-task-id: f3d2e8a1-7c4b-4a12-9d2e-123456789abc`; quando presente, use-o para consultar
> `GET /v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost`.

---

## Anthropic Messages {#anthropic-messages}

### POST /v1/messages {#post-v1-messages}

API Messages compatível com a Anthropic. Cache e outros recursos opcionais dependem do modelo selecionado e do schema da requisição.

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "anthropic/claude-sonnet-5",
    "max_tokens": 1024,
    "messages": [{"role": "user", "content": "What is SandBase?"}]
  }'
```

**Resposta:**

```json
{
  "id": "msg_abc123",
  "type": "message",
  "role": "assistant",
  "content": [
    { "type": "text", "text": "SandBase is an AI agent infrastructure platform..." }
  ],
  "model": "anthropic/claude-sonnet-5",
  "stop_reason": "end_turn",
  "usage": { "input_tokens": 12, "output_tokens": 64 }
}
```

---

## Geração de imagens {#image-generation}

### POST /v1/run {#post-v1-run}

O endpoint `/v1/run` é um **endpoint unificado de geração** — o campo `model` determina o tipo de saída (imagem, vídeo ou áudio).

> **Como tratar a resposta:** verifique o campo `status`.
> - `"completed"` → os resultados estão em `outputs`, pronto.
> - `"pending"` ou `"running"` → consulte `GET /v1/run/{id}` a cada 2–5 s até um status terminal (`completed`, `failed` ou `timeout`).

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bfl/flux-2/flash",
    "prompt": "A futuristic city at sunset, cyberpunk style",
    "aspect_ratio": "1:1"
  }'
```

**Resposta (síncrona):**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "model": "bfl/flux-2/flash",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/f3d2e8a1-7c4b-4a12-9d2e-123456789abc.png",
    "content_type": "image/png",
    "width": 1024,
    "height": 1024
  }]
}
```

---

## Geração de vídeo {#video-generation}

### POST /v1/run {#post-v1-run-1}

Verifique o `execution_mode` do modelo selecionado. Quando o envio retornar `pending` ou `running`, consulte `GET /v1/run/{id}` até um status terminal.

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "kwaivgi/kling-video/v3/standard/text-to-video",
    "prompt": "A drone flying over mountains at golden hour",
    "duration": 5
  }'
```

**Resposta (assíncrona — inicial):**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "running",
  "model": "kwaivgi/kling-video/v3/standard/text-to-video",
  "created_at": "2026-08-02T12:00:00Z"
}
```

**Consulta de status: `GET /v1/run/{id}`**

```json
{
  "id": "6a7b9c10-2d3e-4f50-8a61-23456789abcd",
  "status": "completed",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/6a7b9c10-2d3e-4f50-8a61-23456789abcd.mp4",
    "content_type": "video/mp4",
    "duration": 5
  }]
}
```

---

## Áudio (texto para fala) {#audio-text-to-speech}

### POST /v1/run {#post-v1-run-2}

```bash
curl https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "bytedance/seed-speech/tts/2.0",
    "text": "Hello world, this is a test of text to speech."
  }'
```

**Resposta:**

```json
{
  "id": "7b8c0d21-3e4f-5061-9b72-3456789abcde",
  "status": "completed",
  "model": "bytedance/seed-speech/tts/2.0",
  "created_at": "2026-08-02T12:00:00Z",
  "outputs": [{
    "url": "https://cdn.sandbase.ai/outputs/7b8c0d21-3e4f-5061-9b72-3456789abcde.mp3",
    "content_type": "audio/mpeg",
    "duration_seconds": 3.2
  }]
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- DISCOVERY APIs                                           -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Listar modelos {#list-models}

### GET /v1/models {#get-v1-models}

Retorna os modelos lógicos habilitados no formato de lista de modelos compatível com a OpenAI. O endpoint não é paginado e
usa `type=llm` por padrão. Recursos detalhados e preços são omitidos de propósito.

```bash
curl https://api.sandbase.ai/v1/models \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

A resposta contém `object: "list"` e um array `data`. Cada item contém `id`, `object`, `created` e
`owned_by`; use `id` como o nome lógico do modelo. Obtenha esse modelo para ver os metadados de recursos e preços.

---

## Obter modelo {#get-model}

### GET /v1/models/{id_or_name} {#get-v1-models-1}

```bash
curl https://api.sandbase.ai/v1/models/openai/gpt-5.6-luna \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

A resposta detalhada adiciona `unified_schema`, `supported_modes` e `model_card`. Os preços detalhados ficam dentro de
`model_card`; não existe um objeto `pricing` no nível superior.

---

## Obter custo da task {#get-task-cost}

### GET /v1/tasks/{task_id}/cost {#get-v1-tasks-task-id-cost}

Consulte o custo registrado de uma task usando o ID de task retornado pela operação da API.

```bash
curl https://api.sandbase.ai/v1/tasks/f3d2e8a1-7c4b-4a12-9d2e-123456789abc/cost \
  -H "Authorization: Bearer sk-YOUR_KEY"
```

**Resposta:**

```json
{
  "id": "f3d2e8a1-7c4b-4a12-9d2e-123456789abc",
  "status": "completed",
  "settled": true,
  "currency": "USD",
  "cost": "0.000325",
  "estimated_cost": "0.000325",
  "usage": {
    "prompt_tokens": 24,
    "completion_tokens": 89,
    "total_tokens": 113,
    "cached_tokens": 0,
    "cache_creation_tokens": 0,
    "reasoning_tokens": 0
  }
}
```

---

<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->
<!-- PLATFORM APIs                                            -->
<!-- ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ -->

## Convenções da plataforma de Agents {#agents-platform-conventions}

- URL base `https://api.sandbase.ai/v1`. Envie `Authorization: Bearer sk-YOUR_KEY` ou `X-API-Key: sk-YOUR_KEY` (o mesmo valor, se enviar os dois). `OpenAI-Beta` é opcional; se enviado, deve ser `agents=v1`. O SDK oficial da OpenAI (`client.beta.agents`, `client.skills`) funciona com `base_url="https://api.sandbase.ai/v1"`; as diferenças estão listadas em [Compatibilidade com a OpenAI](/agents/openai-compatibility).

- Os corpos são JSON estrito de até 1 MiB; campos desconhecidos retornam 400.

- Erros: `{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}`. Use `code` para decidir o tratamento; consulte o [Guia de erros](./errors#agents-platform-errors).

- `row_version` é o token de compare-and-set para PATCH, archive, restore e rotate. Em caso de 409, leia novamente.

- Listas por cursor (Agents, Sessions, items, turns, Skills): `limit` de 1 a 100, `after`, `order`; resposta `{object:"list", data, has_more, first_id, last_id}`.

- Listas por offset (versões de Agent, anexos, conexões MCP, Secrets): `limit`, `offset`; resposta `{data, total, limit, offset}`.

- IDs: Agent `agt_`, Session `ses_`, Skill `skl_`, conexão MCP `mcp_`, Secret `sec_`, anexo `fil_`. Trate-os como opacos.

---

## Agents {#agents}

### POST /v1/agents — Criar Agent {#post-v1-agents-—-create-agent}

```bash
curl -X POST https://api.sandbase.ai/v1/agents \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: create-research-agent-1" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Research assistant",
    "model": "deepseek/deepseek-v4-flash",
    "instructions": "Research the question and cite sources."
  }'
```

Obrigatório: `model`. Opcionais: `name`, `instructions`, `description`, `runtime_profile` (`codex` por padrão, `claude`, `mcode`), `skills` (`[{"skill_id","version"}]`), `mcp_connections` (`[{"connection_id","server_label","allowed_tools","required"}]`), `tools`, `text`, `reasoning`, `service_tier`, `metadata`, `note`. Retorna `201` com `id` (`agt_`), `version`, `row_version`, `status` e `projection_status`; inicie Sessions quando `projection_status` for `ready`. Ferramentas `web_search` devem usar `mode: "disabled"`, e resultados de funções no lado do cliente (`requires_action`) não são suportados.

### GET /v1/agents — Listar Agents {#get-v1-agents-—-list-agents}

Query `status` (`active` por padrão, `archived`, `all`) mais paginação por cursor.

### GET /v1/agents/{agent_id} — Obter Agent {#get-v1-agents-agent-id-—-get-agent}

### POST /v1/agents/{agent_id} — Atualizar Agent (estilo SDK) {#post-v1-agents-agent-id-—-update-agent-sdk-style}

Atualização parcial de `name`, `instructions`, `model`, `metadata`, `service_tier`, `tools`, `text`, `reasoning`, `runtime_profile`, `mcp_connections`, `skills`. Sem `row_version`; cria uma nova versão.

### PATCH /v1/agents/{agent_id} — Atualizar Agent (compare-and-set) {#patch-v1-agents-agent-id-—-update-agent-compare-and-set}

Os mesmos campos, mais `description` e `note`; `row_version` é obrigatório. Um `null` explícito retorna 400.

### Versões, arquivamento, restauração, catálogo {#versions-archive-restore-catalog}

- `GET /v1/agents/{agent_id}/versions` e `GET /v1/agents/{agent_id}/versions/{version}` leem snapshots imutáveis.

- `POST /v1/agents/{agent_id}/archive` e `POST /v1/agents/{agent_id}/unarchive` recebem `{"row_version"}`. `DELETE /v1/agents/{agent_id}` também arquiva.

- `POST /v1/agents/{agent_id}/restore` recebe `{"source_version","row_version"}`.

- `GET /v1/agents/catalog` lista os Agents públicos; `POST /v1/agents/catalog/{agent_id}/clone` copia um deles para a sua organização (`201`, novo `agt_`).

---

## Sessions {#sessions}

Uma Session executa uma versão salva de um Agent. Os caminhos ficam sob `/v1/agents/sessions`. A versão do Agent, as versões das Skills e as conexões MCP são congeladas na criação.

### POST /v1/agents/sessions — Criar Session {#post-v1-agents-sessions-—-create-session}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Content-Type: application/json" \
  -d '{"agent_id": "agt_..."}'
```

Envie `agent_id` (Agent salvo), `agent` (Agent inline ou substituições por Session de `model`, `instructions`, `runtime_profile`, `service_tier`, `tools`, `text`, `reasoning` e `multi_agent`) ou ambos. Opcionais: `version` (somente Agents salvos), `title`, `input` (uma string ou um array com exatamente uma mensagem de usuário contendo uma parte `input_text`), `model` ou `agent.model`, `metadata`, `model_provider` (`{"type":"custom","base_url":"https://...","api_key":"..."}`; se omitido, usa a chave da chamada). `stream: true` com um `input` não vazio retorna `201` como um stream de Server-Sent Events do primeiro turno, começando com `agent.session.created`. As Sessions sempre são executadas na nuvem hospedada do SandBase, então não há ambiente a escolher; o SDK da OpenAI ainda exige `environment={"type": "openai_hosted"}`. Retorna `201` com `status` (`idle`, `in_progress`, `failed`), `lifecycle_status` (`active`, `archived`), `failure`, `source` (`direct`, `service`, `schedule`) e `row_version`.

### GET /v1/agents/sessions/{session_id}/events — Stream de eventos (SSE) {#get-v1-agents-sessions-session-id-events-—-stream-events-sse}

Somente em tempo real. Abra-o antes de enviar entradas. `Last-Event-ID` ou `after` retornam 400; os eventos não são reenviados. Os valores de `type` dos eventos começam com `agent.session.`.

### POST /v1/agents/sessions/{session_id}/events — Enviar entrada {#post-v1-agents-sessions-session-id-events-—-send-input}

```bash
curl -X POST https://api.sandbase.ai/v1/agents/sessions/ses_.../events \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -H "Idempotency-Key: input-1" \
  -H "Content-Type: application/json" \
  -d '{"events": [{"type": "agent.session.input.message", "input": "Summarize the findings."}]}'
```

Exatamente um evento por requisição: `agent.session.input.message` ou `agent.session.input.cancel`. Retorna `202` sem corpo. Forma estendida: `{"input": "...", "file_ids": ["fil_..."]}` (até 10 anexos prontos). `409 session_input_pending` significa que uma entrada anterior ainda está sendo entregue; aguarde e não reenvie com uma nova chave.

### Histórico e outras operações de Session {#history-and-other-session-operations}

- `GET /v1/agents/sessions` (query `lifecycle_status`, `agent_id`), `GET /v1/agents/sessions/{session_id}`.

- `GET /v1/agents/sessions/{session_id}/items`, `GET /v1/agents/sessions/{session_id}/turns` e `GET /v1/agents/sessions/{session_id}/turns/{turn_id}` leem o histórico.

- `POST /v1/agents/sessions/{session_id}` substitui `metadata`; `PATCH /v1/agents/sessions/{session_id}` renomeia com `{"title","row_version"}`.

- `POST /v1/agents/sessions/{session_id}/cancel` (exige `Idempotency-Key`) cancela o turno em execução.

- `DELETE /v1/agents/sessions/{session_id}` arquiva; `POST /v1/agents/sessions/{session_id}/unarchive` restaura.

- `POST /v1/agents/sessions/{session_id}/files` envia um anexo (multipart `file`, 5 MiB, `Idempotency-Key` obrigatório).

- `POST /v1/agents/sessions/{session_id}/reconnect` retorna `stream_url` para `GET /v1/agents/sessions/{session_id}/events/stream`, que envia `session.snapshot` e, em seguida, os eventos em tempo real.

---

### Arquivos do workspace e artifacts de saída {#workspace-files-and-output-artifacts}

- `GET /v1/agents/sessions/{session_id}/workspace-files` lista os metadados atuais dos arquivos sob `path` (padrão `/workspace`). Query `limit` (1 a 100, padrão 20), `order` (`asc` por padrão ou `desc`) e `page` (o cursor `next` anterior). Retorna `{object:"page", data:[{path,size_bytes}], next, has_more}`. Um cursor inválido exige recomeçar pela primeira página.
- `GET /v1/agents/sessions/{session_id}/artifacts` lista as saídas imutáveis capturadas sob `/workspace/outputs/`. Query `limit` (padrão 20), `order` (`desc` por padrão) e `after` (use `last_id` quando `has_more` for true).
- `GET /v1/agents/sessions/{session_id}/artifacts/{artifact_id}/content` baixa um artifact completo usando o ID opaco `art_` retornado. Os downloads têm limite de 200 MiB; `Range` não é suportado (`416`). Metadados do workspace, anexos enviados e artifacts capturados são recursos separados.

---

## Skills, conexões MCP e Secrets {#skills-mcp-connections-and-secrets}

### POST /v1/skills — Criar Skill {#post-v1-skills-—-create-skill}

```bash
curl -X POST https://api.sandbase.ai/v1/skills \
  -H "Authorization: Bearer sk-YOUR_KEY" \
  -F "files=@release-notes.zip;type=application/zip"
```

Uma parte ZIP `files` (5 MiB). O ZIP deve conter uma única pasta de nível superior com o `SKILL.md` (frontmatter com `name` e `description`) dentro dela, por exemplo `zip -r release-notes.zip release-notes/`; um `SKILL.md` na raiz do ZIP retorna `400 invalid_request`. Uma Skill referenciada por qualquer versão de Agent (inclusive Agents arquivados) não pode ser excluída (`409`); em vez disso, desative-a com `POST /v1/skills/{skill_id}` e `{"status": "disabled"}`. Retorna `201` com `id` (`skl_`) e `default_version`. Adicione versões com `POST /v1/skills/{skill_id}/versions`; liste com `GET /v1/skills`. Referencie a partir de um Agent como `{"skill_id": "skl_...", "version": null}`.

### POST /v1/mcp-connections — Registrar um servidor MCP {#post-v1-mcp-connections-—-register-an-mcp-server}

Corpo `{"name", "server_url" (HTTPS), "secret_id"?}`; `Idempotency-Key` obrigatório. Referencie nas `mcp_connections` de um Agent. Desativá-la bloqueia novas Sessions e novas entradas.

### POST /v1/secrets — Armazenar um token Bearer de MCP {#post-v1-secrets-—-store-an-mcp-bearer-token}

Corpo `{"name", "kind": "mcp_bearer", "server_url", "token"}`; `Idempotency-Key` obrigatório. O token é somente de escrita e fica vinculado a essa URL exata. Secrets não são variáveis de ambiente. Rotacione com `POST /v1/secrets/{secret_id}/rotate`; revogue com `DELETE /v1/secrets/{secret_id}` (204).

---

## Faturamento e custo {#billing-cost}

### Como os custos são calculados {#how-costs-are-calculated}

- Leia a fórmula de preço atual e as unidades do modelo selecionado no `model_card` dele.
- Modelos com preço por token podem incluir componentes de entrada, saída, cache ou raciocínio, quando declarados.
- Modelos de mídia e outros podem usar unidades por requisição, duração, resolução ou outras unidades específicas do modelo.
- As APIs de dados (busca, redes sociais, scraping, e-commerce, finanças) incluem 100 chamadas gratuitas por organização por dia UTC, compartilhadas entre as APIs de dados elegíveis e redefinidas às 00:00 UTC. As chamadas seguintes são cobradas por chamada; elas não são rejeitadas. Organizações com saldo zero ainda podem usar as chamadas gratuitas.
- Não elegíveis: LLMs, modelos de mídia e APIs de dados mais caras ou com preço por fórmula (por exemplo, alguns endpoints em lote, crawl, Xiaohongshu PGY e as rotas `kol-*` do Douyin Xingtu), que são cobradas desde a primeira chamada. A verificação é feita por `pricing.free_quota` em `sandbase_inspect`.
- MCP: `sandbase_inspect` mostra `pricing.free_quota` nas ferramentas elegíveis; `sandbase_account` retorna `free_api_quota` (`daily_limit`, `used_today`, `remaining`, `resets_at`); os resultados liquidados de `sandbase_run` e `sandbase_run_get` incluem `free_quota_status` (`free`, `overage` ou `degraded`).
- Quando uma operação faturável retornar um ID de task (inclusive no header de resposta `x-task-id`), use `GET /v1/tasks/{task_id}/cost` para ver a liquidação e o uso.
- Para respostas assíncronas de `POST /v1/run`, consulte o resultado da geração com `GET /v1/run/{id}`; um ID de run não é um ID de task e não deve ser enviado ao endpoint de custo.

### Controle de orçamento {#budget-control}

- Defina um limite de gastos opcional ao criar ou editar uma chave padrão em [Developer → API Keys](https://www.sandbase.ai/console/keys).
- Monitore as requisições e o custo em **Developer → Activities → Usage**.
- Consulte o saldo e as transações de crédito em [Developer → Billing](https://www.sandbase.ai/console/billing).

---

## Veja também {#see-also}

- [Modelos e preços](./models) — descoberta de modelos em tempo real, recursos e orientações sobre preços
- [Guia de erros](./errors) — formatos de resposta documentados, tratamento de HTTP e segurança de novas tentativas
- [Especificação OpenAPI](https://www.sandbase.ai/docs/openapi.yaml) — schema legível por máquina


## Vínculos de versão de Skill no Agent {#agent-skill-version-bindings}

Ao salvar um Agent, cada nova referência a uma Skill é fixada em uma versão explícita. Em um novo vínculo, `version: null` seleciona o padrão atual no momento em que o Agent é salvo. Em um vínculo existente, `version: null` mantém a versão fixada. Alterar o padrão de uma Skill não atualiza Agents salvos nem Sessions existentes; salve uma versão explícita no Agent para atualizar as Sessions futuras.
