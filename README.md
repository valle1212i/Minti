# Minti – konceptsajt

Minti är en konceptsajt för en påhittad wellnessanläggning med bad, bastu och stillhet.
Sajten är en **demosajt**: alla produkter, priser, nyheter, lediga tider och kontaktuppgifter
är påhittade och ligger i repot. Inga köp, bokningar eller meddelanden skickas någonstans.

## Innehåll

- Startsida med video, sidor för upplevelsen, bastu, tjänster, galleri, om oss och kontakt.
- Butik, kategorier, produktsidor, presentkort och prenumerationer med demodata (`src/data/shop.js`).
- Bokning med lediga tider som räknas fram lokalt (`src/data/booking.js`) och en bekräftelse i sidan.
- Demokassa utan betalning (`/kassa`), nyheter (`src/data/news.js`), integritetspolicy, villkor och 404-sida.

Ingen koppling till kundportalen, ingen tenant, ingen spårning och inga hemligheter.

## Kom igång

```bash
npm ci
npm run dev      # utvecklingsserver (react-scripts)
npm run build    # bygger till build/
npm start        # node server.js serverar build/ på PORT (standard 8080)
npm test         # node --test tests/*.test.js
```

## Struktur

- `src/pages/` – sidorna. `Home.js`/`Home.css` är startsidan.
- `src/components/ui.js` och `src/styles/site.css` – gemensamma byggstenar för undersidorna. Alla klasser har prefixet `m-` så att de inte krockar med startsidans klasser.
- `src/components/Navbar.js` – menyn. Brytpunkten `MOBILE_MAX_WIDTH` måste stämma med `Navbar.css` (testas).
- `src/data/` – demodata och sidlistan `routes.json`, som även servern använder för att svara 404 på okända adresser.
- `public/bilder/` – bilderna som WebP i 640 och 1232 px bredd.

## Kontaktuppgifter

Telefonnumret 070-174 06 50 ligger i serien som Post- och telestyrelsen reserverat för fiktiva
ändamål. E-postdomänen `.example` är reserverad och tar inte emot post. Adressen är påhittad.
