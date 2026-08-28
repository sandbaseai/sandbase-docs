import type { DefaultTheme } from 'vitepress'
import {
  modelApiReferenceSidebarItems,
  platformApiReferenceFallbackSidebarItems,
} from './modelApiReferenceSidebar.generated'

// ─── Model API Reference ─────────────────────────────────────

// Hand-written modules that live under /model-api-reference but are not produced
// by scripts/generate-llm-model-api-reference.mjs. They are appended here rather
// than in modelApiReferenceSidebar.generated.ts, which the generator overwrites.
const handWrittenModelApiReferenceItems: DefaultTheme.SidebarItem[] = [
  {
    text: 'Inference APIs',
    collapsed: true,
    items: [
      { text: 'Chat Completions', link: '/api-reference/llm-gateway' },
      { text: 'Responses', link: '/api-reference/responses' },
      { text: 'Anthropic Messages', link: '/api-reference/anthropic-compat' },
      { text: 'Google Gemini', link: '/api-reference/gemini-generate-content' },
      { text: 'Gemini Interactions', link: '/api-reference/gemini-interactions' },
      { text: 'Volcengine Ark Video', link: '/api-reference/volcengine-contents-generations' },
      { text: 'Generate Image (OpenAI)', link: '/api-reference/images/generations' },
      { text: 'Edit Image (OpenAI)', link: '/api-reference/images/edits' },
      { text: 'Model Image Generation', link: '/api-reference/models/image' },
      { text: 'Video Generation', link: '/api-reference/models/video' },
      { text: 'Audio', link: '/api-reference/models/audio' },
      { text: 'Embeddings', link: '/api-reference/models/embedding' },
      { text: 'API Passthrough', link: '/api-reference/models/api-passthrough' },
      { text: 'Media Assets', link: '/api-reference/models/assets' },
      { text: 'Upload Media', link: '/api-reference/models/upload' },
      { text: 'Register Asset', link: '/api-reference/models/assets-create' },
      { text: 'Get Asset', link: '/api-reference/models/assets-get' },
      { text: 'Get Task Cost', link: '/api-reference/tasks/cost' },
    ],
  },
]

function modelApiReferenceSidebar(items: DefaultTheme.SidebarItem[]): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Status', link: 'https://status.sandbase.ai' },
    { text: 'Community', link: 'https://www.sandbase.ai/community' },
    { text: 'Blog', link: 'https://www.sandbase.ai/blog' },
    {
      text: 'Model API Reference',
      items: [...items, ...handWrittenModelApiReferenceItems],
    },
  ]
}

export const fullModelApiReferenceSidebar = modelApiReferenceSidebar(modelApiReferenceSidebarItems)
export const platformApiReferenceFallbackSidebar = modelApiReferenceSidebar(platformApiReferenceFallbackSidebarItems)

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
      { text: 'Guides overview', link: '/guides/' },
      { text: 'Store', link: '/store/' },
      { text: 'Models', link: '/models/' },
      { text: 'Supported Models', link: '/models/supported' },
      { text: 'Capabilities', link: '/models/capabilities' },
      { text: 'Vision', link: '/models/vision' },
      { text: 'Chat Completions', link: '/guides/chat-completions' },
      { text: 'Anthropic Messages', link: '/guides/anthropic-messages' },
      { text: 'Streaming', link: '/guides/streaming' },
      { text: 'Errors', link: '/guides/error-handling' },
      { text: 'Rate limits', link: '/guides/rate-limiting' },
      { text: 'Pricing', link: '/guides/billing' },
    ],
  },
  {
    text: 'Build agents',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/agents/' },
      { text: 'Define agent', link: '/agents/agent-api' },
      { text: 'Tools & credentials', link: '/agents/mcp-tools' },
      { text: 'API Credentials', link: '/agents/api-credentials' },
    ],
  },
  {
    text: 'Agent operations',
    collapsed: false,
    items: [
      { text: 'Services', link: '/agents/services' },
      { text: 'Schedules', link: '/agents/schedules' },
      { text: 'Sessions', link: '/agents/sessions' },
    ],
  },
  {
    text: 'Workspace',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/admin/' },
      { text: 'API Keys', link: '/getting-started/api-keys' },
      { text: 'Organizations', link: '/admin/organizations' },
      { text: 'Billing', link: '/admin/billing' },
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
    text: 'Agents',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/api-reference/agents/' },
      { text: 'Create Agent', link: '/api-reference/agents/create' },
      { text: 'List Agents', link: '/api-reference/agents/list' },
      { text: 'Get Agent', link: '/api-reference/agents/get' },
      { text: 'Update Agent', link: '/api-reference/agents/update' },
      { text: 'Archive Agent', link: '/api-reference/agents/archive' },
      { text: 'List Agent Versions', link: '/api-reference/agents/versions' },
      { text: 'Get Agent Version', link: '/api-reference/agents/get-version' },
    ],
  },
  {
    text: 'Sessions',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/api-reference/sessions/' },
      { text: 'Create Session', link: '/api-reference/sessions/create' },
      { text: 'List Sessions', link: '/api-reference/sessions/list' },
      { text: 'Get Session', link: '/api-reference/sessions/get' },
      { text: 'Update Session', link: '/api-reference/sessions/update' },
      { text: 'Delete Session', link: '/api-reference/sessions/delete' },
      { text: 'Send Events', link: '/api-reference/sessions/send-events' },
      { text: 'Stream Events', link: '/api-reference/sessions/stream' },
      { text: 'List Events', link: '/api-reference/sessions/list-events' },
      { text: 'Archive Session', link: '/api-reference/sessions/archive' },
    ],
  },
  {
    text: 'Services',
    collapsed: true,
    items: [
      { text: 'Overview & REST', link: '/api-reference/endpoints/' },
      { text: 'Invoke with ACP', link: '/api-reference/endpoints/acp' },
    ],
  },
  {
    text: 'Schedules',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/api-reference/deployments/' },
      { text: 'Create Schedule', link: '/api-reference/deployments/create' },
      { text: 'List Schedules', link: '/api-reference/deployments/list' },
      { text: 'Get Schedule', link: '/api-reference/deployments/get' },
      { text: 'Update Schedule', link: '/api-reference/deployments/update' },
      { text: 'Delete Schedule', link: '/api-reference/deployments/delete' },
      { text: 'Archive Schedule', link: '/api-reference/deployments/archive' },
      { text: 'Pause Schedule', link: '/api-reference/deployments/pause' },
      { text: 'Resume Schedule', link: '/api-reference/deployments/unpause' },
      { text: 'Test Feishu Notification', link: '/api-reference/deployments/test-feishu-notification' },
      {
        text: 'Schedule runs',
        collapsed: true,
        items: [
          { text: 'Trigger Schedule', link: '/api-reference/deployments/run' },
          { text: 'List Runs for Schedule', link: '/api-reference/deployments/list-runs' },
          { text: 'Get Run for Schedule', link: '/api-reference/deployments/get-run' },
          { text: 'List All Schedule Runs', link: '/api-reference/deployments/list-all-runs' },
          { text: 'Get Schedule Run by ID', link: '/api-reference/deployments/get-global-run' },
        ],
      },
    ],
  },
  {
    text: 'Skills',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/api-reference/skills/' },
      { text: 'Create Skill', link: '/api-reference/skills/create' },
      { text: 'List Skills', link: '/api-reference/skills/list' },
      { text: 'Get Skill', link: '/api-reference/skills/get' },
      { text: 'Update Skill', link: '/api-reference/skills/update' },
      { text: 'Delete Skill', link: '/api-reference/skills/delete' },
    ],
  },
  {
    text: 'Credentials',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/api-reference/credentials/' },
      { text: 'Create Credential', link: '/api-reference/credentials/#create-a-credential' },
      { text: 'List Credentials', link: '/api-reference/credentials/#list-credentials' },
      { text: 'Get Credential', link: '/api-reference/credentials/#get-a-credential' },
      { text: 'Update Credential', link: '/api-reference/credentials/#update-a-credential' },
      { text: 'Rotate Credential', link: '/api-reference/credentials/#rotate-a-credential' },
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
]
