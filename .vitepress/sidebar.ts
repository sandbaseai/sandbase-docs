import type { DefaultTheme } from 'vitepress'
import {
  modelApiReferenceSidebarItems,
  platformApiReferenceFallbackSidebarItems,
} from './modelApiReferenceSidebar.generated'

// ─── Model API Reference ─────────────────────────────────────

function modelApiReferenceSidebar(items: DefaultTheme.SidebarItem[]): DefaultTheme.SidebarItem[] {
  return [
    { text: 'Status', link: 'https://status.sandbase.ai' },
    { text: 'Community', link: 'https://www.sandbase.ai/community' },
    { text: 'Blog', link: 'https://www.sandbase.ai/blog' },
    {
      text: 'Model API Reference',
      items,
    },
  ]
}

export const fullModelApiReferenceSidebar = modelApiReferenceSidebar(modelApiReferenceSidebarItems)
export const platformApiReferenceFallbackSidebar = modelApiReferenceSidebar(platformApiReferenceFallbackSidebarItems)

export const docsSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'First steps',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/getting-started/' },
      { text: 'Quickstart', link: '/getting-started/quickstart' },
      { text: 'First API call', link: '/getting-started/first-call' },
      { text: 'Setup for AI tools', link: '/setup/' },
      { text: 'SandBase CLI', link: '/setup/cli' },
    ],
  },
  {
    text: 'Models & APIs',
    collapsed: false,
    items: [
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
      { text: 'Service quickstart', link: '/agents/endpoint-quickstart' },
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
  {
    text: 'AI Resources',
    collapsed: true,
    items: [
      { text: 'AI-Readable Overview', link: '/for-agents/' },
      { text: 'Complete API Reference', link: '/for-agents/full' },
      { text: 'Models & Pricing', link: '/for-agents/models' },
      { text: 'Error Codes', link: '/for-agents/errors' },
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
    text: 'Models',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/api-reference/models/' },
      { text: 'List Models', link: '/api-reference/models/list' },
      { text: 'Get Model', link: '/api-reference/models/get' },
    ],
  },
  {
    text: 'Inference APIs',
    collapsed: false,
    items: [
      { text: 'Chat Completions', link: '/api-reference/llm-gateway' },
      { text: 'Responses', link: '/api-reference/responses' },
      { text: 'Anthropic Messages', link: '/api-reference/anthropic-compat' },
      {
        text: 'Images',
        collapsed: false,
        items: [
          { text: 'Model Image Generation', link: '/api-reference/models/image' },
          { text: 'Generate Image (OpenAI)', link: '/api-reference/images/generations' },
          { text: 'Edit Image (OpenAI)', link: '/api-reference/images/edits' },
        ],
      },
      { text: 'Video Generation', link: '/api-reference/models/video' },
      { text: 'Audio', link: '/api-reference/models/audio' },
      { text: 'Embeddings', link: '/api-reference/models/embedding' },
      {
        text: 'Assets',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/api-reference/models/assets' },
          { text: 'Upload Media', link: '/api-reference/models/upload' },
          { text: 'Register Asset', link: '/api-reference/models/assets-create' },
          { text: 'Get Asset', link: '/api-reference/models/assets-get' },
        ],
      },
      { text: 'Get Task Cost', link: '/api-reference/tasks/cost' },
    ],
  },
  {
    text: 'Account',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/api-reference/account/' },
      { text: 'Get Balance', link: '/api-reference/account/balance' },
      { text: 'List History', link: '/api-reference/account/history' },
    ],
  },
  {
    text: 'Embed Configs',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/api-reference/embeds/' },
      { text: 'Create', link: '/api-reference/embeds/create' },
      { text: 'List', link: '/api-reference/embeds/list' },
      { text: 'Get', link: '/api-reference/embeds/get' },
      { text: 'Update', link: '/api-reference/embeds/update' },
      { text: 'Delete', link: '/api-reference/embeds/delete' },
      { text: 'Usage', link: '/api-reference/embeds/usage' },
    ],
  },
  {
    text: 'Agent APIs',
    collapsed: false,
    items: [
      { text: 'Agents Overview', link: '/api-reference/agents/' },
      { text: 'Create Agent', link: '/api-reference/agents/create' },
      { text: 'List Agents', link: '/api-reference/agents/list' },
      { text: 'Get Agent', link: '/api-reference/agents/get' },
      { text: 'Update Agent', link: '/api-reference/agents/update' },
      { text: 'Archive Agent', link: '/api-reference/agents/archive' },
      { text: 'Agent Versions', link: '/api-reference/agents/versions' },
      { text: 'Get Agent Version', link: '/api-reference/agents/get-version' },
      { text: 'Environments', link: '/api-reference/environments/' },
    ],
  },
  {
    text: 'Endpoints',
    collapsed: false,
    items: [
      { text: 'Endpoints & Invoke', link: '/api-reference/endpoints/' },
      {
        text: 'Sessions',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/api-reference/sessions/' },
          { text: 'Create Session', link: '/api-reference/sessions/create' },
          { text: 'List Sessions', link: '/api-reference/sessions/list' },
          { text: 'Get Session', link: '/api-reference/sessions/get' },
          { text: 'Send Events', link: '/api-reference/sessions/send-events' },
          { text: 'Stream Events', link: '/api-reference/sessions/stream' },
          { text: 'List Events', link: '/api-reference/sessions/list-events' },
          { text: 'Archive Session', link: '/api-reference/sessions/archive' },
        ],
      },
    ],
  },
  {
    text: 'Deployments',
    collapsed: false,
    items: [
      { text: 'Overview', link: '/api-reference/deployments/' },
      { text: 'Create Deployment', link: '/api-reference/deployments/create' },
      { text: 'List Deployments', link: '/api-reference/deployments/list' },
      { text: 'Get Deployment', link: '/api-reference/deployments/get' },
      { text: 'Update Deployment', link: '/api-reference/deployments/update' },
      { text: 'Delete Deployment', link: '/api-reference/deployments/delete' },
      { text: 'Archive Deployment', link: '/api-reference/deployments/archive' },
      { text: 'Pause Deployment', link: '/api-reference/deployments/pause' },
      { text: 'Unpause Deployment', link: '/api-reference/deployments/unpause' },
      {
        text: 'DeploymentRuns',
        collapsed: false,
        items: [
          { text: 'Trigger Deployment', link: '/api-reference/deployments/run' },
          { text: 'List DeploymentRuns', link: '/api-reference/deployments/list-runs' },
          { text: 'Get DeploymentRun', link: '/api-reference/deployments/get-run' },
        ],
      },
    ],
  },
  {
    text: 'Skills',
    collapsed: false,
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
    text: 'Integrations',
    collapsed: false,
    items: [
      { text: 'Credentials', link: '/api-reference/credentials/' },
    ],
  },
]
