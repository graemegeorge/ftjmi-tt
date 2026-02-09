# Fine-Tuning Jobs UI MVP

Next.js App Router app for creating and monitoring AI fine-tuning jobs.

## Tech stack

- Next.js (App Router) + TypeScript
- Tailwind CSS + shadcn-style UI primitives
- TanStack Query (server state)
- React Hook Form + Zod (single validation source)
- Jotai (`atomWithStorage`) for multi-step form persistence

## Features

- Dashboard with:
  - Summary stats (running/completed/failed)
  - Job table with statuses
- 3-step create flow across routes:
  - Step 1: job name + base model
  - Step 2: epoch config with interdependent validation
  - Step 3: learning rate + review + submit
- Draft persistence:
  - Survives route navigation and browser refresh
  - Resets when starting a new job from dashboard
- Server-side API proxy:
  - Calls external API from Next route handlers
  - `x-api-key` never exposed to browser code

## Environment

Create `.env.local`:

```bash
FINE_TUNE_API_BASE_URL="https://fe-test-api-production-cb39.up.railway.app"
FINE_TUNE_API_KEY="YOUR_API_KEY"
```

## Run

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run typecheck
```

## Notes

- External API response shape is normalized in `/src/lib/api/server.ts`.
- Optional job deletion is intentionally out of MVP scope.
- Figma MCP parity pass is pending network/MCP availability in this environment.
