# Fine-tuning Jobs UI — Spec

## Goal

Build a streamlined interface for managing AI model fine-tuning jobs with a focus on:

1. Creating new jobs
2. Viewing existing jobs

Timebox: 3–4 hours. Prioritise core requirements, then polish.

## Required Tech

- Next.js
- TypeScript

Optional (nice-to-have)

- Tailwind
- shadcn/ui
- React Query (TanStack Query)

## API

- Base URL: https://fe-test-api-production-cb39.up.railway.app/
- OpenAPI: https://fe-test-api-production-cb39.up.railway.app/api/openapi.json
- Auth: include `x-api-key` header on all requests

Endpoints

- GET `/api/jobs` — list all jobs with summary stats
- POST `/api/jobs` — create a new job
- GET `/api/models` — list available models for selection
  Optional:
- DELETE job endpoint if available in OpenAPI

## Primary User Flows

### 1) Create a Fine-tuning Job

User fills a form and submits.
App:

- loads available base models from `/api/models`
- validates inputs (client-side)
- POSTs to `/api/jobs`
- handles loading + error + success
- on success: job appears in listing, form resets or navigates to dashboard

### 2) View Jobs Dashboard

User sees:

- summary stats: total completed / running / failed
- list of jobs with status and key details
  Optional:
- delete a job (with confirmation)

## Form Fields & Validation

### Job name

- required
- 3–50 chars
- alphanumeric and dashes only
- suggested regex: `^[a-zA-Z0-9-]{3,50}$`

### Base model

- required
- must be one of models returned from `/api/models`

### Training epochs

- required
- integer > 0

### Evaluation epochs

- required
- integer >= 0
- must be <= training epochs

### Warm-up epochs

- required
- integer >= 0
- must be <= training epochs

### Learning rate

- required
- number between 0 and 1 (inclusive)

Interdependent validation rules:

- if `evaluationEpochs > trainingEpochs` => error
- if `warmupEpochs > trainingEpochs` => error
- prefer validating on change + on submit

## UI Requirements

- clean, professional layout
- clear loading / error / empty states
- prevent double-submit
- basic accessibility: labels, inline errors, disabled states

## Non-goals (timebox)

- auth UI (only header-based key)
- complex routing, job detail views, etc (unless time permits)
