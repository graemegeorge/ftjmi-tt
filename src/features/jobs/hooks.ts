"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { deleteJob, getJobs, getModels, postJob } from "@/lib/api/client";
import type { CreateJobPayload } from "@/lib/types/jobs";

export const JOBS_QUERY_KEY = ["jobs"] as const;
export const MODELS_QUERY_KEY = ["models"] as const;

export function useJobsQuery() {
  return useQuery({
    queryKey: JOBS_QUERY_KEY,
    queryFn: getJobs
  });
}

export function useModelsQuery() {
  return useQuery({
    queryKey: MODELS_QUERY_KEY,
    queryFn: getModels
  });
}

export function useCreateJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateJobPayload) => postJob(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    }
  });
}

export function useDeleteJobMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string) => deleteJob(jobId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
    }
  });
}
