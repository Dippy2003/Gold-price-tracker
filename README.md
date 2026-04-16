# Sri Lanka Gold Price Tracker

A clean and beginner-friendly `Next.js 14` project with:

- App Router
- TypeScript
- Tailwind CSS
- Server-side fetching
- Local manual fallback data

## Install

```bash
npm install
```

## Run

```bash
npm run dev
```

Open `http://localhost:3000`.

## Data flow (simple)

1. Homepage (`app/page.tsx`) fetches from `/api/gold-price` on the server.
2. API route (`app/api/gold-price/route.ts`) calls `getGoldPrice()`.
3. Service (`lib/gold/getGoldPrice.ts`) tries live parsing from IdeaBeam.
4. Parser (`lib/gold/parseIdeaBeam.ts`) fetches and parses HTML with regex/string matching.
5. If parsing fails, fallback data is loaded from:
   - `lib/gold/manualGoldPrice.json`
   - `lib/gold/manualSource.ts`
6. UI still works and clearly shows fallback/manual note.

## Caching and refresh

- Route and upstream fetch use `revalidate = 1800` (30 minutes).
- This reduces unnecessary requests while keeping data reasonably fresh.

## Where to change source URL

- Update `IDEABEAM_URL` in:
  - `lib/gold/parseIdeaBeam.ts`
  - `lib/gold/getGoldPrice.ts` (for error metadata)

## Main folders

- `app` - pages, API route, loading UI
- `components` - reusable homepage UI components
- `lib/gold` - parser, service, and manual fallback source
- `types` - shared TypeScript types
