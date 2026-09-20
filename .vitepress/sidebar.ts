import type { DefaultTheme } from 'vitepress'
// ─── Model API Reference (Official Native API) ───────────────
// Navigation is limited to the Official Native API surface plus the OpenAI and
// Anthropic LLM models, promoted to the top level of the sidebar.

const openaiModels: DefaultTheme.SidebarItem[] = [
  { text: 'GPT Image 2.5 Flare', link: '/model-api-reference/official-native-api/openai/gpt-image-2.5-flare' },
  { text: 'GPT Image 2.5 Sunburst', link: '/model-api-reference/official-native-api/openai/gpt-image-2.5-sunburst' },
  { text: 'GPT Image 2', link: '/model-api-reference/official-native-api/openai/gpt-image-2' },
  { text: 'GPT-5.6 Luna Pro', link: '/model-api-reference/llm-models/openai/gpt-5.6-luna-pro' },
  { text: 'GPT-5.6 Luna', link: '/model-api-reference/llm-models/openai/gpt-5.6-luna' },
  { text: 'GPT-5.6 Terra Pro', link: '/model-api-reference/llm-models/openai/gpt-5.6-terra-pro' },
  { text: 'GPT-5.6 Terra', link: '/model-api-reference/llm-models/openai/gpt-5.6-terra' },
  { text: 'GPT-5.6 Sol Pro', link: '/model-api-reference/llm-models/openai/gpt-5.6-sol-pro' },
  { text: 'GPT-5.6 Sol', link: '/model-api-reference/llm-models/openai/gpt-5.6-sol' },
  { text: 'GPT Chat Latest', link: '/model-api-reference/llm-models/openai/gpt-chat-latest' },
  { text: 'GPT-5.5 Pro', link: '/model-api-reference/llm-models/openai/gpt-5.5-pro' },
  { text: 'GPT-5.5', link: '/model-api-reference/llm-models/openai/gpt-5.5' },
  { text: 'GPT-5.4 Image 2', link: '/model-api-reference/llm-models/openai/gpt-5.4-image-2' },
  { text: 'GPT-5.4 Nano', link: '/model-api-reference/llm-models/openai/gpt-5.4-nano' },
  { text: 'GPT-5.4 Mini', link: '/model-api-reference/llm-models/openai/gpt-5.4-mini' },
  { text: 'GPT-5.4 Pro', link: '/model-api-reference/llm-models/openai/gpt-5.4-pro' },
  { text: 'GPT-5.4', link: '/model-api-reference/llm-models/openai/gpt-5.4' },
  { text: 'GPT-5.3 Chat', link: '/model-api-reference/llm-models/openai/gpt-5.3-chat' },
  { text: 'GPT-5.3-Codex', link: '/model-api-reference/llm-models/openai/gpt-5.3-codex' },
  { text: 'GPT Audio', link: '/model-api-reference/llm-models/openai/gpt-audio' },
  { text: 'GPT Audio Mini', link: '/model-api-reference/llm-models/openai/gpt-audio-mini' },
  { text: 'GPT-5.2-Codex', link: '/model-api-reference/llm-models/openai/gpt-5.2-codex' },
  { text: 'GPT-5.2 Chat', link: '/model-api-reference/llm-models/openai/gpt-5.2-chat' },
  { text: 'GPT-5.2 Pro', link: '/model-api-reference/llm-models/openai/gpt-5.2-pro' },
  { text: 'GPT-5.2', link: '/model-api-reference/llm-models/openai/gpt-5.2' },
  { text: 'GPT-5.1-Codex-Max', link: '/model-api-reference/llm-models/openai/gpt-5.1-codex-max' },
  { text: 'GPT-5.1', link: '/model-api-reference/llm-models/openai/gpt-5.1' },
  { text: 'GPT-5.1 Chat', link: '/model-api-reference/llm-models/openai/gpt-5.1-chat' },
  { text: 'GPT-5.1-Codex', link: '/model-api-reference/llm-models/openai/gpt-5.1-codex' },
  { text: 'GPT-5.1-Codex-Mini', link: '/model-api-reference/llm-models/openai/gpt-5.1-codex-mini' },
  { text: 'gpt-oss-safeguard-20b', link: '/model-api-reference/llm-models/openai/gpt-oss-safeguard-20b' },
  { text: 'GPT-5 Image Mini', link: '/model-api-reference/llm-models/openai/gpt-5-image-mini' },
  { text: 'GPT-5 Image', link: '/model-api-reference/llm-models/openai/gpt-5-image' },
  { text: 'o3 Deep Research', link: '/model-api-reference/llm-models/openai/o3-deep-research' },
  { text: 'o4 Mini Deep Research', link: '/model-api-reference/llm-models/openai/o4-mini-deep-research' },
  { text: 'GPT-5 Pro', link: '/model-api-reference/llm-models/openai/gpt-5-pro' },
  { text: 'GPT-5 Codex', link: '/model-api-reference/llm-models/openai/gpt-5-codex' },
  { text: 'GPT-4o Audio', link: '/model-api-reference/llm-models/openai/gpt-4o-audio-preview' },
  { text: 'GPT-5 Chat', link: '/model-api-reference/llm-models/openai/gpt-5-chat' },
  { text: 'GPT-5', link: '/model-api-reference/llm-models/openai/gpt-5' },
  { text: 'GPT-5 Mini', link: '/model-api-reference/llm-models/openai/gpt-5-mini' },
  { text: 'GPT-5 Nano', link: '/model-api-reference/llm-models/openai/gpt-5-nano' },
  { text: 'gpt-oss-120b', link: '/model-api-reference/llm-models/openai/gpt-oss-120b' },
  { text: 'gpt-oss-20b', link: '/model-api-reference/llm-models/openai/gpt-oss-20b' },
  { text: 'o3 Pro', link: '/model-api-reference/llm-models/openai/o3-pro' },
  { text: 'o4 Mini High', link: '/model-api-reference/llm-models/openai/o4-mini-high' },
  { text: 'o3', link: '/model-api-reference/llm-models/openai/o3' },
  { text: 'o4 Mini', link: '/model-api-reference/llm-models/openai/o4-mini' },
  { text: 'GPT-4.1', link: '/model-api-reference/llm-models/openai/gpt-4.1' },
  { text: 'GPT-4.1 Mini', link: '/model-api-reference/llm-models/openai/gpt-4.1-mini' },
  { text: 'GPT-4.1 Nano', link: '/model-api-reference/llm-models/openai/gpt-4.1-nano' },
  { text: 'o1-pro', link: '/model-api-reference/llm-models/openai/o1-pro' },
  { text: 'GPT-4o-mini Search Preview', link: '/model-api-reference/llm-models/openai/gpt-4o-mini-search-preview' },
  { text: 'GPT-4o Search Preview', link: '/model-api-reference/llm-models/openai/gpt-4o-search-preview' },
  { text: 'o3 Mini High', link: '/model-api-reference/llm-models/openai/o3-mini-high' },
  { text: 'o3 Mini', link: '/model-api-reference/llm-models/openai/o3-mini' },
  { text: 'o1', link: '/model-api-reference/llm-models/openai/o1' },
  { text: 'GPT-4o (2024-11-20)', link: '/model-api-reference/llm-models/openai/gpt-4o-2024-11-20' },
  { text: 'GPT-4o (2024-08-06)', link: '/model-api-reference/llm-models/openai/gpt-4o-2024-08-06' },
  { text: 'GPT-4o-mini', link: '/model-api-reference/llm-models/openai/gpt-4o-mini' },
  { text: 'GPT-4o-mini (2024-07-18)', link: '/model-api-reference/llm-models/openai/gpt-4o-mini-2024-07-18' },
  { text: 'GPT-4o', link: '/model-api-reference/llm-models/openai/gpt-4o' },
  { text: 'GPT-4o (2024-05-13)', link: '/model-api-reference/llm-models/openai/gpt-4o-2024-05-13' },
  { text: 'GPT-4 Turbo', link: '/model-api-reference/llm-models/openai/gpt-4-turbo' },
  { text: 'GPT-3.5 Turbo (older v0613)', link: '/model-api-reference/llm-models/openai/gpt-3.5-turbo-0613' },
  { text: 'GPT-4 Turbo Preview', link: '/model-api-reference/llm-models/openai/gpt-4-turbo-preview' },
  { text: 'GPT-4 Turbo (older v1106)', link: '/model-api-reference/llm-models/openai/gpt-4-1106-preview' },
  { text: 'GPT-3.5 Turbo Instruct', link: '/model-api-reference/llm-models/openai/gpt-3.5-turbo-instruct' },
  { text: 'GPT-3.5 Turbo 16k', link: '/model-api-reference/llm-models/openai/gpt-3.5-turbo-16k' },
  { text: 'GPT-3.5 Turbo', link: '/model-api-reference/llm-models/openai/gpt-3.5-turbo' },
  { text: 'GPT-4', link: '/model-api-reference/llm-models/openai/gpt-4' },
  { text: 'GPT-4 (older v0314)', link: '/model-api-reference/llm-models/openai/gpt-4-0314' },
]

const anthropicModels: DefaultTheme.SidebarItem[] = [
  { text: 'Claude Opus 5', link: '/model-api-reference/llm-models/anthropic/claude-opus-5' },
  { text: 'Claude Sonnet 5', link: '/model-api-reference/llm-models/anthropic/claude-sonnet-5' },
  { text: 'Claude Fable 5', link: '/model-api-reference/llm-models/anthropic/claude-fable-5' },
  { text: 'Claude Opus 4.8 (Fast)', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.8-fast' },
  { text: 'Claude Opus 4.8', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.8' },
  { text: 'Claude Opus 4.7 (Fast)', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.7-fast' },
  { text: 'Claude Opus 4.7', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.7' },
  { text: 'Claude Opus 4.6 (Fast)', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.6-fast' },
  { text: 'Claude Sonnet 4.6', link: '/model-api-reference/llm-models/anthropic/claude-sonnet-4.6' },
  { text: 'Claude Opus 4.6', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.6' },
  { text: 'Claude Opus 4.5', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.5' },
  { text: 'Claude Haiku 4.5', link: '/model-api-reference/llm-models/anthropic/claude-haiku-4.5' },
  { text: 'Claude Sonnet 4.5', link: '/model-api-reference/llm-models/anthropic/claude-sonnet-4.5' },
  { text: 'Claude Opus 4.1', link: '/model-api-reference/llm-models/anthropic/claude-opus-4.1' },
  { text: 'Claude Opus 4', link: '/model-api-reference/llm-models/anthropic/claude-opus-4' },
  { text: 'Claude Sonnet 4', link: '/model-api-reference/llm-models/anthropic/claude-sonnet-4' },
  { text: 'Claude 3.7 Sonnet', link: '/model-api-reference/llm-models/anthropic/claude-3.7-sonnet' },
  { text: 'Claude 3.7 Sonnet (thinking)', link: '/model-api-reference/llm-models/anthropic/claude-3.7-sonnet-thinking' },
  { text: 'Claude 3.5 Haiku', link: '/model-api-reference/llm-models/anthropic/claude-3.5-haiku' },
  { text: 'Claude 3 Haiku', link: '/model-api-reference/llm-models/anthropic/claude-3-haiku' },
]

const bytedanceModels: DefaultTheme.SidebarItem[] = [
  { text: 'Seedance 2.5 Official', link: '/model-api-reference/official-native-api/bytedance/seedance-2.5-official' },
  { text: 'Seedance 2.0 Official', link: '/model-api-reference/official-native-api/bytedance/seedance-2.0-official' },
  { text: 'Media Assets for Seedance', link: '/model-api-reference/official-native-api/bytedance/media-assets' },
]

const googleModels: DefaultTheme.SidebarItem[] = [
  { text: 'Gemini Omni Flash Preview', link: '/model-api-reference/official-native-api/google/gemini-omni-flash-preview' },
  { text: 'Gemini Omni 1.1 Flash Preview', link: '/model-api-reference/official-native-api/google/gemini-omni-1.1-flash-preview' },
  { text: 'Gemini 3 Pro Image（Nano Banana Pro）', link: '/model-api-reference/official-native-api/google/gemini-3-pro-image' },
  { text: 'Gemini 3.1 Flash Image（Nano Banana 2）', link: '/model-api-reference/official-native-api/google/gemini-3.1-flash-image' },
]

const modelApiReferenceNav: DefaultTheme.SidebarItem[] = [
  { text: 'Overview', link: '/' },
  { text: 'Quickstart', link: '/getting-started/quickstart' },
  { text: 'OpenAI', collapsed: true, items: openaiModels },
  { text: 'Anthropic', collapsed: true, items: anthropicModels },
  { text: 'ByteDance', collapsed: true, items: bytedanceModels },
  { text: 'Google', collapsed: true, items: googleModels },
]

export const fullModelApiReferenceSidebar = modelApiReferenceNav
export const platformApiReferenceFallbackSidebar = modelApiReferenceNav

export const docsSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'AI-Friendly Docs',
    collapsed: true,
    items: [
      { text: 'AI-Readable Overview', link: '/for-agents/' },
      { text: 'AI API Guide', link: '/for-agents/full' },
      { text: 'Models & Pricing', link: '/for-agents/models' },
      { text: 'Error Guide', link: '/for-agents/errors' },
    ],
  },
  {
    text: 'First steps',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/getting-started/' },
      { text: 'Quickstart', link: '/getting-started/quickstart' },
      { text: 'First API call', link: '/getting-started/first-call' },
      { text: 'Connect AI tools', link: '/setup/' },
    ],
  },
  {
    text: 'Models & APIs',
    collapsed: false,
    items: [
      { text: 'Store', link: '/store/' },
      { text: 'APIs', link: '/store/apis' },
      { text: 'Models', link: '/models/' },
      { text: 'Supported Models', link: '/models/supported' },
      { text: 'Capabilities', link: '/models/capabilities' },
      { text: 'Vision', link: '/models/vision' },
    ],
  },
  {
    text: 'Guides',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/guides/' },
      { text: 'Chat Completions', link: '/guides/chat-completions' },
      { text: 'OpenAI Responses', link: '/guides/openai-responses' },
      { text: 'Anthropic Messages', link: '/guides/anthropic-messages' },
      { text: 'Image and Video Models', link: '/guides/image-video' },
      { text: 'Streaming', link: '/guides/streaming' },
      { text: 'Errors', link: '/guides/error-handling' },
      { text: 'Rate limits', link: '/guides/rate-limiting' },
      { text: 'Pricing', link: '/guides/billing' },
    ],
  },
  {
    text: 'Workspace',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/admin/' },
      { text: 'API Keys', link: '/getting-started/api-keys' },
      { text: 'Organizations', link: '/admin/organizations' },
      { text: 'Billing & credits', link: '/admin/billing' },
      { text: 'Rate Limits', link: '/admin/rate-limits' },
      { text: 'FAQ', link: '/faq' },
    ],
  },
]

export const apiReferenceSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'Using the API',
    items: [
      { text: 'Overview', link: '/api-reference/' },
      { text: 'Authentication', link: '/api-reference/authentication' },
      { text: 'Errors', link: '/api-reference/errors' },
      { text: 'OpenAPI Spec', link: '/docs/openapi.yaml' },
    ],
  },
  {
    text: 'Account',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/api-reference/account/' },
      { text: 'Get Account Balance', link: '/api-reference/account/balance' },
      { text: 'List Account History', link: '/api-reference/account/history' },
    ],
  },
  {
    text: 'Usage',
    collapsed: true,
    items: [
      { text: 'Get Task Cost', link: '/api-reference/tasks/cost' },
    ],
  },
]
