I am starting a brand new repositiory which will house the codebase for a technical test for https://www.nscale.com/ an AI delivery platform technology company.

So, let's get this new project setup, I've got the github repo ready but I want you to know a few things first. You are an exceptional fullstack engineer with a specialist lean to the front end. You are an expert in React and NextJS, REST API design and have a wonderful eye for user experience. You use AI skills such as "Figma MCP server for Figma-driven implementation" and "Figma Implement Design" which you have avialbale to you as "Skills". You won't need to be overly creative since the designs have already been provided but worth considering your background in how you convert design to code. To help further you have the "frontend-design" skill also.

Here is the technical specifications:

```
## Project Overview
Build a streamlined interface for managing AI model fine-tuning jobs with a focus on creating new jobs and viewing existing ones.

IMPORTANT
We value your time and have designed this exercise to take no more than 3 - 4  hours. Focus on implementing the core requirements first, then add polish if time permits.

## Technical Requirements

### Required technologies (must use)

- Next.js: Implement the application using Next.js framework
- TypeScript: Ensure type safety with proper TypeScript implementation

### Features to Demonstrate (priority order)

#### Fine-Tuning Job Creation Form:

- Create a form for setting up new fine-tuning jobs
- Include fields for:
    - Job name (with validation for 3-50 chars, alphanumeric and dashes)
    - Base model selection (from available options)
    - Number of training epochs
    - Evaluation epochs (with validation against total epochs)
    - Warm-up epochs (with validation against total epochs)
    - Learning rate (between 0 and 1)
    - Implement state management for the form process

#### API Integration:

- Connect to the fine-tuning API endpoints:
    - GET /api/jobs - List all jobs with summary statistics
    - POST /api/jobs - Create a new job
    - GET /api/models - List available models for selection in form
- Optional:
    - DELETE functionality for jobs

#### Job Listing Dashboard:

- Display a list of all fine-tuning jobs
- Show key job details including status (Running, Completed, Failed)
- Display summary statistics (total completed, running, and failed jobs)
- Optional: Implement job deletion functionality

#### Our tech stack (optional)

- shadcn
- react query
- tailwind

#### API Information

- Base URL: https://fe-test-api-production-cb39.up.railway.app/
- API Documentation: https://fe-test-api-production-cb39.up.railway.app/api/openapi.json
- Authentication: Use the provided x-api-key for all requests
- Tip: You can view and explore the OpenAPI schema in a more user-friendly format by pasting the schema JSON into https://editor-next.swagger.io/

#### Key Skills to Demonstrate

- State Management: For form with interdependent field validations
- API Integration: Proper handling of asynchronous operations
- Form Validation: Ensuring data integrity according to the API requirements
- Response Handling: Managing loading, error, and success states
- Component Design: Creating reusable and maintainable UI components
- Styling: Implementing a clean, professional interface

#### Submission Guidelines

Submit your completed project either by:
- Sharing a link to a public GitHub repository, or
- Providing a zip file containing the complete project
```

So, along with the steps and parts we need to adhere to I been given a Figma file which you can find the url here: https://www.figma.com/design/8MfkpS3k9He5hoYJD1pffR/UI-flow--Copy-?node-id=0-1&t=Nav8jHN84Dm6EIdv-1

There appear to be 4 "screens" (or a dashboard and 3 flows as they've called them) that we need to create, we should asume these are routes by default, which we can later make modals if we like.

- Dashboard: https://www.figma.com/design/8MfkpS3k9He5hoYJD1pffR/UI-flow--Copy-?node-id=1-1694&t=Nav8jHN84Dm6EIdv-1
- "Flow 01": https://www.figma.com/design/8MfkpS3k9He5hoYJD1pffR/UI-flow--Copy-?node-id=1-1373&t=Nav8jHN84Dm6EIdv-1
- "Flow 02": https://www.figma.com/design/8MfkpS3k9He5hoYJD1pffR/UI-flow--Copy-?node-id=1-1459&t=Nav8jHN84Dm6EIdv-1
- "Flow 03": https://www.figma.com/design/8MfkpS3k9He5hoYJD1pffR/UI-flow--Copy-?node-id=1-1572&t=Nav8jHN84Dm6EIdv-1

The user journey:

From the looks of things we begin on the dashboard screen, user clicks "New Fine-tuning Job" button and is taken to "flow 01" which is the ifrst step of the form, next flow 2, next flow 3. Which means we need a way to retain state accross the flows. It should be persistent accross back browser button, and potentially on refresh (yeah why not). It should also reset cleanly at certain events, i.e. when a new request is made from the dashboard. I'm also considering a drafts system which we can derive from the state management, but let's leave this for later iterations.

I have been given 48 hours to complete but expected to spend only 3-4 hours so let's drill into the real MVP of this application. Given that's it's simple in nature, let's get the main flow completed with two production ready requirements:

- solid business logic (no tech debt!)
- solid design system (tailwind etc)

Let's avoid things like graphs, or other dependencies we may need later. Let's prioritise data, visuals and ux first. If you decide a feature such as the pie chart isn't a high priority please just add a basic placeholder with the name of what it should hold.

On state management, I know the usual choice is to reach for redux but I think it's far too much boilerplate code for a simple task, so let's look at other options. I enojoyed using Jotai a few years back, let's explore that or see if there's any new tech being used these days for small light state management.

With the forms, let's use zod and consider using react hook form but let's keep it close to latest react and react server component patterns. Let's make use of `use` hook for hanlding client side promise based logic.

Any other questions, feel free to ask. Other wise let's get this kicked off with a big iteration. I want to see the basics set up so we can continue to iterate.
