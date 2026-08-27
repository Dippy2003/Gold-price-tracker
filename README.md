# Sri Lanka Gold Price Tracker

A modern, real-time `Next.js 14` dashboard for Wijesinghe Jewelers with:

- App Router + TypeScript + Tailwind CSS
- Server-side fetching with fast revalidation
- Client-side live polling — prices update in the browser automatically, no page reload
- Local manual fallback data if the live source is unavailable
- Product price calculator (carat, weight, making cost, extra charges)

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Design

- Dark, modern gold-accent theme with glass-panel cards, soft ambient glow, and a
  mouse-reactive light layer (`components/MouseGlow.tsx`).
- A live status badge (`components/LivePriceBoard.tsx`) shows whether data is
  Live, Fallback, or unavailable, plus a ticking "checked Xs ago" timestamp.
- Price cards flash and show an up/down trend arrow when a poll detects a
  price change, so movement is visible without refreshing the page.

## Real-time updates

- `components/LivePriceBoard.tsx` is a client component that polls
  `/api/gold-price` every 30 seconds (`cache: "no-store"`) and swaps in fresh
  data without a full page reload, computing per-carat trend (up/down/flat)
  against the previous reading.
- The API route and the upstream parser both revalidate every 60 seconds
  (`revalidate = 60`) so server-side data itself stays fresh, independent of
  client polling.
- To change the polling cadence, edit `POLL_INTERVAL_MS` in
  `components/LivePriceBoard.tsx`.

## Data flow (simple)

1. Homepage (`app/page.tsx`) fetches from `/api/gold-price` on the server for
   the first paint, then hands off to `LivePriceBoard` for live polling.
2. API route (`app/api/gold-price/route.ts`) calls `getGoldPrice()`.
3. Service (`lib/gold/getGoldPrice.ts`) tries live parsing from Ravi Jewellers.
4. Parser (`lib/gold/parseRaviJewellers.ts`) fetches and parses HTML with
   regex/string matching.
5. If parsing fails, fallback data is loaded from:
   - `lib/gold/manualGoldPrice.json`
   - `lib/gold/manualSource.ts`
6. UI still works and clearly shows a "Fallback data" or "Data unavailable"
   badge instead of "Live".

## Where to change source URL

- Update `RAVI_JEWELLERS_URL` / `RAVI_URL` in:
  - `lib/gold/parseRaviJewellers.ts`
  - `lib/gold/getGoldPrice.ts`

## Main folders

- `app` - pages, API route, loading UI
- `components` - reusable homepage UI components (live board, price grid,
  calculator, source info, mouse glow)
- `lib/gold` - parser, service, and manual fallback source
- `types` - shared TypeScript types
