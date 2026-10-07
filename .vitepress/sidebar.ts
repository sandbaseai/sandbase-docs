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
      items: [...items],
    },
  ]
}

export const fullModelApiReferenceSidebar = modelApiReferenceSidebar(modelApiReferenceSidebarItems)
export const platformApiReferenceFallbackSidebar = modelApiReferenceSidebar(platformApiReferenceFallbackSidebarItems)

export const docsSidebar: DefaultTheme.SidebarItem[] = [
  {
    text: 'AI-Friendly Docs',
    items: [
      { text: 'AI-Readable Overview', link: '/for-agents/' },
      { text: 'AI API Guide', link: '/for-agents/full' },
      { text: 'Models & Pricing', link: '/for-agents/models' },
      { text: 'Error Guide', link: '/for-agents/errors' },
    ],
  },
  {
    text: 'First steps',
    items: [
      { text: 'Overview', link: '/getting-started/' },
      { text: 'Quickstart', link: '/getting-started/quickstart' },
      { text: 'First API call', link: '/getting-started/first-call' },
      { text: 'Connect AI tools', link: '/setup/' },
    ],
  },
  {
    text: 'Models & APIs',
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
    items: [
      { text: 'Overview', link: '/guides/' },
      { text: 'Chat Completions', link: '/guides/chat-completions' },
      { text: 'OpenAI Responses', link: '/guides/openai-responses' },
      { text: 'Anthropic Messages', link: '/guides/anthropic-messages' },
      { text: 'Image and Video Models', link: '/guides/image-video' },
      { text: 'Streaming', link: '/guides/streaming' },
      { text: 'Errors', link: '/guides/error-handling' },
      { text: 'Rate limits', link: '/guides/rate-limiting' },
      { text: 'Concurrency limits', link: '/guides/concurrency-limits' },
      { text: 'Pricing', link: '/guides/billing' },
    ],
  },
  {
    text: 'Sandbox',
    items: [
      { text: 'Overview & capabilities', link: '/sandbox/' },
      { text: 'Quickstart / E2B SDK', link: '/sandbox/quickstart' },
      { text: 'Playground (Experimental)', link: '/sandbox/playground' },
    ],
  },
  {
    text: 'Build agents',
    items: [
      { text: 'Overview', link: '/agents/' },
      { text: 'Define agent', link: '/agents/agent-api' },
      { text: 'Skills & MCP tools', link: '/agents/mcp-tools' },
      { text: 'MCP credentials', link: '/agents/api-credentials' },
      { text: 'OpenAI compatibility', link: '/agents/openai-compatibility' },
    ],
  },
  {
    text: 'Agent operations',
    items: [
      { text: 'Services', link: '/agents/services' },
      { text: 'Schedules', link: '/agents/schedules' },
      { text: 'Sessions', link: '/agents/sessions' },
    ],
  },
  {
    text: 'Workspace',
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
    text: 'Agents',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/api-reference/agents/' },
      { text: 'Create Agent', link: '/api-reference/agents/create' },
      { text: 'List Agents', link: '/api-reference/agents/list' },
      { text: 'Get Agent', link: '/api-reference/agents/get' },
      { text: 'Update Agent', link: '/api-reference/agents/update' },
      { text: 'Replace Agent (CAS)', link: '/api-reference/agents/replace' },
      { text: 'Delete Agent', link: '/api-reference/agents/delete' },
      { text: 'Archive Agent', link: '/api-reference/agents/archive' },
      { text: 'Unarchive Agent', link: '/api-reference/agents/unarchive' },
      { text: 'Restore Agent Version', link: '/api-reference/agents/restore' },
      { text: 'List Agent Versions', link: '/api-reference/agents/versions' },
      { text: 'Get Agent Version', link: '/api-reference/agents/get-version' },
      { text: 'Agent Catalog', link: '/api-reference/agents/catalog' },
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
      { text: 'Update Metadata', link: '/api-reference/sessions/update' },
      { text: 'Rename Session', link: '/api-reference/sessions/rename' },
      { text: 'Delete Session', link: '/api-reference/sessions/delete' },
      { text: 'Send Input', link: '/api-reference/sessions/send-events' },
      { text: 'Stream Events', link: '/api-reference/sessions/stream' },
      { text: 'List Items', link: '/api-reference/sessions/items' },
      { text: 'List Turns', link: '/api-reference/sessions/turns' },
      { text: 'Get Turn', link: '/api-reference/sessions/get-turn' },
      { text: 'Cancel Turn', link: '/api-reference/sessions/cancel' },
      { text: 'Archive Session', link: '/api-reference/sessions/archive' },
      { text: 'Unarchive Session', link: '/api-reference/sessions/unarchive' },
      { text: 'Reconnect', link: '/api-reference/sessions/reconnect' },
      { text: 'Snapshot Stream', link: '/api-reference/sessions/stream-snapshot' },
      { text: 'Upload File', link: '/api-reference/sessions/upload-file' },
      { text: 'List Files', link: '/api-reference/sessions/list-files' },
      { text: 'Download File', link: '/api-reference/sessions/download-file' },
      { text: 'Delete File', link: '/api-reference/sessions/delete-file' },
    ],
  },
  {
    text: 'Services',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/api-reference/services/' },
      { text: 'Create Service', link: '/api-reference/services/create' },
      { text: 'List Services', link: '/api-reference/services/list' },
      { text: 'Get Service', link: '/api-reference/services/get' },
      { text: 'Update Service', link: '/api-reference/services/update' },
      { text: 'Pause, Resume, Archive', link: '/api-reference/services/lifecycle' },
      { text: 'Invoke Service', link: '/api-reference/services/invoke' },
      { text: 'Runs', link: '/api-reference/services/runs' },
      { text: 'Notifications', link: '/api-reference/services/#notifications' },
    ],
  },
  {
    text: 'Schedules',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/api-reference/schedules/' },
      { text: 'Create Schedule', link: '/api-reference/schedules/create' },
      { text: 'List Schedules', link: '/api-reference/schedules/list' },
      { text: 'Get Schedule', link: '/api-reference/schedules/get' },
      { text: 'Update Schedule', link: '/api-reference/schedules/update' },
      { text: 'Update Timing', link: '/api-reference/schedules/timing' },
      { text: 'Pause, Resume, Archive', link: '/api-reference/schedules/lifecycle' },
      { text: 'Trigger Run', link: '/api-reference/schedules/run' },
      { text: 'Runs', link: '/api-reference/schedules/runs' },
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
      { text: 'Skill Versions', link: '/api-reference/skills/versions' },
      { text: 'Skill Catalog', link: '/api-reference/skills/catalog' },
    ],
  },
  {
    text: 'MCP Connections',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/api-reference/mcp-connections/' },
      { text: 'Create Connection', link: '/api-reference/mcp-connections/#create-a-connection' },
      { text: 'List Connections', link: '/api-reference/mcp-connections/#list-connections' },
      { text: 'Get Connection', link: '/api-reference/mcp-connections/#get-a-connection' },
      { text: 'Replace Connection', link: '/api-reference/mcp-connections/#replace-a-connection' },
      { text: 'Enable Connection', link: '/api-reference/mcp-connections/#enable-a-connection' },
      { text: 'Disable Connection', link: '/api-reference/mcp-connections/#disable-a-connection' },
    ],
  },
  {
    text: 'Secrets',
    collapsed: true,
    items: [
      { text: 'Overview', link: '/api-reference/secrets/' },
      { text: 'Create Secret', link: '/api-reference/secrets/#create-a-secret' },
      { text: 'List Secrets', link: '/api-reference/secrets/#list-secrets' },
      { text: 'Get Secret', link: '/api-reference/secrets/#get-a-secret' },
      { text: 'Rotate Secret', link: '/api-reference/secrets/#rotate-a-secret' },
      { text: 'Revoke Secret', link: '/api-reference/secrets/#revoke-a-secret' },
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
