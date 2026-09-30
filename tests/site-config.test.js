// Kopierad från source-storefront-adapter main 1df51ce (adapter/templates/site-config.test.js), konstanterna justerade för Minti.
// Mall: sajtens konfigurationstest enligt ONBOARDING.md B0.
//
// Kopiera till sajtens tests/-katalog och justera de tre konstanterna nedan.
// Körs med Nodes inbyggda testrunner (node --test tests/*.test.js), inga beroenden.
// Bevisar att konfigurationen kommer enbart ur env och är fail closed, att sajtens
// egna routes varken läser tenant ur request eller sprider klientheaders, och att
// de kopierade adapterfilerna bär proveniensrad.
//
// SITE_ROOT i env överstyr sajtens rot (används för att köra mallen mot en sajt
// utan att kopiera in den).

'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')
const fs = require('node:fs')

const root = process.env.SITE_ROOT || path.join(__dirname, '..')

// ─── Justera per sajt ────────────────────────────────────────────────────────

// Katalogen där adapterns serverfiler kopierades in (B0).
const PORTAL_DIR = 'lib/portal'

// Alla kopierade adapterfiler, server och klient, relativt sajtens rot.
const COPIED_FILES = [
  'lib/portal/portalProxy.js',
  'lib/portal/portalProxy.d.ts',
  'lib/portal/cache.js',
  'lib/portal/config.js',
  'lib/portal/config.d.ts',
  'lib/portal/nextBridge.js',
  'lib/portal/nextBridge.d.ts',
  'public/adapter/preview.js',
  'public/adapter/invalidate-hook.js'
]

// Sajtens egna filer som monterar adaptern (kompatibilitetslager, brygga,
// route-filer). Ingen av dem får läsa tenant ur request eller sprida headers.
const SITE_MOUNT_FILES = [
  'server.js',
  'src/lib/portal.js',
  'src/lib/analytics.js'
]

// ─── Testerna ────────────────────────────────────────────────────────────────

const { readConfigFromEnv, REQUIRED_ENV } = require(path.join(root, PORTAL_DIR, 'config.js'))

const BASE = { SOURCE_BASE_URL: 'https://portal.invalid', FRONTEND_SYNC_SECRET: 'dummy' }

test('konfiguration: tenant och preview-origins ur env', () => {
  const c = readConfigFromEnv({ ...BASE, SOURCE_TENANT_ID: 'demo-slug', SOURCE_PREVIEW_ORIGINS: 'https://a.example, https://b.example' })
  assert.equal(c.tenant, 'demo-slug')
  assert.deepEqual(c.previewOrigins, ['https://a.example', 'https://b.example'])
})

test('konfiguration: fail closed på varje obligatoriskt namn, utan värden i felet', () => {
  assert.deepEqual([...REQUIRED_ENV], ['SOURCE_BASE_URL', 'SOURCE_TENANT_ID', 'FRONTEND_SYNC_SECRET'])
  const full = { ...BASE, SOURCE_TENANT_ID: 'demo-slug' }
  for (const name of REQUIRED_ENV) {
    const env = { ...full }
    delete env[name]
    assert.throws(() => readConfigFromEnv(env), (err) => err.message === `Missing required env: ${name}`)
  }
})

test('sajtens monteringsfiler läser inte tenant ur request och sprider inga klientheaders', () => {
  for (const f of SITE_MOUNT_FILES) {
    const src = fs.readFileSync(path.join(root, f), 'utf8')
    assert.ok(!/process\.env\.NEXT_PUBLIC_/.test(src), `${f}: adapterkonfiguration får inte ha klientprefix`)
    assert.ok(!/searchParams\.get\(\s*['"]tenant['"]\s*\)/.test(src), `${f}: tenant får inte läsas ur query`)
    assert.ok(!/(query|body)\.tenant\b/.test(src), `${f}: tenant får inte läsas ur query eller body`)
    assert.ok(!/['"]x-tenant['"]/i.test(src.replace(/\/\/.*$/gm, '')), `${f}: X-Tenant får inte läsas eller sättas`)
    assert.ok(!/Object\.fromEntries\(\s*request\.headers\s*\)/.test(src), `${f}: klientheaders får inte spridas`)
  }
})

test('kopierade adapterfiler bär proveniensrad med repo, gren och commit', () => {
  for (const f of COPIED_FILES) {
    const first = fs.readFileSync(path.join(root, f), 'utf8').split('\n')[0]
    assert.match(first, /^\/\/ Kopierad från source-storefront-adapter \S+ [0-9a-f]{7,40} \(adapter\/[^)]+\)\. Ändra i adapter-repot, inte här\.$/, f)
  }
})
