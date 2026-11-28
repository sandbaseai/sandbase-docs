---
i18nSource: 20679b8b1344acb5
title: Sandbox Playground (experimental)
description: Experimente sandboxes reais da SandBase com sua própria chave de API. Crie, execute comandos, verifique arquivos após pausar e retomar e inspecione eventos do ciclo de vida.
outline: false
aside: false
pageClass: sandbox-playground-page
---

# Sandbox Playground {#sandbox-playground}

Experimente a Sandbox API com sua própria chave. As operações se conectam a **sandbox.sandbase.ai** e podem gerar cobranças.

<ClientOnly>
  <SandboxPlayground />
</ClientOnly>

## Sua chave fica sob seu controle {#your-key-stays-under-your-control}

- **Apenas na memória da página.** Este Playground não salva sua chave de API nem tokens de conexão no armazenamento do navegador ou em cookies, não os coloca em URLs e não os registra na atividade da página nem nos exemplos de requisição.
- **Limpe a qualquer momento.** Selecione **Clear key** para remover a chave, os tokens de conexão e a atividade exibida, mesmo durante uma requisição em andamento. Atualizar ou sair desta página também os remove. Você precisará informar sua chave novamente para se reconectar.
- **Usada apenas nas suas requisições.** Sua chave é transmitida à SandBase para autenticar as operações de Sandbox que você solicita. Limpar esta página não revoga a chave; revogue-a em [Developer → API Keys](https://www.sandbase.ai/console/keys), se necessário.

Essas garantias cobrem o tratamento de credenciais por este Playground. Elas não significam que a atividade da Sandbox ou os registros de uso do lado do serviço sejam apagados. Evite informar segredos em comandos ou arquivos, cujo conteúdo pode permanecer na sua sandbox.

## Limpe os recursos separadamente {#clean-up-resources-separately}

Limpar sua chave não cancela uma operação já recebida pelo serviço nem exclui uma sandbox. Exclua as instâncias ao terminar. Se o resultado de uma criação for desconhecido, verifique suas instâncias antes de criar outra. Guarde os IDs das instâncias de que você precisa para a limpeza antes de limpar esta página.

[Visão geral e recursos](./index) · [Início rápido / E2B SDK](./quickstart)
