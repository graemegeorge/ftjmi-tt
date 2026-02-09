"use client";

import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";

import type { FineTuneValues } from "@/lib/schemas/fineTune";

export type FineTuneDraft = Partial<FineTuneValues>;

const storage = createJSONStorage<FineTuneDraft>(() => localStorage);
const initialDraft: FineTuneDraft = {};

export const fineTuneDraftAtom = atomWithStorage<FineTuneDraft>("fine-tune-draft", initialDraft, storage);

export const setDraftAtom = atom(null, (get, set, payload: FineTuneDraft) => {
  set(fineTuneDraftAtom, { ...get(fineTuneDraftAtom), ...payload });
});

export const resetDraftAtom = atom(null, (_get, set) => {
  set(fineTuneDraftAtom, initialDraft);
});
