import { fetchJobs } from "@/lib/api/server";
import { PageShell } from "@/features/jobs/components/page-shell";
import { DashboardView } from "@/features/jobs/components/dashboard-view";
import type { JobsResponse } from "@/lib/types/jobs";

export default async function DashboardPage() {
  let jobsData: JobsResponse | undefined;
  try {
    jobsData = await fetchJobs();
  } catch {
    // Fall back to client-side query rendering if the RSC fetch fails.
    jobsData = undefined;
  }

  return (
    <PageShell>
      <DashboardView initialJobsData={jobsData} />
    </PageShell>
  );
}
