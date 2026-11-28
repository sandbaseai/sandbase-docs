---
i18nSource: 5b94f91222d138de
title: Autenticação da API
description: Autentique as APIs do SandBase com tokens Bearer e os headers de chave de API compatíveis com os protocolos suportados.
---

# Autenticação {#authentication}

O SandBase usa chaves de API para autenticar requisições à API pública. Esta página aborda os métodos de integração suportados e
as boas práticas de gerenciamento de chaves. A autenticação do Console e suas APIs internas não fazem parte do contrato da API pública.

## Métodos de autenticação {#authentication-methods}

Os endpoints padrão `/v1/*` do SandBase exigem um token Bearer. As operações Anthropic Messages e as compatíveis com o Google Gemini também aceitam a chave de API nos locais nativos compatíveis com seus SDKs.

### Token Bearer {#bearer-token}

Inclua a chave no header `Authorization`:

```http
Authorization: Bearer sk-your-api-key
```

Este é o método padrão usado pelos SDKs compatíveis com a OpenAI.

### Anthropic Messages: header x-api-key {#anthropic-messages-x-api-key-header}

Inclua a chave no header `x-api-key`:

```http
x-api-key: sk-your-api-key
```

Este header é suportado somente por `POST /v1/messages`. Os demais endpoints públicos não o leem; use autenticação
Bearer para Chat Completions, `/v1/run` e as APIs de recursos.

### Prioridade {#priority}

Somente em `POST /v1/messages`, `x-api-key` tem prioridade quando os dois headers estão presentes.

### Chaves de API compatíveis com o Google Gemini {#google-gemini-compatible-api-keys}

As operações Gemini GenerateContent e Interactions aceitam `x-goog-api-key`, `Authorization: Bearer …` ou o parâmetro de query `key`, nessa ordem de prioridade. Prefira um header, porque credenciais na query string podem aparecer em logs e no histórico do navegador. Consulte [Google Gemini](/api-reference/gemini-generate-content) e [Gemini Interactions](/api-reference/gemini-interactions) para ver os caminhos suportados.

### Lógica de extração {#extraction-logic}

Os endpoints padrão leem somente `Authorization: Bearer <key>`. O middleware do Anthropic Messages lê `x-api-key`
primeiro e, em seguida, recorre ao header Bearer. Os recursos da plataforma de Agents aceitam `Authorization: Bearer` ou
`X-API-Key` (veja abaixo). A [API de eventos de webhook](/api-reference/webhooks) (`/events/webhooks*`) também aceita qualquer um dos
headers e usa o header Bearer quando ambos estão presentes. A ausência de uma credencial suportada retorna `401 Unauthorized`.

### Recursos da plataforma de Agents {#agents-platform-resources}

`/v1/agents*` (incluindo `/v1/agents/sessions*`), `/v1/mcp-connections*`, `/v1/secrets*`
e `/v1/skills*` aceitam a chave em qualquer um dos headers:

```bash
curl https://api.sandbase.ai/v1/agents \
  -H "X-API-Key: $SANDBASE_API_KEY"
```

- Se `Authorization: Bearer` e `X-API-Key` forem enviados juntos, eles devem conter a mesma chave; valores diferentes retornam `401 unauthorized`. Repetir qualquer um dos headers também retorna 401.
- `OpenAI-Beta` é opcional. Se presente, deve ser `agents=v1`.
- Requisições de leitura exigem a permissão `agents.read` e as de escrita exigem `agents.write`. As chaves padrão criadas no Console têm as duas. Chaves com escopo emitidas pelo SandBase, como as chaves de CLI Login, retornam `403 insufficient_scope`.
- `402 spending_limit_exceeded` significa que o limite de gastos da chave ou o saldo da organização se esgotou.
- As falhas usam o [envelope de erro de Agents](/api-reference/errors#agents-platform-errors), e não o formato simples `{"error": "…"}` mostrado abaixo.

## Formato da chave de API {#api-key-format}

As novas chaves de API criadas no Console têm este formato:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

| Componente | Descrição |
|-----------|-------------|
| `sk-` | Prefixo padrão de "secret key" |
| `xxxx...` | 64 caracteres hexadecimais gerados a partir de 32 bytes aleatórios |

As chaves legadas `sk-sb-...` continuam utilizáveis até expirarem ou serem revogadas. Os clientes devem tratar as chaves como strings opacas
em vez de rejeitar uma credencial com base no prefixo ou no comprimento.

::: warning
Nunca exponha sua chave de API em código client-side, repositórios públicos ou logs. Trate-a como uma senha.
:::

## Criar chaves de API {#create-api-keys}

### Pelo Console {#via-console}

1. Faça login no [Console do SandBase](https://www.sandbase.ai/console)
2. Abra **Developer → API Keys**
3. Clique em **New key**
4. Dê à chave um nome descritivo (por exemplo, "Production Backend", "Development")
5. Copie a chave imediatamente — ela não será exibida novamente

### Propriedades da chave {#key-properties}

| Propriedade | Descrição |
|----------|-------------|
| Name | Rótulo legível para identificação |
| Organization | A organização à qual a chave pertence |
| Enabled | Indica se a chave está ativa |
| Spending Limit | Limite de gastos opcional por chave |
| Expires At | Data de expiração opcional |
| Created At | Quando a chave foi criada |

As chaves padrão criadas no Console têm acesso no nível da organização à API pública documentada. Credenciais emitidas pelo SandBase, como as chaves de CLI Login, podem ter um escopo restrito. O Console não permite que o usuário selecione escopos para chaves padrão.

## Ciclo de vida da chave {#key-lifecycle}

### Rotação {#rotation}

Para rotacionar uma chave:

1. Crie uma nova chave no Console
2. Atualize sua aplicação para usar a nova chave
3. Verifique se a nova chave funciona em produção
4. Revogue a chave antiga

::: tip
Sempre crie a nova chave antes de revogar a antiga para evitar indisponibilidade.
:::

### Revogação {#revocation}

Chaves revogadas não podem autenticar novas requisições. A API retorna `401 Unauthorized` com a mensagem:

```json
{"error":"API key has been revoked"}
```

### Expiração {#expiration}

As chaves podem ter, opcionalmente, uma data de expiração. Chaves expiradas retornam `401 Unauthorized` com a mensagem:

```json
{"error":"API key has expired"}
```

## Requisitos de autenticação por endpoint {#endpoint-authentication-requirements}

| Endpoint | Método de autenticação | Descrição |
|----------|-------------|-------------|
| `POST /v1/chat/completions` | Chave de API (Bearer) | Chat Completions |
| `POST /v1/responses` | Chave de API (Bearer) | API Responses compatível com a OpenAI |
| `POST /v1/messages` | Chave de API (Bearer ou x-api-key) | Anthropic Messages |
| `/v1beta/models/*` | Chave de API (x-goog-api-key, Bearer ou chave na query) | Gemini GenerateContent |
| `/v1beta/interactions*` | Chave de API (x-goog-api-key, Bearer ou chave na query) | Gemini Interactions |
| `/v1/agents*`, `/v1/mcp-connections*`, `/v1/secrets*`, `/v1/skills*` | Chave de API (Bearer ou X-API-Key) | Recursos da plataforma de Agents |

O Console do SandBase usa um fluxo de autenticação de navegador separado. Suas requisições internas não são endpoints públicos
suportados e não devem ser usadas por integrações.

## Isolamento por organização {#organization-isolation}

As chaves de API têm escopo de organização. Ao autenticar com uma chave:

- Você só pode acessar recursos que pertencem à sua organização
- O uso e o faturamento são registrados por organização

## Respostas de erro {#error-responses}

| Status HTTP | Mensagem | Causa |
|-------------|---------|-------|
| 401 | `missing API key in Authorization header` | Nenhuma chave informada |
| 401 | `invalid API key` | Chave não encontrada no banco de dados |
| 401 | `API key has been revoked` | A chave foi desativada |
| 401 | `API key has expired` | A chave passou da data de expiração |
| 402 ou 403 específico do protocolo | `API key spending limit exceeded` | Limite de gastos da chave atingido; consulte o contrato de erros documentado do endpoint |
| 403 | `API key is not authorized for this endpoint` | Chave com escopo usada em um endpoint fora do seu escopo |

Essas mensagens chegam no corpo simples `{"error":"<message>"}`, exceto os erros de escopo `403`. Nos endpoints de modelos e de
conta, eles usam `{"error":{"code":"insufficient_scope","message":"API key is not authorized for this endpoint","request_id":"..."}}`;
nos recursos da plataforma de Agents, usam o [envelope de erro de Agents](/api-reference/errors#agents-platform-errors) com
`code` `insufficient_scope`.

## Boas práticas de segurança {#security-best-practices}

### Faça {#do}

- **Armazene as chaves em variáveis de ambiente** — Nunca coloque chaves fixas no código-fonte
- **Use chaves separadas por ambiente** — Chaves diferentes para dev, staging e produção
- **Defina datas de expiração** — Escolha um intervalo de rotação adequado à sua política de segurança
- **Monitore o uso** — Verifique no Console se há atividade inesperada
- **Use chaves padrão somente para cargas de trabalho que precisam de acesso à API pública** — Mantenha as credenciais de CLI Login com escopo no fluxo gerenciado delas

### Não faça {#don-t}

- **Não faça commit de chaves no controle de versão** — Adicione `.env` ao `.gitignore`
- **Não compartilhe uma chave entre aplicações não relacionadas** — Chaves separadas tornam a rotação e a resposta a incidentes mais seguras
- **Não exponha chaves em código client-side** — Sempre use um proxy no seu backend
- **Não registre chaves de API em logs** — Oculte as chaves nos logs da aplicação

### Exemplo de variável de ambiente {#environment-variable-example}

::: code-group

```bash [.env]
SANDBASE_API_KEY=sk-your-api-key
```

```python [Python]
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript [JavaScript]
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

:::

## Limites de taxa por chave {#rate-limiting-by-key}

Os limites de requisições são atribuídos por organização e compartilhados por todas as suas chaves de API, então criar mais chaves não aumenta
o limite. A API não publica um valor numérico padrão universal
nem headers de cota restante.

Consulte [Limites de taxa](/guides/rate-limiting) para ver detalhes sobre os limites e o tratamento de respostas 429.
