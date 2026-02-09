"use client";

import { useSetAtom } from "jotai";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { resetDraftAtom } from "@/lib/state/fineTuneDraft";

export function DashboardHeader() {
  const router = useRouter();
  const resetDraft = useSetAtom(resetDraftAtom);

  return (
    <header className="flex flex-col items-start justify-between gap-4 rounded-panel border bg-card px-6 py-5 sm:flex-row sm:items-center">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Fine-Tuning Jobs</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create new jobs and monitor model training progress.
        </p>
      </div>
      <Button
        size="lg"
        onClick={() => {
          resetDraft();
          router.push("/jobs/new/step-1");
        }}
      >
        <Plus className="mr-2 h-4 w-4" />
        New Fine-tuning Job
      </Button>
    </header>
  );
}
