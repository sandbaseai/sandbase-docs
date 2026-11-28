---
i18nSource: 0d7d66842e233794
title: Início rápido do Sandbox com o SDK da E2B
description: Conecte os SDKs oficiais da E2B para JavaScript e Python à SandBase, execute comandos, leia e grave arquivos e gerencie um sandbox com segurança.
---

<script setup>
import SandboxPromo from '@theme/SandboxPromo.vue'
</script>

# Início rápido do Sandbox com o SDK da E2B {#sandbox-quickstart-with-the-e2b-sdk}

<SandboxPromo />

Use o SDK oficial da E2B com a sua chave de API da SandBase para criar um sandbox isolado, executar um comando e ler e gravar arquivos. Este guia é voltado para os **SDKs da E2B para JavaScript e Python 2.51.0**.

Para criar e acompanhar pelo navegador, entre no [Sandbox Console](https://www.sandbase.ai/console/sandboxes) para criar uma instância e ver o status, os logs e as métricas dela. Siga os passos com o SDK abaixo para integrar à sua aplicação ou leia a [visão geral do produto Sandbox](https://www.sandbase.ai/sandbox).

## 1. Configurar o SDK oficial {#_1-configure-the-official-sdk}

[Crie uma chave de API da SandBase no Console](https://www.sandbase.ai/console/keys) e configure as variáveis de ambiente padrão da E2B. O SDK oficial as lê automaticamente, tanto em JavaScript quanto em Python.

| Variável de ambiente | Valor |
|---|---|
| `E2B_API_KEY` | A sua chave de API da SandBase, de [Developer → API Keys](https://www.sandbase.ai/console/keys) |
| `E2B_API_URL` | `https://sandbox.sandbase.ai` |
| `E2B_DOMAIN` | `sandbox.sandbase.ai` |
| `E2B_DEBUG` | `false` |
| `E2B_SANDBOX_URL` | Deixe sem definir para que o SDK use o endereço do plano de dados de cada sandbox |

```bash
# Inject your SandBase key as E2B_API_KEY through your environment or secret manager.
export E2B_API_URL="https://sandbox.sandbase.ai"
export E2B_DOMAIN="sandbox.sandbase.ai"
export E2B_DEBUG="false"
unset E2B_SANDBOX_URL
```

Se você já guarda a chave em `SANDBASE_API_KEY`, reutilize-a:

```bash
export E2B_API_KEY="$SANDBASE_API_KEY"
```

Você só precisa da sua chave de API da SandBase. Use uma chave comum da SandBase habilitada para acesso ao Sandbox; uma chave restrita a outra capacidade pode ser rejeitada. Consulte [Chaves de API](/getting-started/api-keys).

### O código E2B existente pode ficar como está? {#can-existing-e2b-code-stay-unchanged}

Sim, para as operações suportadas, quando a sua aplicação já lê as configurações de conexão do SDK a partir do ambiente e o template dela está disponível na SandBase. Mantenha o SDK oficial e as suas chamadas atuais; altere apenas a chave, a URL da API e o domínio indicados acima. Opções de conexão explícitas no código da aplicação têm precedência sobre as variáveis de ambiente, então remova ou atualize qualquer endpoint, domínio ou chave de provedor da E2B fixados no código.

Defina **ambos** `E2B_API_URL` e `E2B_DOMAIN`. Com apenas o domínio, o SDK 2.51.0 deriva um host de API com um prefixo `api.` adicional. `E2B_SANDBOX_URL` substitui o endereço de comandos/arquivos de cada instância; não o defina como a origem da API de controle. O modo de depuração altera a seleção de endereços do SDK para desenvolvimento local, então mantenha-o desativado para este serviço HTTPS.

A API de controle cria e gerencia instâncias. Comandos, arquivos e portas da aplicação usam subdomínios por instância em `sandbox.sandbase.ai`. Não acrescente o prefixo `/v1` da API de modelos. Uma requisição bem-sucedida à API de controle, por si só, não comprova o acesso a comandos/arquivos nem todos os recursos do provedor.

Os exemplos leem as variáveis de ambiente do processo. Um arquivo `.env` só funciona se a sua aplicação ou o seu launcher o carregar antes de usar o SDK.

### Escolher um template {#choose-a-template}

Use a sua chave da SandBase para listar os templates visíveis para a sua organização:

```bash
curl --fail --silent --show-error 'https://sandbox.sandbase.ai/v2/templates?limit=100' \
  -H "X-API-Key: $E2B_API_KEY"
```

Escolha um template com `buildStatus: "ready"` e copie o `templateID` dele. Os nomes de exibição ficam em `names` ou `aliases`; se ambos estiverem vazios, use o ID. O campo `public` diferencia templates públicos de templates privados visíveis para a sua organização.

A resposta é um array. Se os cabeçalhos da resposta incluírem `X-Next-Token`, passe o valor dele no parâmetro de consulta `nextToken` para obter a próxima página.

Defina o ID do template selecionado:

```bash
export SANDBASE_TEMPLATE_ID="YOUR_TEMPLATE_ID"
```

`SANDBASE_TEMPLATE_ID` é uma variável usada pelos exemplos abaixo, e não uma configuração nativa do SDK da E2B. Os exemplos a passam explicitamente para `Sandbox.create`. O código existente pode manter o argumento de template se esse ID ou nome estiver disponível na SandBase. Não presuma que um ID de template da E2B original ou o `base` padrão do SDK esteja disponível; se a lista estiver vazia, solicite acesso a templates para a sua organização.

## 2. Criar, executar e limpar {#_2-create-execute-and-clean-up}

Estes exemplos criam um recurso real. Eles usam um tempo de vida de dois minutos e excluem a instância explicitamente no `finally`. Execute um exemplo primeiro e confirme a limpeza antes de executá-lo de novo.

### JavaScript {#javascript}

Use Node.js 22 ou mais recente em um diretório de aplicação:

```bash
npm install --save-exact e2b@2.51.0
```

Salve como `sandbox-example.mjs`:

```js
import { randomUUID } from 'node:crypto';
import { Sandbox } from 'e2b';

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing ${name}`);
  return value;
}

const options = {
  requestTimeoutMs: 30_000,
  retries: 0,
};
const template = required('SANDBASE_TEMPLATE_ID');
const runId = randomUUID();
let sandbox;

// Keep this identifier if creation times out before returning an instance ID.
console.log('Run ID:', runId);
try {
  sandbox = await Sandbox.create(template, {
    ...options,
    timeoutMs: 120_000,
    metadata: { quickstartRunId: runId },
  });
  console.log('Sandbox ID:', sandbox.sandboxId);

  const result = await sandbox.commands.run('printf hello-sandbase', {
    timeoutMs: 15_000,
  });
  if (result.exitCode !== 0 || result.stdout !== 'hello-sandbase') {
    throw new Error('Command verification failed');
  }

  const path = '/tmp/sandbase-hello.txt';
  await sandbox.files.write(path, 'hello from SandBase');
  if (await sandbox.files.read(path) !== 'hello from SandBase') {
    throw new Error('File verification failed');
  }
  console.log('Command and file checks passed');
} catch {
  console.error('Sandbox example failed; retain the run ID for troubleshooting');
  process.exitCode = 1;
} finally {
  if (sandbox) {
    try {
      await Sandbox.kill(sandbox.sandboxId, options);
      console.log('Sandbox cleanup completed');
    } catch {
      console.error('Cleanup failed; delete the recorded Sandbox ID');
      process.exitCode = 1;
    }
  }
}
```

Execute com as variáveis de ambiente do SDK e o template selecionado configurados:

```bash
node sandbox-example.mjs
```

### Python {#python}

Instale a versão fixada do SDK no seu ambiente Python:

```bash
python -m pip install 'e2b==2.51.0'
```

Salve como `sandbox_example.py`:

```python
import os
import sys
import uuid
from e2b import Sandbox

options = {
    "request_timeout": 30,
}
template = os.environ["SANDBASE_TEMPLATE_ID"]
run_id = str(uuid.uuid4())
sandbox = None
failed = False

print("Run ID:", run_id)
try:
    sandbox = Sandbox.create(
        template, timeout=120,
        metadata={"quickstartRunId": run_id}, **options,
    )
    print("Sandbox ID:", sandbox.sandbox_id)

    result = sandbox.commands.run("printf hello-sandbase", timeout=15)
    if result.exit_code != 0 or result.stdout != "hello-sandbase":
        raise RuntimeError("Command verification failed")

    path = "/tmp/sandbase-hello.txt"
    sandbox.files.write(path, "hello from SandBase")
    if sandbox.files.read(path) != "hello from SandBase":
        raise RuntimeError("File verification failed")
    print("Command and file checks passed")
except Exception:
    print("Sandbox example failed; retain the run ID for troubleshooting")
    failed = True
finally:
    if sandbox is not None:
        try:
            Sandbox.kill(sandbox.sandbox_id, **options)
            print("Sandbox cleanup completed")
        except Exception:
            print("Cleanup failed; delete the recorded Sandbox ID")
            failed = True

sys.exit(1 if failed else 0)
```

```bash
python sandbox_example.py
```

O sucesso significa que a verificação de comandos/arquivos e a limpeza foram concluídas. Mantenha os IDs de execução e de sandbox dentro da sua organização. Não registre o objeto do SDK em log: ele pode conter tokens de acesso.

Se a criação atingir o tempo limite sem retornar um ID, o recurso ainda pode existir. Peça ao seu operador para localizá-lo usando os metadados `quickstartRunId` antes de criar outro. Um tempo limite ou um processo interrompido não confirma a exclusão; o `finally` não é executado após o encerramento forçado do processo.

## 3. Estender o tempo de vida ou pausar e reconectar {#_3-extend-the-lifetime-or-pause-and-reconnect}

Insira estes trechos no bloco `try` do exemplo correspondente, depois da verificação de arquivos e antes da limpeza. Pausar/retomar precisa ser suportado pelo template e pelo provedor selecionados.

O JavaScript usa **milissegundos** para esses timeouts do SDK:

```js
await sandbox.setTimeout(300_000);
const id = sandbox.sandboxId;
await sandbox.pause();
sandbox = await Sandbox.connect(id, { ...options, timeoutMs: 120_000 });
if (await sandbox.files.read('/tmp/sandbase-hello.txt') !== 'hello from SandBase') {
  throw new Error('File did not survive pause and reconnect');
}
```

O Python usa **segundos**:

```python
sandbox.set_timeout(300)
sandbox_id = sandbox.sandbox_id
sandbox.pause()
sandbox = Sandbox.connect(sandbox_id, timeout=120, **options)
if sandbox.files.read("/tmp/sandbase-hello.txt") != "hello from SandBase":
    raise RuntimeError("File did not survive pause and reconnect")
```

A reconexão retorna um novo objeto do SDK e novas credenciais de sessão. Use esse objeto para os comandos e arquivos seguintes. Excluir um sandbox encerra o ciclo de vida dele; este guia não garante a persistência do armazenamento após a exclusão. O tempo de vida do sandbox e o timeout de um comando ou requisição HTTP individual são configurações diferentes.

## 4. Acessar portas da aplicação {#_4-access-application-ports}

Depois que a sua aplicação estiver escutando dentro do sandbox, use `sandbox.getHost(port)` em JavaScript ou `sandbox.get_host(port)` em Python para obter o host. O tráfego da aplicação exige o cabeçalho `e2b-traffic-access-token`, com `sandbox.trafficAccessToken` ou `sandbox.traffic_access_token` da conexão atual.

O host, sozinho, não autoriza o acesso. O seu cliente HTTP ou WebSocket precisa enviar o cabeçalho; abrir a URL em uma aba do navegador não o adiciona. Trate tokens de tráfego e URLs de arquivos assinadas como credenciais e mantenha-os fora de logs e links compartilhados. O acesso a portas precisa ser suportado pelo ambiente de sandbox selecionado.

## Solução de problemas {#troubleshooting}

| Sintoma | O que verificar |
|---|---|
| Erro de autenticação ou de escopo | Validade da chave da SandBase, acesso da organização e escopo da chave |
| Template não encontrado | O ID/nome exato do template habilitado e a visibilidade dele para a sua organização |
| A criação funciona, mas comandos/arquivos falham | A sua conexão de rede e as credenciais da sessão atual; reconecte e entre em contato com o suporte se o problema persistir |
| As requisições vão para o serviço errado | `E2B_API_URL`, `E2B_DOMAIN` e quaisquer opções do SDK fixadas no código que os substituam |
| O acesso falha após a pausa | Reconecte e use o objeto do SDK retornado |
| A porta da aplicação rejeita uma requisição | Se a aplicação está pronta e o cabeçalho com o token de tráfego atual |
| `unsupported_operation` | O provedor selecionado não oferece suporte a essa operação; verifique a disponibilidade antes de depender dela |
| A resposta da criação é desconhecida | Reconcilie o ID de execução registrado antes de criar outra instância |
| A limpeza falha | Tente excluir novamente o ID de instância registrado; não execute todo o fluxo de criação de novo |

Os exemplos cobrem o fluxo básico de comandos/arquivos. Builds de templates, snapshots, eventos, webhooks e redes avançadas exigem verificações de capacidade separadas. Instalar um SDK da E2B, por si só, não comprova compatibilidade total com todos os provedores.

## Referências do SDK {#sdk-references}

- [Documentação da E2B](https://e2b.dev/docs)
- [SDK da E2B para JavaScript 2.51.0](https://www.npmjs.com/package/e2b/v/2.51.0)
- [SDK da E2B para Python 2.51.0](https://pypi.org/project/e2b/2.51.0/)

