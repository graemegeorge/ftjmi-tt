"use client";

import Link from "next/link";
import { LoaderCircle, Wrench } from "lucide-react";
import { useSetAtom } from "jotai";

import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useJobsQuery } from "@/features/jobs/hooks";
import { APP_ROUTES } from "@/lib/constants/routes";
import { resetDraftAtom } from "@/lib/state/fineTuneDraft";

import { DashboardHeader } from "./dashboard-header";
import { JobsTable } from "./jobs-table";
import { SummaryCard } from "./summary-card";

export function DashboardView() {
  const jobsQuery = useJobsQuery();
  const data = jobsQuery.data;
  const resetDraft = useSetAtom(resetDraftAtom);

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
        <div className="flex gap-4 flex-col lg:flex-row">
          <Card className="flex-1">
              <CardHeader>
                <CardTitle>Fine-tuning usage</CardTitle>
                <CardDescription>Current status and recent fine-tuning jobs.</CardDescription>
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
              <CardTitle>Get Started</CardTitle>
            </CardHeader>

            <CardContent>
              <Card orientation="horizontal" className="flex-1">
                <CardHeader bg="muted" className="items-center justify-center border-r p-6">
                  <div className="rounded-3xl p-6">
                    <Wrench
                      className="h-20 w-20 text-primary"
                      color="rgb(var(--sys-brand-accent))"
                    />
                  </div>
                </CardHeader>

                <CardContent className="flex flex-1 flex-col justify-center gap-4 p-6 sm:p-8">
                  <CardHeader className="space-y-2 p-0">
                    <CardTitle>Get started with Fine-tuning</CardTitle>
                    <CardDescription>
                      Simple, ready-to-use inference endpoints that are paid for per request. No
                      commitments, only pay for what you use with Nscale Serverless.
                    </CardDescription>
                  </CardHeader>

                  <div>
                    <Link
                      href={APP_ROUTES.jobsNewStep1}
                      className={buttonVariants({ size: "lg" })}
                      onClick={() => resetDraft()}
                    >
                      New Fine-tuning Job
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
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
