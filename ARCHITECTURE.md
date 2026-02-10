# ARCHITECTURE.md

## Overview

The app is a single Next.js App Router project with a server-proxy boundary in front of the external fine-tuning API.

High-level layers:

1. UI routes/components (`src/app`, `src/features/jobs/components`)
2. Client data hooks (`src/features/jobs/hooks.ts`)
3. Internal API routes (`src/app/api/*`)
4. External adapter + normalization (`src/lib/api/server.ts`)

## Directory Map

- `src/app/*`
  - Route entrypoints and internal API handlers
- `src/features/jobs/*`
  - Job feature hooks and composed UI
- `src/lib/api/*`
  - Client and server API helpers
- `src/lib/schemas/*`
  - Zod validation schemas and inferred types
- `src/lib/state/*`
  - Jotai atoms for multi-step draft state
- `src/components/ui/*`
  - Shared UI primitives
- `src/providers/*`
  - App-level providers (React Query + Jotai store)

## Runtime Data Flow

### Dashboard (read path)

1. `src/app/page.tsx` renders `DashboardView`.
2. `DashboardView` uses `useJobsQuery()`.
3. Query calls `getJobs()` in `src/lib/api/client.ts`.
4. Client requests internal `GET /api/jobs`.
5. Route handler calls `fetchJobs()` in `src/lib/api/server.ts`.
6. External response is normalized to `JobsResponse` and returned.

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

Centralized in `src/lib/schemas/fineTune.ts`:

- Step 1: `jobName`, `baseModelId`
- Step 2: `trainingEpochs`, `evaluationEpochs`, `warmupEpochs`
- Step 3: `learningRate`
- Cross-field guards:
  - `evaluationEpochs <= trainingEpochs`
  - `warmupEpochs <= trainingEpochs`

## API Contract Strategy

External payload and response shapes may vary; adapter handles this in `src/lib/api/server.ts`:

- Read normalization:
  - Field alias handling for snake_case and camelCase
  - Derived summary fallback from job statuses
- Write mapping:
  - Internal payload -> external required keys (`name`, `baseModel`, `epochs`, etc.)
- Error mapping:
  - Non-2xx upstream responses throw `ExternalApiError`
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
- Add stronger OpenAPI-derived types once schema generation is introduced.

## Developer Tooling

- Prettier is the source of truth for code formatting via `.prettierrc.json`.
- ESLint is configured via `eslint.config.mjs` and runs non-interactively through `npm run lint`.
- Type checking runs via `npm run typecheck` (`tsc --noEmit`).
- Tests run via `npm run test` (Vitest).
- Run `npm run format` to apply formatting and `npm run format:check` to verify consistency.
- `.editorconfig` mirrors core whitespace/newline rules for editor alignment.
