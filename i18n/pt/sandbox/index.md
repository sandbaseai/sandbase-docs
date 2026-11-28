---
i18nSource: 4191d2eb16a594f5
title: Visão geral e recursos do Sandbox
description: Crie sandboxes com o E2B SDK ou o SandBase Console, verifique status, logs e métricas e explore o Playground experimental, que é separado.
---

# Visão geral e recursos do Sandbox {#sandbox-overview-and-capabilities}

O Sandbox oferece ambientes isolados para executar comandos e código e para ler ou gravar arquivos. Pause uma instância, reconecte-se a ela e leia um arquivo de volta para verificar a persistência.

[Início rápido / E2B SDK](./quickstart) · [Abrir o Playground (experimental)](./playground)

Use o [E2B SDK oficial](./quickstart) para integrar o Sandbox à sua aplicação. Entre no [Sandbox Console](https://www.sandbase.ai/console/sandboxes) para criar sandboxes e ver o status, os logs e as métricas das instâncias. Consulte a [visão geral do produto Sandbox](https://www.sandbase.ai/sandbox) para uma introdução. O passo a passo e a tabela de suporte abaixo descrevem o Playground experimental, que é separado.

## Um passo a passo de cinco minutos no Playground {#a-five-minute-playground-walkthrough}

1. Informe uma [API key](/getting-started/api-keys) com permissões de Sandbox. A conexão apenas lê templates e instâncias.
2. Escolha um template disponível, confirme o aviso sobre recursos e crie uma instância de curta duração.
3. Execute o exemplo de informações do sistema ou de Python. Acompanhe a saída e os eventos de processo ao lado do painel de comandos.
4. Grave e verifique um arquivo de texto, pause a instância, retome-a e leia o mesmo arquivo novamente.
5. Examine eventos de ciclo de vida, métricas, logs e registros de tempo de máquina. Exclua sua instância ao terminar.

Atualizar a página limpa as credenciais da página e o histórico local de operações; isso não exclui sandboxes. As instâncias em execução seguem o timeout do servidor. Instâncias pausadas podem manter recursos. Anote os IDs das instâncias e use as ferramentas da sua organização para conciliar e limpar os recursos depois de sair da página.

## Recursos e limites {#capabilities-and-boundaries}

| Recurso | Suporte no Playground |
| --- | --- |
| Criar, listar, pausar, retomar, estender o timeout, excluir | Disponível; os controles de alteração se aplicam apenas a instâncias criadas nesta sessão da página |
| Comandos e arquivos de texto | Disponível; os comandos rodam por até 25 segundos, e a edição de arquivos é limitada a `/tmp/` e 32 KiB |
| Eventos de ciclo de vida, logs, métricas, tempo de máquina | A disponibilidade varia conforme o ambiente; examine os resultados retornados |
| Chat com IA e contexto de conversa | Não integrado; exige configuração de modelo e uma carga de trabalho de Agent |
| PTY, portas de aplicação, webhooks, builds de templates | Não disponível nesta interface |
| Snapshots e fork | Não disponível neste Playground |

A interação com o shell não é chat com IA. Recuperação da instância, persistência de arquivos, sobrevivência de processos e continuidade da conversa são coisas distintas a verificar.

## Entendendo os eventos {#understanding-events}

As entradas **Sandbox lifecycle** são eventos nativos do servidor buscados ao atualizar e podem chegar com atraso. As entradas **Sandbox process** descrevem o início de processos e a saída transmitida. As entradas **Playground** registram a conclusão ou falha de requisições locais; não são eventos de ciclo de vida do serviço.

Uma lista vazia não prova uso zero, e a ausência de eventos não prova que uma operação falhou. Os registros de tempo de máquina não são uma fatura final. Concilie as instâncias após um timeout ou uma conexão interrompida antes de tentar outra requisição de criação.

## Visibilidade dos templates {#template-visibility}

Os templates podem ser públicos ou privados da sua organização. As quantidades não são fixas. Entradas sem nome continuam visíveis, usando aliases ou IDs como rótulos alternativos. O acesso da sua organização e a disponibilidade dos templates determinam quais templates você pode ver e usar.

## Sandboxes e Sessions de Agents {#sandboxes-and-agent-sessions}

As Sessions de Agents rodam na nuvem hospedada do SandBase. Elas são separadas das instâncias de Sandbox que você cria com o E2B SDK, e a Agents API não expõe instâncias de Sandbox. Consulte [Sessions](/agents/sessions).

