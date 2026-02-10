"use client";

import { LoaderCircle } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useJobsQuery } from "@/features/jobs/hooks";

import { DashboardHeader } from "./dashboard-header";
import { JobsTable } from "./jobs-table";
import { SummaryCard } from "./summary-card";

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
        <div className="flex gap-4 flex-col md:flex-row">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Fine-tuning usage</CardTitle>
              <CardDescription>Card description</CardDescription>
            </CardHeader>

            <CardContent>
              <SummaryCard summary={data.summary} />
            </CardContent>

            <CardContent>
              <JobsTable jobs={data.jobs} />
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Get started</CardTitle>
            </CardHeader>
          </Card>
        </div>
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
