// Kopierad från source-storefront-adapter main 1df51ce (tests/client/preview.test.js), sökvägen anpassad till public/adapter/.
// DOM-test för adapter/client/preview.js utan jsdom.
//
// En minimal handskriven window-fake: addEventListener/removeEventListener för
// 'message', och en dispatch-hjälpare som skapar ett MessageEvent-liknande objekt
// med origin, data och source. source är ett fake-fönster vars postMessage
// registrerar vad som skickades och till vilken targetOrigin. Inga beroenden.
//
// Körs med: npm test (node --test).

'use strict'

const test = require('node:test')
const assert = require('node:assert/strict')
const path = require('node:path')

function makeWindow() {
  const listeners = { message: [] }
  return {
    addEventListener(type, fn) { (listeners[type] = listeners[type] || []).push(fn) },
    removeEventListener(type, fn) { listeners[type] = (listeners[type] || []).filter((f) => f !== fn) },
    listenerCount(type) { return (listeners[type] || []).length },
    dispatch(event) { for (const fn of [...(listeners.message || [])]) fn(event) }
  }
}

function makeSource() {
  const sent = []
  return { sent, postMessage(data, targetOrigin) { sent.push({ data, targetOrigin }) } }
}

function msg(origin, data, source) {
  return { origin, data, source }
}

const PORTAL = 'https://portal.example'
const EVIL = 'https://evil.example'

function load() {
  // preview.js är UMD: i Node sätter den module.exports. Fräsch laddning per test.
  const file = path.join(__dirname, '..', 'public', 'adapter', 'preview.js')
  delete require.cache[require.resolve(file)]
  return require(file)
}

function setup(opts) {
  const win = makeWindow()
  global.window = win
  const SourcePreview = load()
  const calls = { preset: [], product: [], order: [], clear: 0 }
  const handle = SourcePreview.start({
    surface: 'categories',
    allowedOrigins: [PORTAL],
    presetKeys: ['columns', 'layoutVariant'],
    onPreset: (p) => calls.preset.push(p),
    onProduct: (product, styling, draft) => calls.product.push({ product, styling, draft }),
    onOrder: (o) => calls.order.push(o),
    onClear: () => { calls.clear += 1 },
    ...(opts || {})
  })
  return { win, SourcePreview, handle, calls }
}

test('utan allowedOrigins registreras ingen lyssnare (fail closed)', () => {
  const win = makeWindow()
  global.window = win
  const SourcePreview = load()
  const h = SourcePreview.start({ surface: 'categories', allowedOrigins: [] })
  assert.equal(win.listenerCount('message'), 0)
  assert.equal(h.isActive(), false)
  assert.equal(h.sendOrderChanged(['a']), false)
})

test('SOURCE_PREVIEW_PRESET: filtrerar nycklar, anropar onPreset och ACK:ar med surface till event.origin', () => {
  const { win, handle, calls } = setup()
  const src = makeSource()
  win.dispatch(msg(PORTAL, { type: 'SOURCE_PREVIEW_PRESET', surface: 'categories', preset: { columns: 4, evil: 'x' } }, src))
  assert.deepEqual(calls.preset, [{ columns: 4 }])
  assert.deepEqual(src.sent, [{ data: { type: 'SOURCE_PREVIEW_ACK', surface: 'categories' }, targetOrigin: PORTAL }])
  assert.equal(handle.isActive(), true)
})

test('PRESET med annan surface ignoreras utan ACK', () => {
  const { win, calls } = setup()
  const src = makeSource()
  win.dispatch(msg(PORTAL, { type: 'SOURCE_PREVIEW_PRESET', surface: 'news', preset: { columns: 2 } }, src))
  assert.equal(calls.preset.length, 0)
  assert.equal(src.sent.length, 0)
})

test('SOURCE_PREVIEW_PRODUCT: accepteras utan surface, med draftOrderable och styling, och ACK:ar', () => {
  const { win, calls } = setup()
  const src = makeSource()
  win.dispatch(msg(PORTAL, { type: 'SOURCE_PREVIEW_PRODUCT', product: { name: 'Utkast', price: 10 }, styling: { badgeText: 'Ny' }, draftOrderable: true }, src))
  assert.equal(calls.product.length, 1)
  assert.deepEqual(calls.product[0].product, { name: 'Utkast', price: 10 })
  assert.deepEqual(calls.product[0].styling, { badgeText: 'Ny' })
  assert.equal(calls.product[0].draft, true)
  assert.equal(src.sent[0].data.type, 'SOURCE_PREVIEW_ACK')
})

test('SOURCE_PREVIEW_ORDER: bara strängnycklar vidare, ACK:ar', () => {
  const { win, calls } = setup()
  const src = makeSource()
  win.dispatch(msg(PORTAL, { type: 'SOURCE_PREVIEW_ORDER', surface: 'categories', order: ['b', '', 7, 'a'] }, src))
  assert.deepEqual(calls.order, [['b', 'a']])
  assert.equal(src.sent.length, 1)
})

test('SOURCE_PREVIEW_CLEAR: anropar onClear och ACK:ar', () => {
  const { win, calls } = setup()
  const src = makeSource()
  win.dispatch(msg(PORTAL, { type: 'SOURCE_PREVIEW_CLEAR', surface: 'categories' }, src))
  assert.equal(calls.clear, 1)
  assert.equal(src.sent.length, 1)
})

test('SOURCE_PREVIEW_ACK inkommande och okända typer ignoreras utan ACK', () => {
  const { win, calls } = setup()
  const src = makeSource()
  win.dispatch(msg(PORTAL, { type: 'SOURCE_PREVIEW_ACK', surface: 'categories' }, src))
  win.dispatch(msg(PORTAL, { type: 'SOMETHING_ELSE' }, src))
  win.dispatch(msg(PORTAL, 'inte ett objekt', src))
  assert.equal(src.sent.length, 0)
  assert.equal(calls.preset.length + calls.product.length + calls.order.length + calls.clear, 0)
})

test('avvisad origin: ingen callback, ingen ACK, inte aktiv', () => {
  const { win, handle, calls } = setup()
  const src = makeSource()
  win.dispatch(msg(EVIL, { type: 'SOURCE_PREVIEW_PRESET', surface: 'categories', preset: { columns: 1 } }, src))
  win.dispatch(msg(EVIL, { type: 'SOURCE_PREVIEW_CLEAR' }, src))
  assert.equal(calls.preset.length, 0)
  assert.equal(calls.clear, 0)
  assert.equal(src.sent.length, 0)
  assert.equal(handle.isActive(), false)
})

test('betrodd avsändare låses: ett andra fönster från tillåten origin ignoreras', () => {
  const { win, calls } = setup()
  const first = makeSource()
  const second = makeSource()
  win.dispatch(msg(PORTAL, { type: 'SOURCE_PREVIEW_PRESET', surface: 'categories', preset: { columns: 3 } }, first))
  win.dispatch(msg(PORTAL, { type: 'SOURCE_PREVIEW_PRESET', surface: 'categories', preset: { columns: 5 } }, second))
  assert.deepEqual(calls.preset, [{ columns: 3 }])
  assert.equal(second.sent.length, 0)
  assert.equal(first.sent.length, 1)
})

test('SOURCE_PREVIEW_ORDER_CHANGED går bara till den betrodda avsändaren med surface och order', () => {
  const { win, handle } = setup({ surface: 'subscriptions' })
  const src = makeSource()
  assert.equal(handle.sendOrderChanged(['a']), false, 'ingen betrodd avsändare ännu')
  win.dispatch(msg(PORTAL, { type: 'SOURCE_PREVIEW_ORDER', surface: 'subscriptions', order: ['a', 'b'] }, src))
  assert.equal(handle.sendOrderChanged(['b', 'a']), true)
  const out = src.sent.find((s) => s.data.type === 'SOURCE_PREVIEW_ORDER_CHANGED')
  assert.deepEqual(out, { data: { type: 'SOURCE_PREVIEW_ORDER_CHANGED', surface: 'subscriptions', order: ['b', 'a'] }, targetOrigin: PORTAL })
})

test('stop() tar bort lyssnaren och nollar betrodd avsändare', () => {
  const { win, handle } = setup()
  const src = makeSource()
  win.dispatch(msg(PORTAL, { type: 'SOURCE_PREVIEW_CLEAR' }, src))
  handle.stop()
  assert.equal(win.listenerCount('message'), 0)
  assert.equal(handle.isActive(), false)
  assert.equal(handle.sendOrderChanged(['a']), false)
})

test('applyOrder och orderKeys speglar portalens semantik (nämnda först, resten sist, __preview__ bara med allowDraft)', () => {
  global.window = makeWindow()
  const SourcePreview = load()
  const items = [{ id: 'x', baseSku: 'x' }, { id: '__preview__' }, { id: 'y', baseSku: 'y' }, { id: 'z', baseSku: 'z' }]
  const ordered = SourcePreview.applyOrder(items, ['z', 'unknown', 'x'])
  assert.deepEqual(ordered.map((i) => i.id), ['z', 'x', '__preview__', 'y'])
  assert.deepEqual(SourcePreview.orderKeys(items), ['x', 'y', 'z'])
  assert.deepEqual(SourcePreview.orderKeys(items, 'baseSku', true), ['x', '__preview__', 'y', 'z'])
})
