# ARCHITECTURE.md

## Overview

The app is a single Next.js App Router project with a server-proxy boundary in front of the external fine-tuning API.

High-level layers:

1. UI routes/components (`src/app`, `src/features/jobs/components`)
2. Route-level server data fetch (`src/app/page.tsx` -> `src/lib/api/server.ts`)
3. Client data hooks (`src/features/jobs/hooks/index.ts`)
4. Internal API routes (`src/app/api/*`)
5. External adapter + normalization (`src/lib/api/server.ts`)

## Directory Map

- `src/app/*`
  - Route entrypoints and internal API handlers
- `src/features/jobs/*`
  - Job feature hooks and composed UI
- `src/lib/api/*`
  - Client and server API helpers
- `src/lib/api/generated/*`
  - Synced OpenAPI source and generated Zod/TS contracts
- `src/lib/schemas/*`
  - Zod request validation schemas and inferred types
- `src/lib/state/*`
  - Jotai atoms for multi-step draft state
- `src/components/ui/*`
  - Shared UI primitives
- `src/providers/*`
  - App-level providers (React Query + Jotai store)

## Runtime Data Flow

### Dashboard (read path)

1. `src/app/page.tsx` (React Server Component) calls `fetchJobs()` from `src/lib/api/server.ts`.
2. Server-normalized `JobsResponse` is passed to `DashboardView` as React Query `initialData`.
3. `DashboardView` uses `useJobsQuery({ initialData })` for immediate first paint without client loading spinner.
4. React Query still owns client refreshes/invalidation by calling `getJobs()` in `src/lib/api/client.ts`.
5. Client requests internal `GET /api/jobs`.
6. Route handler calls `fetchJobs()` in `src/lib/api/server.ts`.
7. External response is normalized to `JobsResponse` and returned.
8. Client wrapper `getJobs()` validates payload through parsers in `src/lib/api/contracts.ts` before returning data to React Query.

### Create Job (write path)

1. User progresses step 1 -> step 2 -> step 3 routes.
2. Each step validates via step-specific Zod schema.
3. Valid values are merged into persisted draft atom.
4. Step 3 submits via `useCreateJobMutation()`.
5. Mutation calls internal `POST /api/jobs`.
6. Route validates with `fineTuneSchema`, maps payload for API contract, forwards to external API.
7. On success, jobs query invalidates and draft resets.

### Delete Job (write path)

1. User clicks delete icon in `JobsTable` and confirms in shadcn `AlertDialog`.
2. Table triggers `useDeleteJobMutation()`.
3. Mutation calls internal `DELETE /api/jobs/[id]`.
4. Route forwards request through `deleteJob()` in `src/lib/api/server.ts`.
5. On success, jobs query invalidates and dashboard refreshes.

## Testing Strategy

The repo uses a risk-based test suite (Vitest + Testing Library + MSW):

- `src/lib/schemas/*.test.ts`: Zod validation and cross-field rules.
- `src/lib/api/*.test.ts`: Client/server adapter behavior and error handling.
- `src/app/api/**/*.test.ts`: Route-handler contract and status propagation.
- `src/features/jobs/components/*.test.tsx`: Core create-flow and delete-job UI interactions.

## State Management

- Store: Jotai with explicit root provider store in `src/providers/app-providers.tsx`.
- Draft atom: `fineTuneDraftAtom` persisted via `atomWithStorage` in localStorage.
- Actions:
  - `setDraftAtom` merges partial step values.
  - `resetDraftAtom` clears draft when starting new flow or after submit.

## Validation Model

Request validation is centralized in `src/lib/schemas/fineTune.ts`:

- Step 1: `jobName`, `baseModelId`
- Step 2: `trainingEpochs`, `evaluationEpochs`, `warmupEpochs`
- Step 3: `learningRate`
- Cross-field guards:
  - `evaluationEpochs <= trainingEpochs`
  - `warmupEpochs <= trainingEpochs`

Generated API contracts are sourced from OpenAPI:

- Synced spec: `src/lib/api/generated/openapi.json`
- Generated contracts: `src/lib/api/generated/openapi.zod.ts`
- Runtime boundaries/parsers:
  - `src/lib/api/contracts.ts` (internal route payloads used by client wrappers)
  - `src/lib/api/contracts.external.ts` (external API payloads used by server adapter)

## API Contract Strategy

External payload and response shapes are validated against generated contracts in `src/lib/api/server.ts`:

- Read normalization:
  - External responses are parsed through `src/lib/api/contracts.external.ts`
  - Contract mapping adapts external API fields into internal `JobsResponse`/`ModelOption[]` shapes
- Write mapping:
  - Internal payload -> external required keys (`name`, `baseModel`, `epochs`, etc.)
- Error mapping:
  - Non-2xx upstream responses throw `ExternalApiError`
  - Invalid upstream response contracts throw `ExternalApiError` with status `502`
  - Internal route forwards upstream status/payload where relevant

## Provider Topology

Root layout wraps app with `AppProviders`:

- `JotaiProvider` with explicit `createStore()` instance
- `QueryClientProvider` with shared query client

This avoids default-store ambiguity and keeps global state deterministic.

## Styling Tokens

The styling layer uses Tailwind v4 CSS-first tokens in `src/app/globals.css`:

- Primitive references: `--ref-*`
- Semantic runtime tokens: `--sys-*`
- Tailwind exports: `@theme inline`

Compatibility alias tokens preserve shadcn-style utility names (`background`, `foreground`, `card`, `muted`, `border`, `input`, `destructive-foreground`) while semantic utilities add status and elevation surfaces (`status-*`, `status-*-bg`, `rounded-chip/card/panel`, `shadow-panel/floating`).

## Non-Goals (Current MVP)

- Backend/database draft persistence
- Charts/advanced analytics visualization

## Extension Points

- Introduce shared form field components for richer consistency.
- Add a spec-patching layer before generation if upstream contract drift becomes frequent.

## OpenAPI Generation Workflow

1. `npm run api:sync` fetches the latest OpenAPI JSON to `src/lib/api/generated/openapi.json`.
2. `npm run api:generate` regenerates `src/lib/api/generated/openapi.zod.ts`.
3. `npm run api:regen` runs both commands when contract updates are needed.
4. `src/lib/api/generated/openapi.zod.ts` is gitignored and regenerated automatically via lifecycle scripts before dev/build/typecheck/test.

## Developer Tooling

- Prettier is the source of truth for code formatting via `.prettierrc.json`.
- ESLint is configured via `eslint.config.mjs` and runs non-interactively through `npm run lint`.
- Type checking runs via `npm run typecheck` (`tsc --noEmit`).
- Tests run via `npm run test` (Vitest).
- Run `npm run format` to apply formatting and `npm run format:check` to verify consistency.
- `.editorconfig` mirrors core whitespace/newline rules for editor alignment.
