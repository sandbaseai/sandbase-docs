---
i18nSource: 28b1ef75a197824a
title: Conectar ferramentas de IA
description: Dê ao Claude Code, Codex, Cursor, Kiro e outras ferramentas de IA acesso ao catálogo de Models e APIs da SandBase com um único prompt ou comando de CLI.
---

# Conectar ferramentas de IA {#connect-ai-tools}

A página [AI tools](https://www.sandbase.ai/console/setup) do Console (**Build → AI tools**) conecta a SandBase ao agente ou à ferramenta de IA que você já usa. As ferramentas conectadas podem pesquisar o catálogo de Models e APIs da SandBase, ler o schema de entrada e o preço de cada ferramenta e executá-la. Cada chamada é cobrada do workspace ativo.

Os clientes suportados incluem Claude Code, Codex, Cursor, Kiro IDE e Kiro CLI, Windsurf, Gemini CLI, OpenCode, Qwen Code, Warp, Amp, Crush, OpenClaw, Hermes, Claude Desktop e ChatGPT. A página AI tools mostra a lista atual.

## Início rápido: cole um prompt {#quick-start-paste-one-prompt}

Cole esta linha no seu agente:

```text
set up https://www.sandbase.ai/SKILL.md
```

O agente lê a Skill da SandBase, instala a CLI e pede que você aprove um único login no navegador. Você não precisa colar nenhuma chave de API. Quando o agente informar que o cliente está configurado, inicie uma nova sessão ou reinicie o aplicativo para que as ferramentas `sandbase_*` sejam carregadas.

A Skill exige Node.js 20 ou mais recente na máquina que executa o agente.

## Outras formas de conectar {#other-ways-to-connect}

### CLI {#cli}

Conecte pelo terminal. Sem `--client`, a CLI configura todos os clientes suportados que encontrar:

```sh
npx -y @sandbaseai/cli@latest connect
```

Para configurar um único cliente, informe o id dele, por exemplo `codex`, `claude-code`, `cursor` ou `kiro`:

```sh
npx -y @sandbaseai/cli@latest connect --client codex
```

O script de instalação executa o mesmo comando:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --client codex
```

Para listar os clientes que o instalador reconhece sem alterar a configuração local:

```sh
curl -fsSL https://sandbase.ai/install.sh | sh -s -- --list-agents
```

`connect` abre a autorização no navegador, cria uma chave **CLI Login** para o workspace que você aprovar e grava apenas a configuração de cliente pertencente à SandBase. A [SandBase CLI](https://github.com/sandbaseai/cli), de código aberto, documenta cada cliente.

### Clientes MCP configurados manualmente {#mcp-clients-you-configure-by-hand}

Usuários conectados veem o endereço do servidor MCP em **Other ways to connect** na página [AI tools](https://www.sandbase.ai/console/setup). Autentique-o com uma [chave de API](/getting-started/api-keys) de **Developer → API Keys** e guarde a chave na configuração de segredos do cliente.

## Verificar a conexão {#verify-the-connection}

A instalação ou a autorização, por si só, não comprovam que um cliente está conectado. Confirme que:

- o servidor ou conector da SandBase aparece no cliente
- as ferramentas `sandbase_*` podem ser descobertas em uma nova sessão
- uma requisição segura em linguagem natural é concluída com sucesso

Para clientes gerenciados pela CLI, execute o diagnóstico depois de reconectar ou alterar a configuração:

```sh
npx -y @sandbaseai/cli doctor --client codex
```

`doctor` verifica a credencial local, a entrada MCP e a Skill e, em seguida, faz uma chamada de ida e volta à SandBase. Faça sempre a chamada de ferramenta final dentro do próprio cliente.

As execuções feitas pelas ferramentas conectadas aparecem em [Activities](https://www.sandbase.ai/console/activities) com o respectivo custo.

## Solução de problemas {#troubleshooting}

| Problema | O que verificar |
|---|---|
| As ferramentas não aparecem | Inicie uma nova sessão do cliente ou reinicie o aplicativo, execute `npx -y @sandbaseai/cli doctor --client <client>` e tente novamente. |
| A autorização está ausente | Execute `connect` novamente e aprove o login no navegador para o workspace que você quer cobrar. |
| As chamadas falham com HTTP 402 | Adicione crédito em [Billing](https://www.sandbase.ai/console/billing) para o workspace ativo. |

## Remover a configuração gerenciada {#remove-the-managed-configuration}

Remova apenas a entrada pertencente à SandBase de um cliente:

```sh
npx -y @sandbaseai/cli unregister --client codex
```

O comando remove apenas a configuração cuja propriedade da SandBase ele consegue verificar e mantém inalteradas as entradas não relacionadas ou gerenciadas pelo usuário. Depois, revogue a chave **CLI Login** correspondente em **Developer → API Keys** se não precisar mais dela.

## Código-fonte e suporte {#source-and-support}

- [Código-fonte](https://github.com/sandbaseai/cli)
- [Pacote npm](https://www.npmjs.com/package/@sandbaseai/cli)
- [Perguntas e exemplos](https://github.com/sandbaseai/cli/discussions)
- [Relatar bugs](https://github.com/sandbaseai/cli/issues/new/choose)

## Próximos passos {#next-steps}

- [Catálogo de Models e APIs](https://www.sandbase.ai/models)
- [Tutoriais de Skills](/guides/skills/)
- [Criar Agent](/agents/)

