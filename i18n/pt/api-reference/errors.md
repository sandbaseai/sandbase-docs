---
i18nSource: ac4e3b9b9eef4c7d
title: Erros da API
description: Trate erros da API da SandBase por status HTTP, família de endpoints, formato de resposta documentado e segurança para novas tentativas.
---

# Erros da API {#api-errors}

A SandBase usa códigos de status HTTP padrão, mas não expõe um corpo de erro universal. Verifique primeiro o status HTTP e, em seguida, analise o schema de resposta documentado para o endpoint chamado. Não exija que todo erro contenha `code`, `param`, `message` ou `request_id`.

## Formatos de resposta {#response-shapes}

O middleware principal e vários endpoints `/v1/*` retornam um erro plano:

```json
{"error":"organization rate limit exceeded"}
```

Os recursos da plataforma de Agents (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*`) retornam um objeto no estilo OpenAI com um `code` estável. Consulte [Erros da plataforma de Agents](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

A Events API de webhooks (`/events/webhooks*`) retorna `{"code":<http status>,"message":"..."}`. Consulte [Webhooks](/api-reference/webhooks#authentication-and-errors).

Os endpoints compatíveis com OpenAI mantêm um envelope compatível com OpenAI. `POST /v1/messages` mantém um envelope compatível com Anthropic:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

Use a [especificação OpenAPI](/openapi.yaml) para ver os códigos de status e schemas exatos de uma operação pública.

## Tratamento de status HTTP {#http-status-handling}

| Status | Significado típico | Ação do cliente |
|---|---|---|
| `400` | Entrada inválida ou parâmetro não suportado | Corrija a requisição usando o schema do endpoint e do modelo selecionado. |
| `401` | Credencial ausente, inválida, revogada ou expirada | Substitua ou rotacione a credencial; não repita sem alterações. |
| `402` | A requisição não pode ser paga ou um limite de gastos foi atingido | Resolva o saldo ou o limite da chave antes de tentar novamente. |
| `403` | A credencial não tem permissão, ou um endpoint de compatibilidade mapeia uma falha de gastos para 403 | Verifique o envelope específico do endpoint e use uma chave autorizada. |
| `404` | O modelo ou recurso não está disponível para quem chamou | Verifique o ID atual do modelo ou do recurso. |
| `409` | Conflito de estado do recurso | Leia o estado mais recente antes de decidir se é seguro tentar novamente. |
| `422` | Entrada de recurso semanticamente inválida | Corrija os valores dos campos documentados. |
| `429` | Limite de requisições da organização ou limite de concorrência de vídeo | Tente novamente com backoff limitado e jitter quando for seguro repetir a operação. |
| `500`, `502`, `503`, `504` | Falha na SandBase ou no upstream | Tente novamente apenas quando for seguro repetir a operação. |

Nem todo endpoint documenta todos os status desta tabela. O mapa de respostas OpenAPI da operação é a referência oficial.

## Erros de autenticação {#authentication-errors}

As mensagens de autenticação documentadas incluem:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Uma chave com escopo usada fora do seu escopo retorna `403` com um corpo aninhado: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Os recursos da plataforma de Agents retornam o mesmo `code` no próprio envelope.

Use `Authorization: Bearer $SANDBASE_API_KEY` nos endpoints padrão. `POST /v1/messages` também aceita `x-api-key`; os endpoints compatíveis com o protocolo do Google documentam os próprios cabeçalhos de chave suportados.

Uma chave revogada não pode ser reativada. Crie uma substituta, atualize a aplicação que a utiliza, verifique o funcionamento e, depois, remova as referências restantes à chave antiga.

## Limites de taxa {#rate-limits}

`organization rate limit exceeded` (`429`) significa que a sua organização atingiu o limite de requisições por minuto atribuído a ela, compartilhado por todas as suas chaves de API. Os endpoints compatíveis com protocolos o retornam no próprio envelope. A SandBase não publica um limite numérico universal porque o limite é atribuído por organização.

Se uma resposta incluir `Retry-After`, respeite-o. Caso contrário, use backoff exponencial limitado com jitter. Consulte [Limites de taxa](/guides/rate-limiting) para ver padrões de suavização de requisições.

Os envios de tarefas têm duas verificações adicionais. `organization concurrency limit exceeded` (`429`) significa que a sua organização já tem tantas tarefas em andamento quanto o nível da conta permite; o erro deixa de ocorrer quando uma tarefa em execução termina. Ele se aplica a todos os tipos de modelo em `POST /v1/run` e `/v1/api/*`, e a envios de vídeo em outros endpoints. `insufficient credit for estimated video cost` (`402`) significa que o custo estimado é maior que o seu saldo somado à linha de crédito; recarregue antes de tentar novamente. Consulte [Limites de concorrência](/guides/concurrency-limits).

## Segurança para novas tentativas {#retry-safety}

Siga esta ordem de decisão:

1. Determine se a operação já produziu um efeito visível externamente.
2. Não repita sem alterações uma requisição que retornou `400`, `401`, `402`, `403`, `404` ou `422`.
3. Para `409`, leia o estado atual do recurso antes de tentar novamente.
4. Repita respostas `429` e `5xx` transitórias apenas um número pequeno e limitado de vezes.
5. Antes de repetir uma requisição de criação, disparo, upload ou ação externa, confirme que a operação é idempotente ou que a sua aplicação consegue reconciliar duplicatas.

Um atraso adequado é:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

## Erros da plataforma de Agents {#agents-platform-errors}

Agents, Sessions, Skills, conexões MCP e Secrets retornam um único envelope. Para a maioria dos códigos, `message` é uma frase fixa e segura; `invalid_request` pode trazer uma breve explicação, como qual formato de entrada ou opção não é suportado. Baseie a lógica em `code`, não em `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` é `authentication_error` para 401, `server_error` para 5xx e `invalid_request_error` nos demais casos.

| HTTP | `code` | Significado | O que fazer |
|---|---|---|---|
| 400 | `invalid_request` | Campos malformados ou desconhecidos, falha de validação ou opção não suportada | Corrija a requisição; não repita sem alterações |
| 400 | `skill_not_found` | Uma Skill ou versão referenciada não está disponível | Corrija o campo `skills` do Agent |
| 401 | `unauthorized` | Cabeçalhos de chave de API ausentes, inválidos ou conflitantes | Verifique `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Limite de gastos da chave ou saldo da organização esgotado | Adicione créditos ou aumente o limite |
| 403 | `insufficient_scope` | A chave tem escopo restrito e não pode usar recursos de Agents | Use uma chave padrão criada no Console |
| 403 | `org_disabled` | A organização não tem permissão para executar Agents | Entre em contato com o suporte |
| 404 | `not_found` | O recurso não existe na sua organização | Verifique o ID |
| 409 | `conflict` | `row_version` desatualizado, um estado que não permite a alteração ou um `Idempotency-Key` reutilizado com outro corpo | Leia o recurso novamente e depois decida |
| 409 | `session_input_pending` | Uma entrada anterior ainda está sendo entregue | Aguarde; não reenvie com uma nova chave |
| 409 | `session_input_expired` | A admissão da entrada expirou | Verifique o histórico antes de enviar novamente |
| 409 | `session_environment_unavailable` | O ambiente de execução está indisponível | Aguarde ou crie uma nova Session |
| 413 | `request_too_large` | O corpo da requisição, ou a configuração da Session congelada a partir dele, excede o limite de tamanho | Envie um corpo menor; não repita sem alterações |
| 429 | `quota_exceeded` | Cota de Agents excedida | Tente novamente mais tarde |
| 502 | `executor_rejected`, `executor_contract_error` | A camada de execução rejeitou a requisição ou respondeu de forma inesperada | Verifique a configuração do Agent e tente novamente |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Uma dependência está temporariamente indisponível | Tente novamente com backoff e o mesmo `Idempotency-Key` |

`skill_runtime_incompatible` também pode aparecer; ele é retornado como 503 com a mensagem `internal error`.

## Falhas de streaming {#streaming-failures}

Depois que um stream começa, um erro pode chegar no formato de stream desse protocolo, em vez de uma nova resposta HTTP. Trate o stream como incompleto, guarde qualquer saída parcial de que a sua aplicação precise e tente novamente apenas quando for seguro gerar a requisição de novo. Não presuma que todo provedor emite o mesmo evento final ou motivo de término.

## Depuração operacional {#operational-debugging}

Registre o endpoint, o status HTTP, o modelo ou ID de recurso selecionado, o horário e qualquer identificador de requisição seguro retornado pelo servidor. Nunca registre em log cabeçalhos de autorização, chaves de API, valores de credenciais ou conteúdo sensível de prompts.

Use [Developer → Activities](https://www.sandbase.ai/console/activities) para inspecionar o histórico de requisições da organização. Ao relatar uma falha persistente, inclua metadados sanitizados da requisição e a menor requisição que reproduza o problema.

## Veja também {#see-also}

- [Autenticação](/api-reference/authentication)
- [Erros e novas tentativas](/guides/error-handling)
- [Limites de taxa](/guides/rate-limiting)
- [Guia de erros legível por IA](/for-agents/errors)

