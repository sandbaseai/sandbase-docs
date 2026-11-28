---
i18nSource: 8cb9626a2127cb8d
title: Início rápido
description: "Escolha como usar a SandBase: na plataforma, pela API ou com o seu Agent. Encontre Skills e Tools, siga as etapas e comece pelos repositórios do SDK ou da CLI."
pageClass: quickstart-page
---

# Início rápido {#quick-start}

## Escolha como você quer usar a SandBase {#connect}

Estas são **três formas alternativas de começar**, e não três etapas que você precisa concluir. Use a mesma conta e o mesmo workspace da SandBase em todas elas.

<QuickstartPaths />

Precisa apenas de uma tarefa pronta? [Explore as Tools](#use-tools) ou [escolha uma Skill](#use-skills). Você pode navegar pelos catálogos públicos e pela documentação antes de entrar.

### Comece pelos repositórios open source {#start-from-the-open-source-repositories}

- **[SandBase — SDKs e exemplos](https://github.com/sandbaseai/sandbase)**: clientes em Python, TypeScript e Go, exemplos de API e fluxos de trabalho de Agents hospedados. Use quando estiver criando sua própria aplicação.
- **[SandBase CLI e MCP](https://github.com/sandbaseai/cli)**: instale e conecte sua ferramenta de IA, ou descubra e execute recursos pelo terminal. Use com o seu Agent existente.

## Antes de começar: entre na sua conta {#create-account}

Entre antes de usar um Playground, executar uma Skill hospedada ou criar uma chave de API. Ferramentas gratuitas que funcionam sem conta podem ser usadas diretamente. **Já entrou? Pule esta etapa** e verifique se o menu da conta mostra o workspace que você pretende usar.

A SandBase usa GitHub ou Google. Não há cadastro separado com e-mail e senha.

1. Abra [Criar conta / Entrar](https://www.sandbase.ai/login){target="_blank"}.
2. Conclua a verificação de segurança e escolha **Sign in with GitHub** ou **Sign in with Google**.
3. Aprove o acesso na janela do provedor.
4. Volte à página que você estava usando ou abra o [Console](https://www.sandbase.ai/console){target="_blank"}.

O primeiro login cria sua conta e um **workspace pessoal**. Você não precisa criar uma organização para experimentar a SandBase.

Se aparecer um crédito de boas-vindas, você pode começar sem adicionar uma forma de pagamento. O card **Balance** no Dashboard do Console e a página [Billing](https://www.sandbase.ai/console/billing){target="_blank"} mostram o saldo atual.

## Na plataforma {#use-on-website}

Escolha esta opção se quiser experimentar um Model, uma API ou um Agent primeiro no navegador, sem instalar cliente e sem código.

1. Entre e abra o catálogo:
   - [Modelos de linguagem](https://www.sandbase.ai/models){target="_blank"}
   - [Modelos de imagem e vídeo](https://www.sandbase.ai/models/image-video){target="_blank"}
   - [APIs](https://www.sandbase.ai/apis){target="_blank"}
   - [Agents](https://www.sandbase.ai/agents){target="_blank"}
2. Abra a página de detalhes de um modelo ou API e selecione **Playground**, quando disponível.
3. Informe as entradas obrigatórias, como um prompt, uma imagem, uma consulta de busca ou uma URL. Confira o preço exibido antes de executar.
4. Execute a requisição e veja o texto, os dados, a imagem, o vídeo ou o status da tarefa retornados.

Você não precisa criar uma chave de API separada para o Playground do site. Se um recurso não oferecer Playground, use a aba **API** dele e siga o caminho da API abaixo.

## Pela API {#call-api}

Escolha esta opção se estiver adicionando um recurso ao seu app.

1. Reutilize uma chave válida do workspace pretendido ou crie uma [chave de API](/getting-started/api-keys) em [Developer → API Keys](https://www.sandbase.ai/console/keys){target="_blank"} com **New key**. Copie-a imediatamente; ela é exibida apenas uma vez.
2. Filtre o catálogo e abra uma página de detalhes:
   - [Modelos de linguagem](https://www.sandbase.ai/models){target="_blank"} — filtre por provedor, recursos, contexto e preço
   - [Modelos de imagem e vídeo](https://www.sandbase.ai/models/image-video){target="_blank"} — filtre modelos multimodais como text-to-image, image-to-image, text-to-video e image-to-video
   - [APIs](https://www.sandbase.ai/apis){target="_blank"} — filtre recursos de API por plataforma e fonte de dados
3. Abra a aba **API**, copie a requisição de exemplo e preencha os campos obrigatórios desse endpoint.
4. Armazene sua chave da SandBase em uma variável de ambiente do servidor e execute a requisição. Não a coloque em código do navegador nem em um repositório público.
5. Confira a resposta. Para uma tarefa assíncrona, siga o exemplo de polling de status do endpoint até que ela seja concluída.

Exemplo de chamada a um modelo de linguagem para **Bash / zsh** (macOS, Linux ou Windows com WSL). Substitua a chave de exemplo localmente. Para outros ambientes, use os exemplos em Python, TypeScript ou Go do repositório abaixo; comandos de shell não são intercambiáveis com o PowerShell.

```bash
export SANDBASE_API_KEY="sk-YOUR_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v4-flash",
    "messages": [{"role": "user", "content": "Reply with one sentence explaining what an API is."}]
  }'
```

Comece pelo código: [SDKs e exemplos da SandBase no GitHub](https://github.com/sandbaseai/sandbase).

Saiba mais: [Primeira chamada de API](/getting-started/first-call).

## Com o seu Agent {#use-in-ai-tool}

Escolha esta opção se você usa Claude Code, Codex, Cursor, Kiro ou outro cliente suportado e quer os Models e APIs da SandBase dentro desse app.

**Para configuração local automática:** seu cliente precisa conseguir executar comandos, e a máquina dele precisa de Node.js 20+ com npm. Se você usa um cliente apenas de chat, siga as [instruções de conexão específicas do cliente](/setup/).

1. Abra [Build → AI tools](https://www.sandbase.ai/console/setup){target="_blank"} no Console.
2. Cole esta linha no chat do seu assistente de IA e diga a ele o que você quer criar. Esta é uma instrução de chat, e não um comando de shell:

   ```text
   set up https://www.sandbase.ai/SKILL.md
   ```

3. Aprove o login no navegador que o agente abrir. Não há chave de API para colar.
4. Inicie uma nova sessão ou reinicie o app para que as ferramentas da SandBase sejam carregadas.
5. Peça ao agente para descobrir e inspecionar a ferramenta relevante e depois fazer uma requisição limitada, dentro da sua autorização e do seu orçamento. Para desenvolvimento, peça que ele integre a resposta ao seu projeto e forneça o comando de execução e os resultados reais dos testes. Apenas a descoberta não comprova uma chamada de API de negócio.

Prefere o terminal? Execute `npx -y @sandbaseai/cli@latest connect`. Ele configura os clientes suportados que detectar; para configurar apenas um, use `npx -y @sandbaseai/cli@latest connect --client codex` (substitua `codex` pelo seu cliente suportado). Depois, reinicie esse cliente. Confira o workspace selecionado antes de uma execução paga.

Por exemplo, você pode pedir:

> Encontre uma API da SandBase para pesquisar posts públicos no X sobre agentes de IA. Inspecione primeiro as entradas obrigatórias e o preço e me diga o custo de uma requisição antes de executá-la. Mantenha os links das fontes originais no resultado.

Código-fonte e instruções de instalação: [SandBase CLI e MCP no GitHub](https://github.com/sandbaseai/cli).

Saiba mais: [Conectar ferramentas de IA](/setup/).

### Deixe seu assistente de IA ajudar você a criar {#start-with-your-agent}

A [Skill de configuração](https://www.sandbase.ai/SKILL.md) orienta seu agente de acordo com a sua situação atual: sem conta ainda, com uma chave de API existente, com uma ferramenta já conectada, com um projeto existente ou com um novo recurso. Ela verifica as entradas e o preço do endpoint, ajuda a implementar a integração e distingue a configuração de uma chamada verificada e de um recurso funcionando. Diga a ela seu objetivo e qualquer limite de gastos; não cole sua chave no chat.

Já tem uma chave ou um projeto? Diga isso; você não precisa começar do zero. Por exemplo: “Tenho uma chave da SandBase. Adicione uma consulta de tráfego do Similarweb a este projeto; inspecione a API e mostre primeiro o custo do teste ao vivo.” Um assistente que não consegue executar comandos nem carregar ferramentas precisa do [caminho de configuração específico do cliente](/setup/).

[Dê ao seu agente o Início rápido em Markdown](https://www.sandbase.ai/quickstart.md) ou use as etapas abaixo. Instalar a Skill de configuração não cria, por si só, um Agent hospedado.

### Opcional: execute um Agent hospedado na SandBase {#build-agent}

Escolha esta opção se o trabalho tiver várias etapas ou precisar ser reutilizado.

1. Abra [Build → Agents](https://www.sandbase.ai/console/agents){target="_blank"} e selecione **Create**.
2. Preencha **Overview** e **Instructions**.
3. Escolha um **Model**.
4. Adicione Skills e ferramentas MCP em **Capabilities** e depois defina o **Runtime**.
5. Selecione **Create & Chat** para testá-lo em uma Session.
6. Chame a versão testada a partir do seu app pela aba **API** do Agent.

Saiba mais: [Build Agent](/agents/). Para fazer o mesmo via código com o SDK oficial da OpenAI, veja [Compatibilidade com a OpenAI](/agents/openai-compatibility).

## Skills, Tools e outras formas de criar {#skills-and-tools}

Escolha o recurso que corresponde à sua tarefa. Você não precisa instalar uma Skill nem criar um Agent hospedado para usar uma API.

- **[Tools](https://www.sandbase.ai/tools):** conclua uma tarefa específica em uma interface pronta, como formatar texto ou consultar dados públicos.
- **[Skills](https://www.sandbase.ai/skills):** dê a um agente um fluxo de trabalho reutilizável com instruções, scripts e exemplos.
- **Models e APIs:** chame um recurso a partir de um Playground, do seu código ou de um agente conectado. Explore [modelos de linguagem](https://www.sandbase.ai/models), [imagem e vídeo](https://www.sandbase.ai/models/image-video) ou [APIs de dados](https://www.sandbase.ai/apis).
- **[Agents hospedados](/agents/):** configure e execute um agente reutilizável na SandBase.
- **[Sandboxes](/sandbox/):** dê ao código um ambiente isolado para executar e trabalhar com arquivos.

### Usar uma Tool {#use-tools}

1. Abra [Tools](https://www.sandbase.ai/tools) e escolha a tarefa que você quer concluir.
2. Leia os requisitos de entrada da ferramenta e o rótulo de preço ou cota. Utilitários gratuitos podem funcionar sem conta; ferramentas de dados exigem login na SandBase para executar, e testes de modelos podem exigir sua própria chave.
3. Informe o texto, a URL, o arquivo ou outras entradas solicitadas e use a ação de execução da ferramenta.
4. Revise a saída e use a ação de copiar ou baixar, quando disponível. Para uma ferramenta de dados, use a API vinculada e o exemplo de requisição se quiser automatizar a mesma tarefa.

**A cota diária gratuita é compartilhada pelo workspace**, e não uma franquia separada para cada ferramenta. Confira a elegibilidade e o preço exibido antes de executar; um utilitário gratuito não torna gratuita uma chamada de modelo ou de API.

### Usar uma Skill {#use-skills}

1. Abra [Skills](https://www.sandbase.ai/skills), escolha um fluxo de trabalho e leia seus exemplos, entradas obrigatórias e dependências.
2. Escolha uma das opções disponíveis na página de detalhes dessa Skill:
   - **Executar online:** entre e execute o exemplo hospedado, quando oferecido. Acompanhe o progresso e abra a saída ou os arquivos resultantes. Confira a franquia exibida; a disponibilidade e os limites variam conforme a Skill.
   - **Instalar / Baixar:** entre para baixar o pacote, quando oferecido. Extraia o pacote completo em uma pasta de trabalho e siga as instruções de instalação ou peça ao seu agente local para ler o `SKILL.md`.
3. Para uso local, informe sua tarefa, as entradas, a saída desejada e o limite de gastos. Conecte a SandBase usando o [caminho do Agent](#use-in-ai-tool); se os scripts da Skill exigirem uma chave, configure-a no ambiente de execução em vez de colá-la no chat.
4. Revise o resultado real. Baixar uma Skill ou conectar seu agente não significa que o fluxo de trabalho foi executado com sucesso.

A **Skill de configuração** da SandBase conecta seu cliente; as Skills do catálogo descrevem fluxos de trabalho individuais. Confira as dependências e o cliente suportado de cada Skill antes de instalar. Chamadas de modelos e APIs usadas por um fluxo de trabalho local podem gerar cobranças de uso.

Veja [Usar uma Skill localmente](/guides/skills/local-use) para um passo a passo completo, incluindo pastas de entrada e entregas salvas.

## Opcional: compartilhe um workspace de equipe {#create-organization}

Chaves de API, uso e cobrança pertencem a uma organização. Fique no workspace pessoal se estiver avaliando sozinho. Crie uma equipe quando várias pessoas forem compartilhar chaves e gastos.

| Workspace | Quando usar |
|---|---|
| **Pessoal** | Criado automaticamente no primeiro login. Um por usuário. |
| **Equipe** | Membros, chaves e saldo compartilhados. Crie um para uma empresa ou um projeto. |

### Criar uma equipe {#create-team}

1. Abra [Create team](https://www.sandbase.ai/console/members?create=1){target="_blank"} ou escolha **Create Team** no menu da conta, no canto superior direito do Console.
2. Informe um **Team name** e selecione **Create team**.
3. Confirme que o menu da conta agora mostra essa equipe como o workspace ativo.
4. Em **Developer → Team**, selecione **Add member**, informe o **Account email** de uma conta SandBase existente e escolha o **Workspace role** (Member ou Admin).

A pessoa convidada já precisa ter uma conta na SandBase. Se não tiver, envie [esta página](/getting-started/quickstart) para que ela entre primeiro e, depois, adicione-a.

Se você pertence a mais de uma organização, troque pelo menu da conta. Chaves e cobrança seguem a organização **ativa**. Veja [Organizações](/admin/organizations) para os papéis.

## Confirme que funciona {#confirm-it-works}

Você está pronto quando tudo o que segue for verdadeiro:

- O menu da conta no Console mostra a organização que você pretende usar.
- Você concluiu um caminho: uma chamada de API, uma execução no site, uma ferramenta de IA conectada ou um Agent.
- Uma requisição foi bem-sucedida.

Se a requisição falhar, verifique a organização ativa, a chave e [Erros](/guides/error-handling). Adicione saldo em [Billing](https://www.sandbase.ai/console/billing){target="_blank"} quando o workspace não tiver saldo restante.

### Se você travar {#if-you-get-stuck}

| O que você vê | O que verificar |
| --- | --- |
| Login obrigatório | Entre, volte à página original e verifique o workspace ativo. |
| Chave inválida ou acesso negado | Confirme que a chave pertence ao workspace pretendido e tem acesso ao endpoint. Adicionar créditos não corrige permissões. |
| Saldo insuficiente ou cota esgotada | Leia a resposta: verifique o Billing para um problema de saldo, ou o horário de redefinição exibido para um limite de cota. |
| Nenhuma ferramenta no seu Agent | Inicie uma nova sessão do cliente e siga os diagnósticos em [Conectar ferramentas de IA](/setup/). |
| Tarefa ainda em execução | Acompanhe o status da tarefa retornado ou o indicador de progresso da página. Evite enviar a mesma requisição paga repetidamente. |

## Cobrança e uso {#billing-and-usage}

Depois de entrar, revise os gastos da organização ativa:

<QuickstartResources group="ops" />

## O que fazer em seguida {#next-steps}

<QuickstartResources group="catalog" />

- [Tools](https://www.sandbase.ai/tools) — conclua uma tarefa no navegador
- [Skills](https://www.sandbase.ai/skills) — encontre um fluxo de trabalho de agente reutilizável
- [Chaves de API](/getting-started/api-keys) — crie e rotacione chaves da organização
- [Catálogo de Models e APIs](https://www.sandbase.ai/models) — experimente Models, APIs e Agents no site
- [Conectar ferramentas de IA](/setup/) — dê à sua ferramenta de IA o catálogo da SandBase
- [Build Agent](/agents/) — crie Agents reutilizáveis
- [Referência da API](/api-reference/) — integre com código
