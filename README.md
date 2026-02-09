# Fine-Tuning Jobs UI MVP

Next.js App Router app for creating and monitoring AI fine-tuning jobs.

## What It Includes

- Dashboard with status summary (running/completed/failed) and job table
- Job deletion from the dashboard table with confirmation prompt
- 3-step fine-tuning job creation flow
- Centralized Zod validation with interdependent epoch rules
- Persisted multi-step draft state across navigation + refresh
- Server-side API proxy with `x-api-key` kept off the client

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- TanStack Query
- React Hook Form + Zod
- Jotai (`atomWithStorage`)

## Project Docs

- Agent workflow: `AGENTS.md`
- Architecture and data flow: `ARCHITECTURE.md`

## Routes

- `/` Dashboard
- `/jobs/new/step-1` Create flow step 1
- `/jobs/new/step-2` Create flow step 2
- `/jobs/new/step-3` Create flow step 3

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
npm run lint
npm run typecheck
```

## Implementation Notes

- External API shape normalization + payload mapping lives in `src/lib/api/server.ts`.
- Internal API routes are under `src/app/api/*`.
- Dashboard delete action uses internal `DELETE /api/jobs/[id]` so API keys stay server-side.
