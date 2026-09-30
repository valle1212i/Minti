// Kopierad från source-storefront-adapter main 1df51ce (tests/sessionless/adapter-unit.test.js), require-sökvägen anpassad till lib/portal/.
// Enhetstester för adaptern (körs utan nätverk).
//   node --test tests/sessionless/adapter-unit.test.js
//
// Bevisar adapterns egna garantier, inte portalens: X-Tenant kommer från env
// och aldrig från klienten, inkommande invalidering svarar 401/400/200 enligt
// portalens kontrakt (services/storefrontPresetNotifier.js:9–12), och
// preset-merge filtrerar okända nycklar.

'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')

const { createPortalProxy, mergePreset, timingSafeEqualString, PRESET_SURFACES } = require(path.join(__dirname, '..', 'lib', 'portal', 'portalProxy.js'))

function fakeRes() {
  const r = { statusCode: 200, headers: {}, body: '' }
  r.status = (s) => { r.statusCode = s; return r }
  r.setHeader = (k, v) => { r.headers[k.toLowerCase()] = v }
  r.set = r.setHeader
  r.send = (b) => { r.body = b }
  r.end = (b) => { r.body = b || '' }
  r.json = () => JSON.parse(r.body)
  return r
}

function proxyWith(overrides) {
  return createPortalProxy({ baseUrl: 'https://portal.invalid', tenant: 'testslug', syncSecret: 'shh', logger: { info() {}, warn() {}, error() {} }, ...(overrides || {}) })
}

test('kastar utan baseUrl eller tenant (fail closed, avvikelse från referenssajtens fallback)', () => {
  assert.throws(() => createPortalProxy({ tenant: 'x' }))
  assert.throws(() => createPortalProxy({ baseUrl: 'https://p' }))
})

test('X-Tenant tas från env och gemenas; klientens X-Tenant ignoreras', async () => {
  const seen = []
  const origFetch = global.fetch
  global.fetch = async (url, opts) => { seen.push({ url, headers: opts.headers }); return new Response(JSON.stringify({ success: true, categories: [] }), { status: 200 }) }
  try {
    const p = proxyWith({ tenant: 'MixedCase' })
    const res = fakeRes()
    await p.handler({ method: 'GET', path: '/categories', url: '/categories', headers: { 'x-tenant': 'evil', authorization: 'Bearer evil', cookie: 'a=b' }, query: {} }, res)
    assert.equal(res.statusCode, 200)
    assert.equal(seen[0].headers['X-Tenant'], 'mixedcase')
    assert.equal(seen[0].headers.Authorization, undefined)
    assert.equal(seen[0].headers.Cookie, undefined)
  } finally { global.fetch = origFetch }
})

test('okänd adapterväg ger 404 (ingen catch-all)', async () => {
  const p = proxyWith()
  const res = fakeRes()
  await p.handler({ method: 'GET', path: '/anything/else', url: '/anything/else', headers: {}, query: {} }, res)
  assert.equal(res.statusCode, 404)
})

test('GET /config exponerar previewOrigins men ingen hemlighet', async () => {
  const p = proxyWith({ previewOrigins: ['https://portal.invalid'] })
  const res = fakeRes()
  await p.handler({ method: 'GET', path: '/config', url: '/config', headers: {}, query: {} }, res)
  const body = res.json()
  assert.deepEqual(body.previewOrigins, ['https://portal.invalid'])
  assert.ok(!JSON.stringify(body).includes('shh'))
})

test('invalidate: 401 utan/fel bearer, 400 okänd yta, 200 känd yta med invalidated[]', () => {
  const p = proxyWith()
  let res = fakeRes()
  p.invalidateHandler({ headers: {}, body: { surface: 'categories' } }, res)
  assert.equal(res.statusCode, 401)

  res = fakeRes()
  p.invalidateHandler({ headers: { authorization: 'Bearer wrong' }, body: { surface: 'categories' } }, res)
  assert.equal(res.statusCode, 401)

  res = fakeRes()
  p.invalidateHandler({ headers: { authorization: 'Bearer shh' }, body: { surface: 'nope' } }, res)
  assert.equal(res.statusCode, 400)

  p.caches.presets.set('categories', { preset: {} })
  p.caches.layouts.set('nav', { links: [] })
  res = fakeRes()
  p.invalidateHandler({ headers: { authorization: 'Bearer shh' }, body: { surface: 'categories' } }, res)
  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.json().invalidated, ['preset', 'navigation-layout', 'landing-layout'])
  assert.equal(p.caches.presets.get('categories'), undefined, 'presetcachen ska vara utgången')
  assert.equal(p.caches.layouts.get('nav'), undefined)

  // booking rör bara sin egen post
  p.caches.layouts.set('nav', { links: [] })
  res = fakeRes()
  p.invalidateHandler({ headers: { authorization: 'Bearer shh' }, body: { surface: 'booking' } }, res)
  assert.deepEqual(res.json().invalidated, ['preset'])
  assert.notEqual(p.caches.layouts.get('nav'), undefined)
})

test('webhook: 401 utan bearer; 200 { received } och produktcache utgången vid inventory.*', () => {
  const p = proxyWith()
  let res = fakeRes()
  p.webhookHandler({ headers: {}, body: { action: 'inventory.updated' } }, res)
  assert.equal(res.statusCode, 401)

  p.caches.catalog.set('products', { products: [1] })
  p.caches.catalog.set('products?type=subscription', { products: [1] })
  p.caches.catalog.set('news', { news: [1] })
  res = fakeRes()
  p.webhookHandler({ headers: { authorization: 'Bearer shh' }, body: { action: 'inventory.reordered', productIds: [] } }, res)
  assert.equal(res.statusCode, 200)
  assert.deepEqual(res.json(), { received: true })
  assert.equal(p.caches.catalog.get('products'), undefined)
  assert.equal(p.caches.catalog.get('products?type=subscription'), undefined)
  assert.notEqual(p.caches.catalog.get('news'), undefined, 'nyheter rörs inte av lagerwebhooken')
})

test('mergePreset filtrerar okända nycklar och fyller defaults', () => {
  const s = mergePreset('categories', { columns: 4, evil: 'x', navLabel: 'Kat' })
  assert.equal(s.columns, 4)
  assert.equal(s.evil, undefined)
  assert.equal(s.navLabel, 'Kat')
  assert.equal(s.layoutVariant, 'grid')
  const b = mergePreset('booking', { heading: 'Hej', columns: 4 })
  assert.equal(b.heading, 'Hej')
  assert.equal(b.columns, undefined)
  assert.equal(b.layout, 'card')
  assert.equal(b.cornerRadius, 'small')
})

test('timingSafeEqualString hanterar olika längd och icke-strängar', () => {
  assert.equal(timingSafeEqualString('a', 'a'), true)
  assert.equal(timingSafeEqualString('a', 'ab'), false)
  assert.equal(timingSafeEqualString(undefined, 'a'), false)
})

// ─── Pass 2: routetabellen ──────────────────────────────────────────────────

const EXPECTED_ROUTES = [
  ['GET', '/config'], ['GET', '/presentation/:surface'], ['GET', '/navigation-layout'], ['GET', '/landing-layout'],
  ['GET', '/products'], ['GET', '/categories/:id/products'], ['GET', '/product/:id'], ['GET', '/variant/:stripePriceId'],
  ['GET', '/categories'], ['GET', '/news'], ['GET', '/prices'], ['GET', '/shipping-settings'], ['GET', '/branding'],
  ['GET', '/inventory/:productId'], ['GET', '/campaign-price/:productId'],
  ['POST', '/checkout'], ['POST', '/delivery-options'], ['POST', '/gift-cards/verify'], ['POST', '/carts/track'],
  ['GET', '/booking/*'], ['POST', '/booking/bookings'], ['GET', '/booking-cancel'], ['POST', '/booking-cancel'],
  ['POST', '/analytics/events'], ['POST', '/contact'], ['POST', '/analytics/ingest']
]

test('routetabellen är sluten och innehåller exakt de förväntade vägarna', () => {
  const p = proxyWith()
  assert.equal(p.routeTable.length, EXPECTED_ROUTES.length, `routetabellen har ${p.routeTable.length} poster, väntade ${EXPECTED_ROUTES.length}`)
  const methods = p.routeTable.map(([m]) => m)
  assert.deepEqual(methods, EXPECTED_ROUTES.map(([m]) => m))
})

async function call(p, method, path, extra) {
  const res = fakeRes()
  await p.handler({ method, path, url: path, headers: {}, query: {}, ...(extra || {}) }, res)
  return res
}

test('GET /variant/:id går till /storefront/:t/variant/:id och skickar 404 vidare', async () => {
  const seen = []
  const origFetch = global.fetch
  global.fetch = async (url) => { seen.push(url); return new Response(JSON.stringify({ success: false, error: 'Variant not found' }), { status: 404 }) }
  try {
    const res = await call(proxyWith(), 'GET', '/variant/price_x')
    assert.equal(res.statusCode, 404)
    assert.equal(seen[0], 'https://portal.invalid/storefront/testslug/variant/price_x')
  } finally { global.fetch = origFetch }
})

test('GET /categories/:id/products mappas till products?category=<id> och cachas som products-nyckel', async () => {
  const seen = []
  const origFetch = global.fetch
  global.fetch = async (url) => { seen.push(url); return new Response(JSON.stringify({ success: true, products: [] }), { status: 200 }) }
  try {
    const p = proxyWith()
    const res = await call(p, 'GET', '/categories/skydd/products')
    assert.equal(res.statusCode, 200)
    assert.equal(seen[0], 'https://portal.invalid/storefront/testslug/products?category=skydd')
    assert.notEqual(p.caches.catalog.get('products?category=skydd'), undefined)
    // Lagerwebhooken nollar den.
    const r2 = fakeRes()
    p.webhookHandler({ headers: { authorization: 'Bearer shh' }, body: { action: 'inventory.updated' } }, r2)
    assert.equal(p.caches.catalog.get('products?category=skydd'), undefined)
  } finally { global.fetch = origFetch }
})

test('POST /analytics/ingest är 404 när flaggan är av', async () => {
  const res = await call(proxyWith(), 'POST', '/analytics/ingest', { body: { events: [{ type: 'page_view', url: '/' }] } })
  assert.equal(res.statusCode, 404)
})

test('POST /analytics/ingest: tenant från env, ip bara med samtycke, geo strippad utan samtycke', async () => {
  const sent = []
  const origFetch = global.fetch
  global.fetch = async (url, opts) => { sent.push({ url, body: JSON.parse(opts.body), headers: opts.headers }); return new Response(JSON.stringify({ success: true }), { status: 200 }) }
  try {
    const p = proxyWith({ analyticsIngest: true, trustedProxyHops: 1 })
    const headers = { 'x-forwarded-for': '203.0.113.9, 10.0.0.1', 'x-tenant': 'evil' }
    // Utan samtycke
    let res = await call(p, 'POST', '/analytics/ingest', { headers, body: { tenant: 'evil', analyticsConsent: false, events: [{ type: 'page_view', url: '/', ip: '1.2.3.4', country: 'SE', properties: { city: 'X', keep: 1 } }] } })
    assert.equal(res.statusCode, 200)
    assert.equal(sent[0].url, 'https://portal.invalid/api/ingest/analytics')
    assert.equal(sent[0].body.tenant, 'testslug')
    assert.equal(sent[0].headers['X-Tenant'], 'testslug')
    assert.equal(sent[0].body.events[0].ip, undefined)
    assert.equal(sent[0].body.events[0].country, undefined)
    assert.deepEqual(sent[0].body.events[0].properties, { keep: 1 })
    // Med samtycke: besökarens IP ur XFF (ett hopp från höger), inte klientens påstådda ip
    res = await call(p, 'POST', '/analytics/ingest', { headers, body: { analyticsConsent: true, events: [{ type: 'page_view', url: '/', ip: '1.2.3.4' }] } })
    assert.equal(res.statusCode, 200)
    assert.equal(sent[1].body.events[0].ip, '10.0.0.1')
    // Tom events → 400 utan portalanrop
    res = await call(p, 'POST', '/analytics/ingest', { headers, body: { events: [] } })
    assert.equal(res.statusCode, 400)
    assert.equal(sent.length, 2)
  } finally { global.fetch = origFetch }
})

test('POST /checkout validerar det generella kontraktet och normaliserar quantity', async () => {
  const sent = []
  const origFetch = global.fetch
  global.fetch = async (url, opts) => { sent.push(JSON.parse(opts.body)); return new Response(JSON.stringify({ success: true }), { status: 200 }) }
  try {
    const p = proxyWith()
    let res = await call(p, 'POST', '/checkout', { body: { items: [] } })
    assert.equal(res.statusCode, 400)
    res = await call(p, 'POST', '/checkout', { body: { items: [{ variantKey: 'v1', stripePriceId: 'price_1' }] } })
    assert.equal(res.statusCode, 400, 'variantKey är kundspecifikt och mappas inte av adaptern')
    res = await call(p, 'POST', '/checkout', { body: { items: [{ variantId: 'v1', stripePriceId: 'price_1', quantity: 0 }], evilField: 1 } })
    assert.equal(res.statusCode, 200)
    assert.deepEqual(sent[0].items, [{ variantId: 'v1', quantity: 1, stripePriceId: 'price_1' }])
    assert.equal(sent[0].evilField, undefined)
    assert.equal(sent[0].metadata.source, 'storefront-adapter')
  } finally { global.fetch = origFetch }
})

test('PRESET_SURFACES matchar portalens STOREFRONT_KNOWN_SURFACES (storefrontPresetNotifier.js:40)', () => {
  assert.deepEqual([...PRESET_SURFACES], ['categories', 'news', 'subscriptions', 'gift_cards', 'booking'])
})
