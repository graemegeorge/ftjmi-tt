"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { FormEvent } from "react";
import type { ReactNode } from "react";
import { toast } from "sonner";
import { useSetAtom } from "jotai";
import { MessageSquare, Settings, Wrench } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { InputDescription } from "@/components/ui/input-description";
import { useCreateJobMutation } from "@/features/jobs/hooks";
import { useRequireDraftFields } from "@/features/jobs/hooks/use-require-draft-fields";
import { APP_ROUTES } from "@/lib/constants/routes";
import { resetDraftAtom } from "@/lib/state/fineTuneDraft";

import { FlowLayout } from "./flow-layout";

export function Step3Form() {
  const router = useRouter();
  const resetDraft = useSetAtom(resetDraftAtom);
  const mutation = useCreateJobMutation();
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  const draft = useRequireDraftFields({
    requiredFields: [
      "jobName",
      "baseModelId",
      "trainingEpochs",
      "evaluationEpochs",
      "warmupEpochs",
      "learningRate"
    ],
    disabled: submittedSuccessfully
  });

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await mutation.mutateAsync({
        jobName: draft.jobName ?? "",
        baseModelId: draft.baseModelId ?? "",
        trainingEpochs: draft.trainingEpochs ?? 0,
        evaluationEpochs: draft.evaluationEpochs ?? 0,
        warmupEpochs: draft.warmupEpochs ?? 0,
        learningRate: draft.learningRate ?? 0
      });
      setSubmittedSuccessfully(true);
      toast.success("Fine-tuning job created");
      resetDraft();
      router.replace(APP_ROUTES.dashboard);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to create job");
    }
  }

  return (
    <FlowLayout currentStep={3} title="Review your job">
      <form className="space-y-4" onSubmit={onSubmit} noValidate>
        <ReviewItem icon={Wrench} title={draft.jobName ?? ""} />

        <ReviewItem icon={MessageSquare} title="Model">
          <InputDescription>{draft.baseModelId}</InputDescription>
        </ReviewItem>

        <ReviewItem icon={Settings} title="Configuration">
          <InputDescription>
            Epochs: {draft.trainingEpochs} • Eval Epochs: {draft.evaluationEpochs} • Warmup Epochs:{" "}
            {draft.warmupEpochs} • Learning rate: {draft.learningRate}
          </InputDescription>
        </ReviewItem>

        <div>
          <Button type="submit" size="lg" className="w-full sm:w-72" disabled={mutation.isPending}>
            {mutation.isPending ? "Submitting..." : "Start fine-tuning"}
          </Button>
        </div>
      </form>
    </FlowLayout>
  );
}

interface ReviewItemProps {
  icon: LucideIcon;
  title: string;
  children?: ReactNode;
}

function ReviewItem({ icon: Icon, title, children }: ReviewItemProps) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-input bg-card p-5">
      <Icon className="h-7 w-7 shrink-0 text-foreground" />
      <div className="space-y-1">
        <p className="text-xl font-semibold tracking-tight">{title}</p>
        {children}
      </div>
    </div>
  );
}
