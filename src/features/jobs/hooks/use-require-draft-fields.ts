"use client";

import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { APP_ROUTES } from "@/lib/constants/routes";
import type { FineTuneDraft } from "@/lib/state/fineTuneDraft";
import { fineTuneDraftAtom } from "@/lib/state/fineTuneDraft";

type DraftField = Extract<keyof FineTuneDraft, string>;

interface UseRequireDraftFieldsOptions {
  requiredFields: DraftField[];
  disabled?: boolean;
}

export function useRequireDraftFields({ requiredFields, disabled = false }: UseRequireDraftFieldsOptions) {
  const router = useRouter();
  const draft = useAtomValue(fineTuneDraftAtom);

  useEffect(() => {
    if (disabled) return;

    const missingRequiredField = requiredFields.some((field) => draft[field] === undefined || draft[field] === "");

    if (missingRequiredField) {
      router.replace(APP_ROUTES.jobsNewStep1);
    }
  }, [disabled, draft, requiredFields, router]);

  return draft;
}
