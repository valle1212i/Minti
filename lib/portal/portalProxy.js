// Kopierad från source-storefront-adapter main 1df51ce (adapter/server/portalProxy.js). Ändra i adapter-repot, inte här.
// Portaladapter — server-side proxy mot kundportalen.
//
// Ramverksoberoende i den meningen att handlern har Express-form (req, res) och
// därmed kan monteras direkt i Express, i Google Cloud Functions (functions-
// framework ger samma req/res), och via en tunn wrapper i Next.js route handlers
// (se nextAdapter längst ned). Kräver Node 18+ för global fetch.
//
// Kontraktet mot portalen är hämtat ur reconen onboarding-integrationsyta.md
// (origin/develop d2f9752c) och ur referenssajtens server.js (pinnad: dess origin/main a5713e5).
// Varje ställe där adaptern AVVIKER från referenssajten är markerat "AVVIKELSE FRÅN REFERENSEN"
// med skäl. Allt annat följer referenssajten.
//
// Vad adaptern INTE gör: den skapar aldrig Stripe-sessioner själv (den gamla
// STOREFRONT_API_GUIDE-varianten), den forwardar aldrig klientens X-Tenant,
// Authorization eller Cookie, och den loggar aldrig headers med hemligheter.

'use strict'

const crypto = require('node:crypto')
const { TtlCache } = require('./cache')

// ─── Ytor och defaults ────────────────────────────────────────────────────────

// Portalens presentationsytor (models/StorefrontPreset.js SURFACES) plus
// bokningen, som har egen modell och egen sökväg (routes/bookingPresentationRoutes.js).
const PRESET_SURFACES = Object.freeze(['categories', 'news', 'subscriptions', 'gift_cards', 'booking'])
const BOOKING_SURFACE = 'booking'

// Speglar referenssajtens DEFAULT_PRESET (server.js:1374) — elva designfält plus placement.
// Portalens FIELD_SPEC har även purchaseAction och navLabel; de tas med som
// passthrough-nycklar när portalen skickar dem men har ingen default här.
const DEFAULT_PRESET = Object.freeze({
  layoutVariant: 'grid',
  columns: 3,
  imageShape: 'square',
  cardStyle: 'bordered',
  spacing: 'normal',
  showBadges: true,
  showExcerpt: true,
  cornerRadius: 'small',
  accentUsage: 'subtle',
  imageStyle: 'natural',
  titleWeight: 'bold',
  placement: 'page'
})

// Speglar referenssajtens BOOKING_DEFAULTS (server.js:1418), som i sin tur speglar
// buildDefault i portalens models/BookingPresentation.js. Ändras modellen
// ändras listan för hand — aldrig härledd ur enum-ordning.
const BOOKING_DEFAULTS = Object.freeze({
  layout: 'card',
  flowMode: 'single',
  cornerRadius: 'small',
  spacing: 'normal',
  theme: 'inherit',
  showServiceStep: true,
  showProviderStep: true,
  showSummary: true,
  showAvailability: true,
  dateTimeCombined: false,
  heading: null,
  subtitle: null,
  confirmButtonLabel: null,
  successMessage: null,
  termsUrl: null,
  privacyUrl: null
})
const BOOKING_KEYS = Object.freeze(Object.keys(BOOKING_DEFAULTS))

// Sluten nyckellista även för butiksytorna. AVVIKELSE FRÅN REFERENSEN: referenssajten gör
// { ...DEFAULT_PRESET, ...data.preset } och släpper därmed igenom okända fält.
// Adaptern filtrerar, av samma skäl som referenssajten filtrerar bokningen: ett fält
// portalen råkar lägga till ska inte nå sidan utan att någon läst det först.
const STOREFRONT_KEYS = Object.freeze([...Object.keys(DEFAULT_PRESET), 'purchaseAction', 'navLabel'])

function mergePreset(surface, incoming) {
  const base = surface === BOOKING_SURFACE ? BOOKING_DEFAULTS : DEFAULT_PRESET
  const keys = surface === BOOKING_SURFACE ? BOOKING_KEYS : STOREFRONT_KEYS
  const preset = { ...base }
  if (!incoming || typeof incoming !== 'object' || Array.isArray(incoming)) return preset
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(incoming, key)) preset[key] = incoming[key]
  }
  return preset
}

// ─── Hjälpare ─────────────────────────────────────────────────────────────────

const PRESET_TTL_MS = 60 * 1000
const CATALOG_TTL_MS = 5 * 60 * 1000
const DEFAULT_TIMEOUT_MS = 5000
const CHECKOUT_TIMEOUT_MS = 20000

function timingSafeEqualString(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

function bearerFrom(req) {
  const header = req.headers['authorization'] || ''
  return header.startsWith('Bearer ') ? header.slice(7) : ''
}

function sendJson(res, status, body) {
  res.status(status)
  res.set ? res.set('Content-Type', 'application/json; charset=utf-8') : res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.send ? res.send(JSON.stringify(body)) : res.end(JSON.stringify(body))
}

async function fetchJson(url, options, timeoutMs) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(url, { ...options, signal: controller.signal })
    const text = await response.text()
    let body
    try { body = text ? JSON.parse(text) : null } catch { body = { success: false, error: 'Portalen svarade med icke-JSON', status: response.status } }
    return { ok: response.ok, status: response.status, body, headers: response.headers }
  } finally {
    clearTimeout(timer)
  }
}

// ─── Fabrik ───────────────────────────────────────────────────────────────────

/**
 * @param {object} config
 * @param {string} config.baseUrl            Portalens bas-URL (SOURCE_BASE_URL). Obligatorisk.
 * @param {string} config.tenant             Tenant-slug (SOURCE_TENANT_ID). Obligatorisk. ALDRIG från klienten.
 * @param {string[]} [config.previewOrigins] Portal-origins som får skicka preview (SOURCE_PREVIEW_ORIGINS). Tom = preview av.
 * @param {string} [config.syncSecret]       Delad hemlighet för inkommande invalidering/webhook (FRONTEND_SYNC_SECRET).
 * @param {string} [config.analyticsApiKey]  Portalens API-nyckel för /api/analytics/events (ANALYTICS_API_KEY).
 * @param {string} [config.publicUrl]        Portalens publika URL för /go-omdirigering (PORTAL_PUBLIC_URL). Faller till baseUrl.
 * @param {boolean} [config.analyticsIngest] Slår på POST /analytics/ingest → portalens /api/ingest/analytics (PORTAL_ANALYTICS_INGEST=true). Standard av.
 * @param {number} [config.trustedProxyHops] Antal betrodda proxy-hopp för X-Forwarded-For (TRUSTED_PROXY_HOPS). Standard 1.
 * @param {object} [config.logger]           { info, warn, error }. Loggar aldrig hemligheter.
 */
function createPortalProxy(config) {
  if (!config || typeof config.baseUrl !== 'string' || !config.baseUrl) throw new Error('portalProxy: baseUrl (SOURCE_BASE_URL) saknas')
  if (typeof config.tenant !== 'string' || !config.tenant.trim()) throw new Error('portalProxy: tenant (SOURCE_TENANT_ID) saknas')

  const BASE = config.baseUrl.replace(/\/+$/, '')
  // AVVIKELSE FRÅN REFERENSEN: referenssajten faller tillbaka till en hårdkodad slug med varning
  // (server.js:92–125). Adaptern kastar vid uppstart i stället. En sajt som
  // startar med fel tenant är värre än en som inte startar.
  const TENANT = config.tenant.trim().toLowerCase()
  const PREVIEW_ORIGINS = Object.freeze((config.previewOrigins || []).map((o) => String(o).trim()).filter(Boolean))
  const PUBLIC_URL = (config.publicUrl || BASE).replace(/\/+$/, '')
  const INGEST_ENABLED = config.analyticsIngest === true
  const PROXY_HOPS = Number.isInteger(config.trustedProxyHops) && config.trustedProxyHops >= 0 ? config.trustedProxyHops : 1
  const log = config.logger || console

  // Besökarens IP ur X-Forwarded-For: posten PROXY_HOPS steg från höger, så en
  // klient inte kan skjuta in en egen adress längst till vänster. Samma modell
  // som referenssajten (server.js:168–199). null när inget finns.
  function visitorIp(req) {
    const xff = String(req.headers['x-forwarded-for'] || '')
    const parts = xff.split(',').map((s) => s.trim()).filter(Boolean)
    if (parts.length >= PROXY_HOPS && PROXY_HOPS > 0) return parts[parts.length - PROXY_HOPS] || null
    return req.ip || (req.socket && req.socket.remoteAddress) || null
  }

  const presets = new TtlCache(PRESET_TTL_MS)
  const layouts = new TtlCache(PRESET_TTL_MS)
  const catalog = new TtlCache(CATALOG_TTL_MS)

  // Utgående headers. ALLOW-LISTA, inte klientens headers: exakt som referenssajtens
  // dedikerade routes (Content-Type + X-Tenant från server-env). Klientens
  // X-Tenant, Authorization och Cookie når aldrig portalen.
  // AVVIKELSE FRÅN REFERENSEN: referenssajtens catch-all (server.js:1844+) tar X-Tenant från
  // klienten med fallback och forwardar Cookie ur en processglobal jar. Båda
  // sakerna är borttagna.
  function portalHeaders(extra) {
    return { 'Content-Type': 'application/json', 'X-Tenant': TENANT, ...(extra || {}) }
  }

  async function portalGet(path, timeoutMs = DEFAULT_TIMEOUT_MS) {
    return fetchJson(`${BASE}${path}`, { method: 'GET', headers: portalHeaders() }, timeoutMs)
  }

  async function portalPost(path, body, extraHeaders, timeoutMs = DEFAULT_TIMEOUT_MS) {
    return fetchJson(`${BASE}${path}`, { method: 'POST', headers: portalHeaders(extraHeaders), body: JSON.stringify(body || {}) }, timeoutMs)
  }

  // Cachead läsning med fail-open: vid fel svaras senast kända värde, annars fallback.
  async function cachedGet(cache, key, path, fallback, ttlOverride) {
    const hit = cache.get(key)
    if (hit !== undefined) return { body: hit, source: 'cache' }
    try {
      const r = await portalGet(path)
      if (r.ok) {
        cache.set(key, r.body, ttlOverride)
        return { body: r.body, source: 'portal' }
      }
      log.warn(`[portal] ${path} → ${r.status}, använder fallback`)
    } catch (err) {
      log.warn(`[portal] ${path} misslyckades: ${err && err.message}`)
    }
    const stale = cache.getStale(key)
    if (stale !== undefined) return { body: stale, source: 'stale' }
    return { body: fallback, source: 'fallback' }
  }

  // ─── CSRF per request ─────────────────────────────────────────────────────
  // Bokningens POST /public/bookings kräver CSRF-token + cookie. Token hämtas
  // från portalens /api/auth/csrf i SAMMA serverkontext, per request, och de
  // Set-Cookie som kom i det svaret skickas tillbaka i samma POST.
  // AVVIKELSE FRÅN REFERENSEN: referenssajten lagrar portalens cookies i en processglobal
  // (backendSessionCookies) som delas mellan alla besökare och återanvänds när
  // klienten saknar cookies. Här finns ingen jar; varje POST har sin egen token.
  async function csrfContext() {
    const r = await fetch(`${BASE}/api/auth/csrf`, { method: 'GET', headers: portalHeaders() })
    const body = await r.json().catch(() => ({}))
    const token = body && body.csrfToken
    // Node 18: headers.getSetCookie finns från 18.14. Fallback via raw().
    const setCookies = typeof r.headers.getSetCookie === 'function'
      ? r.headers.getSetCookie()
      : (r.headers.raw ? r.headers.raw()['set-cookie'] || [] : [])
    const cookie = setCookies.map((c) => c.split(';')[0]).join('; ')
    if (!token || !cookie) throw new Error('CSRF-kontext kunde inte hämtas från portalen')
    return { token, cookie }
  }

  // ─── Routetabell ──────────────────────────────────────────────────────────
  // Sökvägar relativt monteringspunkten (t.ex. /api/portal). Tabellen är
  // sluten: allt som inte matchar får 404. AVVIKELSE FRÅN REFERENSEN: ingen catch-all
  // som forwardar godtyckliga /api/*-anrop till portalen.

  const routes = [
    // Konfiguration till klienten (preview-origins). Inga hemligheter här.
    ['GET', /^\/config$/, async (req, res) => sendJson(res, 200, { previewOrigins: PREVIEW_ORIGINS, tenant: TENANT })],

    // Presentation per yta → /storefront/:t/presentation/:surface, bokning → /booking-presentation
    ['GET', /^\/presentation\/([a-z_]+)$/, async (req, res, m) => {
      const surface = m[1]
      if (!PRESET_SURFACES.includes(surface)) return sendJson(res, 400, { success: false, error: `Ogiltig surface: ${surface}` })
      const path = surface === BOOKING_SURFACE
        ? `/storefront/${TENANT}/booking-presentation`
        : `/storefront/${TENANT}/presentation/${surface}`
      const { body, source } = await cachedGet(presets, surface, path, { preset: null })
      sendJson(res, 200, { surface, preset: mergePreset(surface, body && body.preset), source })
    }],

    ['GET', /^\/navigation-layout$/, async (req, res) => {
      const { body, source } = await cachedGet(layouts, 'nav', `/storefront/${TENANT}/navigation-layout`, { links: [], isDefault: true })
      sendJson(res, 200, { ...(body || {}), source })
    }],

    ['GET', /^\/landing-layout$/, async (req, res) => {
      const { body, source } = await cachedGet(layouts, 'landing', `/storefront/${TENANT}/landing-layout`, { sections: [], isDefault: true })
      sendJson(res, 200, { ...(body || {}), source })
    }],

    // Katalog. Portalens /storefront/:tenant/products (routes/storefrontRoutes.js:432)
    // läser query type, excludeType, category och inStock (rad 435); category tar
    // slug eller ObjectId (rad 472). Ingen egen categoryId-route finns i portalen.
    ['GET', /^\/products$/, async (req, res) => {
      const q = new URLSearchParams()
      for (const k of ['type', 'excludeType', 'category', 'inStock']) if (typeof req.query?.[k] === 'string') q.set(k, req.query[k])
      const qs = q.toString() ? `?${q}` : ''
      const { body, source } = await cachedGet(catalog, `products${qs}`, `/storefront/${TENANT}/products${qs}`, { success: true, products: [] })
      sendJson(res, 200, { ...(body || {}), source })
    }],
    // Kategoriprodukter. Portalen har INGEN /storefront/:tenant/category/:id/products
    // (verifierat: 404 på develop 2026-09-27; git grep i routes/ ger ingen träff).
    // Vägen mappas till products?category=<id|slug>, som är portalens faktiska
    // kategorifilter (storefrontRoutes.js:472). Cachas som en products-nyckel så
    // lagerwebhooken nollar den.
    ['GET', /^\/categories\/([^/]+)\/products$/, async (req, res, m) => {
      const q = new URLSearchParams({ category: m[1] })
      for (const k of ['type', 'excludeType', 'inStock']) if (typeof req.query?.[k] === 'string') q.set(k, req.query[k])
      const qs = `?${q}`
      const { body, source } = await cachedGet(catalog, `products${qs}`, `/storefront/${TENANT}/products${qs}`, { success: true, products: [] })
      sendJson(res, 200, { ...(body || {}), source })
    }],
    ['GET', /^\/product\/([^/]+)$/, async (req, res, m) => {
      const r = await portalGet(`/storefront/${TENANT}/product/${encodeURIComponent(m[1])}`)
      sendJson(res, r.status, r.body)
    }],
    // Lagerstatus per variant. Portalens /storefront/:tenant/variant/:stripePriceId
    // (storefrontRoutes.js:764): ingen auth, ingen limiter, 404 om okänd eller dold
    // variant. Ersätter sajternas döda anrop till /storefront/:t/inventory/status,
    // som inte finns i portalen (404 på develop). Aldrig cachat: lagersaldo ska vara färskt.
    ['GET', /^\/variant\/([^/]+)$/, async (req, res, m) => {
      const r = await portalGet(`/storefront/${TENANT}/variant/${encodeURIComponent(m[1])}`)
      sendJson(res, r.status, r.body)
    }],
    ['GET', /^\/categories$/, async (req, res) => {
      const { body, source } = await cachedGet(catalog, 'categories', `/storefront/${TENANT}/categories`, { success: true, categories: [] })
      sendJson(res, 200, { ...(body || {}), source })
    }],
    ['GET', /^\/news$/, async (req, res) => {
      const { body, source } = await cachedGet(catalog, 'news', `/storefront/${TENANT}/news`, { success: true, news: [] })
      sendJson(res, 200, { ...(body || {}), source })
    }],
    ['GET', /^\/prices$/, async (req, res) => {
      const ids = typeof req.query?.priceIds === 'string' ? req.query.priceIds : ''
      if (!ids) return sendJson(res, 400, { success: false, error: 'priceIds krävs' })
      const r = await portalGet(`/storefront/${TENANT}/prices?priceIds=${encodeURIComponent(ids)}`)
      sendJson(res, r.status, r.body)
    }],
    ['GET', /^\/shipping-settings$/, async (req, res) => {
      const { body, source } = await cachedGet(catalog, 'shipping', `/storefront/${TENANT}/shipping-settings`, {}, PRESET_TTL_MS)
      sendJson(res, 200, { ...(body || {}), source })
    }],
    ['GET', /^\/branding$/, async (req, res) => {
      const { body, source } = await cachedGet(catalog, 'branding', `/storefront/${TENANT}/branding`, {}, PRESET_TTL_MS)
      sendJson(res, 200, { ...(body || {}), source })
    }],
    // Lager: /api/inventory/public/:tenant/:productId — ingen nyckel krävs (recon 3.5).
    ['GET', /^\/inventory\/([^/]+)$/, async (req, res, m) => {
      const r = await portalGet(`/api/inventory/public/${TENANT}/${encodeURIComponent(m[1])}`)
      sendJson(res, r.status, r.body)
    }],
    // Kampanjpris: tenant via X-Tenant (routes/campaignRoutes.js:1507). Aldrig cachat (referenssajten: no-store).
    ['GET', /^\/campaign-price\/([^/]+)$/, async (req, res, m) => {
      const opid = typeof req.query?.originalPriceId === 'string' ? `?originalPriceId=${encodeURIComponent(req.query.originalPriceId)}` : ''
      const r = await portalGet(`/api/campaigns/price/${encodeURIComponent(m[1])}${opid}`)
      sendJson(res, r.status, r.body)
    }],

    // Kassa och tillhörande. CSRF-fria på portalsidan (prefix /storefront/).
    ['POST', /^\/checkout$/, async (req, res) => {
      const b = req.body || {}
      // Generellt kontrakt (storefrontRoutes.js:1706–1740): items är en icke-tom lista
      // där varje post har variantId och stripePriceId som strängar; quantity heltal
      // > 0, default 1. Kundspecifika alias (t.ex. ett eget varukorgsnyckelnamn som
      // ska bli variantId) hör hemma i kundens lager ovanpå adaptern, inte här.
      const itemsIn = Array.isArray(b.items) ? b.items : []
      if (itemsIn.length === 0) return sendJson(res, 400, { success: false, error: 'items[] krävs' })
      const items = []
      for (let i = 0; i < itemsIn.length; i++) {
        const it = itemsIn[i] || {}
        if (typeof it.variantId !== 'string' || !it.variantId) return sendJson(res, 400, { success: false, error: `items[${i}].variantId krävs` })
        if (typeof it.stripePriceId !== 'string' || !it.stripePriceId) return sendJson(res, 400, { success: false, error: `items[${i}].stripePriceId krävs` })
        const quantity = Number.isInteger(it.quantity) && it.quantity > 0 ? it.quantity : 1
        items.push({ variantId: it.variantId, quantity, stripePriceId: it.stripePriceId })
      }
      // Endast kända fält passerar (recon 3.5 / storefrontRoutes.js:1706).
      const body = {
        items, customerEmail: b.customerEmail, successUrl: b.successUrl, cancelUrl: b.cancelUrl,
        recipientAddress: b.recipientAddress, giftCardCode: b.giftCardCode, disableShipping: b.disableShipping,
        deliveryChoice: b.deliveryChoice, metadata: { ...(b.metadata || {}), source: 'storefront-adapter' }
      }
      const r = await portalPost(`/storefront/${TENANT}/checkout`, body, null, CHECKOUT_TIMEOUT_MS)
      sendJson(res, r.status, r.body)
    }],
    ['POST', /^\/delivery-options$/, async (req, res) => {
      const r = await portalPost(`/storefront/${TENANT}/delivery-options`, req.body)
      sendJson(res, r.status, r.body)
    }],
    // Presentkort: /api/gift-cards/verify med X-Tenant — den vägen kontrollerar
    // acceptansflaggan; /storefront/:t/giftcards/verify gör det inte (recon 3.5).
    // AVVIKELSE FRÅN REFERENSEN (som använder /api/storefront/:t/giftcards/verify).
    ['POST', /^\/gift-cards\/verify$/, async (req, res) => {
      const code = req.body && req.body.code
      if (typeof code !== 'string' || !code.trim()) return sendJson(res, 400, { success: false, error: 'code krävs' })
      const r = await portalPost('/api/gift-cards/verify', { code: code.trim() })
      sendJson(res, r.status, r.body)
    }],
    ['POST', /^\/carts\/track$/, async (req, res) => {
      const r = await portalPost('/api/carts/track', { ...(req.body || {}), tenant: TENANT })
      sendJson(res, r.status, r.body)
    }],

    // Bokning: /booking/<rest> → /api/system/booking/public/<rest>. GET utan cookies.
    ['GET', /^\/booking\/(.+)$/, async (req, res, m) => {
      const qs = req.url.includes('?') ? req.url.slice(req.url.indexOf('?')) : ''
      const r = await portalGet(`/api/system/booking/public/${m[1]}${qs}`)
      sendJson(res, r.status, r.body)
    }],
    // POST bookings: CSRF per request (se csrfContext).
    ['POST', /^\/booking\/bookings$/, async (req, res) => {
      let ctx
      try { ctx = await csrfContext() } catch (err) { return sendJson(res, 502, { success: false, error: 'Kunde inte förbereda bokningen' }) }
      const r = await portalPost('/api/system/booking/public/bookings', req.body, { 'X-CSRF-Token': ctx.token, Cookie: ctx.cookie })
      // AVVIKELSE FRÅN REFERENSEN: inga Set-Cookie från portalen skickas till klienten.
      sendJson(res, r.status, r.body)
    }],
    ['GET', /^\/booking-cancel$/, async (req, res) => {
      const token = typeof req.query?.token === 'string' ? req.query.token : ''
      const r = await portalGet(`/api/booking/public/cancel?token=${encodeURIComponent(token)}`)
      sendJson(res, r.status, r.body)
    }],
    ['POST', /^\/booking-cancel$/, async (req, res) => {
      const r = await portalPost('/api/booking/public/cancel', req.body)
      sendJson(res, r.status, r.body)
    }],

    // Analys: nyckeln injiceras server-side. Klienten ser den aldrig.
    // AVVIKELSE FRÅN REFERENSEN: referenssajten bakar nyckeln i index.html och pekar på develop-hosten.
    ['POST', /^\/analytics\/events$/, async (req, res) => {
      if (!config.analyticsApiKey) return sendJson(res, 503, { success: false, error: 'Analys ej konfigurerad' })
      const r = await portalPost('/api/analytics/events', req.body, { Authorization: `Bearer ${config.analyticsApiKey}` })
      sendJson(res, r.status, r.body)
    }],
    ['POST', /^\/contact$/, async (req, res) => {
      const r = await portalPost('/api/contact', { ...(req.body || {}), tenant: TENANT })
      sendJson(res, r.status, r.body)
    }],

    // Analys-ingest (valfri, PORTAL_ANALYTICS_INGEST=true). Portalens
    // POST /api/ingest/analytics: monterad server.js:3133, CSRF-undantagen
    // (server.js:835), ingestRateLimit 1000/15 min (routes/analyticsIngest.js:24),
    // tenant ur body.tenant eller X-Tenant, saniterad (analyticsIngest.js:36–66),
    // ingen API-nyckel. Kroppen är { tenant, events: [{ type|event_type, url,
    // referrer?, title?, timestamp?, userAgent?, device?, ip?, clientEventId?,
    // properties? }] } (analyticsIngest.js:136–262). Portalen hashar IP och gör
    // geo själv ur event.ip eller req.ip (rad 190–201).
    //
    // Samtycke: klienten skickar analyticsConsent true/false i kroppen (samma
    // fält som testkundens sajt). Med samtycke sätts event.ip till besökarens
    // IP ur X-Forwarded-For så portalen kan geokoda. Utan samtycke stryks ip och
    // alla geo-fält; portalen ser då adapterns egen utgående adress som req.ip.
    // Rå IP loggas aldrig här. Tenant stämplas alltid från env och kan inte
    // överskuggas av klienten. Fire-and-forget: timeout mot portalen ger 200 med
    // forwarded null, så analys aldrig fäller sidan.
    ['POST', /^\/analytics\/ingest$/, async (req, res) => {
      if (!INGEST_ENABLED) return sendJson(res, 404, { success: false, error: 'Okänd adapterväg' })
      const b = req.body || {}
      const consent = b.analyticsConsent === true
      const ip = consent ? visitorIp(req) : null
      const GEO_KEYS = ['country', 'region', 'city', 'continent', 'latitude', 'longitude', 'timezone']
      const events = (Array.isArray(b.events) ? b.events : []).map((ev) => {
        const e = { ...(ev && typeof ev === 'object' ? ev : {}) }
        delete e.ip
        if (consent) { if (ip) e.ip = ip }
        else {
          for (const k of GEO_KEYS) delete e[k]
          if (e.properties && typeof e.properties === 'object') {
            e.properties = { ...e.properties }
            for (const k of GEO_KEYS) delete e.properties[k]
          }
        }
        return e
      })
      if (events.length === 0) return sendJson(res, 400, { success: false, error: 'events[] krävs' })
      try {
        const r = await portalPost('/api/ingest/analytics', { tenant: TENANT, events })
        return sendJson(res, r.status, r.body)
      } catch (err) {
        log.warn(`[portal] analytics/ingest: ${err && err.name === 'AbortError' ? 'timeout' : 'fel'}, släpper tyst`)
        return sendJson(res, 200, { success: true, forwarded: null })
      }
    }]
  ]

  async function handler(req, res) {
    const path = (req.path || new URL(req.url, 'http://x').pathname).replace(/\/+$/, '') || '/'
    for (const [method, re, fn] of routes) {
      if (req.method !== method) continue
      const m = path.match(re)
      if (!m) continue
      try {
        return await fn(req, res, m)
      } catch (err) {
        log.error(`[portal] ${method} ${path}: ${err && err.message}`)
        return sendJson(res, 502, { success: false, error: 'Portalen kunde inte nås' })
      }
    }
    return sendJson(res, 404, { success: false, error: 'Okänd adapterväg' })
  }

  // ─── Inkommande från portalen ─────────────────────────────────────────────
  // Sökvägarna är PORTALENS kontrakt och monteras på sajtens rot, inte under
  // adapterns prefix: POST /api/presentation/invalidate (storefrontPresetNotifier.js)
  // och POST /api/campaigns/webhook (inventorySyncService.js).

  function requireSyncSecret(req, res) {
    // AVVIKELSE FRÅN REFERENSEN: timingSafeEqual i stället för !== (referenssajten server.js:1046, 1809).
    if (!config.syncSecret || !timingSafeEqualString(bearerFrom(req), config.syncSecret)) {
      sendJson(res, 401, { success: false, error: 'Unauthorized' })
      return false
    }
    return true
  }

  function invalidatePresentation(surface) {
    presets.expire(surface)
    const touched = ['preset']
    if (surface !== BOOKING_SURFACE) {
      layouts.expire('nav'); layouts.expire('landing')
      touched.push('navigation-layout', 'landing-layout')
    }
    return touched
  }

  function invalidateHandler(req, res) {
    if (!requireSyncSecret(req, res)) return
    const surface = req.body && req.body.surface
    if (typeof surface !== 'string' || !PRESET_SURFACES.includes(surface)) {
      return sendJson(res, 400, { success: false, error: `Ogiltig surface: ${surface}. Tillåtna: ${PRESET_SURFACES.join(', ')}` })
    }
    const invalidated = invalidatePresentation(surface)
    log.info(`[portal] presentation invaliderad: ${surface}`)
    return sendJson(res, 200, { success: true, surface, invalidated })
  }

  const WEBHOOK_ACTIONS = Object.freeze(['inventory.reordered', 'inventory.created', 'inventory.updated', 'inventory.deleted'])

  function webhookHandler(req, res) {
    if (!requireSyncSecret(req, res)) return
    const action = req.body && req.body.action
    // AVVIKELSE FRÅN REFERENSEN: arbetet görs FÖRE svaret. Det är tre minnesoperationer;
    // att svara först ger inget utom en fälla där arbete lever kvar efter svaret.
    if (WEBHOOK_ACTIONS.includes(action)) {
      catalog.expireWhere((key) => key.startsWith('products') || key === 'categories')
      log.info(`[portal] produktcache invaliderad: ${action}`)
    } else {
      log.warn(`[portal] okänd webhook-action ignorerad`)
    }
    return sendJson(res, 200, { received: true })
  }

  // /go/:id → sluten 302 till portalens publika URL + portalPath ur navigation-layout.
  // Speglar referenssajtens origin/main server.js:1686. Fail closed: okänt id eller fallback-layout → 404.
  async function goHandler(req, res) {
    const id = req.params?.id || (req.path || '').split('/').pop()
    const { body, source } = await cachedGet(layouts, 'nav', `/storefront/${TENANT}/navigation-layout`, { links: [] })
    if (source === 'fallback') return sendJson(res, 404, { success: false, error: 'Navigation ej tillgänglig' })
    const link = (body.links || []).find((l) => l && l.id === id && typeof l.portalPath === 'string' && /^\/[^/]/.test(l.portalPath))
    if (!link) return sendJson(res, 404, { success: false, error: 'Okänd länk' })
    res.setHeader('Cache-Control', 'no-store')
    res.redirect ? res.redirect(302, `${PUBLIC_URL}${link.portalPath}`) : (res.statusCode = 302, res.setHeader('Location', `${PUBLIC_URL}${link.portalPath}`), res.end())
  }

  return {
    handler,
    invalidateHandler,
    webhookHandler,
    goHandler,
    // Exponerat för tester och för invalidate-hook.
    caches: { presets, layouts, catalog },
    constants: { PRESET_SURFACES, DEFAULT_PRESET, BOOKING_DEFAULTS, TENANT },
    // Routetabellen som [metod, sökvägsmönster]-par, för tester som låser att den är sluten.
    routeTable: routes.map(([method, re]) => [method, re.source])
  }
}

// ─── Montering ────────────────────────────────────────────────────────────────

// Express:
//   const proxy = createPortalProxy({ ... })
//   app.use('/api/portal', express.json(), proxy.handler)
//   app.post('/api/presentation/invalidate', express.json(), proxy.invalidateHandler)
//   app.post('/api/campaigns/webhook', express.json(), proxy.webhookHandler)
//   app.get('/go/:id', proxy.goHandler)
//
// Cloud Functions (functions-framework): exportera handlern; req/res har Express-form.
//
// Next.js App Router och andra Fetch-API-runtimes: använd adapter/server/nextBridge.js
// (createNextBridge) tillsammans med adapter/server/config.js (lazyProxy). Se README.
//
// nextAdapter behålls som bakåtkompatibelt namn men går via bryggan, så att den
// får samma header-filtrering och felhantering. Den tidigare inline-varianten
// spred alla klientheaders vidare och saknade felhantering; den är borttagen.
function nextAdapter(fn) {
  const { createNextBridge } = require('./nextBridge')
  return createNextBridge(() => ({ handler: fn })).portalRoute()
}

module.exports = { createPortalProxy, nextAdapter, PRESET_SURFACES, DEFAULT_PRESET, BOOKING_DEFAULTS, mergePreset, timingSafeEqualString }
