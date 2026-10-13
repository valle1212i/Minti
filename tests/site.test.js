// Kontroller av klientkoden: sidor, meny och att demosajten saknar portalkoppling.
//
//   node --test tests/*.test.js

'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')

const ROOT = path.join(__dirname, '..')
const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8')
const ROUTES = require('../src/data/routes.json')

function walk(dir) {
  return fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}

const app = read('src/App.js')

test('App.js har en route för varje sida i routes.json, plus 404', () => {
  for (const route of ROUTES) {
    assert.ok(app.includes(`path="${route}"`), `route ${route} saknas i src/App.js`)
  }
  assert.ok(app.includes('path="*"'), '404-route saknas')
})

test('varje importerad sida finns som fil', () => {
  for (const m of app.matchAll(/from '\.\/pages\/([A-Za-z]+)'/g)) {
    assert.ok(fs.existsSync(path.join(ROOT, 'src', 'pages', `${m[1]}.js`)), `src/pages/${m[1]}.js saknas`)
  }
})

test('menyns brytpunkt är samma i Navbar.js och Navbar.css', () => {
  const js = read('src/components/Navbar.js').match(/MOBILE_MAX_WIDTH = (\d+)/)
  assert.ok(js, 'MOBILE_MAX_WIDTH saknas')
  const css = read('src/components/Navbar.css')
  assert.ok(css.includes(`@media (max-width: ${js[1]}px)`), `Navbar.css saknar @media (max-width: ${js[1]}px)`)
})

test('menyns länkar pekar på sidor som finns', () => {
  const nav = read('src/components/Navbar.js')
  for (const m of nav.matchAll(/to: '([^']+)'/g)) {
    const p = m[1].split('#')[0]
    assert.ok(ROUTES.includes(p), `menylänken ${m[1]} saknar route`)
  }
})

test('ingen portal, tenant, spårning eller betalning i källkoden', () => {
  const files = [...walk('src'), 'server.js', 'public/index.html'].filter((f) => /\.(js|json|html|css)$/.test(f))
  const forbidden = [/\/api\/portal/, /SOURCE_[A-Z_]+/, /FRONTEND_SYNC_SECRET/, /tenant/i, /stripe/i, /analytics/i, /fetch\(/]
  for (const f of files) {
    // Kommentarer får beskriva vad som saknas ("ingen tenant"); bara koden kontrolleras.
    const src = read(f).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '')
    for (const re of forbidden) {
      assert.ok(!re.test(src), `${f} innehåller ${re}`)
    }
  }
})

test('inga verkliga kontaktuppgifter eller externa bilder', () => {
  const files = [...walk('src')].filter((f) => /\.(js|css)$/.test(f))
  for (const f of files) {
    const src = read(f)
    assert.ok(!/747 ?61 ?00|Hamndalsvägen|yasuragi|Saltsjön/i.test(src), `${f} innehåller verkliga uppgifter`)
    assert.ok(!/unsplash/i.test(src), `${f} hämtar bilder från Unsplash`)
  }
})

test('alla lokala bilder som används finns i public/', () => {
  const files = [...walk('src')].filter((f) => /\.js$/.test(f))
  const names = new Set()
  for (const f of files) {
    const src = read(f)
    for (const m of src.matchAll(/(?:image(?:=|: )|name: |<Picture name=)['"]([a-z0-9]+)['"]/g)) names.add(m[1])
  }
  for (const n of names) {
    assert.ok(fs.existsSync(path.join(ROOT, 'public', 'bilder', `${n}-640.webp`)), `bilder/${n}-640.webp saknas`)
    assert.ok(fs.existsSync(path.join(ROOT, 'public', 'bilder', `${n}-1232.webp`)), `bilder/${n}-1232.webp saknas`)
  }
})
