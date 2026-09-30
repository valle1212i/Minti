// Klientens koppling till kundportalen, via sajtens egen server (/api/portal/*).
//
// Webbläsaren anropar aldrig portalen direkt: servern (server.js + lib/portal/) sätter
// tenant ur sin miljö och skickar bara kända fält vidare. Varje svar kontrolleras vara
// JSON, så ett index.html-svar (fel sökväg) aldrig tolkas som data.
//
// Förhandsvisningen (usePreview) och hämta-om-vid-synlighet (useRefreshOnVisible) bygger
// på adapterns klientfiler, som laddas globalt i public/index.html (window.SourcePreview,
// window.SourceRefresh).

import { useCallback, useEffect, useRef, useState } from 'react';

const BASE = '/api/portal';

async function readJson(response) {
  const type = response.headers.get('content-type') || '';
  if (!type.includes('application/json')) {
    throw new Error('Oväntat svar från servern');
  }
  return response.json();
}

export async function portalGet(path) {
  const response = await fetch(`${BASE}${path}`, { credentials: 'same-origin' });
  const body = await readJson(response);
  if (!response.ok) {
    const err = new Error((body && (body.message || body.error)) || 'Kunde inte hämta data');
    err.status = response.status;
    throw err;
  }
  return body;
}

export async function portalPost(path, payload) {
  const response = await fetch(`${BASE}${path}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload || {})
  });
  const body = await readJson(response);
  if (!response.ok || (body && body.success === false)) {
    const err = new Error((body && (body.message || body.error)) || 'Något gick fel');
    err.status = response.status;
    err.body = body;
    throw err;
  }
  return body;
}

// Hämtar om när fliken blir synlig igen (högst en gång per minut), så att ändringar
// som sparats i portalen syns utan omladdning.
export function useRefreshOnVisible(refetch) {
  const ref = useRef(refetch);
  ref.current = refetch;
  useEffect(() => {
    if (!window.SourceRefresh) return undefined;
    const handle = window.SourceRefresh.onVisible(() => ref.current());
    return () => handle.stop();
  }, []);
}

// GET mot adaptern med laddnings- och felstatus. `path` null hoppar över anropet.
export function usePortal(path) {
  const [state, setState] = useState({ data: null, error: null, loading: !!path });
  const load = useCallback(() => {
    if (!path) return Promise.resolve();
    return portalGet(path)
      .then((data) => setState({ data, error: null, loading: false }))
      .catch((error) => setState((prev) => ({ data: prev.data, error, loading: false })));
  }, [path]);
  useEffect(() => {
    setState((prev) => ({ ...prev, loading: !!path }));
    load();
  }, [load, path]);
  useRefreshOnVisible(load);
  return { ...state, reload: load };
}

// Presentationsinställningar för en yta (categories, news, subscriptions, gift_cards, booking).
export function usePreset(surface) {
  const { data } = usePortal(`/presentation/${surface}`);
  return (data && data.preset) || null;
}

let originsPromise = null;
function allowedOrigins() {
  if (!window.SourcePreview) return Promise.resolve([]);
  if (!originsPromise) originsPromise = window.SourcePreview.fetchAllowedOrigins(`${BASE}/config`);
  return originsPromise;
}

// Mottagare för portalens live-förhandsvisning på en sida. Startas när sidan visas och
// stoppas när den lämnas. Utan preview-origins i serverns miljö lyssnar den inte alls.
export function usePreview(options) {
  const ref = useRef(options);
  ref.current = options;
  const surface = options.surface;
  useEffect(() => {
    let receiver = null;
    let cancelled = false;
    allowedOrigins().then((origins) => {
      if (cancelled || !window.SourcePreview) return;
      receiver = window.SourcePreview.start({
        surface,
        allowedOrigins: origins,
        presetKeys: ref.current.presetKeys,
        onPreset: (preset) => ref.current.onPreset && ref.current.onPreset(preset),
        onProduct: (product, styling, draftOrderable) => ref.current.onProduct && ref.current.onProduct(product, styling, draftOrderable),
        onOrder: (order) => ref.current.onOrder && ref.current.onOrder(order),
        onClear: () => ref.current.onClear && ref.current.onClear()
      });
    });
    return () => {
      cancelled = true;
      if (receiver) receiver.stop();
    };
  }, [surface]);
}

// Designfälten för butiksytorna, samma lista som adapterns sluten nyckellista.
export const STOREFRONT_PRESET_KEYS = [
  'layoutVariant', 'columns', 'imageShape', 'cardStyle', 'spacing', 'showBadges', 'showExcerpt',
  'cornerRadius', 'accentUsage', 'imageStyle', 'titleWeight', 'placement', 'purchaseAction', 'navLabel'
];

export const BOOKING_PRESET_KEYS = [
  'layout', 'flowMode', 'cornerRadius', 'spacing', 'theme', 'showServiceStep', 'showProviderStep',
  'showSummary', 'showAvailability', 'dateTimeCombined', 'heading', 'subtitle', 'confirmButtonLabel',
  'successMessage', 'termsUrl', 'privacyUrl'
];

// CSS-klasser och variabler ur ett butikspreset, så sidorna följer designen i portalen.
export function presetClassNames(preset) {
  const p = preset || {};
  return [
    'portal-grid',
    `layout-${p.layoutVariant || 'grid'}`,
    `card-${p.cardStyle || 'bordered'}`,
    `spacing-${p.spacing || 'normal'}`,
    `radius-${p.cornerRadius || 'small'}`,
    `shape-${p.imageShape || 'square'}`,
    `title-${p.titleWeight || 'bold'}`
  ].join(' ');
}

export function presetStyle(preset) {
  const columns = Number(preset && preset.columns) || 3;
  return { '--portal-columns': Math.min(Math.max(columns, 1), 6) };
}

export function formatPrice(ore) {
  if (typeof ore !== 'number' || !Number.isFinite(ore)) return '';
  return `${(ore / 100).toLocaleString('sv-SE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })} kr`;
}

// Skickar besökaren till portalens kassa (Stripe) för en variant. Kundspecifikt lager
// ovanpå adapterns POST /checkout: en vara åt gången.
export async function startCheckout({ variant, quantity = 1, giftCardCode }) {
  if (!variant || !variant.articleNumber || !variant.stripePriceId) {
    throw new Error('Produkten går inte att köpa just nu');
  }
  const origin = window.location.origin;
  const result = await portalPost('/checkout', {
    items: [{ variantId: variant.articleNumber, stripePriceId: variant.stripePriceId, quantity }],
    successUrl: `${origin}/tack?status=klar`,
    cancelUrl: `${origin}${window.location.pathname}`,
    ...(giftCardCode ? { giftCardCode } : {})
  });
  if (!result || !result.checkoutUrl) throw new Error('Kassan kunde inte öppnas');
  window.location.assign(result.checkoutUrl);
}
