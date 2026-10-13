// Test för server.js (demosajt utan portal och utan hemligheter).
//
//   node --test tests/*.test.js

'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const http = require('node:http')
const path = require('node:path')
const fs = require('node:fs')
const os = require('node:os')

const { createApp, isKnownRoute } = require(path.join(__dirname, '..', 'server.js'))

const buildDir = fs.mkdtempSync(path.join(os.tmpdir(), 'minti-build-'))
fs.writeFileSync(path.join(buildDir, 'index.html'), '<!doctype html><html><body><div id="root"></div></body></html>')

function call(server, method, urlPath) {
  const { port } = server.address()
  return new Promise((resolve, reject) => {
    const req = http.request({ host: '127.0.0.1', port, method, path: urlPath }, (res) => {
      let data = ''
      res.on('data', (c) => { data += c })
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, text: data }))
    })
    req.on('error', reject)
    req.end()
  })
}

let server

test.before(async () => {
  await new Promise((resolve) => { server = createApp({ buildDir }).listen(0, '127.0.0.1', resolve) })
})

test.after(async () => {
  await new Promise((resolve) => server.close(resolve))
  fs.rmSync(buildDir, { recursive: true, force: true })
})

test('/health svarar JSON', async () => {
  const res = await call(server, 'GET', '/health')
  assert.equal(res.status, 200)
  assert.deepEqual(JSON.parse(res.text), { status: 'ok' })
})

test('kända sidor ger index.html med 200', async () => {
  for (const p of ['/', '/book', '/shop', '/product/dagspa', '/categories/behandlingar', '/news/hostmeny-i-restaurangen', '/privacy', '/terms', '/kassa', '/about/']) {
    const res = await call(server, 'GET', p)
    assert.equal(res.status, 200, p)
    assert.ok(res.text.includes('<div id="root">'), p)
  }
})

test('okända sidor ger index.html med 404, så appen kan visa sin 404-sida', async () => {
  for (const p of ['/finns-inte', '/product', '/product/a/b', '/go/retur']) {
    const res = await call(server, 'GET', p)
    assert.equal(res.status, 404, p)
    assert.ok(res.text.includes('<div id="root">'), p)
  }
})

test('/api svarar alltid JSON 404 (sajten har inget API och ingen portal)', async () => {
  for (const p of ['/api/portal/products', '/api/portal/config', '/api/finns-inte']) {
    const res = await call(server, 'GET', p)
    assert.equal(res.status, 404, p)
    assert.match(String(res.headers['content-type']), /application\/json/)
  }
})

test('POST mot en sida ger 404', async () => {
  const res = await call(server, 'POST', '/contact')
  assert.equal(res.status, 404)
  assert.ok(!res.text.includes('<div id="root">'))
})

test('säkerhetshuvuden', async () => {
  const res = await call(server, 'GET', '/')
  assert.equal(res.headers['content-security-policy'], "frame-ancestors 'self'")
  assert.equal(res.headers['x-content-type-options'], 'nosniff')
  assert.equal(res.headers['x-powered-by'], undefined)
})

test('isKnownRoute matchar parametrar men bara ett segment', () => {
  assert.ok(isKnownRoute('/product/presentkort'))
  assert.ok(!isKnownRoute('/product/presentkort/extra'))
})

test('servern startar utan några miljövariabler', () => {
  const src = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8')
  const envNames = [...src.matchAll(/process\.env\.([A-Z_]+)/g)].map((m) => m[1])
  assert.deepEqual([...new Set(envNames)], ['PORT'])
})
