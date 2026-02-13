# Fine-Tuning Jobs UI MVP

Next.js App Router app for creating and monitoring AI fine-tuning jobs.

## What It Includes

- Dashboard with status summary (running/completed/failed) and job table
- Job deletion from the dashboard table with shadcn `AlertDialog` confirmation
- 3-step fine-tuning job creation flow
- Light/dark theming with system-default mode and global top-right theme toggle
- Centralized Zod validation with interdependent epoch rules
- Persisted multi-step draft state across navigation + refresh
- Hybrid data loading: dashboard initial data via React Server Component + React Query for client updates
- Server-side API proxy with `x-api-key` kept off the client

## Tech Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS v4 (CSS-first tokens)
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
npm run api:sync
npm run api:generate
npm run api:regen
npm run build
npm run start
npm run lint
npm run typecheck
npm run test
npm run test:watch
npm run format
npm run format:check
```

Recommended quality gate sequence:

```bash
npm run lint && npm run typecheck && npm run build && npm run test
```

## Testing

The test suite uses Vitest, Testing Library, and MSW.

- Schema tests: request validation contracts in `src/lib/schemas/*`
- Adapter tests: normalization and error mapping in `src/lib/api/server.ts`
- Route tests: `/api/jobs`, `/api/jobs/[id]`, and `/api/models` handler behavior
- Client API tests: error parsing, response schema validation, and `204` handling in `src/lib/api/client.ts`
- UI flow tests: create-flow guard/submission and jobs-table delete confirmation

## Implementation Notes

- External API shape normalization + payload mapping lives in `src/lib/api/server.ts`.
- OpenAPI source-of-truth is synced to `src/lib/api/generated/openapi.json`.
- Generated Zod/TypeScript contracts live in `src/lib/api/generated/openapi.zod.ts`.
- Runtime parsing boundaries:
  - Internal API payload parsing: `src/lib/api/contracts.ts`
  - External API payload parsing/mapping: `src/lib/api/contracts.external.ts`
- Upstream payloads failing generated-contract validation return `502` via internal API routes.
- Internal API routes are under `src/app/api/*`.
- Dashboard `src/app/page.tsx` performs initial server fetch through `fetchJobs()` and passes it as React Query `initialData` into `DashboardView` for a no-spinner first render plus client-side refetch.
- Dashboard delete action uses internal `DELETE /api/jobs/[id]` and confirms with shadcn `AlertDialog`, so API keys stay server-side.

## OpenAPI Contract Workflow

```bash
npm run api:regen
```

- `api:sync` fetches the live OpenAPI JSON from Railway.
- `api:generate` regenerates `openapi.zod.ts` from the synced spec.
- `api:regen` runs both and should be used whenever the API contract changes.
- `openapi.zod.ts` is gitignored and regenerated automatically via `predev`, `prebuild`, `pretypecheck`, and `pretest`.

## Design Tokens

Token layers live in `src/app/globals.css`:

- `--ref-*`: primitive design reference values (raw colors, radii, shadows)
- `--sys-*`: semantic runtime tokens used by the app theme
- `@theme inline`: Tailwind utility exports and compatibility aliases

Theme behavior:

- Dark mode is activated by a root `.dark` class
- Theme preference supports `light`, `dark`, and `system` (default)
- Preference persists in `localStorage` (`theme-preference`)
- A fixed top-right toggle is rendered globally from app providers

Core exported utilities include:

- Compatibility aliases: `background`, `foreground`, `card`, `muted`, `border`, `input`, `primary`, `destructive`, `destructive-foreground`
- Semantic status colors: `status-success|info|danger` and `status-*-bg`
- Shape/elevation: `rounded-chip|card|panel`, `shadow-panel|floating`
