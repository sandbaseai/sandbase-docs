---
i18nSource: 95410ff7ea741f64
title: Guia de erros legível por IA
description: Trate os erros da API do SandBase por família de endpoints, status HTTP, segurança de novas tentativas e formato de resposta documentado.
---

# Tratamento de erros para clientes de IA {#error-handling-for-ai-clients}

O SandBase não expõe um schema de erro universal. Primeiro, ramifique pelo status HTTP; depois, interprete o formato de resposta
documentado para a família de endpoints. Não presuma que toda resposta contém `code`, `param`, `request_id` ou uma
string de mensagem específica.

## Formatos de resposta públicos {#public-response-shapes}

O middleware principal de `/v1/*` e vários endpoints de modelos ou recursos retornam um erro plano:

```json
{"error":"organization rate limit exceeded"}
```

Os recursos da plataforma de Agents (`/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`,
`/v1/skills*`) retornam um objeto no estilo da OpenAI com um `code` estável. Consulte [Erros da plataforma de Agents](#agents-platform-errors):

```json
{"error":{"type":"invalid_request_error","code":"invalid_request","param":null,"message":"invalid request"}}
```

Os gateways compatíveis com a OpenAI mantêm um envelope compatível com a OpenAI. `POST /v1/messages` mantém o
envelope compatível com a Anthropic:

```json
{
  "type": "error",
  "error": {
    "type": "invalid_request_error",
    "message": "max_tokens is required"
  }
}
```

## Tratamento de status HTTP {#http-status-handling}

| Status | Significado | Ação do cliente |
|---|---|---|
| `400` | Input inválido ou parâmetro não suportado | Corrija a requisição usando o schema do endpoint e do modelo selecionados. |
| `401` | Credencial ausente, inválida, revogada ou expirada | Substitua ou rotacione a credencial; não tente novamente sem alterações. |
| `402` | A requisição não pode ser paga ou um limite de gastos foi atingido | Resolva a cobrança ou os limites da chave antes de tentar novamente. |
| `403` | A credencial não tem permissão, ou uma superfície de compatibilidade mapeia uma falha de gastos para 403 | Examine o envelope documentado e use uma chave autorizada. |
| `404` | Modelo ou recurso não encontrado | Verifique o nome atual do modelo ou o ID do recurso. |
| `409` | Conflito de estado do recurso | Leia o estado mais recente do recurso antes de decidir se é seguro tentar novamente. |
| `429` | Limite de requisições da organização ou limite de concorrência de vídeo | Tente novamente com backoff exponencial limitado e jitter. |
| `500`, `502`, `503`, `504` | Falha transitória do SandBase ou do upstream | Tente novamente apenas quando for seguro repetir a operação. |

## Mensagens de autenticação e de limite de taxa {#authentication-and-rate-limit-messages}

As mensagens de autenticação documentadas incluem:

- `missing API key in Authorization header`
- `invalid API key`
- `API key has been revoked`
- `API key has expired`

Uma chave com escopo usada fora do seu escopo retorna `403` com um corpo aninhado: `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`. Os recursos da plataforma de Agents retornam o mesmo `code` em seu próprio envelope.

A mensagem de limite de taxa documentada é `organization rate limit exceeded` (o limite de requisições por minuto atribuído à organização,
compartilhado por todas as suas API keys). Uma resposta `429` atualmente não inclui os headers `Retry-After` ou
`X-RateLimit-*`, e não há um padrão universal publicado de RPM ou de concorrência.

## Consulta de modelos e recursos {#model-and-resource-lookup}

Use `GET /v1/models` para descobrir os IDs de modelos habilitados e `GET /v1/models/{id_or_name}` para inspecionar um modelo antes
da execução. Trate um ID de recurso como opaco e verifique-o com a operação de listagem ou de leitura correspondente. Não monte uma
URL de polling diferente a partir do prefixo de um ID.

## Algoritmo de novas tentativas {#retry-algorithm}

Use backoff exponencial limitado com jitter:

```text
delay = min(base_delay * 2^attempt, max_delay) + random_jitter
```

Aplique estas regras:

- tente novamente um `429` após um intervalo calculado pelo cliente;
- tente novamente respostas `5xx` transitórias apenas um número pequeno e limitado de vezes;
- não tente novamente uma requisição `400`, `401`, `402`, `403` ou `404` sem alterações;
- verifique a idempotência antes de repetir qualquer requisição de criação, disparo ou ação externa;
- mantenha a saída parcial quando um stream falhar e decida se é seguro continuar ou recomeçar;
- informe ao chamador o status HTTP final e o erro sanitizado específico do endpoint.

## Erros da plataforma de Agents {#agents-platform-errors}

Agents, Sessions, Skills, conexões MCP e Secrets retornam um único envelope. Para a maioria dos códigos, `message` é uma frase fixa e segura; `invalid_request` pode trazer uma breve explicação, como qual formato de input ou opção não é suportado. Ramifique por `code`, não por `message`.

```json
{"error":{"type":"invalid_request_error","code":"conflict","param":null,"message":"conflicting request"}}
```

`type` é `authentication_error` para 401, `server_error` para 5xx e `invalid_request_error` nos demais casos.

| HTTP | `code` | Significado | O que fazer |
|---|---|---|---|
| 400 | `invalid_request` | Campos malformados ou desconhecidos, falha de validação ou uma opção não suportada | Corrija a requisição; não tente novamente sem alterações |
| 400 | `skill_not_found` | Uma Skill ou versão referenciada não está disponível | Corrija as `skills` do Agent |
| 401 | `unauthorized` | Headers de API key ausentes, inválidos ou conflitantes | Verifique `Authorization` / `X-API-Key` |
| 402 | `spending_limit_exceeded` | Limite de gastos da chave ou saldo da organização esgotado | Adicione créditos ou aumente o limite |
| 403 | `insufficient_scope` | A chave tem escopo e não pode usar recursos de Agents | Use uma chave padrão criada no Console |
| 403 | `org_disabled` | A organização não tem permissão para executar Agents | Entre em contato com o suporte |
| 404 | `not_found` | O recurso não existe na sua organização | Verifique o ID |
| 409 | `conflict` | `row_version` desatualizado, um estado que não permite a alteração ou um `Idempotency-Key` reutilizado com um corpo diferente | Leia o recurso novamente e depois decida |
| 409 | `session_input_pending` | Um input anterior ainda está sendo entregue | Aguarde; não reenvie com uma nova chave |
| 409 | `session_input_expired` | A admissão do input expirou | Examine o histórico antes de enviar novamente |
| 409 | `session_environment_unavailable` | O ambiente de execução está indisponível | Aguarde ou crie uma nova Session |
| 413 | `request_too_large` | O corpo da requisição, ou a configuração da Session congelada a partir dele, excede o limite de tamanho | Envie um corpo menor; não tente novamente sem alterações |
| 429 | `quota_exceeded` | Cota de Agents excedida | Tente novamente mais tarde |
| 502 | `executor_rejected`, `executor_contract_error` | A camada de execução rejeitou a requisição ou respondeu de forma inesperada | Verifique a configuração do Agent e tente novamente |
| 503 | `executor_unavailable`, `storage_unavailable`, `skill_unavailable`, `tenant_unavailable`, `tenant_provisioning_failed`, `authorization_unavailable`, `admission_unavailable`, `internal_error` | Uma dependência está temporariamente indisponível | Tente novamente com backoff e o mesmo `Idempotency-Key` |

`skill_runtime_incompatible` também pode aparecer; ele é retornado como 503 com a mensagem `internal error`.

## Falhas de streaming {#streaming-failures}

Depois que uma resposta em streaming começa, uma falha pode chegar no formato de stream do protocolo, em vez de um novo
status HTTP. Trate o stream como incompleto, feche-o, mantenha qualquer conteúdo parcial de que a aplicação precise e
tente novamente apenas quando for seguro repetir a requisição.

## Veja também {#see-also}

- [Códigos de erro](/api-reference/errors): formatos de resposta públicos e status HTTP comuns
- [Limites de taxa](/guides/rate-limiting): tratamento de 429 e suavização de requisições
- [Erros e novas tentativas](/guides/error-handling): padrões de implementação
- [Autenticação](/api-reference/authentication): credenciais suportadas e ciclo de vida das chaves

