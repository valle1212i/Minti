// Sidvisningar till kundportalens analys via sajtens server (/api/portal/analytics/ingest).
//
// Skickar bara sökvägen (utan query) och sidtiteln. analyticsConsent är false: sajten har
// ingen samtyckesruta, så servern vidarebefordrar varken besökarens IP eller geodata.
// Inget skickas från portalens förhandsvisning (sajten inramad), och vägen är av om
// PORTAL_ANALYTICS_INGEST inte är satt på servern (då svarar den 404 och felet ignoreras).

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function sendPageView(pathname) {
  try {
    if (window.self !== window.top) return;
    fetch('/api/portal/analytics/ingest', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      keepalive: true,
      body: JSON.stringify({
        analyticsConsent: false,
        events: [{ type: 'page_view', url: pathname, title: document.title, timestamp: new Date().toISOString() }]
      })
    }).catch(() => {});
  } catch (e) {
    // Analys får aldrig påverka sidan.
  }
}

export function PageViewTracker() {
  const { pathname } = useLocation();
  useEffect(() => {
    sendPageView(pathname);
  }, [pathname]);
  return null;
}
