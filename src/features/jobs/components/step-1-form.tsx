"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue, useSetAtom } from "jotai";
import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useModelsQuery } from "@/features/jobs/hooks";
import { step1Schema, type Step1Values } from "@/lib/schemas/fineTune";
import { fineTuneDraftAtom, setDraftAtom } from "@/lib/state/fineTuneDraft";

import { FlowLayout } from "./flow-layout";

export function Step1Form() {
  const router = useRouter();
  const draft = useAtomValue(fineTuneDraftAtom);
  const setDraft = useSetAtom(setDraftAtom);
  const modelsQuery = useModelsQuery();

  const form = useForm<Step1Values>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      jobName: draft.jobName ?? "",
      baseModelId: draft.baseModelId ?? ""
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    setDraft(values);
    router.push("/jobs/new/step-2");
  });

  const jobNameError =
    typeof form.formState.errors.jobName?.message === "string"
      ? form.formState.errors.jobName.message
      : null;
  const baseModelError =
    typeof form.formState.errors.baseModelId?.message === "string"
      ? form.formState.errors.baseModelId.message
      : null;

  return (
    <FlowLayout
      currentStep={1}
      title="Create Fine-Tuning Job"
      description="Start by naming your job and selecting a base model."
    >
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="jobName">Job name</Label>
          <Input id="jobName" placeholder="my-finetune-job" {...form.register("jobName")} />
          {jobNameError ? <p className="text-sm text-destructive">{jobNameError}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="baseModelId">Base model</Label>
          <select
            id="baseModelId"
            className="flex h-10 w-full rounded-lg border bg-card px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            {...form.register("baseModelId")}
          >
            <option value="">Select a model</option>
            {modelsQuery.data?.map((model) => (
              <option value={model.id} key={model.id}>
                {model.name}
              </option>
            ))}
          </select>
          {modelsQuery.isLoading ? (
            <p className="flex items-center text-sm text-muted-foreground">
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              Loading models...
            </p>
          ) : null}
          {modelsQuery.isError ? (
            <p className="text-sm text-destructive">Unable to load models.</p>
          ) : null}
          {baseModelError ? <p className="text-sm text-destructive">{baseModelError}</p> : null}
        </div>

        <div className="flex justify-end">
          <Button type="submit" size="lg" disabled={modelsQuery.isLoading}>
            Continue
          </Button>
        </div>
      </form>
    </FlowLayout>
  );
}
