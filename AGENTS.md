# AGENTS.md

## Purpose

This repo is a Next.js + TypeScript app for creating and viewing fine-tuning jobs via a provided API.

## Read Order

1. README.md
2. docs/spec.md
3. docs/architecture.md
4. docs/decisions/\* (if present)

## Commands (must keep working)

- Install: `npm i`
- Dev: `npm run dev`
- Build: `npm run build`
- Lint: `npm run lint` (if configured)
- Typecheck: `npm run typecheck` (recommended)

If adding tooling, wire it into package.json and ensure CI/local parity.

## Working Rules

- Keep changes small and incremental.
- Prefer TypeScript strictness over `any`.
- Do not introduce heavy dependencies unless they clearly reduce code.
- Always handle loading, error, and empty states for API calls.
- Form validation must be deterministic and testable (no hidden magic).

## API Rules

- All requests must include `x-api-key` from env.
- Base URL must be configurable via env.
- Add request/response types (generated or hand-written) and keep them in one place.

## Architecture Guidance

- Use a small client layer:
  - `src/lib/api.ts` (fetch wrapper + typed functions)
- Keep UI components reusable:
  - inputs/selects/form field wrappers
  - status pill / job row
- Prefer server components for layout + data prefetch if helpful, but do not overcomplicate.
- If using React Query, keep a single QueryClient provider at app root.

## Done Criteria

- Job creation form works end-to-end
- Jobs dashboard lists jobs + summary stats
- Validations match docs/spec.md
- Repo runs from clean clone with `.env` set

## If Something Is Ambiguous

- Prefer the OpenAPI schema as truth.
- Document assumptions in docs/architecture.md or a decision note.
