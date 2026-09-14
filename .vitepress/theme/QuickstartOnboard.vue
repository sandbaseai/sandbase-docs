<template>
  <div class="onboard">
    <section class="brief">
      <div class="brief-meta">
        <span>{{ copy.meta.kicker }}</span>
        <span>{{ copy.meta.steps }}</span>
      </div>
      <p class="brief-lead">{{ copy.lead }}</p>
      <div class="brief-actions">
        <a class="btn-primary" href="https://www.sandbase.ai/login" target="_blank" rel="noopener noreferrer">{{ copy.actions.account }}</a>
        <a class="btn-ghost" href="https://www.sandbase.ai/console/members?create=1" target="_blank" rel="noopener noreferrer">{{ copy.actions.org }}</a>
        <a class="btn-ghost" href="https://www.sandbase.ai/console/keys" target="_blank" rel="noopener noreferrer">{{ copy.actions.connect }}</a>
      </div>
      <p class="brief-skip">
        {{ copy.skip.before }}
        <a :href="copy.skip.orgHref">{{ copy.skip.org }}</a>
        {{ copy.skip.mid }}
        <a :href="copy.skip.connectHref">{{ copy.skip.connect }}</a>
        {{ copy.skip.after }}
      </p>
    </section>

    <ol class="process">
      <li v-for="step in steps" :key="step.id">
        <a class="process-card" :href="step.href">
          <span class="process-index">{{ step.id }}</span>
          <strong>{{ step.title }}</strong>
          <p>{{ step.body }}</p>
          <span class="process-go">{{ step.cta }}</span>
        </a>
      </li>
    </ol>

    <div class="routes">
      <p class="routes-label">{{ copy.pathsLabel }}</p>
      <div class="routes-row">
        <a v-for="path in copy.paths" :key="path.href" class="route" :href="path.href">
          <span>{{ path.tag }}</span>
          <strong>{{ path.title }}</strong>
          <em>{{ path.body }}</em>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ locale?: 'en' | 'zh' }>(), { locale: 'en' })

const copyByLocale = {
  en: {
    meta: { kicker: 'Onboarding', steps: '3 steps' },
    lead: 'Create an account, set up an organization, then make one real request.',
    actions: {
      account: 'Create account',
      org: 'Create organization',
      connect: 'Call an API',
    },
    skip: {
      before: 'Already have an account? Skip to ',
      org: 'create an organization',
      orgHref: '#create-organization',
      mid: ' or ',
      connect: 'connect SandBase',
      connectHref: '#connect',
      after: '.',
    },
    pathsLabel: 'Choose a path',
    paths: [
      { tag: 'A', href: '#call-api', title: 'Call an API', body: 'Send a request from your app' },
      { tag: 'B', href: '#use-on-website', title: 'Use on the website', body: 'Try it in the Store first' },
      { tag: 'C', href: '#use-in-ai-tool', title: 'Use in an AI tool', body: 'Connect the client you already use' },
      { tag: 'D', href: '#build-agent', title: 'Build an Agent', body: 'Compose a reusable workflow' },
    ],
    steps: [
      {
        id: '01',
        title: 'Create your account',
        body: 'Sign in with GitHub or Google. First login creates your account and a personal workspace.',
        href: '#create-account',
        cta: 'Open login',
      },
      {
        id: '02',
        title: 'Create an organization',
        body: 'Keep the personal workspace, or create a team so keys, members, and billing are shared.',
        href: '#create-organization',
        cta: 'Open Team',
      },
      {
        id: '03',
        title: 'Connect SandBase',
        body: 'Call an API, try it on the website, connect an AI tool, or build an Agent.',
        href: '#connect',
        cta: 'See paths',
      },
    ],
  },
  zh: {
    meta: { kicker: '开通流程', steps: '三步完成' },
    lead: '先注册账号，再创建组织，然后完成一次真实请求。',
    actions: {
      account: '注册账号',
      org: '创建组织',
      connect: '调用 API',
    },
    skip: {
      before: '已经有账号？直接跳到 ',
      org: '创建组织',
      orgHref: '#create-organization',
      mid: ' 或 ',
      connect: '接入 SandBase',
      connectHref: '#connect',
      after: '。',
    },
    pathsLabel: '选择接入方式',
    paths: [
      { tag: 'A', href: '#call-api', title: '调用 API', body: '用 Key 从代码发起请求' },
      { tag: 'B', href: '#use-on-website', title: '在官网使用', body: '先在 Store 详情页试用' },
      { tag: 'C', href: '#use-in-ai-tool', title: '在 AI 中使用', body: '接到现有 AI 客户端' },
      { tag: 'D', href: '#build-agent', title: '搭建 Agent', body: '组合成可复用工作流' },
    ],
    steps: [
      {
        id: '01',
        title: '注册账号',
        body: '用 GitHub 或 Google 登录。第一次登录会自动创建账号和个人 workspace。',
        href: '#create-account',
        cta: '去登录',
      },
      {
        id: '02',
        title: '创建组织',
        body: '可以继续用个人 workspace，也可以创建团队来共享 Key、成员和账单。',
        href: '#create-organization',
        cta: '打开 Team',
      },
      {
        id: '03',
        title: '接入 SandBase',
        body: '从 API 调用、官网试用、接到 AI 工具，或搭建 Agent 里选一种。',
        href: '#connect',
        cta: '查看路径',
      },
    ],
  },
} as const

const copy = copyByLocale[props.locale]
const steps = copy.steps
</script>

<style scoped>
.onboard {
  --qs-lime: #d9ff43;
  --qs-ink: #11110f;
  --qs-paper: #f4f4ef;
  display: grid;
  gap: 64px;
  margin: 8px 0 72px;
}

.brief {
  position: relative;
  padding: 8px 0 4px;
}

.brief::after {
  content: '';
  position: absolute;
  top: -72px;
  right: -12%;
  width: 320px;
  height: 320px;
  pointer-events: none;
  background: radial-gradient(circle, color-mix(in srgb, var(--qs-lime) 22%, transparent), transparent 68%);
}

.dark .brief::after {
  background: radial-gradient(circle, color-mix(in srgb, var(--qs-lime) 14%, transparent), transparent 70%);
}

.brief-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 20px;
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.2em;
  text-transform: uppercase;
}

.brief-meta span:first-child {
  color: var(--qs-ink);
}

.dark .brief-meta span:first-child {
  color: var(--qs-lime);
}

.brief-meta span:last-child {
  color: var(--vp-c-text-3);
}

.brief-meta span:last-child::before {
  content: '';
  display: inline-block;
  width: 28px;
  height: 2px;
  margin-right: 14px;
  background: var(--qs-lime);
  transform: translateY(-3px);
}

.brief-lead {
  position: relative;
  z-index: 1;
  margin: 0 0 32px;
  color: var(--vp-c-text-1);
  font-size: clamp(26px, 3.2vw, 34px);
  font-weight: 550;
  line-height: 1.28;
  letter-spacing: -0.042em;
  white-space: nowrap;
}

.brief-actions {
  position: relative;
  z-index: 1;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.btn-primary,
.btn-ghost {
  display: inline-flex;
  align-items: center;
  min-height: 48px;
  padding: 0 22px;
  border-radius: 2px;
  font-size: 14.5px;
  font-weight: 650;
  letter-spacing: -0.018em;
  text-decoration: none;
  transition: background 0.16s, border-color 0.16s, color 0.16s;
}

.btn-primary {
  background: var(--qs-lime);
  color: var(--qs-ink);
}

.btn-primary:hover {
  background: #e7ff78;
}

.btn-ghost {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  background: transparent;
}

.btn-ghost:hover {
  border-color: var(--qs-ink);
}

.dark .btn-ghost:hover {
  border-color: color-mix(in srgb, var(--qs-paper) 48%, transparent);
}

.brief-skip {
  position: relative;
  z-index: 1;
  margin: 22px 0 0;
  color: var(--vp-c-text-3);
  font-size: 13.5px;
  line-height: 1.55;
}

.brief-skip a {
  color: var(--vp-c-text-1);
  font-weight: 650;
  text-decoration: none;
  box-shadow: inset 0 -2px 0 var(--qs-lime);
}

.brief-skip a:hover {
  color: var(--qs-ink);
}

.dark .brief-skip a:hover {
  color: var(--qs-paper);
}

.process {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 48px;
  margin: 0;
  padding: 4px 0 0;
  list-style: none;
}

.process::before {
  content: '';
  position: absolute;
  top: 26px;
  left: 8px;
  right: 8px;
  height: 1px;
  background: linear-gradient(
    90deg,
    var(--qs-lime),
    var(--vp-c-divider) 16%,
    var(--vp-c-divider) 84%,
    var(--qs-lime)
  );
}

.process > li {
  min-width: 0;
}

.process-card {
  display: grid;
  align-content: start;
  gap: 14px;
  height: 100%;
  padding: 0;
  color: inherit;
  text-decoration: none;
}

.process-index {
  position: relative;
  z-index: 1;
  display: block;
  width: fit-content;
  padding-right: 12px;
  background: var(--vp-c-bg);
  color: var(--qs-ink);
  font-family: var(--vp-font-family-mono);
  font-size: 40px;
  font-weight: 650;
  letter-spacing: -0.08em;
  line-height: 1;
}

.dark .process-index {
  color: var(--qs-paper);
}

.process-card:hover .process-index {
  color: var(--qs-ink);
  background: var(--qs-lime);
  box-shadow: 8px 0 0 var(--qs-lime);
}

.process-card strong {
  display: block;
  margin-top: 10px;
  color: var(--vp-c-text-1);
  font-size: 20px;
  font-weight: 650;
  letter-spacing: -0.038em;
  line-height: 1.25;
}

.process-card p {
  margin: 0;
  max-width: 22rem;
  color: var(--vp-c-text-2);
  font-size: 14.5px;
  line-height: 1.65;
}

.process-go {
  margin-top: 10px;
  color: var(--vp-c-text-1);
  font-size: 13.5px;
  font-weight: 650;
  letter-spacing: -0.01em;
}

.process-go::after {
  content: ' →';
}

.routes {
  display: grid;
  gap: 18px;
}

.routes-label {
  margin: 0;
  color: var(--vp-c-text-3);
  font-size: 12px;
  font-weight: 650;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.routes-row {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 0 28px;
}

.route {
  display: grid;
  align-content: start;
  gap: 10px;
  min-height: 148px;
  padding: 22px 0 8px;
  border-top: 2px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: border-color 0.16s;
}

.route:hover {
  border-top-color: var(--qs-lime);
}

.route span {
  color: var(--vp-c-text-3);
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
}

.route strong {
  font-size: 20px;
  font-weight: 650;
  letter-spacing: -0.038em;
  line-height: 1.25;
}

.route em {
  font-style: normal;
  color: var(--vp-c-text-2);
  font-size: 13.5px;
  line-height: 1.5;
}

@media (max-width: 960px) {
  .routes-row {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px 28px;
  }
}

@media (max-width: 860px) {
  .onboard {
    gap: 48px;
  }

  .brief::after {
    display: none;
  }

  .brief-lead {
    white-space: normal;
  }

  .process,
  .routes-row {
    grid-template-columns: 1fr;
  }

  .process {
    gap: 36px;
  }

  .process::before {
    display: none;
  }

  .route {
    min-height: 0;
  }
}

@media (prefers-reduced-motion: no-preference) {
  .brief,
  .process,
  .routes {
    animation: qs-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  .process { animation-delay: 0.08s; }
  .routes { animation-delay: 0.16s; }
}

@keyframes qs-in {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
