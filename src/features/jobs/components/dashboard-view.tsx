"use client";

import { LoaderCircle } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useJobsQuery } from "@/features/jobs/hooks";

import { DashboardHeader } from "./dashboard-header";
import { JobsTable } from "./jobs-table";
import { SummaryCards } from "./summary-cards";

export function DashboardView() {
  const jobsQuery = useJobsQuery();
  const data = jobsQuery.data;

  return (
    <div className="space-y-6">
      <DashboardHeader />

      {jobsQuery.isLoading ? (
        <Card>
          <CardContent className="flex items-center justify-center py-16 text-muted-foreground">
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            Loading jobs...
          </CardContent>
        </Card>
      ) : jobsQuery.isError ? (
        <Card>
          <CardContent className="py-16 text-center text-sm text-destructive">
            {(jobsQuery.error as Error).message || "Unable to load jobs"}
          </CardContent>
        </Card>
      ) : data ? (
        <>
          <SummaryCards summary={data.summary} />
          <JobsTable jobs={data.jobs} />
        </>
      ) : (
        <Card>
          <CardContent className="py-16 text-center text-sm text-muted-foreground">
            No data available.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
