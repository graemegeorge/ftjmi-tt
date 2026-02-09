# AGENTS.md

## Purpose

This repository contains a Next.js App Router MVP for managing fine-tuning jobs:

- Dashboard with status summary + job table
- 3-step job creation flow
- Server-side API proxying with `x-api-key`

Use this file as the quick operating guide for coding agents.

## Stack

- Next.js 15 (App Router)
- TypeScript (strict)
- Tailwind CSS
- TanStack Query
- React Hook Form + Zod
- Jotai (persisted draft state)

## Runbook

- Install: `npm install`
- Dev: `npm run dev`
- Build: `npm run build`
- Type check gate: `npm run typecheck`

Required env in `.env.local`:

- `FINE_TUNE_API_BASE_URL`
- `FINE_TUNE_API_KEY`

## Source of Truth Modules

- External API adapter + normalization:
  - `src/lib/api/server.ts`
- Internal client API wrappers:
  - `src/lib/api/client.ts`
- Validation schemas:
  - `src/lib/schemas/fineTune.ts`
- Draft state atoms:
  - `src/lib/state/fineTuneDraft.ts`
- Query hooks:
  - `src/features/jobs/hooks.ts`

## Routing

- Dashboard: `/` (`src/app/page.tsx`)
- Create flow step 1: `/jobs/new/step-1`
- Create flow step 2: `/jobs/new/step-2`
- Create flow step 3: `/jobs/new/step-3`

## API Boundary Rules

- Browser components must call internal routes only:
  - `GET /api/jobs`
  - `POST /api/jobs`
  - `GET /api/models`
- Never call external Railway API directly from client components.
- Keep `x-api-key` usage server-only in `src/lib/api/server.ts`.

## Form + State Rules

- Keep all field validation in Zod schemas (`src/lib/schemas/fineTune.ts`).
- Avoid duplicating business validation logic in components.
- Multi-step draft persists via Jotai `atomWithStorage`.
- Starting a new flow from dashboard must reset the draft.

## UI Conventions

- Reuse primitives from `src/components/ui/*`.
- Keep feature-specific UI inside `src/features/jobs/components/*`.
- Prefer extending existing components over introducing new UI patterns.

## Error Handling Conventions

- Preserve upstream API status codes where possible.
- For upstream non-2xx responses, route handlers should return API payload + status.
- Use concise user-facing toasts/messages for mutation failures.

## Scope Guardrails

- Optional delete-job support is currently out of scope.
- Do not add backend/database draft persistence unless explicitly requested.
- Prioritize clean business logic and maintainability over extra UI effects.

## Change Checklist (for agents)

1. Update or add Zod schema if behavior changes.
2. Verify internal API route contract is still stable.
3. Run `npm run build` before handing off.
4. Update `README.md` + `ARCHITECTURE.md` when structure or behavior changes.
