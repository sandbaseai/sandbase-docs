---
i18nSource: 3dc57d405dbf561d
title: Chaves de API
description: Como criar, gerenciar e proteger as chaves de API da SandBase usadas para autenticar requisições.
---

# Chaves de API {#api-keys}

As chaves de API autenticam as suas requisições à SandBase. Este guia mostra como criar chaves, usá-las nas requisições e mantê-las seguras.

## Criar uma chave de API {#create-an-api-key}

1. Entre no [SandBase Console](https://www.sandbase.ai/console)
2. Abra **Developer → API Keys** (ou acesse diretamente [API Keys](https://www.sandbase.ai/console/keys))
3. Clique em **New key**
4. Informe um **Name** descritivo (por exemplo, "Production Server", "Local Development")
5. Se quiser, defina um **Spending limit** (vazio significa ilimitado) e uma data em **Expires** (vazio significa sem expiração)
6. Clique em **Create key**
7. Copie a chave do banner **API key created** imediatamente — ela será exibida apenas uma vez

::: danger Importante
A sua chave de API é exibida apenas uma vez, no momento da criação. Se você a perder, precisará criar outra. Guarde-a em local seguro antes de fechar a caixa de diálogo.
:::

## Formato da chave {#key-format}

As novas chaves de API criadas no Console usam o prefixo `sk-` seguido de 64 caracteres hexadecimais:

```
sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

As chaves `sk-sb-...` existentes continuam válidas até expirarem ou serem revogadas. Não use apenas o prefixo para validar uma
credencial; trate sempre o valor completo como um segredo opaco.

## Métodos de autenticação {#authentication-methods}

A SandBase oferece duas formas de enviar a sua chave de API nas requisições:

### Cabeçalho Authorization (recomendado) {#authorization-header-recommended}

Use o cabeçalho padrão `Authorization: Bearer`. Ele é compatível com os SDKs da OpenAI e da Anthropic:

```bash
curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "deepseek/deepseek-v4-flash", "messages": [{"role": "user", "content": "Hi"}]}'
```

### Anthropic Messages: cabeçalho x-api-key {#anthropic-messages-x-api-key-header}

`POST /v1/messages` também aceita o cabeçalho nativo da Anthropic `x-api-key`:

```bash
curl https://api.sandbase.ai/v1/messages \
  -H "x-api-key: sk-YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"model": "anthropic/claude-sonnet-5", "max_tokens": 1024, "messages": [{"role": "user", "content": "Hi"}]}'
```

::: tip
Entre os gateways de modelos, apenas `POST /v1/messages` lê `x-api-key`, e ele tem prioridade quando os dois cabeçalhos suportados
estão presentes. Os [recursos da plataforma de Agents](/api-reference/authentication#agents-platform-resources) também aceitam
`X-API-Key`. Use o cabeçalho Bearer em todos os demais endpoints públicos.
:::

## Permissões das chaves {#key-permissions}

As chaves de API da SandBase têm escopo no **nível da organização**:

- Uma chave padrão criada no Console pode chamar os recursos de API públicos disponíveis para a organização
- O uso é cobrado da organização dona da chave
- Uma chave pode ter uma expiração e um limite de gastos opcionais
- Credenciais emitidas pela SandBase, como as chaves de CLI Login, podem ter escopo restrito e retornam `403` fora desse escopo

No momento, o Console não permite escolher escopos para uma chave padrão. As chaves de CLI Login são criadas quando você conecta uma ferramenta de IA. A página API Keys as agrupa em uma única linha expansível **CLI Login**, e elas não podem ser editadas como as chaves padrão. As chaves que a SandBase cria para você exibem o selo **Auto-created**; elas não têm limite por chave e são limitadas pelo saldo da conta.

A lista de chaves mostra **Name**, **Key Prefix**, **Spent**, **Limit**, **Expires** e **Status** de cada chave. Use **Edit** para alterar o nome, o limite de gastos ou a expiração de uma chave padrão.

Trate cada chave como uma credencial de aplicação, e não como uma senha pessoal. Use a participação na organização para o acesso de pessoas e chaves de API para cargas de trabalho.

## Estratégia por ambiente {#environment-strategy}

Crie uma chave diferente para cada aplicação e ambiente:

| Chave | Nome de exemplo | Motivo |
|---|---|---|
| Desenvolvimento local | `research-app-dev` | Rotacionar sem interromper a produção |
| Staging | `research-app-staging` | Isolar o uso de testes e os incidentes |
| Produção | `research-app-production` | Dar à produção um responsável claro e exposição limitada |
| Automação temporária | `release-check-2026-08` | Definir uma expiração e revogar de forma independente |

Registre o responsável e a implantação que usa cada chave. Durante a rotação, implante a nova chave, verifique se as requisições funcionam e só então revogue a chave antiga.

## Expiração e revogação de chaves {#key-expiration-and-revocation}

### Expiração {#expiration}

Ao criar uma chave, você pode definir uma data de expiração. Depois de expirada, a chave deixa de funcionar e as requisições retornam o erro `401 Unauthorized`.

Chaves sem data de expiração continuam válidas até serem revogadas manualmente.

### Revogar uma chave {#revoking-a-key}

Para revogar (desativar) uma chave:

1. Acesse [Developer → API Keys](https://www.sandbase.ai/console/keys)
2. Encontre a chave que você quer revogar
3. Clique em **Revoke**
4. Confirme a ação

Chaves revogadas não autenticam novas requisições. A revogação não pode ser desfeita — crie uma nova chave se revogar uma por engano.

## Boas práticas de segurança {#security-best-practices}

### Nunca faça commit de chaves no controle de versão {#never-commit-keys-to-version-control}

Use variáveis de ambiente ou um gerenciador de segredos:

```bash
# .env file (add to .gitignore!)
SANDBASE_API_KEY=sk-your-key-here
```

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1"
)
```

```javascript
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.SANDBASE_API_KEY,
  baseURL: 'https://api.sandbase.ai/v1',
});
```

### Use chaves separadas para ambientes diferentes {#use-separate-keys-for-different-environments}

Crie chaves distintas para desenvolvimento, staging e produção. Assim, você pode revogar uma chave de desenvolvimento comprometida sem afetar a produção.

### Rotacione as chaves regularmente {#rotate-keys-regularly}

Crie novas chaves periodicamente e desative as antigas. Isso reduz o período de exposição caso uma chave vaze.

### Monitore a atividade {#monitor-activity}

Verifique **Developer → Activities** regularmente em busca de picos inesperados de requisições ou de uso, que podem indicar uma chave comprometida. **Request History** pode filtrar por chave de API.

Se uma chave for exposta, revogue-a imediatamente, crie uma substituta, atualize a aplicação que a utiliza e verifique Activities e o faturamento em busca de uso inesperado. Não espere uma rotação agendada.

### Defina datas de expiração {#set-expiration-dates}

Para acessos temporários (pipelines de CI/CD, acesso de terceirizados, demonstrações), defina uma data de expiração para que a chave pare de funcionar automaticamente.

## Solução de problemas {#troubleshooting}

| Erro | Causa | Solução |
|-------|-------|-----|
| `401 - missing API key` | Nenhuma chave foi enviada na requisição | Adicione um cabeçalho `Authorization: Bearer <key>` |
| `401 - invalid API key` | A chave não existe | Verifique erros de digitação e confirme que a chave completa foi incluída |
| `401 - API key has been revoked` | A chave foi revogada permanentemente no Console | Crie uma chave substituta |
| `401 - API key has expired` | A chave passou da data de expiração | Crie uma nova chave ou estenda a expiração |
| `402 - API key spending limit exceeded` | A chave atingiu o limite de gastos configurado | Aumente o limite ou use outra chave autorizada |
| `403 - insufficient_scope` | Uma credencial com escopo restrito não pode chamar este endpoint | Use uma chave autorizada para o endpoint |

## Próximos passos {#next-steps}

- [**Primeira chamada à API**](/getting-started/first-call) — Faça uma chamada à API detalhada, com explicação completa da requisição e da resposta
- [**Autenticação**](/api-reference/authentication) — Cabeçalhos suportados, ciclo de vida e erros específicos de cada protocolo
- [**Referência da API**](/api-reference/) — Documentação completa dos endpoints

