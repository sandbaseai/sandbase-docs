<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <p class="hero-badge">SandBase Docs</p>
        <h1 class="hero-title">Connect your Agent<br/>to the real world.</h1>
        <p class="hero-desc">Start with the path you need: add tools to your AI app, call Models and APIs directly, or build an Agent for repeatable work.</p>
        <div class="hero-actions">
          <a href="https://www.sandbase.ai/console/setup" target="_self" class="btn-primary">Start with Setup</a>
          <a href="https://www.sandbase.ai/apis" target="_self" class="btn-secondary">Browse Store</a>
          <a href="/docs/api-reference/" class="btn-secondary">API Reference</a>
        </div>
      </div>
      <div class="hero-map" aria-label="SandBase product map">
        <div class="map-row">
          <span class="map-index">01</span>
          <div>
            <strong>Use in my AI tool</strong>
            <p>Choose Models, APIs, or published Agents. Run setup once. Use them in Codex, Claude, Cursor, or Kiro.</p>
          </div>
        </div>
        <div class="map-row">
          <span class="map-index">02</span>
          <div>
            <strong>Call an API</strong>
            <p>Copy a working request for a Model or API. Call it from your app with one SandBase key.</p>
          </div>
        </div>
        <div class="map-row">
          <span class="map-index">03</span>
          <div>
            <strong>Build an Agent</strong>
            <p>Define the Agent, test runs, then publish it for API access or schedule it.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Store -->
    <section class="catalog-api-section" aria-labelledby="catalog-api-title">
      <div class="catalog-api-copy">
        <p class="section-label">STORE</p>
        <h2 id="catalog-api-title">Find the building block you need.</h2>
        <p>Store is where you browse ready-made capabilities: Models, APIs, Agents, and Skills. Inspect first, then install, call, or clone.</p>
      </div>
      <div class="catalog-api-links">
        <a href="https://www.sandbase.ai/models" target="_self" class="catalog-api-link">
          <span class="method-badge">MODELS</span>
          <span>
            <strong>Models</strong>
            <small>Language, image, audio, video, and embeddings</small>
          </span>
        </a>
        <a href="https://www.sandbase.ai/apis" target="_self" class="catalog-api-link">
          <span class="method-badge">APIS</span>
          <span>
            <strong>APIs</strong>
            <small>Search, data, SaaS, media, and connector APIs</small>
          </span>
        </a>
        <a href="https://www.sandbase.ai/agents" target="_self" class="catalog-api-link">
          <span class="method-badge">AGENTS</span>
          <span>
            <strong>Agents</strong>
            <small>Ready-made examples you can test or clone</small>
          </span>
        </a>
        <a href="https://www.sandbase.ai/skills" target="_self" class="catalog-api-link">
          <span class="method-badge">SKILLS</span>
          <span>
            <strong>Skills</strong>
            <small>Reusable task packages for Build Agent</small>
          </span>
        </a>
      </div>
    </section>

    <!-- Choose path -->
    <section class="choose-section">
      <p class="section-label">START HERE</p>
      <h2 class="section-title">Choose the simplest path.</h2>
      <p class="section-desc">Start small. You can move from setup, to direct API calls, to reusable Agents when the work needs more structure.</p>

      <div class="choose-cards">
        <a href="https://www.sandbase.ai/console/setup" target="_self" class="choose-card featured">
          <div class="choose-card-icon">01</div>
          <h3>Setup</h3>
          <p>Add Models, APIs, and published Agents to the AI app you already use.</p>
          <ul class="choose-card-links">
            <li>Choose tools</li>
            <li>Run one setup command</li>
            <li>Use them in your AI app</li>
          </ul>
        </a>
        <a href="/docs/models/" class="choose-card">
          <div class="choose-card-icon">02</div>
          <h3>Call Models and APIs</h3>
          <p>Use a Model or API directly from your application with a working request.</p>
          <ul class="choose-card-links">
            <li>Browse capability</li>
            <li>Copy the request</li>
            <li>Call it from your app</li>
          </ul>
        </a>
        <a href="/docs/agents/" class="choose-card">
          <div class="choose-card-icon">03</div>
          <h3>Build an Agent</h3>
          <p>Turn instructions, Models, APIs, and Skills into repeatable work.</p>
          <ul class="choose-card-links">
            <li>Define and test</li>
            <li>Publish as an API</li>
            <li>Schedule recurring runs</li>
          </ul>
        </a>
      </div>
    </section>

    <!-- Console flow -->
    <section class="journey-section">
      <p class="section-label">CONSOLE FLOW</p>
      <h2 class="section-title">Build the Agent first. Connect it when it is ready.</h2>
      <p class="section-desc">Agents are where you define and test the work. Published Agents and Schedules are ways to make that work usable outside the builder.</p>

      <div class="journey-steps">
        <div class="journey-step">
          <div><span class="step-num">1</span><h4>Build Agent</h4></div>
          <div class="step-links">
            <a href="https://www.sandbase.ai/console/agents" target="_self">Create Agent</a>
            <a href="/docs/agents/agent-api">Agent docs</a>
            <a href="https://www.sandbase.ai/skills" target="_self">Browse Skills</a>
          </div>
        </div>
        <div class="journey-step">
          <div><span class="step-num">2</span><h4>Publish Agent</h4></div>
          <div class="step-links">
            <a href="https://www.sandbase.ai/console/endpoints" target="_self">Published Agents</a>
            <a href="/docs/api-reference/endpoints/">Services API</a>
          </div>
        </div>
        <div class="journey-step">
          <div><span class="step-num">3</span><h4>Schedule Agent</h4></div>
          <div class="step-links">
            <a href="https://www.sandbase.ai/console/deployments" target="_self">Schedules</a>
            <a href="/docs/api-reference/deployments/">Schedule docs</a>
            <a href="https://www.sandbase.ai/console/runs" target="_self">Runs</a>
          </div>
        </div>
        <div class="journey-step">
          <div><span class="step-num">4</span><h4>Operate</h4></div>
          <div class="step-links">
            <a href="https://www.sandbase.ai/console/webhooks" target="_self">Webhooks</a>
            <a href="https://www.sandbase.ai/console/activities" target="_self">Activities</a>
          </div>
        </div>
      </div>
    </section>

    <!-- API reference -->
    <section class="models-section">
      <p class="section-label">API REFERENCE</p>
      <h2 class="section-title">Use the API when you need code-level control.</h2>
      <p class="section-desc">Reference docs stay available, but they are no longer the only way to start.</p>

      <div class="model-cards">
        <a href="/docs/api-reference/models/list" class="model-card">
          <span class="model-badge">MODELS</span>
          <h3>Model APIs</h3>
          <code>/v1/models · /v1/chat/completions</code>
          <p>List models, inspect pricing and capabilities, and call them directly.</p>
        </a>
        <a href="/docs/api-reference/endpoints/" class="model-card">
          <span class="model-badge">SERVICES</span>
          <h3>Services</h3>
          <code>/v1/endpoints</code>
          <p>Publish a tested Agent so apps and API clients can invoke it.</p>
        </a>
        <a href="/docs/api-reference/deployments/" class="model-card">
          <span class="model-badge">SCHEDULES</span>
          <h3>Schedules</h3>
          <code>/v1/deployments</code>
          <p>Run an existing Agent on a recurring schedule and review each result.</p>
        </a>
      </div>
    </section>

    <!-- Resources -->
    <section class="resources-section">
      <p class="section-label">RESOURCES</p>
      <h2 class="section-title">Need a deeper page?</h2>

      <div class="resource-cards">
        <a href="/docs/getting-started/quickstart" class="resource-card">
          <span class="resource-icon">01</span>
          <h4>Quickstart</h4>
          <p>Make the first API call and confirm your key works.</p>
        </a>
        <a href="/docs/sdks/" class="resource-card">
          <span class="resource-icon">02</span>
          <h4>SDKs</h4>
          <p>Use SandBase with Python and JavaScript clients.</p>
        </a>
        <a href="/docs/admin/api-keys" class="resource-card">
          <span class="resource-icon">03</span>
          <h4>Keys and billing</h4>
          <p>Manage API keys, billing, limits, and organization settings.</p>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Align home content edges with the VitePress nav bar.
   Nav container = max-width:(layout-max-width - 64px), centered, in a
   32px-padded wrapper. Matching max-width:layout-max-width + 32px padding
   makes the home content's left edge line up with the nav logo. */
.home-page {
  max-width: var(--vp-layout-max-width, 1440px);
  margin: 0 auto;
  padding: 0 32px 80px;
}
@media (max-width: 768px) {
  .home-page { padding: 0 24px 64px; }
}

/* ─── Hero ─── */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  align-items: center;
  padding: 60px 0 48px;
}
@media (max-width: 768px) {
  .hero-section { grid-template-columns: 1fr; gap: 32px; padding: 40px 0 32px; }
}
.hero-badge {
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--vp-c-brand-1);
  margin-bottom: 12px;
}
.hero-title {
  font-size: 42px;
  font-weight: 700;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--vp-c-text-1);
  margin-bottom: 16px;
}
.hero-desc {
  font-size: 16px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
  margin-bottom: 24px;
}
.hero-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.btn-primary, .btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.15s;
}
.btn-primary {
  background: var(--vp-c-brand-1);
  color: #fff;
}
.btn-primary:hover { opacity: 0.9; }
.btn-secondary {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
  background: var(--vp-c-bg-soft);
}
.btn-secondary:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* Product map */
.hero-map {
  display: grid;
  gap: 12px;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  background:
    linear-gradient(135deg, var(--vp-c-brand-soft), transparent 42%),
    var(--vp-c-bg-soft);
}
.map-row {
  display: grid;
  grid-template-columns: 48px 1fr;
  gap: 14px;
  padding: 18px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  background: var(--vp-c-bg);
}
.map-index {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 800;
}
.map-row strong {
  display: block;
  color: var(--vp-c-text-1);
  font-size: 16px;
  font-weight: 700;
}
.map-row p {
  margin: 6px 0 0;
  color: var(--vp-c-text-2);
  font-size: 14px;
  line-height: 1.55;
}

/* ─── Sections ─── */
.section-label {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--vp-c-brand-1);
  margin-bottom: 8px;
}
.section-title {
  font-size: 28px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin-bottom: 8px;
}
.section-desc {
  font-size: 15px;
  color: var(--vp-c-text-2);
  margin-bottom: 32px;
}

/* ─── Model Catalog API ─── */
.catalog-api-section {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(360px, 0.9fr);
  gap: 28px;
  align-items: center;
  padding: 28px;
  margin-bottom: 48px;
  border: 1px solid rgba(62, 207, 142, 0.32);
  border-radius: 12px;
  background: linear-gradient(135deg, var(--vp-c-brand-soft), var(--vp-c-bg-soft));
}
.catalog-api-copy h2 {
  font-size: 24px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  margin: 0 0 8px;
}
.catalog-api-copy p:last-child {
  font-size: 15px;
  line-height: 1.55;
  color: var(--vp-c-text-2);
  margin: 0;
}
.catalog-api-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
.catalog-api-link {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 68px;
  padding: 14px 16px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 10px;
  background: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: border-color 0.15s, transform 0.15s;
}
.catalog-api-link:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-1px);
}
.method-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  height: 24px;
  padding: 0 8px;
  border-radius: 6px;
  background: var(--vp-c-brand-1);
  color: #0f1117;
  font-size: 11px;
  font-weight: 800;
  flex-shrink: 0;
}
.catalog-api-link strong,
.catalog-api-link small {
  display: block;
}
.catalog-api-link strong {
  font-size: 15px;
  font-weight: 700;
}
.catalog-api-link small {
  margin-top: 2px;
  font-family: var(--vp-font-family-mono);
  font-size: 12px;
  color: var(--vp-c-text-3);
}
@media (max-width: 768px) {
  .catalog-api-section {
    grid-template-columns: 1fr;
    padding: 22px;
    margin-bottom: 36px;
  }
  .catalog-api-links { grid-template-columns: 1fr; }
}

/* ─── Choose cards ─── */
.choose-section { padding: 48px 0; border-top: 1px solid var(--vp-c-divider); }
.choose-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
@media (max-width: 640px) { .choose-cards { grid-template-columns: 1fr; } }
.choose-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 28px;
  text-decoration: none;
  transition: border-color 0.2s, box-shadow 0.2s;
  display: block;
}
.choose-card:hover { border-color: var(--vp-c-brand-1); box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.choose-card.featured { border-color: var(--vp-c-brand-1); background: var(--vp-c-brand-soft); }
.choose-card-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: var(--vp-c-bg-soft);
  color: var(--vp-c-brand-1);
  font-family: 'JetBrains Mono', monospace;
  font-size: 13px;
  font-weight: 800;
  margin-bottom: 16px;
}
.choose-card h3 { font-size: 20px; font-weight: 700; color: var(--vp-c-text-1); margin-bottom: 8px; }
.choose-card p { font-size: 14px; color: var(--vp-c-text-2); line-height: 1.5; margin-bottom: 16px; }
.choose-card-links { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 6px; }
.choose-card-links li { font-size: 13px; color: var(--vp-c-text-2); }

/* ─── Journey ─── */
.journey-section { padding: 48px 0; border-top: 1px solid var(--vp-c-divider); }
.journey-steps { display: flex; flex-direction: column; gap: 36px; }
.journey-step { display: flex; flex-direction: column; gap: 12px; }
.journey-step > div:first-child { display: flex; align-items: center; gap: 12px; }
.step-num {
  width: 28px; height: 28px; border-radius: 50%;
  background: var(--vp-c-brand-soft);
  color: var(--vp-c-brand-1);
  display: flex; align-items: center; justify-content: center;
  font-size: 13px; font-weight: 700; flex-shrink: 0;
}
.journey-step h4 { font-size: 16px; font-weight: 600; color: var(--vp-c-text-1); margin: 0; }
.step-links { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; width: 100%; }
@media (max-width: 640px) { .step-links { grid-template-columns: 1fr; } }
.step-links a {
  display: flex; align-items: center; gap: 10px;
  padding: 14px 18px; border-radius: 10px;
  border: 1px solid var(--vp-c-divider);
  font-size: 14px; color: var(--vp-c-text-1);
  text-decoration: none; transition: all 0.15s;
  background: var(--vp-c-bg-soft);
}
.step-links a:hover { border-color: var(--vp-c-brand-1); color: var(--vp-c-brand-1); }

/* ─── Models ─── */
.models-section { padding: 48px 0; border-top: 1px solid var(--vp-c-divider); }
.model-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 768px) { .model-cards { grid-template-columns: 1fr; } }
.model-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  transition: border-color 0.2s;
  display: block;
}
.model-card:hover { border-color: var(--vp-c-brand-1); }
.model-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--vp-c-brand-1); }
.model-card h3 { font-size: 22px; font-weight: 700; color: var(--vp-c-text-1); margin: 6px 0; }
.model-card code { font-size: 12px; color: var(--vp-c-text-3); }
.model-card p { font-size: 13px; color: var(--vp-c-text-2); margin-top: 10px; line-height: 1.5; }

/* ─── Resources ─── */
.resources-section { padding: 48px 0; border-top: 1px solid var(--vp-c-divider); }
.resource-cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 640px) { .resource-cards { grid-template-columns: 1fr; } }
.resource-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 24px;
  text-decoration: none;
  transition: border-color 0.2s;
  display: block;
}
.resource-card:hover { border-color: var(--vp-c-brand-1); }
.resource-icon { font-size: 20px; display: block; margin-bottom: 12px; }
.resource-card h4 { font-size: 15px; font-weight: 600; color: var(--vp-c-text-1); margin-bottom: 4px; }
.resource-card p { font-size: 13px; color: var(--vp-c-text-2); }
</style>
