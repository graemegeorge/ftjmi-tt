"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateJobMutation } from "@/features/jobs/hooks";
import { step3Schema, type Step3Values } from "@/lib/schemas/fineTune";
import { fineTuneDraftAtom, resetDraftAtom, setDraftAtom } from "@/lib/state/fineTuneDraft";

import { FlowLayout } from "./flow-layout";

export function Step3Form() {
  const router = useRouter();
  const draft = useAtomValue(fineTuneDraftAtom);
  const setDraft = useSetAtom(setDraftAtom);
  const resetDraft = useSetAtom(resetDraftAtom);
  const mutation = useCreateJobMutation();

  useEffect(() => {
    if (
      !draft.jobName ||
      !draft.baseModelId ||
      draft.trainingEpochs === undefined ||
      draft.evaluationEpochs === undefined ||
      draft.warmupEpochs === undefined
    ) {
      router.replace("/jobs/new/step-1");
    }
  }, [draft.baseModelId, draft.evaluationEpochs, draft.jobName, draft.trainingEpochs, draft.warmupEpochs, router]);

  const form = useForm<Step3Values>({
    resolver: zodResolver(step3Schema),
    defaultValues: {
      learningRate: draft.learningRate ?? 0.0001
    }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setDraft(values);

    try {
      await mutation.mutateAsync({
        jobName: draft.jobName ?? "",
        baseModelId: draft.baseModelId ?? "",
        trainingEpochs: draft.trainingEpochs ?? 0,
        evaluationEpochs: draft.evaluationEpochs ?? 0,
        warmupEpochs: draft.warmupEpochs ?? 0,
        learningRate: Number(values.learningRate)
      });
      toast.success("Fine-tuning job created");
      resetDraft();
      router.push("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create job");
    }
  });

  const learningRateError =
    typeof form.formState.errors.learningRate?.message === "string"
      ? form.formState.errors.learningRate.message
      : null;

  return (
    <FlowLayout currentStep={3} title="Review & Submit" description="Set learning rate and review your configuration before submitting.">
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="learningRate">Learning rate</Label>
          <Input
            id="learningRate"
            type="number"
            min={0.000001}
            max={1}
            step="0.0001"
            {...form.register("learningRate", { valueAsNumber: true })}
          />
          {learningRateError ? <p className="text-sm text-destructive">{learningRateError}</p> : null}
        </div>

        <Card className="bg-muted/40">
          <CardHeader>
            <CardTitle className="text-base">Job summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Job name:</span> {draft.jobName}
            </p>
            <p>
              <span className="text-muted-foreground">Base model:</span> {draft.baseModelId}
            </p>
            <p>
              <span className="text-muted-foreground">Training epochs:</span> {draft.trainingEpochs}
            </p>
            <p>
              <span className="text-muted-foreground">Evaluation epochs:</span> {draft.evaluationEpochs}
            </p>
            <p>
              <span className="text-muted-foreground">Warm-up epochs:</span> {draft.warmupEpochs}
            </p>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={() => router.push("/jobs/new/step-2")}>
            Back
          </Button>
          <Button type="submit" size="lg" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Create Job"}
          </Button>
        </div>
      </form>
    </FlowLayout>
  );
}
