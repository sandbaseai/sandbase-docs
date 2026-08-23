<p align="center">
  <h1 align="center">SandBase Docs</h1>
  <p align="center">
    <strong>One API surface for LLMs, image, video, audio, embeddings, real-world APIs, and reusable Agents.</strong>
  </p>
  <p align="center">
    <a href="https://www.sandbase.ai/docs/">Docs</a> ·
    <a href="https://www.sandbase.ai/docs/store/">Store</a> ·
    <a href="https://www.sandbase.ai/console">Console</a> ·
    <a href="https://github.com/sandbaseai/cli">CLI / MCP</a> ·
    <a href="https://blog.sandbase.ai/">Blog</a>
  </p>
  <p align="center">
    <a href="https://github.com/sandbaseai/sandbase-docs/stargazers"><img src="https://img.shields.io/github/stars/sandbaseai/sandbase-docs?style=social" alt="GitHub stars"></a>
    <a href="https://github.com/sandbaseai/sandbase-docs/blob/main/LICENSE"><img src="https://img.shields.io/github/license/sandbaseai/sandbase-docs" alt="Apache-2.0 license"></a>
    <a href="https://www.sandbase.ai/docs/"><img src="https://img.shields.io/badge/docs-live-16a34a" alt="Documentation"></a>
  </p>
</p>

---

SandBase helps developers build AI applications and Agent workflows without maintaining a separate integration for every model, media generator, search provider, or data API.

Use the smallest surface that fits the job:

| Need | Start with |
|---|---|
| OpenAI-compatible LLM and vision calls | [LLM Gateway](https://www.sandbase.ai/docs/api-reference/llm-gateway) |
| Image, video, audio, or embedding jobs | [Model API Reference](https://www.sandbase.ai/docs/model-api-reference/llm-models) |
| Search, scrape, social, business, or other external data | [Store](https://www.sandbase.ai/docs/store/) |
| Reusable, versioned Agent workflows | [Agents](https://www.sandbase.ai/docs/agents/) |
| Codex, Claude Code, Cursor, and other AI clients | [CLI setup](https://www.sandbase.ai/docs/setup/cli) |

The catalog, schemas, prices, and availability can change. Use the live Store and API reference as the source of truth instead of guessing model or API identifiers.

## First LLM call

Create an API key in the [Console](https://www.sandbase.ai/console/keys), export it, and select a current model ID from [Supported Models](https://www.sandbase.ai/docs/models/supported).

```bash
export SANDBASE_API_KEY="sk-sb-YOUR_API_KEY"

curl https://api.sandbase.ai/v1/chat/completions \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "deepseek/deepseek-v3",
    "messages": [
      {"role": "user", "content": "Explain this API response."}
    ]
  }'
```

OpenAI SDK applications can use the same endpoint by changing the API key, base URL, and model:

```python
import os
from openai import OpenAI

client = OpenAI(
    api_key=os.environ["SANDBASE_API_KEY"],
    base_url="https://api.sandbase.ai/v1",
)

response = client.chat.completions.create(
    model="deepseek/deepseek-v3",
    messages=[{"role": "user", "content": "Explain this API response."}],
)

print(response.choices[0].message.content)
```

Compatibility reduces migration work; it does not make every model, parameter, streaming event, or provider-specific feature identical. Follow the [first-call guide](https://www.sandbase.ai/docs/getting-started/first-call) and test the behaviors your application actually uses.

## Run a model or external API

Image, video, audio, embedding, and external API operations use the public run contract documented on each Store detail page. The model/API identifier and input fields are operation-specific.

```bash
curl -X POST https://api.sandbase.ai/v1/run \
  -H "Authorization: Bearer $SANDBASE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "YOUR_CURRENT_MODEL_OR_API_ID",
    "YOUR_REQUIRED_INPUT": "value"
  }'
```

Do not force unlike workloads into one response lifecycle: an LLM may stream tokens, a synchronous data API may return immediately, and a video job may require polling or webhook handling. Check the selected capability's schema and execution mode before integrating it.

## Connect an AI client

The open-source [SandBase CLI](https://github.com/sandbaseai/cli) provides a local MCP bridge for supported AI clients. Use the versioned installation command from the [CLI setup guide](https://www.sandbase.ai/docs/setup/cli), then connect the exact client target listed there.

Skills and execution remain separate:

- [SandBase Skills](https://github.com/sandbaseai/sandbase-skills) package repeatable workflows.
- The CLI/MCP bridge exposes discovery and execution tools to a compatible client.
- [SandBase Harness](https://github.com/sandbaseai/sandbase-harness) is the local-first runtime when Agents need persistent sessions, sandboxed tools, credentials, audit, and replay.

## Documentation map

| Section | What it covers |
|---|---|
| [Getting Started](https://www.sandbase.ai/docs/getting-started/) | API keys, quickstart, and first call |
| [Store](https://www.sandbase.ai/docs/store/) | Models, APIs, Agents, and Skills |
| [Models](https://www.sandbase.ai/docs/models/) | Supported interfaces and capability guidance |
| [API Reference](https://www.sandbase.ai/docs/api-reference/) | Authentication, endpoints, schemas, errors, and webhooks |
| [Agents](https://www.sandbase.ai/docs/agents/) | Reusable Agent definitions, Services, Sessions, and Schedules |
| [Setup](https://www.sandbase.ai/docs/setup/) | Connect AI clients and install capabilities |
| [For AI Tools](https://www.sandbase.ai/docs/for-agents/) | Machine-readable integration guidance |
| [Guides](https://www.sandbase.ai/docs/guides/) | Streaming, errors, rate limits, and billing |

## Repository structure

```text
getting-started/       # first-call onboarding
store/                 # catalog concepts
models/                # model interfaces and capabilities
model-api-reference/   # generated model and external API references
api-reference/         # REST API contracts
agents/                # reusable Agent workflows and services
setup/                 # CLI and client setup
for-agents/            # concise machine-readable guidance
guides/                # operational practices
```

## Develop locally

```bash
npm ci
npm run test:generator
npm run build
npm run dev
```

`npm run test:generator` and the model/API reference generator read the
versioned catalog from the sibling `sandbase-registry` checkout at
`../sandbase-registry/data/`. The public Docs repository does not vendor that
catalog. If you only need to preview already-generated pages, `npm run build`
does not require the sibling checkout; if you are changing generated references,
prepare the matching registry checkout first and run the generator before
committing its outputs.

The site is built with [VitePress](https://vitepress.dev). Production deployment is owned by this repository; see [DEPLOYMENT.md](DEPLOYMENT.md).

## Contributing

Found a missing capability, broken link, unclear schema, or outdated example? Open an [issue](https://github.com/sandbaseai/sandbase-docs/issues) or submit a focused pull request. Do not include API keys, customer data, or provider credentials in examples.

## License

Apache-2.0
