"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { InputDescription } from "@/components/ui/input-description";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { NumberStepperInput } from "@/components/ui/number-stepper-input";
import { useRequireDraftFields } from "@/features/jobs/hooks/use-require-draft-fields";
import { APP_ROUTES } from "@/lib/constants/routes";
import { getFieldError } from "@/lib/forms";
import { step2Schema, type Step2Values } from "@/lib/schemas/fineTune";
import { setDraftAtom } from "@/lib/state/fineTuneDraft";
import { useSetAtom } from "jotai";

import { FlowLayout } from "./flow-layout";

export function Step2Form() {
  const router = useRouter();
  const draft = useRequireDraftFields({
    requiredFields: ["jobName", "baseModelId"]
  });
  const setDraft = useSetAtom(setDraftAtom);

  const form = useForm<Step2Values>({
    resolver: zodResolver(step2Schema),
    defaultValues: {
      trainingEpochs: draft.trainingEpochs ?? 5,
      evaluationEpochs: draft.evaluationEpochs ?? 1,
      warmupEpochs: draft.warmupEpochs ?? 1,
      learningRate: draft.learningRate ?? 0.0001
    }
  });

  const onSubmit = form.handleSubmit((values) => {
    setDraft(values);
    router.push(APP_ROUTES.jobsNewStep3);
  });

  const trainingError = getFieldError(form.formState.errors, "trainingEpochs");
  const evaluationError = getFieldError(form.formState.errors, "evaluationEpochs");
  const warmupError = getFieldError(form.formState.errors, "warmupEpochs");
  const learningRateError = getFieldError(form.formState.errors, "learningRate");

  const trainingEpochs = form.watch("trainingEpochs");
  const evaluationEpochs = form.watch("evaluationEpochs");
  const warmupEpochs = form.watch("warmupEpochs");

  function setEpoch(
    field: "trainingEpochs" | "evaluationEpochs" | "warmupEpochs",
    min: number,
    next: number
  ) {
    const current = Number(form.getValues(field) ?? 0);
    const resolved = Number.isNaN(next) ? current : next;
    form.setValue(field, Math.max(min, resolved), { shouldDirty: true, shouldValidate: true });
  }

  return (
    <FlowLayout
      currentStep={2}
      title="Configure your run"
      description="Adjust these parameters to control how your model learns, balances performance, and prevents overfitting during fine-tuning. See the docs for guidance on setting these parameters for optimal fine-tuning."
    >
      <form className="space-y-10" onSubmit={onSubmit} noValidate>
        <div className="grid gap-x-10 gap-y-8 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="trainingEpochs">Epochs</Label>
            <NumberStepperInput
              id="trainingEpochs"
              min={1}
              value={trainingEpochs ?? 1}
              onValueChange={(next) => setEpoch("trainingEpochs", 1, next)}
              decrementAriaLabel="Decrease epochs"
              incrementAriaLabel="Increase epochs"
            />
            <InputDescription>
              Number of times the model sees the full dataset during training
            </InputDescription>
            {trainingError ? <p className="text-sm text-destructive">{trainingError}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="evaluationEpochs">Evaluation Epochs</Label>
            <NumberStepperInput
              id="evaluationEpochs"
              min={0}
              value={evaluationEpochs ?? 0}
              onValueChange={(next) => setEpoch("evaluationEpochs", 0, next)}
              decrementAriaLabel="Decrease evaluation epochs"
              incrementAriaLabel="Increase evaluation epochs"
            />
            <InputDescription>How often the model is evaluated during training</InputDescription>
            {evaluationError ? <p className="text-sm text-destructive">{evaluationError}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="warmupEpochs">Warmup Epochs</Label>

            <NumberStepperInput
              id="warmupEpochs"
              min={0}
              value={warmupEpochs ?? 0}
              onValueChange={(next) => setEpoch("warmupEpochs", 0, next)}
              decrementAriaLabel="Decrease warmup epochs"
              incrementAriaLabel="Increase warmup epochs"
            />
            <InputDescription>
              Gradually increases the learning rate at the start of training
            </InputDescription>
            {warmupError ? <p className="text-sm text-destructive">{warmupError}</p> : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="learningRate">Learning rate</Label>
            <Input
              id="learningRate"
              type="number"
              min={0.000001}
              max={1}
              step="0.00001"
              {...form.register("learningRate", { valueAsNumber: true })}
            />
            <InputDescription>Controls how much the model updates during training</InputDescription>
            {learningRateError ? (
              <p className="text-sm text-destructive">{learningRateError}</p>
            ) : null}
          </div>
        </div>

        <div>
          <Button type="submit" size="lg">
            Next: Review
          </Button>
        </div>
      </form>
    </FlowLayout>
  );
}
