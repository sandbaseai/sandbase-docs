/**
 * Docs analytics (K02). Mirrors sandbase-fe src/lib/analytics.ts for /docs:
 * same GA4 property and PostHog project, same consent keys, same first-touch
 * attribution key, so a visitor who lands on a docs page from a campaign link
 * and signs up on the main site keeps that source. Both apps share the
 * www.sandbase.ai origin, so localStorage is shared.
 *
 * Privacy rules carried over from the main site:
 * - page_location / $current_url carry the path only, never the query string
 *   (search terms, keys, tokens). Only UTM values that pass a strict pattern
 *   are read, and only the four K02 fields.
 * - Opt-out in 'sandbase.analytics.consent.v1' stops everything; advertising
 *   storage stays denied unless the separate ad consent was granted.
 * - utm_source=test marks the browser session as verification traffic.
 */
import posthog from 'posthog-js'

type Props = Record<string, string | number | boolean>
type Attribution = { source: string; medium: string; campaign: string; content: string; landing_page: string; first_seen: number }

const CONSENT = 'sandbase.analytics.consent.v1'
const AD_CONSENT = 'sandbase.ad-measurement.consent.v1'
const ATTRIBUTION = 'sandbase.attribution.v1'
const ATTRIBUTION_TTL_MS = 30 * 24 * 60 * 60 * 1000
const TEST_TRAFFIC = 'sandbase.analytics.test-traffic.v1'

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || ''
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY || ''
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || ''

let started = false
let lastPage = ''
let lastReferrer = ''
let gtag: (...args: unknown[]) => void = () => {}

function analyticsConsent(): boolean {
  try { return (localStorage.getItem(CONSENT) ?? 'granted') === 'granted' } catch { return true }
}
function adConsent(): boolean {
  try { return localStorage.getItem(AD_CONSENT) === 'granted' } catch { return false }
}
export function safeUrl(value: string): string {
  try { const u = new URL(value, location.origin); return /^https?:$/.test(u.protocol) ? u.origin + u.pathname : '' } catch { return '' }
}
function pageUrl(): string { return location.origin + location.pathname }

export function campaign(search: string = location.search): Props {
  const params = new URLSearchParams(search)
  const result: Props = {}
  for (const name of ['source', 'medium', 'campaign', 'content']) {
    const value = params.get(`utm_${name}`)
    if (value && /^[a-zA-Z0-9_. -]{1,100}$/.test(value)) result[`campaign_${name === 'campaign' ? 'name' : name}`] = value
  }
  return result
}
export function isTestTraffic(): boolean {
  try { return sessionStorage.getItem(TEST_TRAFFIC) === '1' } catch { return false }
}
function readAttribution(): Attribution | null {
  try {
    const value = JSON.parse(localStorage.getItem(ATTRIBUTION) || 'null') as Attribution | null
    if (!value || typeof value.first_seen !== 'number' || Date.now() - value.first_seen > ATTRIBUTION_TTL_MS) return null
    return value
  } catch { return null }
}
/** Same rules as the main site: first campaign landing wins for 30 days; test visits are never stored. */
export function captureAttribution(): void {
  if (!analyticsConsent()) return
  const current = campaign()
  const source = String(current.campaign_source || '')
  if (!source) return
  if (source.toLowerCase() === 'test') {
    try { sessionStorage.setItem(TEST_TRAFFIC, '1') } catch { /* Storage may be unavailable. */ }
    return
  }
  if (isTestTraffic() || readAttribution()) return
  const value: Attribution = {
    source,
    medium: String(current.campaign_medium || ''),
    campaign: String(current.campaign_name || ''),
    content: String(current.campaign_content || ''),
    landing_page: location.pathname,
    first_seen: Date.now(),
  }
  try { localStorage.setItem(ATTRIBUTION, JSON.stringify(value)) } catch { /* Storage may be unavailable. */ }
}

function googleConsent() {
  const analytics = analyticsConsent()
  const advertising = analytics && adConsent()
  return {
    analytics_storage: analytics ? 'granted' : 'denied',
    ad_storage: advertising ? 'granted' : 'denied',
    ad_user_data: advertising ? 'granted' : 'denied',
    ad_personalization: 'denied',
  }
}

function track(name: string, props: Props = {}): void {
  if (!started || !analyticsConsent()) return
  const test = isTestTraffic()
  const data: Props = { page_location: pageUrl(), page_referrer: safeUrl(document.referrer), ...props, page_path: location.pathname, app: 'docs' }
  if (GA_ID) gtag('event', name, { ...data, ...(test ? { traffic_type: 'internal' } : {}), transport_type: 'beacon' })
  if (POSTHOG_KEY && POSTHOG_HOST) posthog.capture(name === 'page_view' ? '$pageview' : name, { ...data, ...(test ? { is_test_traffic: true } : {}), $current_url: pageUrl(), $referrer: String(data.page_referrer) })
}

/** Called once on client start and after every VitePress route change. */
export function pageView(): void {
  if (!started || !analyticsConsent() || lastPage === location.pathname) return
  captureAttribution()
  lastPage = location.pathname
  track('page_view', { page_title: document.title, ...campaign(), page_referrer: lastReferrer || safeUrl(document.referrer) })
  lastReferrer = pageUrl()
}

export function startAnalytics(): void {
  if (started || typeof window === 'undefined' || !analyticsConsent()) return
  if (!(GA_ID && /^G-[A-Z0-9]+$/.test(GA_ID)) && !(POSTHOG_KEY && POSTHOG_HOST)) return
  started = true
  captureAttribution()
  if (GA_ID && /^G-[A-Z0-9]+$/.test(GA_ID)) {
    const w = window as unknown as { dataLayer: unknown[] }
    w.dataLayer = w.dataLayer || []
    gtag = function (..._args: unknown[]) { w.dataLayer.push(arguments) }
    gtag('consent', 'default', googleConsent())
    gtag('js', new Date())
    gtag('config', GA_ID, { send_page_view: false, ...campaign(), ...(isTestTraffic() ? { traffic_type: 'internal' } : {}), page_location: pageUrl(), page_referrer: safeUrl(document.referrer), allow_google_signals: false, allow_ad_personalization_signals: false })
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID)}`
    document.head.appendChild(script)
  }
  if (POSTHOG_KEY && POSTHOG_HOST) posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST, autocapture: false, capture_pageview: false, capture_pageleave: false,
    disable_session_recording: true, advanced_disable_feature_flags: true,
    persistence: 'localStorage+cookie', cross_subdomain_cookie: true,
    before_send: (event) => {
      if (!analyticsConsent()) return null
      if (event) for (const [key, value] of Object.entries(event.properties || {})) {
        if (typeof value === 'string' && /url|referrer/i.test(key)) (event.properties as Record<string, unknown>)[key] = safeUrl(value)
      }
      return event
    },
  })
  pageView()
}
