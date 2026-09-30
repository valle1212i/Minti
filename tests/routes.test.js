// Klientens sidor: varje portalyta är en route i App.js och, när bygget finns, i klientpaketet.
//
//   node --test tests/*.test.js
//
// En SPA svarar 200 med index.html på varje sökväg, så en saknad route syns inte i
// serverns svar, bara som en tom sida. Testet läser därför routerna ur källan och ur
// det byggda paketet (build/ efter npm run build; hoppas över om bygget saknas).

'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.join(__dirname, '..')
const PORTAL_ROUTES = [
  '/book', '/shop', '/product/:id', '/categories', '/categories/:slug',
  '/news', '/subscriptions', '/gift-cards', '/tack', '/contact'
]

const app = fs.readFileSync(path.join(ROOT, 'src', 'App.js'), 'utf8')

test('App.js deklarerar varje portalyta som route', () => {
  for (const route of PORTAL_ROUTES) {
    assert.ok(app.includes(`path="${route}"`), `route ${route} saknas i src/App.js`)
  }
})

test('varje importerad sida finns som fil', () => {
  for (const m of app.matchAll(/from '\.\/pages\/([A-Za-z]+)'/g)) {
    assert.ok(fs.existsSync(path.join(ROOT, 'src', 'pages', `${m[1]}.js`)), `src/pages/${m[1]}.js saknas`)
  }
})

test('produktkorten länkar till produktsidan', () => {
  const grid = fs.readFileSync(path.join(ROOT, 'src', 'components', 'ProductGrid.js'), 'utf8')
  assert.match(grid, /`\/product\/\$\{encodeURIComponent\(product\.id\)\}`/)
})

test('klientpaketet innehåller varje portalyta som route', (t) => {
  const jsDir = path.join(ROOT, 'build', 'static', 'js')
  const main = fs.existsSync(jsDir) && fs.readdirSync(jsDir).find((f) => /^main\.[a-z0-9]+\.js$/.test(f))
  if (!main) return t.skip('build/ saknas; kör npm run build först')
  const bundle = fs.readFileSync(path.join(jsDir, main), 'utf8')
  for (const route of PORTAL_ROUTES) {
    assert.ok(bundle.includes(`"${route}"`), `route ${route} saknas i ${main}`)
  }
})
