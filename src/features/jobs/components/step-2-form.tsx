"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useAtomValue, useSetAtom } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { step2Schema, type Step2Values } from "@/lib/schemas/fineTune";
import { fineTuneDraftAtom, setDraftAtom } from "@/lib/state/fineTuneDraft";

import { FlowLayout } from "./flow-layout";

export function Step2Form() {
  const router = useRouter();
  const draft = useAtomValue(fineTuneDraftAtom);
  const setDraft = useSetAtom(setDraftAtom);

  useEffect(() => {
    if (!draft.jobName || !draft.baseModelId) {
      router.replace("/jobs/new/step-1");
    }
  }, [draft.baseModelId, draft.jobName, router]);

  const form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      trainingEpochs: draft.trainingEpochs ?? 5,
      evaluationEpochs: draft.evaluationEpochs ?? 1,
      warmupEpochs: draft.warmupEpochs ?? 1
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    setDraft(values);
    router.push("/jobs/new/step-3");
  });

  const trainingError =
    typeof form.formState.errors.trainingEpochs?.message === "string"
      ? form.formState.errors.trainingEpochs.message
      : null;
  const evaluationError =
    typeof form.formState.errors.evaluationEpochs?.message === "string"
      ? form.formState.errors.evaluationEpochs.message
      : null;
  const warmupError =
    typeof form.formState.errors.warmupEpochs?.message === "string" ? form.formState.errors.warmupEpochs.message : null;

  return (
    <FlowLayout currentStep={2} title="Training Configuration" description="Set epoch values for training, evaluation, and warm-up.">
      <form className="space-y-5" onSubmit={onSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="trainingEpochs">Training epochs</Label>
          <Input id="trainingEpochs" type="number" min={1} {...form.register("trainingEpochs", { valueAsNumber: true })} />
          {trainingError ? <p className="text-sm text-destructive">{trainingError}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="evaluationEpochs">Evaluation epochs</Label>
          <Input
            id="evaluationEpochs"
            type="number"
            min={0}
            {...form.register("evaluationEpochs", { valueAsNumber: true })}
          />
          {evaluationError ? <p className="text-sm text-destructive">{evaluationError}</p> : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="warmupEpochs">Warm-up epochs</Label>
          <Input id="warmupEpochs" type="number" min={0} {...form.register("warmupEpochs", { valueAsNumber: true })} />
          {warmupError ? <p className="text-sm text-destructive">{warmupError}</p> : null}
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={() => router.push("/jobs/new/step-1")}>
            Back
          </Button>
          <Button type="submit" size="lg">
            Continue
          </Button>
        </div>
      </form>
    </FlowLayout>
  );
}
