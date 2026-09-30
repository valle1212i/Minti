// Uppstarts- och routingtest för server.js (ONBOARDING.md D4), utan nätverk mot portalen.
//
//   node --test tests/*.test.js
//
// Bevisar med påhittade dummy-värden:
//  - /health och adaptervägarna svarar JSON, aldrig sajtens index.html (SPA-skydd:
//    varje kontroll läser content-type, inte bara statuskoden).
//  - portalens inkommande vägar svarar 401 utan hemlighet, 400 vid okänd yta och 200 med rätt.
//  - okända /api-vägar ger JSON 404, POST mot en sida ger 404, GET mot en sida ger index.html.
//  - klientens X-Tenant når aldrig portalen; tenant kommer från miljön.
//  - inramning begränsas till sajten själv och portalens origins.
//  - servern dör vid start med "Missing required env: NAMN" när ett obligatoriskt namn saknas.

'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const path = require('node:path')
const fs = require('node:fs')
const os = require('node:os')
const { spawnSync } = require('node:child_process')

const { createApp } = require(path.join(__dirname, '..', 'server.js'))

const ENV = {
  SOURCE_BASE_URL: 'https://portal.invalid',
  SOURCE_TENANT_ID: 'dummy-slug',
  FRONTEND_SYNC_SECRET: 'dummy-secret',
  SOURCE_PREVIEW_ORIGINS: 'https://portal.example'
}

const buildDir = fs.mkdtempSync(path.join(os.tmpdir(), 'minti-build-'))
fs.writeFileSync(path.join(buildDir, 'index.html'), '<!doctype html><html><body><div id="root"></div></body></html>')

// Testklienten använder http, inte fetch, så att fetch kan stubbas för portalanropen.
function call(server, method, urlPath, { headers, body } = {}) {
  const { port } = server.address()
  return new Promise((resolve, reject) => {
    const payload = body === undefined ? null : JSON.stringify(body)
    const req = http.request({ host: '127.0.0.1', port, method, path: urlPath, headers: { ...(payload ? { 'Content-Type': 'application/json' } : {}), ...(headers || {}) } }, (res) => {
      let data = ''
      res.on('data', (c) => { data += c })
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, text: data }))
    })
    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

function isJson(res) {
  return String(res.headers['content-type'] || '').includes('application/json')
}

let server
const portalCalls = []
const realFetch = global.fetch

test.before(async () => {
  // Portalen nås inte i testet: varje uppströmsanrop registreras och besvaras med ett tomt svar.
  global.fetch = async (url, opts) => {
    portalCalls.push({ url: String(url), headers: (opts && opts.headers) || {} })
    return new Response(JSON.stringify({ success: true, categories: [], links: [] }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }
  const app = createApp(ENV, { buildDir })
  await new Promise((resolve) => { server = app.listen(0, '127.0.0.1', resolve) })
})

test.after(async () => {
  global.fetch = realFetch
  await new Promise((resolve) => server.close(resolve))
  fs.rmSync(buildDir, { recursive: true, force: true })
})

test('/health svarar JSON', async () => {
  const res = await call(server, 'GET', '/health')
  assert.equal(res.status, 200)
  assert.ok(isJson(res))
  assert.deepEqual(JSON.parse(res.text), { status: 'ok' })
})

test('GET /api/portal/config svarar JSON med tenant och preview-origins ur miljön', async () => {
  const res = await call(server, 'GET', '/api/portal/config')
  assert.equal(res.status, 200)
  assert.ok(isJson(res))
  assert.deepEqual(JSON.parse(res.text), { previewOrigins: ['https://portal.example'], tenant: 'dummy-slug' })
})

test('invalidate: 401 utan hemlighet, 400 okänd yta, 200 med rätt hemlighet (JSON)', async () => {
  const none = await call(server, 'POST', '/api/presentation/invalidate', { body: { surface: 'categories' } })
  assert.equal(none.status, 401)
  assert.ok(isJson(none))
  const unknown = await call(server, 'POST', '/api/presentation/invalidate', { headers: { Authorization: 'Bearer dummy-secret' }, body: { surface: 'nope' } })
  assert.equal(unknown.status, 400)
  assert.ok(isJson(unknown))
  const ok = await call(server, 'POST', '/api/presentation/invalidate', { headers: { Authorization: 'Bearer dummy-secret' }, body: { surface: 'categories' } })
  assert.equal(ok.status, 200)
  assert.ok(isJson(ok))
  assert.equal(JSON.parse(ok.text).success, true)
})

test('lagerwebhook: 401 utan hemlighet, 200 med rätt hemlighet (JSON)', async () => {
  const none = await call(server, 'POST', '/api/campaigns/webhook', { body: { action: 'inventory.updated' } })
  assert.equal(none.status, 401)
  assert.ok(isJson(none))
  const ok = await call(server, 'POST', '/api/campaigns/webhook', { headers: { Authorization: 'Bearer dummy-secret' }, body: { action: 'inventory.updated' } })
  assert.equal(ok.status, 200)
  assert.ok(isJson(ok))
  assert.deepEqual(JSON.parse(ok.text), { received: true })
})

test('okända /api-vägar ger JSON 404, aldrig index.html', async () => {
  for (const p of ['/api/finns-inte', '/api/portal/finns-inte', '/api/inventory/sync']) {
    const res = await call(server, 'GET', p)
    assert.equal(res.status, 404, p)
    assert.ok(isJson(res), `${p}: väntade JSON`)
    assert.ok(!res.text.includes('<div id="root">'), `${p}: fick index.html`)
  }
})

test('sidor: GET ger index.html, POST ger 404 utan index.html', async () => {
  const get = await call(server, 'GET', '/book')
  assert.equal(get.status, 200)
  assert.match(String(get.headers['content-type']), /text\/html/)
  assert.ok(get.text.includes('<div id="root">'))
  const post = await call(server, 'POST', '/book', { body: {} })
  assert.equal(post.status, 404)
  assert.ok(!post.text.includes('<div id="root">'))
})

test('produktsidan: GET /product/<id> ger index.html, produktdetaljen via adaptern ger JSON', async () => {
  const page = await call(server, 'GET', '/product/finns-inte')
  assert.equal(page.status, 200)
  assert.match(String(page.headers['content-type']), /text\/html/)
  assert.ok(page.text.includes('<div id="root">'))
  portalCalls.length = 0
  const api = await call(server, 'GET', '/api/portal/product/finns-inte')
  assert.ok(isJson(api))
  assert.ok(!api.text.includes('<div id="root">'))
  assert.match(portalCalls[0].url, /\/storefront\/dummy-slug\/product\/finns-inte$/)
})

test('klientens X-Tenant når aldrig portalen', async () => {
  portalCalls.length = 0
  const res = await call(server, 'GET', '/api/portal/categories', { headers: { 'X-Tenant': 'annan-tenant' } })
  assert.equal(res.status, 200)
  assert.ok(isJson(res))
  assert.equal(portalCalls.length, 1)
  assert.match(portalCalls[0].url, /\/storefront\/dummy-slug\/categories$/)
  assert.equal(portalCalls[0].headers['X-Tenant'], 'dummy-slug')
})

test('inramning: frame-ancestors bara sajten och portalens origins', async () => {
  const res = await call(server, 'GET', '/book')
  assert.equal(res.headers['content-security-policy'], "frame-ancestors 'self' https://portal.example")
  assert.equal(res.headers['x-content-type-options'], 'nosniff')
})

test('/go/:id: okänd länk ger 404', async () => {
  const res = await call(server, 'GET', '/go/finns-inte')
  assert.equal(res.status, 404)
})

test('servern dör vid start utan SOURCE_TENANT_ID, med namnet men inget värde i felet', () => {
  const env = { PATH: process.env.PATH, SOURCE_BASE_URL: ENV.SOURCE_BASE_URL, FRONTEND_SYNC_SECRET: ENV.FRONTEND_SYNC_SECRET, PORT: '0' }
  const r = spawnSync(process.execPath, [path.join(__dirname, '..', 'server.js')], { env, encoding: 'utf8', timeout: 10000 })
  assert.equal(r.status, 1)
  assert.match(r.stderr, /Missing required env: SOURCE_TENANT_ID/)
  assert.ok(!r.stderr.includes('dummy-secret'))
})
