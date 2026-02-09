# Fine-Tuning Jobs UI

A small Next.js + TypeScript application for creating and managing AI model fine-tuning jobs.

The app focuses on:

- Creating new fine-tuning jobs via a validated form
- Viewing existing jobs and their statuses
- Displaying summary statistics for running, completed, and failed jobs

This project is intentionally scoped to be completed within **3–4 hours**, prioritising core functionality and clarity over over-engineering.

---

## Tech Stack

**Required**

- Next.js (App Router)
- TypeScript

**Used**

- Tailwind CSS
- shadcn/ui
- React Hook Form + Zod (form state + validation)
- TanStack Query (API state management)

---

## Features

### Fine-Tuning Job Creation

- Job name validation (3–50 chars, alphanumeric + dashes)
- Base model selection (fetched from API)
- Training epochs
- Evaluation epochs (validated against training epochs)
- Warm-up epochs (validated against training epochs)
- Learning rate (0–1)
- Client-side validation + submit state handling

### Jobs Dashboard

- List all jobs
- Display job status (Running / Completed / Failed)
- Summary statistics
- Loading, error, and empty states

### API Integration

- Proxied API requests via Next.js route handlers
- API key kept server-side
- Typed API client layer

Optional (if time permits):

- Job deletion

---

## API Details

- **Base URL:** `https://fe-test-api-production-cb39.up.railway.app`
- **OpenAPI spec:**  
  https://fe-test-api-production-cb39.up.railway.app/api/openapi.json
- **Auth:** `x-api-key` header on all requests

> Tip: Paste the OpenAPI JSON into https://editor-next.swagger.io/ for easier inspection.

---

## Getting Started

### Prerequisites

- Node.js (recommended via `.nvmrc` or latest LTS)
- npm

### Install

```bash
npm install
```
