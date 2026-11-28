---
i18nSource: c922bd433deabf32
title: Guias
description: Guias práticos para usar Models, APIs, Agents, Setup, cobrança, streaming e confiabilidade em produção no SandBase.
---

# Guias {#guides}

Estes guias cobrem padrões comuns de uso do SandBase em produção.

## Chamar modelos {#call-models}
| Guia | Descrição |
|-------|-------------|
| [Chat Completions](./chat-completions) | Chame o SandBase pelo protocolo de chat compatível com a OpenAI |
| [OpenAI Responses](./openai-responses) | Chame modelos GPT pelo protocolo Responses compatível com a OpenAI |
| [Anthropic Messages](./anthropic-messages) | Chame o SandBase pelo protocolo de mensagens compatível com a Anthropic |
| [Google Gemini](../api-reference/gemini-generate-content) | Chame o SandBase pelo protocolo GenerateContent compatível com o Google Gemini |
| [Imagem e vídeo](./image-video) | Gere imagens e vídeos pela Run API assíncrona compartilhada |
| [Streaming](./streaming) | Faça streaming da saída de modelos compatíveis para sua aplicação |
| [Catálogo de APIs](https://www.sandbase.ai/apis) | Navegue pelas capacidades de API e seus endpoints identificados por fornecedor |

## Executar em produção {#run-in-production}
| Guia | Descrição |
|-------|-------------|
| [Erros e novas tentativas](./error-handling) | Classifique falhas e tente novamente apenas quando for seguro repetir a operação |
| [Limites de taxa](./rate-limiting) | Trate respostas 429 e suavize picos de requisições |
| [Limites de concorrência](./concurrency-limits) | Quantas tarefas sua organização pode executar ao mesmo tempo |
| [Preços e uso](./billing) | Entenda créditos, uso e controles de custos |

## Dicas rápidas {#quick-tips}

- Use o [Setup](/setup/) quando o usuário quiser ferramentas dentro do Codex, Claude, Cursor ou Kiro.
- Use [Models](https://www.sandbase.ai/models) ou [APIs](https://www.sandbase.ai/apis) quando sua aplicação precisar de uma única capacidade.
- Use [Build Agent](/agents/) quando o trabalho tiver várias etapas ou precisar ser reutilizado.
- Use [Activities](https://www.sandbase.ai/console/activities) no Console para revisar requisições e uso em conjunto.

