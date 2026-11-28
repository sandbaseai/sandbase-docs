---
i18nSource: c922bd433deabf32
title: गाइड
description: SandBase Models, APIs, Agents, Setup, billing, streaming और production reliability के उपयोग के लिए व्यावहारिक guides।
---

# गाइड {#guides}

ये guides production में SandBase के उपयोग के सामान्य patterns कवर करती हैं।

## Models call करें {#call-models}
| Guide | विवरण |
|-------|-------------|
| [Chat Completions](./chat-completions) | OpenAI-compatible chat protocol से SandBase call करें |
| [OpenAI Responses](./openai-responses) | OpenAI-compatible Responses protocol से GPT models call करें |
| [Anthropic Messages](./anthropic-messages) | Anthropic-compatible messages protocol से SandBase call करें |
| [Google Gemini](../api-reference/gemini-generate-content) | Google Gemini-compatible GenerateContent protocol से SandBase call करें |
| [Image और video](./image-video) | साझा asynchronous Run API से images और videos generate करें |
| [Streaming](./streaming) | Compatible Model output को अपने application में stream करें |
| [API Catalog](https://www.sandbase.ai/apis) | API क्षमताएँ और उनके vendor-qualified endpoints देखें |

## Production में चलाएँ {#run-in-production}
| Guide | विवरण |
|-------|-------------|
| [Errors और retries](./error-handling) | विफलताओं को वर्गीकृत करें और केवल तभी retry करें जब operation दोहराना सुरक्षित हो |
| [Rate limits](./rate-limiting) | 429 responses संभालें और request bursts को smooth करें |
| [Concurrency limits](./concurrency-limits) | आपका organization एक साथ कितने tasks चला सकता है |
| [Pricing और usage](./billing) | Credits, usage और cost controls को समझें |

## त्वरित सुझाव {#quick-tips}

- जब user को Codex, Claude, Cursor या Kiro के अंदर tools चाहिए, तो [Setup](/setup/) का उपयोग करें।
- जब आपके app को एक क्षमता चाहिए, तो [Models](https://www.sandbase.ai/models) या [APIs](https://www.sandbase.ai/apis) का उपयोग करें।
- जब काम में कई चरण हों या उसे दोबारा उपयोग करना हो, तो [Build Agent](/agents/) का उपयोग करें।
- Requests और usage को एक साथ देखने के लिए Console में [Activities](https://www.sandbase.ai/console/activities) का उपयोग करें।

