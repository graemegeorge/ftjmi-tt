export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-start justify-center gap-6 px-6 py-12">
      <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-sky-700">
        Next.js Setup Complete
      </span>
      <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900">
        Fine-Tuning Jobs UI
      </h1>
      <p className="max-w-2xl text-lg text-slate-700">
        The project is now bootstrapped with Next.js, TypeScript, Tailwind, TanStack Query,
        React Hook Form, and Zod so implementation can proceed against the API spec.
      </p>
    </main>
  );
}
